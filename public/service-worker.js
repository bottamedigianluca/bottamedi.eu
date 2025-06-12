// public/service-worker.js

const CACHE_NAME = 'bottamedi-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-bottamedi.webp',
  '/favicon.webp',
  '/apple-touch-icon.webp',
  '/images/poster.webp',
  '/images/banchetto.webp',
  // Aggiungi qui altri asset critici che vuoi mettere in cache subito
  // Nota: Vite aggiunge hash ai file in 'dist/assets', quindi la cache dinamica è più importante.
];

// 1. Installazione del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installazione...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching degli asset iniziali');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: Caching fallito', error);
      })
  );
  self.skipWaiting();
});

// 2. Attivazione e pulizia delle vecchie cache
self.addEventListener('activate', event => {
  console.log('Service Worker: Attivazione...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Pulizia vecchia cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Intercettazione delle richieste (Strategia Cache-First)
self.addEventListener('fetch', event => {
  // Ignora le richieste non-GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request)
        .then(response => {
          // Se la risorsa è in cache, restituiscila
          if (response) {
            return response;
          }

          // Altrimenti, fai la richiesta di rete
          return fetch(event.request).then(networkResponse => {
            // E se la risposta è valida, mettila in cache per usi futuri
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(error => {
          console.error('Service Worker: Errore nel fetch', error);
          // Qui potresti fornire una pagina di fallback offline
        });
    })
  );
});
