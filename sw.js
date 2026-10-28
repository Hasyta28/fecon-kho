// FECON Kho + Thi công - Service Worker v5.56.5
// 5.56.5: sửa tồn tính trùng (khai số ở công trường), báo cáo Excel bỏ cột cố định
// 5.56.4: gộp phiếu nhập thẳng ra công trường cũ (Admin), báo cáo đếm lượt nhập / xuất đúng
// 5.56.3: nút Sửa trong Thẻ kho, đối chiếu nhóm hàng trong kho với danh mục, sổ nhiên liệu chỉ gộp đơn vị Lít
// 5.56.2: danh mục tối đa 1.000 món
// 5.56.1: báo cáo kho xếp nhiên liệu theo nhóm (Cont dầu…), sửa nhỏ
// 5.56.0: Danh mục có hình + mã + QR (trang công khai danhmuc.html, tem QR 24 tem / A4)
// 5.55.2: thủ kho chọn ngày giờ phiếu (Admin đặt số ngày tối đa)
// 5.55.0: một tồn kho (hàng ở công trường vẫn là tồn kho), xem phiếu giấy khi quét mã QR
// 5.54.0: phiếu nhập theo xe (PN), biên bản xuất ra khỏi công trình (PX), ô quét QR ở Tổng quan, logo mới
// 5.53.2: phiếu giấy in A4 dọc 4 dải ngang, lề trái kẹp bìa, QR nhỏ hơn
// 5.53.1: phiếu giấy khớp phiếu cóc, kiểm kê, báo cáo; giờ cấp trên phiếu; vật tư cấp thẳng; Admin huỷ nhập
// 5.53.0: phiếu yêu cầu giấy có mã QR (in hàng loạt, chụp QR nhập phiếu, theo dõi dải mã)
// 5.51.1: gợi ý Phiếu nhập / xuất lấy từ Danh mục vật tư (Admin) · icon Phosphor kiểu đặc · bỏ emoji ở ô chọn, ô tìm, Excel, Zalo · "Thẳng ra công trường" dùng hình xe tải
// 5.51.0: Kho — báo cáo Excel khung mới (Tổng quan · Tổng hợp NXT · Sổ nhập · Sổ xuất · Nhiên liệu + phụ lục) · ô Số chứng từ ở phiếu nhập
// 5.50.2: sửa lỗi ngầm khi mở app (Tổng quan: byTimeDescL is not defined)
// 5.50.1: Kho — Tồn kho có ô ⇅ Xếp (số lượng / tên / chủng loại / mới phát sinh); âm lên đầu, 0 xuống cuối
// 5.50.1: Kho — xếp danh sách Tồn kho (Số lượng · Tên · Chủng loại · Mới phát sinh; âm lên đầu, 0 xuống cuối)
// 5.50.0: Kho — Báo hỏng vật tư / thiết bị phụ trợ (Thẻ kho): để chờ · đang sửa · sửa xong · thanh lý; chuyển hàng hỏng sang dự án / kho công ty
// 5.49.4: Kho — ô tìm kiếm ở Phiếu nhập / Phiếu xuất; Thẻ kho từng vật tư (Tồn kho → 📒 Thẻ kho)
// 5.49.3: Kho — sửa: nút Đổi tên trên app còn chặn kho công ty (máy chủ 5.49.2 đã cho đổi)
// 5.49.2: Kho — kho công ty đổi tên được (Kho FECON Đồng Nai → Kho Biên Hòa), ô nhanh hiểu "về kho Biên Hòa / công ty", đơn vị thêm Quả, Đoạn, Búa, Giá, Đầu
// 5.49.1: Kho — đơn vị tính do Admin thêm / bỏ / xếp (Danh mục vật tư → Đơn vị tính); thêm sẵn Ống, Bao, Bình, Chiếc, Cặp, Bó, Lô, Xe, Chuyến, Ca
// 5.49.0: Kho — Quản lý dự án (Admin): đổi tên dự án ở mọi bảng, đóng / mở lại dự án (chỉ xem), xoá dự án trống
// 5.48.0: Kho — phiếu nhập gọn (Thêm thông tin), Danh mục vật tư chung (nhóm · đơn vị · Kho/Thẳng tự chọn), Nhóm vật tư (Admin), cặp thẳng công trường hiện 1 dòng
// 5.47.1: Kho — ô Nhập / Xuất nhanh về dưới 2 ô Nhập / Xuất, thu gọn thành 1 thanh (bấm → bảng trượt xuống), bài hướng dẫn trong nút ?
// 5.47.0: Kho — ô Nhập / Xuất nhanh (một lệnh gõ / nói → tự tách phiếu, xem trước, lưu một lần), hỏi khi nhập trùng hàng mượn đang chờ
// 5.46.1: Kho — đổi / gỡ mã P.QLTB cho máy + vật tư, đổi tên máy giữ lịch sử dầu
// 5.46.0: Kho — giờ máy không bắt buộc (bổ sung sau), giờ cấp dầu thực tế, ngày máy bắt đầu hoạt động, định mức dầu thực tế
// 5.45.1: Kho — sửa số phiếu mượn hiện thành 1 dòng riêng trong lịch sử
// 5.45.0: Kho — sửa số lượng phiếu mượn (bên kia xác nhận), chọn đúng vật tư khi xác nhận mượn, gộp vật tư trùng tên
// 5.44.3: Kho — Tổng quan + Lịch sử nhập / xuất hiện phiếu cho mượn / nhận trả / đi mượn / trả lại
// 5.44.2: Kho — bấm Xác nhận cho mượn / Duyệt thì thẻ trên Tổng quan tắt ngay
// 5.44.1: Kho — sửa nút xác nhận, máy vào, giải động máy, nhãn vị trí, xác nhận cho mượn khi kho thiếu, vật tư mới bắt buộc nhóm + đơn vị
// 5.44.0: Kho — gợi ý tên khi nhập kho thêm 192 vật tư thông dụng (đúng nhóm, đơn vị)
// 5.40.0: Kho — mượn / cho mượn ngoài công trình (tổ đội · dự án FECON liên kết 2 đầu · đơn vị ngoài), lấy từ công trường, nhãn Cho mượn, bỏ thông tin mượn có duyệt
// 5.39.0: Thi công — phiếu Hạ kingpost (4 bước, tọa độ tim + hướng, góc xoay, cao độ), bước tiến độ, biên bản 011 tự điền, nạp tọa độ KP
// 5.38.0: Thi công — QA/QC duyệt ngay trên thẻ Việc; Xe BT 3 bước + cách xe trước; Đăng ký BT giờ xe cuối; Quan trắc so lần trước; Kế hoạch báo máy trùng
// 5.37.0: Thi công — Định vị, Khoan, Trước đổ, Đổ BT từng bước; nút Tiếp tục đúng bước (Hồ sơ, Mặt bằng); Đã tháo n ống; cảnh báo số đo khoan
// 5.36.0: Thi công — phiếu Lồng thép 4 bước (chỉ nhập số đo), Công cụ tính đoạn nối riêng, Tổng quan thẻ Làm tiếp
// 5.35.1: Thiết bị / vật tư phụ trợ tổng 0 → ghi rõ Đã ra khỏi CT / Chờ xác nhận / Chưa có phiếu thay cho Hết hàng
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
const VERSION = '5.56.11';
const APP = 'fecon-app-', META = 'fecon-meta';
const CORE = ['./', './index.html', './thicong.html', './danhmuc.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './bg-login.jpg'];

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
    const key = req.mode === 'navigate' ? (/thicong\.html$/.test(url.pathname) ? './thicong.html' : /danhmuc\.html$/.test(url.pathname) ? './danhmuc.html' : './index.html') : req;   // v5.56: trang danh mục công khai
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
