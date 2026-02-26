const CACHE_NAME = 'trackedu-v22'; // Bumped version to force devices to update
const ASSETS = [
  // Base App Images
  'https://trackedu.github.io/common-assets/studentapp.png',
  'https://trackedu.github.io/common-assets/teacherapp.png',
  'https://trackedu.github.io/common-assets/tsloading.png',
  
  // ⚡ WORLD-CLASS TWEAK: Pre-cache the main stylesheets so they load instantly
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
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
  const url = event.request.url;

  // ⚡ IPAD STANDALONE BYPASS:
  // STANDALONE iOS PWAs get stuck "waiting" on the Service Worker.
  // We do not intercept Google system URLs. This stops the 8-second hang.
  if (url.includes('google.com/macros') || url.includes('googleusercontent.com')) {
    return; 
  }

  // ⚡ DYNAMIC FONT & ICON CACHING (The slow Wi-Fi fix):
  // When the CSS asks for the actual font files (.woff2), we catch them, 
  // serve them from cache if we have them, or download and cache them for next time.
  if (url.includes('fonts.gstatic.com') || url.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return instantly from local device
        }
        // If not in cache, fetch it from the network
        return fetch(event.request).then((networkResponse) => {
          // Ensure we only cache valid responses
          if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
            return networkResponse;
          }
          // Clone the response (it can only be consumed once) and put it in the cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default behavior for other requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});
