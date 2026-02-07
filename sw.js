const CACHE_NAME = 'trackedu-v6';
const ASSETS = [
  '/app/',
  'https://trackedu.github.io/common-assets/studentapp.png',
  'https://trackedu.github.io/common-assets/teacherapp.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
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
