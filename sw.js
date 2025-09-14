const CACHE_NAME = "business-catalog-v4";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // activate worker immediately
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim(); // take control of clients right away
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve from cache if available, otherwise fetch from network
      return (
        response ||
        fetch(event.request).catch(() => {
          // Offline fallback: show index.html
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        })
      );
    })
  );
});
