// Keep photos, diary, APIs and game content fresh: no response caching.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MY WORLD</title><body style="background:#120a21;color:#f6c833;font:16px monospace;padding:40px"><h1>MY WORLD</h1><p>Bạn đang ngoại tuyến. Kết nối mạng để mở thế giới của Phương Anh nhé.</p><button onclick="location.reload()">Thử lại</button></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )));
});
