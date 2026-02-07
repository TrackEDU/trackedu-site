const CACHE_NAME = 'trackedu-v14'; // I bumped this to v14 for you
const ASSETS = [
  'https://trackedu.github.io/common-assets/studentapp.png',
  'https://trackedu.github.io/common-assets/teacherapp.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 1. FOR THE HTML FILE (The App Itself) -> NETWORK FIRST
  // This ensures users always get the latest School Registry
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } 
  // 2. FOR IMAGES & ASSETS -> CACHE FIRST (Fast loading)
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
