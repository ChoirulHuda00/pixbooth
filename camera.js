(function(g){
'use strict';
async function request(devices,facing='user',audio=false){
 if(!devices?.getUserMedia)throw Object.assign(new Error('Buka alamat HTTPS langsung di Safari atau Chrome.'),{name:'UnsupportedCameraError'});
 try{return await devices.getUserMedia({video:{facingMode:{ideal:facing},width:{ideal:1280}},audio})}
 catch(e){if(!['OverconstrainedError','ConstraintNotSatisfiedError','NotReadableError','AbortError'].includes(e.name))throw e;return devices.getUserMedia({video:{facingMode:{ideal:facing}},audio})}
}
async function naturalZoom(stream){const track=stream?.getVideoTracks?.()[0];try{const caps=track?.getCapabilities?.(),zoom=caps?.zoom;if(zoom&&Number.isFinite(zoom.min)&&track.applyConstraints)await track.applyConstraints({advanced:[{zoom:zoom.min}]})}catch{}return stream}
function frameSize(v,max=1920){const w=v.videoWidth||v.naturalWidth||v.width,h=v.videoHeight||v.naturalHeight||v.height;if(!w||!h)throw new Error('Kamera belum siap.');const scale=Math.min(1,max/Math.max(w,h));return {width:Math.max(1,Math.round(w*scale)),height:Math.max(1,Math.round(h*scale))}}
function captureFrame(canvas,v,mirror=false){const size=frameSize(v);canvas.width=size.width;canvas.height=size.height;const c=canvas.getContext('2d');c.save();if(mirror){c.translate(size.width,0);c.scale(-1,1)}c.drawImage(v,0,0,size.width,size.height);c.restore();return canvas}
function prepare(v){v.muted=true;v.defaultMuted=true;v.autoplay=true;v.playsInline=true;for(const name of ['muted','autoplay','playsinline','webkit-playsinline'])v.setAttribute(name,'')}
async function resume(v){prepare(v);let timer;try{await Promise.race([v.play(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Pratinjau belum berjalan.')),5000)})]);return true}catch{return false}finally{clearTimeout(timer)}}
async function ready(v,timeout=8000){if(v.readyState>=2&&v.videoWidth>0&&v.videoHeight>0)return true;return new Promise(resolve=>{let timer;const finish=ok=>{clearTimeout(timer);v.removeEventListener('loadeddata',check);v.removeEventListener('playing',check);v.removeEventListener('resize',check);resolve(ok)},check=()=>{if(v.readyState>=2&&v.videoWidth>0&&v.videoHeight>0)finish(true)};for(const name of ['loadeddata','playing','resize'])v.addEventListener(name,check);timer=setTimeout(()=>finish(false),timeout);check()})}
async function attach(v,stream){prepare(v);v.srcObject=stream;if(!await resume(v))return false;return ready(v)}
const api={request,prepare,resume,ready,attach,naturalZoom,frameSize,captureFrame};g.PixCamera=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
