const V='empalmes-v7';
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);
 await Promise.all(LOCAL.map(u=>c.add(new Request(u,{cache:'reload'}))));
 await Promise.all(CDN.map(u=>c.add(u).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url),same=u.origin===location.origin;
 e.respondWith((async()=>{
  const c=await caches.open(V);
  if(same){ // red primero (siempre la versión más reciente), caché si no hay conexión
   try{const r=await fetch(e.request,{cache:'no-cache'});if(r.ok)c.put(e.request,r.clone());return r}
   catch(_){const hit=await c.match(e.request,{ignoreSearch:true});if(hit)return hit;if(e.request.mode==='navigate')return c.match('index.html');throw _}
  }
  const hit=await c.match(e.request);if(hit)return hit;
  const r=await fetch(e.request);if(r.ok&&u.origin==='https://cdnjs.cloudflare.com')c.put(e.request,r.clone());return r;
 })())});
