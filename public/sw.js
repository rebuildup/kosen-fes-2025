// Service Worker for caching strategy
const CACHE_NAME = "kosen-fes-2025-v3";
const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v3";
const IMAGE_CACHE = "images-v3";

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  // Critical CSS and JS will be added dynamically
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache strategy based on request type
  if (request.destination === "image") {
    // Images: Cache First strategy with dedicated image cache
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(IMAGE_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Return a placeholder image if fetch fails
            return new Response("", { status: 404 });
          });
      }),
    );
  } else if (
    request.destination === "style" ||
    request.destination === "script"
  ) {
    // CSS/JS: Stale While Revalidate strategy
    event.respondWith(
      caches.match(request).then((response) => {
        const fetchPromise = fetch(request).then((fetchResponse) => {
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return fetchResponse;
        });

        return response || fetchPromise;
      }),
    );
  } else if (request.destination === "document") {
    // HTML: Network First strategy
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        }),
    );
  }
});

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks
      console.log("Background sync triggered"),
    );
  }
});

// Push notification handling
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "kosen-fes-notification",
      requireInteraction: false,
      actions: [
        {
          action: "open",
          title: "開く",
        },
        {
          action: "close",
          title: "閉じる",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"));
  }
});
