/* Axé de Quitéria — Loja: service worker */
const CACHE = 'axe-loja-v1';
const SHELL = [
  './Loja.html',
  './loja.css',
  './loja-supabase.js',
  './loja-data.js',
  './loja-ui.jsx',
  './loja-home.jsx',
  './loja-product.jsx',
  './loja-auth.jsx',
  './loja-cart.jsx',
  './loja-app.jsx',
  './assets/logo-circ.png',
  './manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => Promise.all(
      SHELL.map((u) => c.add(u).catch(() => null))
    ))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./Loja.html', copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req).then((h) => h || caches.match('./Loja.html')))
    );
    return;
  }

  if(sameOrigin){
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  if(url.hostname.endsWith('supabase.co')) return;

  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(() => hit))
  );
});
