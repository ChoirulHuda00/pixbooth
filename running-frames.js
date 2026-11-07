/* Jakarta Running Fest collection. Shared by thumbnails and full-resolution export. */
(function(g){'use strict';
const FRAMING=(typeof module!=='undefined'&&module.exports)?require('./framing.js'):g.PixFraming;
const FILTER=(typeof module!=='undefined'&&module.exports)?require('./filters.js'):g.PixFilters;
const RED='#F01318',PAPER='#F5F1E8',INK='#171717',WHITE='#FFFFFF';
const catalog=[
{id:'jrf-hero',name:'Finish Hero',photos:1,tag:'1 foto · full bleed · logo mengambang',bg:RED},
{id:'jrf-arch',name:'City Arch',photos:1,tag:'1 foto · gerbang lengkung · podium logo',bg:RED},
{id:'jrf-orbit',name:'Victory Orbit',photos:1,tag:'1 foto · oval diagonal · stiker timbul',bg:PAPER},
{id:'jrf-lane',name:'Fast Lane',photos:1,tag:'1 foto · potongan miring · speed ribbon',bg:INK},
{id:'jrf-pass',name:'Runner Pass',photos:1,tag:'1 foto · kartu die-cut · bib editorial',bg:PAPER},
{id:'jrf-medal',name:'Medal Moment',photos:1,tag:'1 foto · medali bundar · pita silang',bg:RED},
{id:'jrf-duo',name:'Side by Stride',photos:2,tag:'2 foto · dua lengkung · badge silang',bg:PAPER},
{id:'jrf-sprint',name:'Double Sprint',photos:2,tag:'2 foto · split diagonal · logo di tengah',bg:RED},
{id:'jrf-diary',name:'Race Diary',photos:3,tag:'3 foto · kapsul bertingkat · memo balapan',bg:INK},
{id:'jrf-laps',name:'Three Laps',photos:3,tag:'3 foto · lingkaran dinamis · orbit merah',bg:PAPER},
{id:'jrf-crew',name:'Crew Collage',photos:4,tag:'4 foto · kolase organik · logo menimpa foto',bg:RED},
{id:'jrf-timeline',name:'Start to Finish',photos:4,tag:'4 foto · jalur berkelok · cerita satu hari',bg:PAPER}
].map(d=>({...d,type:'running',ink:d.bg===INK||d.bg===RED?WHITE:INK,accent:RED}));
let assets={demo:[]},factory=null;const backgrounds=new Map();
function setAssets(a){assets={...assets,...a};if(a.createCanvas)factory=a.createCanvas;backgrounds.clear()}
function canvas(w,h){const c=factory?factory(w,h):g.document?.createElement('canvas');if(c){c.width=w;c.height=h}return c}
function T(c,text,x,y,size,color=INK,weight='bold',align='left',max=1000){c.save();c.fillStyle=color;c.textAlign=align;c.font=`${weight} ${size}px Arial`;c.fillText(text,x,y,max);c.restore()}
function polygon(c,points){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()}
function shape(c,x,y,w,h,type='round'){
 c.beginPath();if(type==='circle'||type==='oval')c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);
 else if(type==='arch'){c.moveTo(x,y+h);c.lineTo(x,y+w/2);c.bezierCurveTo(x,y-w*.18,x+w,y-w*.18,x+w,y+w/2);c.lineTo(x+w,y+h);c.quadraticCurveTo(x+w,y+h+12,x+w-28,y+h+12);c.lineTo(x+28,y+h+12);c.quadraticCurveTo(x,y+h+12,x,y+h)}
 else if(type==='lane')polygon(c,[[x+w*.14,y],[x+w,y+h*.04],[x+w*.85,y+h],[x,y+h*.94]]);
 else if(type==='organic'){c.moveTo(x+w*.16,y);c.bezierCurveTo(x+w*.58,y-h*.05,x+w*1.05,y+h*.05,x+w,y+h*.35);c.bezierCurveTo(x+w*.96,y+h*.73,x+w*1.01,y+h*1.05,x+w*.64,y+h);c.bezierCurveTo(x+w*.2,y+h*.98,x-w*.06,y+h*1.02,x,y+h*.55);c.bezierCurveTo(x+w*.02,y+h*.22,x-w*.03,y+h*.05,x+w*.16,y)}
 else if(type==='ticket'){c.moveTo(x+40,y);c.lineTo(x+w-40,y);c.quadraticCurveTo(x+w,y,x+w,y+40);c.lineTo(x+w,y+h*.67);c.bezierCurveTo(x+w-65,y+h*.67,x+w-65,y+h*.74,x+w,y+h*.74);c.lineTo(x+w,y+h-40);c.quadraticCurveTo(x+w,y+h,x+w-40,y+h);c.lineTo(x+40,y+h);c.quadraticCurveTo(x,y+h,x,y+h-40);c.lineTo(x,y+h*.74);c.bezierCurveTo(x+65,y+h*.74,x+65,y+h*.67,x,y+h*.67);c.lineTo(x,y+40);c.quadraticCurveTo(x,y,x+40,y)}
 else c.roundRect(x,y,w,h,type==='pill'?Math.min(w,h)/2:[65,65,65,65]);c.closePath();
}
function photo(c,o,box,i,{type='round',rotate=0,stroke=8}={}){
 let[x,y,w,h]=box;c.save();if(rotate){c.translate(x+w/2,y+h/2);c.rotate(rotate*Math.PI/180);x=-w/2;y=-h/2}
 c.save();c.shadowColor='#00000038';c.shadowBlur=28;c.shadowOffsetY=16;shape(c,x,y,w,h,type);c.fillStyle=WHITE;c.fill();c.restore();
 c.save();shape(c,x,y,w,h,type);c.clip();if(o.overlay){c.clearRect(x-5,y-5,w+10,h+20)}else{
 const raw=o.media?.[i]||(!o.media?.length?assets.demo[(i+(o.demoOffset||0))%Math.max(1,assets.demo.length)]:null);
 const m=FILTER.source(raw,o.filter);if(m){const sw=m.videoWidth||m.naturalWidth||m.width,sh=m.videoHeight||m.naturalHeight||m.height;if(sw&&sh){const s=Math.max(w/sw,h/sh),cw=w/s,ch=h/s;c.filter='none';FRAMING.draw(c,m,x,y,w,h,o.framing?.[i],(raw===assets.demo[0]||raw===assets.demo[3])?.9:.42)}}else{c.fillStyle='#D3D0C9';c.fillRect(x,y,w,h);T(c,'FOTO '+String(i+1).padStart(2,'0'),x+w/2,y+h/2,32,'#77736A','bold','center',w-30)}
 }c.restore();if(stroke){shape(c,x,y,w,h,type);c.strokeStyle=WHITE;c.lineWidth=stroke;c.stroke()}c.restore();
}
function texture(c,bg){
 let cached=backgrounds.get(bg);if(!cached){cached=canvas(1080,1920);if(!cached){c.fillStyle=bg;c.fillRect(0,0,1080,1920);return}const p=cached.getContext('2d');p.fillStyle=bg;p.fillRect(0,0,1080,1920);p.save();p.strokeStyle=bg===RED?'#57050A33':bg===INK?'#FFFFFF0D':'#D9D4CA';p.lineWidth=110;p.beginPath();p.ellipse(100,340,470,720,-.6,0,Math.PI*2);p.stroke();p.lineWidth=65;p.beginPath();p.ellipse(1000,1500,480,700,.6,0,Math.PI*2);p.stroke();let seed=173;for(let i=0;i<5200;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%1080;seed=(seed*1664525+1013904223)>>>0;const y=seed%1920;p.fillStyle=bg===RED?'#24000022':bg===INK?'#FFFFFF12':'#615C5018';p.fillRect(x,y,2+(i%3),2+(i%3))}p.restore();backgrounds.set(bg,cached)}c.drawImage(cached,0,0);
}
function plate(c,x,y,w,{color=RED,rotate=0,style='cut',padding=30}={}){
 const mask=color===WHITE?assets.redLogo:assets.whiteLogo,h=w*.245+padding*2;c.save();c.translate(x+w/2,y+h/2);c.rotate(rotate*Math.PI/180);c.translate(-w/2,-h/2);
 c.save();c.shadowColor='#00000055';c.shadowBlur=24;c.shadowOffsetY=15;c.shadowOffsetX=4;c.fillStyle=color;if(style==='pill'){c.beginPath();c.roundRect(0,0,w,h,h/2);c.fill()}else{polygon(c,[[22,0],[w-13,0],[w,h-23],[w-22,h],[0,h],[0,23]]);c.fill()}c.restore();
 // A second edge below the face gives the co-brand lockup physical depth.
 c.fillStyle=color===RED?'#A40009':color===WHITE?'#D8D4CC':'#000';polygon(c,[[2,h-10],[w-22,h-10],[w-22,h],[2,h+4]]);c.fill();
 if(mask)c.drawImage(mask,padding,padding,w-padding*2,(w-padding*2)*.245);
 else{T(c,'myBCA | JAKARTA',padding,padding+45,40,color===WHITE?RED:WHITE);T(c,'RUNNING FEST 2026',padding,padding+88,35,color===WHITE?RED:WHITE)}c.restore();return h;
}
function floatingLogo(c,x,y,w,rotate=0){const image=assets.whiteLogo;if(!image)return plate(c,x,y,w,{rotate});c.save();c.translate(x+w/2,y+w*.245/2);c.rotate(rotate*Math.PI/180);c.translate(-w/2,-w*.245/2);c.save();c.shadowColor='#00000099';c.shadowBlur=25;c.shadowOffsetY=18;c.shadowOffsetX=5;c.drawImage(assets.redLogo,7,10,w,w*.245);c.restore();for(const [dx,dy]of[[-2,0],[2,0],[0,-2],[0,2]])c.drawImage(assets.redLogo,dx,dy,w,w*.245);c.drawImage(image,0,0,w,w*.245);c.restore()}
function tape(c,text,x,y,w,rotate=0,color=RED){c.save();c.translate(x,y);c.rotate(rotate*Math.PI/180);c.fillStyle=color;c.fillRect(0,0,w,76);T(c,text,w/2,51,30,color===RED?WHITE:RED,'bold','center',w-36);c.restore()}
function footer(c,d,o){const color=d.ink;T(c,o.caption||'YOUR RUN. YOUR STORY.',70,1820,30,color,'bold','left',940);T(c,'JAKARTA RUNNING FEST 2026',70,1871,21,color,'normal');T(c,'pixbooth.',1008,1871,22,color,'bold','right')}
function render(out,o={}){
 const d=catalog.find(d=>d.id===o.design)||catalog[0];o={...o,demoOffset:['jrf-hero','jrf-medal','jrf-pass'].includes(d.id)?1:0};const c=out.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,out.width,out.height);c.scale(out.width/1080,out.height/1920);texture(c,d.bg);
 if(d.id==='jrf-hero'){
 photo(c,o,[0,0,1080,1920],0,{type:'round',stroke:0});const grad=c.createLinearGradient(0,1000,0,1920);grad.addColorStop(0,'#00000000');grad.addColorStop(1,'#000000C9');c.fillStyle=grad;c.fillRect(0,900,1080,1020);tape(c,'A CITY. A RUN. A MEMORY.',65,90,620,-3);T(c,'I WAS',65,1295,130,WHITE);T(c,'HERE.',65,1420,170,WHITE);floatingLogo(c,65,1510,950,-3);
 }else if(d.id==='jrf-arch'){
 T(c,'MEET ME AT',75,120,44,WHITE);T(c,'THE FINISH.',70,230,118,WHITE);photo(c,o,[105,355,870,1220],0,{type:'arch',stroke:12});plate(c,50,1470,980,{rotate:3,color:WHITE});
 }else if(d.id==='jrf-orbit'){
 c.save();c.strokeStyle=RED;c.lineWidth=7;c.beginPath();c.ellipse(540,925,492,720,-.16,0,Math.PI*2);c.stroke();c.restore();photo(c,o,[120,300,840,1260],0,{type:'oval',rotate:-9,stroke:14});T(c,'RUN',50,265,250,RED);T(c,'YOUR CITY.',1020,1740,76,INK,'bold','right');plate(c,55,1390,790,{rotate:-7});
 }else if(d.id==='jrf-lane'){
 T(c,'FAST',55,240,245,WHITE);T(c,'FEELINGS.',55,360,102,WHITE);photo(c,o,[65,440,950,1180],0,{type:'lane',stroke:10});tape(c,'EVERY STEP WAS WORTH IT.',-25,1380,1130,-11);plate(c,110,1470,860,{rotate:4});T(c,'JKT / 2026',1010,108,27,WHITE,'normal','right');
 }else if(d.id==='jrf-pass'){
 T(c,'THE RUNNER\u2019S EDIT',65,115,37,INK);T(c,'RACE DAY',65,250,142,RED);c.save();c.translate(540,1000);c.rotate(-.045);shape(c,-465,-660,930,1410,'ticket');c.fillStyle=WHITE;c.shadowColor='#00000022';c.shadowBlur=35;c.shadowOffsetY=18;c.fill();c.restore();photo(c,o,[135,415,810,1035],0,{type:'organic',rotate:-2,stroke:0});plate(c,125,1380,830,{color:RED,rotate:-2});tape(c,'ADMIT ONE BEAUTIFUL MEMORY',137,1655,805,-2,WHITE);
 }else if(d.id==='jrf-medal'){
 polygon(c,[[180,0],[395,0],[825,1140],[620,1190]]);c.fillStyle='#FFFFFFEE';c.fill();polygon(c,[[900,0],[685,0],[255,1140],[460,1190]]);c.fillStyle='#FFB7B2';c.fill();c.beginPath();c.arc(540,950,478,0,Math.PI*2);c.fillStyle='#FFFFFF';c.shadowColor='#65010755';c.shadowBlur=35;c.shadowOffsetY=20;c.fill();c.shadowColor='transparent';photo(c,o,[92,502,896,896],0,{type:'circle',stroke:10});T(c,'FOR ME.',540,1690,125,WHITE,'bold','center');plate(c,100,1270,880,{rotate:-3});
 }else if(d.id==='jrf-duo'){
 T(c,'BETTER',60,225,153,RED);T(c,'TOGETHER.',60,340,123,INK);photo(c,o,[65,440,455,1140],0,{type:'arch',rotate:-3,stroke:9});photo(c,o,[570,600,445,1110],1,{type:'arch',rotate:3,stroke:9});plate(c,32,1375,1015,{rotate:-5});
 }else if(d.id==='jrf-sprint'){
 plate(c,60,55,960,{color:WHITE,rotate:1});photo(c,o,[65,370,950,620],0,{type:'lane',stroke:10});photo(c,o,[65,1040,950,620],1,{type:'lane',stroke:10});tape(c,'TWO MOMENTS. ONE GREAT RUN.',-15,936,1120,-6,INK);T(c,'KEEP THE FEELING.',70,1754,71,WHITE);
 }else if(d.id==='jrf-diary'){
 T(c,'MY RACE',65,200,155,WHITE);T(c,'DAY DIARY.',65,310,122,RED);photo(c,o,[60,390,660,510],0,{type:'pill',rotate:-5,stroke:8});photo(c,o,[340,900,680,470],1,{type:'pill',rotate:5,stroke:8});photo(c,o,[55,1325,650,420],2,{type:'pill',rotate:-4,stroke:8});plate(c,555,1540,470,{color:WHITE,rotate:7,padding:20});tape(c,'START / STRIDE / SMILE',265,820,800,-4);
 }else if(d.id==='jrf-laps'){
 T(c,'THREE',55,220,180,RED);T(c,'LITTLE WINS.',65,320,107,INK);photo(c,o,[72,405,640,640],0,{type:'circle',stroke:12});photo(c,o,[455,920,550,550],1,{type:'circle',stroke:12});photo(c,o,[55,1265,440,440],2,{type:'circle',stroke:12});plate(c,80,1510,730,{rotate:-5});
 }else if(d.id==='jrf-crew'){
 T(c,'THE',60,150,78,WHITE);T(c,'RUN CLUB.',55,290,174,WHITE);photo(c,o,[62,390,470,630],0,{type:'organic',rotate:-4,stroke:9});photo(c,o,[575,400,445,620],1,{type:'arch',rotate:4,stroke:9});photo(c,o,[65,1115,465,590],2,{type:'arch',rotate:3,stroke:9});photo(c,o,[575,1110,445,590],3,{type:'organic',rotate:-4,stroke:9});plate(c,35,935,1010,{color:WHITE,rotate:-3});
 }else if(d.id==='jrf-timeline'){
 c.save();c.strokeStyle=RED;c.lineWidth=13;c.setLineDash([15,16]);c.beginPath();c.moveTo(220,320);c.bezierCurveTo(1170,300,-80,1050,800,1530);c.stroke();c.restore();T(c,'FROM START',60,150,112,RED);T(c,'TO A STORY.',60,260,112,INK);photo(c,o,[75,380,620,410],0,{type:'pill',rotate:-4,stroke:8});photo(c,o,[480,780,530,360],1,{type:'pill',rotate:5,stroke:8});photo(c,o,[60,1090,540,350],2,{type:'pill',rotate:-4,stroke:8});photo(c,o,[455,1440,550,330],3,{type:'pill',rotate:4,stroke:8});plate(c,75,1410,620,{rotate:-8,padding:24});['01 / START','02 / FIND THE PACE','03 / GOOD COMPANY','04 / FINISH'].forEach((t,i)=>T(c,t,i%2?80:740,i===3?1780:450+i*395,20,INK,'bold','left',260));
 }
 footer(c,{...d,ink:d.id==='jrf-hero'?WHITE:d.ink},o);c.restore();return d;
}
async function load(){if(!g.document)return;const image=src=>new Promise((resolve,reject)=>{const m=new Image();m.onload=()=>resolve(m);m.onerror=reject;m.src=src});const [whiteLogo,redLogo,city,crew]=await Promise.all(['/running-assets/logo-white.png','/running-assets/logo-red.png','/running-assets/city.png','/running-assets/crew.png'].map(image));setAssets({whiteLogo,redLogo,demo:[city,crew,crew,city]})}
const api={catalog,render,setAssets,load};g.PixRunning=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
