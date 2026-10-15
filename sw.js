// Graffiti Chess - offline cache. Bump VERSION when you upload a new index.html.
const VERSION='gc-v233';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // network first, bypassing the browser's HTTP cache for the page itself, so a new version shows up at once; the cache is the fallback offline
  const page=e.request.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(new URL(e.request.url).pathname);
  const net=page?fetch(e.request.url,{cache:'no-cache',credentials:'same-origin'}):fetch(e.request);
  e.respondWith(net.then(r=>{ if(r&&r.ok){ const cp=r.clone(); caches.open(VERSION).then(c=>c.put(page?'./index.html':e.request,cp)); } return r; })
    .catch(()=>caches.match(page?'./index.html':e.request).then(m=>m||caches.match('./index.html'))));
});
