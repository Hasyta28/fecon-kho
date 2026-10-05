// FECON Kho - Service Worker v5.28.0
// Từ 5.28.0: điện thoại GIỮ bản đang dùng cho tới khi người dùng bấm "Cập nhật".
//  - Mỗi bản app lưu trong 1 bộ nhớ riêng "fecon-app-<số bản>". Bản đang dùng ghi ở "fecon-meta" (/__active).
//  - Mở app: lấy file từ bộ nhớ của bản đang dùng; thiếu file nào mới lấy từ mạng.
//  - Có sw.js mới trên GitHub: tải sẵn bản mới vào bộ nhớ riêng nhưng KHÔNG đổi bản đang dùng.
//  - Địa chỉ có ?fresh=... luôn lấy thẳng từ mạng (app dùng để kiểm tra / tải bản mới).
const VERSION = '5.28.0';
const APP = 'fecon-app-', META = 'fecon-meta';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './bg-login.jpg'];

const getActive = () => caches.open(META).then(c => c.match('./__active')).then(r => r ? r.text() : '').catch(() => '');
const setActive = v => caches.open(META).then(c => c.put('./__active', new Response(v)));

async function stage(ver) {                 // tải các file chính của bản trên mạng vào bộ nhớ của bản đó
  const c = await caches.open(APP + ver);
  await Promise.all(CORE.map(u => fetch(u + '?fresh=' + Date.now(), { cache: 'no-store' })
    .then(async r => {
      if (!r.ok) return;
      if ((u === './' || u === './index.html') && !(await r.clone().text()).includes("const APP_VERSION = '" + ver + "'")) return;   // GitHub đang có bản khác → không lưu nhầm
      return c.put(u, r);
    }).catch(() => {})));
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(stage(VERSION).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    let act = await getActive();
    if (!act) { act = VERSION; await setActive(act); }           // cài lần đầu / chuyển từ bản ≤5.27 (bản cũ luôn lấy từ mạng)
    const keep = [META, APP + act, APP + VERSION];
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => keep.indexOf(k) < 0).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'stage' && e.data.ver) e.waitUntil(stage(e.data.ver));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;                // Google Script, thư viện ngoài: không can thiệp
  if (url.searchParams.has('fresh')) return;                      // kiểm tra / tải bản mới: đi thẳng ra mạng
  e.respondWith((async () => {
    const act = await getActive();
    const key = req.mode === 'navigate' ? './index.html' : req;
    if (act) {
      const c = await caches.open(APP + act);
      const hit = await c.match(key, { ignoreSearch: true });
      if (hit) return hit;
      try {                                                        // file chưa có trong bộ nhớ (ảnh hướng dẫn…): lấy mạng rồi lưu
        const res = await fetch(req);
        if (res && res.ok && req.mode !== 'navigate') c.put(req, res.clone()).catch(() => {});
        return res;
      } catch (err) {
        return (await caches.match(key, { ignoreSearch: true })) || Response.error();
      }
    }
    try { return await fetch(req, { cache: 'no-store' }); }
    catch (err) { return (await caches.match(key, { ignoreSearch: true })) || Response.error(); }
  })());
});
