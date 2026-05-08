const STATIC_CACHE = 'time-aurora-static-v3';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg'];

function isWeatherRequest(request) {
  return new URL(request.url).hostname === 'api.open-meteo.com';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && (url.pathname.startsWith('/assets/') || APP_SHELL.includes(url.pathname));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key)))),
      self.clients.matchAll({ type: 'window' }).then((clients) => clients.forEach((client) => client.postMessage({ type: 'APP_UPDATE_READY' }))),
    ]),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (isWeatherRequest(event.request)) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          return response;
        });
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request).catch(() => caches.match('/'))),
  );
});
