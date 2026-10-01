// ===== FECON SOUTH - Kho Vật Tư v5.13.0 =====
// v5.13.0: PHIẾU YÊU CẦU CẤP VẬT TƯ + KIỂM KÊ LÀM MỐC + TELEGRAM
//   - 3 chức danh mới: Chỉ huy trưởng (cht), Chỉ huy phó (chp), Kỹ thuật viên (ktv). Admin bật/tắt quyền theo chức danh (setRolePerm)
//   - Tab PhieuYC: phiếu yêu cầu (cóc theo cấu kiện / vật tư khác). Quy trình: chờ kho cấp → đang gửi → hoàn thành
//     (+ chờ hàng khi cấp một phần, từ chối, hủy). Phiếu của KTV cần CHT/CHP duyệt; kho vẫn cấp trước được (ghi nhãn chưa duyệt, duyệt sau)
//   - Kho bấm "Đã gửi" → trừ tồn ngay + tự tạo phiếu xuất (cột Phiếu gốc = số phiếu YC). Bên nhận báo thiếu → phiếu điều chỉnh hoàn kho
//   - Tab CauKien: định mức cóc theo từng cọc / tấm (hàm NAP_dinhMucTTHC nạp 366 cọc + 117 tấm TTHC). Máy chủ tự tính số cóc,
//     có mức tùy chọn bắt buộc chọn và % hao hụt theo dự án (setProjCfg)
//   - TonKho thêm 2 cột: Cấp thẳng (không cần phiếu), Phải chọn máy. Admin đổi bằng setItemFlags
//   - KIỂM KÊ LÀM MỐC (addCount): lưu số đếm thực tế; phiếu ghi bù có giờ trước mốc không làm đổi tồn kho
//   - Telegram: dán mã bot vào TELEGRAM_BOT_TOKEN rồi chạy CAI_DAT_telegram một lần (cần cấp quyền Google)
// v5.12.1: getCost nhanh hơn: lưu tạm kết quả 10 phút (tự làm mới khi có phiếu / giá / tiến độ mới);
//   không cần gửi tên dự án (máy chủ tự chọn dự án đầu tiên và gửi kèm danh sách dự án) → app không phải chờ tải kho xong
// v5.12: getCost gửi kèm danh sách chi tiết cho 3 ô Đã mua vào / Tồn kho đang giữ / Còn phải mua
// v5.11: CHI PHÍ VẬT TƯ cho Quản lý / Admin / Lãnh đạo (Thủ kho không nhận được giá)
//   - Tab BangGia: giá từng vật tư theo ngày áp dụng (phiếu nhập tính theo giá có hiệu lực tại ngày nhập;
//     phiếu trước giá đầu tiên tính theo giá đầu tiên). setPrice: chỉ Quản lý / Admin
//   - Tab HangMuc: tiến độ từng hạng mục (đã làm / tổng); setProgress: chỉ Quản lý / Admin
//   - Tab KeHoach: khối lượng thiết kế theo dòng vật tư và hạng mục (Admin nạp bằng hàm NAP_keHoach...)
//   - getCost: máy chủ tính sẵn tiền đã mua, tồn, còn phải mua, tiến độ, biểu đồ tuần/tháng, so với thiết kế, việc cần xử lý
// v5.10: NẠP DỮ LIỆU TỪ FILE EXCEL THEO DÕI NXT (chạy một lần, chỉ chủ Sheet chạy được trong trình soạn thảo)
//   - Hàm NAP_duLieuExcel: đọc 3 trang NAP_VatTu, NAP_ThietBi, NAP_Phieu → XÓA dữ liệu cũ của dự án NAP_DU_AN
//     (vật tư, máy, phiếu, mượn trả, sửa chữa, ghi chú, ảnh) → ghi vật tư, máy, phiếu theo đúng ngày gốc
//   - Trước khi nạp tự tạo bản sao lưu cả file Sheet trên Drive; sau khi nạp tự kiểm tra tồn từng vật tư
//   - Nhật ký chỉ ghi 1 dòng tổng; các máy tự tải lại toàn bộ phiếu
// v5.9.1: Ẩn vai trò Lãnh đạo với mọi người trừ Admin (danh sách Thành viên, trạng thái đang dùng, Nhật ký hoạt động)
// v5.9: TỔNG HỢP DỰ ÁN cho Admin + vai trò mới LÃNH ĐẠO (xem mọi dự án, chỉ xem, không ghi)
//   - getSummary: máy chủ tính sẵn số liệu mọi dự án (nhập/xuất, dầu DO, dầu/máy khoan/ngày, xuất theo nhóm, dầu theo tuần,
//     vật tư dưới định mức, phiếu mượn quá hạn, lần ghi phiếu cuối) → điện thoại chỉ nhận con số
// v5.8: Ghi lỗi phát sinh trên điện thoại vào tab LoiApp; đăng nhập sai báo số lần còn lại,
//   Admin đặt lại mật khẩu / mở khóa thì gỡ khóa đăng nhập ngay
// v5.7.2: Chỉ Quản lý / Admin được đổi định mức cảnh báo tồn (setMinStock; Thủ kho thêm vật tư mới thì định mức = 0)
// v5.7.1: Admin xóa phiếu → xóa luôn các dòng nhật ký của phiếu (lập phiếu, ảnh, phiếu điều chỉnh gắn kèm, mượn/trả);
//   Admin sửa phiếu → ghi đè dòng nhật ký lập phiếu theo số và ngày giờ mới. Dòng nhật ký phiếu mới có số phiếu "· #…" ở cuối.
// v5.7: ADMIN TOÀN QUYỀN VỚI PHIẾU (giai đoạn chạy thử)
//   - Chỉ Admin: sửa phiếu nhập/xuất/điều chỉnh (vật tư, số lượng, người nhận, thiết bị, ghi chú, ngày giờ), xóa hẳn phiếu,
//     chọn ngày giờ khi lập phiếu, sửa / xóa phiếu mượn. Tồn kho tự tính lại. Các thao tác này không ghi nhật ký.
//   - Xóa phiếu: xóa dòng trong GiaoDich, xóa phiếu điều chỉnh gắn kèm, xóa ảnh (chuyển vào thùng rác Drive)
//   - Sau khi sửa / xóa, các máy tự tải lại toàn bộ phiếu (số hiệu txnRev)
// v5.6: CHO MƯỢN / TRẢ (Giai đoạn 3)
//   - Tab mới MuonTra: phiếu cho mượn / đi mượn vật tư và máy móc, hạn trả, trả từng phần, đóng phiếu có lý do
//   - Vật tư: cho mượn trừ tồn, nhận trả cộng tồn; đi mượn cộng tồn, trả lại trừ tồn (ghi vào GiaoDich
//     với loại chomuon / nhantra / dimuon / tralai, cột "Phiếu gốc" = số phiếu mượn)
//   - Đóng phiếu còn thiếu: phần không trả được quy đổi thành phiếu xuất (cho mượn) hoặc phiếu nhập (đi mượn)
//   - Máy móc: chỉ ghi máy đang ở đâu, ai giữ (không có số tồn)
//   - Không cần cấp thêm quyền Google: chỉ dán code và tạo Phiên bản mới
// v5.5: Admin xem ai đang dùng app, đang đăng nhập trên máy nào; đăng xuất từ xa
// v5.4: MỖI DỰ ÁN LÀ MỘT KHO RIÊNG (vật tư, tồn kho, máy móc, ghi chú, sửa chữa, phiếu, ảnh đều riêng)
//   - Admin/Quản lý thấy mọi dự án; Thủ kho/Chỉ xem chỉ thấy dự án được giao (máy chủ không gửi dữ liệu dự án khác)
//   - Admin/Quản lý giao dự án cho thành viên trong mục Thành viên
//   - Dữ liệu cũ chưa có dự án được tự gán vào dự án đầu tiên (tab DuAn) ở lần chạy đầu
// v5.3: ảnh biên bản lưu Google Drive (riêng tư, chỉ xem qua app sau khi đăng nhập)
//   ⚠ LẦN ĐẦU: chọn hàm KHOI_TAO_thuMucAnh ở thanh trên → ▶ Chạy → cho phép quyền Google Drive,
//     sau đó mới Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới.
// v5.2: tải phiếu theo phần mới (chỉ gửi phiếu chưa có trên máy) + gọn dữ liệu → đồng bộ nhanh hơn nhiều
// GIAI ĐOẠN 1 — Tài khoản & bảo mật
//  - Tài khoản riêng từng người (tên đăng nhập + mật khẩu; mật khẩu lưu dạng băm có muối, không lưu chữ thật)
//  - MỌI yêu cầu (kể cả đọc dữ liệu) phải kèm token; máy chủ kiểm tra quyền của từng thao tác
//  - Người mới gửi yêu cầu → Admin duyệt mới xem được. Admin đầu tiên = tài khoản ADMIN_USERNAME
//  - Phiếu nhập/xuất KHÔNG sửa/xóa được — chỉ tạo phiếu điều chỉnh có lý do
//  - Máy chủ tự ghi người lập + giờ máy chủ cho mọi phiếu; Nhật ký hoạt động (tab NhatKy)
//  - Tồn kho chỉ thay đổi qua phiếu (không còn sửa tay số tồn)
//  - Chống chèn mã độc: ký tự < > " ' & trong dữ liệu người dùng nhập được đổi sang ký tự tương tự vô hại
//
// CÁCH CẬP NHẬT (giữ nguyên URL cũ):
//  Triển khai → Quản lý triển khai → ✏️ Chỉnh sửa → Phiên bản: "Phiên bản mới" → Triển khai.
//  Thực thi với tư cách: Tôi · Người có quyền truy cập: Bất kỳ ai.

// ---------- CẤU HÌNH ----------
const ADMIN_USERNAME = 'hasyta';     // Tài khoản Admin đầu tiên (chỉ tên này được đăng ký khi hệ thống chưa có Admin)
const SESSION_DAYS   = 30;           // Đăng nhập được nhớ bao nhiêu ngày (tự gia hạn khi còn dùng)
const HASH_ROUNDS    = 300;          // Số vòng băm mật khẩu
const MAX_PENDING    = 30;           // Tối đa bao nhiêu yêu cầu chờ duyệt (chống spam)
const TZ = 'Asia/Ho_Chi_Minh';
const SERVER_VERSION = '5.13.0';
const PHOTO_FOLDER_NAME = 'FECON Kho - Ảnh biên bản';
const PHOTO_MAX_BYTES = 4 * 1024 * 1024;

const RANK = { xem:1, ld:1, ktv:1, chp:1, cht:1, tk:2, ql:3, admin:4 };   // cht/chp/ktv: quyền kho như Chỉ xem, quyền phiếu yêu cầu theo bảng quyền   // ld = Lãnh đạo: quyền ghi như Chỉ xem, nhưng xem mọi dự án
const ROLE_NAME = { admin:'Admin', ql:'Quản lý', tk:'Thủ kho', xem:'Chỉ xem', ld:'Lãnh đạo', cht:'Chỉ huy trưởng', chp:'Chỉ huy phó', ktv:'Kỹ thuật viên' };

const TABLES = {
  items:   { sheet:'TonKho',  cols:['id','name','cat','unit','stock','minStock','project','capThang','canMay'],
             head:['ID','Tên vật tư','Nhóm','Đơn vị','Tồn kho','Tối thiểu','Dự án','Cấp thẳng (1 = không cần phiếu)','Phải chọn máy (1)'] },
  devices: { sheet:'ThietBi', cols:['id','name','cat','type','fuelRate','plate','note','project'] },
  repairs: { sheet:'SuaChua', cols:['id','deviceId','date','issue','fix','cost','by','note','project','addedBy','datetime'] },
  notes:   { sheet:'GhiChu',  cols:['id','content','ref','addedBy','datetime','project'] }
};
const TXN = { sheet:'GiaoDich',
  cols:['id','type','itemId','itemName','qty','unit','project','supplierOrReceiver','thietBi','datetime',
        'note','reason','refId','createdBy','createdByName','clientTime'],
  head:['ID','Loại','Item ID','Tên vật tư','Số lượng','Đơn vị','Dự án','NCC/Người nhận','Thiết bị','Giờ máy chủ',
        'Ghi chú','Lý do điều chỉnh','Phiếu gốc','Người lập (ID)','Người lập','Giờ trên máy'] };
const USERS = { sheet:'TaiKhoan',
  cols:['id','username','name','role','status','salt','hash','phone','createdAt','approvedBy','lastLogin','note','projects','tgChat'],
  head:['ID','Tên đăng nhập','Họ tên','Vai trò','Trạng thái','Salt','Mật khẩu (đã băm)','Điện thoại','Ngày đăng ký','Người duyệt','Đăng nhập gần nhất','Ghi chú','Dự án được giao','Telegram (chat id)'] };
const LOG = { sheet:'NhatKy', cols:['time','userId','userName','role','action','detail'],
  head:['Thời gian','ID người dùng','Người dùng','Vai trò','Thao tác','Chi tiết'] };
const DUAN = 'DuAn';
const LOAN = { sheet:'MuonTra',
  cols:['id','kind','itemType','itemId','itemName','unit','qty','party','phone','dueDate','note','project',
        'createdBy','createdByName','datetime','clientTime','returned','status','closeQty','closeReason','history'],
  head:['Số phiếu mượn','Loại (cho = cho mượn, di = đi mượn)','Hàng (vt = vật tư, tb = máy)','ID vật tư/máy','Tên','Đơn vị','Số lượng',
        'Người / đơn vị','Điện thoại','Hạn trả','Ghi chú','Dự án','Người lập (ID)','Người lập','Giờ máy chủ','Giờ trên máy',
        'Đã trả','Trạng thái (open / done / closed)','SL không trả','Lý do đóng phiếu','Lịch sử (máy chủ ghi)'] };
const PHOTO = { sheet:'AnhBienBan', cols:['id','txnId','fileId','name','addedBy','addedByName','time','project'],
  head:['ID ảnh','Số phiếu','ID file Drive','Tên file','Người chụp (ID)','Người chụp','Thời gian','Dự án'] };

// Quyền tối thiểu cho từng thao tác
const PERM = {
  me:'xem', getAll:'xem', getVersion:'xem', logout:'xem', changePassword:'xem',
  addTransaction:'tk', upsert:'tk', setMinStock:'ql', uploadPhoto:'tk', getPhoto:'xem',
  addLoan:'tk', returnLoan:'tk', closeLoan:'tk',
  editTxn:'admin', deleteTxn:'admin', editLoan:'admin', deleteLoan:'admin', getSummary:'xem',
  getCost:'xem', getPrices:'xem', setPrice:'ql', setProgress:'ql',
  remove:'ql', updateProjects:'ql', getLog:'ql',
  createReq:'xem', approveReq:'xem', rejectReq:'xem', cancelReq:'xem', receiveReq:'xem', issueReq:'tk', addCount:'tk',
  setRolePerm:'admin', setProjCfg:'admin', setItemFlags:'admin', tgUnlink:'xem', tgTest:'xem',
  listUsers:'ql', setUserProjects:'ql', approveUser:'admin', rejectUser:'admin', updateUser:'admin', deleteUser:'admin', revokeUserSessions:'admin'
};
const READS = { me:1, getAll:1, getVersion:1, getLog:1, listUsers:1, getPhoto:1, getSummary:1, getCost:1, getPrices:1 };
const NO_BUMP = { logout:1, changePassword:1 };

// ---------- CỔNG VÀO ----------
function doGet(e)  { return handleReq(e); }
function doPost(e) { return handleReq(e); }

function handleReq(e) {
  let result;
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) body = JSON.parse(e.postData.contents);
    else body = { action:'ping' };                       // mở URL bằng trình duyệt: không trả dữ liệu
    result = route(String(body.action || ''), body.data || {}, String(body.token || ''));
  } catch (err) {
    result = { success:false, error: String(err && err.message ? err.message : err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function route(action, data, token) {
  if (action === 'ping') return { success:true, app:'fecon-kho', sv:SERVER_VERSION };
  if (action === 'register') return withLock(() => register(data));
  if (action === 'login') return withLock(() => login(data));
  if (action === 'logError') return logError(data, token);

  const u = auth(token);
  if (!u) return { success:false, auth:true, error:'Phiên đăng nhập đã hết hạn hoặc tài khoản bị khóa — vui lòng đăng nhập lại' };
  const need = PERM[action];
  if (!need) return { success:false, error:'Thao tác không hợp lệ: ' + action };
  const featOk = action === 'setProgress' && NEW_ROLES[u.role] && can_(u, 'tienDo');           // CHT/CHP cập nhật tiến độ theo bảng quyền
  if (RANK[u.role] < RANK[need] && !featOk) return { success:false, forbidden:true, error:'Bạn không có quyền thực hiện thao tác này' };

  if (!PropertiesService.getScriptProperties().getProperty('projMig54')) withLock(migrateProjects);
  if (!PropertiesService.getScriptProperties().getProperty('flags513')) withLock(migrateFlags513_);
  if (READS[action]) {
    if (action === 'me') return Object.assign({ success:true }, extra(u));
    if (action === 'getAll') return getAll(u, data);
    if (action === 'getVersion') return Object.assign({ success:true, version:getVersion() }, extra(u));
    if (action === 'getLog') return getLog(u, data);
    if (action === 'listUsers') return listUsers(u);
    if (action === 'getPhoto') return getPhoto(u, data);
    if (action === 'getSummary') return getSummary(u, data);
    if (action === 'getCost') return getCost(u, data);
    if (action === 'getPrices') return getPrices(u, data);
  }
  return withLock(() => {
    let r;
    switch (action) {
      case 'logout':          r = logout(u); break;
      case 'changePassword':  r = changePassword(u, data); break;
      case 'addTransaction':  r = addTxn(u, data); break;
      case 'upsert':          r = upsert(u, data.table, data.rows || []); break;
      case 'setMinStock':     r = setMinStock(u, data); break;
      case 'remove':          r = removeRows(u, data.table, data.ids || []); break;
      case 'updateProjects':  r = updateProjects(u, data.projects || []); break;
      case 'approveUser':     r = approveUser(u, data); break;
      case 'rejectUser':      r = rejectUser(u, data); break;
      case 'updateUser':      r = updateUser(u, data); break;
      case 'deleteUser':      r = deleteUser(u, data); break;
      case 'revokeUserSessions': r = revokeUserSessions(u, data); break;
      case 'uploadPhoto':     r = uploadPhoto(u, data); break;
      case 'setUserProjects': r = setUserProjects(u, data); break;
      case 'addLoan':         r = addLoan(u, data); break;
      case 'returnLoan':      r = returnLoan(u, data); break;
      case 'closeLoan':       r = closeLoan(u, data); break;
      case 'editTxn':         r = editTxn(u, data); break;
      case 'deleteTxn':       r = deleteTxn(u, data); break;
      case 'editLoan':        r = editLoan(u, data); break;
      case 'deleteLoan':      r = deleteLoan(u, data); break;
      case 'setPrice':        r = setPrice(u, data); break;
      case 'setProgress':     r = setProgress(u, data); break;
      case 'createReq':       r = createReq(u, data); break;
      case 'approveReq':      r = approveReq(u, data); break;
      case 'rejectReq':       r = rejectReq(u, data); break;
      case 'cancelReq':       r = cancelReq(u, data); break;
      case 'issueReq':        r = issueReq(u, data); break;
      case 'receiveReq':      r = receiveReq(u, data); break;
      case 'addCount':        r = addCount(u, data); break;
      case 'setRolePerm':     r = setRolePerm(u, data); break;
      case 'setProjCfg':      r = setProjCfg(u, data); break;
      case 'setItemFlags':    r = setItemFlags(u, data); break;
      case 'tgUnlink':        r = tgUnlink(u); break;
      case 'tgTest':          r = tgTest(u); break;
      default: return { success:false, error:'Thao tác không hợp lệ: ' + action };
    }
    if (r.success && !NO_BUMP[action] && !r.duplicate) {
      const v = bumpVersion(); r.prevVersion = v.prev; r.version = v.ver;
    }
    return r;
  });
}

// ---------- TIỆN ÍCH ----------
function withLock(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function fail(msg) { throw new Error(msg); }
function nowTxt() { return Utilities.formatDate(new Date(), TZ, 'HH:mm:ss d/M/yyyy'); }
function getVersion() { return +PropertiesService.getScriptProperties().getProperty('ver') || 1; }
function bumpVersion() {
  const prev = getVersion(), ver = prev + 1;
  PropertiesService.getScriptProperties().setProperty('ver', String(ver));
  return { prev: prev, ver: ver };
}
// Đổi ký tự có thể dùng để chèn mã (HTML/JS) sang ký tự nhìn giống nhưng vô hại
function clean(v, max) {
  if (typeof v !== 'string') return v;
  const s = v.replace(/</g,'‹').replace(/>/g,'›').replace(/"/g,'”').replace(/'/g,'’').replace(/&/g,'＆').trim();
  return max ? s.slice(0, max) : s;
}
function cleanObj(o) { const r = {}; Object.keys(o || {}).forEach(k => r[k] = clean(o[k], 1000)); return r; }

function sheetOf(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  const cur = sh.getRange(1, 1, 1, header.length).getValues()[0];
  if (cur.some((v, i) => String(v) !== String(header[i]))) {
    sh.getRange(1, 1, 1, header.length).setValues([header])
      .setFontWeight('bold').setBackground('#0056A4').setFontColor('white');
    sh.setFrozenRows(1);
  }
  return sh;
}
function readRows(sh, nCols) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, nCols).getValues();
}
// Chuỗi được ghi dạng văn bản (tránh Sheets tự đổi "24/9/2026" thành ngày, và chặn công thức "=...")
function toCell(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v === '' ? '' : "'" + v;
  return v;
}
function fromCell(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'HH:mm:ss d/M/yyyy');
  return v;
}
function rowToObj(cols, r) { const o = {}; cols.forEach((c, i) => o[c] = fromCell(r[i])); return o; }
function writeAll(sh, cols, rows) {
  const n = sh.getLastRow() - 1;
  if (n > 0) sh.getRange(2, 1, n, Math.max(cols.length, sh.getLastColumn())).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, cols.length)
    .setValues(rows.map(o => cols.map(c => toCell(o[c] === undefined ? '' : o[c]))));
}
function writeLog(u, action, detail, at) {
  try {
    const sh = sheetOf(LOG.sheet, LOG.head);
    sh.appendRow([at || nowTxt(), u ? u.id : '', u ? u.name : '', u ? (ROLE_NAME[u.role] || u.role) : '', action, String(detail || '').slice(0, 500)].map(toCell));
  } catch (e) {}
}

// ---------- DỰ ÁN (mỗi dự án một kho riêng) ----------
function projList() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DUAN);
  return sh ? readRows(sh, 2).filter(r => r[1] !== '').map(r => String(r[1])) : [];
}
function userProjects(u) { return String(u.projects || '').split('|').map(x => x.trim()).filter(Boolean); }
// Dự án người dùng được xem: Admin/Quản lý = tất cả; Thủ kho/Chỉ xem = được giao
function allowedProjects(u) {
  const all = projList();
  if (RANK[u.role] >= RANK.ql || u.role === 'ld') return all;
  const mine = userProjects(u);
  return all.filter(p => mine.indexOf(p) >= 0);
}
function mustAllow(u, project) {
  if (allowedProjects(u).indexOf(String(project)) < 0) fail('Bạn không được giao dự án "' + project + '"');
}
// Lần đầu lên v5.4: dữ liệu cũ chưa có dự án → gán vào dự án đầu tiên
function migrateProjects() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('projMig54')) return;
  const def = projList()[0] || '';
  if (def) {
    const fill = (sheet, head, col) => {
      const ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(sheet);
      if (!sh) return;
      sheetOf(sheet, head);
      const n = sh.getLastRow() - 1; if (n < 1) return;
      const rg = sh.getRange(2, col, n, 1), v = rg.getValues();
      const ids = sh.getRange(2, 1, n, 1).getValues();
      let ch = false;
      v.forEach((r, i) => { if (ids[i][0] !== '' && r[0] === '') { r[0] = "'" + def; ch = true; } });
      if (ch) rg.setValues(v);
    };
    fill(TABLES.items.sheet, TABLES.items.head, 7);
    fill(TABLES.devices.sheet, TABLES.devices.cols, 8);
    fill(TABLES.notes.sheet, TABLES.notes.cols, 6);
    fill(TABLES.repairs.sheet, TABLES.repairs.cols, 9);
    fill(TXN.sheet, TXN.head, 7);
    fill(PHOTO.sheet, PHOTO.head, 8);
    // Thủ kho / Chỉ xem đang có: giao dự án đầu tiên để không bị mất quyền xem
    const users = loadUsers(); let chU = false;
    users.forEach(x => { if (RANK[x.role] < RANK.ql && !x.projects) { x.projects = def; chU = true; } });
    if (chU) saveUsers(users);
  }
  props.setProperty('projMig54', '1');
}
function setUserProjects(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  const all = projList();
  const list = (d.projects || []).map(String).filter(p => all.indexOf(p) >= 0);
  const old = userProjects(t);
  t.projects = list.join('|');
  saveUsers(users);
  writeLog(a, 'Phân công dự án', t.name + ' (@' + t.username + '): ' + (old.join(', ') || '(chưa có)') + ' → ' + (list.join(', ') || '(không dự án nào)'));
  return { success:true };
}

// ---------- TÀI KHOẢN ----------
function normUsername(s) {
  return String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '');
}
function sha(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
}
function hashPw(pw, salt) {
  let h = salt + '|' + pw;
  for (let i = 0; i < HASH_ROUNDS; i++)
    h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + '|' + salt, Utilities.Charset.UTF_8));
  return h;
}
function checkPw(pw) {
  pw = String(pw || '');
  if (pw.length < 6) fail('Mật khẩu tối thiểu 6 ký tự');
  if (pw.length > 64) fail('Mật khẩu tối đa 64 ký tự');
  return pw;
}
function loadUsers() {
  const cache = CacheService.getScriptCache();
  const raw = cache.get('users');
  if (raw) return JSON.parse(raw);
  const sh = sheetOf(USERS.sheet, USERS.head);
  const list = readRows(sh, USERS.cols.length).filter(r => r[0] !== '').map(r => {
    const o = rowToObj(USERS.cols, r);
    USERS.cols.forEach(c => o[c] = String(o[c] === undefined ? '' : o[c]));
    return o;
  });
  try { cache.put('users', JSON.stringify(list), 600); } catch (e) {}
  return list;
}
function saveUsers(list) {
  writeAll(sheetOf(USERS.sheet, USERS.head), USERS.cols, list);
  CacheService.getScriptCache().remove('users');
}
function pub(u) { return { id:u.id, username:u.username, name:u.name, role:u.role, projects:userProjects(u) }; }
function extra(u) {
  const pending = u.role === 'admin' ? loadUsers().filter(x => x.status === 'pending').length : 0;
  return { me:pub(u), pending:pending };
}
function activeAdmins(users) { return users.filter(x => x.role === 'admin' && x.status === 'active').length; }

// Phiên đăng nhập: lưu mã băm của token trong Script Properties
function newSession(u, device) {
  const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  // dọn phiên hết hạn
  const all = props.getProperties();
  Object.keys(all).forEach(k => {
    if (k.indexOf('S_') !== 0) return;
    try { if (JSON.parse(all[k]).e < now) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
  });
  props.setProperty('S_' + sha(token), JSON.stringify({ u:u.id, e: now + SESSION_DAYS * 864e5, d: String(device || '').slice(0, 80), c: now }));
  return { success:true, token:token, user:pub(u) };
}
function revokeSessions(uid, exceptKey) {
  const props = PropertiesService.getScriptProperties();
  const all = props.getProperties();
  Object.keys(all).forEach(k => {
    if (k.indexOf('S_') !== 0 || k === exceptKey) return;
    try { if (JSON.parse(all[k]).u === uid) props.deleteProperty(k); } catch (e) {}
  });
}
function auth(token) {
  if (!token || token.length < 20) return null;
  const key = 'S_' + sha(token);
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty(key);
  if (!raw) return null;
  let s; try { s = JSON.parse(raw); } catch (e) { return null; }
  const now = Date.now();
  if (s.e < now) { props.deleteProperty(key); return null; }
  const u = loadUsers().find(x => x.id === s.u);
  if (!u || u.status !== 'active') { props.deleteProperty(key); return null; }
  if (s.e - now < (SESSION_DAYS - 7) * 864e5) {            // tự gia hạn khi còn dùng
    s.e = now + SESSION_DAYS * 864e5; props.setProperty(key, JSON.stringify(s));
  }
  u._key = key;
  // Đánh dấu "đang dùng" (app mở thì 15 giây hỏi máy chủ 1 lần) — lưu trong bộ nhớ đệm, không ghi Sheet
  try { CacheService.getScriptCache().put('seen_' + u.id, JSON.stringify({ t: now, d: s.d || '' }), 21600); } catch (e) {}
  return u;
}

function register(d) {
  const username = normUsername(d.username);
  const name = clean(String(d.name || ''), 60);
  if (!name) fail('Nhập họ tên');
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) fail('Tên đăng nhập 3–30 ký tự: chữ không dấu, số, dấu chấm hoặc gạch dưới');
  const pw = checkPw(d.password);
  const users = loadUsers();
  if (users.some(x => x.username === username)) fail('Tên đăng nhập này đã có người dùng — chọn tên khác');
  const first = activeAdmins(users) === 0;
  if (first && username !== ADMIN_USERNAME)
    fail('Hệ thống chưa kích hoạt: Admin (tên đăng nhập "' + ADMIN_USERNAME + '") cần đăng ký trước.');
  if (!first && users.filter(x => x.status === 'pending').length >= MAX_PENDING)
    fail('Đang có quá nhiều yêu cầu chờ duyệt — báo Admin xử lý trước');
  const salt = Utilities.getUuid();
  const u = {
    id: 'U' + Date.now(), username: username, name: name,
    role: first ? 'admin' : 'xem', status: first ? 'active' : 'pending',
    salt: salt, hash: hashPw(pw, salt),
    phone: clean(String(d.phone || ''), 20), createdAt: nowTxt(),
    approvedBy: first ? '(Admin đầu tiên)' : '', lastLogin: first ? nowTxt() : '',
    note: clean(String(d.note || ''), 200)
  };
  users.push(u); saveUsers(users);
  writeLog(u, first ? 'Tạo tài khoản Admin' : 'Gửi yêu cầu tham gia', '@' + username + (u.note ? ' — ' + u.note : ''));
  bumpVersion();
  if (first) return newSession(u, clean(String(d.device || ''), 80));
  return { success:true, pending:true };
}

function login(d) {
  const username = normUsername(d.username);
  const cache = CacheService.getScriptCache();
  const fk = 'F_' + username;
  const fails = +cache.get(fk) || 0;
  if (fails >= 5) fail('Nhập sai quá 5 lần — thử lại sau 15 phút hoặc nhờ Admin đặt lại mật khẩu');
  const users = loadUsers();
  const u = users.find(x => x.username === username);
  if (!u || hashPw(String(d.password || ''), u.salt) !== u.hash) {
    cache.put(fk, String(fails + 1), 900);
    if (u && fails + 1 >= 5) writeLog(u, 'Tạm khóa đăng nhập', 'Sai mật khẩu 5 lần');
    const left = 5 - (fails + 1);
    fail(left > 0 ? 'Sai tên đăng nhập hoặc mật khẩu — còn ' + left + ' lần thử'
                  : 'Nhập sai quá 5 lần — thử lại sau 15 phút hoặc nhờ Admin đặt lại mật khẩu');
  }
  cache.remove(fk);
  if (u.status === 'pending') return { success:false, pending:true, error:'Tài khoản đang chờ Admin duyệt' };
  if (u.status !== 'active') fail('Tài khoản đã bị khóa — liên hệ Admin');
  u.lastLogin = nowTxt(); saveUsers(users);
  writeLog(u, 'Đăng nhập', clean(String(d.device || ''), 120));
  return newSession(u, clean(String(d.device || ''), 80));
}

function logout(u) {
  PropertiesService.getScriptProperties().deleteProperty(u._key);
  writeLog(u, 'Đăng xuất', '');
  return { success:true };
}

function changePassword(u, d) {
  const users = loadUsers();
  const t = users.find(x => x.id === u.id);
  if (hashPw(String(d.oldPassword || ''), t.salt) !== t.hash) fail('Mật khẩu hiện tại không đúng');
  const pw = checkPw(d.newPassword);
  t.salt = Utilities.getUuid(); t.hash = hashPw(pw, t.salt);
  saveUsers(users);
  revokeSessions(u.id, u._key);                            // các máy khác phải đăng nhập lại
  writeLog(u, 'Đổi mật khẩu', '');
  return { success:true };
}

function listUsers(viewer) {
  // Các máy đang đăng nhập của từng người + lần hoạt động gần nhất
  const sess = {}, now = Date.now();
  const all = PropertiesService.getScriptProperties().getProperties();
  Object.keys(all).forEach(k => {
    if (k.indexOf('S_') !== 0) return;
    try { const v = JSON.parse(all[k]); if (v.e > now) (sess[v.u] = sess[v.u] || []).push({ d: v.d || '', c: v.c || 0 }); } catch (e) {}
  });
  // Quản lý không thấy tài khoản Admin và Lãnh đạo
  const users = loadUsers().filter(x => viewer.role === 'admin' || (x.role !== 'admin' && x.role !== 'ld'));
  let seen = {};
  try { seen = CacheService.getScriptCache().getAll(users.map(x => 'seen_' + x.id)); } catch (e) {}
  return { success:true, now: now, users: users.map(x => ({
    lastSeen: seen['seen_' + x.id] ? JSON.parse(seen['seen_' + x.id]).t : 0,
    lastDevice: seen['seen_' + x.id] ? JSON.parse(seen['seen_' + x.id]).d : '',
    sessions: (sess[x.id] || []).sort((a, b) => b.c - a.c),
    id:x.id, username:x.username, name:x.name, role:x.role, status:x.status, phone:x.phone,
    createdAt:x.createdAt, approvedBy:x.approvedBy, lastLogin:x.lastLogin, note:x.note, projects:userProjects(x) })), allProjects: projList() };
}
function findTarget(users, id) {
  const t = users.find(x => x.id === String(id));
  if (!t) fail('Không tìm thấy tài khoản');
  return t;
}
function approveUser(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  if (t.status !== 'pending') fail('Tài khoản này không ở trạng thái chờ duyệt');
  if (!RANK[d.role]) fail('Vai trò không hợp lệ');
  t.role = d.role; t.status = 'active';
  if (d.name) t.name = clean(String(d.name), 60);
  if (d.projects) { const all = projList(); t.projects = d.projects.map(String).filter(p => all.indexOf(p) >= 0).join('|'); }
  t.approvedBy = a.name + ' · ' + nowTxt();
  saveUsers(users);
  writeLog(a, 'Duyệt thành viên', t.name + ' (@' + t.username + ') → ' + ROLE_NAME[t.role] + (t.projects ? ' · Dự án: ' + t.projects.split('|').join(', ') : ''));
  return { success:true };
}
function rejectUser(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  if (t.status !== 'pending') fail('Chỉ từ chối được yêu cầu đang chờ duyệt');
  saveUsers(users.filter(x => x.id !== t.id));
  writeLog(a, 'Từ chối yêu cầu', t.name + ' (@' + t.username + ')');
  return { success:true };
}
function updateUser(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  const self = t.id === a.id, changes = [];
  if (d.role && d.role !== t.role) {
    if (self) fail('Không thể tự đổi vai trò của chính mình');
    if (!RANK[d.role]) fail('Vai trò không hợp lệ');
    changes.push('vai trò ' + ROLE_NAME[t.role] + ' → ' + ROLE_NAME[d.role]); t.role = d.role;
  }
  if (d.status && d.status !== t.status) {
    if (self) fail('Không thể tự khóa tài khoản của chính mình');
    if (['active','locked'].indexOf(d.status) < 0) fail('Trạng thái không hợp lệ');
    changes.push(d.status === 'locked' ? 'KHÓA tài khoản' : 'MỞ KHÓA'); t.status = d.status;
  }
  if (d.name && clean(String(d.name), 60) !== t.name) {
    changes.push('tên "' + t.name + '" → "' + clean(String(d.name), 60) + '"'); t.name = clean(String(d.name), 60);
  }
  if (d.password) {
    const pw = checkPw(d.password);
    t.salt = Utilities.getUuid(); t.hash = hashPw(pw, t.salt);
    changes.push('đặt lại mật khẩu');
  }
  if (d.password || d.status === 'active') CacheService.getScriptCache().remove('F_' + t.username);   // gỡ khóa đăng nhập sai
  if (!changes.length) return { success:true, duplicate:true };
  if (activeAdmins(users) < 1) fail('Phải còn ít nhất 1 Admin đang hoạt động');
  saveUsers(users);
  if (t.status === 'locked' || d.password) revokeSessions(t.id, self ? a._key : null);
  writeLog(a, 'Sửa thành viên', t.name + ' (@' + t.username + '): ' + changes.join(', '));
  return { success:true };
}
function revokeUserSessions(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  revokeSessions(t.id, t.id === a.id ? a._key : null);      // tự đăng xuất máy khác thì giữ máy đang dùng
  CacheService.getScriptCache().remove('seen_' + t.id);
  writeLog(a, 'Đăng xuất từ xa', t.name + ' (@' + t.username + ')' + (t.id === a.id ? ' — các máy khác' : ' — mọi máy'));
  return { success:true, duplicate:true };
}
function deleteUser(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  if (t.id === a.id) fail('Không thể tự xóa tài khoản của chính mình');
  const rest = users.filter(x => x.id !== t.id);
  if (activeAdmins(rest) < 1) fail('Phải còn ít nhất 1 Admin đang hoạt động');
  saveUsers(rest);
  revokeSessions(t.id);
  writeLog(a, 'Xóa thành viên', t.name + ' (@' + t.username + ')');
  return { success:true };
}

// ---------- ĐỌC DỮ LIỆU ----------
// Phiếu chỉ được THÊM (không sửa/xóa) nên máy đã có N phiếu thì chỉ cần gửi phần mới.
// Kiểm tra ID phiếu cuối máy đang giữ; nếu Sheet bị sửa tay (không khớp) → gửi lại toàn bộ.
// Chỉ gửi dữ liệu của MỘT dự án (dự án đang làm việc) mà người dùng được phép xem.
// Phiếu chỉ được thêm (không sửa/xóa) nên máy đã có N dòng thì chỉ gửi phần mới; đổi dự án → gửi lại toàn bộ.
function getAll(u, d) {
  const t0 = Date.now();
  d = d || {};
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allowed = allowedProjects(u);
  const P = allowed.indexOf(String(d.project || '')) >= 0 ? String(d.project) : (allowed[0] || '');
  const res = Object.assign({ success:true, sv:SERVER_VERSION, version:getVersion(), projects:allowed, project:P,
    items:[], devices:[], repairs:[], notes:[], photos:[], loans:[],
    txnCols:TXN.cols, transactions:[], txnFrom:0, txnTotal:0, txnLastId:'' }, extra(u));
  if (!P) { res.ms = Date.now() - t0; return res; }        // chưa được giao dự án nào
  Object.keys(TABLES).forEach(k => {
    const t = TABLES[k], sh = ss.getSheetByName(t.sheet), pi = t.cols.indexOf('project');
    if (sh) res[k] = readRows(sh, t.cols.length).filter(r => r[0] !== '' && String(r[pi]) === P).map(r => rowToObj(t.cols, r));
  });
  const gd = ss.getSheetByName(TXN.sheet);
  if (gd) {
    const n = Math.max(0, gd.getLastRow() - 1), pi = TXN.cols.indexOf('project');
    const since = +d.since || 0;
    let from = 0;
    const rev = txnRev();
    res.txnRev = rev;
    if (d.scope === P && since > 0 && since <= n && d.lastId && String(gd.getRange(since + 1, 1).getValue()) === String(d.lastId)
        && String(d.txnRev || 0) === String(rev)) from = since;              // Admin sửa / xóa phiếu → gửi lại toàn bộ
    res.txnTotal = n; res.txnFrom = from;
    if (n > 0) res.txnLastId = String(gd.getRange(n + 1, 1).getValue());
    if (n > from) res.transactions = gd.getRange(from + 2, 1, n - from, TXN.cols.length).getValues()
      .filter(r => r[0] !== '' && String(r[pi]) === P).map(r => r.map(fromCell));
  }
  const mt = ss.getSheetByName(LOAN.sheet);
  if (mt) res.loans = readRows(mt, LOAN.cols.length).filter(r => r[0] !== '' && String(r[11]) === P).map(loanOut);
  const ph = ss.getSheetByName(PHOTO.sheet);
  if (ph) res.photos = readRows(ph, PHOTO.cols.length).filter(r => r[0] !== '' && String(r[7]) === P)
    .map(r => ({ id:r[0], txnId:r[1], fileId:String(r[2]), addedByName:String(r[5]), time:fromCell(r[6]) }));
  Object.assign(res, reqBundle_(u, P));
  res.ms = Date.now() - t0;
  return res;
}
function getLog(u, d) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG.sheet);
  if (!sh) return { success:true, rows:[] };
  const n = sh.getLastRow() - 1;
  if (n < 1) return { success:true, rows:[] };
  const lim = Math.min(Math.max(+d.limit || 300, 1), 1000);
  const hide = u && u.role !== 'admin' ? leaderMarks() : null;     // người không phải Admin: ẩn mọi dấu vết của Lãnh đạo
  let take = Math.min(n, hide ? lim * 2 : lim), rows;
  for (;;) {                                                            // đọc thêm cho đủ số dòng sau khi lọc
    rows = sh.getRange(n - take + 2, 1, take, LOG.cols.length).getValues().reverse().map(r => rowToObj(LOG.cols, r));
    if (hide) rows = rows.filter(r => !isLeaderRow(r, hide));
    if (!hide || rows.length >= lim || take >= n) break;
    take = Math.min(n, take * 3);
  }
  return { success:true, rows:rows.slice(0, lim) };
}
function leaderMarks() {
  const ld = loadUsers().filter(x => x.role === 'ld');
  return { ids: ld.map(x => String(x.id)), tags: ld.map(x => '@' + x.username) };
}
function isLeaderRow(r, m) {
  if (String(r.role) === ROLE_NAME.ld || m.ids.indexOf(String(r.userId)) >= 0) return true;
  const det = String(r.detail || '');
  return det.indexOf(ROLE_NAME.ld) >= 0 || m.tags.some(t => det.indexOf(t + ')') >= 0 || det === t || det.indexOf(t + ' ') === 0);
}

// ---------- GHI DỮ LIỆU ----------
const TXN_LABEL = { nhap:'Phiếu nhập', xuat:'Phiếu xuất', dieuchinh:'Phiếu điều chỉnh' };   // kiemke: chỉ tạo qua addCount
function addTxn(u, t0) {
  const t = cleanObj(t0);
  if (!TXN_LABEL[t.type]) fail('Loại phiếu không hợp lệ');
  const qty = Math.round((+t.qty || 0) * 1000) / 1000;
  if (t.type !== 'dieuchinh' && !(qty > 0)) fail('Số lượng phải lớn hơn 0');
  if (t.type === 'dieuchinh') {
    if (!qty) fail('Số lượng điều chỉnh phải khác 0');
    if (String(t.reason || '').length < 5) fail('Phiếu điều chỉnh phải ghi rõ lý do');
  }
  if (!t.id) fail('Thiếu số phiếu');
  const gd = sheetOf(TXN.sheet, TXN.head);
  const ids = readRows(gd, 1).map(r => String(r[0]));
  if (ids.indexOf(String(t.id)) >= 0) return { success:true, duplicate:true };   // đã ghi rồi (mạng chập chờn gửi lại)

  const T = TABLES.items, tk = sheetOf(T.sheet, T.head);
  const rows = readRows(tk, T.cols.length);
  const i = rows.findIndex(r => String(r[0]) === String(t.itemId));
  if (i < 0) fail('Vật tư không tồn tại trong kho');
  const itemName = String(rows[i][1]), unit = String(rows[i][3]), itemProj = String(rows[i][6]);
  mustAllow(u, itemProj);                                       // chỉ ghi vào kho dự án được giao

  const at = u.role === 'admin' && t.txTime ? checkTime(t.txTime) : '';   // Admin chọn ngày giờ phiếu
  const row = {
    id: t.id, type: t.type, itemId: t.itemId, itemName: itemName, qty: qty, unit: unit,
    project: itemProj, supplierOrReceiver: t.type === 'dieuchinh' ? '' : (t.supplierOrReceiver || ''),
    thietBi: t.thietBi || '', datetime: at || nowTxt(), note: t.note || '',
    reason: t.type === 'dieuchinh' ? t.reason : '', refId: t.type === 'dieuchinh' ? (t.refId || '') : '',
    createdBy: u.id, createdByName: u.name, clientTime: at ? '' : String(t.datetime || '').slice(0, 40)
  };
  gd.appendRow(TXN.cols.map(c => toCell(row[c])));

  const cur = +rows[i][4] || 0;
  const delta = t.type === 'nhap' ? qty : t.type === 'xuat' ? -qty : qty;
  const beforeMoc = !!at && !afterMoc_(t.itemId, row.datetime);     // Admin ghi bù với giờ trước mốc kiểm kê → không đổi tồn
  if (!beforeMoc) tk.getRange(i + 2, 5).setValue(Math.round((cur + delta) * 100) / 100);

  writeLog(u, TXN_LABEL[t.type], txnLogDetail(row) + (beforeMoc ? ' · ghi trước mốc kiểm kê, không đổi tồn' : ''), at);
  return { success:true, id:row.id, datetime:row.datetime, beforeMoc:beforeMoc };
}

const TABLE_LABEL = { items:'vật tư', devices:'thiết bị', repairs:'sửa chữa', notes:'ghi chú' };
function upsert(u, table, rows) {
  const T = TABLES[table];
  if (!T) fail('Bảng không hợp lệ: ' + table);
  const sh = sheetOf(T.sheet, T.head || T.cols);
  const values = readRows(sh, T.cols.length);
  const idx = {}; values.forEach((r, i) => idx[String(r[0])] = i);
  const isQL = RANK[u.role] >= RANK.ql;
  let added = [], edited = [];
  rows.forEach(raw => {
    const o = cleanObj(raw);
    if (o.id === undefined || o.id === '') fail('Thiếu ID');
    const i = idx[String(o.id)], exists = i !== undefined;
    if (exists && !isQL && table !== 'devices') fail('Chỉ Quản lý/Admin mới được sửa ' + TABLE_LABEL[table] + ' đã có');
    const pi = T.cols.indexOf('project');
    if (exists) o.project = String(values[i][pi]);            // không cho chuyển bản ghi sang dự án khác
    if (!o.project) fail('Thiếu dự án');
    mustAllow(u, o.project);
    if (table === 'items') {
      if (!String(o.name || '')) fail('Thiếu tên vật tư');
      o.stock = exists ? values[i][4] : 0;                 // tồn kho chỉ thay đổi qua phiếu
      o.minStock = isQL ? Math.max(0, +o.minStock || 0) : (exists ? +values[i][5] || 0 : 0);   // định mức: chỉ Quản lý/Admin
      const fl = defaultFlags_(String(o.cat || ''), String(o.name || ''));                     // cách cấp: chỉ Admin đổi (setItemFlags)
      o.capThang = exists ? values[i][7] : fl.capThang; o.canMay = exists ? values[i][8] : fl.canMay;
    }
    if (table === 'devices') o.fuelRate = +o.fuelRate || 0;
    if (table === 'repairs' || table === 'notes') {
      const ai = T.cols.indexOf('addedBy'), di = T.cols.indexOf('datetime');
      if (exists) { o.addedBy = values[i][ai]; o.datetime = values[i][di]; }
      else { o.addedBy = u.name; o.datetime = nowTxt(); }
      if (table === 'repairs') o.cost = +o.cost || 0;
    }
    const newRow = T.cols.map(c => o[c] === undefined ? '' : o[c]);
    const label = String(o.name || o.issue || o.content || o.id).slice(0, 60);
    if (exists) { values[i] = newRow; edited.push(label); }
    else { idx[String(o.id)] = values.length; values.push(newRow); added.push(label); }
  });
  if (values.length) sh.getRange(2, 1, values.length, T.cols.length).setValues(values.map(r => r.map(toCell)));
  if (added.length) writeLog(u, 'Thêm ' + TABLE_LABEL[table], added.join(', '));
  if (edited.length) writeLog(u, 'Sửa ' + TABLE_LABEL[table], edited.join(', '));
  return { success:true };
}

function setMinStock(u, d) {
  const T = TABLES.items, sh = sheetOf(T.sheet, T.head);
  const rows = readRows(sh, T.cols.length);
  const i = rows.findIndex(r => String(r[0]) === String(d.id));
  if (i < 0) fail('Vật tư không tồn tại');
  mustAllow(u, String(rows[i][6]));
  const v = Math.max(0, +d.minStock || 0);
  if (+rows[i][5] === v) return { success:true, duplicate:true };
  sh.getRange(i + 2, 6).setValue(v);
  writeLog(u, 'Đổi mức cảnh báo', rows[i][1] + ': ' + rows[i][5] + ' → ' + v);
  return { success:true };
}

function removeRows(u, table, ids) {
  const T = TABLES[table];
  if (!T) fail('Bảng không hợp lệ: ' + table);
  const sh = sheetOf(T.sheet, T.head || T.cols);
  const set = {}; ids.forEach(id => set[String(id)] = true);
  const values = readRows(sh, T.cols.length);
  const gone = values.filter(r => set[String(r[0])]);
  const rpi = T.cols.indexOf('project');
  gone.forEach(r => mustAllow(u, String(r[rpi])));
  if (table === 'items' && gone.length) {
    const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
    const used = {}; if (gd) readRows(gd, 3).forEach(r => used[String(r[2])] = true);
    gone.forEach(r => { if (used[String(r[0])]) fail('Vật tư "' + r[1] + '" đã có phiếu — không thể xóa (chỉ được điều chỉnh)'); });
  }
  if (table === 'devices' && gone.length) {
    const open = openLoans().filter(l => l.itemType === 'tb' && l.kind === 'cho');
    gone.forEach(r => { if (open.some(l => String(l.itemId) === String(r[0]))) fail('Máy "' + r[1] + '" đang cho mượn — nhận trả hoặc đóng phiếu mượn trước khi xóa'); });
  }
  const keep = values.filter(r => !set[String(r[0])]);
  if (values.length) sh.getRange(2, 1, values.length, T.cols.length).clearContent();
  if (keep.length) sh.getRange(2, 1, keep.length, T.cols.length).setValues(keep.map(r => r.map(toCell)));
  if (gone.length) writeLog(u, 'Xóa ' + TABLE_LABEL[table], gone.map(r => r[1] || r[0]).join(', '));
  return { success:true };
}

function updateProjects(u, projects) {
  const list = projects.map(p => clean(String(p), 100)).filter(Boolean);
  if (!list.length) fail('Danh sách dự án trống');
  const sh = sheetOf(DUAN, ['id','name']);
  const old = readRows(sh, 2).map(r => String(r[1])).filter(Boolean);
  const lost = old.filter(p => list.indexOf(p) < 0);
  if (lost.length) fail('Không được xóa hoặc đổi tên dự án đã có dữ liệu: ' + lost.join(', '));
  const n = sh.getLastRow() - 1;
  if (n > 0) sh.getRange(2, 1, n, 2).clearContent();
  sh.getRange(2, 1, list.length, 2).setValues(list.map((p, i) => [i + 1, toCell(p)]));
  const addedP = list.filter(p => old.indexOf(p) < 0);
  writeLog(u, 'Cập nhật dự án', addedP.length ? 'Thêm: ' + addedP.join(', ') : list.join(', '));
  return { success:true };
}

// ---------- CHO MƯỢN / TRẢ (v5.6) ----------
// Phiếu mượn lưu ở tab MuonTra (1 dòng / phiếu, trạng thái cập nhật khi trả).
// Vật tư: mọi thay đổi tồn đi qua tab GiaoDich (chomuon −, nhantra +, dimuon +, tralai −; cột Phiếu gốc = số phiếu mượn).
// Máy móc: không có số tồn, chỉ ghi máy đang ở đâu, ai giữ.
const LOAN_TXN_LABEL = { chomuon:'Cho mượn', nhantra:'Nhận trả', dimuon:'Đi mượn', tralai:'Trả lại' };
const r3 = v => Math.round((+v || 0) * 1000) / 1000;
function loanOut(r) {
  const o = rowToObj(LOAN.cols, r);
  o.id = String(o.id); o.itemId = String(o.itemId);
  o.qty = +o.qty || 0; o.returned = +o.returned || 0; o.closeQty = +o.closeQty || 0;
  try { o.history = JSON.parse(String(o.history || '[]')); } catch (e) { o.history = []; }
  return o;
}
function findLoanRow(id) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOAN.sheet);
  if (!sh || !id) return null;
  const rows = readRows(sh, LOAN.cols.length);
  const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(id));
  return i < 0 ? null : { sh:sh, i:i, loan:loanOut(rows[i]) };
}
function openLoans() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOAN.sheet);
  return sh ? readRows(sh, LOAN.cols.length).filter(r => r[0] !== '' && String(r[17]) === 'open').map(loanOut) : [];
}
function saveLoan(sh, i, loan) {
  sh.getRange(i + 2, 1, 1, LOAN.cols.length)
    .setValues([LOAN.cols.map(c => toCell(c === 'history' ? JSON.stringify(loan.history) : (loan[c] === undefined ? '' : loan[c])))]);
}
// Mở vật tư để ghi phiếu: trả về dòng vật tư + hàm ghi phiếu vào GiaoDich
function itemCtx(itemId) {
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), rows = readRows(tk, T.cols.length);
  const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(itemId));
  if (i < 0) fail('Vật tư không tồn tại trong kho');
  return { tk:tk, gd:sheetOf(TXN.sheet, TXN.head), i:i, id:rows[i][0], name:String(rows[i][1]), unit:String(rows[i][3]),
           project:String(rows[i][6]), stock:+rows[i][4] || 0 };
}
function writeLoanTxns(u, ctx, list) {            // list: [{id, type, qty(dương), party, note, reason, refId, clientTime}]
  const SIGN = { chomuon:-1, nhantra:1, dimuon:1, tralai:-1, nhap:1, xuat:-1 };
  let stock = ctx.stock;
  list.forEach(o => {
    if (!o.id) fail('Thiếu số phiếu kho');
    const row = { id:o.id, type:o.type, itemId:ctx.id, itemName:ctx.name, qty:o.qty, unit:ctx.unit, project:ctx.project,
      supplierOrReceiver:o.party || '', thietBi:'', datetime:nowTxt(), note:o.note || '', reason:o.reason || '',
      refId:o.refId || '', createdBy:u.id, createdByName:u.name, clientTime:String(o.clientTime || '').slice(0, 40) };
    ctx.gd.appendRow(TXN.cols.map(c => toCell(row[c])));
    stock = Math.round((stock + SIGN[o.type] * o.qty) * 100) / 100;
  });
  ctx.tk.getRange(ctx.i + 2, 5).setValue(stock);
  ctx.stock = stock;
}
function checkTxnIdsFree(ids) {
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  if (!gd) return;
  const have = {}; readRows(gd, 1).forEach(r => have[String(r[0])] = true);
  ids.forEach(id => { if (have[String(id)]) fail('Số phiếu kho bị trùng — thử lại'); });
}

function addLoan(u, d0) {
  const d = cleanObj(d0);
  if (d.kind !== 'cho' && d.kind !== 'di') fail('Loại phiếu mượn không hợp lệ');
  if (d.itemType !== 'vt' && d.itemType !== 'tb') fail('Chọn vật tư hoặc máy móc');
  if (!d.id) fail('Thiếu số phiếu mượn');
  const sh = sheetOf(LOAN.sheet, LOAN.head);
  if (readRows(sh, 1).some(r => String(r[0]) === String(d.id))) return { success:true, duplicate:true };   // đã ghi (gửi lại do mạng)
  const party = String(d.party || '').slice(0, 120);
  if (party.length < 2) fail(d.kind === 'cho' ? 'Ghi rõ người / đơn vị mượn' : 'Ghi rõ mượn của ai');
  const due = String(d.dueDate || '');
  if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) fail('Hạn trả không hợp lệ');
  const cho = d.kind === 'cho';
  const loan = { id:String(d.id), kind:d.kind, itemType:d.itemType, party:party, phone:String(d.phone || '').slice(0, 30),
    dueDate:due, note:String(d.note || '').slice(0, 500), createdBy:u.id, createdByName:u.name, datetime:nowTxt(),
    clientTime:String(d.datetime || '').slice(0, 40), returned:0, status:'open', closeQty:0, closeReason:'', history:[] };
  let ctx = null;
  if (d.itemType === 'vt') {
    const qty = r3(d.qty);
    if (!(qty > 0)) fail('Số lượng phải lớn hơn 0');
    if (!d.txnId) fail('Thiếu số phiếu kho');
    ctx = itemCtx(d.itemId);
    mustAllow(u, ctx.project);
    if (cho && qty > ctx.stock + 1e-9) fail('Tồn không đủ để cho mượn — còn ' + ctx.stock + ' ' + ctx.unit + ' ' + ctx.name);
    checkTxnIdsFree([d.txnId]);
    Object.assign(loan, { itemId:ctx.id, itemName:ctx.name, unit:ctx.unit, qty:qty, project:ctx.project });
  } else if (cho) {
    const T = TABLES.devices, rows = readRows(sheetOf(T.sheet, T.cols), T.cols.length);
    const dv = rows.find(r => r[0] !== '' && String(r[0]) === String(d.itemId));
    if (!dv) fail('Máy không tồn tại trong danh sách thiết bị');
    mustAllow(u, String(dv[7]));
    const busy = openLoans().find(l => l.itemType === 'tb' && l.kind === 'cho' && String(l.itemId) === String(dv[0]));
    if (busy) fail('Máy \"' + dv[1] + '\" đang cho ' + busy.party + ' mượn — nhận trả trước');
    Object.assign(loan, { itemId:dv[0], itemName:String(dv[1]), unit:'máy', qty:1, project:String(dv[7]) });
  } else {
    const name = String(d.itemName || '').slice(0, 120);
    if (name.length < 2) fail('Nhập tên máy đi mượn');
    mustAllow(u, String(d.project || ''));
    Object.assign(loan, { itemId:'', itemName:name, unit:'máy', qty:1, project:String(d.project) });
  }
  if (ctx) writeLoanTxns(u, ctx, [{ id:d.txnId, type:cho ? 'chomuon' : 'dimuon', qty:loan.qty, party:party,
    note:loan.note, refId:loan.id, clientTime:d.datetime }]);
  sh.appendRow(LOAN.cols.map(c => toCell(c === 'history' ? '[]' : loan[c])));
  writeLog(u, cho ? 'Cho mượn' : 'Đi mượn', loan.qty + ' ' + loan.unit + ' ' + loan.itemName + (cho ? ' → ' : ' ← ') + party +
    (due ? ' · hạn ' + due : '') + ' · phiếu #' + loan.id);
  return { success:true, id:loan.id, datetime:loan.datetime };
}

function loanForUpdate(u, d) {
  if (!d.id) fail('Thiếu số phiếu');
  const lr = findLoanRow(d.loanId);
  if (!lr) fail('Không tìm thấy phiếu mượn');
  mustAllow(u, lr.loan.project);
  if (lr.loan.history.some(h => String(h.id) === String(d.id))) return null;        // đã ghi (gửi lại do mạng)
  if (lr.loan.status !== 'open') fail('Phiếu mượn này đã xong / đã đóng');
  return lr;
}
function returnLoan(u, d0) {
  const d = cleanObj(d0), lr = loanForUpdate(u, d);
  if (!lr) return { success:true, duplicate:true };
  const loan = lr.loan, cho = loan.kind === 'cho';
  const remain = r3(loan.qty - loan.returned);
  const qty = loan.itemType === 'tb' ? remain : r3(d.qty);
  if (!(qty > 0)) fail('Số lượng trả phải lớn hơn 0');
  if (qty > remain + 1e-9) fail('Chỉ còn ' + remain + ' ' + loan.unit + ' chưa trả');
  if (loan.itemType === 'vt') {
    const ctx = itemCtx(loan.itemId);
    if (!cho && qty > ctx.stock + 1e-9) fail('Tồn trong kho không đủ để trả lại — còn ' + ctx.stock + ' ' + ctx.unit);
    checkTxnIdsFree([d.id]);
    writeLoanTxns(u, ctx, [{ id:d.id, type:cho ? 'nhantra' : 'tralai', qty:qty, party:loan.party, note:d.note, refId:loan.id, clientTime:d.datetime }]);
  }
  loan.returned = r3(loan.returned + qty);
  if (loan.returned >= loan.qty - 1e-9) loan.status = 'done';
  loan.history.push({ id:String(d.id), t:'tra', q:qty, note:String(d.note || '').slice(0, 300), by:u.name, at:nowTxt() });
  saveLoan(lr.sh, lr.i, loan);
  writeLog(u, cho ? 'Nhận trả' : 'Trả lại', qty + ' ' + loan.unit + ' ' + loan.itemName + (cho ? ' ← ' : ' → ') + loan.party +
    ' · phiếu mượn #' + loan.id + (loan.status === 'done' ? ' (đã trả đủ)' : ' (còn ' + r3(loan.qty - loan.returned) + ')'));
  return { success:true, status:loan.status };
}
function closeLoan(u, d0) {
  const d = cleanObj(d0), lr = loanForUpdate(u, d);
  if (!lr) return { success:true, duplicate:true };
  const loan = lr.loan, cho = loan.kind === 'cho';
  const reason = String(d.reason || '').slice(0, 300);
  if (reason.length < 5) fail('Ghi rõ lý do đóng phiếu (mất, hỏng, đã dùng hết...)');
  const remain = r3(loan.qty - loan.returned);
  if (loan.itemType === 'vt' && remain > 0) {
    if (!d.id2) fail('Thiếu số phiếu kho');
    const ctx = itemCtx(loan.itemId);
    checkTxnIdsFree([d.id, d.id2]);
    // Phần không trả: cho mượn → quy đổi thành phiếu xuất; đi mượn → quy đổi thành phiếu nhập. Tồn không đổi.
    writeLoanTxns(u, ctx, cho
      ? [{ id:d.id, type:'nhantra', qty:remain, party:loan.party, note:'Quy đổi khi đóng phiếu mượn', reason:reason, refId:loan.id, clientTime:d.datetime },
         { id:d.id2, type:'xuat', qty:remain, party:loan.party, note:'Cho mượn không trả lại: ' + reason, refId:loan.id, clientTime:d.datetime }]
      : [{ id:d.id, type:'tralai', qty:remain, party:loan.party, note:'Quy đổi khi đóng phiếu mượn', reason:reason, refId:loan.id, clientTime:d.datetime },
         { id:d.id2, type:'nhap', qty:remain, party:loan.party, note:'Đi mượn không trả lại: ' + reason, refId:loan.id, clientTime:d.datetime }]);
  }
  loan.status = 'closed'; loan.closeQty = remain; loan.closeReason = reason;
  loan.history.push({ id:String(d.id), t:'dong', q:remain, note:reason, by:u.name, at:nowTxt() });
  saveLoan(lr.sh, lr.i, loan);
  writeLog(u, 'Đóng phiếu mượn', loan.itemName + ' · ' + loan.party + ' · không trả ' + remain + ' ' + loan.unit + ' · Lý do: ' + reason + ' · phiếu #' + loan.id);
  return { success:true, status:'closed' };
}

// ---------- GHI LỖI PHÁT SINH (v5.8) ----------
const ERRLOG = { sheet:'LoiApp', head:['Thời gian','Người dùng','Phiên bản app','Lỗi','Tệp:dòng','Chi tiết','Màn hình','Dự án','Thiết bị','Mạng'] };
function logError(d, token) {
  const cache = CacheService.getScriptCache(), k = 'ERRN_' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH');
  const n = +cache.get(k) || 0;
  if (n >= 300) return { success:true, skipped:true };                   // chặn gửi ồ ạt: tối đa 300 lỗi / giờ
  cache.put(k, String(n + 1), 3700);
  let who = '(chưa đăng nhập)';
  try { const u = token ? auth(token) : null; if (u) who = u.name + ' (' + (ROLE_NAME[u.role] || u.role) + ')'; } catch (e) {}
  const c = v => clean(String(v === undefined || v === null ? '' : v), 800);
  const sh = sheetOf(ERRLOG.sheet, ERRLOG.head);
  sh.appendRow([nowTxt(), who, c(d.ver).slice(0, 20), c(d.msg).slice(0, 300), c(d.src).split('/').pop().slice(0, 80) + ':' + (+d.line || 0) + ':' + (+d.col || 0),
    c(d.stack), c(d.tab).slice(0, 30), c(d.proj).slice(0, 60), c(d.ua).slice(0, 200), d.online === false ? 'Mất mạng' : 'Có mạng'].map(toCell));
  if (sh.getLastRow() > 3000) sh.deleteRows(2, 500);                    // giữ khoảng 2.500 lỗi gần nhất
  return { success:true };
}

// ---------- TỔNG HỢP DỰ ÁN (v5.9 · Admin, Lãnh đạo) ----------
function getSummary(u, d) {
  if (u.role !== 'admin' && u.role !== 'ld') return { success:false, forbidden:true, error:'Chỉ Admin và Lãnh đạo xem được tổng hợp dự án' };
  const day = v => { const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 1000 : NaN; };
  const from = day(d.from), to = day(d.to) + 86400;                 // [from, to)
  if (isNaN(from) || isNaN(to) || to <= from) fail('Khoảng thời gian không hợp lệ');
  const len = to - from, pFrom = from - len;                          // kỳ trước cùng độ dài để so sánh
  const nowL = Date.now() / 1000 + 7 * 3600;                          // giờ Việt Nam, cùng cách tính với vnSec
  const today = Math.floor(nowL / 86400) * 86400;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const projects = projList();
  const P = {}; projects.forEach(p => P[p] = { name:p, nhap:0, xuat:0, dieu:0, dauPrev:0, items:0, low:0, out:0, devices:0, drills:0,
    overdue:0, openLoans:0, last:0, drillFuel:0, drillSet:{}, cat:{}, week:[0,0,0,0,0,0,0,0] });
  const T = TABLES.items, itemRows = ss.getSheetByName(T.sheet) ? readRows(ss.getSheetByName(T.sheet), T.cols.length) : [];
  const item = {};
  itemRows.forEach(r => {
    if (r[0] === '') return;
    const it = { id:String(r[0]), name:String(r[1]), cat:String(r[2]), unit:String(r[3]), stock:+r[4] || 0, min:+r[5] || 0, proj:String(r[6]) };
    it.dau = /\bd[aầ]u\s*d\.?o\b|diesel/i.test(it.name);              // dầu DO
    item[it.id] = it;
    const p = P[it.proj]; if (!p) return;
    p.items++; if (it.min > 0 && it.stock <= it.min) p.low++; if (it.stock <= 0) p.out++;
  });
  const DV = TABLES.devices, dvSh = ss.getSheetByName(DV.sheet);
  const drillByProj = {};
  (dvSh ? readRows(dvSh, DV.cols.length) : []).forEach(r => {
    if (r[0] === '') return; const p = P[String(r[7])]; if (!p) return;
    p.devices++;
    if (String(r[2]) === 'mayKhoan') { p.drills++; (drillByProj[p.name] = drillByProj[p.name] || {})[String(r[1])] = 1; }
  });
  // tuần: 8 tuần gần nhất, tuần kết thúc hôm nay
  const wEnd = today + 86400, wStart = wEnd - 8 * 7 * 86400;
  const gd = ss.getSheetByName(TXN.sheet), rows = gd ? readRows(gd, TXN.cols.length) : [];
  const adj = {};                                                      // phiếu điều chỉnh gắn phiếu gốc → cộng vào số lượng gốc
  rows.forEach(r => { if (String(r[1]) === 'dieuchinh' && r[12] !== '') adj[String(r[12])] = (adj[String(r[12])] || 0) + (+r[4] || 0); });
  rows.forEach(r => {
    if (r[0] === '') return;
    const p = P[String(r[6])]; if (!p) return;
    const type = String(r[1]), t = vnSec(r[9]); if (isNaN(t)) return;
    if (t > p.last) p.last = t;
    if (type !== 'nhap' && type !== 'xuat') return;
    const it = item[String(r[2])] || {}, q = (+r[4] || 0) + (adj[String(r[0])] || 0);
    const inR = t >= from && t < to;
    if (type === 'nhap') { if (inR) p.nhap++; return; }
    if (inR) { p.xuat++; p.cat[it.cat || 'khac'] = (p.cat[it.cat || 'khac'] || 0) + 1; }
    if (!it.dau) return;
    if (inR) {
      p.dieu += q;
      const dv = String(r[8] || '');
      if (dv && drillByProj[p.name] && drillByProj[p.name][dv]) { p.drillFuel += q; p.drillSet[dv] = 1; }
    } else if (t >= pFrom && t < from) p.dauPrev += q;
    if (t >= wStart && t < wEnd) p.week[Math.min(7, Math.floor((t - wStart) / (7 * 86400)))] += q;
  });
  const LS = ss.getSheetByName(LOAN.sheet);
  (LS ? readRows(LS, LOAN.cols.length) : []).forEach(r => {
    if (r[0] === '' || String(r[17]) !== 'open') return; const p = P[String(r[11])]; if (!p) return;
    p.openLoans++;
    const due = day(String(r[9])); if (!isNaN(due) && due < today) p.overdue++;
  });
  const days = Math.max(1, Math.round((Math.min(to, today + 86400) - from) / 86400));
  const out = projects.map(n => {
    const p = P[n], nd = Object.keys(p.drillSet).length;
    return { name:n, nhap:p.nhap, xuat:p.xuat, dau:Math.round(p.dieu * 10) / 10, dauPrev:Math.round(p.dauPrev * 10) / 10,
      items:p.items, low:p.low, out:p.out, devices:p.devices, drills:p.drills, openLoans:p.openLoans, overdue:p.overdue,
      lastAt:p.last ? Math.round(p.last) : 0, idleDays:p.last ? Math.max(0, Math.floor((nowL - p.last) / 86400)) : null,
      dauMayNgay:nd ? Math.round(p.drillFuel / nd / days * 10) / 10 : null, cat:p.cat, week:p.week.map(v => Math.round(v)) };
  });
  const weeks = []; for (let i = 0; i < 8; i++) weeks.push(Utilities.formatDate(new Date((wStart + i * 7 * 86400) * 1000), 'UTC', 'd/M'));
  return { success:true, from:d.from, to:d.to, days:days, projects:out, weeks:weeks, now:Math.round(nowL) };
}

// ---------- ADMIN: SỬA / XÓA PHIẾU (v5.7, không ghi nhật ký) ----------
const TXN_SIGN = { nhap:1, xuat:-1, dieuchinh:1, chomuon:-1, nhantra:1, dimuon:1, tralai:-1 };
function txnRev() { return +PropertiesService.getScriptProperties().getProperty('txnRev') || 0; }
function bumpTxnRev() { PropertiesService.getScriptProperties().setProperty('txnRev', String(txnRev() + 1)); }
// Ngày giờ Admin chọn: 'HH:mm[:ss] d/M/yyyy'
function checkTime(v) {
  const m = String(v || '').trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))? (\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m || +m[1] > 23 || +m[2] > 59 || +m[4] < 1 || +m[4] > 31 || +m[5] < 1 || +m[5] > 12) fail('Ngày giờ phiếu không hợp lệ');
  const p = n => ('0' + n).slice(-2);
  return p(+m[1]) + ':' + m[2] + ':' + (m[3] || '00') + ' ' + (+m[4]) + '/' + (+m[5]) + '/' + m[6];
}
// Cộng/trừ tồn nhiều vật tư một lần: changes = { itemId: delta }
function applyStock(changes) {
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), rows = readRows(tk, T.cols.length);
  Object.keys(changes).forEach(id => {
    const d = changes[id]; if (!d) return;
    const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(id));
    if (i < 0) return;
    tk.getRange(i + 2, 5).setValue(Math.round(((+rows[i][4] || 0) + d) * 100) / 100);
  });
}
function txnEffect(r) {                      // r: dòng GiaoDich (mảng) → tác động lên tồn
  return (TXN_SIGN[String(r[1])] || 0) * (+r[4] || 0);
}
function deleteSheetRows(sh, idxs) {         // idxs: chỉ số trong readRows (0 = dòng 2)
  idxs.slice().sort((a, b) => b - a).forEach(i => sh.deleteRow(i + 2));
}
function deletePhotosOf(ids) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PHOTO.sheet);
  if (!sh) return;
  const set = {}; ids.forEach(id => set[String(id)] = true);
  const rows = readRows(sh, PHOTO.cols.length), del = [];
  rows.forEach((r, i) => {
    if (r[0] === '' || !set[String(r[1])]) return;
    try { DriveApp.getFileById(String(r[2])).setTrashed(true); } catch (e) {}
    del.push(i);
  });
  deleteSheetRows(sh, del);
}

// ---------- NHẬT KÝ CỦA PHIẾU (v5.7.1) ----------
function txnLogDetail(t, noId) {
  const q = +t.qty || 0, delta = t.type === 'xuat' ? -q : q;
  return (delta > 0 ? '+' : '') + delta + ' ' + t.unit + ' ' + t.itemName +
    (t.thietBi ? ' → ' + t.thietBi : '') + (t.reason ? ' · Lý do: ' + t.reason : '') + (t.refId ? ' · Phiếu gốc #' + t.refId : '') +
    (noId ? '' : ' · #' + t.id);
}
const idRe = id => new RegExp('#' + String(id).replace(/\D/g, '') + '(?!\\d)');
function vnSec(s) {
  const m = String(s || '').match(/(\d{1,2}):(\d{2}):?(\d{2})?\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? Date.UTC(+m[6], +m[5] - 1, +m[4], +m[1], +m[2], +(m[3] || 0)) / 1000 : NaN;
}
// Tìm dòng nhật ký lập phiếu: theo số phiếu; phiếu cũ (dòng chưa có số) thì dò theo loại + nội dung + giờ, chỉ nhận khi khớp đúng 1 dòng
function findTxnLogRow(rows, t) {
  const re = idRe(t.id), label = TXN_LABEL[t.type];
  let i = rows.findIndex(r => String(r[4]) === label && / · #\d+$/.test(String(r[5])) && re.test(String(r[5]).match(/ · #\d+$/)[0]));
  if (i >= 0) return i;
  const want = txnLogDetail(t, true), ts = vnSec(t.datetime);
  const c = [];
  rows.forEach((r, k) => {
    const det = String(r[5]);
    if (String(r[4]) === label && !/ · #\d+$/.test(det) && det === want && Math.abs(vnSec(r[0]) - ts) <= 5) c.push(k);
  });
  return c.length === 1 ? c[0] : -1;
}
function logSheet() { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG.sheet); }
// Xóa các dòng nhật ký của phiếu kho (txRows: các dòng GiaoDich bị xóa, dạng object)
function deleteTxnLogs(txRows) {
  const sh = logSheet(); if (!sh) return;
  const rows = readRows(sh, LOG.cols.length), del = {};
  txRows.forEach(t => {
    const k = findTxnLogRow(rows, t); if (k >= 0) del[k] = 1;
    const re = idRe(t.id);
    rows.forEach((r, j) => { if (String(r[4]) === 'Thêm ảnh biên bản' && re.test(String(r[5]))) del[j] = 1; });
  });
  deleteSheetRows(sh, Object.keys(del).map(Number));
}
function rewriteTxnLog(old, nw) {
  const sh = logSheet(); if (!sh) return;
  const rows = readRows(sh, LOG.cols.length), k = findTxnLogRow(rows, old);
  if (k < 0) return;
  sh.getRange(k + 2, 1).setValue(toCell(String(nw.datetime)));
  sh.getRange(k + 2, 6).setValue(toCell(txnLogDetail(nw).slice(0, 500)));
}
function loanLogRows(rows, loanId) {
  const re = idRe(loanId), out = [];
  rows.forEach((r, j) => { if (/^(Cho mượn|Đi mượn|Nhận trả|Trả lại|Đóng phiếu mượn|Thêm ảnh biên bản)$/.test(String(r[4])) && re.test(String(r[5]))) out.push(j); });
  return out;
}

function editTxn(u, d0) {
  const d = cleanObj(d0);
  const gd = sheetOf(TXN.sheet, TXN.head), rows = readRows(gd, TXN.cols.length);
  const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(d.id));
  if (i < 0) fail('Không tìm thấy phiếu');
  const old = rowToObj(TXN.cols, rows[i]);
  if (LOAN_TXN_LABEL[old.type]) fail('Phiếu cho mượn / trả: sửa ở mục Cho mượn / Trả');
  if (old.type === 'kiemke') fail('Phiếu kiểm kê không sửa được — xóa rồi kiểm kê lại');
  const qty = Math.round((+d.qty || 0) * 1000) / 1000;
  if (old.type === 'dieuchinh' ? !qty : !(qty > 0)) fail(old.type === 'dieuchinh' ? 'Số lượng điều chỉnh phải khác 0' : 'Số lượng phải lớn hơn 0');
  const T = TABLES.items, items = readRows(sheetOf(T.sheet, T.head), T.cols.length);
  const itemId = d.itemId !== undefined && d.itemId !== '' ? d.itemId : old.itemId;
  const it = items.find(r => r[0] !== '' && String(r[0]) === String(itemId));
  if (!it) fail('Vật tư không tồn tại');
  if (String(it[6]) !== String(old.project)) fail('Chỉ chọn được vật tư trong cùng dự án');
  const nw = Object.assign({}, old, {
    itemId: it[0], itemName: String(it[1]), unit: String(it[3]), qty: qty,
    supplierOrReceiver: old.type === 'dieuchinh' ? '' : String(d.supplierOrReceiver !== undefined ? d.supplierOrReceiver : old.supplierOrReceiver || ''),
    thietBi: old.type === 'xuat' ? String(d.thietBi !== undefined ? d.thietBi : old.thietBi || '') : String(old.thietBi || ''),
    note: String(d.note !== undefined ? d.note : old.note || ''),
    reason: old.type === 'dieuchinh' ? String(d.reason !== undefined ? d.reason : old.reason || '') : String(old.reason || ''),
    datetime: d.datetime ? checkTime(d.datetime) : String(old.datetime || ''),
    clientTime: ''
  });
  gd.getRange(i + 2, 1, 1, TXN.cols.length).setValues([TXN.cols.map(c => toCell(nw[c] === undefined ? '' : nw[c]))]);
  rewriteTxnLog(old, nw);
  const ch = {};
  if (afterMoc_(old.itemId, old.datetime)) ch[String(old.itemId)] = (ch[String(old.itemId)] || 0) - txnEffect(rows[i]);
  if (afterMoc_(nw.itemId, nw.datetime)) ch[String(nw.itemId)] = (ch[String(nw.itemId)] || 0) + (TXN_SIGN[old.type] || 0) * qty;
  applyStock(ch);
  bumpTxnRev();
  return { success:true, datetime:nw.datetime };
}

function deleteTxn(u, d) {
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  const rows = gd ? readRows(gd, TXN.cols.length) : [];
  const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(d.id));
  if (i < 0) return { success:true, duplicate:true };              // đã xóa rồi
  if (LOAN_TXN_LABEL[String(rows[i][1])]) fail('Phiếu cho mượn / trả: xóa ở mục Cho mượn / Trả');
  const del = [i];
  rows.forEach((r, k) => { if (k !== i && String(r[1]) === 'dieuchinh' && String(r[12]) === String(d.id)) del.push(k); });   // phiếu điều chỉnh gắn kèm
  const ch = {}, kkItems = [];
  del.forEach(k => {
    const id = String(rows[k][2]), when = fromCell(rows[k][9]);
    if (String(rows[k][1]) === 'kiemke') {                   // xóa mốc kiểm kê gần nhất → trả tồn về số trên app lúc đếm
      if (tms_(when) >= mocOf_(id)) { const app = +((String(rows[k][11]).match(/trên app (-?[\d.]+)/) || [])[1] || 0); ch[id] = (ch[id] || 0) + (app - (+rows[k][4] || 0)); }
      kkItems.push(id); return;
    }
    if (afterMoc_(id, when)) ch[id] = (ch[id] || 0) - txnEffect(rows[k]);
  });
  deletePhotosOf(del.map(k => rows[k][0]));
  deleteTxnLogs(del.map(k => rowToObj(TXN.cols, rows[k])));
  deleteSheetRows(gd, del);
  applyStock(ch);
  if (kkItems.length) rebuildMoc_(kkItems);
  bumpTxnRev();
  return { success:true, deleted:del.map(k => String(rows[k][0])) };
}

function editLoan(u, d0) {
  const d = cleanObj(d0), lr = findLoanRow(d.id);
  if (!lr) fail('Không tìm thấy phiếu mượn');
  const loan = lr.loan, oldParty = loan.party, oldDue = loan.dueDate;
  if (d.party !== undefined) { if (String(d.party).length < 2) fail('Ghi rõ người / đơn vị'); loan.party = String(d.party).slice(0, 120); }
  if (d.phone !== undefined) loan.phone = String(d.phone).slice(0, 30);
  if (d.dueDate !== undefined) { if (d.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(d.dueDate)) fail('Hạn trả không hợp lệ'); loan.dueDate = String(d.dueDate || ''); }
  if (d.note !== undefined) loan.note = String(d.note).slice(0, 500);
  saveLoan(lr.sh, lr.i, loan);
  // Nhật ký của phiếu mượn: đổi tên người mượn / hạn trả cho khớp
  const lg = logSheet();
  if (lg) {
    const rows = readRows(lg, LOG.cols.length);
    loanLogRows(rows, loan.id).forEach(j => {
      let det = String(rows[j][5]);
      if (oldParty && oldParty !== loan.party) det = det.split(oldParty).join(loan.party);
      if (oldDue !== loan.dueDate) det = oldDue ? det.replace(' · hạn ' + oldDue, loan.dueDate ? ' · hạn ' + loan.dueDate : '')
        : (loan.dueDate ? det.replace(' · phiếu #', ' · hạn ' + loan.dueDate + ' · phiếu #') : det);
      if (det !== String(rows[j][5])) lg.getRange(j + 2, 6).setValue(toCell(det.slice(0, 500)));
    });
  }
  // Đổi tên người mượn trên các phiếu kho của phiếu mượn này
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  if (gd) readRows(gd, TXN.cols.length).forEach((r, k) => {
    if (String(r[12]) === String(loan.id) && (LOAN_TXN_LABEL[String(r[1])] || /^(nhap|xuat)$/.test(String(r[1]))))
      gd.getRange(k + 2, 8).setValue(toCell(loan.party));
  });
  bumpTxnRev();
  return { success:true };
}

function deleteLoan(u, d) {
  const lr = findLoanRow(d.id);
  if (!lr) return { success:true, duplicate:true };
  const loanId = String(lr.loan.id);
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  const del = [], ch = {};
  if (gd) {
    const rows = readRows(gd, TXN.cols.length);
    rows.forEach((r, k) => {
      if (String(r[12]) === loanId && (LOAN_TXN_LABEL[String(r[1])] || /^(nhap|xuat)$/.test(String(r[1])))) {
        del.push(k); const id = String(r[2]); ch[id] = (ch[id] || 0) - txnEffect(r);
      }
    });
    deleteSheetRows(gd, del);
  }
  applyStock(ch);
  deletePhotosOf([loanId]);
  const lg = logSheet();
  if (lg) deleteSheetRows(lg, loanLogRows(readRows(lg, LOG.cols.length), loanId));
  lr.sh.deleteRow(lr.i + 2);
  bumpTxnRev();
  return { success:true };
}

// ---------- ẢNH BIÊN BẢN (Google Drive) ----------
function photoRootFolder() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('photoFolder');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder(PHOTO_FOLDER_NAME);
  props.setProperty('photoFolder', f.getId());
  return f;
}
function monthFolder() {
  const root = photoRootFolder();
  const name = Utilities.formatDate(new Date(), TZ, 'yyyy-MM');
  const it = root.getFoldersByName(name);
  return it.hasNext() ? it.next() : root.createFolder(name);
}
function uploadPhoto(u, d) {
  if (!d.photoId || !d.txnId || !d.data) fail('Thiếu dữ liệu ảnh');
  const sh = sheetOf(PHOTO.sheet, PHOTO.head);
  if (readRows(sh, 1).some(r => String(r[0]) === String(d.photoId))) return { success:true, duplicate:true };  // đã tải rồi
  const m = String(d.data).match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
  if (!m) fail('Ảnh không hợp lệ');
  const bytes = Utilities.base64Decode(m[3]);
  if (bytes.length > PHOTO_MAX_BYTES) fail('Ảnh quá lớn (tối đa 4MB)');
  // Đặt tên file dễ tìm trong Drive: ngày + loại phiếu + vật tư + số phiếu
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  let label = 'Phiếu';
  if (gd) {
    const rows = readRows(gd, 4), i = rows.findIndex(r => String(r[0]) === String(d.txnId));
    if (i >= 0) label = (TXN_LABEL[rows[i][1]] || LOAN_TXN_LABEL[rows[i][1]] || 'Phiếu') + ' ' + rows[i][3];
  }
  const txRow = gd ? readRows(gd, TXN.cols.length).find(r => String(r[0]) === String(d.txnId)) : null;
  let photoProj;
  if (txRow) photoProj = String(txRow[6]);
  else {                                                        // ảnh gắn vào phiếu mượn
    const lr = findLoanRow(d.txnId);
    if (!lr) fail('Không tìm thấy phiếu để gắn ảnh');
    photoProj = lr.loan.project;
    label = (lr.loan.kind === 'cho' ? 'Cho mượn ' : 'Đi mượn ') + lr.loan.itemName;
  }
  mustAllow(u, photoProj);
  const name = clean(Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HHmm') + ' ' + label + ' #' + d.txnId + '-' + String(d.photoId).slice(-3), 150) + '.jpg';
  const file = monthFolder().createFile(Utilities.newBlob(bytes, m[1], name));
  file.setDescription('Người chụp: ' + u.name + ' · Số phiếu ' + d.txnId);
  sh.appendRow([d.photoId, d.txnId, toCell(file.getId()), toCell(name), toCell(u.id), toCell(u.name), toCell(nowTxt()), toCell(photoProj)]);
  writeLog(u, 'Thêm ảnh biên bản', label + ' #' + d.txnId);
  return { success:true, fileId:file.getId() };
}
function getPhoto(u, d) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PHOTO.sheet);
  // Chỉ trả ảnh có trong danh sách ảnh biên bản (không cho đọc file Drive khác) và thuộc dự án được giao
  const row = sh && d.fileId ? readRows(sh, PHOTO.cols.length).find(r => String(r[2]) === String(d.fileId)) : null;
  if (!row) fail('Không tìm thấy ảnh');
  mustAllow(u, String(row[7]));
  const blob = DriveApp.getFileById(String(d.fileId)).getBlob();
  return { success:true, data:'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()) };
}
// Chạy tay 1 lần để cấp quyền Google Drive và tạo thư mục ảnh
function KHOI_TAO_thuMucAnh() {
  const f = photoRootFolder();
  Logger.log('Thư mục ảnh biên bản: ' + f.getUrl());
}

// ---------- KHẨN CẤP (chạy tay trong trình soạn thảo Apps Script) ----------
// Admin quên mật khẩu: chọn hàm này ở thanh trên → bấm ▶ Chạy → đăng nhập bằng mật khẩu tạm rồi đổi ngay.
function KHAN_CAP_datLaiMatKhauAdmin() {
  const TEMP_PW = 'Fecon@' + Math.floor(100000 + Math.random() * 900000);
  const users = loadUsers();
  const t = users.find(x => x.username === ADMIN_USERNAME);
  if (!t) { Logger.log('Chưa có tài khoản ' + ADMIN_USERNAME); return; }
  t.salt = Utilities.getUuid(); t.hash = hashPw(TEMP_PW, t.salt); t.status = 'active'; t.role = 'admin';
  saveUsers(users); revokeSessions(t.id);
  CacheService.getScriptCache().remove('F_' + ADMIN_USERNAME);
  writeLog({ id:'', name:'(Chủ Sheet)', role:'admin' }, 'Đặt lại mật khẩu Admin', '@' + ADMIN_USERNAME);
  Logger.log('Mật khẩu tạm của @' + ADMIN_USERNAME + ': ' + TEMP_PW);
}


// ===================== v5.10: NẠP DỮ LIỆU TỪ EXCEL =====================
// CÁCH DÙNG (một lần):
//  1. Mở Google Sheet của app → Tệp → Nhập → Tải lên file "Nap_du_lieu_..." → chọn "Chèn trang tính mới" → Nhập dữ liệu
//     (Sheet sẽ có thêm 4 trang: NAP_VatTu, NAP_ThietBi, NAP_Phieu, Doi_chieu_de_duyet)
//  2. Trong Apps Script: chọn hàm NAP_duLieuExcel ở thanh trên → ▶ Chạy → xem kết quả ở "Nhật ký thực thi"
//  3. Nạp xong có thể xóa 4 trang NAP_… (không xóa cũng không sao)
const NAP_DU_AN = 'DA TTHC Quận 2';          // tên dự án trên app (sửa ở đây nếu muốn tên khác)
function NAP_duLieuExcel() {
  const out = withLock(() => napExcel_(NAP_DU_AN));
  Logger.log(out.join('\n'));
  return out;
}
function napExcel_(P) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), log = [];
  ['NAP_VatTu', 'NAP_ThietBi', 'NAP_Phieu'].forEach(n => {
    if (!ss.getSheetByName(n)) fail('Chưa có trang ' + n + ' – hãy nhập file Nap_du_lieu vào Sheet trước (Tệp → Nhập → Chèn trang tính mới)');
  });
  const vals = n => {
    const sh = ss.getSheetByName(n), r = sh.getLastRow() - 1;
    return r > 0 ? sh.getRange(2, 1, r, sh.getLastColumn()).getValues().filter(x => String(x[0]).trim() !== '') : [];
  };
  const txt = v => clean(String(v === null || v === undefined ? '' : v).replace(/\s+/g, ' ').trim(), 300);
  const vt = vals('NAP_VatTu'), tb = vals('NAP_ThietBi'), ph = vals('NAP_Phieu');
  if (!vt.length || !ph.length) fail('Trang NAP_VatTu hoặc NAP_Phieu đang trống');

  // 1. Đọc và kiểm tra dữ liệu nạp (lỗi thì dừng, chưa đụng vào Sheet)
  let seq = Date.now() * 100;
  const items = {}, itemRows = [];
  vt.forEach(r => {
    const name = txt(r[0]);
    if (!name || items[name]) return;
    const it = { id: seq++, name: name, cat: txt(r[1]) || 'khac', unit: txt(r[2]) || 'Cái', stock: 0, minStock: 0, project: P, expect: +r[3] || 0 };
    items[name] = it; itemRows.push(it);
  });

  //    Máy móc
  const devRows = [], devNames = {};
  tb.forEach(r => {
    const name = txt(r[0]);
    if (!name || devNames[name]) return;
    devNames[name] = 1;
    devRows.push({ id: seq++, name: name, cat: txt(r[1]) || 'khac', type: txt(r[2]) || 'own', fuelRate: +r[3] || 20, plate: '', note: 'Nạp từ Excel NXT', project: P });
  });

  //    Phiếu
  const SIGN = { nhap: 1, xuat: -1, dieuchinh: 1 }, txns = [], bad = [];
  ph.forEach((r, i) => {
    const type = txt(r[1]), name = txt(r[2]), qty = Math.round((+r[3] || 0) * 1000) / 1000;
    let at = String(r[0] instanceof Date ? Utilities.formatDate(r[0], TZ, 'HH:mm:ss d/M/yyyy') : r[0]).replace(/^'/, '').trim();
    try { at = checkTime(at); } catch (e) { bad.push('dòng ' + (i + 2) + ': ngày giờ "' + at + '"'); return; }
    const it = items[name];
    if (!SIGN[type]) { bad.push('dòng ' + (i + 2) + ': loại phiếu "' + type + '"'); return; }
    if (!it) { bad.push('dòng ' + (i + 2) + ': không có vật tư "' + name + '" trong NAP_VatTu'); return; }
    if (!qty) { bad.push('dòng ' + (i + 2) + ': số lượng = 0'); return; }
    const tbName = txt(r[5]);
    if (tbName && !devNames[tbName]) { bad.push('dòng ' + (i + 2) + ': không có máy "' + tbName + '" trong NAP_ThietBi'); return; }
    it.stock = Math.round((it.stock + SIGN[type] * qty) * 1000) / 1000;
    txns.push({
      id: seq++, type: type, itemId: it.id, itemName: it.name, qty: qty, unit: it.unit, project: P,
      supplierOrReceiver: type === 'dieuchinh' ? '' : txt(r[4]), thietBi: tbName, datetime: at, note: txt(r[6]),
      reason: type === 'dieuchinh' ? (txt(r[7]) || 'Khớp tồn theo bảng tổng hợp NXT') : '', refId: '',
      createdBy: '', createdByName: 'Nạp từ Excel NXT', clientTime: ''
    });
  });
  if (bad.length) fail('Dữ liệu nạp có lỗi, CHƯA thay đổi gì trên Sheet:\n' + bad.slice(0, 20).join('\n'));

  // 2. Sao lưu cả file trước khi đụng vào dữ liệu
  const stamp = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH-mm');
  DriveApp.getFileById(ss.getId()).makeCopy(ss.getName() + ' – sao lưu trước khi nạp ' + stamp);
  log.push('✔ Đã tạo bản sao lưu: "' + ss.getName() + ' – sao lưu trước khi nạp ' + stamp + '"');

  // 3. Dự án
  const dsh = sheetOf(DUAN, ['id', 'name']);
  const plist = readRows(dsh, 2).map(r => String(r[1])).filter(Boolean);
  if (plist.indexOf(P) < 0) { dsh.appendRow([plist.length + 1, toCell(P)]); log.push('✔ Thêm dự án mới: ' + P); }

  // 4. Xóa dữ liệu cũ (demo) của dự án này, giữ nguyên các dự án khác
  const wipe = (name, head, cols) => {
    const sh = sheetOf(name, head), n = sh.getLastRow() - 1, pc = cols.indexOf('project');
    if (n < 1) return 0;
    const w = Math.max(cols.length, sh.getLastColumn());
    const all = sh.getRange(2, 1, n, w).getValues();
    const keep = all.filter(r => String(r[pc]) !== P);
    if (keep.length === all.length) return 0;
    sh.getRange(2, 1, n, w).clearContent();
    if (keep.length) sh.getRange(2, 1, keep.length, w).setValues(keep.map(r => r.map(toCell)));
    return all.length - keep.length;
  };
  const gone = [
    ['vật tư', wipe(TABLES.items.sheet, TABLES.items.head, TABLES.items.cols)],
    ['máy', wipe(TABLES.devices.sheet, TABLES.devices.cols, TABLES.devices.cols)],
    ['sửa chữa', wipe(TABLES.repairs.sheet, TABLES.repairs.cols, TABLES.repairs.cols)],
    ['ghi chú', wipe(TABLES.notes.sheet, TABLES.notes.cols, TABLES.notes.cols)],
    ['phiếu', wipe(TXN.sheet, TXN.head, TXN.cols)],
    ['phiếu mượn', wipe(LOAN.sheet, LOAN.head, LOAN.cols)],
    ['ảnh', wipe(PHOTO.sheet, PHOTO.head, PHOTO.cols)]
  ].filter(x => x[1] > 0);
  log.push(gone.length ? '✔ Đã xóa dữ liệu cũ của dự án: ' + gone.map(x => x[1] + ' ' + x[0]).join(', ') : '✔ Dự án chưa có dữ liệu cũ');

  // 5. Ghi xuống Sheet (ghi một lần cho nhanh)
  const append = (name, head, cols, rows) => {
    if (!rows.length) return;
    const sh = sheetOf(name, head), start = Math.max(sh.getLastRow(), 1) + 1;
    sh.getRange(start, 1, rows.length, cols.length).setValues(rows.map(o => cols.map(c => toCell(o[c] === undefined ? '' : o[c]))));
  };
  append(TABLES.items.sheet, TABLES.items.head, TABLES.items.cols, itemRows);
  append(TABLES.devices.sheet, TABLES.devices.cols, TABLES.devices.cols, devRows);
  append(TXN.sheet, TXN.head, TXN.cols, txns);
  log.push('✔ Đã nạp ' + itemRows.length + ' vật tư, ' + devRows.length + ' máy, ' + txns.length + ' phiếu');

  // 6. Kiểm tra tồn từng vật tư so với file
  const off = itemRows.filter(it => Math.abs(it.stock - it.expect) > 0.001);
  log.push(off.length ? '⚠ ' + off.length + ' vật tư lệch tồn: ' + off.map(it => it.name + ' (app ' + it.stock + ' / file ' + it.expect + ')').join('; ')
                      : '✔ Tồn kho của cả ' + itemRows.length + ' vật tư khớp với file');

  bumpTxnRev(); bumpVersion();                   // các máy tải lại toàn bộ dữ liệu
  writeLog(null, 'Nạp dữ liệu từ Excel', P + ': ' + itemRows.length + ' vật tư, ' + devRows.length + ' máy, ' + txns.length + ' phiếu');
  return log;
}


// ===================== v5.11: CHI PHÍ VẬT TƯ =====================
const PRICE = { sheet:'BangGia', cols:['id','project','itemId','itemName','price','from','note','byName','at'],
  head:['ID','Dự án','ID vật tư','Tên vật tư','Đơn giá (đồng / đơn vị kho)','Áp dụng từ ngày','Ghi chú','Người đặt','Lúc đặt'] };
const HANGMUC = { sheet:'HangMuc', cols:['id','project','name','done','total','unit','byName','at'],
  head:['ID','Dự án','Hạng mục','Đã làm','Tổng','Đơn vị','Người cập nhật','Lúc cập nhật'] };
const PLAN = { sheet:'KeHoach', cols:['id','project','name','unit','mode','items','plan','note'],
  head:['ID','Dự án','Dòng kế hoạch','Đơn vị','Kiểu (tk = thiết kế, dm = định mức)','Vật tư (tên, hệ số quy đổi, hạng mục riêng)','Khối lượng theo hạng mục','Ghi chú'] };
const COST_ROLES = { ql:1, admin:1, ld:1 };
function costDay_(v) {                                   // 'HH:mm:ss d/M/yyyy' hoặc 'd/M/yyyy' → số ngày
  const m = String(fromCell(v) || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? Date.UTC(+m[3], +m[2] - 1, +m[1]) / 86400000 : NaN;
}
function vnNum_(n, dp) {
  dp = dp || 0; const k = Math.pow(10, dp), s = (Math.round((+n || 0) * k) / k).toFixed(dp).split('.');
  return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (s[1] && +s[1] ? ',' + s[1].replace(/0+$/, '') : '');
}
function vnMoney_(v) { return v >= 1e9 ? vnNum_(v / 1e9, 1) + ' tỷ' : v >= 1e6 ? vnNum_(v / 1e6, 0) + ' triệu' : vnNum_(v, 0) + ' đ'; }
function readTable_(T, P) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(T.sheet);
  return (sh ? readRows(sh, T.cols.length) : []).filter(r => r[0] !== '' && (!P || String(r[1]) === P)).map(r => rowToObj(T.cols, r));
}
function loadPrices_(P) {                                // itemId → [{day, price, ...}] tăng dần theo ngày
  const out = {};
  readTable_(PRICE, P).forEach((r, i) => {
    const day = costDay_(r.from), price = +r.price || 0;
    if (isNaN(day) || !(price > 0)) return;
    (out[String(r.itemId)] = out[String(r.itemId)] || []).push({ day:day, price:price, from:String(r.from), note:String(r.note || ''),
      byName:String(r.byName || ''), at:String(r.at || ''), i:i });
  });
  Object.keys(out).forEach(k => out[k].sort((a, b) => a.day - b.day || a.i - b.i));
  return out;
}
function priceAt_(list, day) {                            // chưa tới giá đầu tiên → dùng giá đầu tiên
  if (!list || !list.length) return 0;
  let p = list[0].price;
  for (let i = 0; i < list.length; i++) { if (list[i].day <= day) p = list[i].price; else break; }
  return p;
}
function projItems_(P) {
  const T = TABLES.items, sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(T.sheet);
  return (sh ? readRows(sh, T.cols.length) : []).filter(r => r[0] !== '' && String(r[6]) === P)
    .map(r => ({ id:String(r[0]), name:String(r[1]), cat:String(r[2]), unit:String(r[3]), stock:+r[4] || 0 }));
}
function shortAfter_(first, name, i) {               // "Cóc nối thép D32, D28": bỏ phần tên trùng với vật tư đầu
  if (!i) return name;
  const a = first.split(' '), b = name.split(' '); let k = 0;
  while (k < a.length - 1 && k < b.length - 1 && a[k] === b[k]) k++;
  return k >= 2 ? b.slice(k).join(' ') : name;
}
const nameKey_ = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();

function getCost(u, d) {
  if (!COST_ROLES[u.role] && !(NEW_ROLES[u.role] && can_(u, 'chiPhi'))) return { success:false, forbidden:true, error:'Bạn không có quyền xem chi phí vật tư' };
  const projects = allowedProjects(u);
  let P = String(d.project || '');
  if (!P) {                                               // chưa chọn: ưu tiên dự án đã có kế hoạch vật tư
    const hasPlan = {}; readTable_(PLAN).forEach(r => hasPlan[String(r.project)] = 1);
    P = projects.filter(p => hasPlan[p])[0] || projects[0] || '';
  }
  if (!P) return { success:true, empty:true, projects:projects };
  mustAllow(u, P);
  const key = 'cost|' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, P, Utilities.Charset.UTF_8))
    + '|' + getVersion() + '|' + txnRev() + '|' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  const cache = CacheService.getScriptCache();
  let hit = null; try { const c = cache.get(key); if (c) hit = JSON.parse(c); } catch (e) {}
  if (hit) return Object.assign(hit, { canEdit:RANK[u.role] >= RANK.ql, canProgress:RANK[u.role] >= RANK.ql || (!!NEW_ROLES[u.role] && can_(u, 'tienDo')), projects:projects, cached:true });
  const res = costCalc_(P);
  try { const t = JSON.stringify(res); if (t.length < 95000) cache.put(key, t, 600); } catch (e) {}
  return Object.assign(res, { canEdit:RANK[u.role] >= RANK.ql, canProgress:RANK[u.role] >= RANK.ql || (!!NEW_ROLES[u.role] && can_(u, 'tienDo')), projects:projects });
}
function costCalc_(P) {
  const items = {}, byName = {};
  projItems_(P).forEach(it => { Object.assign(it, { nhap:0, xuat:0, nhapN:0, nhapV:0, xuatV:0 }); items[it.id] = it; byName[nameKey_(it.name)] = it; });
  const prices = loadPrices_(P);
  const today = Math.floor((Date.now() / 1000 + 7 * 3600) / 86400);
  const cur = id => priceAt_(prices[id], today);
  const grp = it => it.cat === 'thep' ? 0 : it.cat === 'nhienLieu' ? 1 : 2;
  const WK = {}, MO = {}, bought = [0, 0, 0];
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  (gd ? readRows(gd, TXN.cols.length) : []).forEach(r => {
    if (r[0] === '' || String(r[6]) !== P) return;
    const type = String(r[1]); if (type !== 'nhap' && type !== 'xuat') return;
    const it = items[String(r[2])]; if (!it) return;
    const day = costDay_(r[9]); if (isNaN(day)) return;
    const q = +r[4] || 0, v = q * priceAt_(prices[it.id], day);
    if (type === 'xuat') { it.xuat += q; it.xuatV += v; return; }
    it.nhap += q; it.nhapN++; it.nhapV += v;
    if (!v) return;
    const g = grp(it), dt = new Date(day * 86400000), mon = day - (dt.getUTCDay() + 6) % 7, mk = dt.getUTCFullYear() * 12 + dt.getUTCMonth();
    bought[g] += v; (WK[mon] = WK[mon] || [0, 0, 0])[g] += v; (MO[mk] = MO[mk] || [0, 0, 0])[g] += v;
  });
  // biểu đồ: 18 tuần / 12 tháng gần nhất (từ lúc có phiếu)
  const r0 = a => a.map(v => Math.round(v));
  const curMon = today - (new Date(today * 86400000).getUTCDay() + 6) % 7, wk = Object.keys(WK).map(Number), weeks = [];
  if (wk.length) for (let k = Math.max(Math.min.apply(null, wk), curMon - 17 * 7); k <= curMon; k += 7) {
    const a = new Date(k * 86400000), b = new Date((k + 6) * 86400000);
    weeks.push([a.getUTCDate() + '/' + (a.getUTCMonth() + 1)].concat(r0(WK[k] || [0, 0, 0]),
      ['Tuần ' + a.getUTCDate() + '/' + (a.getUTCMonth() + 1) + ' – ' + b.getUTCDate() + '/' + (b.getUTCMonth() + 1) + '/' + b.getUTCFullYear()]));
  }
  const td = new Date(today * 86400000), curMk = td.getUTCFullYear() * 12 + td.getUTCMonth(), mo = Object.keys(MO).map(Number), months = [];
  if (mo.length) for (let k = Math.max(Math.min.apply(null, mo), curMk - 11); k <= curMk; k++)
    months.push(['T' + (k % 12 + 1)].concat(r0(MO[k] || [0, 0, 0]), ['Tháng ' + (k % 12 + 1) + '/' + Math.floor(k / 12) + (k === curMk ? ' (đến hôm nay)' : '')]));

  // tiến độ hạng mục
  const hm = readTable_(HANGMUC, P).map(r => ({ id:String(r.id), name:String(r.name), done:+r.done || 0, total:+r.total || 0, unit:String(r.unit || '') }));
  const pct = {}; hm.forEach(h => pct[h.name] = h.total > 0 ? Math.min(1, Math.max(0, h.done / h.total)) : 0);

  // các dòng kế hoạch
  const missing = {}, hmW = {};
  const lines = readTable_(PLAN, P).map(r => {
    let its = [], plan = {};
    try { its = JSON.parse(String(r.items || '[]')); } catch (e) {}
    try { plan = JSON.parse(String(r.plan || '{}')); } catch (e) {}
    const L = { name:String(r.name), unit:String(r.unit), mode:String(r.mode || 'tk'), actual:0, value:0, bought:0, stock:0, upS:0, upN:0, total:0, expect:0, remain:0 };
    its.forEach(x => {
      const it = byName[nameKey_(x.n)]; if (!it) return;
      const f = +x.f || 1, cp = cur(it.id);
      L.actual += it.xuat * f; L.value += it.xuatV; L.bought += it.nhapV;
      if (cp) { L.upS += cp / f; L.upN++; } else if (it.nhap > 0 || it.stock > 0) missing[it.name] = 1;
      if (!(x.hm && pct[x.hm] >= 1)) L.stock += Math.max(0, it.stock) * f;
      (it.use = it.use || []).push(String(x.hm || ''));
    });
    Object.keys(plan).forEach(h => { const q = +plan[h] || 0, p = pct[h] || 0; L.total += q; L.expect += q * p; L.remain += q * (1 - p); });
    L.up = L.upN ? L.upS / L.upN : 0;
    if (L.mode === 'tk' && L.up) Object.keys(plan).forEach(h => hmW[h] = (hmW[h] || 0) + (+plan[h] || 0) * L.up);
    return L;
  });
  const dpOf = u2 => u2 === 'tấn' ? 1 : 0;
  const rows = lines.map(L => {
    const dev = L.expect > 0 ? L.actual / L.expect - 1 : null;
    const ratio = L.mode === 'dm' && L.expect > 0 ? L.actual / L.expect : 1;      // định mức: phần còn lại theo mức dùng thực tế
    const remain = L.remain * ratio, need = Math.max(0, remain - L.stock);
    return { name:L.name, unit:L.unit, mode:L.mode, actual:L.actual, expect:L.expect, value:Math.round(L.value), dev:dev,
      remain:remain, stock:L.stock, need:need, needVal:Math.round(need * L.up), planVal:L.total * L.up, bought:L.bought, up:L.up };
  }).sort((a, b) => b.value - a.value);

  // chỉ số chính
  let stockV = [0, 0, 0];
  Object.keys(items).forEach(k => { const it = items[k]; if (it.stock > 0) stockV[grp(it)] += it.stock * cur(it.id); });
  const tkRows = rows.filter(r => r.mode === 'tk' && r.up > 0);
  const planVal = tkRows.reduce((s, r) => s + r.planVal, 0), boughtPlan = tkRows.reduce((s, r) => s + r.bought, 0);
  const matPct = planVal > 0 ? boughtPlan / planVal : null;
  const wSum = Object.keys(hmW).reduce((s, h) => s + hmW[h], 0);
  const prog = hm.length ? (wSum > 0 ? Object.keys(hmW).reduce((s, h) => s + hmW[h] * (pct[h] || 0), 0) / wSum
                                     : hm.reduce((s, h) => s + pct[h.name], 0) / hm.length) : null;

  // việc cần xử lý
  const al = [];
  const thua = {};                                        // vật tư chỉ dùng cho hạng mục đã xong mà còn tồn → gộp theo hạng mục
  Object.keys(items).forEach(k => {
    const it = items[k];
    if (!(it.stock > 0) || !it.use || !it.use.every(h => h && pct[h] >= 1)) return;
    const g = thua[it.use[0]] = thua[it.use[0]] || { list:[], v:0 };
    g.list.push(it); g.v += it.stock * cur(it.id);
  });
  Object.keys(thua).forEach(h => {
    const g = thua[h]; g.list.sort((a, b) => b.stock * cur(b.id) - a.stock * cur(a.id));
    al.push({ lvl:'r', w:2e15 + g.v, b:g.list.slice(0, 3).map((it, i) => shortAfter_(g.list[0].name, it.name, i) + ' ' + vnNum_(it.stock, 1) + ' ' + it.unit.toLowerCase()).join(', ')
      + (g.list.length > 3 ? '…' : '') + ' đang thừa' + (g.v ? ' (~' + vnMoney_(g.v) + ')' : '') + '.', t:'Hạng mục ' + h + ' đã xong, nên điều chuyển sang dự án khác.' });
  });
  if (matPct !== null && prog !== null && Math.abs(matPct - prog) > 0.10)
    al.push({ lvl:'r', w:1e15, b:matPct > prog ? 'Vật tư đang mua nhanh hơn tiến độ thi công.' : 'Vật tư đang mua chậm hơn tiến độ thi công.',
      t:'Đã mua ' + Math.round(matPct * 100) + '% kế hoạch, thi công ' + Math.round(prog * 100) + '%.' });
  const devG = {};                                        // lệch thiết kế > 10%: gộp theo đơn vị + chiều lệch
  rows.forEach(r => {
    if (r.mode !== 'tk' || r.dev === null || Math.abs(r.dev) <= 0.10) return;
    const k = r.unit + (r.dev < 0 ? '-' : '+'); (devG[k] = devG[k] || []).push(r);
  });
  Object.keys(devG).forEach(k => {
    const g = devG[k], less = k.slice(-1) === '-', u2 = g[0].unit;
    const diff = g.reduce((s, r) => s + Math.abs(r.actual - r.expect), 0), w = g.reduce((s, r) => s + Math.abs(r.actual - r.expect) * (r.up || 1), 0);
    const names = g.map((r, i) => (i && /^Thép D/.test(r.name) && /^Thép D/.test(g[0].name) ? r.name.replace('Thép ', '') : r.name) + ' (' + (less ? '−' : '+') + vnNum_(Math.abs(r.dev) * 100, 0) + '%)').join(', ');
    al.push({ lvl:'r', w:w, b:names + (less ? ' ít hơn' : ' nhiều hơn') + ' thiết kế ' + vnNum_(diff, dpOf(u2)) + ' ' + u2 + '.',
      t:less ? 'Kiểm tra phiếu xuất ghi thiếu, dùng loại khác thay thế hoặc cấp từ nguồn khác.' : 'Kiểm tra hao hụt hoặc xuất nhầm loại.' });
  });
  rows.forEach(r => {
    if (r.mode === 'dm' && r.dev !== null && r.dev > 0.10) al.push({ lvl:'r', w:r.value, b:r.name + ' vượt định mức ' + vnNum_(r.dev * 100, 0) + '%.', t:'Kiểm tra mức tiêu hao của máy.' });
    if (r.remain > 0 && r.stock > 0 && r.stock >= r.remain)
      al.push({ lvl:'y', w:r.stock * (r.up || 1), b:r.name + ' tồn ' + vnNum_(r.stock, dpOf(r.unit)) + ' ' + r.unit + ', đủ cho phần còn lại.', t:'Tạm ngừng đặt thêm.' });
  });
  const miss = Object.keys(missing);
  if (miss.length) al.push({ lvl:'y', w:0, price:1, b:miss.length + ' vật tư chưa có giá', t:'(' + miss.slice(0, 3).join(', ') + (miss.length > 3 ? '…' : '') + ').' });
  al.sort((a, b) => (a.lvl === b.lvl ? 0 : a.lvl === 'r' ? -1 : 1) || b.w - a.w);

  const sum = a => a.reduce((s, v) => s + v, 0), r1 = v => Math.round(v * 10) / 10;
  const all = Object.keys(items).map(k => items[k]);
  const buyList = all.filter(it => it.nhapV > 0).sort((a, b) => b.nhapV - a.nhapV)
    .map(it => ({ n:it.name, u:it.unit, g:grp(it), q:r1(it.nhap), v:Math.round(it.nhapV) }));
  const stockList = all.filter(it => it.stock > 0).map(it => ({ n:it.name, u:it.unit, g:grp(it), q:r1(it.stock), v:Math.round(it.stock * cur(it.id)) }))
    .sort((a, b) => b.v - a.v || b.q - a.q);
  const needList = rows.filter(r => r.remain > 0.05).map(r => ({ n:r.name, u:r.unit, mode:r.mode, remain:r1(r.remain), stock:r1(r.stock), need:r1(r.need), v:r.needVal, up:Math.round(r.up) }))
    .sort((a, b) => b.v - a.v || b.need - a.need);
  return { success:true, buyList:buyList, buyNoPrice:all.filter(it => it.nhap > 0 && !(it.nhapV > 0)).length, stockList:stockList, needList:needList, project:P, today:Utilities.formatDate(new Date(), TZ, 'd/M/yyyy'),
    bought:r0(bought), boughtT:Math.round(sum(bought)), stock:r0(stockV), stockT:Math.round(sum(stockV)),
    need:Math.round(rows.reduce((s, r) => s + r.needVal, 0)), needParts:hm.filter(h => pct[h.name] < 1).map(h => h.name + ' còn ' + vnNum_(h.total - h.done, 1) + ' ' + h.unit),
    prog:prog, matPct:matPct, planVal:Math.round(planVal), boughtPlan:Math.round(boughtPlan), hangMuc:hm,
    weeks:weeks, months:months, alerts:al.slice(0, 6), missing:miss.length,
    rows:rows.map(r => ({ name:r.name, unit:r.unit, mode:r.mode, actual:Math.round(r.actual * 10) / 10, expect:Math.round(r.expect * 10) / 10,
      value:r.value, dev:r.dev === null ? null : Math.round(r.dev * 1000) / 1000, need:Math.round(r.need * 10) / 10 })) };
}

function getPrices(u, d) {
  if (!COST_ROLES[u.role] && !(NEW_ROLES[u.role] && can_(u, 'chiPhi'))) return { success:false, forbidden:true, error:'Bạn không có quyền xem giá vật tư' };
  const P = String(d.project || ''); mustAllow(u, P);
  const prices = loadPrices_(P), nCount = {};
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  (gd ? readRows(gd, 7) : []).forEach(r => { if (String(r[6]) === P && String(r[1]) === 'nhap') nCount[String(r[2])] = (nCount[String(r[2])] || 0) + 1; });
  return { success:true, project:P, canEdit:RANK[u.role] >= RANK.ql, today:Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'),
    items:projItems_(P).map(it => Object.assign(it, { nhap:nCount[it.id] || 0,
      hist:(prices[it.id] || []).map(x => ({ price:x.price, from:x.from, note:x.note, byName:x.byName, at:x.at })).reverse() })) };
}

function setPrice(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const m = String(d.from || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) fail('Ngày áp dụng không hợp lệ');
  const from = (+m[3]) + '/' + (+m[2]) + '/' + m[1];
  const list = Array.isArray(d.list) ? d.list : [];
  if (!list.length || list.length > 200) fail('Chưa chọn vật tư');
  const items = {}; projItems_(P).forEach(it => items[it.id] = it);
  const sh = sheetOf(PRICE.sheet, PRICE.head), note = clean(String(d.note || ''), 200), at = nowTxt();
  let seq = Date.now() * 100;
  const rows = list.map(x => {
    const it = items[String(x.itemId)]; if (!it) fail('Vật tư không thuộc dự án này');
    const price = Math.round(+x.price || 0);
    if (!(price > 0) || price > 1e12) fail('Giá không hợp lệ: ' + it.name);
    return [seq++, P, it.id, it.name, price, from, note, u.name, at].map(toCell);
  });
  sh.getRange(Math.max(sh.getLastRow(), 1) + 1, 1, rows.length, PRICE.cols.length).setValues(rows);
  writeLog(u, 'Đặt giá vật tư', P + ': ' + (rows.length === 1 ? rows[0][3].replace(/^'/, '') + ' = ' + vnNum_(+list[0].price) + ' đ' : rows.length + ' vật tư') + ' từ ' + from);
  return { success:true };
}

function setProgress(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const sh = sheetOf(HANGMUC.sheet, HANGMUC.head), rows = readRows(sh, HANGMUC.cols.length);
  const list = Array.isArray(d.list) ? d.list : [], changed = [];
  list.forEach(x => {
    const i = rows.findIndex(r => String(r[0]) === String(x.id) && String(r[1]) === P); if (i < 0) fail('Không tìm thấy hạng mục');
    const done = +x.done, total = +rows[i][4] || 0;
    if (!(done >= 0) || (total > 0 && done > total)) fail('Số đã làm của "' + rows[i][2] + '" phải từ 0 đến ' + total);
    if (done === +rows[i][3]) return;
    sh.getRange(i + 2, 4, 1, 1).setValue(done);
    sh.getRange(i + 2, 7, 1, 2).setValues([[toCell(u.name), toCell(nowTxt())]]);
    changed.push(rows[i][2] + ' ' + vnNum_(done, 1) + '/' + vnNum_(total, 1));
  });
  if (changed.length) writeLog(u, 'Cập nhật tiến độ', P + ': ' + changed.join(', '));
  return { success:true };
}

// ---- Nạp kế hoạch, tiến độ, giá ban đầu cho dự án DA TTHC Quận 2 (chạy 1 lần trong trình soạn thảo) ----
const TTHC_SEED = {"hangMuc": [["Cọc khoan nhồi", 352, 366, "cọc"], ["Tường vây", 117, 117, "panel"], ["Tường dẫn", 642.3, 642.3, "m"]], "lines": [{"name": "Thép D32", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D32 x 11,7m", "f": 0.0738661, "hm": "Tường vây"}, {"n": "Thép cây D32 x 7,5m", "f": 0.0473501, "hm": "Tường vây"}], "plan": {"Tường vây": 1319.651}}, {"name": "Thép D25", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D25 x 11,7m", "f": 0.0450843}, {"n": "Thép cây D25 x 8,18m", "f": 0.0315205}], "plan": {"Cọc khoan nhồi": 528.028, "Tường vây": 129.676}}, {"name": "Thép D20", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D20 x 11,7m", "f": 0.028854}, {"n": "Thép cây D20 x 7,05m", "f": 0.0173864}], "plan": {"Cọc khoan nhồi": 337.939, "Tường vây": 281.95}}, {"name": "Thép D10", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D10 x 11,7m", "f": 0.0072135}], "plan": {"Cọc khoan nhồi": 225.794, "Tường vây": 62.671, "Tường dẫn": 12.108}}, {"name": "Thép D12", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D12 x 11,7m", "f": 0.0103874, "hm": "Tường vây"}], "plan": {"Tường vây": 164.283}}, {"name": "Thép D16", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D16 x 11,7m", "f": 0.0184665}], "plan": {"Cọc khoan nhồi": 117.903, "Tường vây": 43.81}}, {"name": "Thép D18", "unit": "tấn", "mode": "tk", "items": [{"n": "Thép cây D18 x 11,7m", "f": 0.0233717}], "plan": {"Cọc khoan nhồi": 95.167}}, {"name": "Ống siêu âm D60", "unit": "m", "mode": "tk", "items": [{"n": "Ống thép D60 x 11m", "f": 11}, {"n": "Ống 59.9x1.8 X 6000M", "f": 0.358359}, {"n": "Ống 59.9x2.0 x 6000M", "f": 0.35014}], "plan": {"Cọc khoan nhồi": 35058.1, "Tường vây": 15820}}, {"name": "Ống quan trắc D114", "unit": "m", "mode": "tk", "items": [{"n": "Ống thép D114 x 6m", "f": 6}], "plan": {"Cọc khoan nhồi": 446.9, "Tường vây": 588}}, {"name": "Cóc nối (mọi cỡ)", "unit": "bộ", "mode": "tk", "items": [{"n": "Cóc nối thép D16", "f": 1}, {"n": "Cóc nối thép D20", "f": 1}, {"n": "Cóc nối thép D25", "f": 1}, {"n": "Cóc nối thép D28", "f": 1, "hm": "Tường vây"}, {"n": "Cóc nối thép D32", "f": 1, "hm": "Tường vây"}], "plan": {"Cọc khoan nhồi": 26792, "Tường vây": 17464}}, {"name": "Băng cản nước", "unit": "m", "mode": "tk", "items": [{"n": "Waterbar O250 x 22m", "f": 22, "hm": "Tường vây"}], "plan": {"Tường vây": 1152.45}}, {"name": "Dầu DO", "unit": "lít", "mode": "dm", "items": [{"n": "Dầu DO", "f": 1}], "plan": {"Cọc khoan nhồi": 323723, "Tường vây": 163899}}], "prices": [["Thép cây D32 x 11,7m", 1146181], ["Thép cây D32 x 7,5m", 734731], ["Thép cây D25 x 11,7m", 699573], ["Thép cây D25 x 8,18m", 489103], ["Thép cây D20 x 11,7m", 447727], ["Thép cây D20 x 7,05m", 269784], ["Thép cây D10 x 11,7m", 111932], ["Thép cây D12 x 11,7m", 161182], ["Thép cây D16 x 11,7m", 286545], ["Thép cây D18 x 11,7m", 362659], ["Ống thép D60 x 11m", 577628], ["Ống 59.9x1.8 X 6000M", 18818], ["Ống 59.9x2.0 x 6000M", 18818], ["Ống thép D114 x 6m", 597012], ["Dầu DO", 30020], ["Cóc nối thép D16", 21750], ["Cóc nối thép D20", 21750], ["Cóc nối thép D25", 21750], ["Cóc nối thép D28", 21750], ["Cóc nối thép D32", 21750]]};
function NAP_keHoachTTHC() {
  const out = withLock(() => napKeHoach_(NAP_DU_AN, TTHC_SEED));
  Logger.log(out.join('\n'));
  return out;
}
function napKeHoach_(P, S) {
  const log = [], items = {}; projItems_(P).forEach(it => items[nameKey_(it.name)] = it);
  if (!Object.keys(items).length) fail('Dự án "' + P + '" chưa có vật tư – hãy chạy NAP_duLieuExcel trước');
  const replace = (T, rows) => {
    const sh = sheetOf(T.sheet, T.head), n = sh.getLastRow() - 1;
    const keep = n > 0 ? sh.getRange(2, 1, n, T.cols.length).getValues().filter(r => r[0] !== '' && String(r[1]) !== P) : [];
    if (n > 0) sh.getRange(2, 1, n, T.cols.length).clearContent();
    const all = keep.map(r => r.map(toCell)).concat(rows.map(o => T.cols.map(c => toCell(o[c] === undefined ? '' : o[c]))));
    if (all.length) sh.getRange(2, 1, all.length, T.cols.length).setValues(all);
  };
  let seq = Date.now() * 100; const at = nowTxt();
  replace(HANGMUC, S.hangMuc.map(h => ({ id:seq++, project:P, name:h[0], done:h[1], total:h[2], unit:h[3], byName:'Nạp ban đầu', at:at })));
  const lost = [];
  replace(PLAN, S.lines.map(L => {
    L.items.forEach(x => { if (!items[nameKey_(x.n)]) lost.push(x.n); });
    return { id:seq++, project:P, name:L.name, unit:L.unit, mode:L.mode, items:JSON.stringify(L.items), plan:JSON.stringify(L.plan), note:'Theo bảng giá chốt lần 2 (bản vẽ 04/06/2026)' };
  }));
  const pr = [];
  S.prices.forEach(x => { const it = items[nameKey_(x[0])]; if (!it) { lost.push(x[0]); return; }
    pr.push({ id:seq++, project:P, itemId:it.id, itemName:it.name, price:x[1], from:'29/5/2026', note:'Theo dự toán – Quản lý cần xác nhận giá mua thực tế', byName:'Nạp ban đầu', at:at }); });
  replace(PRICE, pr);
  log.push('✔ ' + S.hangMuc.length + ' hạng mục, ' + S.lines.length + ' dòng kế hoạch, ' + pr.length + ' giá vật tư');
  if (lost.length) log.push('⚠ Không tìm thấy vật tư: ' + lost.join(', '));
  bumpVersion();
  writeLog(null, 'Nạp kế hoạch & giá', P + ': ' + log[0].replace('✔ ', ''));
  return log;
}

// =====================================================================
// v5.13.0 — PHIẾU YÊU CẦU CẤP VẬT TƯ · ĐỊNH MỨC CÓC THEO CẤU KIỆN · KIỂM KÊ LÀM MỐC · TELEGRAM
// =====================================================================
const NEW_ROLES = { cht:1, chp:1, ktv:1 };
const PERM_KEYS = ['tao','bs','duyet','nhan','xemMoi','ton','tienDo','chiPhi'];
const PERM_DEFAULT = {
  cht: { tao:1, bs:1, duyet:1, nhan:1, xemMoi:1, ton:1, tienDo:1, chiPhi:1 },
  chp: { tao:1, bs:1, duyet:1, nhan:1, xemMoi:1, ton:1, tienDo:1, chiPhi:0 },
  ktv: { tao:1, bs:1, duyet:0, nhan:1, xemMoi:1, ton:1, tienDo:0, chiPhi:0 }
};
const REQ = { sheet:'PhieuYC',
  cols:['id','project','kind','ckId','ckName','may','title','lines','opt','bs','note','status','duyet','duyetBy','duyetAt',
        'reject','createdBy','createdByName','createdRole','datetime','clientTime','log','test'],
  head:['Số phiếu YC','Dự án','Loại (coc / vt)','Mã cấu kiện','Cấu kiện','Máy sử dụng','Tiêu đề','Dòng vật tư (JSON)','Tùy chọn (JSON)',
        'Bổ sung (JSON)','Ghi chú','Trạng thái','Duyệt','Người duyệt','Lúc duyệt','Lý do từ chối','Người lập (ID)','Người lập','Chức danh',
        'Giờ máy chủ','Giờ trên máy','Lịch sử (JSON)','Phiếu thử'] };
const CK = { sheet:'CauKien',
  cols:['id','project','hm','name','loai','banVe','fixed','optKind','optN','note'],
  head:['ID','Dự án','Hạng mục (coc / tv)','Tên cấu kiện','Loại','Bản vẽ','Định mức cố định (JSON cỡ → số cóc)',
        'Tùy chọn (coc = thép chờ / tv = mối trong phân đoạn)','Số cóc mức 50% (tv)','Ghi chú'] };
const REQ_ST = { cho:'Chờ kho cấp', gui:'Đang gửi', chohang:'Chờ hàng', xong:'Hoàn thành', tuchoi:'Từ chối', huy:'Đã hủy' };
const OPT_COC = [[0,'không nối cóc'],[4,'4 cóc D25'],[8,'8 cóc D25']];
const OPT_TV  = ['không nối cóc','50% thanh nối cóc','100% thanh nối cóc'];

function props_() { return PropertiesService.getScriptProperties(); }
function jget_(k, def) { try { const v = props_().getProperty(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
function jset_(k, v) { props_().setProperty(k, JSON.stringify(v)); }
function rolePerm_() {
  const saved = jget_('rolePerm', {}), out = {};
  Object.keys(PERM_DEFAULT).forEach(r => { out[r] = Object.assign({}, PERM_DEFAULT[r], saved[r] || {}); });
  return out;
}
function can_(u, key) {
  if (u.role === 'admin' || u.role === 'ql') return true;
  if (!NEW_ROLES[u.role]) return false;
  return !!rolePerm_()[u.role][key];
}
function projCfg_(P) { const all = jget_('projCfg', {}); return Object.assign({ haoHut:0 }, all[P] || {}); }
function jparse_(s, d) { try { return s === '' || s === undefined || s === null ? d : JSON.parse(String(s)); } catch (e) { return d; } }
// 'HH:mm:ss d/M/yyyy' (giờ VN) → mili giây
function tms_(s) {
  const m = String(s || '').match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return 0;
  return Date.UTC(+m[6], +m[5] - 1, +m[4], +m[1] - 7, +m[2], +(m[3] || 0));
}
function shortName_(u) { return String(u.name || '').trim().split(/\s+/).pop(); }

// ---------- Mốc kiểm kê ----------
// kkMoc = { itemId: mili giây của lần kiểm kê gần nhất }. Phiếu có giờ <= mốc không làm đổi tồn kho.
function kkMoc_() { return jget_('kkMoc', {}); }
function mocOf_(itemId) { return +kkMoc_()[String(itemId)] || 0; }
function afterMoc_(itemId, datetime) { const m = mocOf_(itemId); return !m || tms_(datetime) > m; }
function rebuildMoc_(itemIds) {
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  const rows = gd ? readRows(gd, TXN.cols.length) : [], moc = kkMoc_();
  itemIds.forEach(id => {
    let best = 0;
    rows.forEach(r => { if (String(r[1]) === 'kiemke' && String(r[2]) === String(id)) best = Math.max(best, tms_(fromCell(r[9]))); });
    if (best) moc[String(id)] = best; else delete moc[String(id)];
  });
  jset_('kkMoc', moc);
}
function addCount(u, d0) {
  const list = Array.isArray(d0.items) ? d0.items : [];
  if (!list.length) fail('Chưa nhập số đếm nào');
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), rows = readRows(tk, T.cols.length);
  const gd = sheetOf(TXN.sheet, TXN.head), now = nowTxt(), moc = kkMoc_(), out = [], note = clean(String(d0.note || ''), 300);
  let k = 0;
  list.forEach(x => {
    const i = rows.findIndex(r => String(r[0]) === String(x.itemId));
    if (i < 0) fail('Vật tư không tồn tại');
    mustAllow(u, String(rows[i][6]));
    const q = Math.round((+x.qty) * 1000) / 1000;
    if (!(q >= 0) || String(x.qty) === '') fail('Số đếm của "' + rows[i][1] + '" không hợp lệ');
    const app = +rows[i][4] || 0;
    const row = { id: Date.now() * 100 + (k++), type:'kiemke', itemId: rows[i][0], itemName: String(rows[i][1]), qty: q, unit: String(rows[i][3]),
      project: String(rows[i][6]), supplierOrReceiver:'', thietBi:'', datetime: now, note: note || (d0.reqId ? 'Kiểm kê khi cấp ' + clean(String(d0.reqId), 30) : ''),
      reason: 'Kiểm kê thực tế · trên app ' + app + ' → đếm ' + q, refId: d0.reqId ? clean(String(d0.reqId), 30) : '',
      createdBy: u.id, createdByName: u.name, clientTime: String(d0.clientTime || '').slice(0, 40) };
    gd.appendRow(TXN.cols.map(c => toCell(row[c])));
    tk.getRange(i + 2, 5).setValue(q);
    rows[i][4] = q;
    moc[String(rows[i][0])] = tms_(now);
    out.push({ itemId: rows[i][0], name: String(rows[i][1]), app: app, dem: q, id: row.id });
  });
  jset_('kkMoc', moc);
  writeLog(u, 'Kiểm kê', out.map(o => o.name + ': ' + o.app + ' → ' + o.dem).join(', '));
  return { success:true, counted: out, datetime: now };
}

// ---------- Cấu hình (Admin) ----------
function setRolePerm(u, d) {
  const cur = rolePerm_(), r = String(d.role || ''), k = String(d.key || '');
  if (!NEW_ROLES[r] || PERM_KEYS.indexOf(k) < 0) fail('Quyền không hợp lệ');
  cur[r][k] = d.value ? 1 : 0; jset_('rolePerm', cur);
  writeLog(u, 'Đổi quyền chức danh', ROLE_NAME[r] + ' · ' + k + ' = ' + (d.value ? 'có' : 'không'));
  return { success:true, rolePerm: cur };
}
function setProjCfg(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const all = jget_('projCfg', {}), c = Object.assign({ haoHut:0 }, all[P] || {});
  if (d.haoHut !== undefined) { const h = +d.haoHut; if (!(h >= 0 && h <= 50)) fail('Hao hụt từ 0 đến 50%'); c.haoHut = Math.round(h * 10) / 10; }
  all[P] = c; jset_('projCfg', all);
  writeLog(u, 'Cài đặt dự án', P + ': hao hụt cóc ' + c.haoHut + '%');
  return { success:true, cfg: c };
}
function setItemFlags(u, d) {
  const T = TABLES.items, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length);
  const ids = (Array.isArray(d.ids) ? d.ids : []).map(String), ci = T.cols.indexOf('capThang'), mi = T.cols.indexOf('canMay');
  const names = [];
  rows.forEach((r, i) => {
    if (ids.indexOf(String(r[0])) < 0) return;
    mustAllow(u, String(r[6]));
    if (d.capThang !== undefined) sh.getRange(i + 2, ci + 1).setValue(d.capThang ? 1 : 0);
    if (d.canMay !== undefined) sh.getRange(i + 2, mi + 1).setValue(d.canMay ? 1 : 0);
    names.push(r[1]);
  });
  if (names.length) writeLog(u, 'Đổi cách cấp vật tư', names.slice(0, 20).join(', ') +
    (d.capThang !== undefined ? ' → ' + (d.capThang ? 'cấp thẳng' : 'qua phiếu') : '') + (d.canMay !== undefined ? ' → ' + (d.canMay ? 'phải chọn máy' : 'không cần máy') : ''));
  return { success:true };
}
function defaultFlags_(cat, name) {
  const n = String(name || '');
  return {
    capThang: (cat === 'thep' || cat === 'ongSieuAm' || /bentonite|kẽm|(^|\s)đai(?!\s*ốc)(\s|$)/i.test(n)) ? 1 : 0,
    canMay: (cat === 'nhienLieu' || cat === 'gau' || /khớp nối nhanh/i.test(n)) ? 1 : 0
  };
}
function migrateFlags513_() {
  if (props_().getProperty('flags513')) return;
  const T = TABLES.items, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length);
  const ci = T.cols.indexOf('capThang');
  if (rows.length) sh.getRange(2, ci + 1, rows.length, 2).setValues(rows.map(r => {
    const f = defaultFlags_(String(r[2]), String(r[1]));
    return [r[ci] === '' ? f.capThang : r[ci], r[ci + 1] === '' ? f.canMay : r[ci + 1]];
  }));
  props_().setProperty('flags513', '1');
}

// ---------- Cấu kiện & định mức ----------
function ckRows_(P) { return readTable_(CK, P); }
function cocItem_(items, size) {          // vật tư "Cóc nối thép D25" trong kho dự án
  const re = new RegExp('\\b' + size + '\\b', 'i');
  return items.find(r => /cóc/i.test(String(r[1])) && re.test(String(r[1])));
}
function NAP_dinhMucTTHC() {
  const out = withLock(() => {
    const P = NAP_DU_AN, S = TTHC_CK_SEED, sh = sheetOf(CK.sheet, CK.head);
    const keep = readRows(sh, CK.cols.length).filter(r => r[0] !== '' && String(r[1]) !== P).map(r => rowToObj(CK.cols, r));
    const rows = [];
    Object.keys(S.coc).forEach(t => {
      const c = S.coc[t];
      for (let k = 1; k <= c[0]; k++) rows.push({ id:'CK|' + t + '.' + k, project:P, hm:'coc', name:t + '.' + k, loai:'Cọc loại ' + t.slice(1),
        banVe:'TTHC-FCS-' + c[1], fixed:JSON.stringify(c[2]), optKind:'coc', optN:4, note:'' });
    });
    S.tv.forEach(p => rows.push({ id:'CK|' + p[0], project:P, hm:'tv', name:p[0], loai:p[4] + ' · ' + p[1] + ' thanh ngoài, ' + p[2] + ' trong',
      banVe:'TTHC-FCS-SD-' + p[3], fixed:JSON.stringify({ D20:p[1], D32:p[2] }), optKind:'tv', optN:p[1] + p[2], note:'' }));
    writeAll(sh, CK.cols, keep.concat(rows));
    bumpVersion();
    return 'Đã nạp ' + rows.length + ' cấu kiện cho ' + P;
  });
  Logger.log(out); return out;
}
// Tính số cóc theo cấu kiện (máy chủ tự tính, không tin số từ điện thoại)
function ckLines_(ck, optChoice, haoHut) {
  const fixed = jparse_(ck.fixed, {}), add = {};
  if (String(ck.optKind) === 'coc') add.D25 = OPT_COC[optChoice][0];
  else add.D32 = [0, +ck.optN || 0, 2 * (+ck.optN || 0)][optChoice];
  const sizes = {}; Object.keys(fixed).concat(Object.keys(add)).forEach(s => sizes[s] = 1);
  return Object.keys(sizes).sort().map(s => {
    const dm = +fixed[s] || 0, op = +add[s] || 0, hh = Math.ceil((dm + op) * (+haoHut || 0) / 100);
    return { size:s, dm:dm, opt:op, hh:hh, sum:dm + op + hh };
  }).filter(l => l.sum > 0);
}

// ---------- Phiếu yêu cầu ----------
function reqSheet_() { return sheetOf(REQ.sheet, REQ.head); }
function reqOut_(o) {
  ['lines','opt','bs','log'].forEach(k => o[k] = jparse_(o[k], k === 'lines' || k === 'log' ? [] : null));
  return o;
}
function loadReq_(id) {
  const sh = reqSheet_(), rows = readRows(sh, REQ.cols.length);
  const i = rows.findIndex(r => String(r[0]) === String(id));
  if (i < 0) fail('Không tìm thấy phiếu ' + id);
  return { sh: sh, i: i, r: reqOut_(rowToObj(REQ.cols, rows[i])) };
}
function saveReq_(sh, i, r) {
  const o = Object.assign({}, r);
  ['lines','opt','bs','log'].forEach(k => o[k] = o[k] === null || o[k] === undefined ? '' : JSON.stringify(o[k]));
  sh.getRange(i + 2, 1, 1, REQ.cols.length).setValues([REQ.cols.map(c => toCell(o[c] === undefined ? '' : o[c]))]);
}
function nextReqId_() {
  const n = (+props_().getProperty('pycSeq') || 0) + 1;
  props_().setProperty('pycSeq', String(n));
  return 'PYC-' + ('000' + n).slice(-4);
}
function remain_(r) { return r.lines.reduce((a, l) => a + Math.max(0, (+l.req || 0) - (+l.sent || 0)), 0); }

function createReq(u, d0) {
  const P = String(d0.project || ''); mustAllow(u, P);
  if (!(NEW_ROLES[u.role] || u.role === 'ql' || u.role === 'admin')) fail('Chỉ CHT, CHP, Kỹ thuật viên (hoặc Quản lý / Admin) tạo được phiếu yêu cầu');
  if (!can_(u, 'tao')) fail('Chức danh của bạn chưa được bật quyền tạo phiếu');
  const T = TABLES.items, items = readRows(sheetOf(T.sheet, T.head), T.cols.length).filter(r => r[0] !== '' && String(r[6]) === P);
  const ci = T.cols.indexOf('capThang'), mi = T.cols.indexOf('canMay');
  const kind = d0.kind === 'vt' ? 'vt' : 'coc', lines = [], now = nowTxt();
  let title = '', ckId = '', ckName = '', may = '', opt = null, bs = null;
  if (kind === 'coc') {
    const ck = ckRows_(P).find(c => String(c.id) === String(d0.ckId));
    if (!ck) fail('Không tìm thấy cấu kiện');
    ckId = String(ck.id); ckName = String(ck.name);
    const open = readTable_(REQ, P).filter(r => String(r.ckId) === ckId && r.status !== 'tuchoi' && r.status !== 'huy' && jparse_(r.opt, {}).base);
    const base = !open.length, map = {};
    if (base) {
      const ch = +d0.opt;
      if (!(ch === 0 || ch === 1 || ch === 2) || d0.opt === null || d0.opt === undefined || d0.opt === '')
        fail('Chọn mức cho ' + (ck.optKind === 'coc' ? 'thép chờ đầu cọc' : 'mối nối trong phân đoạn') + ' trước khi gửi');
      const hh = projCfg_(P).haoHut;
      ckLines_(ck, ch, hh).forEach(l => map[l.size] = { req:l.sum, br:'Định mức ' + l.dm + (l.hh ? ' + hao hụt ' + l.hh : '') + (l.opt ? ' + tùy chọn ' + l.opt : '') });
      opt = { base:1, kind:String(ck.optKind), choice:ch, text: ck.optKind === 'coc' ? 'Thép chờ đầu cọc: ' + OPT_COC[ch][1] : 'Mối nối trong phân đoạn: ' + OPT_TV[ch], haoHut:hh };
    } else opt = { base:0, text:'Xin bổ sung ngoài định mức (đã có ' + open[0].id + ')' };
    if (d0.bs) {
      if (!can_(u, 'bs')) fail('Chức danh của bạn chưa được bật quyền xin bổ sung');
      const q = Math.round(+d0.bs.qty || 0), size = String(d0.bs.size || '').toUpperCase(), why = clean(String(d0.bs.reason || ''), 60);
      if (!(q > 0)) fail('Số lượng bổ sung phải lớn hơn 0');
      if (!/^D\d{2}$/.test(size)) fail('Cỡ cóc bổ sung không hợp lệ');
      if (!why) fail('Chọn lý do xin bổ sung');
      const m = map[size] || { req:0, br:'' }; m.req += q; m.br = (m.br ? m.br + ' + ' : '') + 'bổ sung ' + q; map[size] = m;
      bs = { qty:q, size:size, reason:why, note:clean(String(d0.bs.note || ''), 200) };
    } else if (!base) fail('Cấu kiện ' + ckName + ' đã có phiếu ' + open[0].id + '. Bấm "Xin bổ sung" nếu cần thêm.');
    Object.keys(map).sort().forEach(s => {
      const it = cocItem_(items, s);
      if (!it) fail('Kho dự án chưa có vật tư cóc nối ' + s + ' — thêm vật tư trước');
      lines.push({ itemId:it[0], itemName:String(it[1]), unit:String(it[3]), req:map[s].req, sent:0, br:map[s].br });
    });
    title = (base ? 'Cóc nối · ' : 'Bổ sung cóc · ') + (ck.hm === 'coc' ? 'Cọc ' : 'Tấm ') + ckName;
  } else {
    const it = items.find(r => String(r[0]) === String(d0.itemId));
    if (!it) fail('Vật tư không có trong kho dự án');
    if (+it[ci] === 1) fail('"' + it[1] + '" cấp thẳng cho tổ đội, không cần phiếu');
    const q = Math.round((+d0.qty || 0) * 1000) / 1000; if (!(q > 0)) fail('Số lượng phải lớn hơn 0');
    if (+it[mi] === 1) {
      if (!d0.may) fail('Chọn máy sử dụng');
      if (d0.may === 'chung') { const why = clean(String(d0.mayNote || ''), 120); if (!why) fail('Ghi lý do dùng chung'); may = 'Dùng chung (' + why + ')'; }
      else may = clean(String(d0.may), 80);
    }
    lines.push({ itemId:it[0], itemName:String(it[1]), unit:String(it[3]), req:q, sent:0, br:'Nhập tay' + (may ? ' · ' + may : '') });
    title = String(it[1]) + (may ? ' · ' + may : '');
  }
  const auto = !NEW_ROLES[u.role] || u.role === 'cht' || u.role === 'chp';
  const r = { id:nextReqId_(), project:P, kind:kind, ckId:ckId, ckName:ckName, may:may, title:title, lines:lines, opt:opt, bs:bs,
    note:clean(String(d0.note || ''), 300), status:'cho', duyet: auto ? 'tudong' : 'chua', duyetBy:'', duyetAt:'', reject:'',
    createdBy:u.id, createdByName:u.name, createdRole:u.role, datetime:now, clientTime:String(d0.clientTime || '').slice(0, 40),
    log:[{ t:now, x:shortName_(u) + ' (' + (ROLE_NAME[u.role] || u.role) + ') tạo phiếu' + (auto ? ' · không cần duyệt' : '') }], test:'' };
  const sh = reqSheet_(); saveReq_(sh, readRows(sh, 1).length, r);
  writeLog(u, 'Tạo phiếu yêu cầu', r.id + ' · ' + title);
  const sum = lines.map(l => l.itemName.replace(/Cóc nối thép /i, 'Cóc ') + ': ' + l.req).join(', ');
  notify_(P, ['tk'].concat(auto ? [] : ['cht','chp']), [], u.id,
    '🔴 PHIẾU MỚI ' + r.id + '\n' + title + '\n' + sum + '\nNgười yêu cầu: ' + u.name + (auto ? '' : '\n⚠ Chờ CHT/CHP duyệt (kho vẫn cấp được)'));
  return { success:true, req:r };
}

function approveReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (!can_(u, 'duyet')) fail('Bạn không có quyền duyệt phiếu');
  if (r.duyet !== 'chua') return { success:true, duplicate:true, req:r };
  if (r.status === 'tuchoi' || r.status === 'huy') fail('Phiếu đã ' + REQ_ST[r.status].toLowerCase());
  const now = nowTxt(), after = r.status !== 'cho';
  r.duyet = after ? 'sau' : 'da'; r.duyetBy = u.name; r.duyetAt = now;
  r.log.push({ t:now, x:shortName_(u) + ' (' + ROLE_NAME[u.role] + ') ' + (after ? 'duyệt sau khi cấp' : 'duyệt') });
  saveReq_(x.sh, x.i, r);
  writeLog(u, 'Duyệt phiếu yêu cầu', r.id + (after ? ' (sau khi cấp)' : ''));
  return { success:true, req:r };
}

function rejectReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  const why = clean(String(d.reason || ''), 200);
  if (!why) fail('Nhập lý do từ chối');
  if (r.status !== 'cho' || r.lines.some(l => +l.sent > 0)) fail('Chỉ từ chối được phiếu chưa cấp');
  const kho = RANK[u.role] >= RANK.tk;
  if (!kho && !can_(u, 'duyet')) fail('Bạn không có quyền từ chối phiếu');
  const now = nowTxt();
  r.status = 'tuchoi'; r.reject = shortName_(u) + ' (' + ROLE_NAME[u.role] + '): ' + why;
  r.log.push({ t:now, x:shortName_(u) + ' (' + ROLE_NAME[u.role] + ') từ chối' });
  saveReq_(x.sh, x.i, r);
  writeLog(u, 'Từ chối phiếu yêu cầu', r.id + ': ' + why);
  notify_(r.project, [], [r.createdBy], u.id, '⛔ ' + r.id + ' bị từ chối\n' + r.title + '\nLý do: ' + why);
  return { success:true, req:r };
}

function cancelReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (r.status !== 'cho' || r.lines.some(l => +l.sent > 0)) fail('Chỉ hủy được phiếu chưa cấp');
  if (r.createdBy !== u.id && !can_(u, 'duyet')) fail('Chỉ người lập hoặc CHT/CHP hủy được phiếu');
  r.status = 'huy'; r.log.push({ t:nowTxt(), x:shortName_(u) + ' hủy phiếu' });
  saveReq_(x.sh, x.i, r); writeLog(u, 'Hủy phiếu yêu cầu', r.id);
  return { success:true, req:r };
}

// Kho cấp: trừ tồn ngay, tạo phiếu xuất tự động (cột "Phiếu gốc" = số phiếu YC)
function issueReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (['cho','gui','chohang'].indexOf(r.status) < 0) fail('Phiếu đã ' + (REQ_ST[r.status] || r.status).toLowerCase());
  const send = Array.isArray(d.send) ? d.send : [];
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), items = readRows(tk, T.cols.length);
  const gd = sheetOf(TXN.sheet, TXN.head), now = nowTxt(), made = [];
  const plan = r.lines.map((l, k) => {
    const q = Math.round((+send[k] || 0) * 1000) / 1000, rem = (+l.req || 0) - (+l.sent || 0);
    if (q < 0) fail('Số gửi không hợp lệ');
    if (q > rem + 1e-9) fail(l.itemName + ': gửi vượt số còn phải cấp (' + rem + ')');
    const i = items.findIndex(z => String(z[0]) === String(l.itemId));
    if (i < 0) fail('Vật tư ' + l.itemName + ' không còn trong kho');
    if (q > (+items[i][4] || 0) + 1e-9) fail('Không đủ tồn kho ' + l.itemName + ' (còn ' + (+items[i][4] || 0) + '). Kiểm kê nếu thực tế còn hàng.');
    return { k:k, q:q, i:i };
  });
  if (!plan.some(p => p.q > 0)) fail('Nhập số thực gửi');
  let n = 0;
  plan.forEach(p => {
    if (!p.q) return;
    const l = r.lines[p.k], it = items[p.i];
    const row = { id: Date.now() * 100 + (n++), type:'xuat', itemId: it[0], itemName: String(it[1]), qty: p.q, unit: String(it[3]), project: r.project,
      supplierOrReceiver: r.createdByName, thietBi: r.may || '', datetime: now,
      note: 'Theo ' + r.id + (r.ckName ? ' · ' + r.ckName : '') + (r.duyet === 'chua' ? ' · CHƯA được CHT/CHP duyệt' : ''),
      reason:'', refId: r.id, createdBy: u.id, createdByName: u.name, clientTime: '' };
    gd.appendRow(TXN.cols.map(c => toCell(row[c])));
    const v = Math.round(((+it[4] || 0) - p.q) * 100) / 100; tk.getRange(p.i + 2, 5).setValue(v); it[4] = v;
    l.sent = Math.round(((+l.sent || 0) + p.q) * 1000) / 1000; l.last = p.q; (l.px = l.px || []).push(String(row.id));
    made.push(row);
  });
  const partial = remain_(r) > 0;
  r.status = 'gui';
  r.log.push({ t:now, x:shortName_(u) + ' (Thủ kho) ' + (partial ? 'gửi một phần' : 'đã gửi') + (r.duyet === 'chua' ? ' khi chưa duyệt' : '') });
  saveReq_(x.sh, x.i, r);
  made.forEach(row => writeLog(u, 'Phiếu xuất', txnLogDetail(row)));
  notify_(r.project, [], [r.createdBy], u.id, '🚚 Kho đã gửi ' + r.id + (partial ? ' (MỘT PHẦN, phần thiếu chờ hàng)' : '') + '\n' + r.title +
    '\n' + made.map(m => m.itemName.replace(/Cóc nối thép /i, 'Cóc ') + ': ' + m.qty).join(', ') + '\nNhận hàng xong bấm "Đã nhận" trên app.');
  return { success:true, req:r, txns:made.map(m => TXN.cols.map(c => m[c])) };
}

// Bên yêu cầu xác nhận. recv[k] = số thực nhận của dòng k ở LẦN GỬI GẦN NHẤT (bỏ trống = nhận đủ). Phần thiếu hoàn kho bằng phiếu điều chỉnh.
function receiveReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (r.status !== 'gui') fail('Phiếu không ở trạng thái đang gửi');
  if (r.createdBy !== u.id && !can_(u, 'nhan')) fail('Bạn không có quyền xác nhận nhận hàng');
  const recv = Array.isArray(d.recv) ? d.recv : [], now = nowTxt(), adj = [], gd = sheetOf(TXN.sheet, TXN.head);
  const pend = {}; r.lines.forEach(l => { pend[l.itemId] = 0; });
  let n = 0;
  r.lines.forEach((l, k) => {
    const lastQ = +l.last || 0; l.last = 0;                 // số kho gửi ở lần gần nhất
    if (recv[k] === undefined || recv[k] === null || recv[k] === '') return;
    const got = Math.round((+recv[k]) * 1000) / 1000;
    if (!(got >= 0) || got > lastQ) fail(l.itemName + ': số thực nhận lần này phải từ 0 đến ' + lastQ);
    const diff = Math.round((lastQ - got) * 1000) / 1000;
    if (!diff) return;
    const ref = (l.px || []).slice(-1)[0] || '';
    const row = { id: Date.now() * 100 + 50 + (n++), type:'dieuchinh', itemId:l.itemId, itemName:l.itemName, qty: diff, unit:l.unit, project:r.project,
      supplierOrReceiver:'', thietBi:'', datetime:now, note:'Hoàn kho chờ thủ kho kiểm tra',
      reason:'Bên nhận báo thiếu ' + diff + ' theo ' + r.id + ' (' + u.name + ')', refId: ref, createdBy:u.id, createdByName:u.name, clientTime:'' };
    gd.appendRow(TXN.cols.map(c => toCell(row[c])));
    pend[l.itemId] += diff; l.sent = Math.round(((+l.sent || 0) - diff) * 1000) / 1000; adj.push(row);
  });
  if (adj.length) applyStock(pend);
  r.status = remain_(r) > 0 ? 'chohang' : 'xong';
  r.log.push({ t:now, x:shortName_(u) + ' (' + (ROLE_NAME[u.role] || u.role) + ') đã nhận' +
    (adj.length ? ' · báo thiếu: ' + adj.map(a => a.itemName.replace(/Cóc nối thép /i, 'Cóc ') + ' ' + a.qty).join(', ') : '') });
  saveReq_(x.sh, x.i, r);
  writeLog(u, 'Nhận hàng theo phiếu yêu cầu', r.id + (adj.length ? ' (báo thiếu)' : ''));
  if (adj.length || r.status === 'chohang')
    notify_(r.project, ['tk'], [], u.id, (r.status === 'chohang' ? '🟠 ' + r.id + ' còn thiếu, chờ hàng' : 'ℹ️ ' + r.id + ' đã nhận') +
      (adj.length ? '\nBên nhận báo thiếu: ' + adj.map(a => a.itemName + ' ' + a.qty).join(', ') + ' — đã hoàn kho, cần kiểm tra' : ''));
  return { success:true, req:r, txns:adj.map(m => TXN.cols.map(c => m[c])) };
}

// ---------- Telegram ----------
// Chủ Sheet: dán mã bot vào TELEGRAM_BOT_TOKEN rồi chạy hàm CAI_DAT_telegram một lần trong trình soạn thảo.
const TELEGRAM_BOT_TOKEN = '';
function tgToken_() { return props_().getProperty('TG_TOKEN') || ''; }
function tgCode_(uid) { return 'K' + sha('tg|' + uid).replace(/[^A-Za-z0-9]/g, '').slice(0, 10); }
function tgApi_(method, payload) {
  const tok = tgToken_(); if (!tok) return null;
  const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + tok + '/' + method,
    { method:'post', contentType:'application/json', payload:JSON.stringify(payload || {}), muteHttpExceptions:true });
  try { return JSON.parse(res.getContentText()); } catch (e) { return null; }
}
function CAI_DAT_telegram() {
  const tok = String(TELEGRAM_BOT_TOKEN || '').trim();
  if (!tok) { Logger.log('Dán mã bot (lấy từ @BotFather) vào hằng TELEGRAM_BOT_TOKEN ở đầu phần Telegram rồi chạy lại'); return; }
  props_().setProperty('TG_TOKEN', tok);
  const me = tgApi_('getMe', {});
  if (!me || !me.ok) { props_().deleteProperty('TG_TOKEN'); Logger.log('Mã bot không đúng: ' + JSON.stringify(me)); return; }
  props_().setProperty('TG_BOT', me.result.username);
  tgApi_('deleteWebhook', {});
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'tgPoll').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('tgPoll').timeBased().everyMinutes(1).create();
  Logger.log('Đã kết nối bot @' + me.result.username + '. Mỗi người mở app → Menu → Nhận cảnh báo Telegram để liên kết.');
}
// Chạy mỗi phút: nhận lệnh /start <mã> để liên kết tài khoản với Telegram
function tgPoll() {
  if (!tgToken_()) return;
  const off = +props_().getProperty('TG_OFFSET') || 0;
  const res = tgApi_('getUpdates', { offset: off, timeout: 0, allowed_updates:['message'] });
  if (!res || !res.ok || !res.result.length) return;
  let last = off;
  withLock(() => {
    const users = loadUsers(); let changed = false;
    res.result.forEach(up => {
      last = Math.max(last, up.update_id + 1);
      const m = up.message; if (!m || !m.text) return;
      const chat = String(m.chat.id), code = (String(m.text).match(/^\/start\s+(\S+)/) || [])[1];
      const u = code ? users.find(x => x.status === 'active' && tgCode_(x.id) === code) : null;
      if (u) { u.tgChat = chat; changed = true; tgApi_('sendMessage', { chat_id:chat, text:'✅ Đã liên kết FECON Kho với tài khoản ' + u.name + '. Bạn sẽ nhận cảnh báo phiếu yêu cầu tại đây.' }); }
      else tgApi_('sendMessage', { chat_id:chat, text:'Mở app FECON Kho → Menu → "Nhận cảnh báo Telegram" và bấm nút liên kết để kết nối.' });
    });
    if (changed) saveUsers(users);
  });
  props_().setProperty('TG_OFFSET', String(last));
}
// Gửi tin cho người trong dự án theo vai trò (roles) và/hoặc theo ID (ids); không gửi cho người thao tác
function notify_(P, roles, ids, exceptId, text) {
  try {
    const tok = tgToken_(); if (!tok) return;
    const all = loadUsers().filter(x => x.status === 'active' && x.tgChat && x.id !== exceptId &&
      (ids.indexOf(x.id) >= 0 || (roles.indexOf(x.role) >= 0 && allowedProjects(x).indexOf(P) >= 0)));
    if (!all.length) return;
    UrlFetchApp.fetchAll(all.map(x => ({ url:'https://api.telegram.org/bot' + tok + '/sendMessage', method:'post', contentType:'application/json',
      payload:JSON.stringify({ chat_id:x.tgChat, text:'[' + P + ']\n' + text }), muteHttpExceptions:true })));
  } catch (e) { writeLog(null, 'Lỗi gửi Telegram', String(e && e.message || e)); }
}
function tgUnlink(u) {
  const users = loadUsers(), t = users.find(x => x.id === u.id);
  t.tgChat = ''; saveUsers(users);
  return { success:true };
}
function tgTest(u) {
  if (!u.tgChat) fail('Tài khoản chưa liên kết Telegram');
  const r = tgApi_('sendMessage', { chat_id:u.tgChat, text:'🔔 Thử cảnh báo FECON Kho: kết nối hoạt động tốt.' });
  if (!r || !r.ok) fail('Gửi không được — mở Telegram, tìm bot và bấm Start lại');
  return { success:true, duplicate:true };
}

// ---------- Gửi kèm getAll ----------
function reqBundle_(u, P) {
  const perm = rolePerm_();
  let reqs = readTable_(REQ, P).map(reqOut_);
  if (NEW_ROLES[u.role] && !perm[u.role].xemMoi) reqs = reqs.filter(r => r.createdBy === u.id);
  const ck = ckRows_(P).map(c => [String(c.id), String(c.hm), String(c.name), String(c.loai), String(c.banVe), String(c.fixed), String(c.optKind), +c.optN || 0]);
  const bot = props_().getProperty('TG_BOT') || '';
  return { reqs:reqs, cauKien:ck, projCfg:projCfg_(P), rolePerm:perm, kkMoc:kkMoc_(),
    tg:{ bot:bot, linked:!!u.tgChat, link: bot ? 'https://t.me/' + bot + '?start=' + tgCode_(u.id) : '' } };
}

// Cấu kiện dự án TTHC (đọc từ bản vẽ TTHC-FCS-SD-13…16 và DW-011…048): cọc theo loại [số cọc, bản vẽ, cóc cố định]; tấm [tên, thanh ngoài, thanh trong, bản vẽ, loại tấm]
const TTHC_CK_SEED = {"coc":{"P1":[116,"SD-13",{"D25":32,"D20":32,"D16":16}],"P2":[3,"SD-14",{"D25":32,"D20":32,"D16":16}],"P3":[240,"SD-15",{"D25":32,"D20":32,"D16":8}],"P4":[7,"SD-16",{"D25":32,"D20":32}]},"tv":[["P1",39,31,"DW-043","Tấm tiếp góc P1"],["P2",36,36,"DW-017","Tấm tiếp L=5.6m"],["P3",36,36,"DW-017","Tấm tiếp L=5.6m"],["P4",37,37,"DW-013","Tấm đóng L=5.6m"],["P5",36,36,"DW-017","Tấm tiếp L=5.6m"],["P6",36,36,"DW-017","Tấm tiếp L=5.6m"],["P7",36,36,"DW-017","Tấm tiếp L=5.6m"],["P8",36,36,"DW-017","Tấm tiếp L=5.6m"],["P9",36,36,"DW-017","Tấm tiếp L=5.6m"],["P10",20,20,"DW-027","Tấm tiếp L=3.3m"],["P11",35,31,"DW-045","Tấm tiếp góc P11"],["P12",36,36,"DW-017","Tấm tiếp L=5.6m"],["P13",34,34,"DW-011","Tấm mở L=5.6m"],["P14",36,36,"DW-017","Tấm tiếp L=5.6m"],["P15",36,36,"DW-017","Tấm tiếp L=5.6m"],["P16",36,36,"DW-017","Tấm tiếp L=5.6m"],["P17",36,36,"DW-017","Tấm tiếp L=5.6m"],["P18",36,36,"DW-017","Tấm tiếp L=5.6m"],["P19",36,36,"DW-017","Tấm tiếp L=5.6m"],["P20",36,36,"DW-017","Tấm tiếp L=5.6m"],["P21",36,36,"DW-017","Tấm tiếp L=5.6m"],["P22",36,36,"DW-017","Tấm tiếp L=5.6m"],["P23",36,36,"DW-017","Tấm tiếp L=5.6m"],["P24",37,37,"DW-013","Tấm đóng L=5.6m"],["P25",36,36,"DW-017","Tấm tiếp L=5.6m"],["P26",36,36,"DW-017","Tấm tiếp L=5.6m"],["P27",36,36,"DW-017","Tấm tiếp L=5.6m"],["P28",36,36,"DW-017","Tấm tiếp L=5.6m"],["P29",36,36,"DW-017","Tấm tiếp L=5.6m"],["P30",36,36,"DW-017","Tấm tiếp L=5.6m"],["P31",36,36,"DW-017","Tấm tiếp L=5.6m"],["P32",36,36,"DW-017","Tấm tiếp L=5.6m"],["P33",36,36,"DW-017","Tấm tiếp L=5.6m"],["P34",36,36,"DW-017","Tấm tiếp L=5.6m"],["P35",36,36,"DW-017","Tấm tiếp L=5.6m"],["P36",36,36,"DW-017","Tấm tiếp L=5.6m"],["P37",36,36,"DW-017","Tấm tiếp L=5.6m"],["P38",36,36,"DW-017","Tấm tiếp L=5.6m"],["P39",36,36,"DW-017","Tấm tiếp L=5.6m"],["P40",36,36,"DW-017","Tấm tiếp L=5.6m"],["P41",21,21,"DW-031","Tấm tiếp L=3.145m"],["P42",35,32,"DW-047","Tấm tiếp góc P42"],["P43",36,36,"DW-017","Tấm tiếp L=5.6m"],["P44",34,34,"DW-011","Tấm mở L=5.6m"],["P45",36,36,"DW-017","Tấm tiếp L=5.6m"],["P46",36,36,"DW-017","Tấm tiếp L=5.6m"],["P47",36,36,"DW-017","Tấm tiếp L=5.6m"],["P48",36,36,"DW-017","Tấm tiếp L=5.6m"],["P49",36,36,"DW-017","Tấm tiếp L=5.6m"],["P50",36,36,"DW-017","Tấm tiếp L=5.6m"],["P51",37,37,"DW-013","Tấm đóng L=5.6m"],["P52",35,35,"DW-019","Tấm tiếp L=5.547m"],["P53",35,33,"DW-041","Tấm tiếp góc P53"],["P54",36,36,"DW-017","Tấm tiếp L=5.6m"],["P55",36,36,"DW-017","Tấm tiếp L=5.6m"],["P56",36,36,"DW-017","Tấm tiếp L=5.6m"],["P57",28,28,"DW-021","Tấm tiếp L=4.448m"],["P58",35,29,"DW-039","Tấm tiếp góc P58"],["P59",21,21,"DW-025","Tấm tiếp L=3.457m"],["P60",36,36,"DW-017","Tấm tiếp L=5.6m"],["P61",36,36,"DW-017","Tấm tiếp L=5.6m"],["P62",36,36,"DW-017","Tấm tiếp L=5.6m"],["P63",36,36,"DW-017","Tấm tiếp L=5.6m"],["P64",36,36,"DW-017","Tấm tiếp L=5.6m"],["P65",36,36,"DW-017","Tấm tiếp L=5.6m"],["P66",34,34,"DW-011","Tấm mở L=5.6m"],["P67",36,36,"DW-017","Tấm tiếp L=5.6m"],["P68",36,36,"DW-017","Tấm tiếp L=5.6m"],["P69",36,36,"DW-017","Tấm tiếp L=5.6m"],["P70",36,36,"DW-017","Tấm tiếp L=5.6m"],["P71",36,36,"DW-017","Tấm tiếp L=5.6m"],["P72",37,37,"DW-013","Tấm đóng L=5.6m"],["P73",36,36,"DW-017","Tấm tiếp L=5.6m"],["P74",36,36,"DW-017","Tấm tiếp L=5.6m"],["P75",36,36,"DW-017","Tấm tiếp L=5.6m"],["P76",36,36,"DW-017","Tấm tiếp L=5.6m"],["P77",36,36,"DW-017","Tấm tiếp L=5.6m"],["P78",36,36,"DW-037","Tấm tiếp góc P78"],["P79",24,24,"DW-023","Tấm tiếp L=3.903m"],["P80",36,36,"DW-017","Tấm tiếp L=5.6m"],["P81",36,36,"DW-017","Tấm tiếp L=5.6m"],["P82",36,36,"DW-017","Tấm tiếp L=5.6m"],["P83",21,21,"DW-029","Tấm tiếp L=3.2m"],["P84",40,36,"DW-035","Tấm tiếp góc P84"],["P85",36,36,"DW-017","Tấm tiếp L=5.6m"],["P86",45,41,"DW-033","Tấm tiếp góc P86"],["P87",36,36,"DW-017","Tấm tiếp L=5.6m"],["P88",34,34,"DW-011","Tấm mở L=5.6m"],["P89",36,36,"DW-017","Tấm tiếp L=5.6m"],["P90",36,36,"DW-017","Tấm tiếp L=5.6m"],["P91",36,36,"DW-017","Tấm tiếp L=5.6m"],["P92",36,36,"DW-017","Tấm tiếp L=5.6m"],["P93",36,36,"DW-017","Tấm tiếp L=5.6m"],["P94",36,36,"DW-017","Tấm tiếp L=5.6m"],["P95",36,36,"DW-017","Tấm tiếp L=5.6m"],["P96",36,36,"DW-017","Tấm tiếp L=5.6m"],["P97",32,32,"DW-015","Tấm đóng L=4.8m"],["P98",36,36,"DW-017","Tấm tiếp L=5.6m"],["P99",36,36,"DW-017","Tấm tiếp L=5.6m"],["P100",36,36,"DW-017","Tấm tiếp L=5.6m"],["P101",36,36,"DW-017","Tấm tiếp L=5.6m"],["P102",36,36,"DW-017","Tấm tiếp L=5.6m"],["P103",36,36,"DW-017","Tấm tiếp L=5.6m"],["P104",36,36,"DW-017","Tấm tiếp L=5.6m"],["P105",34,34,"DW-011","Tấm mở L=5.6m"],["P106",36,36,"DW-017","Tấm tiếp L=5.6m"],["P107",36,36,"DW-017","Tấm tiếp L=5.6m"],["P108",36,36,"DW-017","Tấm tiếp L=5.6m"],["P109",36,36,"DW-017","Tấm tiếp L=5.6m"],["P110",36,36,"DW-017","Tấm tiếp L=5.6m"],["P111",36,36,"DW-017","Tấm tiếp L=5.6m"],["P112",36,36,"DW-017","Tấm tiếp L=5.6m"],["P113",36,36,"DW-017","Tấm tiếp L=5.6m"],["P114",36,36,"DW-017","Tấm tiếp L=5.6m"],["P115",36,36,"DW-017","Tấm tiếp L=5.6m"],["P116",36,36,"DW-017","Tấm tiếp L=5.6m"],["P117",36,36,"DW-017","Tấm tiếp L=5.6m"]]};
