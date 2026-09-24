// FECON Kho - Service Worker v3
// Ưu tiên tải bản mới từ mạng; chỉ dùng bản lưu tạm khi mất mạng.
// Nhờ vậy mỗi lần cập nhật index.html trên GitHub, điện thoại sẽ thấy bản mới ngay.
const CACHE = 'fecon-kho-v3';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Không can thiệp vào Google Script (dữ liệu) và thư viện bên ngoài
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
