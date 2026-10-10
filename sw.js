// FECON Kho + Thi công - Service Worker v5.35.0
// 5.35.0: Kho — Ở công trường (trong kho + ở công trường), nhập từ công trường về, xuất ra khỏi công trình
// 5.34.0: Thi công — hình cọc/panel tự vẽ theo tiến độ, tính đoạn nối râu, tổ hợp ống đổ, đổ bê tông
// 5.33.2: Danh mục chung thiết bị & vật tư phụ trợ trong gợi ý Nhập/Xuất
// 5.33.1: Phiếu xuất gợi ý như phiếu nhập (mọi nhóm, DS giải động, máy móc)
// 5.33.0: Mượn/trả + máy rời công trình trong Nhập/Xuất, nhắc giải động Telegram, xuất BM05
// 5.32.0: Giải động (DS BM05, xuất giải động 3 hướng, nhận từ công trình khác, cảnh báo đến hạn)
// 5.31.11: Hướng dẫn sử dụng trong Thi công (nút ? trên mỗi màn hình)
// 5.31.10: Thi công trên máy tính dùng hết chiều ngang màn hình
// 5.31.9: biểu tượng Phosphor Duotone (màu cam FECON) thay cho emoji
// 5.31.8: tên app FECON · chữ to hơn 10% · nút chuyển Kho / Thi công nổi bật · bỏ chú thích thừa
// 5.31.7: Thi công 1.4 — Admin phân quyền Thi công + giao dự án ngay trong Thi công
// 5.31.6: menu Thi công giống Kho · màn chọn Kho / Thi công dùng nền đăng nhập
// 5.31.5: Thi công 1.3.1 — sửa kẹt khi đổi dự án lúc đang đồng bộ
// 5.31.4: Thi công 1.3 — tự cập nhật phiên bản ngay trong Thi công · tải nền bản ghi để chạm cọc hiện ngay
// 5.31.3: Thi công 1.2.1 — bấm cọc / panel: thẻ mặt cắt + hiện trạng nổi ngay trên mặt bằng
// 5.31.2: Thi công 1.2 — ngưỡng theo ITP đã duyệt, bộ biên bản in / Excel
// 5.31.0: thêm trang thicong.html (Thi công) — mở thicong.html lấy đúng trang đó, không đổi sang index.html
// Từ 5.28.0: điện thoại GIỮ bản đang dùng cho tới khi người dùng bấm "Cập nhật".
//  - Mỗi bản app lưu trong 1 bộ nhớ riêng "fecon-app-<số bản>". Bản đang dùng ghi ở "fecon-meta" (/__active).
//  - Mở app: lấy file từ bộ nhớ của bản đang dùng; thiếu file nào mới lấy từ mạng.
//  - Có sw.js mới trên GitHub: tải sẵn bản mới vào bộ nhớ riêng nhưng KHÔNG đổi bản đang dùng.
//  - Địa chỉ có ?fresh=... luôn lấy thẳng từ mạng (app dùng để kiểm tra / tải bản mới).
const VERSION = '5.35.0';
const APP = 'fecon-app-', META = 'fecon-meta';
const CORE = ['./', './index.html', './thicong.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './bg-login.jpg'];

const getActive = () => caches.open(META).then(c => c.match('./__active')).then(r => r ? r.text() : '').catch(() => '');
const setActive = v => caches.open(META).then(c => c.put('./__active', new Response(v)));

async function stage(ver) {                 // tải các file chính của bản trên mạng vào bộ nhớ của bản đó
  const c = await caches.open(APP + ver);
  await Promise.all(CORE.map(u => fetch(u + '?fresh=' + Date.now(), { cache: 'no-store' })
    .then(async r => {
      if (!r.ok) return;
      if ((u === './' || u === './index.html') && !(await r.clone().text()).includes("const APP_VERSION = '" + ver + "'")) return;   // GitHub đang có bản khác → không lưu nhầm
      if (u === './thicong.html' && !(await r.clone().text()).includes("const KHO_VERSION = '" + ver + "'")) return;
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
    const key = req.mode === 'navigate' ? (/thicong\.html$/.test(url.pathname) ? './thicong.html' : './index.html') : req;
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
