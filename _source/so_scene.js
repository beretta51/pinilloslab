/* ---------- Solid, recreated from the app's own source: today's plan, logging a set with a swipe, the rest timer ---------- */
const SOP=(()=>{try{
 const el=document.getElementById('scrs'),SY=SOSYM,st=document.createElement('style');
 st.textContent=SOCSS+Object.keys(SY).map(k=>'.sox .sy-'+k+'{-webkit-mask-image:url('+SY[k].u+');mask-image:url('+SY[k].u+')}').join('');document.head.appendChild(st);
 const sy=(k,s,c)=>'<i class="sy sy-'+k+(c?' '+c:'')+'" style="width:'+(SY[k].w*s).toFixed(2)+'px;height:'+(SY[k].h*s).toFixed(2)+'px"></i>';
 /* MuscleGroup.iconColor, and Monday's routine */
 const MC={legs:'#39FF14',shoulders:'#FF9500',back:'#0099FF',chest:'#FF3B3B',cardio:'#FF2D78'};
 const EX=[['Pendulum Squat','legs',3,10,'10'],['Seated Leg Curl','legs',3,12,'20'],['Machine Shoulder Press','shoulders',3,10,'30'],['Lat Pulldown','back',3,10,'22.5'],['Machine Chest Press','chest',3,10,'25'],['Machine Lateral Raise','shoulders',3,12,'10'],['Stairmaster','cardio',0,0,'']];
 /* the training heat map: 27 weeks, Sunday on top; three sessions most weeks */
 const heat=Array.from({length:27},(_,w)=>'<span>'+Array.from({length:7},(_,d)=>{const last=w===26,h=(w*7+d)*2654435761%97,
   s=last?(d>1?'f':'r'):(d===1||d===3||d===5)?(h<9?'r':h<20?'p':'c'):(h<5?'c':'r');
   return '<i style="background:'+({c:'#C8FF00',p:'rgba(200,255,0,.4)',r:'rgba(255,255,255,.08)',f:'rgba(255,255,255,.03)'})[s]+'"></i>'}).join('')+'</span>').join('');
 const chart=(c,pts,id)=>'<svg viewBox="0 0 100 24" preserveAspectRatio="none"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c+'" stop-opacity=".28"/><stop offset="1" stop-color="'+c+'" stop-opacity=".02"/></linearGradient></defs>'+
  '<polygon points="0,24 '+pts+' 100,24" fill="url(#'+id+')"/><polyline points="'+pts+'" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
 const MET=[['WEIGHT','68.2',' kg','#C8FF00','0,17 16,15 33,16 50,12 66,13 83,8 100,6'],['LEAN MASS','53.8',' kg','#0099FF','0,18 16,16 33,17 50,14 66,15 83,10 100,7'],['FAT','21.1',' %','#BF5FFF','0,8 16,10 33,9 50,13 66,12 83,16 100,15']];
 el.innerHTML='<div class="sox">'+
  '<div class="so-home"><div class="hd"><div class="kk mo"><b>MON</b><span>· JUN 29</span></div><div class="tt an">FULL BODY</div></div>'+
   '<div class="strip"><div class="r mo"><span>TRAINING</span><em>HISTORY'+sy('chevron-right-bold',9)+'</em></div><div class="heat">'+heat+'</div></div>'+
   '<div class="band">'+MET.map((m,i)=>'<div><small class="mo" style="color:'+m[3]+'">'+m[0]+'</small><b class="an">'+m[1]+'<u>'+m[2]+'</u></b>'+chart(m[3],m[4],'sog'+i)+'</div>').join('')+'</div>'+
   '<div class="tw mo"><span>TODAY’S WORK</span><em>07</em></div><div class="so-rows">'+
   EX.map((e,i)=>'<div class="so-row'+(i?'':' up')+'"><span class="ix an">0'+(i+1)+'</span><i class="br" style="background:'+MC[e[1]]+'"></i><span class="tx"><b>'+e[0]+'</b>'+(i?(e[4]?'<small>LAST · '+e[4]+' KG</small>':''):'<small>UP NEXT</small>')+'</span>'+
    (e[2]?'<span class="rt an">'+e[2]+'<u> × </u>'+e[3]+'</span>':'<span class="rt mn">10 MIN</span>')+sy('chevron-right-bold',11,'cv')+'</div>').join('')+
   '</div><div class="so-bar"><div class="tg"><i class="th"></i><span>'+sy('bolt-fill-bold',18)+'</span><span>'+sy('calendar-badge-plus-bold',16)+'</span></div><div class="go">START WORKOUT</div></div></div>'+
  '<div class="so-wk"><div class="hd"><span class="cb">'+sy('xmark-bold',16)+'</span><span class="mid"><small class="mo">MON 29 · FULL BODY</small><b class="an">00:00</b></span><span class="cb tb">'+sy('timer-bold',18)+'</span></div>'+
   '<div class="so-list"><div class="so-open"><div class="so-cw"><div class="rvl">'+sy('checkmark-bold',24)+'</div><div class="so-cd"><div class="ch mo"><b>LEGS</b><span>LAST · 10 KG × 10</span></div><div class="nm">Pendulum Squat</div>'+
   '<div class="pl"><div class="w"><small class="mo">WEIGHT'+sy('arrow-up-arrow-down-bold',7)+'</small><b class="an">10<u>KG</u></b></div><div class="r"><small class="mo">REPS'+sy('arrow-up-arrow-down-bold',7)+'</small><b class="an">10</b></div></div>'+
   '<div class="sp"><small class="mo">SET 1 OF 3</small><div><i></i><i></i><i></i></div></div></div></div><div class="so-log"><div>'+sy('checkmark-black',14)+'<span>LOG SET 1</span></div><small class="mo">OR SWIPE RIGHT</small></div></div>'+
   EX.slice(1).map(e=>'<div class="so-col"><i class="br" style="background:'+MC[e[1]]+'"></i><span class="tx"><b>'+e[0]+'</b><small>'+(e[2]?e[4]+' KG × '+e[3]+' · '+e[2]+' SETS':'10 MIN')+'</small></span><span class="dt">'+(e[2]?'<i></i><i></i><i></i>':'<i></i>')+'</span></div>').join('')+'</div>'+
   '<div class="so-rest"><div class="lb mo">REST</div><div class="ct an">0:45</div><div class="nx"><small class="mo">UP NEXT</small><b>Pendulum Squat</b><div class="bs"><i class="dn"></i><i></i><i></i></div><div class="ft mo"><span>SET 2/3</span><span>10 KG × 10</span></div></div>'+
   '<div class="qc"><span>−15</span><span>+15</span><span>SKIP</span></div><div class="ctl"><span>'+sy('slider-vertical-3-bold',20)+'</span><div>'+sy('pause-fill-bold',17)+'PAUSE</div><span>'+sy('speaker-wave-2-fill-bold',20)+'</span></div></div></div>'+
  '<div class="so-sb"><span>9:41</span><span>'+sy('cellularbars-regular',15)+sy('wifi-regular',15)+sy('battery-100percent-regular',19)+'</span></div><span class="so-tch"></span><i class="isl"></i></div>';
 const q=s=>el.querySelector(s),qa=s=>[...el.querySelectorAll(s)],wk=q('.so-wk'),go=q('.so-bar .go'),clock=q('.so-wk .mid b'),tbtn=q('.so-wk .tb'),cd=q('.so-cd'),rvl=q('.rvl'),setLb=q('.so-cd .sp small'),bars=qa('.so-cd .sp i'),
  logLb=q('.so-log span'),rest=q('.so-rest'),rlb=q('.so-rest .lb'),ct=q('.so-rest .ct'),chipsQ=qa('.so-rest .qc span'),tch=q('.so-tch');
 const S=(e,k,v)=>{const c=e._s||(e._s={});if(c[k]!==v){c[k]=v;e.style[k]=v}},C=(e,k,on)=>{const c=e._c||(e._c={});if(c[k]!==on){c[k]=on;e.classList.toggle(k,on)}},T=(e,v)=>{if(e._t!==v){e._t=v;e.textContent=v}};
 const ez=x=>x<=0?0:x>=1?1:x*x*(3-2*x),win=(u,a,b)=>u>=a&&u<b,p2=n=>(n<10?'0':'')+n;
 /* three scenes: Today → the workout opens and a swipe logs set 1 → rest counts down, −15 twice, GET READY, skip, close */
 const DUR=[3.4,5.2,8.8],SWIPE=1.6,LOG=2.2;let sc=0,u=0;
 const draw=()=>{const s0=sc===0,s1=sc===1,s2=sc===2;
  const open=s1||(s2&&u<7.95)||(s0&&u>=2.9),logged=(s1&&u>=LOG)||s2,sets=logged?1:0;
  C(wk,'on',open);C(go,'hit',s0&&win(u,2.6,2.9));
  T(clock,'00:'+p2(s1?Math.floor(u):s2?Math.floor(5.2+u):0));
  /* the card follows the finger at 0.4 of its travel (SetsCard.resistance) and springs back once the set is logged */
  const drag=s1?(u<SWIPE?0:u<LOG?ez((u-SWIPE)/(LOG-SWIPE)):Math.max(0,1-(u-LOG-.05)/.28)):0,off=60*(drag>0?drag:0);
  S(cd,'transform',off?'translateX('+off.toFixed(1)+'px)':'none');S(rvl,'opacity',Math.min(1,off/60).toFixed(2));
  T(setLb,'SET '+(sets+1)+' OF 3');T(logLb,'LOG SET '+(sets+1));bars.forEach((b,i)=>{C(b,'dn',i<sets);C(b,'lv',i===sets)});
  /* rest: 45 s from the moment the set is logged; each −15 takes fifteen off */
  const e=s1?u-LOG-.05:s2?2.95+u:0,cut=s2?(u>=.9?15:0)+(u>=1.7?15:0):0,rem=Math.max(0,45-Math.floor(e)-cut),up=(s1&&u>=LOG+.05)||(s2&&u<5.5),hot=up&&rem<=10;
  C(rest,'on',up);C(rest,'hot',hot);C(tbtn,'off',up);if(up){T(ct,'0:'+p2(rem));T(rlb,hot?'GET READY':'REST')}
  const f=e-Math.floor(e),beat=hot?(f<.1?f/.1:Math.max(0,1-(f-.1)/.35)):0;S(ct,'transform',beat?'scale('+(1+.05*beat).toFixed(3)+')':'none');
  chipsQ.forEach((c,i)=>C(c,'hit',s2&&(i===0&&(win(u,.9,1.05)||win(u,1.7,1.85))||i===2&&win(u,5.4,5.55))));
  /* the finger */
  let t=null;
  if(s0){if(win(u,2.45,3))t=[263,784]}
  else if(s1){if(win(u,SWIPE-.2,LOG+.1))t=[120+150*ez((u-SWIPE)/(LOG-SWIPE)),300]}
  else if(win(u,.65,1.1)||win(u,1.45,1.9))t=[85,557];else if(win(u,5.15,5.6))t=[317,557];else if(win(u,7.5,8.05))t=[42,94];
  if(t)S(tch,'transform','translate('+t[0].toFixed(1)+'px,'+t[1].toFixed(1)+'px)');C(tch,'on',!!t)};
 const put=domScreen(el);
 const o={n:3,mesh:null,get sc(){return sc},
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;draw()}return}u+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0}draw()},
  next(){sc=(sc+1)%3;u=0;draw()},seek(a,b){sc=a;u=b;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 draw();window.__sop=o;return o}catch(e){window.__soerr=String(e&&e.stack||e);return null}})();
