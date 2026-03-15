const CACHE = 'iron-north-v3';
const CORE = ['/IronNorth/', '/IronNorth/index.html', '/IronNorth/app.js', '/IronNorth/style.css'];

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
