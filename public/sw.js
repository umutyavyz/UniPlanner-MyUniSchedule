// Cache name — bump this on every deploy that changes HTML/JS output
const CACHE_NAME = 'uniplanner-v3';

// Only cache stable static assets aggressively.
// HTML pages are fetched network-first so client bundles never get out of sync.
const STATIC_ASSETS = [
    '/manifest.json',
    '/file.svg',
    '/globe.svg',
    '/next.svg',
    '/vercel.svg',
    '/window.svg'
];

// Install — pre-cache a small set of truly static assets only
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate — nuke every old cache so stale HTML/JS cannot be served
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Helpers
const isNavigation = (request) =>
    request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

const isHashedStatic = (url) =>
    url.pathname.startsWith('/_next/static/');

// Fetch — network-first for HTML / RSC, cache-first only for hashed static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Skip Next.js RSC / data requests entirely — let the browser talk to the server
    if (url.searchParams.has('_rsc') || request.headers.get('RSC') === '1') {
        return;
    }

    // 1) Hashed, immutable static assets — cache-first
    if (isHashedStatic(url)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // 2) HTML navigation requests — network-first, fall back to cached '/' only when offline
    if (isNavigation(request)) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Do NOT cache HTML — it's tied to a build id that changes every deploy
                    return response;
                })
                .catch(() => caches.match('/') || new Response('Offline', { status: 503 }))
        );
        return;
    }

    // 3) Everything else (images, fonts, etc.) — stale-while-revalidate
    event.respondWith(
        caches.match(request).then((cached) => {
            const network = fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});

// Background sync placeholder
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(Promise.resolve());
    }
});
