/* ---------- TakeKit, recreated in its current look: the scripts, a take with the guide following the voice, the edit ---------- */
const TKP=(()=>{try{
 const el=document.getElementById('scrt'),SY=TKSYM,st=document.createElement('style');
 st.textContent=TKCSS+Object.keys(SY).map(k=>'.tkx .sy-'+k+'{-webkit-mask-image:url('+SY[k].u+');mask-image:url('+SY[k].u+')}').join('');document.head.appendChild(st);
 const sy=(k,s)=>'<i class="sy sy-'+k+'" style="width:'+(SY[k].w*s).toFixed(2)+'px;height:'+(SY[k].h*s).toFixed(2)+'px"></i>';
 const WORDS='Quick update on Q3: revenue is up 40 percent, churn is down, and we shipped the new onboarding. Here’s what’s next.'.split(' '),N=WORDS.length;
 const card=(top,t,p,m)=>'<div class="card" style="top:'+top+'px"><b>'+t+'</b><p>'+p+'</p><small class="mo">'+m+'</small><span class="rec"><i></i></span></div>';
 const cf=(ic,l)=>'<span class="cf mo"><i>'+ic+'</i>'+l+'</span>';
 const ring='<svg width="84" height="84" viewBox="0 0 84 84"><circle class="r0" cx="42" cy="42" r="38" fill="none" stroke="#F2EFE7" stroke-width="4"/><circle class="r1" cx="42" cy="42" r="38" fill="none" stroke="#E8442E" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90 42 42)"/></svg>';
 el.innerHTML='<div class="tkx">'+
  '<div class="tk-home"><h1 class="an">SCRIPTS</h1><span class="pro mo">Pro</span>'+
   '<div class="slate"><i class="clap"></i><span class="kk mo">TODAY’S SLATE</span><h2 class="an">LAUNCH DAY REEL</h2><div class="ch mo"><span>5:39 PM</span><span>35 words</span><span>0:14</span><span>4 takes</span></div>'+
   '<div class="ls"><span>Last spot</span><b class="mo">63%</b></div><div class="pg"><i></i><u></u></div><div class="en">Ends at “…Here’s the three”</div><div class="go an"><i></i>CONTINUE · 63%</div><div class="st">From the start</div></div>'+
   '<div class="all">All scripts<small class="mo">3</small></div><div class="new">'+sy('plus',15)+'New script</div>'+
   card(529,'Investor update Q3','Quick update on Q3: revenue is up 4…','21 words · 0:08 · <em>2 takes</em>')+card(628,'Course intro, take 2','Welcome to the course. Over the ne…','19 words · 0:08 · no takes yet')+
   '<div class="tabs"><span class="on">'+sy('doc-text',17)+'Scripts</span><span>'+sy('film-stack',16)+'Takes</span><span>'+sy('slider-horizontal-3',16)+'Settings</span></div></div>'+
  '<div class="tk-cam" style="background-image:url('+TKCAM+')"><i class="air"></i>'+
   '<div class="guide"><div class="vp"><i class="band"></i><div class="tx">'+WORDS.map(w=>'<span>'+w+'</span>').join(' ')+'</div></div><div class="ft mo"><b><i></i>Following your voice</b><em>Only you see this</em></div></div>'+
   '<div class="cap"><span>'+sy('eye-fill',11)+'Eye contact: reading at the lens</span></div>'+
   '<div class="topb"><span>'+sy('xmark',16)+'</span><span class="act">'+sy('eye-fill',18)+'</span><span class="mo">9:16</span><span class="dis">'+sy('bolt-slash',18)+'</span></div>'+
   '<div class="saved"><span><i>'+sy('checkmark-bold',13)+'</i>Take saved</span></div>'+
   '<div class="cons"><i class="pl"></i><div class="set"><div class="r1"><div class="seg"><span class="on">Auto</span><span>Fixed</span></div><div class="seg"><span class="on">Start</span><span>Last spot</span></div></div>'+
   '<div class="r2"><div>'+cf(sy('mic',20),'Mic')+cf(sy('rectangle-on-rectangle',20),'Dual')+'</div><span class="recb">'+ring+'<u></u><b class="an">3</b></span><div>'+cf(sy('arrow-triangle-2-circlepath-camera',20),'Flip')+cf('Aa','Guide')+'</div></div></div>'+
   '<div class="liv" style="display:none"><div class="qa"><span>Aa<small class="mo">26</small></span></div><div class="rb"><div class="clk"><b class="an"><i></i><span>00:00</span></b><small class="mo">Script 0% · Take 3</small></div><span class="recb live">'+ring+'<u></u></span><div class="micm mo"><div>'+[8,14,20,12,24,26,10].map(h=>'<i style="height:'+h+'px"></i>').join('')+'</div>Mic OK</div></div></div></div></div>'+
  '<div class="tk-edit"><div class="hd"><span>Cancel</span>Edit take<span class="sv">Save</span></div><div class="pv" style="background-image:url('+TKCAM+')"><i class="fr"></i></div><div class="hint mo">Drag to reposition · pinch to resize</div>'+
   '<div class="seg"><span class="on">9:16</span><span>16:9</span><span>1:1</span><span>4:5</span><span>Free</span></div>'+
   '<div class="trim"><div class="l"><span>Trim</span><small class="mo">0:00 – 0:08 · 8.0s</small></div><div class="fs">'+Array.from({length:8},()=>'<i style="background-image:url('+TKCAM+')"></i>').join('')+'</div></div><div class="exp an">EXPORT CLEAN VIDEO</div></div>'+
  '<div class="tk-sb"><span>9:41</span><span>'+sy('cellularbars-regular',15)+sy('wifi-regular',15)+sy('battery-100percent-regular',19)+'</span></div><span class="tk-tch"></span><i class="isl"></i></div>';
 const q=s=>el.querySelector(s),qa=s=>[...el.querySelectorAll(s)],cam=q('.tk-cam'),edit=q('.tk-edit'),sb=q('.tk-sb'),rec0=q('.card .rec'),air=q('.air'),tx=q('.guide .tx'),ws=qa('.guide .tx span'),cap=q('.cap'),topb=q('.topb'),
  setp=q('.cons .set'),liv=q('.cons .liv'),pl=q('.cons .pl'),rb=qa('.recb'),cnt=q('.recb b'),r0=qa('.recb .r0'),r1=q('.liv .r1'),clk=q('.clk span'),sub=q('.clk small'),mic=qa('.micm div i'),saved=q('.saved'),
  fr=q('.pv .fr'),segs=qa('.tk-edit .seg span'),sv=q('.tk-edit .sv'),tch=q('.tk-tch');
 const S=(e,k,v)=>{const c=e._s||(e._s={});if(c[k]!==v){c[k]=v;e.style[k]=v}},C=(e,k,on)=>{const c=e._c||(e._c={});if(c[k]!==on){c[k]=on;e.classList.toggle(k,on)}},T=(e,v)=>{if(e._t!==v){e._t=v;e.textContent=v}};
 const win=(u,a,b)=>u>=a&&u<b,p2=n=>(n<10?'0':'')+n;
 /* EditTakeView's formats, as crop frames inside the 354 x 332 preview */
 const FR=[[186.75,332],[354,199.1],[332,332],[265.6,332]],AT=[1.2,2.6,4],DUR=[3.4,10.6,6.6],REC=3.1,STOP=9.3;let sc=0,u=0,lw=-2;
 const draw=()=>{const s0=sc===0,s1=sc===1,s2=sc===2;
  const camOn=s1||(s0&&u>=2.85)||(s2&&u<.5),edOn=s2&&u<5.6;C(cam,'on',camOn);C(edit,'on',edOn);C(sb,'w',camOn||edOn);C(rec0,'hit',s0&&win(u,2.6,2.85));
  /* camera: setup, a 3-2-1 countdown, then recording while the read words turn red and the text climbs line by line */
  const count=s1&&win(u,1.3,REC),recng=s1&&win(u,REC,STOP),live=count||recng;
  S(setp,'display',live?'none':'');S(liv,'display',live?'':'none');C(topb,'off',live);C(cap,'off',live);C(air,'on',recng);
  C(rb[0],'hit',s1&&win(u,1.15,1.3));C(rb[1],'live',recng);C(rb[1],'hit',s1&&win(u,STOP-.12,STOP));
  S(cnt,'opacity','0');r0.forEach(r=>S(r,'strokeOpacity',recng?'.22':'1'));
  if(count){const n=3-Math.floor((u-1.3)/.6);let b=liv.querySelector('.recb b');if(!b){b=cnt.cloneNode(true);liv.querySelector('.recb').appendChild(b)}T(b,String(n));S(b,'opacity','1');const f=((u-1.3)/.6)%1;S(b,'transform','scale('+(f<.15?1.25-f/.15*.25:1).toFixed(2)+')')}
  else{const b=liv.querySelector('.recb b');if(b)S(b,'opacity','0')}
  const cur=recng?Math.max(0,Math.min(N,Math.floor((u-REC-.35)/.27)+1)):s1&&u>=STOP?N:0,frac=cur/N;
  if(cur!==lw){lw=cur;const li=ws.map(w=>Math.round(w.offsetTop/40.5)),line=li[Math.min(cur,N-1)];ws.forEach((w,i)=>{w.className=i<cur?'rd':li[i]===line?'now':''});S(tx,'transform','translateY('+(55.05-line*40.5).toFixed(1)+'px)')}
  if(live){const t=recng?u-REC:0;T(clk,'00:'+p2(Math.floor(t)));T(sub,'Script '+Math.round(frac*100)+'% · Take 3');S(pl,'width',(frac*100).toFixed(1)+'%');S(r1,'strokeDasharray',(frac*100).toFixed(1)+' 100');
   const lvl=recng?.5+.28*Math.sin(u*9)+.16*Math.sin(u*23+1):.12,lit=Math.max(0,Math.min(7,Math.round(lvl*7)));mic.forEach((m,i)=>S(m,'background',i>=lit?'rgba(242,239,231,.35)':i===lit-1?'#E8442E':'#F2EFE7'))}else S(pl,'width','0%');
  C(saved,'on',s1&&win(u,STOP+.1,STOP+1.1));
  /* edit take: one take, every format */
  let a=0;if(s2)AT.forEach((t,i)=>{if(u>=t)a=i+1});S(fr,'width',FR[a][0]+'px');S(fr,'height',FR[a][1]+'px');segs.forEach((e,i)=>C(e,'on',i===a));C(sv,'hit',s2&&win(u,5.4,5.6));
  /* the finger */
  let t=null;
  if(s0){if(win(u,2.4,2.95))t=[347,575]}
  else if(s1){if(win(u,.95,1.4))t=[201,802];else if(win(u,STOP-.25,STOP+.15))t=[201,800]}
  else{AT.forEach((x,i)=>{if(win(u,x-.25,x+.15))t=[58.6+71.2*(i+1),514]});if(win(u,5.2,5.65))t=[346,90]}
  if(t)S(tch,'transform','translate('+t[0].toFixed(1)+'px,'+t[1].toFixed(1)+'px)');C(tch,'on',!!t)};
 const put=domScreen(el);
 const o={n:3,mesh:null,get sc(){return sc},
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;draw()}return}u+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0}draw()},
  next(){sc=(sc+1)%3;u=0;draw()},seek(a,b){sc=a;u=b;lw=-2;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{lw=-2;draw()});   // the lines break where the app's font breaks them
 draw();window.__tkp=o;return o}catch(e){window.__tkerr=String(e&&e.stack||e);return null}})();
