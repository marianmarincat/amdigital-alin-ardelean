// sw.js - Service Worker

const CACHE_NAME = 'pontaj-qr-cache-v1'; // Schimbați versiunea cache-ului dacă actualizați fișierele majore
const urlsToCache = [
  '/', // Adresa de bază (va încărca index.html datorită setărilor GitHub Pages sau serverului)
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'amdigital.png', // Iconița principală
  // Adăugați aici imaginea QR specifică. Este important ca aceasta să fie în cache!
  'alin_ardelean.jpg' // !!! IMPORTANT: Asigurați-vă că acest nume corespunde imaginii QR curente !!!
                     // Pentru fiecare angajat nou, acest fișier sw.js va trebui actualizat cu numele imaginii lui.
];

// Instalarea Service Worker-ului și punerea în cache a fișierelor
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache urls:', error);
      })
  );
  self.skipWaiting(); // Forțează noul Service Worker să devină activ imediat
});

// Activarea Service Worker-ului și curățarea cache-urilor vechi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Preia controlul asupra clienților (paginilor) deschise
  );
});

// Interceptarea cererilor de rețea
self.addEventListener('fetch', event => {
  // Ne interesează doar cererile GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Dacă resursa este în cache, o returnăm de acolo
        if (response) {
          return response;
        }

        // Altfel, încercăm să o obținem din rețea
        // Și o punem în cache pentru utilizări viitoare (opțional, dar bun pentru actualizări dinamice)
        return fetch(event.request).then(
          networkResponse => {
            // Verificăm dacă am primit un răspuns valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Important: Clonăm răspunsul. Un răspuns este un Stream și poate fi consumat o singură dată.
            // Trebuie să clonăm unul pentru browser și unul pentru cache.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          // Eșec la fetch - probabil offline și nu e în cache
          console.error('Fetch failed; returning offline page instead.', error);
          // Aici ați putea returna o pagină offline generică dacă doriți
          // Pentru acest caz simplu, dacă fișierul nu e în cache, va eșua.
        });
      })
  );
});
