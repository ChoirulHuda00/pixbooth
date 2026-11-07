const fs=require('fs'),path=require('path'),crypto=require('crypto'),X=require('./experience.js');
function canvasLib(){try{return require('@napi-rs/canvas')}catch{return require(path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas'))}}
function migrate(db,access,hash,id){
 if(!db.events.some(e=>e.id==='preston-fest'))db.events.push({id:'preston-fest',name:'Preston Fest Live 2026',type:'concert',location:'SM Boomi Carnival, Malang',date:'2026-08-08',status:'active',plan:'sponsored',price:0,quota:400,used:0,headline:'Malang, simpan malamnya.',color:'#0964D8',sponsor:'',retention:48,allowUpload:true,organizer:'Preston Fest',schedule:'Demo desain · referensi acara 8 Agustus 2026',description:'Koleksi frame Preston Fest berdasarkan poster dan referensi yang diberikan. Biru, kuning, oranye; logo stiker timbul, filmstrip, sobekan kertas, dan kolase konser.',logoURL:'/preston-assets/logo.png',designs:{photo:require('./preston-frames.js').catalog.map(d=>d.id),motion:X.motions.map(d=>d.id),video:X.forType('concert').map(d=>d.id)}});

 if(!db.events.some(e=>e.id==='stride-5k'))db.events.push({id:'stride-5k',name:'Stride City Run 5K',type:'running',location:'Surabaya',date:'2026-11-15',status:'active',plan:'paid',price:19000,quota:500,used:0,headline:'Setiap langkah punya cerita.',color:'#dcff4c',sponsor:'STRIDE CLUB',retention:48,allowUpload:true});
 if(!db.events.some(e=>e.id==='afterhours'))db.events.push({id:'afterhours',name:'Afterhours Community',type:'concert',location:'Bandung',date:'2026-11-21',status:'active',plan:'hybrid',price:12000,quota:300,used:0,headline:'Satu komunitas. Banyak kenangan.',color:'#ffa479',sponsor:'AFTERHOURS',retention:48,allowUpload:true});

 const F=require('./festival-frames.js');
 if(!db.events.some(e=>e.id==='scream-or-dance'))db.events.push({id:'scream-or-dance',name:'Scream or Dance · Blooming Garden',type:'concert',location:'JIEXPO Kemayoran, Jakarta',date:'2026-10-31',status:'active',plan:'sponsored',price:0,quota:500,used:0,headline:'Bloom after dark.',color:'#80D5AD',sponsor:'',retention:48,allowUpload:true,organizer:'Scream or Dance',schedule:'Demo pengalaman · 31 Oktober–1 November 2026',description:'Kenangan dari Blooming Garden. Frame tipis yang menonjolkan fotomu, aksen hijau metalik, bunga malam, dan komposisi untuk satu hingga empat foto.',logoURL:'/sod-assets/logo.png?v=original2',designs:{photo:F.catalog.filter(d=>d.theme==='sod').map(d=>d.id),motion:X.motions.map(d=>d.id),video:X.forType('concert').map(d=>d.id)}});
 const sodLogoEvent=db.events.find(e=>e.id==='scream-or-dance');if(sodLogoEvent)sodLogoEvent.logoURL='/sod-assets/logo.png?v=original2';
 if(!db.festivalThinV1){for(const e of db.events){const extra=F.catalog.filter(d=>d.eventId===e.id).map(d=>d.id);if(extra.length&&e.designs?.photo)e.designs.photo=[...new Set([...extra,...e.designs.photo])]}db.festivalThinV1=true}

 db.orders??=[];
 if(process.env.PIXBOOTH_OWNER_PASSWORD){if(process.env.PIXBOOTH_OWNER_PASSWORD.length<16)throw new Error('PIXBOOTH_OWNER_PASSWORD harus minimal 16 karakter.');const owner=db.accounts.find(a=>a.role==='owner');owner.salt=id();owner.passwordHash=hash(process.env.PIXBOOTH_OWNER_PASSWORD,owner.salt)}
 if(!db.eventAccountsV2){
   // Retire the old multi-event partner login; existing owner/finance logins stay valid.
   db.accounts=db.accounts.filter(a=>a.role!=='partner');
   fs.appendFileSync(access,'\n=== AKUN PER ACARA (menggantikan akun mitra lama) ===\n');
   for(const e of db.events){const email=e.id+'@event.pixbooth.local',password=crypto.randomBytes(12).toString('base64url'),salt=id();db.accounts.push({role:'partner',name:'Tim '+e.name,email,eventId:e.id,salt,passwordHash:hash(password,salt)});e.partner=email;fs.appendFileSync(access,`\n${e.name} (mitra khusus acara)\nAcara: ${e.id}\nEmail: ${email}\nKata sandi: ${password}\nPortal: /mitra?event=${e.id}\n`)}
   db.eventAccountsV2=true;
 }
 const preston=db.events.find(e=>e.id==='preston-fest');if(preston&&!db.accounts.some(a=>a.role==='partner'&&a.eventId===preston.id)){const email='preston-fest@event.pixbooth.local',password=crypto.randomBytes(12).toString('base64url'),salt=id();db.accounts.push({role:'partner',name:'Tim Preston Fest',email,eventId:preston.id,salt,passwordHash:hash(password,salt)});preston.partner=email;fs.appendFileSync(access,`\nPreston Fest (mitra khusus acara)\nAcara: preston-fest\nEmail: ${email}\nKata sandi: ${password}\nPortal: /mitra?event=preston-fest\n`)}
 for(const e of db.events.filter(e=>e.id==='scream-or-dance'))if(!db.accounts.some(a=>a.role==='partner'&&a.eventId===e.id)){const email=e.id+'@event.pixbooth.local',password=crypto.randomBytes(12).toString('base64url'),salt=id();db.accounts.push({role:'partner',name:'Tim '+e.name,email,eventId:e.id,salt,passwordHash:hash(password,salt)});e.partner=email;fs.appendFileSync(access,`\n${e.name}\nEmail: ${email}\nKata sandi: ${password}\nPortal: /mitra?event=${e.id}\n`)}
 for(const e of db.events){e.description??=e.type==='wedding'?'Rayakan hari bahagia bersama tamu. Foto, GIF, dan film kenangan langsung dari HP masing-masing.':e.type==='running'?'Rayakan start, langkah bersama, dan finish-mu. Rekam momen singkat untuk race film pribadimu.':e.type==='tourism'?'Simpan perjalanan, pemandangan, dan teman seperjalanan dalam kenangan digital.':'Bawa pulang suasana panggung dan momen bersama teman dalam souvenir digital.';e.contact??='help@pixbooth.example';e.schedule??='Akses selama acara aktif · hasil tersedia 48 jam';e.organizer??=e.sponsor||e.name;}
}
function charge(e,kind){if(e.prices)return e.plan==='sponsored'||(e.plan==='hybrid'&&kind==='photo')?0:e.prices[kind]||0;return e.plan==='sponsored'||(e.plan==='hybrid'&&kind==='photo')?0:kind==='photo'?Math.round(e.price*.4):kind==='motion'?Math.round(e.price*.6):e.price}
function publicOrder(o){const{visitor,...safe}=o;return safe}
async function paymentRoute({p,method,req,res,db,guest,readJson,json,error,save,id,auth}){
 if(p==='/api/checkout'&&method==='POST'){const visitor=guest(req,res),b=await readJson(req),e=db.events.find(e=>e.id===b.eventId&&e.status==='active');if(!e||!['photo','motion','video'].includes(b.kind))throw error(400,'Paket tidak tersedia.');require('./business.cjs').assertAvailable(db,e,b.kind);if(db.orders.filter(o=>o.visitor===visitor&&o.created>Date.now()-3600000).length>=20)throw error(429,'Batas simulasi pembayaran tercapai.');const amount=charge(e,b.kind);if(!amount)throw error(400,'Paket ini sudah termasuk fasilitas acara.');const order={id:id(),visitor,eventId:e.id,kind:b.kind,amount,status:'pending',method:['qris','va','ewallet'].includes(b.method)?b.method:'qris',simulated:true,created:Date.now(),expires:Date.now()+900000};db.orders.unshift(order);save();json(res,201,{order:publicOrder(order)});return true}
 if(/^\/api\/checkout\/[a-f0-9]+$/.test(p)){const visitor=guest(req,res),o=db.orders.find(o=>o.id===p.split('/').pop()&&o.visitor===visitor);if(!o)throw error(404,'Transaksi tidak ditemukan.');if(o.status==='pending'&&o.expires<Date.now()){o.status='expired';save()}if(method==='POST'){const b=await readJson(req);if(o.status!=='pending')throw error(409,'Transaksi sudah '+o.status+'. Buat transaksi baru untuk mengulang.');if(!['paid','failed','cancelled'].includes(b.outcome))throw error(400,'Pilih hasil simulasi.');o.status=b.outcome;o.updated=Date.now();save()}json(res,200,{order:publicOrder(o)});return true}
 if(p==='/api/export/invoices.csv'){auth(req,['owner','finance']);const safe=x=>'"'+String(x??'').replace(/"/g,'""').replace(/^[=+@-]/,"'")+'"',rows=[['Nomor','Acara','Nominal','Status'],...db.invoices.map(i=>[i.id,i.eventId,i.amount,i.status]),...db.orders.map(o=>['SIM-'+o.id,o.eventId,o.amount,'SIMULASI '+o.status])];res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="PixBooth-Laporan.csv"','Cache-Control':'no-store'});res.end('\uFEFF'+rows.map(r=>r.map(safe).join(',')).join('\r\n'));return true}
 return false;
}
async function renderVideo({j,task,db,MEDIA,ROOT,run,save}){
 const {createCanvas,GlobalFonts}=canvasLib();if(process.platform==='win32')GlobalFonts.loadFontsFromDir('C:/Windows/Fonts');
 const duration=j.filmDuration||60,chapter=duration/12,seen=new Map();const event=db.events.find(e=>e.id===j.eventId),dir=path.join(MEDIA,j.id);fs.mkdirSync(dir,{recursive:true});const segs=[];
 // Twelve authored chapters, each five seconds. Revisit short footage with different framing.
 for(let i=0;i<12;i++){
   const asset=task.assets[(i===11?task.assets.length-1:((['fanfilm','lovestory','roam','pace'].includes(j.videoDesign)?i*2+Math.floor(i/3):i)))%task.assets.length],image=asset.mime.startsWith('image/'),overlay=path.join(dir,`scene-${i}.png`),c=createCanvas(1080,1920);
   X.render(c,{event,kind:'video',design:j.videoDesign,scene:i,overlay:true,caption:j.caption});fs.writeFileSync(overlay,c.toBuffer('image/png'));
   const visits=seen.get(asset.file)||0;seen.set(asset.file,visits+1);const offset=image?0:Math.min(Math.max(0,(asset.duration||chapter)-chapter),visits*chapter);const file=path.join(dir,`chapter-${i}.mp4`),args=['-y',...(image?['-loop','1']:['-stream_loop','-1','-ss',String(offset)]),'-i',asset.file,'-loop','1','-i',overlay];
   const audio=asset.audio&&j.keepAudio;if(!audio)args.push('-f','lavfi','-i','anullsrc=channel_layout=stereo:sample_rate=44100');
   const base=`scale=1120:1992:force_original_aspect_ratio=increase,crop=1120:1992,setsar=1,fps=24,crop=1080:1920:x='20+18*sin(t*0.65)':y='36+30*cos(t*0.5)'`;
   const grade=require('./filters.js').ffmpeg(j.filter);
   let visual=`[0:v]${base},${grade}`;
   if((['fanfilm','lovestory','roam','pace'].includes(j.videoDesign)?[2,5,8]:[3,7]).includes(i)){visual+=`,split=2[a][b];[a]scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960[top];[b]hflip,scale=1080:960:force_original_aspect_ratio=increase,crop=1080:960[bottom];[top][bottom]vstack=inputs=2`}
   if([2,6,10].includes(i))visual+=`,zoompan=z='min(1.16,1+on*0.0012)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1080x1920:fps=24`;
   if(i===5||i===9)visual+=`,tblend=all_mode=average`;
   visual+=`,fade=t=in:d=${event.type==='wedding'?'0.45':'0.12'},fade=t=out:st=${Math.max(0,chapter-.3)}:d=0.3[base];[base][1:v]overlay=x=0:y='if(lt(t,0.4),40*(1-t/0.4),0)':format=auto,format=yuv420p[v]`;
   args.push('-filter_complex_threads','1','-filter_complex',visual,'-map','[v]','-map',audio?'0:a:0':'2:a:0','-af',audio?`volume=.38,afade=t=in:d=0.15,afade=t=out:st=${Math.max(0,chapter-.3)}:d=0.3`:'volume=0','-t',String(chapter),'-r','24','-c:v','libx264','-preset','ultrafast','-crf','24','-maxrate','2800k','-bufsize','5600k','-threads','2','-c:a','aac','-ar','44100','-ac','2',file);
   await run(args,240000);segs.push(file);fs.rmSync(overlay,{force:true});j.progress=5+Math.round((i+1)/12*82);save();
 }
 const list=path.join(dir,'chapters.txt');fs.writeFileSync(list,segs.map(f=>`file '${f.replace(/\\/g,'/')}'`).join('\n'));const out=path.join(dir,'story.mp4');
 const music=j.music==='original'&&fs.existsSync(path.join(ROOT,'music.wav')),args=['-y','-f','concat','-safe','0','-i',list];if(music)args.push('-i',path.join(ROOT,'music.wav'),'-filter_complex',`[1:a]volume=.3,afade=t=in:d=1,afade=t=out:st=${duration-3}:d=3[bg];[0:a][bg]amix=inputs=2:duration=first[a]`,'-map','0:v','-map','[a]');
 args.push('-t',String(duration),'-c:v','copy','-c:a','aac','-b:a','128k','-movflags','+faststart',out);await run(args,240000);for(const f of segs)fs.rmSync(f,{force:true});fs.rmSync(list,{force:true});j.duration=duration;j.status='ready';j.progress=100;j.bytes=fs.statSync(out).size;save();
}
module.exports={migrate,charge,paymentRoute,renderVideo};

