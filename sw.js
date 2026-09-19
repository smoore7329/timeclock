// Time Clock offline cache: serves the app from cache when the network is down, updates in the background.
const CACHE = 'timeclock-v2';
const FILES = ['./', './index.html', './manifest.json', './admin.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(cached => {
    const net = fetch(e.request).then(r => { if (r && r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; }).catch(() => cached);
    return cached || net;
  }));
});
