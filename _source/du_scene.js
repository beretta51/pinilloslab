/* ---------- Dummo, on the Mac: the editor's own window, with the timeline playing, the background changing and the format changing ---------- */
const DUP=(()=>{try{
 const el=document.getElementById('scru'),I=DUIMG,st=document.createElement('style');st.textContent=DUCSS;document.head.appendChild(st);
 const img=(k,c)=>'<img class="'+c+'" alt="" src="'+I[k]+'">';
 /* canvas backgrounds: the project's lilac, and two of the inspector's swatches (colours read off the screenshot) */
 const BG=['linear-gradient(75deg,#D6CEFB,#BCA1E7)','linear-gradient(75deg,#FFC7C7,#FFA596)','linear-gradient(75deg,#7FCCF7,#3A98F0)'];
 const FMT=[['1:1','Reset',44,44],['16:9','1920×1080',56,31],['4:3','1440×1080',56,42],['4:3','1600×1200',56,42],['1:1','1080×1080',44,44],['9:16','1080×1920',31,55]];
 el.innerHTML='<div class="dux">'+img('top','top')+img('side-t','sd')+img('side-c','sd')+img('side-f','sd')+img('insp-k','in')+img('insp-c','in')+img('insp-f','in')+
  '<div class="vp"><div class="cv">'+BG.map(b=>'<i class="bg" style="background-image:'+b+'"></i>').join('')+'<i class="ph" style="background-image:url('+I['phones.jpg']+');-webkit-mask-image:url('+I['phones.png']+');mask-image:url('+I['phones.png']+')"></i></div>'+
  img('refresh','rf')+img('zoom','zm')+'<span class="bdg">4:3  ·  1600 × 1200</span></div>'+
  '<i class="ring"></i><div class="fm">'+FMT.map((f,i)=>'<div style="left:'+(6+(i%2)*139.3).toFixed(1)+'px;top:'+(5.5+Math.floor(i/2)*136.1).toFixed(1)+'px"><i class="st">'+(i===3?'★':'☆')+'</i><i class="ck">✓</i><u style="width:'+f[2]+'px;height:'+f[3]+'px">'+f[0]+'</u><span>'+f[1]+'</span></div>').join('')+'</div>'+
  '<div class="tl">'+img('tl','')+'<span class="clk">0:05 / 0:40</span><span class="pp"><i></i><i></i></span><div class="phd"><i></i><b>0:05</b></div></div>'+
  '<svg class="cur" viewBox="0 0 30 30"><path d="M4 2 L4 24 L10 18.6 L14 27.4 L18 25.6 L14.1 17 L22 17 Z" fill="#111" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg></div>';
 const q=s=>el.querySelector(s),qa=s=>[...el.querySelectorAll(s)],sd=qa('.sd'),ins=qa('.in'),vp=q('.vp'),cv=q('.cv'),bgs=qa('.cv .bg'),ph=q('.ph'),rf=q('.rf'),zm=q('.zm'),bdg=q('.bdg'),ring=q('.ring'),fm=q('.fm'),tiles=qa('.fm div'),stars=qa('.fm .st'),
  tl=q('.tl'),clk=q('.clk'),pp=q('.pp'),phd=q('.phd'),phb=q('.phd b'),cur=q('.cur');
 const S=(e,k,v)=>{const c=e._s||(e._s={});if(c[k]!==v){c[k]=v;e.style[k]=v}},C=(e,k,on)=>{const c=e._c||(e._c={});if(c[k]!==on){c[k]=on;e.classList.toggle(k,on)}},T=(e,v)=>{if(e._t!==v){e._t=v;e.textContent=v}};
 const ez=x=>x<=0?0:x>=1?1:x*x*(3-2*x),win=(u,a,b)=>u>=a&&u<b,p2=n=>(n<10?'0':'')+n,
  over=x=>{x=x<0?0:x>1?1:x;const c=1.70158,k=c+1;return 1+k*Math.pow(x-1,3)+c*Math.pow(x-1,2)};   // the project's "Overshoot" curve
 /* the pointer's stops in each scene: [second, x, y]; it clicks a little after it arrives */
 const WAY=[[[0,980,600],[.9,1328,727],[6.2,1328,727],[7.2,40,151]],
  [[0,40,151],[1.2,1396.6,569.8],[1.5,1396.6,569.8],[2.6,1466.7,639.8],[2.9,1466.7,639.8],[4,1466.7,709.9],[5.2,1466.7,709.9],[6.3,40,209]],
  [[0,40,209],[1.2,1431.8,508.2],[1.6,1431.8,508.2],[2.7,1292.5,508.2],[3.1,1292.5,508.2],[4.2,1431.8,372.1],[5.6,1431.8,372.1],[6.7,40,384]]],
  CLICK=[[1,6.2,7.35],[1.35,2.75,4.15,6.5],[1.35,2.85,4.35,6.9]],DUR=[7.6,6.9,7.3],A=[1,16/9,4/3,4/3,1,9/16],NAME=['1:1  ·  1080 × 1080','16:9  ·  1920 × 1080','4:3  ·  1440 × 1080','4:3  ·  1600 × 1200','1:1  ·  1080 × 1080','9:16  ·  1080 × 1920'];
 let sc=0,u=0;
 const draw=()=>{const s0=sc===0,s1=sc===1,s2=sc===2;
  sd.forEach((e,i)=>C(e,'on',i===sc));ins.forEach((e,i)=>C(e,'on',i===sc));C(tl,'off',!s0);C(fm,'on',s2);
  /* scene 0: play — the playhead runs from 0:05 and the camera keyframe pushes in on the devices */
  const playing=s0&&win(u,1,6.2),t=s0?5+Math.max(0,Math.min(5.2,u-1)):5,zin=s0?over((u-3.4)/.9)-ez((u-5.3)/.8):0;
  S(phd,'transform','translateX('+(137.5+34.2*t).toFixed(1)+'px)');T(phb,'0:'+p2(Math.floor(t)));T(clk,'0:'+p2(Math.floor(t))+' / 0:40');C(pp,'on',playing);
  S(ph,'transform',zin?'translate('+(-9*zin).toFixed(2)+'%,'+(5*zin).toFixed(2)+'%) scale('+(1+.42*zin).toFixed(3)+')':'none');
  /* scene 1: a swatch tints the animated background · scene 2: a format reshapes the canvas */
  let b=0,rg=-1;if(s1){if(u>=1.35){b=1;rg=0}if(u>=2.75){b=2;rg=1}if(u>=4.15){b=0;rg=2}}
  bgs.forEach((e,i)=>C(e,'on',i===b));C(ring,'on',rg>=0);if(rg>=0){S(ring,'left',[1396.6,1466.7,1466.7][rg]+'px');S(ring,'top',[569.8,639.8,709.9][rg]+'px')}
  let f=3;if(s2){if(u>=1.35)f=5;if(u>=2.85)f=4;if(u>=4.35)f=3}
  tiles.forEach((e,i)=>C(e,'on',i===f));stars.forEach((e,i)=>T(e,i===f?'★':'☆'));T(bdg,NAME[f]);
  const vh=s0?638:894,a=A[f],cw=Math.min(1106,(vh-27)*a),ch=cw/a,cx=(1131-cw)/2,cy=(vh-ch)/2,h=Math.min(.912*ch,.95*cw/.966),w=h*.966;
  S(cv,'left',cx.toFixed(1)+'px');S(cv,'top',cy.toFixed(1)+'px');S(cv,'width',cw.toFixed(1)+'px');S(cv,'height',ch.toFixed(1)+'px');
  S(ph,'left',((cw-w)/2).toFixed(1)+'px');S(ph,'top',((ch-h)/2).toFixed(1)+'px');S(ph,'width',w.toFixed(1)+'px');S(ph,'height',h.toFixed(1)+'px');
  S(rf,'left',(cx+cw-45.5).toFixed(1)+'px');S(rf,'top',(cy+10.5).toFixed(1)+'px');S(zm,'top',(vh-45)+'px');
  /* the pointer */
  const wp=WAY[sc];let i=0;while(i<wp.length-2&&u>=wp[i+1][0])i++;const p=wp[i],n=wp[i+1],k=ez((u-p[0])/(n[0]-p[0]));let down=false;CLICK[sc].forEach(c=>{if(win(u,c,c+.14))down=true});
  S(cur,'transform','translate('+(p[1]+(n[1]-p[1])*k-4).toFixed(1)+'px,'+(p[2]+(n[2]-p[2])*k-2).toFixed(1)+'px) scale('+(down?.82:1)+')')};
 const put=domScreen(el,1512,950);
 const o={n:3,a:1512/950,mesh:null,get sc(){return sc},
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;draw()}return}u+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0}draw()},
  next(){sc=(sc+1)%3;u=0;draw()},seek(a,b){sc=a;u=b;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 draw();window.__dup=o;return o}catch(e){window.__duerr=String(e&&e.stack||e);return null}})();
