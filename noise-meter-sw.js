// Service Worker for Class Calm Meter (standalone)
// Version: v1.0.0 - increment when you update the app
var CACHE_NAME = 'calmmeter-v1-0-0';
var OFFLINE_URL = '/classroom-noise-meter';

var FILES_TO_CACHE = [
  '/classroom-noise-meter',
  '/index.html',
  '/noise-meter-manifest.json',
  'https://trackedu.github.io/common-assets/teacherapp.png'
];

// Install - cache files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Activate - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
