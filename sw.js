const CACHE_NAME = 'trackedu-v4';
const ASSETS = [
  '/app/',
  '/app-icon.png' // New branded icon
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // THE FIX: "ignoreSearch: true" allows the cache to work with any ?id= school
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    })
  );
});
