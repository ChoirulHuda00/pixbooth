/* Preston Fest photo collection. Native Canvas masks, reusable in the studio/export. */
(function(g){'use strict';
const FRAMING=(typeof module!=='undefined'&&module.exports)?require('./framing.js'):g.PixFraming;
const FILTER=(typeof module!=='undefined'&&module.exports)?require('./filters.js'):g.PixFilters;
const BLUE='#0964D8',YELLOW='#FFD548',ORANGE='#FF5C2A',INK='#101015',CREAM='#FFF8E8',WHITE='#FFFFFF',PINK='#FF6BB0';
const catalog=[
{id:'preston-anthem',name:'Blue Anthem',photos:1,tag:'1 foto · full bleed · logo stiker besar',bg:INK},
{id:'preston-headliner',name:'Headliner',photos:1,tag:'1 foto · gerbang panggung · halo oranye',bg:BLUE},
{id:'preston-vip',name:'VIP Memory',photos:1,tag:'1 foto · tiket sobek · pass timbul',bg:CREAM},
{id:'preston-encore',name:'Midnight Encore',photos:1,tag:'1 foto · film hitam · tepian sobek',bg:INK},
{id:'preston-duo',name:'With My People',photos:2,tag:'2 foto · polaroid tumpuk · logo mengambang',bg:BLUE},
{id:'preston-backstage',name:'Backstage Duo',photos:2,tag:'2 foto · kolase kertas · catatan malam',bg:CREAM},
{id:'preston-double',name:'Double Exposure',photos:2,tag:'2 foto · panel miring · graffiti merah',bg:INK},
{id:'preston-film',name:'Film Diary',photos:3,tag:'3 foto · filmstrip vertikal · poster editorial',bg:CREAM},
{id:'preston-acts',name:'Three Acts',photos:3,tag:'3 foto · triptych konser · outline kasar',bg:INK},
{id:'preston-scrapbook',name:'Scrapbook Sessions',photos:3,tag:'3 foto · scrapbook biru · stiker berlapis',bg:BLUE},
{id:'preston-crew',name:'Pit Crew',photos:4,tag:'4 foto · kolase asimetris · coretan energi',bg:INK},
{id:'preston-finale',name:'Grand Finale',photos:4,tag:'4 foto · hero + filmstrip · tanggal timbul',bg:BLUE}
].map(d=>({...d,type:'concert',eventId:'preston-fest',ink:d.bg===CREAM?INK:WHITE,accent:YELLOW}));
let assets={demo:[]},factory=null;const cache=new Map();
function setAssets(a){assets={...assets,...a};if(a.createCanvas)factory=a.createCanvas;cache.clear()}
function makeCanvas(w,h){const out=factory?factory(w,h):g.document?.createElement('canvas');if(out){out.width=w;out.height=h}return out}
function T(c,t,x,y,s,color=WHITE,align='left',max=1000,weight='bold'){c.save();c.fillStyle=color;c.font=`${weight} ${s}px Arial`;c.textAlign=align;c.fillText(t,x,y,max);c.restore()}
function poly(c,p){c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath()}
function torn(c,x,y,w,h,seed=11){let pts=[],i=0;const jitter=()=>{seed=(seed*1664525+1013904223)>>>0;return seed%15-7};for(i=0;i<=w;i+=25)pts.push([x+i,y+jitter()]);pts.push([x+w,y]);for(i=0;i<=h;i+=29)pts.push([x+w+jitter(),y+i]);pts.push([x+w,y+h]);for(i=w;i>=0;i-=23)pts.push([x+i,y+h+jitter()]);pts.push([x,y+h]);for(i=h;i>=0;i-=27)pts.push([x+jitter(),y+i]);poly(c,pts)}
function shape(c,x,y,w,h,type='torn',seed=11){if(type==='torn')return torn(c,x,y,w,h,seed);c.beginPath();if(type==='arch'){c.moveTo(x,y+h);c.lineTo(x,y+w/2);c.bezierCurveTo(x,y-w*.16,x+w,y-w*.16,x+w,y+w/2);c.lineTo(x+w,y+h);c.closePath()}else if(type==='oval')c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);else if(type==='slant')poly(c,[[x+w*.12,y],[x+w,y+30],[x+w*.9,y+h],[x,y+h-20]]);else c.roundRect(x,y,w,h,65);c.closePath()}
function photo(c,o,box,index,{angle=0,type='torn',border=18,edge=CREAM,focus=.43}={}){let[x,y,w,h]=box;c.save();c.translate(x+w/2,y+h/2);c.rotate(angle*Math.PI/180);x=-w/2;y=-h/2;c.save();c.shadowColor='#00000066';c.shadowBlur=24;c.shadowOffsetY=15;shape(c,x-border,y-border,w+border*2,h+border*2,type,index+20);c.fillStyle=edge;c.fill();c.restore();c.save();shape(c,x,y,w,h,type,index+20);c.clip();if(o.overlay)c.clearRect(x-12,y-12,w+24,h+24);else{const raw=o.media?.[index]||(!o.media?.length?assets.demo[(index+(o.demoOffset||0))%Math.max(1,assets.demo.length)]:null);const m=FILTER.source(raw,o.filter);if(m){const sw=m.videoWidth||m.naturalWidth||m.width,sh=m.videoHeight||m.naturalHeight||m.height;if(sw&&sh){const scale=Math.max(w/sw,h/sh),cw=w/scale,ch=h/scale;c.filter='none';FRAMING.draw(c,m,x,y,w,h,o.framing?.[index],focus)}}else{c.fillStyle='#D8D1C4';c.fillRect(x,y,w,h);T(c,'FOTO '+(index+1),0,0,35,'#746D60','center',w-20)}}c.restore();c.restore()}
function bg(c,color){let im=cache.get(color);if(!im){im=makeCanvas(1080,1920);if(!im){c.fillStyle=color;c.fillRect(0,0,1080,1920);return}const p=im.getContext('2d');p.fillStyle=color;p.fillRect(0,0,1080,1920);let seed=31;for(let i=0;i<8500;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%1080;seed=(seed*1664525+1013904223)>>>0;const y=seed%1920;p.fillStyle=i%2?'#FFFFFF12':'#00000010';p.fillRect(x,y,2+i%3,2+i%3)}cache.set(color,im)}c.drawImage(im,0,0)}
function flower(c,x,y,r,color=YELLOW){c.save();c.translate(x,y);c.fillStyle=color;c.strokeStyle=INK;c.lineWidth=6;c.beginPath();for(let i=0;i<48;i++){const a=i*Math.PI/24,rad=r*(.73+.27*Math.cos(i*Math.PI/3));c.lineTo(Math.cos(a)*rad,Math.sin(a)*rad)}c.closePath();c.fill();c.stroke();c.fillStyle=WHITE;c.beginPath();c.arc(0,0,r*.28,0,7);c.fill();c.stroke();c.fillStyle=BLUE;c.beginPath();c.arc(0,0,r*.11,0,7);c.fill();c.restore()}
function star(c,x,y,r,color=YELLOW){c.save();c.translate(x,y);c.fillStyle=color;c.strokeStyle=INK;c.lineWidth=5;c.beginPath();for(let i=0;i<12;i++){const a=i*Math.PI/6,rad=i%2?r*.38:r;c.lineTo(Math.cos(a)*rad,Math.sin(a)*rad)}c.closePath();c.fill();c.stroke();c.restore()}
function logo(c,x,y,w,angle=0){if(!assets.logo){T(c,'PRESTON FEST',x,y+100,95,YELLOW,'left',w);return}c.save();c.translate(x+w/2,y+w*assets.logo.height/assets.logo.width/2);c.rotate(angle*Math.PI/180);c.translate(-w/2,-w*assets.logo.height/assets.logo.width/2);c.save();c.shadowColor='#00000099';c.shadowBlur=22;c.shadowOffsetY=18;c.shadowOffsetX=5;c.drawImage(assets.logo,0,8,w,w*assets.logo.height/assets.logo.width);c.restore();c.drawImage(assets.logo,0,0,w,w*assets.logo.height/assets.logo.width);c.restore()}
function tape(c,t,x,y,w,color=YELLOW,angle=0){c.save();c.translate(x,y);c.rotate(angle*Math.PI/180);c.shadowColor='#00000033';c.shadowBlur=12;c.shadowOffsetY=8;c.fillStyle=color;torn(c,0,0,w,83,37);c.fill();c.shadowColor='transparent';T(c,t,w/2,55,30,color===INK?CREAM:INK,'center',w-35);c.restore()}
function scribble(c,x,y,w,h,color='#F62C37'){c.save();c.strokeStyle=color;c.lineWidth=3;let seed=91;for(let i=0;i<18;i++){seed=(seed*1664525+1013904223)>>>0;const k=seed%17-8;c.beginPath();c.moveTo(x+k,y+i*3);c.lineTo(x+w-i*11,y+h*(i%2));c.stroke()}c.restore()}
function footer(c,d,o){T(c,o.caption||'ONE NIGHT. A THOUSAND MEMORIES.',62,1806,27,d.ink,'left',950);T(c,'8 AGUSTUS 2026 / SM BOOMI CARNIVAL MALANG',62,1853,20,d.ink,'left',950,'normal');T(c,'PRESTON FEST LIVE',62,1892,17,d.ink,'left',720,'normal');T(c,'pixbooth.',1010,1892,20,d.ink,'right')}
function render(out,o={}){const d=catalog.find(d=>d.id===o.design)||catalog[0],c=out.getContext('2d');o={...o,demoOffset:d.id==='preston-headliner'?1:0};c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,out.width,out.height);c.scale(out.width/1080,out.height/1920);bg(c,d.bg);
if(d.id==='preston-anthem'){
 photo(c,o,[0,0,1080,1920],0,{type:'round',border:0});const grad=c.createLinearGradient(0,1080,0,1920);grad.addColorStop(0,'#00000000');grad.addColorStop(1,'#000000F0');c.fillStyle=grad;c.fillRect(0,1060,1080,860);logo(c,50,80,980,-4);T(c,'FEST',55,1450,190,WHITE);T(c,'MODE: ON.',55,1580,125,YELLOW);tape(c,'MALANG, YOU WERE LOUD.',150,1660,880,BLUE,-3);flower(c,940,1370,70);
}else if(d.id==='preston-headliner'){
 c.fillStyle=ORANGE;c.beginPath();c.ellipse(540,940,650,730,0,0,7);c.fill();T(c,'MALANG, MAKE SOME NOISE.',540,140,45,CREAM,'center',980);photo(c,o,[105,320,870,1210],0,{type:'arch',border:14});logo(c,30,1300,1020,-5);star(c,945,330,80);tape(c,'I WAS HERE. I FELT EVERYTHING.',80,1680,920,YELLOW,2);
}else if(d.id==='preston-vip'){
 c.save();c.shadowColor='#00000022';c.shadowBlur=30;c.shadowOffsetY=20;torn(c,60,60,960,1670,19);c.fillStyle=WHITE;c.fill();c.restore();for(const x of [90,990]){c.fillStyle=CREAM;c.beginPath();c.arc(x,1335,44,0,7);c.fill()}T(c,'ADMIT ONE / A NIGHT TO KEEP',540,140,27,BLUE,'center');logo(c,120,190,840,2);photo(c,o,[145,520,790,980],0,{angle:-2,type:'torn',border:12});tape(c,'VIP: VERY IMPORTANT MEMORIES',80,1480,920,ORANGE,-3);T(c,'KEEP THIS PASS FOREVER.',540,1672,30,INK,'center');flower(c,940,430,63,ORANGE);
}else if(d.id==='preston-encore'){
 T(c,'ENCORE!',60,220,187,YELLOW);photo(c,o,[65,350,950,1150],0,{angle:-2,type:'torn',border:13});for(let y=390;y<1480;y+=102){c.fillStyle=CREAM;c.fillRect(25,y,22,42);c.fillRect(1030,y+12,22,42)}logo(c,50,1390,980,4);tape(c,'WE DID NOT WANT THIS TO END.',155,1680,820,BLUE,-2);
}else if(d.id==='preston-duo'){
 T(c,'WITH MY',55,150,112,CREAM);T(c,'PEOPLE.',55,275,150,YELLOW);photo(c,o,[65,395,555,1020],0,{angle:-4,type:'torn'});photo(c,o,[555,640,450,1010],1,{angle:5,type:'torn'});logo(c,25,1370,1030,-4);flower(c,920,460,78,ORANGE);tape(c,'SAME SONG. SAME FEELING.',110,1680,870,YELLOW,1);
}else if(d.id==='preston-backstage'){
 T(c,'ON & OFF',60,145,103,BLUE);T(c,'THE STAGE.',60,255,103,INK);photo(c,o,[100,380,880,520],0,{angle:-3});photo(c,o,[100,1080,880,520],1,{angle:3});logo(c,190,780,870,5);flower(c,120,990,65,ORANGE);tape(c,'THE MOMENTS BETWEEN THE MUSIC.',80,1660,920,BLUE,-1);
}else if(d.id==='preston-double'){
 T(c,'SAME NIGHT.',55,140,100,CREAM);T(c,'TWO STORIES.',55,255,95,YELLOW);photo(c,o,[55,380,450,1200],0,{angle:-3,type:'slant',border:10});photo(c,o,[570,450,440,1180],1,{angle:3,type:'slant',border:10});scribble(c,30,1350,1020,220);tape(c,'LOUDER TOGETHER.',-20,1130,1120,ORANGE,-8);logo(c,35,1450,1010,-3);
}else if(d.id==='preston-film'){
 T(c,'THE NIGHT WE KEPT',65,125,43,INK);for(let i=0;i<3;i++){photo(c,o,[70,260+i*470,360,410],i,{angle:-3,type:'torn',border:14});for(let y=290+i*470;y<650+i*470;y+=75){c.fillStyle=BLUE;c.fillRect(40,y,14,28)}}T(c,'KEEP',520,635,113,BLUE);T(c,'THE',520,780,113,INK);T(c,'NIGHT.',520,925,113,ORANGE);flower(c,775,1120,135,YELLOW);logo(c,370,1470,680,-8);tape(c,'PLAY IT BACK IN YOUR HEAD.',470,280,570,BLUE,6);
}else if(d.id==='preston-acts'){
 T(c,'THREE ACTS. ALL THE FEELS.',540,135,43,CREAM,'center');photo(c,o,[110,265,860,425],0,{angle:2,border:10});photo(c,o,[100,805,880,395],1,{angle:-3,border:10});photo(c,o,[110,1340,860,355],2,{angle:2,border:10});scribble(c,45,710,980,95);scribble(c,20,1230,1030,80);logo(c,510,1130,540,-7);T(c,'01 / THE LIGHTS',65,230,20,YELLOW);T(c,'02 / THE PEOPLE',65,765,20,YELLOW);T(c,'03 / THE FEELING',65,1305,20,YELLOW);
}else if(d.id==='preston-scrapbook'){
 T(c,'DEAR FUTURE ME,',65,135,77,CREAM);T(c,'REMEMBER THIS NIGHT.',65,225,60,YELLOW);photo(c,o,[95,355,890,570],0,{angle:-4,type:'torn',border:20});photo(c,o,[75,1110,460,540],1,{angle:-4,type:'torn',border:16});photo(c,o,[595,1135,400,515],2,{angle:5,type:'torn',border:16});logo(c,28,825,1020,3);star(c,940,300,65,ORANGE);flower(c,575,1570,75,YELLOW);
}else if(d.id==='preston-crew'){
 T(c,'PIT CREW / GOOD COMPANY',540,108,34,YELLOW,'center');photo(c,o,[60,205,580,560],0,{angle:-3,border:9});photo(c,o,[730,275,300,520],1,{angle:5,border:9});photo(c,o,[60,1120,395,540],2,{angle:3,border:9});photo(c,o,[535,1110,480,550],3,{angle:-3,border:9});scribble(c,0,785,1080,285);logo(c,20,825,1040,-3);flower(c,660,320,65,ORANGE);
}else if(d.id==='preston-finale'){
 photo(c,o,[355,420,650,1220],0,{type:'torn',angle:2,border:10});for(let i=0;i<3;i++)photo(c,o,[58,400+i*405,235,350],i+1,{type:'torn',angle:-3,border:11});logo(c,25,100,1030,-3);c.save();c.shadowColor=INK;c.shadowOffsetY=8;c.shadowOffsetX=7;T(c,'8 AGUSTUS',55,1740,125,YELLOW,'left',980);c.restore();flower(c,965,460,60,ORANGE);
}
footer(c,d,o);c.restore();return d}
async function load(){if(!g.document)return;const img=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});const [logo,...demo]=await Promise.all(['logo.png','stage.png','crowd.png','singer.png','crew.png','dj.png'].map(n=>img('/preston-assets/'+n)));setAssets({logo,demo})}
const api={catalog,render,setAssets,load};g.PixPreston=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
