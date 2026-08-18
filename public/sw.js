const CACHE_PREFIX = "aurora-clock";
const LEGACY_CACHE_PREFIX = "time-aurora-static-";
const BUILD_VERSION = "__BUILD_VERSION__";
const SCOPE_URL = new URL(self.registration.scope);
const CACHE_NAME = `${CACHE_PREFIX}-${BUILD_VERSION}`;
const PRECACHE_ASSETS = /* __PRECACHE_MANIFEST__ */ [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
];
const APP_SHELL = PRECACHE_ASSETS.map((path) => new URL(path, SCOPE_URL).href);

function isWeatherRequest(request) {
  return new URL(request.url).hostname === "api.open-meteo.com";
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  const scopePath = SCOPE_URL.pathname.endsWith("/")
    ? SCOPE_URL.pathname
    : `${SCOPE_URL.pathname}/`;
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith(`${scopePath}assets/`) ||
      APP_SHELL.includes(url.href))
  );
}

function isDocumentRequest(request) {
  return request.mode === "navigate" || request.destination === "document";
}

async function cacheResponse(request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const hadPreviousCache = keys.some(
        (key) =>
          key.startsWith(CACHE_PREFIX) || key.startsWith(LEGACY_CACHE_PREFIX),
      );
      await Promise.all(
        keys
          .filter(
            (key) =>
              (key.startsWith(CACHE_PREFIX) ||
                key.startsWith(LEGACY_CACHE_PREFIX)) &&
              key !== CACHE_NAME,
          )
          .map((key) => caches.delete(key)),
      );
      if (hadPreviousCache) {
        const clients = await self.clients.matchAll({ type: "window" });
        clients.forEach((client) =>
          client.postMessage({ type: "APP_UPDATE_READY" }),
        );
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (isWeatherRequest(event.request)) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isDocumentRequest(event.request)) {
    event.respondWith(
      fetch(new Request(event.request, { cache: "no-store" }))
        .then((response) =>
          cacheResponse(new URL("./index.html", SCOPE_URL).href, response),
        )
        .catch(() => caches.match(new URL("./index.html", SCOPE_URL).href)),
    );
    return;
  }

  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) =>
          cacheResponse(event.request, response),
        );
      }),
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
