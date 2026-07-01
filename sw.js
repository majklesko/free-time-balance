// Habitat service worker — network-first (fresh when online, works offline after first load).
const C = "habitat-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return; // let PUT/POST/DELETE hit the network directly
  e.respondWith(
    fetch(e.request)
      .then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request))
  );
});
