(function(g){'use strict';
function clamp(n,a,b,f){n=Number(n);return Number.isFinite(n)?Math.min(b,Math.max(a,n)):f}
function layout(sw,sh,x,y,w,h,adjust={},fallback=.5){const zoom=clamp(adjust.zoom,1,3,1),ax=clamp(adjust.x,0,1,.5),ay=clamp(adjust.y,0,1,fallback),fit=adjust.fit==='contain'?'contain':'cover',scale=(fit==='contain'?Math.min(w/sw,h/sh):Math.max(w/sw,h/sh))*zoom,rw=sw*scale,rh=sh*scale;return {x:x+(w-rw)*ax,y:y+(h-rh)*ay,width:rw,height:rh,fit}}
function draw(c,image,x,y,w,h,adjust,fallback=.5){const sw=image.videoWidth||image.naturalWidth||image.width,sh=image.videoHeight||image.naturalHeight||image.height;if(!sw||!sh)return;const p=layout(sw,sh,x,y,w,h,adjust,fallback);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();if(p.fit==='contain'){c.fillStyle='#101514';c.fillRect(x,y,w,h)}c.drawImage(image,p.x,p.y,p.width,p.height);c.restore()}
const api={layout,draw};g.PixFraming=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
