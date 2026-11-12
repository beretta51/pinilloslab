/* troveloapp.com's own template engine and scene logic, untouched */
const TVLIB=(function(){'use strict';try{
/*__TVXCODE__*/
return{mount,Scene1}}catch(e){return null}})();
/* ---------- Trovelo, the real recreation: three moments of the app (a day filling up, Optimize, What's nearby) ---------- */
const TVP=(()=>{if(!TVLIB||!TVX||!TVX.hero)return null;try{
 const fix=s=>s.replace(/\/images\/trovelo\/([\w.-]+)(\?[\w.=&-]*)?/g,(m,n)=>TVIMG[n]||m),el=document.getElementById('scr'),st=document.createElement('style');
 st.textContent=fix(TVX.css);document.head.insertBefore(st,document.head.querySelector('style'));
 el.innerHTML='<div class="tvx">'+fix(TVX.hero)+fix(TVX.map)+'<i class="isl"></i></div>';
 const ips=el.querySelectorAll('.ip'),s1=new TVLIB.Scene1();s1.setup();const isl=TVLIB.mount(el);
 const DUR=[7.3,10.6,11],MODE=[null,'opt','near'];let sc=0,u=0,acc=0;const put=domScreen(el);
 /* the site's hero clock, without the waits for the Mac: Monday, Shibuya Sky lands, Tuesday, Ichiran lands */
 const hero=v=>v<3.1?4588+v*1000:v<4.4?7688+(v-3.1)*1000:Math.min(15250,12500+(v-4.4)*1000);
 const draw=()=>{s1.state.t=hero(sc===0?u:sc===1&&u<1?DUR[0]:0);s1.state.mapPick=sc?{mode:MODE[sc],at:0}:null;s1.state.at={ai:0,glance:0,map:sc?u*1000:0};
  const v=s1.renderVals();isl.forEach(g=>g.update(v));ips[0].classList.toggle('off',sc>0);ips[1].classList.toggle('off',!sc)};
 const o={n:3,mesh:null,get sc(){return sc},
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;acc=0;draw()}return}u+=dt;acc+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0;acc=1}if(acc>=.05){acc=0;draw()}},
  next(){sc=(sc+1)%3;u=0;acc=0;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 draw();window.__tvp=o;return o}catch(e){return null}})();
