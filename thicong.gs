// ===== FECON SOUTH - THI CÔNG · máy chủ TC 1.1.0 =====
// Chạy CHUNG dự án Apps Script với Kho (dán thành 1 tệp riêng tên "thicong" trong cùng dự án). Dùng chung:
//   tài khoản, phiên đăng nhập, chức danh + bảng quyền (thêm 7 quyền t_*), danh sách dự án, Telegram, sao lưu 23:00.
// Dữ liệu nằm trong cùng file Google Sheet, các trang tính bắt đầu bằng "TC_":
//   TC_CauKien (cọc / panel / cọc thử) · TC_BanGhi (mọi nhật ký, biên bản, kế hoạch, sự kiện…) · TC_Anh · TC_CauHinh
// Ghi của Thi công KHÔNG làm tăng số phiên bản dữ liệu của Kho (điện thoại Kho không phải tải lại).
// Thao tác: tcBoot · tcCk · tcList · tcSave · tcSign · tcDel · tcPhoto · tcGetPhoto · tcImportCk · tcCfgSave · tcKho · tcSeed · tcReset · tcAudit

const TC_VERSION = '1.5.1';   // 1.5.1 (FECON 5.49.2): tên kho công ty lấy từ cài đặt gdKho (đổi tên được) · 1.5.0 (FECON 5.39.0): thêm loại bản ghi kp = Hạ kingpost
const TC_PHOTO_FOLDER = 'FECON Thi công - Ảnh hiện trường';
const TC_CK = { sheet:'TC_CauKien',
  cols:['id','project','loai','code','type','x','y','kv','truc','meta','status','step','flag','statusAt','updatedAt'],
  head:['ID','Dự án','Loại (coc / tv / tp)','Mã cấu kiện','Loại thiết kế','X (VN2000, Bắc)','Y (VN2000, Đông)','Khu vực','Trục',
        'Thông số (JSON)','Trạng thái','Công đoạn gần nhất','Cờ (tt = có tồn tại)','Đổi trạng thái lúc','Cập nhật lúc'] };
const TC_REC = { sheet:'TC_BanGhi',
  cols:['id','project','ck','mod','status','ngay','data','by','byName','at','clientTime','sign','rev','test'],
  head:['ID bản ghi','Dự án','Cấu kiện','Loại bản ghi','Trạng thái','Ngày (ca)','Số liệu (JSON)','Người lập (ID)','Người lập','Giờ máy chủ',
        'Giờ trên máy','Xác nhận / lịch sử (JSON)','Lần sửa','Dữ liệu mẫu (1)'] };
const TC_PH = { sheet:'TC_Anh', cols:['id','project','recId','fileId','name','by','byName','at','test'],
  head:['ID ảnh','Dự án','ID bản ghi','ID file Drive','Tên file','Người chụp (ID)','Người chụp','Thời gian','Dữ liệu mẫu (1)'] };
const TC_CF = { sheet:'TC_CauHinh', cols:['project','key','value','byName','at'],
  head:['Dự án','Mục','Giá trị (JSON)','Người sửa','Lúc sửa'] };

// Tên loại bản ghi (dùng cho nhật ký, Telegram)
const TC_MOD = {
  dv:'Định vị', khoan:'Nhật ký khoan / cạp', hh:'Hình học hố', dd:'Dung dịch', moinoi:'Mối nối', truoc:'Kiểm tra trước đổ',
  lt:'Lồng thép', xe:'Xe bê tông', bt:'Đổ bê tông', kl:'Khối lượng', tn:'Thí nghiệm', ht:'Hiện trạng', nt:'Nghiệm thu',
  khbt:'Kế hoạch bê tông', kh:'Kế hoạch công việc', sk:'Sự kiện / NCR / RFI', hse:'An toàn HSE', qt:'Quan trắc',
  dt:'Đất / bùn thải', bg:'Bàn giao ca', bc:'Báo cáo ngày', bt_mau:'Mẫu bê tông', kp:'Hạ kingpost'
};
const TC_STEP = { dv:1, khoan:1, hh:1, dd:1, moinoi:1, truoc:1, lt:1, xe:1, bt:1 };     // công đoạn làm cấu kiện chuyển sang "đang làm"
const TC_ST_LABEL = { mo:'Đang mở', nhap:'Nháp', gui:'Chờ kiểm tra', xn:'Đã xác nhận', tra:'Trả về', duyet:'Đã duyệt', dong:'Đã đóng', huy:'Đã hủy' };
const TC_PERMS = ['t_xem','t_ghi','t_qa','t_cht','t_kh','t_qs','t_qt'];

// ---------- CỔNG VÀO (gọi từ route của Kho) ----------
function tcRoute_(action, d, u) {
  if (!hasP(u, 't_xem') && u.role !== 'ADM') return { success:false, forbidden:true, error:'Chức danh của bạn chưa được cấp quyền Thi công' };
  let P = String(d.project || '');
  if (!P && action === 'tcBoot') P = allowedProjects(u)[0] || '';
  if (P && action === 'tcBoot' && allowedProjects(u).indexOf(P) < 0) P = allowedProjects(u)[0] || P;
  const needP = action !== 'tcPing';
  if (needP) { if (!P) return { success:false, error:'Thiếu dự án' }; mustAllow(u, P); }
  const W = { tcSave:'t_ghi', tcDel:'t_ghi', tcPhoto:'t_ghi', tcImportCk:'t_qt', tcImportRecs:'t_qt', tcCfgSave:'t_qt', tcSeed:'ADM', tcReset:'ADM' };
  const need = W[action];
  if (need === 'ADM' && u.role !== 'ADM') return { success:false, forbidden:true, error:'Chỉ Admin làm được thao tác này' };
  if (need && need !== 'ADM' && !tcCan_(u, need)) return { success:false, forbidden:true, error:'Bạn chưa được cấp quyền: ' + tcPermName_(need) };
  switch (action) {
    case 'tcPing':     return { success:true, tv:TC_VERSION };
    case 'tcVer':      return { success:true, tv:tcVer_(P) };
    case 'tcBoot':     return tcBoot_(u, P, d);
    case 'tcCk':       return tcCk_(u, P, d);
    case 'tcAll':      return tcAll_(u, P, d);
    case 'tcRoles':    return tcRoles_(u);
    case 'tcList':     return tcList_(u, P, d);
    case 'tcGetPhoto': return tcGetPhoto_(u, P, d);
    case 'tcKho':      return tcKho_(u, P, d);
    case 'tcAudit':    return tcAudit_(u, P, d);
  }
  if (action === 'tcReset' || action === 'tcSeed') {             // sao lưu trước, ngoài khóa
    if (String(d.confirm || '') !== P) return { success:false, error:'Gõ đúng tên dự án để xác nhận' };
    if (action === 'tcReset') { try { runBackup_('Trước khi xóa dữ liệu Thi công ' + P + ' · ' + u.name); } catch (e) { if (!d.noBackup) return { success:false, error:'Không sao lưu được nên chưa xóa: ' + String(e && e.message || e).slice(0, 120) }; } }
  }
  const opKey = d.op ? 'TCOP_' + u.id + '_' + String(d.op).slice(0, 60) : '';
  const out = withLock(() => {
    if (opKey) { const old = CacheService.getScriptCache().get(opKey); if (old) { try { return Object.assign(JSON.parse(old), { repeat:true }); } catch (e) {} } }
    let r;
    switch (action) {
      case 'tcSave':     r = tcSave_(u, P, d); break;
      case 'tcSign':     r = tcSign_(u, P, d); break;
      case 'tcDel':      r = tcDel_(u, P, d); break;
      case 'tcPhoto':    r = tcPhoto_(u, P, d); break;
      case 'tcImportCk': r = tcImportCk_(u, P, d); break;
      case 'tcImportRecs': r = tcImportRecs_(u, P, d); break;
      case 'tcCfgSave':  r = tcCfgSave_(u, P, d); break;
      case 'tcSeed':     r = tcSeed_(u, P, d); break;
      case 'tcReset':    r = tcReset_(u, P, d); break;
      default: return { success:false, error:'Thao tác không hợp lệ: ' + action };
    }
    if (r.success && !r.same) r.tv = tcBump_(P);
    if (opKey && r.success) { try { const j = JSON.stringify(r); if (j.length < 90000) CacheService.getScriptCache().put(opKey, j, 21600); } catch (e) {} }
    return r;
  });
  flushTg_();
  return out;
}
function tcCan_(u, k) { return u.role === 'ADM' || hasP(u, k); }
function tcPermName_(k) { return ({ t_xem:'Xem Thi công', t_ghi:'Ghi nhật ký hiện trường', t_qa:'Xác nhận QA/QC · giải phóng Hold', t_cht:'Duyệt nội bộ (CHT)', t_kh:'Lập kế hoạch · phân công', t_qs:'QS · khối lượng & BOQ', t_qt:'Quản trị Thi công' })[k] || k; }

// ---------- TIỆN ÍCH ----------
function tcVerMap_() { return jget_('tcVer', {}); }
function tcVer_(P) { return +tcVerMap_()[P] || 1; }
function tcBump_(P) { const m = tcVerMap_(); m[P] = (+m[P] || 1) + 1; jset_('tcVer', m); return m[P]; }
function tcSheet_(T) { return sheetOf(T.sheet, T.head); }
function tcRows_(T, P) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(T.sheet);
  if (!sh) return [];
  return readRows(sh, T.cols.length).map((r, i) => { const o = rowToObj(T.cols, r); o._i = i; return o; })
    .filter(o => o[T.cols[0]] !== '' && (!P || String(o.project) === P));
}
function tcJ_(s, d) { try { return s === '' || s === undefined || s === null ? d : JSON.parse(String(s)); } catch (e) { return d; } }
function tcRecOut_(o) {
  return { id:String(o.id), ck:String(o.ck || ''), mod:String(o.mod), st:String(o.status), ngay:String(o.ngay || ''), d:tcJ_(o.data, {}),
    by:String(o.by), byName:String(o.byName), at:String(o.at), ct:String(o.clientTime || ''), sign:tcJ_(o.sign, []), rev:+o.rev || 1, test:+o.test || 0 };
}
function tcCkOut_(o) {
  return [String(o.code), String(o.loai), String(o.type), +o.x || 0, +o.y || 0, String(o.kv || ''), String(o.truc || ''),
    String(o.status || 'cl'), String(o.step || ''), String(o.flag || ''), tcJ_(o.meta, {})];
}
function tcToday_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); }
function tcDayAdd_(ymd, n) { const t = new Date(ymd + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); }
function tcCfgAll_(P) {
  const o = {};
  tcRows_(TC_CF, P).forEach(r => { o[String(r.key)] = tcJ_(r.value, null); });
  return o;
}
function tcCleanData_(v, depth) {                                // làm sạch số liệu nhập (chặn mã HTML), giới hạn độ sâu
  depth = depth || 0;
  if (depth > 6) return null;
  if (typeof v === 'string') return clean(v, 4000);
  if (typeof v === 'number') return isFinite(v) ? v : null;
  if (typeof v === 'boolean' || v === null) return v;
  if (Array.isArray(v)) return v.slice(0, 500).map(x => tcCleanData_(x, depth + 1));
  if (typeof v === 'object') { const o = {}; Object.keys(v).slice(0, 200).forEach(k => { o[String(k).slice(0, 40)] = tcCleanData_(v[k], depth + 1); }); return o; }
  return null;
}

// ---------- ĐỌC ----------
function tcBoot_(u, P, d) {
  const tv = tcVer_(P);
  const key = 'TCB|' + sha(P).slice(0, 16) + '|' + tv;
  let s = cacheGetJSON_(key);
  if (!s) { s = tcBuild_(P); cachePutJSON_(key, s, 1800); }
  const out = { success:true, tv:tv, sv:TC_VERSION, project:P, projects:allowedProjects(u), me:pub(u),
    cfg:s.cfg, recs:s.recs, stats:s.stats, ckRev:s.ckRev, nCk:s.ck.length };
  if (String(d.ckRev || '') !== s.ckRev) out.ck = s.ck;          // danh sách cấu kiện chỉ gửi khi đổi
  const bot = props_().getProperty('TG_BOT') || '';
  out.tg = { bot:bot, linked:!!u.tgChat, link: bot ? 'https://t.me/' + bot + '?start=' + tgCode_(u.id) : '' };
  out.users = loadUsers().filter(x => x.status === 'active' && allowedProjects(x).indexOf(P) >= 0 && hasP(x, 't_xem'))
    .map(x => ({ id:x.id, name:x.name, role:x.role, qa:hasP(x, 't_qa') ? 1 : 0, cht:hasP(x, 't_cht') ? 1 : 0 }));
  return out;
}
function tcBuild_(P) {
  const today = tcToday_(), from = tcDayAdd_(today, -3), fromPlan = tcDayAdd_(today, -1);
  const ck = tcRows_(TC_CK, P).map(tcCkOut_);
  const all = tcRows_(TC_REC, P);
  const keep = { sk:1, kh:1, khbt:1, qt:1 };
  const loaiOf = {}; ck.forEach(c => loaiOf[c[0]] = c[1]);
  const recs = [], stats = { day:{}, tot:{}, open:0 };
  const lastBg = {};
  all.forEach(o => {
    const st = String(o.status), mod = String(o.mod), ngay = String(o.ngay || '');
    if (mod === 'bt' && ngay) { const dd = tcJ_(o.data, {}); if (dd.ketThuc) { const k = ngay; stats.day[k] = stats.day[k] || { coc:0, tv:0, m3:0 }; const t = loaiOf[String(o.ck)] === 'tv' ? 'tv' : 'coc'; stats.day[k][t]++; stats.day[k].m3 += +dd.luyKe || 0; } }
    if (mod === 'bg') { if (!lastBg.r || ngay >= lastBg.r.ngay) lastBg.r = o; }
    let take = ngay >= from || st === 'gui' || st === 'tra' || st === 'nhap';
    if (keep[mod]) take = take || (mod === 'sk' ? st !== 'dong' && st !== 'huy' : (mod === 'qt' ? ngay >= tcDayAdd_(today, -45) : ngay >= fromPlan));
    if (!take && (mod === 'tn' || mod === 'ht')) { const dd = tcJ_(o.data, {}); take = mod === 'tn' ? !dd.kl && String(dd.ngay28 || '') >= fromPlan : dd.muc === 'Cần xử lý'; }
    if (take) recs.push(tcRecOut_(o));
  });
  if (lastBg.r && !recs.some(r => r.id === String(lastBg.r.id))) recs.push(tcRecOut_(lastBg.r));
  ck.forEach(c => { stats.tot[c[1] + '|' + c[7]] = (stats.tot[c[1] + '|' + c[7]] || 0) + 1; });
  return { ck:ck, ckRev:sha(JSON.stringify(ck)).slice(0, 12), recs:recs, stats:stats, cfg:tcCfgAll_(P) };
}
function tcCk_(u, P, d) {
  const code = String(d.code || '');
  const recs = tcRows_(TC_REC, P).filter(o => String(o.ck) === code || tcRefs_(o, code)).map(tcRecOut_);
  const ph = tcRows_(TC_PH, P).filter(o => recs.some(r => r.id === String(o.recId))).map(o => ({ id:String(o.id), recId:String(o.recId), fileId:String(o.fileId), byName:String(o.byName), at:String(o.at) }));
  return { success:true, code:code, recs:recs, photos:ph, tv:tcVer_(P) };
}
// Phân quyền Thi công ngay trong Thi công (Admin) — dùng chung bảng chức danh Kho
function tcRoles_(u) {
  if (u.role !== 'ADM') return { success:false, forbidden:true, error:'Chỉ Admin xem / sửa được phân quyền' };
  const roles = rolesAll_();
  const users = loadUsers().filter(x => x.status === 'active' || x.status === 'locked').map(x => ({ id:x.id, username:x.username, name:x.name, role:x.role, status:x.status, projects:userProjects(x) }));
  return { success:true, roles:roles, users:users, projects:projList() };
}
// toàn bộ bản ghi dự án (app tải nền 1 lần, lưu trong máy → chạm cọc hiện ngay)
function tcAll_(u, P, d) {
  const recs = tcRows_(TC_REC, P).filter(o => String(o.status) !== 'huy').map(tcRecOut_);
  return { success:true, tv:tcVer_(P), recs:recs, n:recs.length };
}
function tcRefs_(o, code) {                                      // xe bê tông phân bổ nhiều cấu kiện
  if (String(o.mod) !== 'xe') return false;
  const d = tcJ_(o.data, {});
  return Array.isArray(d.pb) && d.pb.some(x => x && String(x.ck) === code);
}
function tcList_(u, P, d) {
  const mods = String(d.mod || '').split(',').filter(Boolean), from = String(d.from || ''), to = String(d.to || '9999');
  const q = String(d.q || '').toLowerCase();
  let rows = tcRows_(TC_REC, P).filter(o => (!mods.length || mods.indexOf(String(o.mod)) >= 0) && String(o.ngay) >= from && String(o.ngay) <= to);
  if (q) rows = rows.filter(o => (String(o.ck) + ' ' + String(o.data)).toLowerCase().indexOf(q) >= 0);
  const lim = Math.min(+d.limit || 400, 3000);
  rows.sort((a, b) => String(b.ngay).localeCompare(String(a.ngay)) || String(b.at).localeCompare(String(a.at)));
  const more = rows.length > lim;
  return { success:true, recs:rows.slice(0, lim).map(tcRecOut_), more:more, total:rows.length };
}
function tcAudit_(u, P, d) {                                     // lịch sử sửa / xác nhận của dự án (Admin, CHT)
  if (!tcCan_(u, 't_cht') && !tcCan_(u, 't_qt')) fail('Chỉ CHT / Quản trị Thi công xem được');
  const out = [];
  tcRows_(TC_REC, P).forEach(o => {
    tcJ_(o.sign, []).forEach(s => { if (s && (s.act === 'sua' || s.act === 'xungdot' || !d.onlyEdit)) out.push({ id:String(o.id), ck:String(o.ck), mod:String(o.mod), s:s }); });
  });
  out.sort((a, b) => String(b.s.at).localeCompare(String(a.s.at)));
  return { success:true, items:out.slice(0, 300) };
}
function tcKho_(u, P, d) {                                       // dữ liệu Kho cho màn Vật tư, Lồng thép, Nhân sự & thiết bị (chỉ đọc)
  let reqs = [];
  try { reqs = readTable_(REQ, P).map(reqOut_); } catch (e) {}
  if (!hasP(u, 'y_xem')) reqs = reqs.filter(r => r.createdBy === u.id);
  reqs = reqs.map(r => ({ id:r.id, kind:r.kind, ck:r.ckName, title:r.title, st:r.status, duyet:r.duyet, by:r.createdByName, at:r.datetime,
    lines:(r.lines || []).map(l => ({ n:l.name || l.itemName || '', u:l.unit || '', req:+l.req || 0, sent:+l.sent || 0, got:+l.got || 0 })) }));
  let dev = [];
  try { dev = readTable_(TABLES.devices, P).filter(x => !x.outDate).map(x => ({ id:x.id, name:x.name, cat:x.cat, type:x.type, plate:x.plate, maQL:x.maQL, meterUnit:x.meterUnit, donVi:x.donVi, inDate:x.inDate })); } catch (e) {}
  return { success:true, reqs:reqs, devices:dev, stLabel:REQ_ST };
}

// ---------- GHI ----------
function tcFind_(sh, id) {
  const n = sh.getLastRow() - 1; if (n < 1) return -1;
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = 0; i < n; i++) if (String(ids[i][0]) === String(id)) return i;
  return -1;
}
function tcWriteRec_(sh, i, o) {
  const row = TC_REC.cols.map(c => { let v = o[c]; if (c === 'data' || c === 'sign') v = JSON.stringify(v || (c === 'sign' ? [] : {})); return toCell(v === undefined ? '' : v); });
  if (i < 0) sh.appendRow(row); else sh.getRange(i + 2, 1, 1, TC_REC.cols.length).setValues([row]);
}
function tcSave_(u, P, d) {
  const r0 = d.rec || {};
  const id = String(r0.id || '').replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 40);
  const mod = String(r0.mod || '');
  if (!id) fail('Thiếu mã bản ghi');
  if (!TC_MOD[mod]) fail('Loại bản ghi không hợp lệ: ' + mod);
  const ck = clean(String(r0.ck || ''), 40);
  if (TC_STEP[mod] || mod === 'nt' || mod === 'kl') { if (!ck) fail('Chưa chọn cấu kiện'); }
  if (ck && !tcRows_(TC_CK, P).some(c => String(c.code) === ck)) fail('Không có cấu kiện ' + ck + ' trong dự án ' + P);
  if ((mod === 'kh' || mod === 'khbt') && !tcCan_(u, 't_kh') && !tcCan_(u, 't_ghi')) fail('Bạn chưa được cấp quyền lập kế hoạch');
  const data = tcCleanData_(r0.d || {}) || {};
  const ngay = /^\d{4}-\d{2}-\d{2}$/.test(String(r0.ngay || '')) ? String(r0.ngay) : tcToday_();
  const submit = !!r0.submit;
  const sh = tcSheet_(TC_REC);
  const i = tcFind_(sh, id);
  const now = nowTxt();
  let o, conflict = false;
  if (i >= 0) {
    o = tcRecOut_(rowToObj(TC_REC.cols, sh.getRange(i + 2, 1, 1, TC_REC.cols.length).getValues()[0]));
    if (o.mod !== mod) fail('Mã bản ghi trùng với bản ghi khác');
    const locked = o.st === 'xn' || o.st === 'duyet' || o.st === 'dong';
    if (locked && u.role !== 'ADM' && !tcCan_(u, 't_cht')) fail('Bản ghi đã được xác nhận — chỉ CHT / Admin sửa được (ghi lý do)');
    if (o.by !== u.id && !tcCan_(u, 't_qa') && !tcCan_(u, 't_cht') && !(mod === 'sk' || mod === 'kh' || mod === 'khbt')) fail('Chỉ người lập hoặc QA/QC, CHT sửa được bản ghi này');
    const base = +r0.baseRev || 0;
    if (base && base < o.rev) conflict = true;                   // máy khác đã sửa trước → giữ cả hai, không ghi đè âm thầm
    if (conflict) {
      const nid = id + 'x' + (o.rev + 1);
      const c = { id:nid, project:P, ck:ck, mod:mod, status:'nhap', ngay:ngay, data:Object.assign({}, data, { _xungDot:id }), by:u.id, byName:u.name, at:now,
        clientTime:clean(String(r0.clientTime || ''), 30), sign:[{ act:'xungdot', by:u.id, byName:u.name, at:now, note:'Sửa trên máy khác cùng lúc với bản ' + id + ' (lần ' + o.rev + ') — giữ cả hai để đối chiếu' }], rev:1, test:0 };
      tcWriteRec_(sh, -1, c);
      writeLog(u, 'Thi công · xung đột', P + ' · ' + (TC_MOD[mod] || mod) + ' ' + ck + ' · giữ bản ' + nid);
      return { success:true, conflict:true, rec:tcRecOut_(Object.assign({}, c, { data:JSON.stringify(c.data), sign:JSON.stringify(c.sign) })) };
    }
    if (JSON.stringify(o.d) === JSON.stringify(data) && !submit && o.ck === ck && o.ngay === ngay) return { success:true, same:true, rec:o };
    const why = clean(String(r0.why || ''), 300);
    if (locked && !why) fail('Nhập lý do sửa bản ghi đã xác nhận');
    const diff = tcDiff_(o.d, data);
    o.sign.push({ act:'sua', by:u.id, byName:u.name, at:now, note:why, diff:diff.slice(0, 20) });
    o.d = data; o.ck = ck; o.ngay = ngay; o.rev++;
    if (submit && (o.st === 'nhap' || o.st === 'tra')) { o.st = 'gui'; o.sign.push({ act:'gui', by:u.id, byName:u.name, at:now }); }
    if (locked && !submit) {}                                     // giữ trạng thái đã xác nhận, đã ghi lịch sử sửa
  } else {
    o = { id:id, ck:ck, mod:mod, st: submit ? 'gui' : (mod === 'sk' ? 'mo' : 'nhap'), ngay:ngay, d:data, by:u.id, byName:u.name, at:now, sign:[], rev:1, test:0 };
    if (mod === 'sk') o.st = submit ? 'gui' : 'mo';
    if (mod === 'kh' || mod === 'khbt' || mod === 'qt' || mod === 'dt' || mod === 'bc' || mod === 'tn') o.st = submit ? 'gui' : 'xn';     // không cần kiểm tra
    o.sign.push({ act: submit ? 'gui' : 'tao', by:u.id, byName:u.name, at:now });
  }
  tcWriteRec_(sh, i, { id:o.id, project:P, ck:o.ck, mod:mod, status:o.st, ngay:o.ngay, data:o.d, by:o.by, byName:o.byName, at:o.at,
    clientTime:clean(String(r0.clientTime || ''), 30), sign:o.sign, rev:o.rev, test:o.test || 0 });
  const ckSt = o.ck ? tcRestatus_(P, o.ck) : null;
  writeLog(u, i >= 0 ? 'Thi công · sửa' : 'Thi công · ghi', P + ' · ' + (TC_MOD[mod] || mod) + (o.ck ? ' ' + o.ck : '') + (submit ? ' · gửi kiểm tra' : ''));
  if (submit) tcNotify_(P, u, o, 'gui');
  if (mod === 'sk' && i < 0) tcNotify_(P, u, o, 'sk');
  return { success:true, rec:o, ck:ckSt };
}
function tcDiff_(a, b) {
  const out = [];
  const flat = (o, pre, m) => { Object.keys(o || {}).forEach(k => { const v = o[k]; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, pre + k + '.', m); else m[pre + k] = JSON.stringify(v); }); return m; };
  const A = flat(a, '', {}), B = flat(b, '', {});
  Object.keys(Object.assign({}, A, B)).forEach(k => { if (A[k] !== B[k]) out.push([k, String(A[k] === undefined ? '' : A[k]).slice(0, 60), String(B[k] === undefined ? '' : B[k]).slice(0, 60)]); });
  return out;
}
function tcSign_(u, P, d) {
  const id = String(d.id || ''), act = String(d.act || ''), note = clean(String(d.note || ''), 500);
  const sh = tcSheet_(TC_REC), i = tcFind_(sh, id);
  if (i < 0) fail('Không tìm thấy bản ghi');
  const o = tcRecOut_(rowToObj(TC_REC.cols, sh.getRange(i + 2, 1, 1, TC_REC.cols.length).getValues()[0]));
  const now = nowTxt();
  const need = { xn:'t_qa', tra:'t_qa', duyet:'t_cht', dong:'t_qa', mo:'t_ghi', huy:'t_ghi', gui:'t_ghi', nhan:'t_ghi', phanhoi:'t_ghi' }[act];
  if (!need) fail('Thao tác không hợp lệ');
  if (act === 'tra' && !tcCan_(u, 't_qa') && !tcCan_(u, 't_cht')) fail('Chỉ QA/QC hoặc CHT trả về được');
  else if (act !== 'tra' && !tcCan_(u, need) && !(act === 'dong' && tcCan_(u, 't_cht'))) fail('Bạn chưa được cấp quyền: ' + tcPermName_(need));
  if (act === 'huy' && o.by !== u.id && !tcCan_(u, 't_cht')) fail('Chỉ người lập hoặc CHT hủy được');
  if ((act === 'xn' || act === 'duyet') && o.by === u.id && u.role !== 'ADM' && !d.self) fail('Không tự xác nhận bản ghi của chính mình — nhờ người khác có quyền');
  if (act === 'tra' && !note) fail('Nhập lý do trả về');
  const nx = { xn:'xn', tra:'tra', duyet:'duyet', dong:'dong', mo:'mo', huy:'huy', gui:'gui', nhan:o.st, phanhoi:o.st }[act];
  if (act === 'duyet' && o.st !== 'xn' && o.mod === 'nt') fail('Hồ sơ nghiệm thu cần QA/QC xác nhận trước khi CHT duyệt');
  o.st = nx;
  o.sign.push({ act:act, by:u.id, byName:u.name, role:u.role, at:now, note:note });
  if (act === 'nhan' && o.mod === 'bg') { o.d.nhan = { by:u.id, byName:u.name, at:now }; }
  tcWriteRec_(sh, i, { id:o.id, project:P, ck:o.ck, mod:o.mod, status:o.st, ngay:o.ngay, data:o.d, by:o.by, byName:o.byName, at:o.at,
    clientTime:'', sign:o.sign, rev:o.rev, test:o.test });
  const ckSt = o.ck ? tcRestatus_(P, o.ck) : null;
  writeLog(u, 'Thi công · ' + ({ xn:'xác nhận', tra:'trả về', duyet:'duyệt', dong:'đóng', mo:'mở lại', huy:'hủy', gui:'gửi kiểm tra', nhan:'nhận ca', phanhoi:'phản hồi' })[act],
    P + ' · ' + (TC_MOD[o.mod] || o.mod) + (o.ck ? ' ' + o.ck : '') + (note ? ' · ' + note : ''));
  tcNotify_(P, u, o, act, note);
  return { success:true, rec:o, ck:ckSt };
}
function tcDel_(u, P, d) {
  const sh = tcSheet_(TC_REC), i = tcFind_(sh, String(d.id || ''));
  if (i < 0) return { success:true, same:true };
  const o = tcRecOut_(rowToObj(TC_REC.cols, sh.getRange(i + 2, 1, 1, TC_REC.cols.length).getValues()[0]));
  if (u.role !== 'ADM') {
    if (o.by !== u.id) fail('Chỉ người lập hoặc Admin xóa được');
    if (o.st !== 'nhap' && o.st !== 'tra' && o.st !== 'mo') fail('Bản ghi đã gửi kiểm tra — không xóa được, dùng Hủy');
  }
  sh.deleteRow(i + 2);
  const ck = o.ck ? tcRestatus_(P, o.ck) : null;
  writeLog(u, 'Thi công · xóa', P + ' · ' + (TC_MOD[o.mod] || o.mod) + (o.ck ? ' ' + o.ck : '') + ' · ' + o.id);
  return { success:true, ck:ck };
}
// Trạng thái cấu kiện tính lại từ các bản ghi của nó
function tcCalcSt_(recs, today) {                                 // recs: các dòng TC_BanGhi (đối tượng) của 1 cấu kiện, đã bỏ bản hủy
  let st = 'cl', step = '', flag = '';
  const by = m => recs.filter(o => String(o.mod) === m);
  if (by('kh').some(o => String(o.ngay) >= tcDayAdd_(today, -1)) || by('khbt').some(o => String(o.ngay) >= today)) st = 'sl';
  const steps = recs.filter(o => TC_STEP[String(o.mod)]).sort((a, b) => String(a.ngay + a.at).localeCompare(String(b.ngay + b.at)));
  if (steps.length) { st = 'dl'; step = String(steps[steps.length - 1].mod); }
  if (by('truoc').some(o => String(o.status) === 'gui')) step = 'hold';
  const bt = by('bt');
  if (bt.some(o => !tcJ_(o.data, {}).ketThuc)) step = 'bt';
  if (bt.some(o => tcJ_(o.data, {}).ketThuc)) { st = 'dd'; step = 'dd'; }
  if (by('nt').some(o => String(o.status) === 'xn')) step = 'ntcho';
  if (by('nt').some(o => String(o.status) === 'duyet')) { st = 'nt'; step = 'nt'; }
  if (by('sk').some(o => String(o.status) !== 'dong' && String(o.status) !== 'huy' && tcJ_(o.data, {}).loai === 'NCR')) flag = 'tt';
  return [st, step, flag];
}
function tcRestatus_(P, code) { return tcRestatusMany_(P, [code])[0] || null; }
function tcRestatusMany_(P, codes) {                              // codes: mảng mã, hoặc null = mọi cấu kiện của dự án
  const today = tcToday_(), want = codes ? {} : null;
  if (codes) codes.forEach(c => want[c] = 1);
  const g = {};
  tcRows_(TC_REC, P).forEach(o => { const c = String(o.ck); if (c && String(o.status) !== 'huy' && (!want || want[c])) (g[c] = g[c] || []).push(o); });
  const sh = tcSheet_(TC_CK), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const ci = TC_CK.cols.indexOf('status');
  const keys = sh.getRange(2, 1, n, 4).getValues(), rg = sh.getRange(2, ci + 1, n, 5), vals = rg.getValues();
  const out = []; let ch = 0; const now = nowTxt();
  keys.forEach((k, i) => {
    if (String(k[1]) !== P || (want && !want[String(k[3])])) return;
    const r = vals[i], v = tcCalcSt_(g[String(k[3])] || [], today);
    out.push({ code:String(k[3]), st:v[0], step:v[1], flag:v[2] });
    if ([String(r[0]), String(r[1]), String(r[2])].join('|') !== v.join('|')) {
      if (String(r[0]) !== v[0]) r[3] = now;
      r[0] = v[0]; r[1] = v[1]; r[2] = v[2]; r[4] = now; ch++;
    }
  });
  if (ch) rg.setValues(vals.map(r => r.map(v => v instanceof Date ? toCell(fromCell(v)) : (typeof v === 'string' && v !== '' ? toCell(v) : v))));
  return out;
}
function tcNotify_(P, u, o, act, note) {
  try {
    const what = (TC_MOD[o.mod] || o.mod) + (o.ck ? ' ' + o.ck : '');
    if (act === 'gui') notify_(P, o.mod === 'nt' || o.mod === 'truoc' || o.mod === 'lt' ? ['t_qa'] : ['t_qa'], [], u.id, '🏗️ ' + u.name + ' gửi kiểm tra: ' + what);
    else if (act === 'tra') notify_(P, [], [o.by], u.id, '↩️ ' + u.name + ' trả về ' + what + (note ? '\nLý do: ' + note : ''));
    else if (act === 'xn') {
      notify_(P, [], [o.by], u.id, '✅ ' + u.name + ' đã xác nhận ' + what + (o.mod === 'truoc' ? ' — đã giải phóng điểm Hold, được đổ bê tông' : ''));
      if (o.mod === 'nt') notify_(P, ['t_cht'], [], u.id, '📝 Hồ sơ nghiệm thu ' + o.ck + ' chờ CHT duyệt nội bộ');
    }
    else if (act === 'duyet') notify_(P, [], [o.by], u.id, '🏁 ' + u.name + ' đã duyệt ' + what);
    else if (act === 'sk') notify_(P, ['t_cht'], [], u.id, '⚠️ ' + u.name + ' ghi ' + (o.d.loai || 'sự kiện') + ': ' + String(o.d.tieuDe || '').slice(0, 120) + (o.ck ? ' · ' + o.ck : ''));
  } catch (e) {}
}

// ---------- ẢNH ----------
function tcPhotoFolder_(P) {
  const props = props_();
  let root = null; const id = props.getProperty('tcPhotoFolder');
  if (id) { try { root = DriveApp.getFolderById(id); } catch (e) {} }
  if (!root) { root = DriveApp.createFolder(TC_PHOTO_FOLDER); props.setProperty('tcPhotoFolder', root.getId()); }
  const sub = (f, n) => { const it = f.getFoldersByName(n); return it.hasNext() ? it.next() : f.createFolder(n); };
  return sub(sub(root, P.replace(/[\\/]/g, '-')), Utilities.formatDate(new Date(), TZ, 'yyyy-MM'));
}
function tcPhoto_(u, P, d) {
  if (!d.photoId || !d.recId || !d.data) fail('Thiếu dữ liệu ảnh');
  const sh = tcSheet_(TC_PH);
  if (readRows(sh, 1).some(r => String(r[0]) === String(d.photoId))) return { success:true, same:true };
  const m = String(d.data).match(/^data:(image\/(jpeg|png|webp));base64,(.+)$/);
  if (!m) fail('Ảnh không hợp lệ');
  const bytes = Utilities.base64Decode(m[3]);
  if (bytes.length > PHOTO_MAX_BYTES) fail('Ảnh quá lớn (tối đa 4MB)');
  const label = clean(String(d.label || ''), 80);
  const name = clean(Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HHmm') + ' ' + label + ' #' + String(d.photoId).slice(-5), 150) + '.jpg';
  const file = tcPhotoFolder_(P).createFile(Utilities.newBlob(bytes, m[1], name));
  file.setDescription('Người chụp: ' + u.name + ' · ' + P + ' · bản ghi ' + d.recId);
  sh.appendRow([d.photoId, P, d.recId, file.getId(), name, u.id, u.name, nowTxt(), 0].map(toCell));
  return { success:true, fileId:file.getId(), same:true };
}
function tcGetPhoto_(u, P, d) {
  const row = tcRows_(TC_PH, P).find(o => String(o.fileId) === String(d.fileId));
  if (!row) fail('Không tìm thấy ảnh');
  const blob = DriveApp.getFileById(String(d.fileId)).getBlob();
  return { success:true, data:'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes()) };
}

// ---------- CẤU KIỆN & CẤU HÌNH ----------
// rows: [{code, loai(coc/tv/tp), type, x, y, kv, truc, meta:{...}}] · mode: 'them' (thêm / cập nhật theo mã) | 'thay' (xóa cấu kiện chưa có bản ghi rồi nạp lại)
function tcImportCk_(u, P, d) {
  const rows = (d.rows || []).slice(0, 5000);
  if (!rows.length) fail('Không có dòng cấu kiện nào');
  const sh = tcSheet_(TC_CK);
  const cur = tcRows_(TC_CK, P);
  const used = {}; tcRows_(TC_REC, P).forEach(o => { if (o.ck) used[String(o.ck)] = 1; });
  const byCode = {}; cur.forEach(c => byCode[String(c.code)] = c);
  const seen = {}, out = [];
  rows.forEach((r, k) => {
    const code = clean(String(r.code || '').trim(), 40);
    if (!code) fail('Dòng ' + (k + 2) + ': thiếu mã cấu kiện');
    if (seen[code]) fail('Trùng mã cấu kiện: ' + code);
    seen[code] = 1;
    const loai = ['coc','tv','tp'].indexOf(String(r.loai)) >= 0 ? String(r.loai) : 'coc';
    const x = +r.x, y = +r.y;
    if (loai !== 'tv' && (!isFinite(x) || !isFinite(y) || !x || !y)) fail('Dòng ' + (k + 2) + ' (' + code + '): thiếu tọa độ X, Y');
    const old = byCode[code];
    out.push({ id:P + '|' + code, project:P, loai:loai, code:code, type:clean(String(r.type || ''), 30), x:isFinite(x) ? x : 0, y:isFinite(y) ? y : 0,
      kv:clean(String(r.kv || ''), 20), truc:clean(String(r.truc || ''), 20), meta:JSON.stringify(tcCleanData_(r.meta || {}) || {}),
      status: old ? String(old.status) : (r.status && /^(cl|sl|dl|dd|nt)$/.test(String(r.status)) ? String(r.status) : 'cl'), step: old ? String(old.step) : '', flag: old ? String(old.flag) : '',
      statusAt: old ? fromCell(old.statusAt) : '', updatedAt:nowTxt() });
  });
  let keep = [];
  if (String(d.mode) === 'thay') {
    const lost = cur.filter(c => !seen[String(c.code)] && used[String(c.code)]);
    if (lost.length) fail('Không xóa được ' + lost.length + ' cấu kiện đã có nhật ký (vd ' + lost.slice(0, 5).map(c => c.code).join(', ') + ') — thêm lại các mã này vào file');
  } else keep = cur.filter(c => !seen[String(c.code)]);
  const all = tcRows_(TC_CK, '').filter(c => String(c.project) !== P);
  const list = all.concat(keep).concat(out);
  writeAll(sh, TC_CK.cols, list.map(o => { const c = Object.assign({}, o); delete c._i; return c; }));
  writeLog(u, 'Thi công · nạp cấu kiện', P + ' · ' + out.length + ' cấu kiện (' + (String(d.mode) === 'thay' ? 'thay toàn bộ' : 'thêm / cập nhật') + ')');
  return { success:true, n:out.length, total:keep.length + out.length };
}
// Nạp bản ghi từ sổ hồ sơ Excel (gửi nhiều đợt). Mã bản ghi cố định theo cấu kiện + công đoạn → nạp lại thì cập nhật, không nhân đôi.
// Bản ghi đã được sửa trong app (lần sửa > 1) thì giữ nguyên. d.last = đợt cuối → tính lại trạng thái mọi cấu kiện.
function tcImportRecs_(u, P, d) {
  const list = (d.recs || []).slice(0, 2000);
  const ck = {}; tcRows_(TC_CK, P).forEach(c => ck[String(c.code)] = 1);
  const sh = tcSheet_(TC_REC), n = sh.getLastRow() - 1, W = TC_REC.cols.length;
  const rows = n > 0 ? sh.getRange(2, 1, n, W).getValues() : [];
  const at = {}; rows.forEach((r, i) => { if (r[0] !== '') at[String(r[0])] = i; });
  const now = nowTxt(); let add = 0, upd = 0, keep = 0, bad = 0;
  list.forEach(x => {
    const id = String(x.id || '').replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 40), mod = String(x.mod || '');
    if (!id || !TC_MOD[mod] || (x.ck && !ck[String(x.ck)])) { bad++; return; }
    const ngay = /^\d{4}-\d{2}-\d{2}$/.test(String(x.ngay || '')) ? String(x.ngay) : tcToday_();
    const i = at[id];
    if (i !== undefined && (+rows[i][TC_REC.cols.indexOf('rev')] || 1) > 1) { keep++; return; }
    const sign = [{ act:'nap', by:u.id, byName:u.name, at:now, note:'Nạp từ sổ hồ sơ Excel' + (x.at ? ' · thời điểm ' + clean(String(x.at), 20) : '') }];
    const row = [id, P, clean(String(x.ck || ''), 40), mod, 'xn', ngay, JSON.stringify(tcCleanData_(x.d || {}) || {}), u.id, 'Sổ hồ sơ (Excel)', now, clean(String(x.at || ''), 30), JSON.stringify(sign), 1, 0].map(toCell);
    if (i !== undefined) { rows[i] = row; upd++; } else { rows.push(row); at[id] = rows.length - 1; add++; }
  });
  if (rows.length) sh.getRange(2, 1, rows.length, W).setValues(rows.map(r => r.map(v => v instanceof Date ? toCell(fromCell(v)) : (typeof v === 'string' && v !== '' && v[0] !== "'" ? toCell(v) : v))));
  if (d.last) tcRestatusMany_(P, null);
  if (d.last) writeLog(u, 'Thi công · nạp sổ hồ sơ', P + ' · ' + (d.total || '') + ' bản ghi');
  return { success:true, add:add, upd:upd, keep:keep, bad:bad };
}
const TC_CFG_KEYS = { info:1, rot:1, levels:1, limits:1, res:1, docs:1, boq:1, itp:1, demo:1, types:1, kv:1, hold:1, poly:1, sec:1, ca:1 };
function tcCfgSave_(u, P, d) {
  const key = String(d.key || '');
  if (!TC_CFG_KEYS[key]) fail('Mục cấu hình không hợp lệ');
  const v = tcCleanData_(d.value);
  const s = JSON.stringify(v);
  if (s.length > 45000) fail('Cấu hình quá lớn');
  const sh = tcSheet_(TC_CF), rows = readRows(sh, TC_CF.cols.length);
  const i = rows.findIndex(r => String(r[0]) === P && String(r[1]) === key);
  const row = [P, key, s, u.name, nowTxt()].map(toCell);
  if (i < 0) sh.appendRow(row); else sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
  writeLog(u, 'Thi công · cấu hình', P + ' · ' + key);
  return { success:true, key:key, value:v };
}

// ---------- DỮ LIỆU MẪU (để tập) ----------
function tcReset_(u, P, d) {
  const onlyTest = !!d.onlyTest;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let n = 0;
  [TC_REC, TC_PH].forEach(T => {
    const sh = ss.getSheetByName(T.sheet); if (!sh) return;
    const pi = T.cols.indexOf('project'), ti = T.cols.indexOf('test');
    const rows = readRows(sh, T.cols.length);
    const keep = rows.filter(r => r[0] !== '' && !(String(r[pi]) === P && (!onlyTest || +r[ti] === 1)));
    n += rows.filter(r => r[0] !== '').length - keep.length;
    const last = sh.getLastRow() - 1;
    if (last > 0) sh.getRange(2, 1, last, T.cols.length).clearContent();
    if (keep.length) sh.getRange(2, 1, keep.length, T.cols.length).setValues(keep);
  });
  if (!onlyTest) {
    [TC_CK, TC_CF].forEach(T => {
      const sh = ss.getSheetByName(T.sheet); if (!sh) return;
      const pi = T.cols.indexOf('project');
      const rows = readRows(sh, T.cols.length), keep = rows.filter(r => r[0] !== '' && String(r[pi]) !== P);
      const last = sh.getLastRow() - 1;
      if (last > 0) sh.getRange(2, 1, last, T.cols.length).clearContent();
      if (keep.length) sh.getRange(2, 1, keep.length, T.cols.length).setValues(keep);
    });
  } else {
    tcRestatusMany_(P, null);
    const cf = tcCfgAll_(P); if (cf.demo) tcCfgSave_(u, P, { key:'demo', value:null });
  }
  writeLog(u, 'Thi công · xóa dữ liệu', P + ' · ' + (onlyTest ? 'chỉ dữ liệu mẫu' : 'toàn bộ cấu kiện, nhật ký, cấu hình') + ' · ' + n + ' bản ghi / ảnh');
  return { success:true, n:n };
}
// Nạp mẫu TTHC: 366 cọc + 117 panel tọa độ VN2000, cấu hình dự án, nhật ký mẫu theo trạng thái để mọi người tập
function tcSeed_(u, P, d) {
  if (!/tthc|hầm|công viên/i.test(P)) return { success:false, error:'Dữ liệu mẫu chỉ dành cho dự án Hầm để xe TTHC — không nạp vào ' + P };
  if (tcRows_(TC_CK, P).length && !d.force) fail('Dự án đã có cấu kiện — xóa dữ liệu Thi công của dự án trước khi nạp mẫu');
  const S = TC_SEED_TTHC, T = TC_SEED_TYPES;
  const rows = [];
  S.p.forEach(p => {
    const ty = p[1] === 'TP' ? T.TP : T[p[1]];
    rows.push({ code:p[0], loai: p[1] === 'TP' ? 'tp' : 'coc', type:p[1], x:p[2], y:p[3], kv: p[4] ? 'KV' + p[4] : '', truc:p[5],
      meta:{ d:1, gl:2.5, col:-6.25, toe:ty.toe, bv:ty.bv, v:ty.v, thep:ty.thep, nLong:ty.nLong }, status:p[6] });
  });
  S.w.forEach(w => {
    rows.push({ code:w[0], loai:'tv', type:w[1], x:Math.round((w[2] + w[4]) / 2 * 1000) / 1000, y:Math.round((w[3] + w[5]) / 2 * 1000) / 1000, kv:'TV', truc:'',
      meta:{ a:[w[2], w[3]], b:[w[4], w[5]], k:w[1], t:0.8, L:w[7], gl:2.5, top:1.6, toe:-26.35, bv:w[6], gTop:1.05, gBot:-8.8 }, status:w[8] });
  });
  tcImportCk_(u, P, { rows:rows, mode:'them' });
  const cfg = TC_SEED_CFG;
  Object.keys(cfg).forEach(k => tcCfgSave_(u, P, { key:k, value:cfg[k] }));
  tcCfgSave_(u, P, { key:'poly', value:S.poly });
  tcCfgSave_(u, P, { key:'rot', value:S.rot });
  tcCfgSave_(u, P, { key:'demo', value:{ on:1, at:nowTxt(), by:u.name } });
  const n = tcSeedRecs_(u, P, S);
  writeLog(u, 'Thi công · nạp dữ liệu mẫu', P + ' · ' + rows.length + ' cấu kiện · ' + n + ' bản ghi mẫu');
  return { success:true, nCk:rows.length, nRec:n };
}
function tcSeedRecs_(u, P, S) {
  const users = loadUsers().filter(x => x.status === 'active');
  const nm = users.length ? users[0] : u;
  const today = tcToday_();
  const recs = [];
  let seq = 0;
  const id = () => 'D' + (++seq).toString(36) + Utilities.getUuid().slice(0, 4);
  const at = (ymd, hm) => hm + ':00 ' + (+ymd.slice(8)) + '/' + (+ymd.slice(5, 7)) + '/' + ymd.slice(0, 4);
  const push = (ck, mod, st, ngay, data, hm, extraSign) => {
    const sign = [{ act:'gui', by:nm.id, byName:'Kỹ sư (mẫu)', at:at(ngay, hm) }].concat(extraSign || []);
    recs.push([id(), P, ck, mod, st, ngay, JSON.stringify(data), nm.id, 'Kỹ sư (mẫu)', at(ngay, hm), '', JSON.stringify(sign), 1, 1]);
  };
  const qa = (ngay, hm) => [{ act:'xn', by:'mau', byName:'QA/QC (mẫu)', at:at(ngay, hm) }];
  const piles = S.p.filter(p => p[6] !== 'cl' && p[6] !== 'sl'), walls = S.w.filter(w => w[8] !== 'cl' && w[8] !== 'sl');
  const T = TC_SEED_TYPES;
  const order = piles.map(p => ({ k:'coc', p:p })).concat(walls.map(w => ({ k:'tv', w:w })));
  const total = order.length;
  const start = tcDayAdd_(today, -100);
  order.forEach((it, i) => {
    const day = tcDayAdd_(start, Math.floor(i / total * 98));
    const st = it.k === 'coc' ? it.p[6] : it.w[8];
    const code = it.k === 'coc' ? it.p[0] : it.w[0];
    const ty = it.k === 'coc' ? (it.p[1] === 'TP' ? T.TP : T[it.p[1]]) : null;
    const L = it.k === 'coc' ? 2.5 - ty.toe : 2.5 + 26.35;
    const vlt = it.k === 'coc' ? ty.v : Math.round(it.w[7] * 0.8 * (2.5 + 26.35) * 100) / 100;
    const seedR = (i * 7919) % 97 / 97;
    if (it.k === 'coc') push(code, 'dv', 'xn', day, { xTk:it.p[2], yTk:it.p[3], xTt:Math.round((it.p[2] + (seedR - .5) * .06) * 1000) / 1000, yTt:Math.round((it.p[3] + (.5 - seedR) * .05) * 1000) / 1000, ovD:'Theo BPTC', ovL:8, ovZ:2.5, thang:0.3 }, '07:30', qa(day, '08:10'));
    const rows = it.k === 'coc' ? [[ '09:00', 3.0, 'Cát san lấp' ], [ '11:30', 18.0, 'Bùn sét xám xanh' ], [ '15:00', 34.5, 'Cát pha, chặt vừa' ], [ '19:30', 52.0, 'Sét nửa cứng' ], [ '23:30', L, 'Cát hạt trung, chặt' ]]
      : [[ '09:00', 6.0, 'Cát san lấp' ], [ '12:00', 18.0, 'Bùn sét' ], [ '16:00', 28.85, 'Cát pha' ]];
    push(code, 'khoan', 'xn', day, { may:it.k === 'coc' ? 'KH-01' : 'MC-01', to:it.k === 'coc' ? 'Tổ khoan 1' : 'Tổ cạp', rows:rows.map(r => ({ gio:r[0], sau:r[1], lop:r[2], loai:'do' })), xong:1 }, '23:40', qa(day, '23:55'));
    push(code, 'dd', 'xn', day, { mau:'M-' + code + '-01', loai:'Trong hố', gd:'Sau làm sạch', kl:1.06 + seedR * .04, nhot:30 + Math.round(seedR * 6), cat:1.5 + seedR * 2, ph:9.5 }, '23:50');
    const d1 = tcDayAdd_(day, 1);
    push(code, 'truoc', 'xn', d1, { can1:30 + Math.round(seedR * 40), can2:40, can3:35, nOng:it.k === 'coc' ? 1 : 2, dkOng:273, cachDay:0.3 }, '09:40', qa(d1, '10:05'));
    push(code, 'lt', 'xn', d1, { n:it.k === 'coc' ? ty.nLong : 2, kl:it.k === 'coc' ? ty.thep : 12.4, zTreo:it.k === 'coc' ? -4.95 : 1.6, ongSA:it.k === 'coc' ? 3 : 4 }, '11:10', qa(d1, '11:30'));
    const vtt = Math.round(vlt * (1.06 + seedR * .08) * 10) / 10;
    const nXe = Math.ceil(vtt / 8);
    if (i >= total - 45) for (let x = 0; x < Math.min(nXe, 20); x++) push(code, 'xe', 'xn', d1, { so:x + 1, bien:'51D-' + (100 + (i * 13 + x) % 900), phieu:String(7000000 + i * 31 + x), capPhoi:it.k === 'coc' ? 'B30 · sụt 19±1' : 'B35-W8 · sụt 19±1', luong:x < nXe - 1 ? 8 : Math.round((vtt - 8 * (nXe - 1)) * 10) / 10, sut:19, qd:'nhan', pb:[{ ck:code, m3:x < nXe - 1 ? 8 : Math.round((vtt - 8 * (nXe - 1)) * 10) / 10 }] }, ('0' + (13 + Math.floor(x * .7))).slice(-2) + ':' + ('0' + (x * 37 % 60)).slice(-2));
    push(code, 'bt', st === 'dl' ? 'nhap' : 'xn', d1, { batDau:'13:30', capPhoi:it.k === 'coc' ? 'B30' : 'B35-W8', luyKe:st === 'dl' ? Math.round(vtt * .6) : vtt, vlt:vlt, ketThuc: st === 'dl' ? '' : '19:20',
      rows:[{ gio:'14:10', v:8, zMat:-51.3, zOng:-57.2 }, { gio:'15:50', v:24, zMat:-33, zOng:-39.2 }] }, '19:30', st === 'dl' ? [] : qa(d1, '20:00'));
    if (st === 'nt') {
      const d3 = tcDayAdd_(d1, 3);
      push(code, 'nt', 'duyet', d3, { ketLuan:'Đạt', ghiChu:'Hồ sơ mẫu' }, '10:00', qa(d3, '10:30').concat([{ act:'duyet', by:'mau', byName:'CHT (mẫu)', at:at(d3, '15:00') }]));
    }
  });
  // vài việc đang dở hôm nay + sự kiện / kế hoạch / quan trắc mẫu
  const cl = S.p.filter(p => p[6] === 'cl').slice(0, 6), sl = S.p.filter(p => p[6] === 'sl');
  if (cl[0]) push(cl[0][0], 'dv', 'gui', today, { xTk:cl[0][2], yTk:cl[0][3], xTt:cl[0][2] + .018, yTt:cl[0][3] - .024, ovD:'Theo BPTC', ovL:8, ovZ:2.5, thang:0.3 }, '08:15');
  if (cl[1]) push(cl[1][0], 'khoan', 'nhap', today, { may:'KH-01', to:'Tổ khoan 1', rows:[{ gio:'14:05', sau:35.2, lop:'Cát pha', loai:'do' }, { gio:'15:10', sau:38.4, lop:'Sét nửa cứng', loai:'do' }, { gio:'16:20', sau:41.2, lop:'Sét nửa cứng', loai:'do' }] }, '16:20');
  sl.forEach((p, k) => push(p[0], 'kh', 'xn', tcDayAdd_(today, 1 + (k >> 1)), { viec:'Khoan cọc', gio:k % 2 ? '13:00' : '07:00', may:'KH-01', to:'Tổ khoan 1' }, '17:00'));
  const ncrCk = (S.p.find(p => p[6] === 'tt') || S.p[0])[0];
  push(ncrCk, 'sk', 'gui', tcDayAdd_(today, -7), { loai:'NCR', so:'NCR-007', tieuDe:'Sập thành hố tại 18–21 m (lớp cát pha)', moTa:'Thành hố sụt, dung dịch hụt nhanh ~1,2 m. Đã dừng khoan, bổ sung dung dịch, báo CHT và TVGS.', han:tcDayAdd_(today, -2), phuTrach:'Kỹ sư công trường', congDoan:'Khoan' }, '21:15');
  push('', 'sk', 'mo', tcDayAdd_(today, -2), { loai:'Sự kiện', so:'SK-014', tieuDe:'Lớp sét gặp sớm hơn hố khoan địa chất ~1,8 m', moTa:'Ghi nhận khi khoan, đã báo TVGS.', phuTrach:'Kỹ sư công trường' }, '15:20');
  push('', 'qt', 'xn', tcDayAdd_(today, -7), { diem:'IN-P25', loai:'nghieng', gt:22.1, sau:0.5 }, '08:00');
  push('', 'qt', 'xn', tcDayAdd_(today, -1), { diem:'IN-P25', loai:'nghieng', gt:26.4, sau:0.5 }, '08:00');
  push('', 'qt', 'xn', tcDayAdd_(today, -1), { diem:'IN-P19', loai:'nghieng', gt:14.8, sau:4 }, '08:00');
  push('', 'qt', 'xn', tcDayAdd_(today, -1), { diem:'LN-01', loai:'lun', gt:-6.2 }, '08:30');
  push('', 'qt', 'xn', tcDayAdd_(today, -1), { diem:'NN-02', loai:'nuoc', gt:-1.85 }, '08:40');
  push(cl[2] ? cl[2][0] : '', 'khbt', 'xn', tcDayAdd_(today, 1), { gio:'07:30', capPhoi:'B30 · sụt 19±1', m3:48, nXe:6, tram:'Trạm theo danh mục' }, '17:30');
  const sh = tcSheet_(TC_REC);
  if (recs.length) {
    const at0 = sh.getLastRow() + 1;
    sh.getRange(at0, 1, recs.length, TC_REC.cols.length).setValues(recs.map(r => r.map(toCell)));
  }
  // trạng thái theo bản ghi mẫu
  tcRestatusMany_(P, null);
  return recs.length;
}
// Loại cọc TTHC (SD-13…16): Z mũi, bản vẽ, V lý thuyết, thép lồng, số lồng
const TC_SEED_TYPES = {
  P1:{ toe:-65.5, bv:'SD-13', v:46.53, thep:3.71, nLong:6 }, P2:{ toe:-65.5, bv:'SD-14', v:45.75, thep:3.69, nLong:6 },
  P3:{ toe:-60.5, bv:'SD-15', v:42.61, thep:3.50, nLong:5 }, P4:{ toe:-60.5, bv:'SD-16', v:41.82, thep:3.48, nLong:5 }, TP:{ toe:-65.5, bv:'SD-02', v:46.53, thep:3.71, nLong:6 }
};
const TC_ITP = {"info":{"ten":"Hầm để xe Công viên – TTHC","duAn":"Quảng trường Trung tâm Thành phố và Trung tâm Hành chính của Thành phố","goi":"Thi công cọc khoan nhồi đại trà và Tường vây - Hầm đậu xe Công viên","diaDiem":"Phường An Khánh, Thành phố Hồ Chí Minh","cdt":"Công ty TNHH Đầu tư và Phát triển Mặt Trời Sài Gòn","tvgs":"Công ty TNHH Tư vấn Quản lý dự án Mặt Trời (SunPMC)","ntc":"Công ty TNHH Xây dựng Dân dụng Nhật Nam","ntp":"Công ty Cổ phần FECON South","tienDo":"20/06 – 31/08/2026","soBB":"TTHC-BXN-SUN-FCS","bvCoc":"Bản vẽ chi tiết cọc khoan nhồi đại trà số TTHC-BXN-SUN-FCS-SHO-0002-A chấp thuận ngày 04/06/2026","bvKp":"Bản vẽ shopdrawing Kingpost số TTHC-BXN-SUN-FCS-SHO-0004-A chấp thuận ngày 12/06/2026","bvTv":"Shop drawing Tường vây số TTHC-BXN-SUN-FCS-SHO-0003 được chấp thuận","tcCoc":"TCVN 9395-2012: Cọc khoan nhồi - Thi công và nghiệm thu","tcTv":"TCVN 14213-2:2024: Tường Barrette - Phần 2: Yêu cầu kỹ thuật thi công; TCVN 9395-2012","itpCoc":"TTHC-BXN-SUN-FCS-ITP-0001-C","itpTv":"TTHC-BXN-SUN-FCS-ITP-0003-A","itpTd":"TTHC-BXN-SUN-FCS-ITP-0002-A","macCoc":"B30","macTv":"B35","mau":0},"limits":{"e":75,"exy":50,"nghieng":1,"ngTV":0.5,"kl":[1.05,1.15],"nhot":[18,45],"nhotTruoc":[18,28],"ph":[7,9],"cat":[0,5],"can":100,"hMin":1.5,"gianDoan":60,"sut":[18,20],"sauTre":90,"ongDoan":3,"qtCanh":25,"qtDung":30,"sauCoc":50,"tvViTri":10,"tvMui":200,"tvLen":100,"longKT":10,"longDinh":50,"longL":50,"baoVeTV":75,"nguon":"ITP-0001-C · ITP-0003-A"},"itp":{"coc":[["dv","W","Định vị tim cọc · lắp casing","FCS E · NTC C · TVGS Ra"],["khoan","H","Khoan · mũi, chiều sâu","FCS E · NTC H · TVGS H,A"],["hh","W","Thí nghiệm Koden","PTN T · NTC H · TVGS H"],["dd","W","Dung dịch trước / trong khi khoan / trước đổ","FCS T · NTC H · TVGS Ra"],["truoc","H","Vệ sinh hố khoan · hạ ống đổ","FCS E · NTC C · TVGS H"],["lt","H","Lồng thép · ống siêu âm · cao độ đỉnh lồng","FCS E · NTC C · TVGS H,A"],["xe","W","Tiếp nhận bê tông · độ sụt · lấy mẫu","NCC E · NTC C · TVGS H"],["bt","W","Đổ bê tông · ngập ống ≥ 1,5 m · gián đoạn < 60 phút","FCS E · NTC H · TVGS Ra"],["tn","W","Siêu âm · khoan lõi · nén mẫu","PTN T · NTC H · TVGS H"],["nt","H","Hoàn công · tổng hợp hồ sơ","FCS E · NTC H · TVGS H"]],"tv":[["dv","W","Vị trí tường vây (tọa độ, cao độ tường dẫn)","FCS E · NTC C · TVGS Ra"],["khoan","H","Đào, cạp · mũi, chiều sâu +20 cm","FCS E · NTC H · TVGS H,A"],["hh","W","Thí nghiệm Koden","PTN T · NTC H · TVGS H"],["dd","W","Dung dịch trước / trong / trước đổ","FCS T · NTC H · TVGS Ra"],["moinoi","W","Tấm ngăn nước · thanh giữ gioăng","FCS E · NTC H · TVGS Ra"],["truoc","H","Vệ sinh hố đào · hạ ống đổ","FCS E · NTC C · TVGS H"],["lt","H","Lồng thép · ống siêu âm · lớp bảo vệ 75 mm","FCS E · NTC C · TVGS H,A"],["xe","W","Tiếp nhận bê tông · độ sụt · lấy mẫu","NCC E · NTC C · TVGS H"],["bt","W","Đổ bê tông · ngập ống ≥ 1,5 m","FCS E · NTC H · TVGS Ra"],["nt","H","Hoàn công · tổng hợp hồ sơ","FCS E · NTC H · TVGS H"]]},"docs":[{"ten":"Shop drawing cọc khoan nhồi đại trà","so":"TTHC-BXN-SUN-FCS-SHO-0002-A","ver":"A","ngay":"2026-06-04","tt":"Đang hiệu lực","ghi":"Căn cứ biên bản hồ sơ cọc"},{"ten":"Shop drawing Kingpost","so":"TTHC-BXN-SUN-FCS-SHO-0004-A","ver":"A","ngay":"2026-06-12","tt":"Đang hiệu lực","ghi":"Kiểm tra lắp đặt Kingpost"},{"ten":"Shop drawing tường vây","so":"TTHC-BXN-SUN-FCS-SHO-0003 · DW Rev05","ver":"Rev05","ngay":"2026-07-08","tt":"Đang hiệu lực","ghi":"Gioăng cản nước +1,05 → −8,80"},{"ten":"ITP cọc khoan nhồi + Kingpost","so":"TTHC-BXN-SUN-FCS-ITP-0001-C","ver":"C","ngay":"2026-06-06","tt":"Đồng ý kèm điều kiện","ghi":"BQLDA: phê duyệt ITP, checklist phù hợp BVTK, spec, HĐ"},{"ten":"ITP tường vây","so":"TTHC-BXN-SUN-FCS-ITP-0003-A","ver":"A","ngay":"2026-06-01","tt":"Đồng ý kèm điều kiện","ghi":"Nước thủy cục để trộn bentonite"},{"ten":"ITP tường dẫn","so":"TTHC-BXN-SUN-FCS-ITP-0002-A","ver":"A","ngay":"2026-06-01","tt":"Đồng ý kèm điều kiện","ghi":"Bê tông lót B10, tường dẫn B15"}]};
const TC_SEED_CFG = {
  info:Object.assign({}, TC_ITP.info, { mau:1 }),
  levels:[['±0,000 sàn T1 (hòn dấu)', 2.75], ['Mặt bằng thi công', 2.5], ['Đỉnh thép tường vây', 1.6], ['SSL tường vây', -1.1], ['Sàn hầm B1', -2.6], ['Sàn hầm B2', -6.2], ['Cắt đầu cọc (COL)', -6.25], ['Gioăng cản nước (đáy)', -8.8], ['Đáy tường vây', -26.35], ['Mũi cọc P3/P4', -60.5], ['Mũi cọc P1/P2', -65.5]],
  limits:TC_ITP.limits,
  hold:{ batBuoc:1 },
  res:{ to:['Tổ khoan 1', 'Tổ khoan 2', 'Tổ cạp', 'Tổ thép 01', 'Tổ thép 02', 'Tổ bê tông 1', 'Tổ bê tông 2', 'Tổ dung dịch', 'Trắc đạc'],
    may:[['KH-01', 'Máy khoan cọc đại trà 80–125 kNm', 'Khoan'], ['MC-01', 'Gàu cạp tường vây D800 + cẩu 150T', 'Cạp'], ['C50', 'Cẩu 50T phục vụ khoan', 'Cẩu'], ['C150', 'Cẩu 150T', 'Cẩu'], ['DA-01', 'Máy đào 0,8 m³', 'Đào']],
    do:[['Koden DM-686', '2026-12-15'], ['Máy toàn đạc TĐ-02', '2026-10-02'], ['Côn đo độ sụt', '2027-03-01'], ['Bộ thí nghiệm dung dịch', '2027-01-20']],
    tram:['Trạm theo danh mục được giao'], capPhoi:['B30 · sụt 19±1 (cọc)', 'B35-W8 · sụt 19±1 (tường vây)'] },
  docs:TC_ITP.docs.concat([{ ten:'Shop drawing cọc đại trà', so:'TTHC-FCS-SD-00 → 16', ver:'B', ngay:'2026-07-04', tt:'Đồng ý kèm điều kiện', ghi:'PYCCT 0002-B · cập nhật theo PMI 29/2026 & email PMU 03/07' },
    { ten:'Shop drawing cọc đại trà', so:'TTHC-FCS-SD-00 → 16', ver:'A', ngay:'2026-06-04', tt:'Hết hiệu lực', ghi:'Cọc thi công trước khi B có hiệu lực vẫn gắn version A' },
    { ten:'Shop drawing tường vây', so:'FCS-TTHC-SHOP_DRAWING_DW', ver:'Rev05', ngay:'2026-07-08', tt:'Đang hiệu lực', ghi:'Gioăng cản nước +1,05 → −8,80 · SSL −1,10' }]),
  boq:[['A', 'Cọc khoan nhồi D1000 · 366 cọc'], ['Khoan tạo lỗ', 'm', 19771.76, 23653, 'coc', 'L'], ['Cốt thép cọc', 'tấn', 1814.57, 1304.82, 'coc', 'thep'], ['Bê tông B30', 'm³', 0, 16053.93, 'coc', 'v'], ['Cóc nối', 'bộ', 75662, 26792, 'coc', ''],
    ['B', 'Tường vây 0,8 m · 117 panel · 642,32 m'], ['Cạp tạo lỗ D800', 'm³', 0, 13540.21, 'tv', 'vd'], ['Cốt thép tường vây', 'tấn', 2081.82, 2002.04, 'tv', ''], ['Bê tông B35-W8', 'm³', 10608, 13720.26, 'tv', 'v'], ['Ống siêu âm D59,9', 'm', 15604.7, 15820, 'tv', ''], ['Băng cản nước 250×10', 'm', 1535.14, 1152.45, 'tv', '']],
  itp:TC_ITP.itp,
  sec:{ truc:'H' },
  ca:{ ngay:['07:00', '19:00'] }
};
const TC_SEED_TTHC = {"p":[["P1.95","P1",1191514.997,605961.502,1,"A-1","nt"],["P1.72","P1",1191522.495,605958.183,1,"B-1","nt"],["P1.69","P1",1191529.993,605954.864,1,"C-1","nt"],["P1.66","P1",1191537.492,605951.545,1,"D-1","nt"],["P1.63","P1",1191544.99,605948.226,1,"E-1","nt"],["P1.59","P1",1191552.488,605944.908,1,"F-1","nt"],["P1.54","P1",1191559.987,605941.589,1,"G-1","nt"],["P1.96","P1",1191518.315,605969.0,1,"A-2","nt"],["P1.73","P1",1191525.814,605965.681,1,"B-2","nt"],["P1.70","P1",1191533.312,605962.363,1,"C-2","nt"],["P1.67","P1",1191540.81,605959.044,1,"D-2","nt"],["P1.64","P1",1191548.309,605955.725,1,"E-2","nt"],["P1.60","P1",1191555.807,605952.406,1,"F-2","nt"],["P1.55","P1",1191563.305,605949.087,1,"G-2","nt"],["P1.97","P1",1191521.634,605976.499,1,"A-3","nt"],["P1.74","P1",1191529.133,605973.18,1,"B-3","nt"],["P3.222","P3",1191536.631,605969.861,1,"C-3","nt"],["P3.205","P3",1191544.129,605966.542,1,"D-3","nt"],["P3.187","P3",1191551.628,605963.223,1,"E-3","nt"],["P3.167","P3",1191559.126,605959.904,1,"F-3","nt"],["P1.56","P1",1191566.624,605956.585,1,"G-3","nt"],["P1.51","P1",1191574.123,605953.266,1,"H-3","nt"],["P1.98","P1",1191524.953,605983.997,1,"A-4","nt"],["P1.75","P1",1191532.452,605980.678,1,"B-4","nt"],["P3.223","P3",1191539.95,605977.359,1,"C-4","nt"],["P3.206","P3",1191547.448,605974.04,1,"D-4","nt"],["P3.188","P3",1191554.947,605970.721,1,"E-4","nt"],["P3.168","P3",1191562.445,605967.403,1,"F-4","nt"],["P3.148","P3",1191569.943,605964.084,1,"G-4","nt"],["P1.52","P1",1191577.442,605960.765,1,"H-4","nt"],["P1.48","P1",1191584.94,605957.446,1,"J-4","nt"],["P1.99","P1",1191528.272,605991.495,1,"A-5","nt"],["P1.76","P1",1191535.77,605988.176,1,"B-5","nt"],["P3.224","P3",1191543.269,605984.858,1,"C-5","nt"],["P3.207","P3",1191550.767,605981.539,1,"D-5","nt"],["P3.189","P3",1191558.265,605978.22,1,"E-5","nt"],["P3.169","P3",1191565.764,605974.901,1,"F-5","nt"],["P3.149","P3",1191573.262,605971.582,1,"G-5","nt"],["P3.129","P3",1191580.76,605968.263,1,"H-5","nt"],["P1.49","P1",1191588.259,605964.944,1,"J-5","nt"],["P1.43","P1",1191595.757,605961.625,1,"K-5","nt"],["P1.100","P1",1191531.591,605998.994,1,"A-6","nt"],["P1.77","P1",1191539.089,605995.675,1,"B-6","nt"],["P3.225","P3",1191546.588,605992.356,1,"C-6","nt"],["P3.208","P3",1191554.086,605989.037,1,"D-6","nt"],["P3.190","P3",1191561.584,605985.718,1,"E-6","nt"],["P3.170","P3",1191569.083,605982.399,1,"F-6","nt"],["P3.150","P3",1191576.581,605979.08,1,"G-6","nt"],["P3.130","P3",1191584.079,605975.761,1,"H-6","nt"],["P3.111","P3",1191591.578,605972.442,1,"J-6","nt"],["P1.44","P1",1191599.076,605969.124,1,"K-6","nt"],["P1.38","P1",1191606.574,605965.805,5,"L-6","nt"],["P1.101","P1",1191534.91,606006.492,1,"A-7","nt"],["P1.78","P1",1191542.408,606003.173,1,"B-7","nt"],["P3.226","P3",1191549.907,605999.854,1,"C-7","nt"],["P3.209","P3",1191557.405,605996.535,1,"D-7","nt"],["P3.191","P3",1191564.903,605993.216,1,"E-7","nt"],["P3.171","P3",1191572.402,605989.897,1,"F-7","nt"],["P3.151","P3",1191579.9,605986.579,1,"G-7","nt"],["P3.131","P3",1191587.398,605983.26,1,"H-7","nt"],["P3.112","P3",1191594.897,605979.941,1,"J-7","nt"],["P1.45","P1",1191602.395,605976.622,1,"K-7","nt"],["P1.39","P1",1191609.893,605973.303,5,"L-7","nt"],["P1.102","P1",1191538.229,606013.99,2,"A-8","nt"],["P1.79","P1",1191545.727,606010.671,2,"B-8","nt"],["P3.227","P3",1191553.225,606007.353,2,"C-8","nt"],["P3.210","P3",1191560.724,606004.034,2,"D-8","nt"],["P3.192","P3",1191568.222,606000.715,2,"E-8","nt"],["P3.172","P3",1191575.72,605997.396,2,"F-8","nt"],["P3.152","P3",1191583.219,605994.077,2,"G-8","nt"],["P3.132","P3",1191590.717,605990.758,2,"H-8","nt"],["P3.113","P3",1191598.215,605987.439,2,"J-8","nt"],["P3.95","P3",1191605.714,605984.12,2,"K-8","nt"],["P1.40","P1",1191613.212,605980.801,6,"L-8","nt"],["P1.35","P1",1191620.71,605977.482,6,"M-8","nt"],["P1.103","P1",1191541.548,606021.489,2,"A-9","nt"],["P1.80","P1",1191549.046,606018.17,2,"B-9","nt"],["P3.228","P3",1191556.544,606014.851,2,"C-9","nt"],["P3.211","P3",1191564.043,606011.532,2,"D-9","nt"],["P3.193","P3",1191571.541,606008.213,2,"E-9","nt"],["P3.173","P3",1191579.039,606004.894,2,"F-9","nt"],["P3.153","P3",1191586.538,606001.575,2,"G-9","nt"],["P3.133","P3",1191594.036,605998.256,2,"H-9","nt"],["P3.114","P3",1191601.534,605994.937,2,"J-9","nt"],["P3.96","P3",1191609.033,605991.619,2,"K-9","nt"],["P3.80","P3",1191616.531,605988.3,6,"L-9","nt"],["P1.36","P1",1191624.029,605984.981,6,"M-9","nt"],["P1.32","P1",1191631.528,605981.662,6,"N-9","nt"],["P1.104","P1",1191544.867,606028.987,2,"A-10","dd"],["P1.81","P1",1191552.365,606025.668,2,"B-10","dd"],["P4.5","P4",1191559.863,606022.349,2,"C-10","dd"],["P3.212","P3",1191567.362,606019.03,2,"D-10","dd"],["P3.194","P3",1191574.86,606015.711,2,"E-10","dd"],["P3.174","P3",1191582.358,606012.392,2,"F-10","dd"],["P3.154","P3",1191589.857,606009.074,2,"G-10","dd"],["P3.134","P3",1191597.355,606005.755,2,"H-10","dd"],["P3.115","P3",1191604.853,606002.436,2,"J-10","dd"],["P3.97","P3",1191612.352,605999.117,2,"K-10","dd"],["P3.81","P3",1191619.85,605995.798,6,"L-10","dd"],["P3.65","P3",1191627.348,605992.479,6,"M-10","dd"],["P1.33","P1",1191634.847,605989.16,6,"N-10","dd"],["P1.27","P1",1191642.345,605985.841,6,"P-10","dd"],["P1.105","P1",1191548.186,606036.485,2,"A-11","dd"],["P1.82","P1",1191555.684,606033.166,2,"B-11","dd"],["P2.2","P2",1191563.182,606029.847,2,"C-11","dd"],["P4.3","P4",1191570.681,606026.529,2,"D-11","dd"],["P4.1","P4",1191578.179,606023.21,2,"E-11","dd"],["P3.175","P3",1191585.677,606019.891,2,"F-11","dd"],["P3.155","P3",1191593.176,606016.572,2,"G-11","dd"],["P3.135","P3",1191600.674,606013.253,2,"H-11","dd"],["P3.116","P3",1191608.172,606009.934,2,"J-11","dd"],["P3.98","P3",1191615.67,606006.615,2,"K-11","dd"],["P3.82","P3",1191623.169,606003.296,6,"L-11","dd"],["P3.66","P3",1191630.667,605999.977,6,"M-11","dd"],["P3.51","P3",1191638.165,605996.659,6,"N-11","dd"],["P1.28","P1",1191645.664,605993.34,6,"P-11","dd"],["P1.106","P1",1191551.504,606043.984,2,"A-12","dd"],["P1.83","P1",1191559.003,606040.665,2,"B-12","dd"],["P2.3","P2",1191566.501,606037.346,2,"C-12","dd"],["P2.1","P2",1191573.999,606034.027,2,"D-12","dd"],["P4.2","P4",1191581.498,606030.708,2,"E-12","dd"],["P3.176","P3",1191588.996,606027.389,2,"F-12","dd"],["P3.156","P3",1191596.494,606024.07,2,"G-12","dd"],["P3.136","P3",1191603.993,606020.751,2,"H-12","dd"],["P3.117","P3",1191611.491,606017.432,2,"J-12","dd"],["P3.99","P3",1191618.989,606014.114,2,"K-12","dd"],["P3.83","P3",1191626.488,606010.795,6,"L-12","dd"],["P3.67","P3",1191633.986,606007.476,6,"M-12","dd"],["P3.52","P3",1191641.484,606004.157,6,"N-12","dd"],["P1.29","P1",1191648.983,606000.838,6,"P-12","dd"],["P1.23","P1",1191656.481,605997.519,6,"Q-12","dd"],["P1.107","P1",1191554.823,606051.482,2,"A-13","dd"],["P1.84","P1",1191562.322,606048.163,2,"B-13","dd"],["P4.6","P4",1191569.82,606044.844,2,"C-13","dd"],["P4.4","P4",1191577.318,606041.525,2,"D-13","dd"],["P3.195","P3",1191584.817,606038.206,2,"E-13","dd"],["P3.177","P3",1191592.315,606034.887,2,"F-13","dd"],["P3.157","P3",1191599.813,606031.569,2,"G-13","dd"],["P3.137","P3",1191607.312,606028.25,2,"H-13","dd"],["P3.118","P3",1191614.81,606024.931,2,"J-13","dd"],["P3.100","P3",1191622.308,606021.612,2,"K-13","dd"],["P3.84","P3",1191629.807,606018.293,6,"L-13","dd"],["P3.68","P3",1191637.305,606014.974,6,"M-13","dd"],["P3.53","P3",1191644.803,606011.655,6,"N-13","dd"],["P3.39","P3",1191652.302,606008.336,6,"P-13","dd"],["P1.24","P1",1191659.8,606005.017,6,"Q-13","dd"],["P1.20","P1",1191667.298,606001.698,6,"R-13","dd"],["P1.108","P1",1191558.142,606058.98,2,"A-14","dd"],["P1.85","P1",1191565.641,606055.661,2,"B-14","dd"],["P4.7","P4",1191573.139,606052.342,2,"C-14","dd"],["P3.213","P3",1191580.637,606049.024,2,"D-14","dd"],["P3.196","P3",1191588.136,606045.705,2,"E-14","dd"],["P3.178","P3",1191595.634,606042.386,2,"F-14","dd"],["P3.158","P3",1191603.132,606039.067,2,"G-14","dd"],["P3.138","P3",1191610.631,606035.748,2,"H-14","dd"],["P3.119","P3",1191618.129,606032.429,2,"J-14","dd"],["P3.101","P3",1191625.627,606029.11,2,"K-14","dd"],["P3.85","P3",1191633.126,606025.791,6,"L-14","dd"],["P3.69","P3",1191640.624,606022.472,6,"M-14","dd"],["P3.54","P3",1191648.122,606019.154,6,"N-14","dd"],["P3.40","P3",1191655.62,606015.835,6,"P-14","dd"],["P3.28","P3",1191663.119,606012.516,6,"Q-14","dd"],["P1.21","P1",1191670.617,606009.197,6,"R-14","dd"],["P1.16","P1",1191678.115,606005.878,6,"S-14","dd"],["P1.109","P1",1191561.461,606066.479,3,"A-15","dd"],["P1.86","P1",1191568.959,606063.16,3,"B-15","dd"],["P3.229","P3",1191576.458,606059.841,3,"C-15","dd"],["P3.214","P3",1191583.956,606056.522,3,"D-15","dd"],["P3.197","P3",1191591.454,606053.203,3,"E-15","dd"],["P3.179","P3",1191598.953,606049.884,3,"F-15","dd"],["P3.159","P3",1191606.451,606046.565,3,"G-15","dd"],["P3.139","P3",1191613.949,606043.246,3,"H-15","dd"],["P3.120","P3",1191621.448,606039.927,3,"J-15","dd"],["P3.102","P3",1191628.946,606036.609,3,"K-15","dd"],["P3.86","P3",1191636.444,606033.29,7,"L-15","dd"],["P3.70","P3",1191643.943,606029.971,7,"M-15","dd"],["P3.55","P3",1191651.441,606026.652,7,"N-15","dd"],["P3.41","P3",1191658.939,606023.333,7,"P-15","dd"],["P3.29","P3",1191666.438,606020.014,7,"Q-15","dd"],["P3.17","P3",1191673.936,606016.695,7,"R-15","dd"],["P1.17","P1",1191681.434,606013.376,7,"S-15","dd"],["P1.10","P1",1191688.933,606010.057,7,"T-15","dd"],["P1.110","P1",1191564.78,606073.977,3,"A-16","dd"],["P1.87","P1",1191572.278,606070.658,3,"B-16","dd"],["P3.230","P3",1191579.777,606067.339,3,"C-16","dd"],["P3.215","P3",1191587.275,606064.02,3,"D-16","dd"],["P3.198","P3",1191594.773,606060.701,3,"E-16","dd"],["P3.180","P3",1191602.272,606057.382,3,"F-16","dd"],["P3.160","P3",1191609.77,606054.064,3,"G-16","dd"],["P3.140","P3",1191617.268,606050.745,3,"H-16","dd"],["P3.121","P3",1191624.767,606047.426,3,"J-16","dd"],["P3.103","P3",1191632.265,606044.107,3,"K-16","dd"],["P3.87","P3",1191639.763,606040.788,7,"L-16","dd"],["P3.71","P3",1191647.262,606037.469,7,"M-16","dd"],["P3.56","P3",1191654.76,606034.15,7,"N-16","dd"],["P3.42","P3",1191662.258,606030.831,7,"P-16","dd"],["P3.30","P3",1191669.757,606027.512,7,"Q-16","dd"],["P3.18","P3",1191677.255,606024.193,7,"R-16","dd"],["P1.18","P1",1191684.753,606020.875,7,"S-16","dd"],["P1.11","P1",1191692.252,606017.556,7,"T-16","tt"],["P1.111","P1",1191568.099,606081.475,3,"A-17","dd"],["P1.88","P1",1191575.597,606078.156,3,"B-17","dd"],["P3.231","P3",1191583.096,606074.837,3,"C-17","dd"],["P3.216","P3",1191590.594,606071.519,3,"D-17","dd"],["P3.199","P3",1191598.092,606068.2,3,"E-17","dd"],["P3.181","P3",1191605.591,606064.881,3,"F-17","dd"],["P3.161","P3",1191613.089,606061.562,3,"G-17","dd"],["P3.141","P3",1191620.587,606058.243,3,"H-17","dd"],["P3.122","P3",1191628.086,606054.924,3,"J-17","dd"],["P3.104","P3",1191635.584,606051.605,3,"K-17","dd"],["P3.88","P3",1191643.082,606048.286,7,"L-17","dd"],["P3.72","P3",1191650.581,606044.967,7,"M-17","dd"],["P3.57","P3",1191658.079,606041.648,7,"N-17","dd"],["P3.43","P3",1191665.577,606038.33,7,"P-17","dd"],["P3.31","P3",1191673.076,606035.011,7,"Q-17","dd"],["P3.19","P3",1191680.574,606031.692,7,"R-17","dd"],["P3.8","P3",1191688.072,606028.373,7,"S-17","dd"],["P1.12","P1",1191695.57,606025.054,7,"T-17","dd"],["P1.1","P1",1191703.069,606021.735,7,"U-17","dd"],["P1.112","P1",1191571.418,606088.974,3,"A-18","dd"],["P1.89","P1",1191578.916,606085.655,3,"B-18","dd"],["P3.232","P3",1191586.414,606082.336,3,"C-18","dd"],["P3.217","P3",1191593.913,606079.017,3,"D-18","dd"],["P3.200","P3",1191601.411,606075.698,3,"E-18","dd"],["P3.182","P3",1191608.909,606072.379,3,"F-18","dd"],["P3.162","P3",1191616.408,606069.06,3,"G-18","dd"],["P3.142","P3",1191623.906,606065.741,3,"H-18","dd"],["P3.123","P3",1191631.404,606062.422,3,"J-18","dd"],["P3.105","P3",1191638.903,606059.104,3,"K-18","dd"],["P3.89","P3",1191646.401,606055.785,7,"L-18","dd"],["P3.73","P3",1191653.899,606052.466,7,"M-18","dd"],["P3.58","P3",1191661.398,606049.147,7,"N-18","dd"],["P3.44","P3",1191668.896,606045.828,7,"P-18","dd"],["P3.32","P3",1191676.394,606042.509,7,"Q-18","dd"],["P3.20","P3",1191683.893,606039.19,7,"R-18","dd"],["P3.9","P3",1191691.391,606035.871,7,"S-18","dd"],["P3.1","P3",1191698.889,606032.552,7,"T-18","dd"],["P1.2","P1",1191706.388,606029.233,7,"U-18","dd"],["P1.113","P1",1191574.737,606096.472,3,"A-19","dd"],["P1.90","P1",1191582.235,606093.153,3,"B-19","dd"],["P3.233","P3",1191589.733,606089.834,3,"C-19","dd"],["P3.218","P3",1191597.232,606086.515,3,"D-19","dd"],["P3.201","P3",1191604.73,606083.196,3,"E-19","dd"],["P3.183","P3",1191612.228,606079.877,3,"F-19","dd"],["P3.163","P3",1191619.727,606076.559,3,"G-19","dd"],["P3.143","P3",1191627.225,606073.24,3,"H-19","dl"],["P3.124","P3",1191634.723,606069.921,3,"J-19","dl"],["P3.106","P3",1191642.222,606066.602,3,"K-19","sl"],["P3.90","P3",1191649.72,606063.283,7,"L-19","sl"],["P3.74","P3",1191657.218,606059.964,7,"M-19","sl"],["P3.59","P3",1191664.717,606056.645,7,"N-19","sl"],["P3.45","P3",1191672.215,606053.326,7,"P-19","sl"],["P3.33","P3",1191679.713,606050.007,7,"Q-19","sl"],["P3.21","P3",1191687.212,606046.688,7,"R-19","sl"],["P3.10","P3",1191694.71,606043.37,7,"S-19","sl"],["P3.2","P3",1191702.208,606040.051,7,"T-19","cl"],["P1.3","P1",1191709.707,606036.732,7,"U-19","cl"],["P1.114","P1",1191578.056,606103.97,3,"A-20","cl"],["P1.91","P1",1191585.554,606100.651,3,"B-20","cl"],["P3.234","P3",1191593.052,606097.332,3,"C-20","cl"],["P3.219","P3",1191600.551,606094.014,3,"D-20","cl"],["P3.202","P3",1191608.049,606090.695,3,"E-20","cl"],["P3.184","P3",1191615.547,606087.376,3,"F-20","cl"],["P3.164","P3",1191623.046,606084.057,3,"G-20","cl"],["P3.144","P3",1191630.544,606080.738,3,"H-20","cl"],["P3.125","P3",1191638.042,606077.419,3,"J-20","cl"],["P3.107","P3",1191645.541,606074.1,3,"K-20","cl"],["P3.91","P3",1191653.039,606070.781,7,"L-20","cl"],["P3.75","P3",1191660.537,606067.462,7,"M-20","cl"],["P3.60","P3",1191668.036,606064.143,7,"N-20","cl"],["P3.46","P3",1191675.534,606060.825,7,"P-20","cl"],["P3.34","P3",1191683.032,606057.506,7,"Q-20","cl"],["P3.22","P3",1191690.531,606054.187,7,"R-20","cl"],["P3.11","P3",1191698.029,606050.868,7,"S-20","cl"],["P3.3","P3",1191705.527,606047.549,7,"T-20","cl"],["P1.4","P1",1191713.026,606044.23,7,"U-20","cl"],["P1.115","P1",1191581.375,606111.469,4,"A-21","cl"],["P1.92","P1",1191588.873,606108.15,4,"B-21","cl"],["P3.235","P3",1191596.371,606104.831,4,"C-21","cl"],["P3.220","P3",1191603.869,606101.512,4,"D-21","cl"],["P3.203","P3",1191611.368,606098.193,4,"E-21","cl"],["P3.185","P3",1191618.866,606094.874,4,"F-21","cl"],["P3.165","P3",1191626.364,606091.555,4,"G-21","cl"],["P3.145","P3",1191633.863,606088.236,4,"H-21","cl"],["P3.126","P3",1191641.361,606084.917,4,"J-21","cl"],["P3.108","P3",1191648.859,606081.598,4,"K-21","cl"],["P3.92","P3",1191656.358,606078.28,8,"L-21","cl"],["P3.76","P3",1191663.856,606074.961,8,"M-21","cl"],["P3.61","P3",1191671.354,606071.642,8,"N-21","cl"],["P3.47","P3",1191678.853,606068.323,8,"P-21","cl"],["P3.35","P3",1191686.351,606065.004,8,"Q-21","cl"],["P3.23","P3",1191693.849,606061.685,8,"R-21","cl"],["P3.12","P3",1191701.348,606058.366,8,"S-21","cl"],["P3.4","P3",1191708.846,606055.047,8,"T-21","cl"],["P1.5","P1",1191716.344,606051.728,8,"U-21","cl"],["P1.116","P1",1191584.693,606118.967,4,"A-22","cl"],["P1.93","P1",1191592.192,606115.648,4,"B-22","cl"],["P3.236","P3",1191599.69,606112.329,4,"C-22","cl"],["P3.221","P3",1191607.188,606109.01,4,"D-22","cl"],["P3.204","P3",1191614.687,606105.691,4,"E-22","cl"],["P3.186","P3",1191622.185,606102.372,4,"F-22","cl"],["P3.166","P3",1191629.683,606099.054,4,"G-22","cl"],["P3.146","P3",1191637.182,606095.735,4,"H-22","cl"],["P3.127","P3",1191644.68,606092.416,4,"J-22","cl"],["P3.109","P3",1191652.178,606089.097,4,"K-22","cl"],["P3.93","P3",1191659.677,606085.778,8,"L-22","cl"],["P3.77","P3",1191667.175,606082.459,8,"M-22","cl"],["P3.62","P3",1191674.673,606079.14,8,"N-22","cl"],["P3.48","P3",1191682.172,606075.821,8,"P-22","cl"],["P3.36","P3",1191689.67,606072.502,8,"Q-22","cl"],["P3.24","P3",1191697.168,606069.183,8,"R-22","cl"],["P3.13","P3",1191704.667,606065.865,8,"S-22","cl"],["P3.5","P3",1191712.165,606062.546,8,"T-22","cl"],["P1.6","P1",1191719.663,606059.227,8,"U-22","cl"],["P1.94","P1",1191595.511,606123.146,4,"B-23","cl"],["P1.71","P1",1191603.009,606119.827,4,"C-23","cl"],["P1.68","P1",1191610.507,606116.509,4,"D-23","cl"],["P1.65","P1",1191618.006,606113.19,4,"E-23","cl"],["P1.61","P1",1191625.504,606109.871,4,"F-23","cl"],["P1.57","P1",1191633.002,606106.552,4,"G-23","cl"],["P3.147","P3",1191640.501,606103.233,4,"H-23","cl"],["P3.128","P3",1191647.999,606099.914,4,"J-23","cl"],["P3.110","P3",1191655.497,606096.595,4,"K-23","cl"],["P3.94","P3",1191662.996,606093.276,8,"L-23","cl"],["P3.78","P3",1191670.494,606089.957,8,"M-23","cl"],["P3.63","P3",1191677.992,606086.638,8,"N-23","cl"],["P3.49","P3",1191685.491,606083.32,8,"P-23","cl"],["P3.37","P3",1191692.989,606080.001,8,"Q-23","cl"],["P3.25","P3",1191700.487,606076.682,8,"R-23","cl"],["P3.14","P3",1191707.986,606073.363,8,"S-23","cl"],["P3.6","P3",1191715.484,606070.044,8,"T-23","cl"],["P1.7","P1",1191722.982,606066.725,8,"U-23","cl"],["P1.62","P1",1191628.823,606117.369,4,"F-24","cl"],["P1.58","P1",1191636.321,606114.05,4,"G-24","cl"],["P1.53","P1",1191643.819,606110.731,4,"H-24","cl"],["P1.50","P1",1191651.318,606107.412,4,"J-24","cl"],["P1.46","P1",1191658.816,606104.093,4,"K-24","cl"],["P1.41","P1",1191666.314,606100.775,8,"L-24","cl"],["P3.79","P3",1191673.813,606097.456,8,"M-24","cl"],["P3.64","P3",1191681.311,606094.137,8,"N-24","cl"],["P3.50","P3",1191688.809,606090.818,8,"P-24","cl"],["P3.38","P3",1191696.308,606087.499,8,"Q-24","cl"],["P3.26","P3",1191703.806,606084.18,8,"R-24","cl"],["P3.15","P3",1191711.304,606080.861,8,"S-24","cl"],["P3.7","P3",1191718.803,606077.542,8,"T-24","cl"],["P1.8","P1",1191726.301,606074.223,8,"U-24","cl"],["P1.47","P1",1191662.135,606111.592,4,"K-25","cl"],["P1.42","P1",1191669.633,606108.273,8,"L-25","cl"],["P1.37","P1",1191677.132,606104.954,8,"M-25","cl"],["P1.34","P1",1191684.63,606101.635,8,"N-25","cl"],["P1.30","P1",1191692.128,606098.316,8,"P-25","cl"],["P1.25","P1",1191699.627,606094.997,8,"Q-25","cl"],["P3.27","P3",1191707.125,606091.678,8,"R-25","cl"],["P3.16","P3",1191714.623,606088.36,8,"S-25","cl"],["P1.13","P1",1191722.122,606085.041,8,"T-25","cl"],["P1.9","P1",1191729.62,606081.722,8,"U-25","cl"],["P1.31","P1",1191695.447,606105.815,8,"P-26","cl"],["P1.26","P1",1191702.946,606102.496,8,"Q-26","cl"],["P1.22","P1",1191710.444,606099.177,8,"R-26","cl"],["P1.19","P1",1191717.942,606095.858,8,"S-26","cl"],["P1.14","P1",1191725.441,606092.539,8,"T-26","cl"],["P1.15","P1",1191728.759,606100.037,8,"T-27","cl"],["TP.01","TP",1191571.541,605968.188,0,"F-4","nt"],["TP.02","TP",1191611.521,606017.747,0,"H-12","nt"],["TP.03","TP",1191683.533,606048.754,0,"P-19","nt"],["TP.04","TP",1191649.702,606095.114,0,"J-22","nt"]],"w":[["P1","TIẾP",1191514.221,605965.927,1191511.901,605960.685,"DW-043",5.732,"nt"],["P2","TIẾP",1191511.901,605960.685,1191520.338,605956.951,"DW-017",9.226,"nt"],["P3","TIẾP",1191520.338,605956.951,1191525.459,605954.684,"DW-017",5.6,"nt"],["P4","ĐÓNG",1191525.459,605954.684,1191530.579,605952.417,"DW-013",5.6,"nt"],["P5","TIẾP",1191530.579,605952.417,1191535.7,605950.151,"DW-017",5.6,"nt"],["P6","TIẾP",1191535.7,605950.151,1191540.821,605947.884,"DW-017",5.6,"nt"],["P7","TIẾP",1191540.821,605947.884,1191545.942,605945.618,"DW-017",5.6,"nt"],["P8","TIẾP",1191545.942,605945.618,1191551.063,605943.351,"DW-017",5.6,"nt"],["P9","TIẾP",1191551.063,605943.351,1191555.587,605941.349,"DW-017",4.947,"nt"],["P10","TIẾP",1191555.587,605941.349,1191561.006,605938.95,"DW-027",5.927,"nt"],["P11","TIẾP",1191561.006,605938.95,1191565.583,605941.413,"DW-045",5.198,"nt"],["P12","TIẾP",1191565.583,605941.413,1191570.029,605943.805,"DW-017",5.048,"nt"],["P13","MỞ",1191570.029,605943.805,1191574.961,605946.458,"DW-011",5.6,"nt"],["P14","TIẾP",1191574.961,605946.458,1191579.892,605949.111,"DW-017",5.6,"nt"],["P15","TIẾP",1191579.892,605949.111,1191584.824,605951.764,"DW-017",5.6,"nt"],["P16","TIẾP",1191584.824,605951.764,1191589.755,605954.418,"DW-017",5.6,"nt"],["P17","TIẾP",1191589.755,605954.418,1191594.687,605957.071,"DW-017",5.6,"nt"],["P18","TIẾP",1191594.687,605957.071,1191599.619,605959.724,"DW-017",5.6,"nt"],["P19","TIẾP",1191599.619,605959.724,1191604.55,605962.378,"DW-017",5.6,"nt"],["P20","TIẾP",1191604.55,605962.378,1191609.482,605965.031,"DW-017",5.6,"nt"],["P21","TIẾP",1191609.482,605965.031,1191614.413,605967.684,"DW-017",5.6,"nt"],["P22","TIẾP",1191614.413,605967.684,1191619.345,605970.337,"DW-017",5.6,"nt"],["P23","TIẾP",1191619.345,605970.337,1191624.276,605972.991,"DW-017",5.6,"nt"],["P24","ĐÓNG",1191624.276,605972.991,1191629.208,605975.644,"DW-013",5.6,"nt"],["P25","TIẾP",1191629.208,605975.644,1191634.139,605978.297,"DW-017",5.6,"nt"],["P26","TIẾP",1191634.139,605978.297,1191639.071,605980.95,"DW-017",5.6,"nt"],["P27","TIẾP",1191639.071,605980.95,1191644.003,605983.604,"DW-017",5.6,"nt"],["P28","TIẾP",1191644.003,605983.604,1191648.934,605986.257,"DW-017",5.6,"nt"],["P29","TIẾP",1191648.934,605986.257,1191653.866,605988.91,"DW-017",5.6,"nt"],["P30","TIẾP",1191653.866,605988.91,1191658.797,605991.563,"DW-017",5.6,"nt"],["P31","TIẾP",1191658.797,605991.563,1191663.729,605994.217,"DW-017",5.6,"nt"],["P32","TIẾP",1191663.729,605994.217,1191668.66,605996.87,"DW-017",5.6,"nt"],["P33","TIẾP",1191668.66,605996.87,1191673.592,605999.523,"DW-017",5.6,"nt"],["P34","TIẾP",1191673.592,605999.523,1191678.523,606002.177,"DW-017",5.6,"nt"],["P35","TIẾP",1191678.523,606002.177,1191683.455,606004.83,"DW-017",5.6,"nt"],["P36","TIẾP",1191683.455,606004.83,1191688.386,606007.483,"DW-017",5.6,"nt"],["P37","TIẾP",1191688.386,606007.483,1191693.318,606010.136,"DW-017",5.6,"nt"],["P38","TIẾP",1191693.318,606010.136,1191698.25,606012.79,"DW-017",5.6,"nt"],["P39","TIẾP",1191698.25,606012.79,1191703.181,606015.443,"DW-017",5.6,"nt"],["P40","TIẾP",1191703.181,606015.443,1191707.572,606017.805,"DW-017",4.986,"nt"],["P41","TIẾP",1191707.572,606017.805,1191711.722,606020.038,"DW-031",4.712,"dd"],["P42","TIẾP",1191711.722,606020.038,1191713.594,606024.268,"DW-047",4.626,"dd"],["P43","TIẾP",1191713.594,606024.268,1191715.702,606029.031,"DW-017",5.208,"dd"],["P44","MỞ",1191715.702,606029.031,1191717.969,606034.152,"DW-011",5.6,"dd"],["P45","TIẾP",1191717.969,606034.152,1191720.236,606039.272,"DW-017",5.6,"dd"],["P46","TIẾP",1191720.236,606039.272,1191722.502,606044.393,"DW-017",5.6,"dd"],["P47","TIẾP",1191722.502,606044.393,1191724.769,606049.514,"DW-017",5.6,"dd"],["P48","TIẾP",1191724.769,606049.514,1191727.035,606054.635,"DW-017",5.6,"dd"],["P49","TIẾP",1191727.035,606054.635,1191729.302,606059.756,"DW-017",5.6,"dd"],["P50","TIẾP",1191729.302,606059.756,1191732.045,606065.952,"DW-017",6.777,"dd"],["P51","ĐÓNG",1191732.045,606065.952,1191734.504,606071.509,"DW-013",6.077,"dd"],["P52","TIẾP",1191734.504,606071.509,1191736.634,606076.321,"DW-019",5.262,"dd"],["P53","TIẾP",1191736.634,606076.321,1191735.709,606081.805,"DW-041",5.561,"dd"],["P54","TIẾP",1191735.709,606081.805,1191734.786,606087.273,"DW-017",5.546,"dd"],["P55","TIẾP",1191734.786,606087.273,1191733.969,606092.116,"DW-017",4.911,"dd"],["P56","TIẾP",1191733.969,606092.116,1191733.291,606096.13,"DW-017",4.071,"dd"],["P57","TIẾP",1191733.291,606096.13,1191732.568,606100.415,"DW-021",4.346,"dd"],["P58","TIẾP",1191732.568,606100.415,1191732.167,606102.794,"DW-039",2.412,"dd"],["P59","TIẾP",1191732.167,606102.794,1191726.992,606103.696,"DW-025",5.253,"dd"],["P60","TIẾP",1191726.992,606103.696,1191721.411,606104.669,"DW-017",5.665,"dd"],["P61","TIẾP",1191721.411,606104.669,1191715.894,606105.631,"DW-017",5.6,"dd"],["P62","TIẾP",1191715.894,606105.631,1191710.377,606106.593,"DW-017",5.6,"dd"],["P63","TIẾP",1191710.377,606106.593,1191704.86,606107.555,"DW-017",5.6,"dd"],["P64","TIẾP",1191704.86,606107.555,1191699.344,606108.516,"DW-017",5.6,"dd"],["P65","TIẾP",1191699.344,606108.516,1191693.827,606109.478,"DW-017",5.6,"dd"],["P66","MỞ",1191693.827,606109.478,1191688.31,606110.44,"DW-011",5.6,"dd"],["P67","TIẾP",1191688.31,606110.44,1191682.793,606111.402,"DW-017",5.6,"dd"],["P68","TIẾP",1191682.793,606111.402,1191677.276,606112.364,"DW-017",5.6,"dd"],["P69","TIẾP",1191677.276,606112.364,1191671.76,606113.325,"DW-017",5.6,"dd"],["P70","TIẾP",1191671.76,606113.325,1191666.243,606114.287,"DW-017",5.6,"dd"],["P71","TIẾP",1191666.243,606114.287,1191660.726,606115.249,"DW-017",5.6,"dd"],["P72","ĐÓNG",1191660.726,606115.249,1191655.209,606116.211,"DW-013",5.6,"dl"],["P73","TIẾP",1191655.209,606116.211,1191649.692,606117.173,"DW-017",5.6,"sl"],["P74","TIẾP",1191649.692,606117.173,1191644.176,606118.134,"DW-017",5.6,"sl"],["P75","TIẾP",1191644.176,606118.134,1191638.659,606119.096,"DW-017",5.6,"sl"],["P76","TIẾP",1191638.659,606119.096,1191633.142,606120.058,"DW-017",5.6,"sl"],["P77","TIẾP",1191633.142,606120.058,1191627.491,606121.043,"DW-017",5.736,"cl"],["P78","TIẾP",1191627.491,606121.043,1191623.942,606121.662,"DW-037",3.603,"cl"],["P79","TIẾP",1191623.942,606121.662,1191617.815,606123.642,"DW-023",6.439,"cl"],["P80","TIẾP",1191617.815,606123.642,1191612.89,606125.233,"DW-017",5.176,"cl"],["P81","TIẾP",1191612.89,606125.233,1191607.561,606126.955,"DW-017",5.6,"cl"],["P82","TIẾP",1191607.561,606126.955,1191602.803,606128.492,"DW-017",5.0,"cl"],["P83","TIẾP",1191602.803,606128.492,1191598.389,606129.919,"DW-029",4.639,"cl"],["P84","TIẾP",1191598.389,606129.919,1191595.868,606130.733,"DW-035",2.649,"cl"],["P85","TIẾP",1191595.868,606130.733,1191588.973,606127.647,"DW-017",7.554,"cl"],["P86","TIẾP",1191588.973,606127.647,1191585.018,606125.877,"DW-033",4.333,"cl"],["P87","TIẾP",1191585.018,606125.877,1191581.595,606118.144,"DW-017",8.457,"cl"],["P88","MỞ",1191581.595,606118.144,1191579.344,606113.058,"DW-011",5.561,"cl"],["P89","TIẾP",1191579.344,606113.058,1191577.078,606107.938,"DW-017",5.6,"cl"],["P90","TIẾP",1191577.078,606107.938,1191574.811,606102.817,"DW-017",5.6,"cl"],["P91","TIẾP",1191574.811,606102.817,1191572.545,606097.696,"DW-017",5.6,"cl"],["P92","TIẾP",1191572.545,606097.696,1191570.278,606092.575,"DW-017",5.6,"cl"],["P93","TIẾP",1191570.278,606092.575,1191568.011,606087.454,"DW-017",5.6,"cl"],["P94","TIẾP",1191568.011,606087.454,1191565.745,606082.334,"DW-017",5.6,"cl"],["P95","TIẾP",1191565.745,606082.334,1191563.478,606077.213,"DW-017",5.6,"cl"],["P96","TIẾP",1191563.478,606077.213,1191561.293,606072.275,"DW-017",5.4,"cl"],["P97","ĐÓNG",1191561.293,606072.275,1191559.188,606067.52,"DW-015",5.2,"cl"],["P98","TIẾP",1191559.188,606067.52,1191557.002,606062.582,"DW-017",5.4,"cl"],["P99","TIẾP",1191557.002,606062.582,1191554.704,606057.39,"DW-017",5.678,"cl"],["P100","TIẾP",1191554.704,606057.39,1191552.406,606052.198,"DW-017",5.678,"cl"],["P101","TIẾP",1191552.406,606052.198,1191550.14,606047.077,"DW-017",5.6,"cl"],["P102","TIẾP",1191550.14,606047.077,1191547.873,606041.956,"DW-017",5.6,"cl"],["P103","TIẾP",1191547.873,606041.956,1191545.607,606036.836,"DW-017",5.6,"cl"],["P104","TIẾP",1191545.607,606036.836,1191543.34,606031.715,"DW-017",5.6,"cl"],["P105","MỞ",1191543.34,606031.715,1191541.074,606026.594,"DW-011",5.6,"cl"],["P106","TIẾP",1191541.074,606026.594,1191538.807,606021.473,"DW-017",5.6,"cl"],["P107","TIẾP",1191538.807,606021.473,1191536.54,606016.352,"DW-017",5.6,"cl"],["P108","TIẾP",1191536.54,606016.352,1191534.274,606011.232,"DW-017",5.6,"cl"],["P109","TIẾP",1191534.274,606011.232,1191532.007,606006.111,"DW-017",5.6,"cl"],["P110","TIẾP",1191532.007,606006.111,1191529.741,606000.99,"DW-017",5.6,"cl"],["P111","TIẾP",1191529.741,606000.99,1191527.474,605995.869,"DW-017",5.6,"cl"],["P112","TIẾP",1191527.474,605995.869,1191525.208,605990.748,"DW-017",5.6,"cl"],["P113","TIẾP",1191525.208,605990.748,1191522.941,605985.628,"DW-017",5.6,"cl"],["P114","TIẾP",1191522.941,605985.628,1191520.674,605980.507,"DW-017",5.6,"cl"],["P115","TIẾP",1191520.674,605980.507,1191518.408,605975.386,"DW-017",5.6,"cl"],["P116","TIẾP",1191518.408,605975.386,1191516.141,605970.265,"DW-017",5.6,"cl"],["P117","TIẾP",1191516.141,605970.265,1191514.221,605965.927,"DW-017",4.745,"cl"]],"poly":[[1191511.901,605960.685],[1191561.006,605938.95],[1191711.722,606020.038],[1191736.634,606076.321],[1191732.167,606102.794],[1191623.942,606121.662],[1191595.868,606130.733],[1191585.018,606125.877]],"rot":-23.8751};

// =====================================================================
// GIẢI ĐỘNG (v5.32.0) — danh sách giải động máy / thiết bị / vật tư phụ trợ cuối dự án
// Trang tính GiaiDong: mỗi dòng 1 mục trong danh sách của 1 dự án; cột hist (JSON) ghi từng lần xuất giải động:
//   {id, q, h:'thue'|'da'|'kho'|'?', dest, date, txn, by, recv, rtx:[]}  ·  h = da/kho → dự án nhận thấy ở mục "chuyển đến"
// =====================================================================
const GD = { sheet:'GiaiDong', cols:['id','project','grp','ma','name','unit','qty','inDate','dueDate','note','done','hist','at','by'],
  head:['ID','Dự án','Nhóm (may / tb / vt)','Mã thiết bị','Tên','ĐVT','Số lượng','Ngày huy động','Ngày giải động dự kiến','Ghi chú','Đã giải động','Lịch sử giải động (máy chủ ghi)','Cập nhật lúc','Người cập nhật'] };
const GD_KHO = 'Kho FECON Đồng Nai';                            // tên mặc định (bản cũ) — từ 1.5.1 dùng gdKho_()
function gdKho_() { try { return PropertiesService.getScriptProperties().getProperty('gdKho') || GD_KHO; } catch (e) { return GD_KHO; } }   // TC 1.5.1 / Kho 5.49.2: kho công ty đổi tên được (Quản lý dự án → Đổi tên)
const GD_EDIT = ['SK','EQM','DEQ','CM','DCM','QL'];
function gdCanEdit_(u) { return u.role === 'ADM' || GD_EDIT.indexOf(u.role) >= 0; }
function gdRead_() {
  const sh = sheetOf(GD.sheet, GD.head), n = sh.getLastRow() - 1;
  const rows = n > 0 ? sh.getRange(2, 1, n, GD.cols.length).getValues() : [];
  return { sh, rows: rows.map(r => { const o = rowToObj(GD.cols, r); o.qty = +o.qty || 0; o.done = +o.done || 0; o.dueDate = gdDay_(r[8]); o.inDate = gdDay_(r[7]);
    try { o.hist = JSON.parse(String(r[11] || '[]')); } catch (e) { o.hist = []; } return o; }) };
}
function gdDay_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  const s = String(v || ''), m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? m[0] : '';
}
function gdWrite_(sh, i, o) {
  const row = GD.cols.map(c => c === 'hist' ? JSON.stringify(o.hist || []) : toCell(o[c] === undefined ? '' : o[c]));
  if (i < 0) sh.appendRow(row); else sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
}
function gdRoute_(action, d, u) {
  const P = String(d.project || '');
  if (!P) return { success:false, error:'Thiếu dự án' };
  try { mustAllow(u, P); } catch (e) { return { success:false, error:String(e.message || e) }; }
  if (action === 'gdList') return gdList_(P);
  if (action === 'gdImport' && !gdCanEdit_(u)) return { success:false, forbidden:true, error:'Chỉ Admin, CHT/CHP, P.QLTB, Thủ kho được tải danh sách giải động' };
  if ((action === 'gdOut' || action === 'gdRecv') && !(gdCanEdit_(u) || hasP(u, 'k_nhap') || hasP(u, 'k_xuat'))) return { success:false, forbidden:true, error:'Chức danh của bạn chưa được ghi giải động' };
  try {
    return withLock(() => {
      if (action === 'gdImport') return gdImport_(u, P, d);
      if (action === 'gdOut') return gdOut_(u, P, d);
      if (action === 'gdRecv') return gdRecv_(u, P, d);
      return { success:false, error:'Thao tác không hợp lệ: ' + action };
    });
  } catch (e) { return { success:false, error:String(e && e.message || e) }; }
}
function gdList_(P) {
  const { rows } = gdRead_();
  const inc = [];
  rows.forEach(r => (r.hist || []).forEach(h => { if ((h.h === 'da' || h.h === 'kho') && h.dest === P && r.project !== P)
    inc.push({ src:r.project, gdId:r.id, hid:h.id, grp:r.grp, ma:r.ma, name:r.name, unit:r.unit, q:+h.q || 0, recv:+h.recv || 0, date:h.date }); }));
  return { success:true, project:P, rows:rows.filter(r => r.project === P), inc, projects:projList(), kho:gdKho_() };
}
function gdKey_(r) { return r.ma ? 'm:' + String(r.ma).trim() : r.grp + ':' + normName_(r.name); }
function gdImport_(u, P, d) {
  const { sh, rows } = gdRead_();
  const idx = {}; rows.forEach((r, i) => { if (r.project === P) idx[gdKey_(r)] = i; });
  let add = 0, upd = 0, base = Date.now();
  (d.rows || []).slice(0, 1500).forEach((x, k) => {
    const o = { grp:['may','tb','vt'].indexOf(x.grp) >= 0 ? x.grp : 'tb', ma:clean(String(x.ma || ''), 40), name:clean(String(x.name || ''), 300), unit:clean(String(x.unit || ''), 30),
      qty:Math.max(0, +x.qty || 0), inDate:gdDay_(x.inDate), dueDate:gdDay_(x.dueDate), note:clean(String(x.note || ''), 300) };
    if (!o.name) return;
    const i = idx[gdKey_(o)];
    if (i !== undefined) {
      const r = rows[i]; Object.assign(r, o, { at:nowTxt(), by:u.name });
      if (x.realDate && !r.done) { r.done = r.qty; r.hist = [{ id:'f' + base + k, q:r.qty, h:'?', dest:'', date:gdDay_(x.realDate), by:'Theo file' }]; }
      gdWrite_(sh, i, r); upd++;
    } else {
      const r = Object.assign({ id:String(base + k), project:P, done:0, hist:[], at:nowTxt(), by:u.name }, o);
      if (x.realDate) { r.done = r.qty; r.hist = [{ id:'f' + base + k, q:r.qty, h:'?', dest:'', date:gdDay_(x.realDate), by:'Theo file' }]; }
      gdWrite_(sh, -1, r); rows.push(r); idx[gdKey_(r)] = rows.length - 1; add++;
    }
  });
  writeLog(u, 'Tải DS giải động', P + ' · thêm ' + add + ' · cập nhật ' + upd);
  return Object.assign(gdList_(P), { add, upd });
}
function gdOut_(u, P, d) {
  const { sh, rows } = gdRead_();
  const i = rows.findIndex(r => String(r.id) === String(d.gdId) && r.project === P);
  if (i < 0) return { success:false, error:'Không tìm thấy mục giải động' };
  const r = rows[i], hid = String(d.id || '');
  if (hid && r.hist.some(h => String(h.id) === hid)) return { success:true, duplicate:true };
  const q = Math.round((+d.q || 0) * 1000) / 1000; if (!(q > 0)) return { success:false, error:'Số lượng giải động phải lớn hơn 0' };
  const h = ['thue','da','kho'].indexOf(d.h) >= 0 ? d.h : '';
  if (!h) return { success:false, error:'Chọn hướng giải động' };
  const dest = h === 'thue' ? clean(String(d.dest || ''), 120) : h === 'kho' ? gdKho_() : clean(String(d.dest || ''), 120);
  if (h === 'da' && (!dest || dest === P)) return { success:false, error:'Chọn dự án nhận' };
  r.hist.push({ id:hid || String(Date.now()), q, h, dest, date:gdDay_(d.date) || Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'), txn:String(d.txn || ''), by:u.name, recv:0, rtx:[] });
  r.done = Math.round((r.done + q) * 1000) / 1000; r.at = nowTxt(); r.by = u.name;
  gdWrite_(sh, i, r);
  writeLog(u, 'Giải động', q + ' ' + r.unit + ' ' + r.name + ' → ' + (h === 'thue' ? 'trả bên cho thuê' + (dest ? ' ' + dest : '') : dest) + ' — ' + P);
  return { success:true, row:r };
}
function gdRecv_(u, P, d) {
  const { sh, rows } = gdRead_();
  const i = rows.findIndex(r => String(r.id) === String(d.gdId) && r.project === String(d.src || ''));
  if (i < 0) return { success:false, error:'Không tìm thấy mục giải động của công trình gửi' };
  const r = rows[i], h = r.hist.find(x => String(x.id) === String(d.hid));
  if (!h || h.dest !== P) return { success:false, error:'Mục này không chuyển đến ' + P };
  h.rtx = h.rtx || []; if (d.txn && h.rtx.indexOf(String(d.txn)) >= 0) return { success:true, duplicate:true };
  const q = Math.round((+d.q || 0) * 1000) / 1000; if (!(q > 0)) return { success:false, error:'Số lượng nhận phải lớn hơn 0' };
  h.recv = Math.round(((+h.recv || 0) + q) * 1000) / 1000; h.rtx.push(String(d.txn || Date.now()));
  gdWrite_(sh, i, r);
  return { success:true };
}
// v5.33.0: nhắc giải động qua Telegram — mỗi ngày 1 lần (sau 7 giờ), chạy trong GIU_AM; gửi Thủ kho, P/TP.QLTB, CHT/CHP của dự án
const GD_TG_ROLES = ['SK','EQM','DEQ','CM','DCM'];
function gdTgDaily_() {
  try {
    const now = new Date(), day = Utilities.formatDate(now, TZ, 'yyyy-MM-dd'), hr = +Utilities.formatDate(now, TZ, 'H');
    if (hr < 7 || props_().getProperty('gdTg') === day) return;
    props_().setProperty('gdTg', day);
    const tok = tgToken_(); if (!tok) return;
    const { rows } = gdRead_(), by = {}, t0 = Date.parse(day + 'T00:00:00Z');
    rows.forEach(r => {
      if (!r.dueDate || r.done >= r.qty - 1e-9) return;
      const dd = Math.round((Date.parse(r.dueDate + 'T00:00:00Z') - t0) / 864e5); if (dd > 3) return;
      (by[r.project] = by[r.project] || []).push([r, dd]);
    });
    const users = loadUsers().filter(x => x.status === 'active' && x.tgChat && GD_TG_ROLES.indexOf(x.role) >= 0), msgs = [];
    Object.keys(by).forEach(P => {
      const L = by[P].sort((a, b) => a[1] - b[1]), late = L.filter(x => x[1] < 0).length;
      const text = '[' + P + ']\n🚚 Giải động: ' + (late ? late + ' mục quá hạn' : '') + (late && L.length > late ? ' · ' : '') + (L.length > late ? (L.length - late) + ' mục sắp đến hạn' : '') + ' — chưa xuất\n'
        + L.slice(0, 12).map(x => '• ' + x[0].name + (x[0].grp === 'may' ? '' : ' (còn ' + (x[0].qty - x[0].done) + ' ' + x[0].unit + ')') + ' — ' + (x[1] < 0 ? 'quá ' + (-x[1]) + ' ngày' : x[1] ? 'còn ' + x[1] + ' ngày' : 'hạn hôm nay')).join('\n')
        + (L.length > 12 ? '\n… và ' + (L.length - 12) + ' mục khác' : '') + '\nMở app → Menu → Giải động để xuất.';
      users.filter(u => allowedProjects(u).indexOf(P) >= 0).forEach(u => msgs.push({ url:'https://api.telegram.org/bot' + tok + '/sendMessage', method:'post', contentType:'application/json', payload:JSON.stringify({ chat_id:u.tgChat, text }), muteHttpExceptions:true }));
    });
    if (msgs.length) UrlFetchApp.fetchAll(msgs);
  } catch (e) { try { writeLog(null, 'Lỗi nhắc giải động', String(e && e.message || e)); } catch (x) {} }
}
