// Updates: pushing a new index.html to GitHub is enough; the app loads it
// automatically. Only change CACHE_NAME below when you replace a font, icon,
// or the manifest.
const CACHE_NAME = 'sing-hymnal-v10';
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

// How long to wait for GitHub before falling back to the saved copy of the page.
const NETWORK_TIMEOUT_MS = 4000;

function isPageRequest(req) {
  if (req.mode === 'navigate') return true;
  const url = new URL(req.url);
  return url.origin === self.location.origin &&
    (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'));
}

// The page: get the newest copy from GitHub when online, and save it for offline use.
// If the network is slow or unavailable, use the saved copy instead.
function pageNetworkFirst(req) {
  const network = fetch(req, { cache: 'no-cache' }).then(resp => {
    if (resp && resp.ok) {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put('./index.html', clone));
    }
    return resp;
  });

  const cached = () => caches.match('./index.html').then(r => r || caches.match('./'));

  return new Promise(resolve => {
    let settled = false;
    const finish = r => { if (!settled && r) { settled = true; resolve(r); } };

    // Slow connection: show the saved page, but let the download finish in the background.
    const timer = setTimeout(() => cached().then(finish), NETWORK_TIMEOUT_MS);

    network.then(resp => { clearTimeout(timer); finish(resp); })
      .catch(() => {
        clearTimeout(timer);
        cached().then(r => {
          if (r) finish(r);
          else { settled = true; resolve(Response.error()); }
        });
      });
  });
}

// Everything else (fonts, icons, manifest): use the saved copy first.
function cacheFirst(req) {
  return caches.match(req).then(r => r || fetch(req).then(resp => {
    if (resp && resp.ok && new URL(req.url).origin === self.location.origin) {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, clone));
    }
    return resp;
  }));
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (isPageRequest(e.request)) {
    e.respondWith(pageNetworkFirst(e.request));
  } else {
    e.respondWith(cacheFirst(e.request).catch(() => caches.match('./index.html')));
  }
});
