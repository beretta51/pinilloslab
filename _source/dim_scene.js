/* ---------- Dimmly, recreated from the app's own source: a list being used (a streak, a swipe to Done), the dimmer, the lists ---------- */
const DMP=(()=>{try{
 const el=document.getElementById('scrd'),SY=DIMSYM,st=document.createElement('style');
 st.textContent=DIMCSS+Object.keys(SY).map(k=>'.dmx .sy-'+k+'{-webkit-mask-image:url('+SY[k].u+');mask-image:url('+SY[k].u+')}').join('');document.head.appendChild(st);
 /* an SF Symbol at a SwiftUI font size: the glyph's own box, scaled */
 const sy=(k,s,x)=>'<i class="sy sy-'+k+'" style="width:'+(SY[k].w*s).toFixed(2)+'px;height:'+(SY[k].h*s).toFixed(2)+'px;'+(x||'')+'"></i>';
 /* ListPalette.all, the ones on screen */
 const PAL={lisbon:'ff5400 ff6d00 ff8500 ff9100 ff9e00 00b4d8 0096c7 0077b6 023e8a 03045e',fiery:'ff4800 ff5400 ff6000 ff6d00 ff7900 ff8500 ff9100 ff9e00 ffaa00 ffb600',
  ember:'03071e 370617 6a040f 9d0208 d00000 dc2f02 e85d04 f48c06 faa307 ffba08',algarve:'001219 005f73 0a9396 94d2bd e9d8a6 ee9b00 ca6702 bb3e03 ae2012 9b2226',
  rose:'590d22 800f2f a4133c c9184a ff4d6d ff758f ff8fa3 ffb3c1 ffccd5 fff0f3',ocean:'0466c8 0353a4 023e7d 002855 001845 001233 33415c 5c677d 7d8597 979dac',
  ultra:'ffbd00 ff9800 ff7200 ff5400 ff2a2a ff0054 d0005a 9e0059 6b0078 390099',raindrops:'f72585 b5179e 7209b7 560bad 480ca8 3a0ca3 3f37c9 4361ee 4895ef 4cc9f0'};
 for(const k in PAL)PAL[k]=PAL[k].split(' ').map(h=>[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]);
 /* QuadlyViewModel.gradientColor(at:) and dimColor: sample the stops, then scale by the list's dim level */
 const grad=(p,t,d)=>{const s=Math.max(0,Math.min(1,t))*(p.length-1),a=Math.floor(s),b=Math.min(a+1,p.length-1),f=s-a;return 'rgb('+[0,1,2].map(i=>Math.round((p[a][i]+(p[b][i]-p[a][i])*f)*d)).join(',')+')'};
 const LISTS=[['Daily Routine','lisbon',1,'list-bullet-rectangle-portrait',8],['Dimmly Features!','fiery',1,'list-bullet-rectangle-portrait',16],['MWF Workout','ember',0,'number',11],['Groceries','algarve',0,'cart',9],
  ['NYC Trip Prep','rose',0,'list-bullet-rectangle-portrait',3],['Game Night','ocean',0,'trophy',8],['Top 10 Movies','ultra',0,'flame',10],['Someday','raindrops',0,'list-bullet-rectangle-portrait',5]];
 const ITEMS=[{t:'Drink a glass of water',st:4},{t:'Take Pills',st:3,bell:1,rep:1},{t:'Deep work block',bell:1},{t:'Grocery Run',ck:'2/10',rep:1},{t:'Journaling',note:1},{t:'Evening walk'},{t:'Plan the day'},{t:'Cold shower'}],GONE=[5,6],P=PAL.lisbon;   // two get swiped to Done: with six left, every card sits on a clean colour of the palette
 const sb='<div class="dm-sb"><span>9:41</span><span>'+sy('cellularbars-regular',15)+sy('wifi-regular',15)+sy('battery-100percent-regular',19)+'</span></div>';
 el.innerHTML='<div class="dmx"><div class="dm-home"><img class="dm-logo" alt="" src="'+DIMLOGO+'"><div class="dm-rows">'+
  LISTS.map(l=>'<div class="dm-lr"><span class="dm-sw">'+PAL[l[1]].map(c=>'<i style="background:rgb('+c+')"></i>').join('')+'</span><b>'+l[0]+'</b>'+(l[2]?sy('pin-fill',11,'').replace('class="sy','class="pin sy'):'')+sy(l[3],15).replace('class="sy','class="md sy')+'<em>'+l[4]+'</em></div>').join('')+
  '</div><div class="dm-pill dm-glass" style="right:76px"><span>'+sy('arrow-down-document',20)+'</span><u></u><span>'+sy('slider-vertical-3',20)+'</span><u></u><span>'+sy('info-circle',20)+'</span></div><div class="dm-add dm-glass">'+sy('plus-semibold',20)+'</div></div>'+
  '<div class="dm-list on"><div class="dm-hd"><span class="bk">'+sy('arrow-left-semibold',20)+'</span><b>Daily Routine</b><span class="sun">'+sy('sun-max-fill',17)+'</span></div><div class="dm-tb">'+
  ITEMS.map(it=>'<div class="dm-r"><span class="rv">'+sy('checkmark-black',18)+'</span><div class="c"><span class="t">'+it.t+'</span>'+
   (it.st?'<span class="tr">'+Array.from({length:it.st},()=>sy('circle-dotted',20)).join('')+'</span>':it.ck?'<span class="tr ck"><span>'+it.ck+'</span>'+sy('checklist',19)+'</span>':it.note?'<span class="tr nt">'+sy('text-pad-header',19)+'</span>':'')+
   (it.bell||it.rep?'<span class="bd">'+(it.bell?sy('bell-fill-semibold',10):'')+(it.rep?sy('repeat-semibold',10):'')+'</span>':'')+'</div></div>').join('')+
  '<div class="dm-done"><div class="h">Done<span>·  1</span>'+sy('trash',13)+'</div>'+GONE.map(i=>'<div class="r"><b>'+ITEMS[i].t+'</b><small>9:41 AM</small></div>').join('')+'</div>'+
  '<div class="dm-dim" style="top:12px"><div class="dm-sl dm-glassl">'+sy('sun-max-fill',14)+'<div class="dm-trk"><i class="dm-fill"></i><i class="dm-knob"></i></div>'+sy('sun-min-fill',14)+'</div><span class="dm-gb dm-glassl">'+sy('gearshape',20)+'</span><span class="dm-gb dm-glassl">'+sy('rectangle-compress-vertical',20)+'</span></div></div>'+
  '<div class="dm-pill dm-glass" style="right:16px"><span>'+sy('arrow-down-doc',20)+'</span><u></u><span>'+sy('arrow-up-doc',20)+'</span><u></u><span>'+sy('sharedwithyou-slash',20)+'</span><u></u><span>'+sy('info-circle',20)+'</span></div></div>'+
  sb+'<span class="dm-tch"></span><i class="isl"></i></div>';
 const q=s=>el.querySelector(s),qa=s=>[...el.querySelectorAll(s)],list=q('.dm-list'),hd=q('.dm-hd'),sun=q('.dm-hd .sun .sy'),rows=qa('.dm-r'),cards=qa('.dm-r .c'),rvs=GONE.map(i=>rows[i].querySelector('.rv')),dn=q('.dm-done .h span'),drs=qa('.dm-done .r'),
  dots=rows.map(r=>[...r.querySelectorAll('.tr:not(.ck):not(.nt) .sy')]),done=q('.dm-done'),dim=q('.dm-dim'),knob=q('.dm-knob'),fill=q('.dm-fill'),tch=q('.dm-tch'),home0=q('.dm-lr');
 /* touch a style or a class only when it changes: this runs every frame */
 const S=(e,k,v)=>{const c=e._s||(e._s={});if(c[k]!==v){c[k]=v;e.style[k]=v}},C=(e,k,on)=>{const c=e._c||(e._c={});if(c[k]!==on){c[k]=on;e.classList.toggle(k,on)}};
 const sym=(e,k,o,fs)=>{if(e._k!==k){const was=e._k;e.className='sy sy-'+k+(was&&k!=='circle-dotted'?' pop':'');e._k=k;if(fs){e.style.width=(SY[k].w*fs).toFixed(2)+'px';e.style.height=(SY[k].h*fs).toFixed(2)+'px'}}S(e,'opacity',o)};
 const ez=x=>x<=0?0:x>=1?1:x*x*(3-2*x),out=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3),win=(u,a,b)=>u>=a&&u<b;
 const DUR=[6.7,8.2,3.6],AT=[2.3,4.2];let sc=0,u=0,kk=1;   // AT: when each swipe starts
 const KY=k=>12+14+SY['sun-max-fill'].h*14+10+19+(1-k)*162;   // the knob's centre inside the list area, k = 0 (dimmest) … 1
 const draw=()=>{
  const first=sc===0,dm=sc===1,
   sp0=first&&u<1.25||sc===2?2:3,
   sws=AT.map(a=>{const v=u-a;return first?(v<0?0:v<.85?out(v/.85)*170:v<1.11?170+ez((v-.85)/.26)*232:402):0}),gone=AT.map(a=>first?u>=a+1.11:dm),
   k=dm?(u<1.9?1:u<3.5?1-ez((u-1.9)/1.6):u<4.7?0:u<5.9?ez((u-4.7)/1.2):1):1,d=.3+.7*k,
   open=first||(dm&&u<7.55)||(sc===2&&u>=2.7),panel=dm&&win(u,.85,6.55);
  C(list,'on',open);C(list,'dimming',dm&&win(u,1.8,6));C(dim,'on',panel);C(home0,'hit',sc===2&&win(u,2.4,2.9));
  S(hd,'backgroundColor',grad(P,0,d));sym(sun,d<1?'sun-min-fill':'sun-max-fill','',17);
  let n=0;const ng=gone.filter(Boolean).length,N=ITEMS.length-ng;
  ITEMS.forEach((it,i)=>{const r=rows[i],c=cards[i],gi=GONE.indexOf(i),off=gi>=0&&gone[gi],idx=off?n:n++;
   S(r,'top',idx*82+'px');S(r,'opacity',off?'0':'1');S(c,'backgroundColor',grad(P,(idx+1)/(N+1),d));
   if(it.st){const sp=i===0?sp0:1;dots[i].forEach((e,j)=>sym(e,j<sp?(j+1)+'-circle-fill':'circle-dotted',j<sp?'1':'.8'))}});
  GONE.forEach((i,j)=>{const sw=sws[j],rv=rvs[j];S(cards[i],'transform',sw?'translateX('+sw.toFixed(1)+'px)':'none');S(rv,'width',Math.min(402,sw).toFixed(1)+'px');S(rv.firstChild,'opacity',sw>10?Math.min(1,(sw-10)/50).toFixed(2):'0');C(rv,'hot',sw>80);S(drs[j],'opacity',gone[j]?'1':'0')});
  S(done,'top',N*82+22+'px');C(done,'on',ng>0);if(dn._n!==ng&&ng){dn._n=ng;dn.textContent='·  '+ng}
  kk=k;S(knob,'transform','translateY('+((1-k)*162).toFixed(1)+'px)');S(fill,'height',(19+k*162).toFixed(1)+'px');
  /* the finger: where it is now, if it is down */
  let t=null;
  if(first){if(win(u,.85,1.4))t=[342,161];else AT.forEach((a,j)=>{if(win(u,a-.25,a+.85))t=[70+Math.min(sws[j],170),571]})}
  else if(dm){if(win(u,.45,.95))t=[370,91];else if(win(u,1.55,6.05))t=[366,120+KY(k)];else if(win(u,6.25,6.7))t=[150,560];else if(win(u,7.15,7.65))t=[32,91]}
  else if(win(u,2.25,2.8))t=[210,169];
  if(t)S(tch,'transform','translate('+t[0].toFixed(1)+'px,'+t[1].toFixed(1)+'px)');C(tch,'on',!!t)};
 const put=domScreen(el);
 const o={n:3,mesh:null,get sc(){return sc},get k(){return kk},   // k: the dimmer, 1 = full colour; the room dims with it
 
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;draw()}return}u+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0}draw()},
  next(){sc=(sc+1)%3;u=0;draw()},seek(a,b){sc=a;u=b;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 draw();window.__dmp=o;return o}catch(e){window.__dmerr=String(e&&e.stack||e);return null}})();
