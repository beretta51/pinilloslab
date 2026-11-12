/* ---------- Gridborne, recreated with the game's own art and rules: one battle in three moments (a sniper shot, a charge, the rival's turn) ---------- */
const GBP=(()=>{try{
 const el=document.getElementById('scrg'),G=GBG,st=document.createElement('style');
 st.textContent=GBCSS+Object.keys(G).map(k=>'.gbx .gm-'+k+'{background-image:url('+G[k].j+');-webkit-mask-image:url('+G[k].m+');mask-image:url('+G[k].m+')}').join('');document.head.appendChild(st);
 /* Unit.make: HP, attack, defense, move, range. Positions as on the game's own screenshot (row 0 on top). */
 const ST={core:[70,0,2,1,0],knight:[38,10,10,2,1],warrior:[30,13,6,3,1],berserker:[20,18,1,4,1],assassin:[16,14,2,6,1],beastRider:[24,11,4,5,2],ranger:[14,12,1,2,7],pyromancer:[15,8,1,3,3],iceMage:[17,6,2,3,5],healer:[18,0,1,3,4]},
  NM={core:'Core',knight:'Knight',warrior:'Bravo',berserker:'Fury',assassin:'Rogue',beastRider:'Rider',ranger:'Ranger',pyromancer:'Pyro',iceMage:'Frost',healer:'Healer'};
 const U=[['core','o',3,1],['knight','o',0,2],['iceMage','o',1,2],['berserker','o',2,2],['pyromancer','o',3,2],['assassin','o',4,2],['healer','o',5,2],
  ['knight','p',1,4],['warrior','p',3,4],['beastRider','p',5,4],['iceMage','p',2,5],['ranger','p',5,5],['pyromancer','p',1,6],['core','p',3,6]].map((a,i)=>({i,k:a[0],t:a[1],c:a[2],r:a[3],hp:ST[a[0]][0]}));
 const F=U[3],P=U[4],Q=U[5],B=U[8],R=U[11],CW=384/7,CH=64,cx=c=>(c+.5)*CW,cy=r=>(r+.5)*CH;
 /* UnitSpriteBuilder.scaleOverrides, and yOffsets + boardYOffsets (points, up is positive) */
 const SCL={warrior:1.1,knight:1.25,assassin:1.2,beastRider:1.3,berserker:1.25,iceMage:1.25,healer:1.06},YO={core:-2,warrior:-7,knight:-4};
 const TOP=[0,2,3,6,1,4,5],BOT=[13,8,10,7,12,11,9];   // roster order: the Core, then by name
 const arc='M -28.66 3.55 A 30 12 0 0 0 28.66 3.55';
 const ros=(ids,c)=>'<div class="ros '+c+'" style="top:'+(c==='t'?148:706)+'px">'+ids.map(i=>'<div data-u="'+i+'"><img alt="" src="'+GBPT[U[i].k]+'"><i><u style="width:100%"></u></i><span class="ol">'+U[i].hp+'/'+U[i].hp+'</span></div>').join('')+'</div>';
 let cells='';for(let r=0;r<7;r++)for(let c=0;c<7;c++)cells+='<i class="cell" style="left:'+(c*CW).toFixed(2)+'px;top:'+r*CH+'px;background:'+((c+6-r)%2?'#6BB52A':'#7DC733')+'"></i>';
 let ovs='';for(let r=0;r<7;r++)for(let c=0;c<7;c++)ovs+='<i class="ov" style="left:'+(c*CW).toFixed(2)+'px;top:'+r*CH+'px"></i>';
 el.innerHTML='<div class="gbx"><div class="hud"></div><div class="bar"></div>'+
  '<div class="turn"><b class="ol">YOUR TURN</b><small class="ol">Turn 1  ·  Tap a unit</small></div><div class="info"><b class="ol">Ranger</b><small></small><i><u></u></i></div>'+
  '<div class="tmr"><svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#0B0B0D"/><circle cx="24" cy="24" r="19.5" fill="none" stroke="#3A2E12" stroke-width="3.5"/><circle class="rg" cx="24" cy="24" r="19.5" fill="none" stroke="#EDB120" stroke-width="3.5" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100" transform="rotate(-90 24 24)"/></svg><b class="ol">30</b></div>'+
  ros(TOP,'t')+'<div class="brd">'+cells+ovs+
  U.map(u=>'<div class="un '+u.t+(u.k==='core'?' core':'')+'"><i class="sh"></i><i class="bs"></i><svg width="49.4" height="24.7" viewBox="-36 -18 72 36"><path d="'+arc+'" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="5" stroke-linecap="round"/><path class="f" d="'+arc+'" fill="none" stroke="#26CC40" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100"/></svg><div class="sp" style="transform:translateY('+((YO[u.k]||0)*-.686).toFixed(1)+'px) scale('+(SCL[u.k]||1)+')"><i class="gm gm-'+u.k+'"></i></div></div>').join('')+
  '<i class="arw"></i><i class="fire gm gm-pyromancer_projectile"></i>'+Array.from({length:6},()=>'<i class="dot"></i>').join('')+Array.from({length:6},()=>'<div class="fl"><span class="ol"></span></div>').join('')+'</div>'+
  ros(BOT,'b')+'<span class="xbtn">✕</span><div class="endt ol">End Turn</div><i class="cut"></i>'+
  '<span class="gb-tch"></span><i class="isl"></i></div>';
 const q=s=>el.querySelector(s),qa=s=>[...el.querySelectorAll(s)],un=qa('.un'),spr=qa('.un .sp'),img=qa('.un .sp .gm'),hpa=qa('.un svg .f'),ov=qa('.ov'),card={},
  tb=q('.turn b'),ts=q('.turn small'),turn=q('.turn'),info=q('.info'),ib=q('.info b'),is=q('.info small'),ih=q('.info i u'),rg=q('.tmr .rg'),tn=q('.tmr b'),endt=q('.endt'),
  arw=q('.arw'),fire=q('.fire'),dots=qa('.dot'),fls=qa('.fl'),cut=q('.cut'),tch=q('.gb-tch');
 qa('.ros div').forEach(d=>{card[d.dataset.u]=d});
 const S=(e,k,v)=>{const c=e._s||(e._s={});if(c[k]!==v){c[k]=v;e.style[k]=v}},C=(e,k,on)=>{const c=e._c||(e._c={});if(c[k]!==on){c[k]=on;e.classList.toggle(k,on)}},T=(e,v)=>{if(e._t!==v){e._t=v;e.textContent=v}};
 const cl=x=>x<0?0:x>1?1:x,win=(g,a,b)=>g>=a&&g<b,bump=x=>x>0&&x<1?Math.sin(Math.PI*x):0,hpc=f=>f>.6?'#26CC40':f>.3?'#F2BF1A':'#E6261A';
 /* Board.reachableCells: steps through free tiles only */
 const reach=(u,c0,r0,occ)=>{const seen={},out=[];let fr=[[c0,r0]];seen[c0+','+r0]=1;for(let s=0;s<ST[u.k][3];s++){const nx=[];fr.forEach(([c,r])=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dc,dr])=>{const a=c+dc,b=r+dr,key=a+','+b;if(a<0||b<0||a>6||b>6||seen[key]||occ[key])return;seen[key]=1;nx.push([a,b]);out.push(b*7+a)}));fr=nx}return out};
 const occ={};U.forEach(u=>{occ[u.c+','+u.r]=1});const RR=reach(R,5,5,occ),RB=reach(B,3,4,occ);
 const along=(p,k)=>{const n=p.length-1,s=cl(k)*n,i=Math.min(Math.floor(s),n-1),f=s-i;return[p[i][0]+(p[i+1][0]-p[i][0])*f,p[i][1]+(p[i+1][1]-p[i][1])*f]};
 /* the battle's clock: when each thing happens, in seconds from the start */
 const selR=1.15,atkR=2.55,hitR=2.97,selB=7.4,movB=8.7,arrB=9.1,atkB=10.2,hitB=10.38,end=14.5,pyro=15.5,hitP=15.95,fmov=16.8,fatk=17.7,hitF=17.88,ctr=18.3,hitC=18.45,turn2=18.9,
  DUR=[6.4,7.2,6.6],OFF=[0,6.4,13.6],TOTAL=20.2;
 const FL=[[hitR,'-10',4,2,''],[hitB,'-11',4,2,''],[hitP,'-2',4,3,''],[hitF,'-12',4,3,''],[ctr,'COUNTER!',4,3,'sm'],[hitC,'-5',3,3,'']];
 const HITS=[[Q,hitR],[Q,hitB],[B,hitP],[B,hitF],[F,hitC]];
 let sc=0,u=0,ovk=null;
 const draw=()=>{const g=u+OFF[sc];
  const bp=along([[3,4],[4,4],[4,3]],(g-movB)/.4),fp=along([[2,2],[2,3],[3,3]],(g-fmov)/.4);
  const hp=x=>x===Q?(g<hitR?16:g<hitB?6:0):x===B?(g<hitP?30:g<hitF?28:16):x===F?(g<hitC?20:15):x.hp;
  const fr=x=>x===R?(win(g,atkR,atkR+.15)?'_atk_1':win(g,atkR+.15,atkR+.42)?'_atk_2':''):x===B?(win(g,atkB,atkB+.1)||win(g,ctr,ctr+.1)?'_atk_1':win(g,atkB+.1,atkB+.3)||win(g,ctr+.1,ctr+.3)?'_atk_2':''):
   x===P?(win(g,pyro,pyro+.2)?'_atk_1':win(g,pyro+.2,pyro+.45)?'_atk_2':''):x===F?(win(g,fatk,fatk+.1)?'_atk_1':win(g,fatk+.1,fatk+.3)?'_atk_2':''):'';
  const sel=win(g,selR,atkR)?R:win(g,selB,atkB)?B:null;
  U.forEach((x,i)=>{let c=x.c,r=x.r,dx=0,dy=0;if(x===B){c=bp[0];r=bp[1];dy-=16*bump((g-atkB)/.28);dx-=14*bump((g-ctr)/.28)}if(x===F){c=fp[0];r=fp[1];dx+=14*bump((g-fatk)/.28)}
   let hit=false;HITS.forEach(h=>{if(h[0]===x){const t=g-h[1];if(t>=0&&t<.22)dx+=3*Math.sin(t*60)*(1-t/.22);if(t>=0&&t<.12)hit=true}});
   const dead=x===Q?cl((g-hitB-.05)/.3):0,e=un[i],h=hp(x),f=h/x.hp;
   S(e,'transform','translate('+(cx(c)+dx).toFixed(1)+'px,'+(cy(r)+dy).toFixed(1)+'px)'+(dead?' scale('+(1-dead).toFixed(2)+')':''));S(e,'opacity',dead?(1-dead).toFixed(2):'1');S(e,'zIndex',String(10+Math.round(6-r)*10+Math.round(c)));
   C(e,'hit',hit);C(e,'dim',(x===R&&win(g,hitR+.35,turn2))||(x===B&&win(g,hitB+.4,turn2)));
   const k=x.k+fr(x);if(img[i]._k!==k){img[i]._k=k;img[i].className='gm gm-'+k}
   S(hpa[i],'strokeDasharray',(f*100).toFixed(1)+' 100');S(hpa[i],'stroke',hpc(f));
   const cd=card[i];T(cd.lastChild,h+'/'+x.hp);S(cd.children[1].firstChild,'width',(f*100).toFixed(0)+'%');S(cd.children[1].firstChild,'backgroundColor',hpc(f));C(cd,'dead',h<=0&&g>=hitB+.3);C(cd,'sel',x===sel)});
  /* overlays: where the selected unit can go (blue), what it can hit (red) */
  const key=win(g,selR,atkR)?'R':win(g,selB,movB)?'B1':win(g,arrB,atkB)?'B2':'';
  if(key!==ovk){ovk=key;const m={};if(key==='R'){RR.forEach(i=>{m[i]='mv'});m[5*7+5]='sl'}else if(key==='B1'){RB.forEach(i=>{m[i]='mv'});m[4*7+3]='sl'}else if(key==='B2'){m[3*7+4]='sl';m[2*7+4]='at';m[3*7+3]='af';m[3*7+5]='af';m[4*7+4]='af'}
   ov.forEach((o,i)=>{o.className='ov'+(m[i]?' '+m[i]:'')})}
  /* HUD */
  const mine=g<end||g>=turn2;C(info,'on',!!sel);S(turn,'opacity',sel?'0':'1');
  if(sel){const s=ST[sel.k];T(ib,NM[sel.k]);T(is,'HP '+hp(sel)+'/'+sel.hp+'  ·  ATK '+s[1]+'  ·  DEF '+s[2]+'  ·  RNG '+s[4]);S(ih,'width',(hp(sel)/sel.hp*100).toFixed(0)+'%')}
  T(tb,mine?'YOUR TURN':'OPPONENT’S TURN');C(tb,'op',!mine);T(ts,mine?'Turn '+(g<end?1:2)+'  ·  '+(sel?(sel===B&&g>=arrB?'Attack':'Move'):'Tap a unit'):'Turn 1  ·  You: 7  Opp: 6');
  const left=g<end?30-Math.floor(g):g<turn2?30:30-Math.floor(g-turn2);T(tn,String(left));S(rg,'strokeDasharray',(left/30*100).toFixed(1)+' 100');
  C(endt,'hit',win(g,end-.12,end+.06));C(endt,'off',!mine);
  /* the arrow, the fireball, damage numbers, the burst when a unit falls */
  let a=(g-atkR-.17)/.25;if(a>=0&&a<1){const x0=cx(5),y0=cy(5)-10,x1=cx(4),y1=cy(2)-8;S(arw,'transform','translate('+(x0+(x1-x0)*a).toFixed(1)+'px,'+(y0+(y1-y0)*a).toFixed(1)+'px) rotate('+Math.atan2(y1-y0,x1-x0).toFixed(3)+'rad)');S(arw,'opacity','1')}else S(arw,'opacity','0');
  a=(g-pyro-.22)/.23;if(a>=0&&a<1){const x0=cx(3),y0=cy(2)-8,x1=cx(4),y1=cy(3)-8;S(fire,'transform','translate('+(x0+(x1-x0)*a).toFixed(1)+'px,'+(y0+(y1-y0)*a).toFixed(1)+'px) rotate('+(Math.atan2(y1-y0,x1-x0)+Math.PI/2).toFixed(3)+'rad)');S(fire,'opacity','1')}else S(fire,'opacity','0');
  FL.forEach((f,i)=>{const e=fls[i],t=g-f[0];if(t<0||t>=.78){S(e,'opacity','0');return}if(!e._f){e._f=1;e.firstChild.textContent=f[1];if(f[4])e.classList.add(f[4])}
   const s=t<.08?1.3*t/.08:t<.13?1.3-.3*(t-.08)/.05:1,dy=t>.13?-20.6*Math.min(1,(t-.13)/.65):0;
   S(e,'transform','translate('+cx(f[2]).toFixed(1)+'px,'+(cy(f[3])-19.2+dy).toFixed(1)+'px) scale('+s.toFixed(2)+')');S(e,'opacity',t<.38?'1':Math.max(0,1-(t-.38)/.4).toFixed(2))});
  const dk=(g-hitB-.05)/.3;dots.forEach((d,i)=>{if(dk<0||dk>=1){S(d,'opacity','0');return}const an=i/6*Math.PI*2;S(d,'transform','translate('+(cx(4)+Math.cos(an)*26*dk).toFixed(1)+'px,'+(cy(2)+Math.sin(an)*26*dk).toFixed(1)+'px)');S(d,'opacity',(1-dk).toFixed(2))});
  S(cut,'opacity',g>TOTAL-.3?((g-TOTAL+.3)/.3).toFixed(2):sc===0&&u>0&&u<.3?(1-u/.3).toFixed(2):'0');
  /* the finger */
  let t=null;const tap=(at,c,r)=>{if(win(g,at-.25,at+.15))t=[9+cx(c),234+cy(r)]};
  tap(selR,5,5);tap(atkR,4,2);tap(selB,3,4);tap(movB,4,3);tap(atkB,4,2);if(win(g,end-.3,end+.15))t=[301,815];
  if(t)S(tch,'transform','translate('+t[0].toFixed(1)+'px,'+t[1].toFixed(1)+'px)');C(tch,'on',!!t)};
 const put=domScreen(el);
 const o={n:3,mesh:null,get sc(){return sc},
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;draw()}return}u+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0}draw()},
  next(){sc=(sc+1)%3;u=0;draw()},seek(a,b){sc=a;u=b;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 draw();window.__gbp=o;return o}catch(e){window.__gberr=String(e&&e.stack||e);return null}})();
