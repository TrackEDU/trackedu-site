const CACHE_NAME = 'trackedu-v16'; // I bumped this to v14 for you
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
  const url = event.request.url;

  // ⚡ IPAD SPEED FIX: Do not intercept Google Script redirects.
  // Intercepting these in PWA mode causes a massive 5-8 second hang on iOS.
  if (url.includes('google.com/macros') || url.includes('googleusercontent.com')) {
    return; // Let the browser handle these natively and fast
  }

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
