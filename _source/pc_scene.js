/* ---------- Percha, recreated from the app's own source: building an outfit, the wardrobe, planning the week ---------- */
const PCP=(()=>{try{
 const el=document.getElementById('scrp'),SY=PCSYM,G=PCG,st=document.createElement('style');
 st.textContent=PCCSS+Object.keys(SY).map(k=>'.pcx .sy-'+k+'{-webkit-mask-image:url('+SY[k].u+');mask-image:url('+SY[k].u+')}').join('')+
  Object.keys(G).map(k=>'.pcx .gm-'+k+'{background-image:url('+G[k].j+');-webkit-mask-image:url('+G[k].m+');mask-image:url('+G[k].m+')}').join('');
 document.head.appendChild(st);
 /* an SF Symbol at a SwiftUI font size, and a piece of clothing fitted inside a box (scaledToFit) */
 const sy=(k,s,c)=>'<i class="sy sy-'+k+(c?' '+c:'')+'" style="width:'+(SY[k].w*s).toFixed(2)+'px;height:'+(SY[k].h*s).toFixed(2)+'px"></i>';
 const gm=(k,bw,bh)=>{const g=G[k],s=Math.min(bw/g.w,bh/g.h);return '<i class="gm gm-'+k+'" style="width:'+(g.w*s).toFixed(1)+'px;height:'+(g.h*s).toFixed(1)+'px"></i>'};
 /* OutfitBuilderView.outfitStack: 60% wide cards, zones of 37.5 / 37.5 / 25 % that overlap by 44 pt */
 const TH=501,OV=44,ZH=[TH*.375+OV,TH*.375+OV,TH*.25],ZT=[0,ZH[0]-OV,ZH[0]+ZH[1]-OV*2],ZZ=[3,1,2],
  ZONES=[['beetop','wrap','ruffle','tee'],['skort','skirt','jeans'],['strappy','wedge','sneakers']];
 /* the wardrobe, newest first, and the week */
 const W=[['tee','tops'],['ruffle','tops'],['beetop','tops'],['overall','dresses'],['wrap','tops'],['romper','dresses'],['skort','bottoms'],['skirt','bottoms'],['dress','dresses'],
  ['wedge','shoes'],['strappy','shoes'],['sneakers','shoes'],['denim','outerwear'],['blazer','outerwear'],['sweater','tops'],['jeans','bottoms'],['bag','accessories'],['brownbag','accessories']],
  CATS=[null,'tops','bottoms','dresses','outerwear','shoes','accessories'],CATN=['All','Tops','Bottoms','Dresses','Outerwear','Shoes','Accessories'];
 const DAYS=[['S',8,'past',null],['M',9,'past',['tee','jeans','sneakers'],'Casual Black'],['T',10,'past',['sweater','skirt','wedge'],'Casual Green'],['W',11,'today',['beetop','skort','strappy','bag'],'Casual Beige'],
  ['T',12,'',['ruffle','skirt','wedge'],'Casual Pink'],['F',13,'',['wrap','skort','strappy','brownbag'],'Casual Blue'],['S',14,'',['dress','wedge','bag'],'Casual Pink']];
 const STY=[['figure-walk','Casual','3 outfits'],['briefcase','Work','2 outfits'],['moon-stars','Night',''],['party-popper','Party','1 outfit'],['figure-run','Sport','']];
 el.innerHTML='<div class="pcx">'+
  '<div class="pc-v pc-out on"><div class="hd"><div class="pc-h1">Outfits</div><small>What would you like to wear today?</small><span class="gb glass">'+sy('rectangle-stack-fill-semibold',17)+'</span></div>'+
   '<div class="chips"><span class="on">Casual</span><span>Work</span><span>Night</span><span>Party</span><span>Sport</span></div><div class="pc-stk">'+
   ZONES.map((z,i)=>'<div class="pc-row" style="top:'+ZT[i].toFixed(1)+'px;height:'+ZH[i].toFixed(1)+'px;z-index:'+ZZ[i]+'"><div class="trk">'+z.map(k=>'<span>'+gm(k,241,ZH[i]*[.76,1,.86][i])+'</span>')   /* the app's photos carry their own margin; these cut-outs are trimmed, so tops and shoes get some back */.join('')+'</div></div>').join('')+
   '<div class="pc-acc"><span class="gb glass">'+sy('bag-semibold',17)+'</span>'+['bag','brownbag'].map(k=>'<span class="it off">'+gm(k,90,90)+'<i class="x">'+sy('xmark-bold',12)+'</i></span>').join('')+'</div></div>'+
   '<div class="pc-btns"><span class="n">3</span><span class="sv">Save Outfit</span><span class="wd">'+sy('wand-and-sparkles-semibold',17)+'</span></div></div>'+
  '<div class="pc-v pc-war"><span class="plus glass">'+sy('plus',19)+'</span><div class="pc-h1">My wardrobe</div><div class="srch">'+sy('magnifyingglass',16)+'Search by color, brand or tag</div>'+
   '<div class="chips">'+CATN.map((c,i)=>'<span'+(i?'':' class="on"')+'>'+c+'</span>').join('')+'</div><div class="pc-grid">'+W.map(w=>'<div class="pc-cell">'+gm(w[0],94,134)+'</div>').join('')+'</div></div>'+
  '<div class="pc-v pc-cal"><div class="wk">'+sy('chevron-left',20)+'<span>Nov 8 – 14</span>'+sy('chevron-right',20)+'</div><i class="ln" style="top:114px"></i><div class="pc-days"><div class="in">'+
   DAYS.map(d=>'<div class="pc-day '+d[2]+(d[3]&&d[2]?' has':'')+'"><span class="pl"><small>'+d[0]+'</small><b>'+d[1]+'</b></span><span class="no"><i class="bx">'+sy(d[2]==='past'?'minus':'plus',14)+'</i>'+(d[2]==='past'?'Not logged':'Not planned')+'</span>'+
    (d[3]?'<span class="of"><div>'+d[3].map(k=>'<span>'+gm(k,44,44)+'</span>').join('')+'</div><b>'+d[4]+'</b></span>':'')+sy('chevron-right-semibold',12,'cv')+'</div>').join('')+
   '</div></div><i class="ln" style="top:698.5px"></i><div class="pc-plan"><span class="a">'+sy('wand-and-stars-semibold',15)+'Plan my week · 3 days</span><span class="b">'+sy('checkmark-circle-fill-semibold',15)+'Week complete</span></div>'+
   '<i class="pc-dim"></i><div class="pc-sheet"><i class="gr"></i><div class="nav"><span class="glass">Close</span>Plan week</div><div class="pk"><p>3 days unplanned. Pick a style and we’ll fill your week automatically.</p><div class="ls">'+
   STY.map(s=>'<div'+(s[2]?'':' class="none"')+'><span class="ic">'+sy(s[0],17)+'</span>'+s[1]+'<em>'+(s[2]||'No outfits')+'</em>'+(s[2]?sy('chevron-right-semibold',12,'cv'):'')+'</div>').join('')+
   '</div></div><div class="dn">'+sy('checkmark-circle-fill-regular',60)+'<b>Week planned!</b>Tap any day to change its outfit</div></div></div>'+
  '<div class="pc-tab glass">'+['house-fill','tshirt-fill','rectangle-stack-fill','calendar','person-fill'].map(k=>'<span>'+sy(k,21)+'</span>').join('')+'</div>'+
  '<div class="pc-sb"><span>9:41</span><span>'+sy('cellularbars-regular',15)+sy('wifi-regular',15)+sy('battery-100percent-regular',19)+'</span></div><span class="pc-tch"></span><i class="isl"></i></div>';
 const q=s=>el.querySelector(s),qa=s=>[...el.querySelectorAll(s)],views=qa('.pc-v'),tabs=qa('.pc-tab span'),trks=qa('.pc-row .trk'),accs=qa('.pc-acc>span'),wand=q('.pc-btns .wd'),
  chips=qa('.pc-war .chips span'),cells=qa('.pc-cell'),days=qa('.pc-day'),daysIn=q('.pc-days .in'),plan=q('.pc-plan'),dim=q('.pc-dim'),sheet=q('.pc-sheet'),casual=q('.pc-sheet .ls div'),tch=q('.pc-tch');
 el.firstChild.appendChild(dim);el.firstChild.appendChild(sheet);   // the sheet belongs to the whole screen: it covers the tab bar too
 const S=(e,k,v)=>{const c=e._s||(e._s={});if(c[k]!==v){c[k]=v;e.style[k]=v}},C=(e,k,on)=>{const c=e._c||(e._c={});if(c[k]!==on){c[k]=on;e.classList.toggle(k,on)}};
 const ez=x=>x<=0?0:x>=1?1:x*x*(3-2*x),win=(u,a,b)=>u>=a&&u<b;
 const DUR=[8.9,6.3,8.9],TAB=[2,1,3],TX=i=>61.8+69.6*i,TY=817,SW=[[.9,319],[2.3,507],[3.7,641]],CH=[[1.3,3],[2.9,1],[4.4,0]];let sc=0,u=0;
 const draw=()=>{const s0=sc===0,s1=sc===1,s2=sc===2;
  views.forEach((v,i)=>C(v,'on',i===sc));tabs.forEach((t,i)=>C(t,'on',i===TAB[sc]));
  /* outfits: three swipes, then the wand shuffles everything and picks an accessory */
  let ix=[0,0,0],acc=0;if(s0){SW.forEach((w,i)=>{if(u>=w[0]+.1)ix[i]=1});if(u>=5.45){ix=[2,0,0];acc=1}if(u>=7.05){ix=[3,2,1];acc=2}}
  trks.forEach((t,i)=>S(t,'transform','translateX('+(-251*ix[i])+'px)'));accs.forEach((a,i)=>C(a,'off',i!==acc));C(wand,'hit',s0&&(win(u,5.3,5.5)||win(u,6.9,7.1)));
  /* wardrobe: a category chip filters the grid */
  let cat=null;if(s1)CH.forEach(c=>{if(u>=c[0]+.05)cat=CATS[c[1]]});
  chips.forEach((c,i)=>C(c,'on',CATS[i]===cat));let n=0;
  cells.forEach((c,i)=>{const show=!cat||W[i][1]===cat;if(show){const k=n++;c._t='translate('+(16+(k%3)*127.33).toFixed(1)+'px,'+Math.floor(k/3)*172+'px)'}S(c,'transform',show?c._t:c._t+' scale(.8)');S(c,'opacity',show?'1':'0')});
  /* calendar: Plan my week, pick Casual, the three open days fill in */
  const planned=s2&&u>=3.3,up=s2&&win(u,1.5,4.7);
  C(dim,'on',up);C(sheet,'on',up);C(sheet,'ok',s2&&win(u,3.25,5.4));C(casual,'hit',s2&&win(u,3,3.25));C(plan,'done',planned);
  days.forEach((d,i)=>{if(i>3)C(d,'has',planned)});S(daysIn,'transform',s2&&u>=5.7?'translateY(-46px)':'none');S(daysIn,'transition',s2?'transform .55s cubic-bezier(.2,.9,.3,1)':'none');
  /* the finger */
  let t=null;
  if(u>DUR[sc]-.45)t=[TX(TAB[(sc+1)%3]),TY];else if(u<.14)t=[TX(TAB[sc]),TY];
  else if(s0){SW.forEach(w=>{if(win(u,w[0]-.2,w[0]+.42))t=[292-170*ez((u-w[0]+.04)/.4),w[1]]});if(win(u,5.2,5.6)||win(u,6.8,7.2))t=[356,746]}
  else if(s1)CH.forEach(c=>{if(win(u,c[0]-.3,c[0]+.2)){const e=chips[c[1]];t=[e.offsetLeft+e.offsetWidth/2,229]}});
  else if(win(u,1.25,1.7))t=[201,737];else if(win(u,2.8,3.3))t=[150,581];else if(win(u,5.5,6.2))t=[240,580-46*ez((u-5.65)/.5)];
  if(t)S(tch,'transform','translate('+t[0].toFixed(1)+'px,'+t[1].toFixed(1)+'px)');C(tch,'on',!!t)};
 const put=domScreen(el);
 const o={n:3,mesh:null,get sc(){return sc},
  tick(dt,active){if(!active){if(sc||u){sc=0;u=0;draw()}return}u+=dt;if(u>=DUR[sc]){sc=(sc+1)%3;u=0}draw()},
  next(){sc=(sc+1)%3;u=0;draw()},seek(a,b){sc=a;u=b;draw()},
  place(cam,W,H,on){put(o.mesh,cam,W,H,on)}};
 draw();window.__pcp=o;return o}catch(e){window.__pcerr=String(e&&e.stack||e);return null}})();
