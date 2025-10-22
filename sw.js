// /sw.js
const CACHE = 'eu-autista-v1';
const ASSETS = [
  '/',                     // se sua home é index.html
  '/index.html',          // ajuste conforme sua estrutura
  '/css/application.css',
  '/css/plugins.css',
  '/images/logo192.png',
  '/images/logo512.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first para assets; network-first para navegação
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Navegações (páginas)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Assets estáticos
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
