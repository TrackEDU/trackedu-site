const CACHE_NAME = 'trackedu-v8'; // Increment this whenever you update the registry
const ASSETS = [
  '/app/',
  'https://trackedu.github.io/common-assets/studentapp.png',
  'https://trackedu.github.io/common-assets/teacherapp.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Forces the new service worker to become active immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Deletes old versions to save space
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    })
  );
});
