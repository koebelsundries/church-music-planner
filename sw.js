const CACHE_NAME = 'sing-hymnal-v9';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fonts/bauhaus-bold.otf',
  './fonts/bauhaus-medium.otf',
  './fonts/bauhaus-demi.otf',
  './fonts/canvasans-regular.otf',
  './fonts/canvasans-medium.otf',
  './fonts/canvasans-bold.otf',
  './icons/fbc-logo-sm.png'
];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's HTTP cache so the newest files
  // from GitHub are stored, not a recently cached older copy.
  e.waitUntil(caches.open(CACHE_NAME).then(c =>
    c.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })))
  ));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    })).catch(() => caches.match('./index.html'))
  );
});
