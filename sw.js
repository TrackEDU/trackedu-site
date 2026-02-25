const CACHE_NAME = 'trackedu-v16'; // Version bump to force iPad refresh
const ASSETS = [
  'https://trackedu.github.io/common-assets/studentapp.png',
  'https://trackedu.github.io/common-assets/teacherapp.png',
  'https://trackedu.github.io/common-assets/tsloading.png'
];

// 1. Install Stage: Pre-cache core assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate Stage: Clean up old caches
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

// 3. Fetch Stage: Optimized for iPad Standalone Mode
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // ⚡ IPAD STANDALONE BYPASS: Do not intercept Google Apps Script system URLs.
  // Intercepting these in PWA mode causes a massive 5-8 second hang on iOS.
  if (url.includes('google.com/macros') || url.includes('googleusercontent.com')) {
    return; // Let the browser handle these natively and fast
  }

  // Strategy for HTML/App Logic: NETWORK FIRST
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
  // Strategy for Images/Assets: CACHE FIRST
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).catch(() => {
           console.log("Asset not found");
        });
      })
    );
  }
});
