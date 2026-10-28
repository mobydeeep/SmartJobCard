// 같은 사이트 파일은 "네트워크 우선, 실패하면 저장본" — 업데이트가 바로 반영되고, 오프라인에서도 열립니다.
const C = "smartjob-v1";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png"])).catch(() => {})); });
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
