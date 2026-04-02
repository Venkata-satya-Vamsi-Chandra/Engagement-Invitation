/* VAMSI & SATYA v4 — JS */
(function(){
'use strict';
const WED=new Date('2026-04-29T06:00:00+05:30');
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

/* THEME TOGGLE */
const html=document.documentElement;
const thBtn=$('#themeToggle');
const saved=localStorage.getItem('wt');
if(saved)html.dataset.theme=saved;
thBtn.addEventListener('click',()=>{
  const next=html.dataset.theme==='dark'?'light':'dark';
  html.dataset.theme=next;
  localStorage.setItem('wt',next);
  thBtn.classList.add('spin');
  setTimeout(()=>thBtn.classList.remove('spin'),600);
});

/* CURSOR */
const cur=$('#cur'),trail=$('#trail');
let mx=0,my=0,cx=0,cy=0,tx=0,ty=0;
if(window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.btn,.g-item,.ring-panel'))trail.classList.add('hov')});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.btn,.g-item,.ring-panel'))trail.classList.remove('hov')});
  (function lp(){cx+=(mx-cx)*.15;cy+=(my-cy)*.15;tx+=(mx-tx)*.08;ty+=(my-ty)*.08;cur.style.transform=`translate(${cx-6}px,${cy-6}px)`;trail.style.transform=`translate(${tx-16}px,${ty-16}px)`;requestAnimationFrame(lp)})();
}

/* SCROLL */
const sp=$('#scrollProgress');
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  sp.style.width=h>0?(window.scrollY/h*100)+'%':'0%';
  $('#btt').classList.toggle('visible',window.scrollY>window.innerHeight*.5);
  let cur='';$$('section[id]').forEach(s=>{if(window.scrollY>=s.offsetTop-250)cur=s.id});
  $$('.nav-links a').forEach(a=>a.classList.toggle('active',a.dataset.section===cur));
});

/* NAV */
const nT=$('#navToggle'),nL=$('#navLinks');
nT.addEventListener('click',()=>{nT.classList.toggle('active');nL.classList.toggle('open')});
$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nT.classList.remove('active');nL.classList.remove('open')}));

/* BTT */
$('#btt').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* PETAL CANVAS — multi-color, multi-shape */
const pc=$('#petalCanvas'),pctx=pc.getContext('2d');
let petals=[];
const pColors=['#E2A855','#F5D48A','#C17F3E','#E8667A'];
const isMob=window.innerWidth<768;
const maxP=isMob?12:25;
function rPC(){pc.width=pc.parentElement.offsetWidth;pc.height=pc.parentElement.offsetHeight}
rPC();window.addEventListener('resize',rPC);
function mkP(){if(petals.length>=maxP)return;
  const shape=Math.floor(Math.random()*3);// 0=tear,1=diamond,2=circle
  petals.push({x:Math.random()*pc.width,y:-15,sz:8+Math.random()*10,vy:.4+Math.random()*1.2,vx:(Math.random()-.5)*.4,rot:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.03,sf:.005+Math.random()*.01,ph:Math.random()*Math.PI*2,op:.4+Math.random()*.4,t:0,c:pColors[Math.floor(Math.random()*pColors.length)],sh:shape})}
function drP(p){
  pctx.save();pctx.translate(p.x,p.y);pctx.rotate(p.rot);pctx.globalAlpha=p.op;pctx.fillStyle=p.c;
  if(p.sh===0){// teardrop
    pctx.beginPath();pctx.moveTo(0,-p.sz);pctx.bezierCurveTo(p.sz*.6,-p.sz*.6,p.sz*.6,p.sz*.3,0,p.sz);pctx.bezierCurveTo(-p.sz*.6,p.sz*.3,-p.sz*.6,-p.sz*.6,0,-p.sz);pctx.fill();
  }else if(p.sh===1){// diamond
    const s=p.sz*.7;pctx.beginPath();pctx.moveTo(0,-s);pctx.quadraticCurveTo(s*.6,0,0,s);pctx.quadraticCurveTo(-s*.6,0,0,-s);pctx.fill();
  }else{// circle
    pctx.beginPath();pctx.arc(0,0,p.sz*.35,0,Math.PI*2);pctx.fill();
  }
  pctx.restore();
}
function anP(){pctx.clearRect(0,0,pc.width,pc.height);petals.forEach(p=>{p.t++;p.y+=p.vy;p.x+=p.vx+Math.sin(p.t*p.sf+p.ph)*.6;p.rot+=p.rs;if(p.y>pc.height-80)p.op-=.008;drP(p)});petals=petals.filter(p=>p.y<pc.height+20&&p.op>0);requestAnimationFrame(anP)}
anP();setInterval(mkP,600);

/* COUNTDOWN */
const fc={days:$('#fD'),hours:$('#fH'),minutes:$('#fM'),seconds:$('#fS')};
let pv={};
function uc(){
  const d=WED-new Date();
  if(d<=0){Object.values(fc).forEach(c=>{const s=c.querySelector('.flip-f span');if(s)s.textContent='00'});$('.cd-tag').textContent='The celebration has begun!';return}
  const v={days:String(Math.floor(d/864e5)).padStart(3,'0'),hours:String(Math.floor(d/36e5%24)).padStart(2,'0'),minutes:String(Math.floor(d/6e4%60)).padStart(2,'0'),seconds:String(Math.floor(d/1e3%60)).padStart(2,'0')};
  Object.keys(v).forEach(k=>{if(v[k]!==pv[k]){const c=fc[k],f=c.querySelector('.flip-f span'),b=c.querySelector('.flip-b span');b.textContent=v[k];c.classList.add('flipping');setTimeout(()=>{f.textContent=v[k];c.classList.remove('flipping')},300)}});pv={...v};
}
setInterval(uc,1000);uc();

/* DIVIDERS */
$$('.div-path').forEach(p=>{const o=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){p.classList.add('drawn');o.unobserve(p)}})},{threshold:.5});o.observe(p)});

/* TIMELINE */
const tl=$('.tl-line');
if(tl){const to=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){tl.classList.add('animate');to.unobserve(tl)}})},{threshold:.1});to.observe(tl)}

/* SCROLL REVEALS */
const ro=new IntersectionObserver((entries)=>{
  entries.forEach((en,i)=>{
    if(en.isIntersecting){
      const delay=en.target.dataset.delay||0;
      setTimeout(()=>en.target.classList.add('visible'),delay);
      ro.unobserve(en.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
// Stagger children within groups
function staggerReveal(){
  const groups=['.ev-grid .ev-card','.bl-grid .bl-card','.ring-grid .ring-panel','.gallery-grid .g-item','.timeline .tl-item'];
  groups.forEach(sel=>{$$(sel).forEach((el,i)=>{el.dataset.delay=i*100})});
  $$('.reveal').forEach(el=>ro.observe(el));
}
staggerReveal();

/* GALLERY + LIGHTBOX */
const lb=$('#lightbox'),lbi=$('#lbImg'),lbCtr=$('#lbCounter');
let lbI=0;
const gItems=$$('.g-item');
const totalG=gItems.length;

gItems.forEach((it,idx)=>it.addEventListener('click',()=>{
  lbI=idx;showLB();
}));
// Ring panels also open lightbox
$$('.ring-panel').forEach(rp=>rp.addEventListener('click',()=>{
  lbi.src=rp.querySelector('img').src;
  lbCtr.textContent='';
  lb.classList.add('active');
}));

function showLB(){lbi.src=gItems[lbI].querySelector('img').src;lbCtr.textContent=`${lbI+1} / ${totalG}`;lb.classList.add('active')}
function lbNav(d){lbI=(lbI+d+totalG)%totalG;showLB()}
$('#lbClose').addEventListener('click',()=>lb.classList.remove('active'));
lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('active')});
$('#lbPrev').addEventListener('click',()=>lbNav(-1));
$('#lbNext').addEventListener('click',()=>lbNav(1));
document.addEventListener('keydown',e=>{if(!lb.classList.contains('active'))return;if(e.key==='Escape')lb.classList.remove('active');if(e.key==='ArrowLeft')lbNav(-1);if(e.key==='ArrowRight')lbNav(1)});
// Mobile swipe
let touchX=0;
lb.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>50){dx<0?lbNav(1):lbNav(-1)}},{passive:true});

/* RSVP */
const rf=$('#rsvpForm'),dots=$$('.dot'),dLines=$$('.dot-line');
function goS(n){$$('.rs').forEach(s=>s.classList.remove('active'));$(`.rs[data-step="${n}"]`).classList.add('active');dots.forEach((d,i)=>{d.classList.remove('active','done');if(i+1===n)d.classList.add('active');if(i+1<n)d.classList.add('done')});dLines.forEach((l,i)=>l.classList.toggle('done',i+1<n))}
$$('.rnext').forEach(b=>b.addEventListener('click',()=>{const st=b.closest('.rs');let ok=true;$$('[required]',st).forEach(inp=>{if(!inp.value){inp.closest('.fg').classList.add('shake');setTimeout(()=>inp.closest('.fg').classList.remove('shake'),400);ok=false}});if(ok)goS(parseInt(b.dataset.next))}));
$$('.rprev').forEach(b=>b.addEventListener('click',()=>goS(parseInt(b.dataset.prev))));
rf.addEventListener('submit',e=>{e.preventDefault();console.log('RSVP submitted');rf.style.display='none';$('.rsvp-dots').style.display='none';$('#rsvpOk').classList.add('active');trigC()});

/* VIDEO */
const bR=$('#bRec'),bS=$('#bStop'),vP=$('#vidP'),vSt=$('#vidSt');
let mR,ch=[];
bR.addEventListener('click',async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:true,audio:true});vP.srcObject=s;vP.style.display='block';mR=new MediaRecorder(s);ch=[];mR.ondataavailable=e=>{if(e.data.size>0)ch.push(e.data)};mR.onstop=()=>{s.getTracks().forEach(t=>t.stop());vP.style.display='none';vSt.textContent='Recorded successfully!'};mR.start();bR.style.display='none';bS.style.display='';vSt.textContent='Recording...'}catch(e){vSt.textContent='Camera unavailable. Skip this step.'}});
bS.addEventListener('click',()=>{if(mR&&mR.state!=='inactive'){mR.stop();bS.style.display='none';bR.style.display='';bR.textContent='Record Again'}});

/* CONFETTI */
function trigC(){const cv=$('#confettiCv');cv.style.display='block';const ctx=cv.getContext('2d');cv.width=window.innerWidth;cv.height=window.innerHeight;const cols=['#E2A855','#F5D48A','#C17F3E','#E8667A'];const ps=[];for(let i=0;i<300;i++)ps.push({x:Math.random()*cv.width,y:Math.random()*cv.height-cv.height,w:5+Math.random()*6,h:3+Math.random()*4,c:cols[Math.floor(Math.random()*cols.length)],vx:(Math.random()-.5)*5,vy:2+Math.random()*4,r:Math.random()*360,rs:(Math.random()-.5)*12,o:1});let f=0;(function a(){ctx.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.rs;p.vy+=.05;if(f>100)p.o-=.008;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r*Math.PI/180);ctx.globalAlpha=Math.max(0,p.o);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()});f++;if(f<200)requestAnimationFrame(a);else cv.style.display='none'})()}

/* MUSIC */
const mBtn=$('#muBtn'),mPan=$('#muPanel'),wf=$('#wf');
let mPlay=false,aCtx,osc,gain;
for(let i=0;i<12;i++){const b=document.createElement('span');b.className='wb';wf.appendChild(b)}
mBtn.addEventListener('click',()=>{mPlay=!mPlay;mBtn.classList.toggle('playing',mPlay);mPan.classList.toggle('show',mPlay);wf.classList.toggle('playing',mPlay);
if(mPlay){if(!aCtx)aCtx=new(window.AudioContext||window.webkitAudioContext)();osc=aCtx.createOscillator();gain=aCtx.createGain();osc.type='sine';osc.frequency.setValueAtTime(261.63,aCtx.currentTime);gain.gain.setValueAtTime(0,aCtx.currentTime);gain.gain.linearRampToValueAtTime(.04,aCtx.currentTime+1);osc.connect(gain);gain.connect(aCtx.destination);osc.start()}
else{if(gain){gain.gain.linearRampToValueAtTime(0,aCtx.currentTime+.3);setTimeout(()=>{if(osc){osc.stop();osc=null}},400)}}});

/* ICS */
window.downloadICS=function(){const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//VamsiWedsSatya//EN','BEGIN:VEVENT','DTSTART:20260429T003000Z','DTEND:20260429T143000Z','SUMMARY:Vamsi and Satya Wedding','DESCRIPTION:Wedding of Vamsi and Satya','LOCATION:5-16 Sri Ladhuram Toshniwal Memorial Bhawan Road\\, Vizianagaram\\, AP 535001','END:VEVENT','END:VCALENDAR'].join('\r\n');const b=new Blob([ics],{type:'text/calendar;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='VamsiWedsSatya.ics';a.click();URL.revokeObjectURL(a.href)};

})();
