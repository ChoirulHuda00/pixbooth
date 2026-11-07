(function(g){'use strict';
const FRAMING=(typeof module!=='undefined'&&module.exports)?require('./framing.js'):g.PixFraming;
const FILTER=(typeof module!=='undefined'&&module.exports)?require('./filters.js'):g.PixFilters;
const themes={sod:{eventId:'scream-or-dance',type:'concert',color:'#80D5AD',gold:'#EBD4A3',name:'SCREAM OR DANCE',detail:'BLOOMING GARDEN / JIEXPO KEMAYORAN',date:'31 OCT — 1 NOV 2026'},jrf:{eventId:'stride-5k',type:'running',color:'#F01318',gold:'#FFFFFF',name:'JAKARTA RUNNING FEST',detail:'YOUR RUN. YOUR STORY.',date:'2026'},preston:{eventId:'preston-fest',type:'concert',color:'#FFD548',gold:'#FFFFFF',name:'PRESTON FEST',detail:'SM BOOMI CARNIVAL / MALANG',date:'8 AGUSTUS 2026'}};
const bases=[['air','Air Portrait',1,'thin'],['hairline','Hairline Duo',2,'thin'],['triptych','Open Triptych',3,'thin'],['grid','Clean Four',4,'thin']];
const catalog=Object.entries(themes).flatMap(([key,t])=>[...bases,...(key==='sod'?[['dewdrop','Dewdrop',1,'thin'],['panorama','Afterglow',1,'thin'],['gate','Garden Gate',1,'art'],['moon','Moonlit Bloom',1,'art'],['petals','Petal Duet',2,'art'],['vines','Vine Diary',3,'art'],['herbarium','Night Herbarium',4,'art'],['portal','Emerald Portal',1,'art']]:[])].map(([id,name,photos,weight])=>({id:`${key}x-${id}`,name,photos,weight,theme:key,eventId:t.eventId,type:t.type,bg:'#091410',ink:t.gold,accent:t.color,tag:`${photos} foto · ${weight==='thin'?'frame tipis · foto dominan':'botanical · taman malam'}`})));
let assets={demo:[],logos:{}};
function setAssets(a){assets={...assets,...a}}
function text(c,t,x,y,size,color,align='left'){c.fillStyle=color;c.font=`${size<28?'normal':'bold'} ${size}px ${size>85?'Georgia':'Arial'}`;c.textAlign=align;c.fillText(t,x,y,980)}
function cover(c,im,x,y,w,h){const sw=im.videoWidth||im.naturalWidth||im.width,sh=im.videoHeight||im.naturalHeight||im.height;if(!sw||!sh)return;const r=Math.max(w/sw,h/sh),cw=w/r,ch=h/r;c.drawImage(im,(sw-cw)/2,(sh-ch)/2,cw,ch,x,y,w,h)}
function shape(c,x,y,w,h,type){c.beginPath();if(type==='oval')c.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,7);else c.roundRect(x,y,w,h,type==='arch'?[w/2,w/2,18,18]:type==='round'?40:0);c.closePath()}
function photo(c,o,box,i,type='rect'){const[x,y,w,h]=box;c.save();shape(c,x,y,w,h,type);c.clip();if(o.overlay)c.clearRect(x-2,y-2,w+4,h+4);else{const im=o.media?.[i]||(!o.media?.length?(o.theme==='jrf'?assets.runningDemo:assets.demo)?.[i%(o.theme==='jrf'?assets.runningDemo.length:assets.demo.length)]:null);if(im){c.filter='none';FRAMING.draw(c,FILTER.source(im,o.filter),x,y,w,h,o.framing?.[i])}else{c.fillStyle='#46564D';c.fillRect(x,y,w,h);text(c,'FOTO '+(i+1),x+w/2,y+h/2,34,'#fff','center')}}c.restore()}
function bloom(c,x,y,r,color){c.save();c.translate(x,y);for(let i=0;i<8;i++){c.rotate(Math.PI/4);const gr=c.createLinearGradient(0,0,r,0);gr.addColorStop(0,'#123C37');gr.addColorStop(.6,color);gr.addColorStop(1,'#17362F');c.fillStyle=gr;c.strokeStyle='#EBD4A3';c.lineWidth=1.5;c.beginPath();c.ellipse(r*.45,0,r*.55,r*.2,0,0,7);c.fill();c.stroke()}c.fillStyle='#EBD4A3';c.beginPath();c.arc(0,0,r*.12,0,7);c.fill();c.restore()}
function vine(c,x,flip=false){c.save();c.translate(x,0);if(flip)c.scale(-1,1);c.strokeStyle='#82D8AA';c.lineWidth=3;c.beginPath();c.moveTo(0,1920);c.bezierCurveTo(150,1500,-90,940,110,280);c.stroke();for(let i=0;i<9;i++){const y=350+i*175;c.save();c.translate(i%2?30:55,y);c.rotate(i%2?-.8:.5);c.fillStyle=i%2?'#346353':'#739C7D';c.beginPath();c.ellipse(0,0,16,55,0,0,7);c.fill();c.restore()}c.restore()}
function logo(c,t,key,x,y,w){const im=assets.logos[key];if(im){const h=w*im.height/im.width;c.save();c.shadowColor='#0009';c.shadowBlur=12;c.shadowOffsetY=5;c.drawImage(im,x,y,w,h);c.restore()}else text(c,t.name,x,y+45,36,t.color)}
function render(out,o={}){const d=catalog.find(d=>d.id===o.design)||catalog[0],t=themes[d.theme],c=out.getContext('2d');o={...o,theme:d.theme};c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,out.width,out.height);c.scale(out.width/1080,out.height/1920);const grad=c.createLinearGradient(0,0,1080,1920);grad.addColorStop(0,'#06130F');grad.addColorStop(.6,'#172623');grad.addColorStop(1,'#190C21');c.fillStyle=d.theme==='sod'?grad:'#111315';c.fillRect(0,0,1080,1920);
const id=d.id.split('-').slice(1).join('-');let boxes=[],type='rect';
if(d.weight==='thin'){
 if(d.photos===1)boxes=[[18,18,1044,1884]];
 if(d.photos===2)boxes=[[18,18,1044,922],[18,950,1044,952]];
 if(d.photos===3)boxes=[[18,18,1044,614],[18,642,1044,614],[18,1266,1044,636]];
 if(d.photos===4)boxes=[[18,18,517,936],[545,18,517,936],[18,964,517,938],[545,964,517,938]];
 if(id==='dewdrop'){boxes=[[28,28,1024,1864]];type='round'}
 boxes.forEach((b,i)=>photo(c,o,b,i,type));
 if(id==='panorama'){c.strokeStyle=t.color;c.lineWidth=2;c.strokeRect(42,42,996,1836);bloom(c,985,105,48,t.color)}
 if(id==='dewdrop'){bloom(c,72,90,58,t.color);bloom(c,1000,1820,48,t.color)}
 const gr=c.createLinearGradient(0,1710,0,1920);gr.addColorStop(0,'#0000');gr.addColorStop(1,'#000B');c.fillStyle=gr;c.fillRect(18,1710,1044,192);
 const w=d.theme==='sod'?260:d.theme==='preston'?310:240;logo(c,t,d.theme,52,d.theme==='sod'?1700:1770,w);text(c,t.date,1020,1837,23,'#FFF','right');text(c,'pixbooth.',1020,1880,20,'#FFF','right');
}else{
 if(id==='gate'){boxes=[[105,190,870,1440]];type='arch';vine(c,20);vine(c,1060,true)}
 if(id==='moon'){boxes=[[95,150,890,1400]];type='oval';c.strokeStyle=t.gold;c.lineWidth=2;c.beginPath();c.ellipse(540,850,475,735,0,0,7);c.stroke()}
 if(id==='petals')boxes=[[72,140,936,700],[72,900,936,700]];
 if(id==='vines'){boxes=[[70,190,940,470],[70,700,940,470],[70,1210,940,470]];vine(c,8);vine(c,1072,true)}
 if(id==='herbarium')boxes=[[60,170,470,690],[550,240,470,620],[60,900,470,620],[550,900,470,690]];
 if(id==='portal'){boxes=[[100,200,880,1400]];type='arch';for(let i=0;i<5;i++){c.strokeStyle=i%2?t.color:t.gold;c.lineWidth=2;shape(c,75-i*12,175-i*12,930+i*24,1450+i*24,'arch');c.stroke()}}
 boxes.forEach((b,i)=>{photo(c,o,b,i,type);c.strokeStyle=t.gold;c.lineWidth=2;shape(c,...b,type);c.stroke()});
 const flowerPos=id==='petals'?[[80,855,95],[1000,880,105]]:id==='herbarium'?[[530,860,100],[980,150,65]]:[[120,1600,110],[960,1600,100],[980,130,60]];flowerPos.forEach(p=>bloom(c,...p,t.color));
 logo(c,t,d.theme,400,1660,280);text(c,'BLOOM AFTER DARK',540,110,35,t.color,'center');text(c,t.date+' / JIEXPO',540,1864,23,t.gold,'center');text(c,'pixbooth.',1020,1900,17,t.gold,'right');
}
c.restore();return d}
async function load(){if(!g.document)return;const get=src=>new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=src});const arr=await Promise.all(['/sod-assets/logo.png?v=original2','/preston-assets/logo.png','/running-assets/logo-white.png','/preston-assets/stage.png','/preston-assets/crew.png','/preston-assets/singer.png','/preston-assets/dj.png','/running-assets/city.png','/running-assets/crew.png'].map(get));setAssets({logos:{sod:arr[0],preston:arr[1],jrf:arr[2]},demo:arr.slice(3,7),runningDemo:arr.slice(7)})}
const api={catalog,render,setAssets,load};g.PixFestival=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
