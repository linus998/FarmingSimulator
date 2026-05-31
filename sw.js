const CACHE = 'ef-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  // Always network-first for GitHub API calls
  if (e.request.url.includes('api.github.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}})));
    return;
  }
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok && e.request.url.startsWith(self.location.origin)) {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      }
      return res;
    }).catch(() => cached))
  );
});
