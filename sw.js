const CACHE_NAME = 'kantutegia-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Installation : Mise en cache des fichiers de structure
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Récupération des ressources : Stratégie Cache-First avec mise à jour en arrière-plan
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Renvoie immédiatement la version en cache
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {}); // Échec silencieux si pas de réseau
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});