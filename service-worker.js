/**
 * SERVICE WORKER v2.1 - ERROR TOLERANT
 * Handles missing files gracefully
 */

const CACHE_NAME = 'nepali-calendar-v2.1';

// Files to cache (relative paths)
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './db.js',
    './conversion.js',
    './charts.js',
    './budget.js',
    './insurance.js',
    './vehicle.js',
    './subscription.js',
    './notification.js',
    './medicine-tracker.js',
    './debug.js',
    './utils.js',
    './custom.js',
    './import-export.js',
    './manifest.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache files one by one to avoid failure on missing files
                return Promise.allSettled(
                    urlsToCache.map(url => 
                        cache.add(url).catch(err => {
                            // Silently ignore missing files
                        })
                    )
                );
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker installation failed:', error);
            })
    );
});

// Activate event - clean old caches
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
        .then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip chrome-extension and other non-http(s) requests
    if (!event.request.url.startsWith('http')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        // Don't cache non-successful responses
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        
                        // Clone and cache the response
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return fetchResponse;
                    })
                    .catch(() => {
                        // Return offline page if available
                        return caches.match('./index.html');
                    });
            })
    );
});
