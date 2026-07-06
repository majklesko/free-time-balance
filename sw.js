// Habitat service worker — network-first (fresh when online, works offline after first load).
// Bump C on each deploy so installed apps pick up the new version (auto-reload via controllerchange).
const C = "habitat-v11";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil((async () => {
  const ks = await caches.keys();
  await Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return; // let PUT/POST/DELETE hit the network directly
  e.respondWith(
    fetch(e.request)
      .then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request))
  );
});
