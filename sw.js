// Graffiti Chess - offline cache. Bump VERSION when you upload a new index.html.
const VERSION='gc-v126';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // network first (so updates arrive), cache as fallback when offline
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(VERSION).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
