const CACHE = 'netcontrol-v1';
const ASSETS = [
  './', './index.html', './manifest.json', './favicon.svg',
  './css/style.css', './css/responsive.css', './css/animations.css',
  './js/app.js', './js/router.js', './js/storage.js', './js/ui.js',
  './js/openwrt.js', './js/commands.js', './js/settings.js',
  './js/utils.js', './js/translations.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Navigation → network-first with offline fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Static assets → cache-first
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const c = res.clone();
      caches.open(CACHE).then(x => x.put(e.request, c));
      return res;
    }).catch(() => hit))
  );
});
