// public/service-worker.js
// Smart Service Worker con strategia di cache intelligente

const CACHE_NAME = 'bottamedi-cache-v2';
const CACHE_VERSION = '2.0.0';

// Asset statici che cambiano raramente (Cache-First)
const STATIC_ASSETS = [
  '/manifest.json',
  '/logo-bottamedi.webp',
  '/favicon.webp',
  '/apple-touch-icon.webp',
  '/images/poster.webp',
  '/images/banchetto.webp'
];

// File critici che devono essere sempre aggiornati (Network-First)
const DYNAMIC_ASSETS = [
  '/',
  '/index.html'
];

// Asset con hash Vite - rilevamento automatico
const isViteAsset = (url) => {
  return url.includes('/assets/') && /\.[a-f0-9]{8,}\.(js|css)$/i.test(url);
};

// Asset immagini - Cache-First con refresh periodico
const isImageAsset = (url) => {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url);
};

// Utility: Check se la risorsa è "stale" (più vecchia di X tempo)
const isStale = (response, maxAge = 24 * 60 * 60 * 1000) => { // 24 ore default
  if (!response || !response.headers.get('date')) return true;
  
  const responseDate = new Date(response.headers.get('date'));
  const now = new Date();
  return (now.getTime() - responseDate.getTime()) > maxAge;
};

// 1. INSTALLAZIONE - Pre-cache degli asset statici
self.addEventListener('install', event => {
  console.log(`🚀 Service Worker v${CACHE_VERSION}: Installazione...`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Pre-caching asset statici...');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(error => {
        console.error('❌ Errore nel pre-caching:', error);
      })
  );
  
  // Forza l'attivazione immediata
  self.skipWaiting();
});

// 2. ATTIVAZIONE - Pulizia cache vecchie
self.addEventListener('activate', event => {
  console.log(`✅ Service Worker v${CACHE_VERSION}: Attivazione...`);
  
  event.waitUntil(
    Promise.all([
      // Pulizia cache vecchie
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🧹 Rimozione cache obsoleta:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim tutti i client
      self.clients.claim()
    ])
  );
});

// 3. STRATEGIA DI FETCH INTELLIGENTE
self.addEventListener('fetch', event => {
  // Ignora richieste non-GET e richieste a domini esterni
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  
  // STRATEGIA 1: Network-First per file critici (HTML, root)
  if (DYNAMIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // STRATEGIA 2: Stale-While-Revalidate per asset Vite
  if (isViteAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidateStrategy(event.request));
    return;
  }
  
  // STRATEGIA 3: Cache-First con refresh periodico per immagini
  if (isImageAsset(url.pathname)) {
    event.respondWith(cacheFirstWithRefreshStrategy(event.request));
    return;
  }
  
  // STRATEGIA 4: Cache-First per tutto il resto (font, manifest, ecc.)
  event.respondWith(cacheFirstStrategy(event.request));
});

// STRATEGIA NETWORK-FIRST: Prova prima la rete, poi la cache
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    console.log('🌐 Network-First:', request.url);
    
    // Prova prima la rete con timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]);
    
    // Se la rete risponde, aggiorna la cache
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📱 Fallback alla cache per:', request.url);
  }
  
  // Fallback alla cache se la rete fallisce
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Ultimo resort: pagina offline
  return new Response('Contenuto non disponibile offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// STRATEGIA STALE-WHILE-REVALIDATE: Restituisci cache, aggiorna in background
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  console.log('🔄 Stale-While-Revalidate:', request.url);
  
  // Restituisci immediatamente dalla cache se disponibile
  const cachedResponse = await cache.match(request);
  
  // Contemporaneamente, aggiorna in background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('⚠️ Aggiornamento background fallito:', error);
    return null;
  });
  
  // Restituisci cache se disponibile, altrimenti aspetta la rete
  return cachedResponse || await fetchPromise;
}

// STRATEGIA CACHE-FIRST CON REFRESH: Cache prima, ma controlla se è stale
async function cacheFirstWithRefreshStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  console.log('🖼️ Cache-First con refresh:', request.url);
  
  // Se in cache e non stale, restituisci subito
  if (cachedResponse && !isStale(cachedResponse, 7 * 24 * 60 * 60 * 1000)) { // 7 giorni
    return cachedResponse;
  }
  
  // Altrimenti prova la rete
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📱 Fallback alla cache stale:', request.url);
  }
  
  // Fallback alla cache stale se disponibile
  return cachedResponse || new Response('Risorsa non disponibile', {
    status: 404,
    statusText: 'Not Found'
  });
}

// STRATEGIA CACHE-FIRST CLASSICA: Per asset veramente statici
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('💾 Cache hit:', request.url);
    return cachedResponse;
  }
  
  console.log('🌐 Cache miss, fetch:', request.url);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Fetch fallito:', error);
    return new Response('Risorsa non disponibile offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// 4. GESTIONE MESSAGGI - Per controllo manuale della cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Skip waiting richiesto');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('🧹 Pulizia cache richiesta');
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('✅ Cache pulita');
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// 5. NOTIFICA AGGIORNAMENTI DISPONIBILI
self.addEventListener('updatefound', () => {
  console.log('🔄 Nuovo Service Worker trovato');
  
  // Notifica ai client che c'è un aggiornamento
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: CACHE_VERSION
      });
    });
  });
});

console.log(`🎯 Smart Service Worker v${CACHE_VERSION} inizializzato con strategia intelligente`);
console.log('📋 Strategie configurate:');
console.log('  • Network-First: HTML, pagine principali');
console.log('  • Stale-While-Revalidate: Asset Vite con hash');
console.log('  • Cache-First con refresh: Immagini (7 giorni)');
console.log('  • Cache-First: Asset statici (manifest, favicon)');
