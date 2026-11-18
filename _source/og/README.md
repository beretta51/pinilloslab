# The picture shown when the site's link is shared (`images/og.jpg`)

Seven stripes, one for each app in its room's colour, Edu dressed for each, the lab's mark on top. 1200×630.
It is made from the site itself, so remake it when his looks or the rooms change:

1. `python3 -I _source/og/server.py` — serves the repository at http://localhost:8802 and saves what the pages send it into `_source/out/og/` (not committed).
2. Open each app's room in a 600×630 window (`/#trovelo`, `/#dimmly` …), wait for him to settle, and run in the console:

       __cap = (name, pre) => { const o = THREE.Object3D.prototype.updateMatrixWorld; THREE.Scene.prototype.updateMatrixWorld = function (f) { window.__sc = this; return o.call(this, f) };
         const s = document.createElement('style'); s.textContent = '.ui,#hot,.scr{visibility:hidden!important}#dim{display:none!important}'; document.head.append(s); pre && pre();
         setTimeout(() => { __sc.children.forEach(o => { if (o.isGroup && (Math.abs(o.position.z + .42) < .05 || Math.abs(o.position.z + .84) < .05)) o.visible = false });   // the floating devices and icons
           requestAnimationFrame(() => requestAnimationFrame(() => { const c = document.getElementById('gl'); c.toBlob(b => fetch('/save?name=' + name, { method: 'POST', body: b }), 'image/png') })) }, 1500) }
       __cap('trovelo.png')                                  // dimmly: () => { __dimu = .1 } · percha: () => { __look = 2 } · dummo: () => { __megu = .3 }

3. Open http://localhost:8802/_source/og/compose.html — it cuts the seven stripes, draws the mark and saves `_source/out/og/og.jpg`. Copy that to `images/og.jpg`.
