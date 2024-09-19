const CACHE_NAME = 'loomia-whiteboard-cache';
const assetsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/components/Header.tsx',
  '/src/components/Toolbar.tsx',
  '/src/assets/styles/index.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
