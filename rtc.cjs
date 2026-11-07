const crypto=require('crypto');
module.exports=async function rtc({req,rooms,error}){
 const iceServers=[{urls:['stun:stun.l.google.com:19302','stun:stun1.l.google.com:19302']}];
 const cloud=process.env.PIXBOOTH_CF_TURN_ID&&process.env.PIXBOOTH_CF_TURN_TOKEN,coturn=process.env.PIXBOOTH_TURN_URL&&process.env.PIXBOOTH_TURN_SECRET;
 if(!cloud&&!coturn)return{iceServers,relay:false};
 const room=[...rooms.values()].find(r=>r.secret===req.headers['x-room-key']&&r.members.includes(req.headers['x-participant'])&&r.expires>Date.now());if(!room)throw error(403,'Konfigurasi relay hanya untuk peserta ruang aktif.');
 room.rtc??=new Map();const participant=req.headers['x-participant'];if(room.rtc.has(participant))return room.rtc.get(participant);
 if(cloud){try{const response=await fetch('https://rtc.live.cloudflare.com/v1/turn/keys/'+encodeURIComponent(process.env.PIXBOOTH_CF_TURN_ID)+'/credentials/generate-ice-servers',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:'Bearer '+process.env.PIXBOOTH_CF_TURN_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({ttl:3600})});if(!response.ok)throw new Error();const result=await response.json();if(!Array.isArray(result.iceServers))throw new Error();iceServers.push(...result.iceServers)}catch{throw error(503,'Relay LDR belum dapat dihubungi. Periksa konfigurasi server.')}}
 else{const username=String(Math.floor(Date.now()/1000)+3600)+':'+participant,credential=crypto.createHmac('sha1',process.env.PIXBOOTH_TURN_SECRET).update(username).digest('base64');iceServers.push({urls:process.env.PIXBOOTH_TURN_URL.split(','),username,credential})}
 const result={iceServers,relay:true};room.rtc.set(participant,result);return result;
};
