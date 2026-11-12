// Sculpts the avatar parts as signed-distance fields, meshes them with surface nets,
// bakes ambient occlusion, and writes compact binary-in-JSON for the page.
const fs = require('fs'), path = require('path');
const len = Math.hypot;
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const smax = (a, b, k) => -smin(-a, -b, k);
const sph = (p, c, r) => len(p[0] - c[0], p[1] - c[1], p[2] - c[2]) - r;
function ell(p, c, r) {
  const x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2];
  const k0 = len(x / r[0], y / r[1], z / r[2]);
  if (k0 < 1e-9) return -Math.min(r[0], r[1], r[2]);
  const k1 = len(x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2]));
  return k0 * (k0 - 1) / k1;
}
function cone(p, a, b, r1, r2) {
  const pax = p[0] - a[0], pay = p[1] - a[1], paz = p[2] - a[2], bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
  return len(pax - bax * h, pay - bay * h, paz - baz * h) - (r1 + (r2 - r1) * h);
}
const capS = (p, a, b, r) => cone(p, a, b, r, r);
const mir = p => [Math.abs(p[0]), p[1], p[2]];

/* ---------------- head (head-local units, before the 1.26 scale) ---------------- */
/* the mouth: an open smile whose corners come to a point. mouthTop = the upper lip's edge, mouthH = half the opening's
   height at x, mouth2 = true distance to its outline (negative inside), measured against the outline as a polyline */
const MW = .068, MH = .0205, clampX = x => Math.max(-MW, Math.min(MW, x));
const mouthTop = x => { const t = clampX(x); return .087 + 1.9 * t * t; };
const mouthH = x => { const u = clampX(x) / MW; return MH * (1 - u * u); };
const MSEG = (() => { const top = [], bot = [], n = 28; for (let i = 0; i <= n; i++) { const x = MW * i / n; top.push([x, mouthTop(x)]); bot.push([x, mouthTop(x) - 2 * mouthH(x)]); } const s = []; for (let i = 0; i < n; i++) { s.push([top[i], top[i + 1]], [bot[i], bot[i + 1]]); } return s; })();
function mouth2(p) {
  const x = Math.abs(p[0]), y = p[1];
  const bx = Math.max(0, x - MW), by = Math.max(0, .045 - y, y - .097), far = len(bx, by);
  if (far > .03) return far;                                                // well away from it: a lower bound is enough
  let d = 1e9;
  for (const [a, b] of MSEG) { const ex = b[0] - a[0], ey = b[1] - a[1], h = Math.max(0, Math.min(1, ((x - a[0]) * ex + (y - a[1]) * ey) / (ex * ex + ey * ey))); d = Math.min(d, len(x - a[0] - ex * h, y - a[1] - ey * h)); }
  const hh = mouthH(x);
  return x < MW && Math.abs(y - (mouthTop(x) - hh)) < hh ? -d : d;
}
/* the upper teeth: a band hanging from the upper lip that stops short of the corners, its lower edge a soft arc */
const TW = .056, TH = .025;
function teeth2(p) {
  const x = Math.abs(p[0]), u = Math.min(1, x / TW), low = mouthTop(x) - TH * Math.pow(1 - u * u, .62);
  return Math.max((low - p[1]) * .8, x - TW);
}
function fHeadBase(p) {
  const q = mir(p);
  let d = ell(p, [0, .168, -.004], [.17, .187, .178]);                      // round, generous skull
  d = smin(d, ell(p, [0, .074, .022], [.143, .108, .136]), .055);          // full jaw
  d = smin(d, sph(p, [0, -.006, .076], .05), .05);                         // soft chin
  d = smin(d, sph(q, [.085, .098, .1], .05), .045);                        // round cheeks
  d = smin(d, sph(p, [0, .13, .187], .0265), .016);                        // button nose
  d = smin(d, capS(p, [0, .176, .164], [0, .142, .18], .012), .02);        // a soft bridge
  let ear = ell(q, [.181, .146, -.008], [.02, .05, .036]);                 // big ears, slightly cupped
  ear = smax(ear, -ell(q, [.197, .146, .005], [.014, .034, .022]), .008);
  d = smin(d, ear, .012);
  d = smax(d, -sph(q, [.07, .168, .204], .032), .03);                      // barely-there eye dents
  d = smin(d, capS(p, [0, .02, -.012], [0, -.09, -.018], .041), .03);      // thin neck
  return d;
}
function fHead(p) {
  return smax(fHeadBase(p), -Math.max(mouth2(p), .13 - p[2]), .006);
}
const fTeeth = p => Math.max(smax(smax(mouth2(p) - .003, teeth2(p), .003), fHeadBase(p) + .0085, .004), .15 - p[2]);   // set back behind the lips, edges softened
function fBeard(p) {
  const q = mir(p), h = fHead(p);
  let R = Math.max(ell(p, [0, .02, .02], [.2, .115, .19]), p[1] - (.064 + 3 * q[0] * q[0]));   // soft cheek line
  R = Math.max(R, Math.min(-.02 - p[1], .046 - p[2]));                      // not on the neck
  R = smin(R, capS(q, [.15, .12, .034], [.16, .2, .03], .03), .015);     // sideburns, up into the hair
  let d = Math.max(h - .0075, R);
  d = Math.max(d, -(h + .012));
  d = smax(d, -Math.max(mouth2(p) - .0075, .1 - p[2]), .008);               // clear of the mouth
  return smin(d, Math.max(capS(q, [0, .1085, .186], [.052, .1, .166], .0105), -(h + .01)), .006);   // a soft, rounded moustache
}
function fBrows(p) {
  const q = mir(p);   // short, thick, arched: friendly
  return smin(capS(q, [.044, .2395, .165], [.068, .2425, .158], .0136), capS(q, [.068, .2425, .158], [.091, .236, .148], .0136), .006);
}
/* a lock of hair: a tapered, pointed cone flattened against the head like a leaf */
const FLAT = .75;
function lock(p, a, m, b, r) {
  const cx = m[0], cy = m[1] - .168, cz = m[2] + .004, l = len(cx, cy, cz), n = [cx / l, cy / l, cz / l];
  const st = v => { const t = (v[0] - m[0]) * n[0] + (v[1] - m[1]) * n[1] + (v[2] - m[2]) * n[2]; return [v[0] + FLAT * t * n[0], v[1] + FLAT * t * n[1], v[2] + FLAT * t * n[2]]; };
  const q = st(p), a2 = st(a), b2 = st(b);
  return smin(cone(q, a2, m, r, r * .86), cone(q, m, b2, r * .86, r * .2), .008) / (1 + FLAT);
}
function fTufts(p) {
  const q = mir(p), h = fHead(p);
  let R = Math.max(ell(p, [0, .13, -.1], [.21, .12, .132]), p[2] - .045);
  R = Math.min(R, Math.max(.172 - p[1], p[2] - .072 + .2 * Math.max(0, .23 - p[1]), p[1] - .34));   // above the ear, up under the cap
  let d = Math.max(h - .016, R);
  d = Math.max(d, -(h + .02));
  const L = [
    [[.168, .24, .04], [.188, .196, .058], [.178, .146, .074], .03],       // in front of the ear
    [[.176, .246, -.01], [.214, .206, -.045], [.244, .15, -.085], .035],   // over the ear, flicking back
    [[.15, .215, -.085], [.196, .155, -.112], [.224, .105, -.118], .037],    // behind the ear
    [[.085, .19, -.15], [.115, .115, -.184], [.145, .058, -.19], .04],
    [[.03, .18, -.172], [.04, .105, -.198], [.05, .048, -.204], .04],    // nape
  ];
  const T = [   // the tuft out of the cap's opening, swept to one side, clear of the brows
    [[-.06, .336, .1], [.015, .334, .137], [.112, .306, .128], .036],
    [[-.065, .316, .112], [0, .308, .152], [.098, .284, .14], .035],
    [[-.03, .348, .088], [.055, .35, .116], [.152, .326, .082], .031],
    [[-.07, .302, .122], [-.03, .29, .152], [.032, .276, .157], .026],
    [[-.03, .332, .108], [-.09, .318, .128], [-.144, .288, .11], .029],
  ];
  let k = 1e9; for (const [a, m, b, r] of L) k = smin(k, lock(q, a, m, b, r), .004);
  for (const [a, m, b, r] of T) k = smin(k, lock(p, a, m, b, r), .004);
  const c = toCap(p);
  k = Math.min(k, Math.max(crownP(p, c) + .006, ARCH(c) - .004, -(h + .002)));   // hair filling the opening
  return smin(d, k, .006);
}
const fHair = p => Math.min(fBeard(p), fTufts(p));

/* trucker cap worn backwards: it hugs the skull, the rim sits high on the forehead and the snap opening lets the hair out */
const CAP_O = [0, .252, .004], CAP_A = .3, ca = Math.cos(CAP_A), sa = Math.sin(CAP_A);
const toCap = p => { const y = p[1] - CAP_O[1], z = -p[2] - CAP_O[2]; return [-p[0], y * ca + z * sa, -y * sa + z * ca]; };
const fromCap = c => { const y = c[1] * ca - c[2] * sa, z = c[1] * sa + c[2] * ca; return [-c[0], y + CAP_O[1], -(z + CAP_O[2])]; };
function crownP(p, c) {
  let d = ell(p, [0, .172, -.004], [.185, .2, .193]);
  d = smin(d, ell(p, [0, .236, -.022], [.176, .188, .182]), .04);
  return smax(d, -c[1], .008);
}
const crownC = c => crownP(fromCap(c), c);
const surfZ = (x, y) => { let z = .4; while (z > 0 && crownC([x, y, z]) > 0) z -= .001; return z; };
const ARCH = c => Math.max((len(c[0] / .09, c[1] / .072) - 1) * .072, c[2] + .07);
const surfZn = (x, y) => { let z = -.4; while (z < 0 && crownC([x, y, z]) > 0) z += .001; return z; };
const STRAP = [-.1, -.05, 0, .05, .1].map(x => [x, .012, surfZn(x, .012) + .004]);
const SPLIT = .022;
const fCapFront = p => { const c = toCap(p); return Math.max(crownP(p, c) - .003, SPLIT - c[2]); };
const fCapBack = p => { const c = toCap(p); let d = smax(Math.max(crownP(p, c), c[2] - SPLIT + .002), -ARCH(c), .006); for (let i = 0; i < 4; i++) d = Math.min(d, capS(c, STRAP[i], STRAP[i + 1], .0085)); return d; };
const BRIM_Z = surfZ(0, .004) - .04;
function fBrim(p) {
  const c = toCap(p), x = c[0], z = c[2] - BRIM_Z;
  const y = c[1] - (.006 - 1.45 * x * x - .1 * Math.max(0, c[2] - BRIM_Z - .03));
  const e = (len(x / .16, z / .168) - 1) * .16;
  let d = Math.max(e, Math.abs(y) - .0055);
  d = Math.max(d, BRIM_Z - .04 - c[2]);
  return d - .0045;
}
const ROPE = [0, .052, .1, .14].map(x => { const y = .011 - .18 * x * x; return [x, y, surfZ(x, y) + .007]; });
function fRope(p) {
  const q = mir(toCap(p));
  return Math.min(capS(q, ROPE[0], ROPE[1], .006), capS(q, ROPE[1], ROPE[2], .006), capS(q, ROPE[2], ROPE[3], .006));
}
const fHeadAll = p => Math.min(fHead(p), fHair(p), fBrows(p), fCapFront(p), fCapBack(p), fBrim(p), fTeeth(p));
/* a little colour in the skin: lips, nose tip, cheeks and ears */
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function skinTint(p) {
  const q = mir(p), mix = (c, t, w) => [c[0] + (t[0] - c[0]) * w, c[1] + (t[1] - c[1]) * w, c[2] + (t[2] - c[2]) * w];
  let c = [1, 1, 1];
  c = mix(c, [1, .8, .78], .85 * (1 - sstep(.02, .062, len(q[0] - .09, q[1] - .1, q[2] - .112))));
  c = mix(c, [1, .76, .74], .85 * (1 - sstep(.012, .04, len(p[0], p[1] - .13, p[2] - .2))));
  c = mix(c, [1, .84, .82], .7 * (1 - sstep(.012, .045, len(q[0] - .185, q[1] - .146, q[2]))));
  if (p[2] > .1) {
    const m = mouth2(p);
    c = mix(c, [.95, .68, .68], .8 * (1 - sstep(.0005, .0055, m)));         // lips
    if (m < .003) c = mix(c, [.2, .07, .07], sstep(.004, .011, -fHeadBase(p)));   // and the inside of the mouth is dark
  }
  return c;
}

/* ---------------- tee (torso-local) ---------------- */
function fTee(p) {
  const q = mir(p);
  let d = ell(p, [0, .39, 0], [.236, .17, .158]);
  d = smin(d, ell(p, [0, .2, .008], [.214, .212, .152]), .08);
  d = smin(d, capS(q, [0, .5, -.005], [.2, .494, -.005], .082), .06);
  d = smin(d, ell(p, [0, .515, -.004], [.13, .05, .1]), .05);               // slope up to the collar
  d = smax(d, -(p[1] + .04), .006);
  const yc = .548 - .2 * p[2];                                              // collar line, a little lower in front
  d = smax(d, p[1] - yc - .004, .01);
  d = smax(d, -(Math.max(len(p[0] / .09, (p[2] - .004) / .078) - 1, .44 - p[1]) * .078), .01);   // neck opening
  const t = len((len(p[0] / .094, (p[2] - .004) / .082) - 1) * .082, p[1] - yc) - .0125;
  return smin(d, t, .008);
}
/* ---------------- hand (wrist at origin, fingers toward -y, thumb on -x) ---------------- */
function fHand(p) {
  let d = ell(p, [0, -.046, 0], [.037, .05, .0205]);
  const fx = [-.027, -.009, .009, .027], ft = [-.127, -.14, -.137, -.121];
  for (let i = 0; i < 4; i++) d = smin(d, cone(p, [fx[i], -.08, .002], [fx[i] * 1.06, ft[i], .024], .0126, .0104), .011);
  d = smin(d, cone(p, [-.03, -.03, .008], [-.053, -.082, .03], .015, .0118), .014);
  return smin(d, capS(p, [0, .004, 0], [0, -.02, 0], .04), .02);
}
/* the same hand closed around a bar that runs along x (through about y -.08, z .014) */
function fFist(p) {
  let d = ell(p, [0, -.046, -.004], [.038, .046, .022]);
  for (const x of [-.027, -.009, .009, .027]) {
    const K = [[x, -.078, -.014], [x * 1.02, -.104, .01], [x * 1.02, -.086, .038], [x, -.058, .038]];
    for (let i = 0; i < 3; i++) d = smin(d, capS(p, K[i], K[i + 1], .0118), .008);
  }
  d = smin(d, capS(p, [-.032, -.03, .006], [-.031, -.058, .038], .0135), .012);   // thumb, wrapped over
  d = smin(d, capS(p, [-.031, -.058, .038], [-.006, -.072, .048], .012), .008);
  return smin(d, capS(p, [0, .004, 0], [0, -.02, 0], .04), .02);
}
/* ---------------- shoe (ankle at origin, toes toward +z) ---------------- */
function fShoe(p) {
  let d = ell(p, [0, -.046, .072], [.063, .05, .132]);
  d = smin(d, ell(p, [0, -.04, -.022], [.056, .056, .06]), .03);
  d = smin(d, capS(p, [0, .0, -.008], [0, -.03, -.008], .05), .025);
  d = smin(d, ell(p, [0, -.006, .048], [.03, .02, .05]), .012);              // tongue
  for (let i = 0; i < 3; i++) d = smin(d, capS(p, [-.03, -.012 - i * .006, .06 + i * .024], [.03, -.012 - i * .006, .06 + i * .024], .0055), .004); // laces
  d = smin(d, sph(p, [0, -.05, .178], .034), .03);                           // toe cap
  return Math.max(d, -(p[1] + .084));
}
function fSole(p) {
  const e = (len(p[0] / .07, (p[2] - .064) / .148) - 1) * .07;
  return Math.max(e, Math.abs(p[1] + .09) - .0115) - .004;
}
const fFoot = p => Math.min(fShoe(p), fSole(p));

/* ---------------- surface nets ---------------- */
function build(name, f, fao, bmin, bmax, cell, hid, tint, aoMin) {
  const n = [0, 1, 2].map(a => Math.ceil((bmax[a] - bmin[a]) / cell) + 1), [nx, ny, nz] = n;
  const g = new Float32Array(nx * ny * nz), at = (i, j, k) => g[i + nx * (j + ny * k)];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++)
    g[i + nx * (j + ny * k)] = f([bmin[0] + i * cell, bmin[1] + j * cell, bmin[2] + k * cell]);
  const cx = nx - 1, cy = ny - 1, cz = nz - 1, vid = new Int32Array(cx * cy * cz).fill(-1), P = [];
  const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    const v = [], c = [];
    for (let q = 0; q < 8; q++) { const a = i + (q & 1), b = j + ((q >> 1) & 1), d = k + ((q >> 2) & 1); v.push(at(a, b, d)); c.push([a, b, d]); }
    let m = 0; for (let q = 0; q < 8; q++) if (v[q] < 0) m |= 1 << q;
    if (m === 0 || m === 255) continue;
    let sx = 0, sy = 0, sz = 0, cnt = 0;
    for (const [a, b] of E) { if ((v[a] < 0) === (v[b] < 0)) continue; const t = v[a] / (v[a] - v[b]); sx += c[a][0] + (c[b][0] - c[a][0]) * t; sy += c[a][1] + (c[b][1] - c[a][1]) * t; sz += c[a][2] + (c[b][2] - c[a][2]) * t; cnt++; }
    vid[i + cx * (j + cy * k)] = P.length / 3;
    P.push(bmin[0] + sx / cnt * cell, bmin[1] + sy / cnt * cell, bmin[2] + sz / cnt * cell);
  }
  const I = [], cid = (i, j, k) => vid[i + cx * (j + cy * k)];
  // faces are kept as quads (four corners; the page splits each into the triangles 0-1-2 and 0-2-3)
  const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (flip) I.push(a, d, c, b); else I.push(a, b, c, d); };
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const s = at(i, j, k) < 0;
    if (i < nx - 1 && j > 0 && k > 0 && j < ny - 1 && k < nz - 1 && s !== (at(i + 1, j, k) < 0)) quad(cid(i, j - 1, k - 1), cid(i, j, k - 1), cid(i, j, k), cid(i, j - 1, k), !s);
    if (j < ny - 1 && i > 0 && k > 0 && i < nx - 1 && k < nz - 1 && s !== (at(i, j + 1, k) < 0)) quad(cid(i - 1, j, k - 1), cid(i - 1, j, k), cid(i, j, k), cid(i, j, k - 1), !s);
    if (k < nz - 1 && i > 0 && j > 0 && i < nx - 1 && j < ny - 1 && s !== (at(i, j, k + 1) < 0)) quad(cid(i - 1, j - 1, k), cid(i, j - 1, k), cid(i, j, k), cid(i - 1, j, k), !s);
  }
  const nv = P.length / 3, N = new Float32Array(nv * 3), A = new Uint8Array(nv * 3), e = cell * .35;
  const grad = p => { const gx = f([p[0] + e, p[1], p[2]]) - f([p[0] - e, p[1], p[2]]), gy = f([p[0], p[1] + e, p[2]]) - f([p[0], p[1] - e, p[2]]), gz = f([p[0], p[1], p[2] + e]) - f([p[0], p[1], p[2] - e]), l = len(gx, gy, gz) || 1; return [gx / l, gy / l, gz / l]; };
  for (let v = 0; v < nv; v++) {
    let p = [P[v * 3], P[v * 3 + 1], P[v * 3 + 2]];
    for (let it = 0; it < 2; it++) { const d = f(p), q = grad(p), st = Math.max(-cell * .6, Math.min(cell * .6, d)); p = [p[0] - q[0] * st, p[1] - q[1] * st, p[2] - q[2] * st]; }
    const nr = grad(p); P[v * 3] = p[0]; P[v * 3 + 1] = p[1]; P[v * 3 + 2] = p[2]; N[v * 3] = nr[0]; N[v * 3 + 1] = nr[1]; N[v * 3 + 2] = nr[2];
    let occ = 0; const W = [.3, .25, .2, .15, .1];
    for (let s = 0; s < 5; s++) { const h = .011 * (s + 1), d = fao([p[0] + nr[0] * h, p[1] + nr[1] * h, p[2] + nr[2] * h]); occ += Math.max(0, (h - d) / h) * W[s]; }
    const ao = Math.max(aoMin || .34, 1 - (aoMin ? .5 : .8) * occ), tc = tint ? tint(p) : [1, 1, 1];
    for (let a = 0; a < 3; a++) A[v * 3 + a] = Math.round(255 * Math.min(1, ao * tc[a]));
  }
  // make every quad face outward
  for (let t = 0; t < I.length; t += 4) {
    const a = I[t], b = I[t + 1], c = I[t + 2], ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2], vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;
    if (fx * (N[a * 3] + N[b * 3] + N[c * 3]) + fy * (N[a * 3 + 1] + N[b * 3 + 1] + N[c * 3 + 1]) + fz * (N[a * 3 + 2] + N[b * 3 + 2] + N[c * 3 + 2]) < 0) { I[t + 1] = I[t + 3]; I[t + 3] = b; }
  }
  if (hid) { // drop triangles buried inside other parts
    const H = new Uint8Array(nv); for (let v = 0; v < nv; v++) H[v] = hid([P[v * 3], P[v * 3 + 1], P[v * 3 + 2]]) < -.007 ? 1 : 0;
    const K = []; for (let t = 0; t < I.length; t += 4) if (!(H[I[t]] && H[I[t + 1]] && H[I[t + 2]] && H[I[t + 3]])) K.push(I[t], I[t + 1], I[t + 2], I[t + 3]);
    const map = new Int32Array(nv).fill(-1); let m = 0; for (const v of K) if (map[v] < 0) map[v] = m++;
    const P2 = new Float32Array(m * 3), N2 = new Float32Array(m * 3), A2 = new Uint8Array(m * 3);
    for (let v = 0; v < nv; v++) { const w = map[v]; if (w < 0) continue; for (let a = 0; a < 3; a++) { P2[w * 3 + a] = P[v * 3 + a]; N2[w * 3 + a] = N[v * 3 + a]; A2[w * 3 + a] = A[v * 3 + a]; } }
    I.length = 0; for (const v of K) I.push(map[v]); return pack(name, n, bmin, bmax, P2, A2, I, !!tint);
  }
  return pack(name, n, bmin, bmax, P, A, I, !!tint);
}
function pack(name, n, bmin, bmax, P, A, I, rgb) {
  const nv = A.length / 3;
  const q = new Int16Array(nv * 3), sh = rgb ? A : new Uint8Array(nv);       // untinted parts carry one byte of shade per point
  for (let v = 0; v < nv; v++) { for (let a = 0; a < 3; a++) q[v * 3 + a] = Math.round((P[v * 3 + a] - bmin[a]) / (bmax[a] - bmin[a]) * 65535) - 32768; if (!rgb) sh[v] = A[v * 3]; }
  const idx = nv < 65536 ? new Uint16Array(I) : new Uint32Array(I), b64 = t => Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString('base64');
  console.log(name.padEnd(9), 'verts', String(nv).padStart(6), 'quads', String(I.length / 4).padStart(6), 'grid', n.join('x'));
  return { bmin, bmax, wide: nv >= 65536, p: b64(q), a: b64(sh), q: b64(idx) };
}

const HB = [[-.25, -.12, -.25], [.25, .44, .36]];
const out = {
  head: build('head', fHead, fHeadAll, HB[0], HB[1], .0064, p => Math.min(fHair(p), fCapFront(p), fCapBack(p)), skinTint, .66),
  teeth: build('teeth', fTeeth, p => Math.min(fTeeth(p), fHead(p)), [-.075, .03, .13], [.075, .115, .225], .0021, null, null, .7),
  hair: build('hair', fHair, fHeadAll, HB[0], HB[1], .0054, p => Math.min(fHead(p), fCapFront(p), fCapBack(p))),
  brows: build('brows', fBrows, fHeadAll, [-.13, .19, .11], [.13, .27, .2], .0032, fHead),
  capFront: build('capFront', fCapFront, fHeadAll, HB[0], HB[1], .0066, fHead),
  capBack: build('capBack', fCapBack, fHeadAll, HB[0], HB[1], .0066, p => Math.min(fHead(p), fTufts(p))),
  brim: build('brim', fBrim, fHeadAll, HB[0], HB[1], .0058, p => Math.min(fHead(p), fCapFront(p), fCapBack(p))),
  rope: build('rope', fRope, fHeadAll, HB[0], HB[1], .0036),
  tee: build('tee', fTee, fTee, [-.31, -.07, -.2], [.31, .66, .2], .0115),
  hand: build('hand', fHand, fHand, [-.08, -.17, -.05], [.06, .06, .06], .0042),
  fist: build('fist', fFist, fFist, [-.08, -.17, -.05], [.06, .06, .075], .0042),
  shoe: build('shoe', fShoe, fFoot, [-.09, -.11, -.1], [.09, .07, .23], .0052, fSole),
  sole: build('sole', fSole, fFoot, [-.09, -.12, -.1], [.09, -.06, .23], .0052, fShoe),
};
// the tongue: a low mound at the bottom of the mouth, behind the line of the teeth
{ const y = mouthTop(0) - 2 * MH; let z = .26; while (z > .14 && fHeadBase([0, y, z]) > 0) z -= .0004; out.tongue = [y - .004, z - .021]; }
{ const z1 = surfZ(0, .055), z2 = surfZ(0, .115); out.cap = { o: CAP_O, a: CAP_A, logo: [.085, (z1 + z2) / 2 + .003, -Math.atan2(z1 - z2, .06)] }; }
const js = JSON.stringify(out);
fs.writeFileSync(path.join(__dirname, 'avatar.json'), js);
console.log('avatar.json', (js.length / 1024).toFixed(0) + ' KB');
