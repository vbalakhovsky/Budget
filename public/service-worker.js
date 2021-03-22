console.log("Hello from gloriours and charming Service Worker!");

const FILES_TO_CACHE = [
    
    "/",
    "/index.html",
    "/db.js",
    "/index.js",
    "/manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/images/Krabs.jpg",
    "styles.css",


];


const CACHE_NAME = `static-cache-v1`;
const DATA_CACHE_NAME = `data-cache-v1`;

// Installation and waiting
self.addEventListener(`install`, (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Money my money");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// activation
self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log(`Removing old cache data`, key);
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );

  self.clients.claim();
});

// Fetch ???
self.addEventListener(`fetch`, (evt) => {
  if (evt.request.url.includes(`/api/`)) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) =>
          fetch(evt.request)
            .then((response) => {
              // put in chache, if the connection works
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            // if offline use cached
            .catch(() => cache.match(evt.request))
        )
        .catch((err) => console.log(err))
    );
  } else {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((response) => response || fetch(evt.request))
    );
  }
});