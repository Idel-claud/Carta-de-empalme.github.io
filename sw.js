const V='empalmes-v3';
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(LOCAL);
 await Promise.all(CDN.map(u=>c.add(u).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith((async()=>{
  const c=await caches.open(V);const hit=await c.match(e.request,{ignoreSearch:true});
  if(hit)return hit;
  try{const r=await fetch(e.request);if(r.ok&&(new URL(e.request.url).origin===location.origin||e.request.url.startsWith('https://cdnjs.cloudflare.com/')))c.put(e.request,r.clone());return r}
  catch(_){if(e.request.mode==='navigate')return c.match('index.html');throw _}
 })())});
