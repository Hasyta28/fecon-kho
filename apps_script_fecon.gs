// ===== FECON SOUTH - Kho Vật Tư v5.50.0 =====
// v5.50.0: BÁO HỎNG vật tư / thiết bị phụ trợ — trang HuHong; hongAdd / hongSet / hongMove; getAll gửi hong; qkBatch thêm loại 'hong'; ảnh gắn vào số báo hỏng
// v5.49.2: kho công ty đổi tên được — projRename bỏ chặn, đổi tên kho công ty thì ghi Script Properties 'gdKho' (thicong.gs 1.5.1 đọc gdKho_()); getAll gửi gdKho
// v5.49.1: đơn vị tính do Admin thêm / bỏ / xếp (setUnits, Script Properties 'units'; đơn vị đang có vật tư dùng không bỏ được); getAll gửi units
// v5.49.0: quản lý dự án — projAdmin (số liệu), projRename (đổi tên ở mọi bảng Kho + Thi công + Giải động, nhớ tên cũ projAlias), projDelete (chỉ dự án trống), projClose (đóng / mở lại: chỉ xem, chặn ghi PJ_W); updateProjects chỉ thêm
// v5.48.0: danh mục vật tư chung (trang DanhMucVT, setDanhMuc, dmRev) + nhóm vật tư Admin sửa (setCats, Script Properties 'cats'); getAll gửi cats, dmRev, dm (khi app chưa có bản mới)
// v5.47.1: chỉ thêm VER_LOG (app: ô Nhập / Xuất nhanh thu gọn) — máy chủ không đổi chức năng so với 5.47.0
// v5.47.0: qkBatch — Nhập / Xuất nhanh: một lệnh nhiều dòng, kiểm hết (quyền, vật tư, tồn kho, ở công trường, phiếu mượn, máy) rồi mới ghi bằng các hàm sẵn có; chống gửi trùng (IDEM ck)
// v5.46.1: upsert máy giữ startDate/startBy khi app cũ không gửi · đổi tên máy → renameDev_ đổi thietBi phiếu cũ, PhieuYC.may, MayVaoRa.deviceName · đổi / gỡ mã P.QLTB ghi nhật ký (qlWhy)
// v5.46.0: ThietBi thêm startDate / startBy (ngày máy bắt đầu hoạt động, quyền mới k_hd — PP/TP QLTB) · setDevStart · setTxnMeter cho thủ kho bổ sung giờ máy trống ≤ 7 ngày · addTxn nhận fillAt (giờ cấp dầu thực tế, lùi ≤ 24 giờ) · closeDevice không bắt buộc số đồng hồ
// v5.45.1: sửa số phiếu mượn ghi 1 phiếu mới (chomuon / dimuon, SL có dấu, ghi chú 'Sửa số phiếu mượn a→b') thay cho sửa ngầm phiếu gốc
// v5.45.0: loanFix (sửa số lượng phiếu mượn; đã liên kết + bên kia xác nhận → đề nghị lk:'cho', loanLinkAccept k:'sua' sửa cả 2 bên) · loanLinkAccept k:new nhận itemId (chọn đúng vật tư có sẵn) · mergeItems (Admin gộp vật tư trùng tên, dropBu bỏ phiếu tồn có sẵn ghi thừa)
// v5.44.1: loanLinkAccept nhận bu:1 → kho trên app thiếu thì ghi phiếu nhập 'Tồn đầu' (tồn có sẵn chưa cập nhật lên app) phần thiếu rồi cho mượn; vật tư tự tạo nhận nhóm cat từ app
// v5.40.0: MƯỢN / CHO MƯỢN NGOÀI CÔNG TRÌNH — MuonTra thêm cột ptype (to/da/dv), link (liên kết dự án FECON khác), drop (đề xuất bỏ thông tin mượn);
//   loanLinkAccept / loanLinkReject (dự án bên kia xác nhận), dropReq / dropDecide (bỏ thông tin mượn, quyền k_bomuon duyệt); getAll trả loanIn + allProjects
// v5.35.0: Ở CÔNG TRƯỜNG — TonKho thêm cột site + theoDoi, GiaoDich thêm cột ct (ra / ngoai / ctra / ve / site); xem ctFx_
// v5.23.0: THI CÔNG chạy chung máy chủ — thêm tệp thicong.gs trong CÙNG dự án Apps Script (thao tác tên bắt đầu "tc")
//   7 quyền mới mục ⑦ Thi công: t_xem, t_ghi, t_qa, t_cht, t_kh, t_qs, t_qt (tự bật mặc định theo chức danh, Admin sửa trong app Kho)
//   saveRole từ app cũ (không gửi quyền Thi công) giữ nguyên quyền Thi công đang có · ghi của Thi công không làm Kho phải tải lại
// v5.22.0: NHẬP THẲNG RA CÔNG TRƯỜNG — addThang ghi 1 phiếu nhập + 1 phiếu xuất cùng lúc (cột mới thangCT = số phiếu đi cặp), tồn không đổi
//   Thủ kho tự chọn 📦 / 🏗 cho mọi vật tư · thangDS = "Tên vật tư gợi ý thêm" (chỉ để gợi ý tên ở phiếu nhập, dùng chung mọi kho, Admin sửa bằng setThangDS)
//   Quyền mới k_thang "Nhập thẳng ra công trường" (mặc định chỉ Thủ kho SK) · editTxn / deleteTxn sửa / xóa cả cặp · không cho tạo phiếu điều chỉnh riêng 1 phiếu của cặp
// v5.21.2: DM_QLTB thêm 4 cột sở hữu (Hình thức sở hữu, Đơn vị sở hữu, Nhà cung cấp, Số HĐ); ThietBi thêm cột donVi (đơn vị cho thuê)
// v5.21.0: DANH MỤC CHUẨN P.QLTB — trang tính DM_QLTB (Admin nạp từ file Excel trong app: qltbSave; mọi người đọc: qltbList)
//   TonKho + ThietBi thêm cột maQL (mã P.QLTB) + ngoaiDM (1 = ngoài danh mục, 2 = không thuộc P.QLTB); upsert giữ nguyên 2 cột này khi app cũ không gửi
//   Trang MayVaoRa (devlog): máy vào / ra công trường — tự ghi khi thêm máy có ngày vào, khi Kết thúc, khi Mở lại (Mở lại nhận ngày + số đồng hồ vào mới)
//   Không cho thêm máy trùng mã P.QLTB đang có mặt ở dự án
// v5.20.3: CHỐNG GHI TRÙNG — createReq / issueReq / receiveReq / addCount nhận mã riêng mỗi lần bấm (ck): gặp lại mã đã xử lý → trả kết quả cũ, không ghi lần 2;
//   giao phiếu YC trùng (cùng người, cùng số lượng, trong 2 phút) → hỏi lại (dupConfirm), app gửi force:1 khi người dùng xác nhận (bản app cũ: bị chặn)
// v5.20.2: quyền mới v_ver "Xem nội dung cập nhật phiên bản" (mặc định ADM, CM, DCM, EQM, DEQ) · verLog trả nội dung các phiên bản app (VER_LOG ở cuối file)
// v5.20.1: đăng nhập lại bằng mật khẩu ở màn mở khóa (unlock) không báo "máy mới" và tự hủy phiên cũ của chính máy đó
// v5.20.0: itemCatalog (gợi ý tên vật tư từ mọi dự án) · chặn trùng tên vật tư trong dự án · purgeItems (Admin xóa danh mục vật tư của 1 dự án, tự sao lưu trước)
// v5.19.0: TĂNG TỐC + ĐỔI TÀI KHOẢN KHÔNG TRỐNG DỮ LIỆU
//   - getAll đọc từ "ảnh chụp" dự án trong bộ nhớ đệm (chỉ đọc lại Sheet khi có người ghi); hẹn giờ GIU_AM 5 phút/lần chụp sẵn
//   - Đăng nhập trả kèm dữ liệu dự án (login + getAll trong 1 lần gọi)
//   - Bảng chức danh chỉ gửi khi đổi (rv); không cho giao tài khoản cần dự án mà không tích dự án nào
//   - Admin sửa mọi thông tin máy (kể cả người thêm / ngày thêm / kết thúc) và giờ máy từng lần đổ dầu (setTxnMeter);
//     không hiện dấu hiệu với người dùng khác, chỉ ghi Nhật ký (chỉ Admin xem) số cũ → số mới (deviceAdminLog)
// v5.18.1: không cho thêm / đổi tên máy trùng tên máy khác trong cùng dự án
// v5.18.0: deviceCatalog — danh mục máy đã có ở mọi dự án (để chọn nhanh khi thêm máy)
// v5.17.1: sao lưu còn 1 lần/ngày lúc 23:00, giữ 30 bản (máy đã bật 2 lần/ngày tự chuyển)
// v5.17.0: SAO LƯU TỰ ĐỘNG 12:00 + 23:00 (giữ 30 ngày + bản tháng 12 tháng + Excel hằng tuần 12 tuần), Admin xem / sao lưu ngay trong app
// v5.16.0: GIỜ MÁY THIẾT BỊ
//   - ThietBi thêm: đồng hồ (giờ / km / không có), ngày + số đồng hồ lúc vào, lúc kết thúc, người thêm + ngày thêm (máy cũ lấy từ Nhật ký)
//   - GiaoDich thêm: Giờ máy / Km + Ghi chú đồng hồ (hỏng / đã thay) — ghi khi xuất dầu cho máy, kể cả giao theo phiếu yêu cầu
//   - closeDevice: kết thúc / mở lại máy ở công trình. Quyền mới k_meter "Ghi giờ máy thiết bị"
// v5.15.0: CHỨC DANH + BẢNG QUYỀN DO ADMIN CÀI TRONG APP
//   - 18 chức danh (viết tắt tiếng Anh + tên tiếng Việt), 26 quyền; Admin thêm / sửa / xóa chức danh và bật tắt từng quyền (saveRole / deleteRole)
//   - Máy chủ kiểm tra từng thao tác theo bảng quyền (ACT). Tài khoản cũ tự chuyển: admin→ADM, ql→QL, tk→SK, cht→CM, chp→DCM, ktv→TS, ld→MD, xem→SUP
//   - Chỉ Admin quản lý tài khoản, gán chức danh, chọn dự án cho mọi người (kể cả Quản lý)
//   - Báo khi tài khoản đăng nhập trên máy mới (Telegram + thông báo trong app), nút đăng xuất các máy khác
// v5.14.0: NHANH HƠN + CHÉP VẬT TƯ GIỮA DỰ ÁN
//   - Tin Telegram gửi SAU khi mở khóa dữ liệu (trước đây gửi trong khóa → mọi thao tác ghi / đăng nhập phải chờ)
//   - Đăng nhập: kiểm tra mật khẩu ngoài khóa, chỉ ghi 1 ô giờ đăng nhập, dọn phiên hết hạn 1 lần/ngày
//   - getAll: danh sách cấu kiện chỉ gửi khi định mức thay đổi (ckv)
//   - Chép danh mục vật tư từ dự án khác (listItemsOf / copyItems): tên, nhóm, đơn vị, cờ cấp thẳng / chọn máy; tồn 0, tối thiểu 0
//   - Quyền danh mục: Thủ kho / Quản lý thêm, sửa tên + nhóm; chỉ Admin đổi đơn vị và xóa vật tư / thiết bị
// v5.13.1: đổi chữ "gửi" → "giao" cho việc của kho (tránh hiểu nhầm KTV gửi) trong lịch sử phiếu và tin Telegram
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
const SERVER_VERSION = '5.50.0';
const PHOTO_FOLDER_NAME = 'FECON Kho - Ảnh biên bản';
const PHOTO_MAX_BYTES = 4 * 1024 * 1024;

const RANK = { xem:1, ld:1, ktv:1, chp:1, cht:1, tk:2, ql:3, admin:4 };   // cht/chp/ktv: quyền kho như Chỉ xem, quyền phiếu yêu cầu theo bảng quyền   // ld = Lãnh đạo: quyền ghi như Chỉ xem, nhưng xem mọi dự án
const ROLE_NAME = new Proxy({}, { get:(t, k) => typeof k === 'string' ? roleLabel_(k) : undefined });   // v5.15: theo bảng chức danh

const TABLES = {
  items:   { sheet:'TonKho',  cols:['id','name','cat','unit','stock','minStock','project','capThang','canMay','maQL','ngoaiDM','site','theoDoi'],
             head:['ID','Tên vật tư','Nhóm','Đơn vị','Tồn kho','Tối thiểu','Dự án','Cấp thẳng (1 = không cần phiếu)','Phải chọn máy (1)','Mã P.QLTB','Ngoài DM P.QLTB (1 = ngoài DM, 2 = không thuộc P.QLTB)',
                   'Ở công trường (v5.35)','Theo dõi ở công trường (1 có · 0 không · trống = theo nhóm)'] },
  devices: { sheet:'ThietBi', cols:['id','name','cat','type','fuelRate','plate','note','project','meterUnit','inDate','inMeter','outDate','outMeter','addedBy','addedAt','maQL','ngoaiDM','donVi','startDate','startBy'],
             head:['ID','Tên thiết bị','Nhóm','Loại hình','Định mức dầu (L/giờ)','Số hiệu / Biển số','Ghi chú','Dự án','Đồng hồ (h / km / none)','Ngày vào công trình','Số đồng hồ lúc vào','Ngày kết thúc','Số đồng hồ lúc kết thúc','Người thêm','Ngày thêm','Mã P.QLTB','Ngoài DM P.QLTB (1 = ngoài DM, 2 = không thuộc P.QLTB)','Đơn vị cho thuê (máy thuê ngoài)','Ngày bắt đầu hoạt động (P.QLTB ghi · v5.46)','Người ghi ngày hoạt động'] },
  devlog:  { sheet:'MayVaoRa', cols:['id','deviceId','deviceName','maQL','kind','date','meter','note','project','by','at'],
             head:['ID','ID máy','Tên máy','Mã P.QLTB','Vào / Ra (vao / ra)','Ngày','Số đồng hồ','Ghi chú','Dự án','Người ghi','Lúc ghi'] },
  repairs: { sheet:'SuaChua', cols:['id','deviceId','date','issue','fix','cost','by','note','project','addedBy','datetime'] },
  notes:   { sheet:'GhiChu',  cols:['id','content','ref','addedBy','datetime','project'] }
};
const TXN = { sheet:'GiaoDich',
  cols:['id','type','itemId','itemName','qty','unit','project','supplierOrReceiver','thietBi','datetime',
        'note','reason','refId','createdBy','createdByName','clientTime','meter','meterNote','thangCT','ct','src'],
  head:['ID','Loại','Item ID','Tên vật tư','Số lượng','Đơn vị','Dự án','NCC/Người nhận','Thiết bị','Giờ máy chủ',
        'Ghi chú','Lý do điều chỉnh','Phiếu gốc','Người lập (ID)','Người lập','Giờ trên máy','Giờ máy / Km','Ghi chú đồng hồ','Thẳng CT (số phiếu đi cặp)',
        'Kiểu (ra = ra công trường · ctra = từ công trường ra khỏi CT · ngoai = từ kho ra khỏi CT · ve = công trường về kho · site = khai số ở CT)',
        'Nạp từ Excel (đợt|khóa dòng)'] };
// ===== v5.35.0: Ở CÔNG TRƯỜNG — mỗi vật tư có 2 số: Tồn kho (trong kho) + Ở công trường (đã xuất ra công trường, vẫn thuộc dự án) =====
// ctFx_ → [Δ tồn kho, Δ ở công trường]. Thiết bị / vật tư phụ trợ tự theo dõi; cột theoDoi: 1 = luôn theo dõi, 0 = không, trống = theo nhóm.
const CT_OK = { xuat:{ ra:1, ngoai:1, ctra:1 }, nhap:{ ve:1 }, dieuchinh:{ site:1 } };
const CT_LBL = { ra:'Ra công trường', ngoai:'Ra khỏi công trình (từ kho)', ctra:'Ra khỏi công trình (từ công trường)', ve:'Từ công trường về kho', site:'Khai số ở công trường' };
function ctFx_(type, ct, q) {
  ct = String(ct || ''); q = +q || 0;
  if (type === 'xuat') return ct === 'ra' ? [-q, q] : ct === 'ctra' ? [0, -q] : [-q, 0];
  if (type === 'nhap') return ct === 've' ? [q, -q] : [q, 0];
  if (type === 'dieuchinh') return ct === 'site' ? [0, q] : [q, 0];
  return [(TXN_SIGN[type] || 0) * q, 0];
}
function ctOf_(type, ct) { return CT_OK[type] && CT_OK[type][String(ct || '')] ? String(ct) : ''; }
function ctTrack_(row) {
  const f = String(row[TABLES.items.cols.indexOf('theoDoi')]); if (f === '1') return true; if (f === '0') return false;
  return /^(tbPhuTro|vtPhuTro)$/.test(String(row[2]));
}
const ctSiteCol_ = () => TABLES.items.cols.indexOf('site') + 1;
const USERS = { sheet:'TaiKhoan',
  cols:['id','username','name','role','status','salt','hash','phone','createdAt','approvedBy','lastLogin','note','projects','tgChat'],
  head:['ID','Tên đăng nhập','Họ tên','Vai trò','Trạng thái','Salt','Mật khẩu (đã băm)','Điện thoại','Ngày đăng ký','Người duyệt','Đăng nhập gần nhất','Ghi chú','Dự án được giao','Telegram (chat id)'] };
const LOG = { sheet:'NhatKy', cols:['time','userId','userName','role','action','detail'],
  head:['Thời gian','ID người dùng','Người dùng','Vai trò','Thao tác','Chi tiết'] };
const DUAN = 'DuAn';
const LOAN = { sheet:'MuonTra',
  cols:['id','kind','itemType','itemId','itemName','unit','qty','party','phone','dueDate','note','project',
        'createdBy','createdByName','datetime','clientTime','returned','status','closeQty','closeReason','history','ptype','link','drop'],
  head:['Số phiếu mượn','Loại (cho = cho mượn, di = đi mượn)','Hàng (vt = vật tư, tb = máy)','ID vật tư/máy','Tên','Đơn vị','Số lượng',
        'Người / đơn vị','Điện thoại','Hạn trả','Ghi chú','Dự án','Người lập (ID)','Người lập','Giờ máy chủ','Giờ trên máy',
        'Đã trả','Trạng thái (open / done / closed)','SL không trả / đã bỏ thông tin mượn','Lý do đóng phiếu','Lịch sử (máy chủ ghi)',
        'Đối tượng (to = tổ đội trong CT · da = dự án FECON · dv = đơn vị ngoài)','Liên kết dự án (JSON)','Đề xuất bỏ thông tin mượn (JSON)'] };
const PHOTO = { sheet:'AnhBienBan', cols:['id','txnId','fileId','name','addedBy','addedByName','time','project'],
  head:['ID ảnh','Số phiếu','ID file Drive','Tên file','Người chụp (ID)','Người chụp','Thời gian','Dự án'] };

// Quyền tối thiểu cho từng thao tác
const PERM = {
  me:'xem', getAll:'xem', getVersion:'xem', logout:'xem', changePassword:'xem',
  addTransaction:'tk', addThang:'tk', setThangDS:'admin', upsert:'tk', setMinStock:'ql', uploadPhoto:'tk', getPhoto:'xem',
  addLoan:'tk', returnLoan:'tk', closeLoan:'tk', loanFix:'tk', mergeItems:'admin', setDevStart:'xem',
  editTxn:'admin', deleteTxn:'admin', editLoan:'admin', deleteLoan:'admin', getSummary:'xem',
  getCost:'xem', getPrices:'xem', setPrice:'ql', setProgress:'ql',
  remove:'ql', updateProjects:'ql', getLog:'ql',
  createReq:'xem', approveReq:'xem', rejectReq:'xem', cancelReq:'xem', receiveReq:'xem', issueReq:'tk', addCount:'tk',
  listItemsOf:'tk', copyItems:'tk',
  setRolePerm:'admin', setProjCfg:'admin', setItemFlags:'admin', tgUnlink:'xem', tgTest:'xem',
  listUsers:'ql', setUserProjects:'ql', approveUser:'admin', rejectUser:'admin', updateUser:'admin', deleteUser:'admin', revokeUserSessions:'admin'
};
const READS = { projAdmin:1, qltbList:1, verLog:1, itemCatalog:1, deviceAdminLog:1, deviceCatalog:1, backupInfo:1, listItemsOf:1, me:1, getAll:1, getVersion:1, getLog:1, listUsers:1, getPhoto:1, getSummary:1, getCost:1, getPrices:1 };
const IDEM = { createReq:1, issueReq:1, receiveReq:1, addCount:1, qkBatch:1 };   // v5.20.3: thao tác chống ghi trùng theo mã riêng (ck)
const NO_BUMP = { logout:1, changePassword:1, logoutOthers:1, backupNow:1, backupSetup:1 };

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
  if (action === 'ping') return { success:true, app:'fecon-kho', sv:SERVER_VERSION, tc: typeof TC_VERSION !== 'undefined' ? TC_VERSION : '' };
  if (action === 'register') return withLock(() => register(data));
  if (action === 'login') { if (!props_().getProperty('rolesMig515')) withLock(migrateRoles515_); const out = login(data); flushTg_(); return out; }      // v5.14: không khóa cả lượt đăng nhập
  if (action === 'logError') return logError(data, token);

  const u = auth(token);
  if (!u) return { success:false, auth:true, error:'Phiên đăng nhập đã hết hạn hoặc tài khoản bị khóa — vui lòng đăng nhập lại' };
  if (!PropertiesService.getScriptProperties().getProperty('rolesMig515')) { withLock(migrateRoles515_); ROLES_MEMO = null; const u2 = auth(token); if (u2) Object.assign(u, u2); }
  pjMapData_(data || {});                                        // v5.49: tên dự án cũ (đã đổi tên) → tên mới
  PJ_W = /^tc[A-Z]/.test(action) ? !!PJ_TCW[action] : /^gd[A-Z]/.test(action) ? action !== 'gdList' : !(READS[action] || PJ_RO[action]);
  if (PJ_W && data && data.linkP && pjIsClosed_(data.linkP)) return { success:false, error:'Dự án "' + data.linkP + '" đã đóng — không lập phiếu mượn với dự án này được' };
  if (/^tc[A-Z]/.test(action)) {                                 // v5.23: THI CÔNG (tệp thicong.gs cùng dự án)
    if (typeof tcRoute_ !== 'function') return { success:false, error:'Máy chủ chưa có phần Thi công — Admin dán thêm tệp thicong.gs vào dự án Apps Script rồi triển khai Phiên bản mới' };
    return tcRoute_(action, data || {}, u);
  }
  if (/^gd[A-Z]/.test(action)) {                                 // v5.32: GIẢI ĐỘNG (phần cuối tệp thicong.gs)
    if (typeof gdRoute_ !== 'function') return { success:false, error:'Máy chủ chưa có phần Giải động — Admin dán lại tệp thicong.gs bản mới rồi triển khai Phiên bản mới' };
    return gdRoute_(action, data || {}, u);
  }
  const chk = ACT[action];
  if (!chk) return { success:false, error:'Thao tác không hợp lệ: ' + action };
  if (!chk(u, data || {})) return { success:false, forbidden:true, error:'Chức danh của bạn chưa được cấp quyền cho thao tác này' };

  if (!PropertiesService.getScriptProperties().getProperty('projMig54')) withLock(migrateProjects);
  if (!PropertiesService.getScriptProperties().getProperty('flags513')) withLock(migrateFlags513_);
  if (!PropertiesService.getScriptProperties().getProperty('devBy516')) withLock(migrateDevBy516_);
  if (!PropertiesService.getScriptProperties().getProperty('warm519')) {          // v5.19: tự bật giữ ấm 5 phút/lần
    try { if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'GIU_AM')) CAI_DAT_giuAm(); } catch (e) {}
    PropertiesService.getScriptProperties().setProperty('warm519', '1');
  }
  if (!PropertiesService.getScriptProperties().getProperty('bk1day')) {          // v5.17.1: máy đã bật 12:00 + 23:00 → còn 23:00
    try { if (bkTriggersOn_() > 1) CAI_DAT_saoLuu(); } catch (e) {}
    PropertiesService.getScriptProperties().setProperty('bk1day', '1');
  }
  if (READS[action]) {
    if (action === 'me') return Object.assign({ success:true }, extra(u, data));
    if (action === 'getAll') return getAll(u, data);
    if (action === 'getVersion') return Object.assign({ success:true, version:getVersion() }, extra(u, data));
    if (action === 'getLog') return getLog(u, data);
    if (action === 'listUsers') return listUsers(u);
    if (action === 'getPhoto') return getPhoto(u, data);
    if (action === 'getSummary') return getSummary(u, data);
    if (action === 'getCost') return getCost(u, data);
    if (action === 'getPrices') return getPrices(u, data);
    if (action === 'listItemsOf') return listItemsOf(u, data);
    if (action === 'backupInfo') return backupInfo(u);
    if (action === 'deviceCatalog') return deviceCatalog(u);
    if (action === 'deviceAdminLog') return deviceAdminLog(u, data);
    if (action === 'itemCatalog') return itemCatalog(u);
    if (action === 'verLog') return { success:true, log:VER_LOG };
    if (action === 'qltbList') return qltbList_(data);
    if (action === 'projAdmin') return projAdmin(u);                  // v5.49
  }
  if (action === 'projRename' && data && !data.dry) {              // v5.49: sao lưu trước (ngoài khóa) rồi mới đổi tên
    try { runBackup_('Trước khi đổi tên dự án ' + data.from + ' → ' + data.to + ' · ' + u.name); } catch (e) { if (!data.noBackup) return { success:false, error:'Không sao lưu được nên chưa đổi tên: ' + String(e && e.message || e).slice(0, 120) }; }
  }
  if (action === 'backupNow') return backupNow(u);
  if (action === 'purgeItems') {                                 // v5.20: sao lưu trước (ngoài khóa) rồi mới xóa
    const P0 = String((data || {}).project || '');
    if (!P0 || String((data || {}).confirm || '') !== P0) return { success:false, error:'Gõ đúng tên dự án để xác nhận' };
    try { runBackup_('Trước khi xóa vật tư ' + P0 + ' · ' + u.name); } catch (e) { return { success:false, error:'Không sao lưu được nên chưa xóa: ' + String(e && e.message || e).slice(0, 120) }; }
  }            // v5.17: không giữ khóa trong lúc sao chép file
  if (action === 'backupSetup') return backupSetup(u);
  const ckKey = IDEM[action] && data && data.ck ? 'CK_' + u.id + '_' + String(data.ck).slice(0, 60) : '';
  const out = withLock(() => {
    let r;
    if (ckKey) {                                                // v5.20.3: lần bấm này đã xử lý rồi (mạng chập chờn gửi lại) → trả kết quả cũ
      const old = CacheService.getScriptCache().get(ckKey);
      if (old) { try { return Object.assign(JSON.parse(old), { repeat:true }); } catch (e) {} }
    }
    switch (action) {
      case 'logout':          r = logout(u); break;
      case 'changePassword':  r = changePassword(u, data); break;
      case 'addTransaction':  r = addTxn(u, data); break;
      case 'addThang':        r = addThang(u, data); break;
      case 'qkBatch':         r = qkBatch(u, data); break;           // v5.47.0: nhập / xuất nhanh — lưu cả lệnh một lần
      case 'setThangDS':      r = setThangDS(u, data); break;
      case 'setDanhMuc':      r = setDanhMuc(u, data); break;          // v5.48.0
      case 'setCats':         r = setCats(u, data); break;             // v5.48.0
      case 'projRename':      r = projRename(u, data); break;          // v5.49.0
      case 'projDelete':      r = projDelete(u, data); break;
      case 'projClose':       r = projClose(u, data); break;
      case 'setUnits':        r = setUnits(u, data); break;            // v5.49.1
      case 'hongAdd':         r = hongAdd(u, data); break;             // v5.50.0
      case 'hongSet':         r = hongSet(u, data); break;
      case 'hongMove':        r = hongMove(u, data); break;
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
      case 'loanLinkAccept':  r = loanLinkAccept(u, data); break;
      case 'loanLinkReject':  r = loanLinkReject(u, data); break;
      case 'dropReq':         r = dropReq(u, data); break;
      case 'loanFix':         r = loanFix(u, data); break;
      case 'setDevStart':     r = setDevStart(u, data); break;
      case 'mergeItems':      r = mergeItems(u, data); break;
      case 'dropDecide':      r = dropDecide(u, data); break;
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
      case 'nxtInfo':         r = nxtInfo(u, data); break;
      case 'nxtImport':       r = nxtImport(u, data); break;
      case 'nxtUndo':         r = nxtUndo(u, data); break;
      case 'saveRole':        r = saveRole(u, data); break;
      case 'deleteRole':      r = deleteRole(u, data); break;
      case 'logoutOthers':    r = logoutOthers(u); break;
      case 'closeDevice':     r = closeDevice(u, data); break;
      case 'setTxnMeter':     r = setTxnMeter(u, data); break;
      case 'purgeItems':      r = purgeItems(u, data); break;
      case 'setProjCfg':      r = setProjCfg(u, data); break;
      case 'setItemFlags':    r = setItemFlags(u, data); break;
      case 'tgUnlink':        r = tgUnlink(u); break;
      case 'tgTest':          r = tgTest(u); break;
      case 'copyItems':       r = copyItems(u, data); break;
      case 'qltbSave':        r = qltbSave_(u, data); break;
      default: return { success:false, error:'Thao tác không hợp lệ: ' + action };
    }
    if (r.success && !NO_BUMP[action] && !r.duplicate) {
      const v = bumpVersion(); r.prevVersion = v.prev; r.version = v.ver;
    }
    if (ckKey && r.success) { try { const j = JSON.stringify(r); if (j.length < 90000) CacheService.getScriptCache().put(ckKey, j, 21600); } catch (e) {} }
    return r;
  });
  flushTg_();                                                   // v5.14: gửi Telegram sau khi đã mở khóa
  return out;
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
  const C = typeof pjClosed_ === 'function' ? pjClosed_() : {};      // v5.49: dự án đã đóng chỉ ADM, MD, DMD (tất cả) · PD, EQM, DEQ (được giao) thấy
  const all = projList().filter(p => !C[p] || pjCanSeeClosed_(u, p));
  if (u.role === 'ADM' || u.role === 'QL' || hasP(u, 'v_all')) return all;     // v5.15: Admin / Lãnh đạo xem mọi dự án; người khác theo dự án được giao
  const mine = userProjects(u);
  return all.filter(p => mine.indexOf(p) >= 0);
}
function mustAllow(u, project) {
  if (allowedProjects(u).indexOf(String(project)) < 0) fail('Bạn không được giao dự án "' + project + '"');
  if (PJ_W && pjIsClosed_(project)) fail('Dự án "' + project + '" đã đóng — chỉ xem, không ghi được. Admin mở lại ở Menu → Quản lý dự án.');
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
    users.forEach(x => { if (['admin','ql','ld','ADM','QL','MD','DMD'].indexOf(x.role) < 0 && !x.projects) { x.projects = def; chU = true; } });
    if (chU) saveUsers(users);
  }
  props.setProperty('projMig54', '1');
}
function setUserProjects(a, d) {
  const users = loadUsers(), t = findTarget(users, d.id);
  const all = projList();
  const list = (d.projects || []).map(String).filter(p => all.indexOf(p) >= 0);
  const old = userProjects(t);
  if (!list.length && needsProj_(t.role)) fail('Chức danh ' + ROLE_NAME[t.role] + ' phải được giao ít nhất 1 dự án');
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
function pub(u) { const r = rolesAll_()[u.role] || {}; return { id:u.id, username:u.username, name:u.name, role:u.role, group:r.group || '', perm:effPerm_(u), projects:userProjects(u), tc: typeof TC_VERSION !== 'undefined' ? TC_VERSION : '' }; }
function extra(u, d) {
  const pending = u.role === 'ADM' ? loadUsers().filter(x => x.status === 'pending').length : 0;
  const rv = rolesRev_();                                        // v5.19: bảng chức danh chỉ gửi khi đổi
  return { me:pub(u), pending:pending, rv:rv, roles: d && String(d.rv || '') === rv ? undefined : rolesAll_(), newLogin:newLoginInfo_(u) };
}
function activeAdmins(users) { return users.filter(x => (x.role === 'ADM' || x.role === 'admin') && x.status === 'active').length; }

// Phiên đăng nhập: lưu mã băm của token trong Script Properties
function newSession(u, device) {
  const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  // dọn phiên hết hạn: 1 lần/ngày (v5.14)
  if (now - (+props.getProperty('sessCleanAt') || 0) > 864e5) {
    props.setProperty('sessCleanAt', String(now));
    const all = props.getProperties();
    Object.keys(all).forEach(k => {
      if (k.indexOf('S_') !== 0) return;
      try { if (JSON.parse(all[k]).e < now) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); }
    });
  }
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
    role: first ? 'ADM' : 'SUP', status: first ? 'active' : 'pending',
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
  setUserField_(u.id, 'lastLogin', nowTxt());               // chỉ ghi 1 ô, không ghi lại cả trang Tài khoản
  writeLog(u, 'Đăng nhập', clean(String(d.device || ''), 120));
  const ses = newSession(u, clean(String(d.device || ''), 80));
  if (d.unlock && d.oldToken) { try { props_().deleteProperty('S_' + sha(String(d.oldToken))); } catch (e) {} }   // mở khóa bằng mật khẩu: thay phiên cũ của máy này
  else { try { noteNewLogin_(u, clean(String(d.device || ''), 80)); } catch (e) {} }
  if (d.inc) {                                                   // v5.19: trả kèm dữ liệu dự án → bớt 1 lần gọi máy chủ
    try { const u2 = Object.assign({}, u, { _key:'S_' + sha(ses.token) }); ses.data = getAll(u2, d.inc); } catch (e) {}
  }
  return ses;
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
  const users = loadUsers();
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
  if (!rolesAll_()[d.role]) fail('Chức danh không hợp lệ');
  t.role = d.role; t.status = 'active';
  if (d.name) t.name = clean(String(d.name), 60);
  if (d.projects) { const all = projList(); t.projects = d.projects.map(String).filter(p => all.indexOf(p) >= 0).join('|'); }
  if (needsProj_(t.role) && !t.projects) fail('Chức danh ' + ROLE_NAME[t.role] + ' phải được giao ít nhất 1 dự án');
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
    if (!rolesAll_()[d.role]) fail('Chức danh không hợp lệ');
    if (needsProj_(d.role) && !userProjects(t).length) fail('Chức danh ' + ROLE_NAME[d.role] + ' phải được giao ít nhất 1 dự án — tích dự án trước');
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
    txnCols:TXN.cols, transactions:[], txnFrom:0, txnTotal:0, txnLastId:'' }, extra(u, d));
  if (!P) { res.ms = Date.now() - t0; res.noProject = true; return res; }   // chưa được giao dự án nào
  const S = snapGet_(P);                                         // v5.19: ảnh chụp dự án trong bộ nhớ đệm
  Object.keys(TABLES).forEach(k => res[k] = S.tables[k] || []);
  const n = S.n, since = +d.since || 0, rev = txnRev();
  let from = 0;
  res.txnRev = rev;
  if (d.scope === P && since > 0 && since <= n && d.lastId && S.ids[since - 1] === String(d.lastId) && String(d.txnRev || 0) === String(rev)) from = since;
  res.txnTotal = n; res.txnFrom = from;
  if (n > 0) res.txnLastId = S.ids[n - 1];
  res.transactions = S.rows.filter(r => r[0] > from).map(r => r.slice(1));
  res.loans = S.loans; res.photos = S.photos;
  try { res.loanIn = loanInbox_(P); res.allProjects = projList(); } catch (e) { res.loanIn = []; }      // v5.40
  let reqs = S.reqs || [];
  if (!hasP(u, 'y_xem')) reqs = reqs.filter(r => r.createdBy === u.id);
  const ckv = props_().getProperty('ckv') || '1', bot = props_().getProperty('TG_BOT') || '';
  Object.assign(res, { reqs:reqs, cauKien:String(d.ckv || '') !== ckv ? S.ck : undefined, ckv:ckv, projCfg:projCfg_(P), kkMoc:kkMoc_(), thangDS:thangDS_(),
    tg:{ bot:bot, linked:!!u.tgChat, link: bot ? 'https://t.me/' + bot + '?start=' + tgCode_(u.id) : '' }, cached:S._hit });
  try { const C = pjClosed_(); res.projClosed = Object.keys(C).filter(p => allowed.indexOf(p) >= 0).reduce((o, p) => (o[p] = C[p], o), {}); res.projAlias = pjAlias_(); res.units = unitsGet_(); res.gdKho = pjKho_(); } catch (e) {}
  try { res.hong = hongList_(P); } catch (e) {}   // v5.50 báo hỏng   // v5.49 · v5.49.1 đơn vị
  try { const dr = dmRev_(); Object.assign(res, { cats:catsGet_(), dmRev:dr, dm: dr && String(d.dmRev || '') !== dr ? dmList_() : undefined }); } catch (e) {}   // v5.48: danh mục + nhóm dùng chung
  res.ms = Date.now() - t0;
  return res;
}
function getLog(u, d) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG.sheet);
  if (!sh) return { success:true, rows:[] };
  const n = sh.getLastRow() - 1;
  if (n < 1) return { success:true, rows:[] };
  const lim = Math.min(Math.max(+d.limit || 300, 1), 1000);
  const hide = u && u.role !== 'ADM' ? leaderMarks() : null;     // người không phải Admin: ẩn mọi dấu vết của Lãnh đạo
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
  const ld = loadUsers().filter(x => isGroup_(x, 'g6'));
  return { ids: ld.map(x => String(x.id)), tags: ld.map(x => '@' + x.username) };
}
function isLeaderRow(r, m) {
  const LBL = Object.keys(rolesAll_()).filter(k => rolesAll_()[k].group === 'g6').map(roleLabel_).concat(['Lãnh đạo']);
  if (LBL.indexOf(String(r.role)) >= 0 || m.ids.indexOf(String(r.userId)) >= 0) return true;
  const det = String(r.detail || '');
  return LBL.some(x => det.indexOf(x) >= 0) || m.tags.some(t => det.indexOf(t + ')') >= 0 || det === t || det.indexOf(t + ' ') === 0);
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
  if (t.type === 'dieuchinh' && t.refId) {                    // v5.22: phiếu thẳng ra công trường đi cặp → không điều chỉnh riêng 1 phiếu
    const ref = readRows(gd, TXN.cols.length).find(r => String(r[0]) === String(t.refId));
    if (ref && String(ref[TXN.cols.indexOf('thangCT')]) !== '') fail('Phiếu thẳng ra công trường đi cặp nhập + xuất: nhờ Admin sửa phiếu (sửa cả cặp), không tạo phiếu điều chỉnh');
  }

  const T = TABLES.items, tk = sheetOf(T.sheet, T.head);
  const rows = readRows(tk, T.cols.length);
  const i = rows.findIndex(r => String(r[0]) === String(t.itemId));
  if (i < 0) fail('Vật tư không tồn tại trong kho');
  const itemName = String(rows[i][1]), unit = String(rows[i][3]), itemProj = String(rows[i][6]);
  mustAllow(u, itemProj);                                       // chỉ ghi vào kho dự án được giao

  let at = u.role === 'ADM' && t.txTime ? checkTime(t.txTime) : '';   // Admin chọn ngày giờ phiếu
  if (!at && t.fillAt && t.type === 'xuat' && t.thietBi) at = fillAt_(t.fillAt);   // v5.46: giờ cấp dầu thực tế — thủ kho lùi tối đa 24 giờ
  const ct = ctOf_(t.type, t.ct), siteNow = +rows[i][ctSiteCol_() - 1] || 0;     // v5.35
  if ((ct === 've' || ct === 'ctra') && qty > siteNow + 1e-9) fail('Ở công trường chỉ còn ' + siteNow + ' ' + unit + ' ' + itemName);
  const row = {
    id: t.id, type: t.type, ct: ct, itemId: t.itemId, itemName: itemName, qty: qty, unit: unit,
    project: itemProj, supplierOrReceiver: t.type === 'dieuchinh' ? '' : (t.supplierOrReceiver || ''),
    thietBi: t.thietBi || '', datetime: at || nowTxt(), note: t.note || '',
    reason: t.type === 'dieuchinh' ? t.reason : '', refId: t.type === 'dieuchinh' ? (t.refId || '') : '',
    createdBy: u.id, createdByName: u.name, clientTime: at ? '' : String(t.datetime || '').slice(0, 40),
    meter: t.type === 'xuat' && t.meter !== '' && t.meter !== undefined && !isNaN(+t.meter) ? +t.meter : '',   // v5.16: giờ máy / km khi xuất dầu
    meterNote: t.type === 'xuat' ? clean(String(t.meterNote || ''), 120) : ''
  };
  gd.appendRow(TXN.cols.map(c => toCell(row[c])));

  const cur = +rows[i][4] || 0;
  const fx = ctFx_(t.type, ct, qty), delta = fx[0];
  const beforeMoc = !!at && !afterMoc_(t.itemId, row.datetime);     // Admin ghi bù với giờ trước mốc kiểm kê → không đổi tồn
  if (!beforeMoc && delta) tk.getRange(i + 2, 5).setValue(Math.round((cur + delta) * 100) / 100);
  if (fx[1]) tk.getRange(i + 2, ctSiteCol_()).setValue(Math.round((siteNow + fx[1]) * 1000) / 1000);   // v5.35: ở công trường

  writeLog(u, TXN_LABEL[t.type], txnLogDetail(row) + (beforeMoc ? ' · ghi trước mốc kiểm kê, không đổi tồn' : ''), at);
  return { success:true, id:row.id, datetime:row.datetime, beforeMoc:beforeMoc };
}

const TABLE_LABEL = { items:'vật tư', devices:'thiết bị', repairs:'sửa chữa', notes:'ghi chú' };
function upsert(u, table, rows) {
  const T = TABLES[table];
  if (!T || table === 'devlog') fail('Bảng không hợp lệ: ' + table);
  const sh = sheetOf(T.sheet, T.head || T.cols);
  const values = readRows(sh, T.cols.length);
  const vaoLogs = [];                                          // v5.21: máy mới có ngày vào → ghi Máy vào
  const idx = {}; values.forEach((r, i) => idx[String(r[0])] = i);
  const isQL = u.role === 'ADM' || u.role === 'QL' || (hasP(u, 'k_dm') && hasP(u, 'g_view'));   // v5.15
  let added = [], edited = [];
  const renames = [], qlLogs = [];                             // v5.46.1: đổi tên máy → đổi tên trên phiếu cũ · đổi / gỡ mã P.QLTB → nhật ký
  rows.forEach(raw => {
    const o = cleanObj(raw);
    if (o.id === undefined || o.id === '') fail('Thiếu ID');
    const i = idx[String(o.id)], exists = i !== undefined;
    if (exists && !isQL && table !== 'devices' && table !== 'items') fail('Chỉ Quản lý/Admin mới được sửa ' + TABLE_LABEL[table] + ' đã có');
    const pi = T.cols.indexOf('project');
    if (exists) o.project = String(values[i][pi]);            // không cho chuyển bản ghi sang dự án khác
    if (table === 'items' || table === 'devices') {             // v5.21: app cũ không gửi mã P.QLTB → giữ nguyên
      const oldMa = exists ? String(values[i][T.cols.indexOf('maQL')] || '') : '';
      ['maQL','ngoaiDM'].forEach(k => { const ci = T.cols.indexOf(k); if (o[k] === undefined) o[k] = exists ? values[i][ci] : ''; });
      o.maQL = clean(String(o.maQL || ''), 80); o.ngoaiDM = [1, 2, '1', '2'].indexOf(o.ngoaiDM) >= 0 ? +o.ngoaiDM : '';
      if (o.maQL) o.ngoaiDM = '';
      if (table === 'devices') { const ci = T.cols.indexOf('donVi'); o.donVi = clean(String(o.donVi === undefined ? (exists ? values[i][ci] || '' : '') : o.donVi), 120); }   // v5.21.2: app cũ không gửi → giữ nguyên
      if (table === 'devices') ['startDate','startBy'].forEach(k => { const ci = T.cols.indexOf(k); if (o[k] === undefined) o[k] = exists ? fromCell(values[i][ci]) : ''; });   // v5.46.1: app cũ không gửi → giữ ngày hoạt động
      if (exists && oldMa !== o.maQL) qlLogs.push((table === 'devices' ? 'Máy "' : 'Vật tư "') + String(o.name || values[i][1]) + '": ' + (oldMa || '(chưa có mã)') + ' → ' + (o.maQL || (table === 'devices' ? 'ngoài danh mục' : 'không thuộc P.QLTB')) + (raw && raw.qlWhy ? ' · lý do: ' + clean(String(raw.qlWhy), 200) : ''));
    }
    if (!o.project) fail('Thiếu dự án');
    mustAllow(u, o.project);
    if (table === 'items') {
      if (!String(o.name || '').trim()) fail('Thiếu tên vật tư');
      const nk = normName_(o.name), pc = T.cols.indexOf('project');
      if (values.some(r => String(r[0]) !== String(o.id) && String(r[pc]) === String(o.project) && normName_(r[1]) === nk))
        fail('Vật tư "' + o.name + '" đã có trong dự án ' + o.project);
      o.stock = exists ? values[i][4] : 0;                 // tồn kho chỉ thay đổi qua phiếu
      const sci = T.cols.indexOf('site'), tdi = T.cols.indexOf('theoDoi');                     // v5.35: ở công trường chỉ đổi qua phiếu
      o.site = exists ? values[i][sci] : '';
      o.theoDoi = o.theoDoi === undefined ? (exists ? values[i][tdi] : '') : ([1, '1'].indexOf(o.theoDoi) >= 0 ? 1 : [0, '0'].indexOf(o.theoDoi) >= 0 ? 0 : '');
      if (exists && u.role !== 'ADM') o.unit = values[i][3];   // v5.14: Thủ kho / Quản lý sửa tên + nhóm; đơn vị chỉ Admin
      o.minStock = isQL ? Math.max(0, +o.minStock || 0) : (exists ? +values[i][5] || 0 : 0);   // định mức: chỉ Quản lý/Admin
      const fl = defaultFlags_(String(o.cat || ''), String(o.name || ''));                     // cách cấp: chỉ Admin đổi (setItemFlags)
      const f01 = v => v === 0 || v === 1 || v === '0' || v === '1';                           // v5.20: chọn từ gợi ý → giữ cách cấp như dự án nguồn
      o.capThang = exists ? values[i][7] : (f01(o.capThang) ? +o.capThang : fl.capThang); o.canMay = exists ? values[i][8] : (f01(o.canMay) ? +o.canMay : fl.canMay);
    }
    if (table === 'devices') {
      if (!String(o.name || '').trim()) fail('Thiếu tên thiết bị');
      if (exists && String(values[i][1]) !== String(o.name)) renames.push({ id:o.id, P:String(o.project), old:String(values[i][1]), nw:String(o.name) });
      const nk = normName_(o.name);
      if (values.some(r => String(r[0]) !== String(o.id) && String(r[T.cols.indexOf('project')]) === String(o.project) && normName_(r[1]) === nk))
        fail('Máy "' + o.name + '" đã có trong dự án ' + o.project);
      o.fuelRate = +o.fuelRate || 0;
      const c = k => T.cols.indexOf(k);
      if (o.maQL) {                                            // v5.21: máy này (cùng mã P.QLTB) đang có mặt ở dự án → không thêm trùng
        const dup = values.find(r => String(r[0]) !== String(o.id) && String(r[c('project')]) === String(o.project) && String(r[c('maQL')]) === o.maQL && !r[c('outDate')]);
        if (dup) fail('Máy ' + o.maQL + ' đang ở dự án ' + o.project + ' (' + String(dup[1]) + ', vào ngày ' + fromCell(dup[c('inDate')]) + ')');
      }
      o.meterUnit = ['h','km','none'].indexOf(String(o.meterUnit || '')) >= 0 ? String(o.meterUnit) : (exists ? String(values[i][c('meterUnit')] || 'h') : 'h');
      o.inMeter = o.inMeter === '' || o.inMeter === undefined || isNaN(+o.inMeter) ? '' : +o.inMeter;
      if (exists && u.role === 'ADM') {                          // v5.19: Admin sửa được mọi thông tin; ghi nhật ký riêng số cũ → số mới
        ['outDate','outMeter','addedBy','addedAt'].forEach(k => { if (o[k] === undefined) o[k] = values[i][c(k)]; });
        o.outMeter = o.outMeter === '' || o.outMeter === undefined || isNaN(+o.outMeter) ? '' : +o.outMeter;
        const LBL = { name:'tên', cat:'nhóm', type:'loại hình', fuelRate:'định mức dầu', plate:'số hiệu', note:'ghi chú', meterUnit:'đồng hồ', inDate:'ngày vào', inMeter:'số lúc vào',
          outDate:'ngày kết thúc', outMeter:'số lúc kết thúc', addedBy:'người thêm', addedAt:'ngày thêm' };
        const ch = Object.keys(LBL).filter(k => String(fromCell(values[i][c(k)]) ?? '') !== String(o[k] ?? '')).map(k => LBL[k] + ': ' + (fromCell(values[i][c(k)]) || '(trống)') + ' → ' + (o[k] === '' ? '(trống)' : o[k]));
        if (ch.length) writeLog(u, 'Admin sửa máy', String(values[i][1]) + ' · ' + ch.join(' · '));
      }
      else if (exists) { ['outDate','outMeter','addedBy','addedAt'].forEach(k => o[k] = values[i][c(k)]); }   // kết thúc: qua closeDevice; người thêm: giữ nguyên
      else { o.addedBy = u.name; o.addedAt = nowTxt(); o.outDate = ''; o.outMeter = '';
        if (o.inDate) vaoLogs.push({ id:'V' + o.id, deviceId:o.id, deviceName:String(o.name), maQL:o.maQL, kind:'vao', date:String(o.inDate), meter:o.inMeter, note:'', project:o.project, by:u.name, at:nowTxt() }); }
    }
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
  vaoLogs.forEach(devLog_);
  renames.forEach(x => renameDev_(u, x));
  qlLogs.forEach(t => writeLog(u, 'Đổi mã P.QLTB', t));
  if (added.length) writeLog(u, 'Thêm ' + TABLE_LABEL[table], added.join(', '));
  if (edited.length) writeLog(u, 'Sửa ' + TABLE_LABEL[table], edited.join(', '));
  return { success:true };
}

function renameDev_(u, x) {                                    // v5.46.1: phiếu cấp dầu / phiếu yêu cầu gắn máy theo TÊN → đổi theo tên mới
  const ss = SpreadsheetApp.getActiveSpreadsheet(); let n = 0;
  const gd = ss.getSheetByName(TXN.sheet), tb = TXN.cols.indexOf('thietBi'), pj = TXN.cols.indexOf('project');
  if (gd) readRows(gd, TXN.cols.length).forEach((r, k) => { if (String(r[tb]) === x.old && String(r[pj]) === x.P) { gd.getRange(k + 2, tb + 1).setValue(toCell(x.nw)); n++; } });
  const rq = ss.getSheetByName(REQ.sheet), mi = REQ.cols.indexOf('may');
  if (rq) readRows(rq, REQ.cols.length).forEach((r, k) => { if (String(r[1]) === x.P && String(r[mi]) === x.old) rq.getRange(k + 2, mi + 1).setValue(toCell(x.nw)); });
  const D = TABLES.devlog, ml = ss.getSheetByName(D.sheet);
  if (ml) readRows(ml, D.cols.length).forEach((r, k) => { if (String(r[1]) === String(x.id)) ml.getRange(k + 2, 3).setValue(toCell(x.nw)); });
  bumpTxnRev();
  writeLog(u, 'Đổi tên máy', x.old + ' → ' + x.nw + ' · ' + x.P + ' · ' + n + ' phiếu cấp dầu đổi theo');
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
  if ((table === 'items' || table === 'devices') && u.role !== 'ADM') fail('Chỉ Admin được xóa ' + TABLE_LABEL[table]);
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
  const old = readRows(sh, 2).map(r => String(r[1])).filter(Boolean), before = old.slice();
  // v5.49: lệnh này chỉ THÊM dự án (đổi tên / xoá dùng projRename / projDelete) — tên app gửi thiếu (dự án đã đóng bị ẩn, máy cũ) giữ nguyên
  const A = typeof pjAlias_ === 'function' ? pjAlias_() : {};
  list.forEach(p => { const q = A[p] || p; if (old.indexOf(q) < 0 && !old.some(o => normKey_(o) === normKey_(q))) old.push(q); });
  const n = sh.getLastRow() - 1;
  if (n > 0) sh.getRange(2, 1, n, 2).clearContent();
  sh.getRange(2, 1, old.length, 2).setValues(old.map((p, i) => [i + 1, toCell(p)]));
  const addedP = old.filter(p => before.indexOf(p) < 0);
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
  try { o.link = o.link ? JSON.parse(String(o.link)) : null; } catch (e) { o.link = null; }      // v5.40
  try { o.drop = o.drop ? JSON.parse(String(o.drop)) : null; } catch (e) { o.drop = null; }
  o.ptype = String(o.ptype || '');
  return o;
}
const loanRem_ = l => r3(l.qty - l.returned - (+l.closeQty || 0));                          // v5.40: còn theo dõi
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
    .setValues([LOAN.cols.map(c => toCell(c === 'history' ? JSON.stringify(loan.history) : (c === 'link' || c === 'drop') ? (loan[c] ? JSON.stringify(loan[c]) : '') : (loan[c] === undefined || loan[c] === null ? '' : loan[c])))]);
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
    clientTime:String(d.datetime || '').slice(0, 40), returned:0, status:'open', closeQty:0, closeReason:'', history:[],
    ptype:['to','da','dv'].indexOf(String(d.ptype)) >= 0 ? String(d.ptype) : '', link:null, drop:null };
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
  if (loan.ptype === 'da' && d.linkP && d.itemType === 'vt') {                 // v5.40: liên kết dự án FECON khác
    const lp = String(d.linkP);
    if (projList().indexOf(lp) < 0) fail('Dự án "' + lp + '" không có trong danh sách');
    if (lp === loan.project) fail('Chọn dự án khác dự án đang làm');
    loan.link = { p:lp, id:'', st:'cho' };
  }
  if (ctx) writeLoanTxns(u, ctx, [{ id:d.txnId, type:cho ? 'chomuon' : 'dimuon', qty:loan.qty, party:party,
    note:loan.note, refId:loan.id, clientTime:d.datetime }]);
  sh.appendRow(LOAN.cols.map(c => toCell(c === 'history' ? '[]' : (c === 'link' || c === 'drop') ? (loan[c] ? JSON.stringify(loan[c]) : '') : loan[c])));
  if (loan.link) notify_(loan.link.p, ['k_loan'], [], u.id, (cho ? '🤝 ' + loan.project + ' cho bạn mượn ' : '📝 ' + loan.project + ' báo đã mượn của bạn ') + loan.qty + ' ' + loan.unit + ' ' + loan.itemName + '\nMở app Kho → Tổng quan để xác nhận.');
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
function returnLoan(u, d0, mirror) {
  const d = cleanObj(d0), lr = loanForUpdate(u, d);
  if (!lr) return { success:true, duplicate:true };
  const loan = lr.loan, cho = loan.kind === 'cho';
  const remain = loanRem_(loan);
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
  if (loanRem_(loan) <= 1e-9) loan.status = +loan.closeQty > 0 ? 'closed' : 'done';
  const hh = { id:String(d.id), t:'tra', q:qty, note:String(d.note || '').slice(0, 300), by:u.name, at:nowTxt() };
  if (loan.link && loan.link.st === 'ok' && !mirror) { hh.lk = 'cho'; notify_(loan.link.p, ['k_loan'], [], u.id, '↩ ' + loan.project + (cho ? ' đã nhận trả ' : ' đã trả lại ') + qty + ' ' + loan.unit + ' ' + loan.itemName + '\nMở app Kho → Tổng quan để xác nhận.'); }
  if (mirror) hh.lk = 'ok';
  loan.history.push(hh);
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

// ---------- v5.40: LIÊN KẾT 2 DỰ ÁN · BỎ THÔNG TIN MƯỢN ----------
function allLoans_() { const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOAN.sheet); return sh ? readRows(sh, LOAN.cols.length).filter(r => r[0] !== '').map(loanOut) : []; }
// Việc chờ dự án P xác nhận do dự án khác gửi
function loanInbox_(P) {
  const out = [];
  allLoans_().forEach(l => {
    if (!l.link || l.link.p !== P || l.project === P) return;
    if (l.link.st === 'cho' && l.status === 'open') out.push({ k:'new', src:l.id, from:l.project, kind:l.kind, itemName:l.itemName, unit:l.unit, qty:loanRem_(l), by:l.createdByName, at:l.datetime, due:l.dueDate, note:l.note });
    if (l.link.st === 'ok') l.history.forEach(h => { if (h.lk === 'cho' && (h.t === 'tra' || h.t === 'bo' || h.t === 'sua')) out.push({ k:h.t, src:l.id, hid:h.id, from:l.project, kind:l.kind, itemName:l.itemName, unit:l.unit, qty:h.q, old:h.old, by:h.by, at:h.at, note:h.note || '' }); });
  });
  return out;
}
function itemOfProj_(P, name, unit, cat) {
  const T = TABLES.items, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length), n = String(name).trim().toLowerCase();
  const r = rows.find(x => x[0] !== '' && String(x[6]) === P && String(x[1]).trim().toLowerCase() === n);
  if (r) return r[0];
  const id = Date.now() * 100 + 95, o = { id:id, name:name, cat:/^[A-Za-z]{2,20}$/.test(String(cat || '')) ? String(cat) : 'tbPhuTro', unit:unit, stock:0, minStock:0, project:P, ngoaiDM:2 };
  sh.appendRow(T.cols.map(c => toCell(o[c] === undefined ? '' : o[c])));
  return id;
}
function loanLinkAccept(u, d0) {
  const d = cleanObj(d0), P = String(d.project || '');
  mustAllow(u, P);
  const sr = findLoanRow(d.src); if (!sr) fail('Không tìm thấy phiếu mượn gốc');
  const S = sr.loan;
  if (!S.link || S.link.p !== P) fail('Phiếu này không gửi cho dự án ' + P);
  if (d.k === 'new') {
    if (S.link.st !== 'cho') return { success:true, duplicate:true };
    const cho = S.kind === 'cho', mid = String(Date.now() * 100 + 91), tid = Date.now() * 100 + 92;
    const M = { id:mid, kind:cho ? 'di' : 'cho', itemType:'vt', party:'Dự án ' + S.project, phone:'', dueDate:S.dueDate, note:'Liên kết phiếu #' + S.id + (S.note ? ' · ' + S.note : ''),
      createdBy:u.id, createdByName:u.name, datetime:nowTxt(), clientTime:'', returned:0, status:'open', closeQty:0, closeReason:'', history:[],
      ptype:'da', link:{ p:S.project, id:S.id, st:'ok' }, drop:null, itemName:S.itemName, unit:S.unit, qty:loanRem_(S), project:P };
    if (!(M.qty > 0)) fail('Phiếu gốc không còn số lượng');
    let ctx;
    if (d.itemId) {                                      // v5.45.0: bên xác nhận chọn đúng vật tư có sẵn (tên 2 bên ghi khác nhau)
      ctx = itemCtx(d.itemId);
      if (ctx.project !== P) fail('Vật tư đã chọn không thuộc dự án ' + P);
      if (String(ctx.unit).trim().toLowerCase() !== String(S.unit).trim().toLowerCase()) fail('Đơn vị khác nhau: kho bạn ghi ' + ctx.unit + ', phiếu mượn ghi ' + S.unit + ' — chọn vật tư khác hoặc từ chối');
    } else ctx = itemCtx(itemOfProj_(P, S.itemName, S.unit, d.cat));
    M.itemName = ctx.name; M.unit = ctx.unit;
    let bu = 0;
    if (!cho && M.qty > ctx.stock + 1e-9) {
      if (!d.bu) fail('Kho dự án bạn không đủ ' + S.itemName + ' (còn ' + ctx.stock + ' ' + ctx.unit + ') — kiểm tra lại trước khi xác nhận');
      bu = r3(M.qty - ctx.stock);                        // v5.44.1: đồ có sẵn ở kho nhưng chưa nhập lên app → ghi tồn có sẵn phần thiếu rồi cho mượn
    }
    M.itemId = ctx.id;
    writeLoanTxns(u, ctx, (bu > 0 ? [{ id:tid + 5, type:'nhap', qty:bu, party:'Tồn đầu', note:'Tồn có sẵn – chưa cập nhật lên app (ghi khi xác nhận cho dự án ' + S.project + ' mượn)', clientTime:'' }] : [])
      .concat([{ id:tid, type:cho ? 'dimuon' : 'chomuon', qty:M.qty, party:M.party, note:M.note, refId:M.id, clientTime:'' }]));
    const sh = sheetOf(LOAN.sheet, LOAN.head);
    sh.appendRow(LOAN.cols.map(c => toCell(c === 'history' ? '[]' : (c === 'link' || c === 'drop') ? (M[c] ? JSON.stringify(M[c]) : '') : M[c])));
    S.link = { p:P, id:mid, st:'ok' }; saveLoan(sr.sh, sr.i, S);
    writeLog(u, 'Xác nhận mượn liên kết', M.qty + ' ' + M.unit + ' ' + M.itemName + ' · ' + S.project + ' ↔ ' + P + (bu ? ' · ghi tồn có sẵn ' + bu : ''));
    notify_(S.project, [], [S.createdBy], u.id, '✅ ' + P + ' đã xác nhận ' + (cho ? 'nhận ' : 'cho mượn ') + M.qty + ' ' + M.unit + ' ' + M.itemName);
    return { success:true, id:mid, bu:bu };
  }
  const h = S.history.find(x => String(x.id) === String(d.hid));
  if (!h || h.lk !== 'cho') return { success:true, duplicate:true };
  const mr = findLoanRow(S.link.id); if (!mr) fail('Không tìm thấy phiếu liên kết bên bạn');
  const M = mr.loan;
  if (h.t === 'sua') {                                 // v5.45.0: sửa số lượng — kiểm 2 bên trước, rồi sửa cả 2
    const same = 'Số lượng không đổi', qM = r3(M.qty + (h.q - h.old));
    const eM = loanQtyCheck_(M, qM), tM = /^thieu:/.test(eM) ? +eM.slice(6) : 0;
    if (eM && !tM && eM !== same) fail('Dự án bạn: ' + eM);
    if (tM && !d.bu) fail('Kho dự án bạn không đủ ' + M.itemName + ' (thiếu ' + tM + ' ' + M.unit + ') — kiểm tra lại trước khi xác nhận');
    const eS = loanQtyCheck_(S, h.q), tS = /^thieu:/.test(eS) ? +eS.slice(6) : 0;
    if (eS && !tS && eS !== same) fail('Dự án ' + S.project + ': ' + eS);
    if (tS && !h.bu) fail('Kho dự án ' + S.project + ' không đủ — báo dự án đó kiểm tra lại');
    if (eM !== same) loanQtyApply_(u, mr, qM, 'Theo ' + S.project + ' · ' + h.note, d.bu);
    M.history.push({ id:String(Date.now() * 100 + 83), t:'sua', q:qM, old:r3(qM - (h.q - h.old)), note:'Theo ' + S.project + ' · ' + h.note, by:u.name, at:nowTxt(), lk:'ok' });
    saveLoan(mr.sh, mr.i, M);
    const s3 = findLoanRow(S.id);
    if (eS !== same) loanQtyApply_(u, s3, h.q, h.note, h.bu);
    const h3 = s3.loan.history.find(x => String(x.id) === String(d.hid)); h3.lk = 'ok'; saveLoan(s3.sh, s3.i, s3.loan);
    writeLog(u, 'Xác nhận sửa số phiếu mượn', S.itemName + ' ' + h.old + ' → ' + h.q + ' ' + S.unit + ' · ' + S.project + ' ↔ ' + P);
    notify_(S.project, ['k_loan'], [], u.id, '✅ ' + P + ' đã xác nhận sửa số ' + S.itemName + ': ' + h.old + ' → ' + h.q + ' ' + S.unit);
    return { success:true };
  }
  if (h.t === 'tra') {
    returnLoan(u, { loanId:M.id, id:String(Date.now() * 100 + 93), qty:h.q, note:'Theo ' + S.project + ' · ' + (h.note || ''), datetime:'' }, true);
  } else {
    const q = Math.min(h.q, loanRem_(M));
    if (q > 0) { M.closeQty = r3((+M.closeQty || 0) + q); M.closeReason = h.note || ''; if (loanRem_(M) <= 1e-9) M.status = 'closed';
      M.history.push({ id:String(Date.now() * 100 + 94), t:'bo', q:q, note:'Theo ' + S.project + ' · ' + (h.note || ''), by:u.name, at:nowTxt(), lk:'ok' });
      saveLoan(mr.sh, mr.i, M); }
  }
  const s2 = findLoanRow(S.id), S2 = s2.loan, h2 = S2.history.find(x => String(x.id) === String(d.hid)); h2.lk = 'ok'; saveLoan(s2.sh, s2.i, S2);
  writeLog(u, 'Xác nhận theo dự án ' + S.project, (h.t === 'tra' ? 'Trả ' : 'Bỏ thông tin mượn ') + h.q + ' ' + S.unit + ' ' + S.itemName);
  return { success:true };
}
function loanLinkReject(u, d0) {
  const d = cleanObj(d0), P = String(d.project || ''), why = String(d.note || '').slice(0, 300);
  mustAllow(u, P);
  if (why.length < 3) fail('Ghi lý do từ chối');
  const sr = findLoanRow(d.src); if (!sr) fail('Không tìm thấy phiếu');
  const S = sr.loan;
  if (!S.link || S.link.p !== P) fail('Phiếu này không gửi cho dự án ' + P);
  if (d.k === 'new') S.link.st = 'tc', S.link.note = why;
  else { const h = S.history.find(x => String(x.id) === String(d.hid)); if (h) { h.lk = 'tc'; h.lkNote = why; } }
  saveLoan(sr.sh, sr.i, S);
  notify_(S.project, [], [S.createdBy], u.id, '⛔ ' + P + ' từ chối xác nhận ' + S.itemName + '\nLý do: ' + why);
  return { success:true };
}
// ---------- v5.45.0: SỬA SỐ LƯỢNG PHIẾU MƯỢN · GỘP VẬT TƯ TRÙNG ----------
function loanTxnRow_(L) {                              // phiếu kho gốc (cho mượn / đi mượn) của phiếu mượn
  const gd = sheetOf(TXN.sheet, TXN.head), rows = readRows(gd, TXN.cols.length), ty = L.kind === 'cho' ? 'chomuon' : 'dimuon';
  const k = rows.findIndex(r => String(r[12]) === String(L.id) && String(r[1]) === ty);
  return { gd:gd, k:k, row:k >= 0 ? rows[k] : null };
}
function loanQtyCheck_(L, q) {                         // '' = sửa được · 'thieu:n' = kho bên cho mượn thiếu n · còn lại = lỗi
  if (L.itemType !== 'vt') return 'Phiếu mượn máy không sửa số lượng';
  if (L.status !== 'open') return 'Phiếu mượn đã xong / đã đóng';
  const used = r3((+L.returned || 0) + (+L.closeQty || 0));
  if (!(q > 0)) return 'Số lượng phải lớn hơn 0';
  if (q < used - 1e-9) return 'Đã trả / bỏ ' + used + ' ' + L.unit + ' — số mới phải từ ' + used + ' trở lên';
  const delta = r3(q - L.qty); if (Math.abs(delta) < 1e-9) return 'Số lượng không đổi';
  const ctx = itemCtx(L.itemId);
  if (L.kind === 'cho' && delta > ctx.stock + 1e-9) return 'thieu:' + r3(delta - ctx.stock);
  if (L.kind === 'di' && delta < 0 && ctx.stock + delta < -1e-9) return 'Kho dự án ' + L.project + ' chỉ còn ' + ctx.stock + ' ' + ctx.unit + ' — không bớt được ' + (-delta);
  return '';
}
let LQ_SEQ = 0;                                         // số phiếu không trùng khi sửa 2 dự án trong cùng 1 lần gọi
function loanQtyApply_(u, lr, q, why, bu) {           // sửa số trên phiếu mượn + phiếu kho gốc + tồn kho (đã kiểm bằng loanQtyCheck_)
  const L = lr.loan, delta = r3(q - L.qty), ctx = itemCtx(L.itemId), cho = L.kind === 'cho';
  if (cho && delta > ctx.stock + 1e-9) {
    if (!bu) fail('Kho dự án ' + L.project + ' không đủ ' + L.itemName + ' (còn ' + ctx.stock + ' ' + ctx.unit + ')');
    writeLoanTxns(u, ctx, [{ id:Date.now() * 100 + 60 + (LQ_SEQ++ % 30), type:'nhap', qty:r3(delta - ctx.stock), party:'Tồn đầu', note:'Tồn có sẵn – chưa cập nhật lên app (ghi khi sửa số phiếu mượn #' + L.id + ')', clientTime:'' }]);
  }
  // v5.45.1: ghi 1 phiếu sửa số (SL có dấu: + thêm, − bớt) đúng giờ sửa — lịch sử thấy ngay, không sửa ngầm phiếu gốc
  writeLoanTxns(u, ctx, [{ id:Date.now() * 100 + 60 + (LQ_SEQ++ % 30), type:cho ? 'chomuon' : 'dimuon', qty:delta, party:L.party, note:'Sửa số phiếu mượn ' + L.qty + '→' + q + ': ' + why, refId:L.id, clientTime:'' }]);
  L.qty = q;
  if (loanRem_(L) <= 1e-9) L.status = +L.closeQty > 0 ? 'closed' : 'done';
}
function loanFix(u, d0) {
  const d = cleanObj(d0), lr = loanForUpdate(u, { id:d.id, loanId:d.loanId });
  if (!lr) return { success:true, duplicate:true };
  const L = lr.loan, q = r3(d.qty), why = String(d.reason || '').trim().slice(0, 300);
  if (why.length < 3) fail('Ghi lý do sửa số');
  if (L.history.some(h => h.t === 'sua' && h.lk === 'cho')) fail('Đang chờ dự án ' + (L.link ? L.link.p : '') + ' xác nhận lần sửa trước');
  const e = loanQtyCheck_(L, q), thieu = /^thieu:/.test(e) ? +e.slice(6) : 0;
  if (e && !thieu) fail(e);
  if (thieu && !d.bu) fail('Kho dự án bạn không đủ ' + L.itemName + ' (thiếu ' + thieu + ' ' + L.unit + ') — kiểm tra lại trước khi sửa');
  const hh = { id:String(d.id), t:'sua', q:q, old:L.qty, note:why, by:u.name, at:nowTxt() };
  if (L.link && L.link.st === 'ok') {                  // đã liên kết + bên kia đã xác nhận → gửi đề nghị, chưa sửa
    hh.lk = 'cho'; if (thieu) hh.bu = 1;
    L.history.push(hh); saveLoan(lr.sh, lr.i, L);
    notify_(L.link.p, ['k_loan'], [], u.id, '✏️ ' + L.project + ' đề nghị sửa số ' + L.itemName + ': ' + L.qty + ' → ' + q + ' ' + L.unit + '\nLý do: ' + why + '\nMở app Kho → Tổng quan để xác nhận.');
    writeLog(u, 'Đề nghị sửa số phiếu mượn', L.itemName + ' ' + L.qty + ' → ' + q + ' ' + L.unit + ' · chờ ' + L.link.p + ' · ' + why + ' · phiếu #' + L.id);
    return { success:true, pending:true };
  }
  loanQtyApply_(u, lr, q, why, thieu ? 1 : 0);
  L.history.push(hh); saveLoan(lr.sh, lr.i, L);
  writeLog(u, 'Sửa số phiếu mượn', L.itemName + ' ' + hh.old + ' → ' + q + ' ' + L.unit + ' · ' + why + ' · phiếu #' + L.id);
  return { success:true };
}
function mergeItems(u, d0) {                           // gộp vật tư ghi trùng (sai / thiếu tên) vào vật tư đúng — Admin
  const d = cleanObj(d0), why = String(d.reason || '').trim().slice(0, 300);
  if (why.length < 3) fail('Ghi lý do gộp');
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), rows = readRows(tk, T.cols.length), sc = ctSiteCol_();
  const iF = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(d.fromId)), iT = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(d.toId));
  if (iF < 0) return { success:true, duplicate:true };
  if (iT < 0 || iT === iF) fail('Không tìm thấy vật tư giữ lại');
  const F = rows[iF], To = rows[iT], P = String(F[6]);
  if (String(To[6]) !== P) fail('Hai vật tư không cùng dự án');
  mustAllow(u, P);
  if (String(F[3]).trim().toLowerCase() !== String(To[3]).trim().toLowerCase()) fail('Đơn vị khác nhau (' + F[3] + ' / ' + To[3] + ') — không gộp');
  const gd = sheetOf(TXN.sheet, TXN.head), tx = readRows(gd, TXN.cols.length), del = [], mv = [];
  let dStock = 0, dSite = 0;
  tx.forEach((r, k) => {
    if (String(r[2]) !== String(F[0])) return;
    if (d.dropBu && String(r[1]) === 'nhap' && String(r[7]) === 'Tồn đầu' && /chưa cập nhật lên app/.test(String(r[10]))) { del.push(k); dStock -= txnEffect(r); dSite -= siteEffect(r); }
    else mv.push(k);
  });
  const stock = Math.round(((+To[4] || 0) + (+F[4] || 0) + dStock) * 100) / 100, site = r3((+To[sc - 1] || 0) + (+F[sc - 1] || 0) + dSite);
  if (stock < -1e-9) fail('Gộp xong tồn kho âm (' + stock + ') — kiểm tra lại');
  mv.forEach(k => gd.getRange(k + 2, 3, 1, 2).setValues([[To[0], toCell(String(To[1]))]]));
  deleteSheetRows(gd, del);
  const mt = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOAN.sheet); let nl = 0;
  if (mt) readRows(mt, LOAN.cols.length).forEach((r, k) => { if (String(r[2]) === 'vt' && String(r[3]) === String(F[0])) { mt.getRange(k + 2, 4, 1, 2).setValues([[To[0], toCell(String(To[1]))]]); nl++; } });
  const rq = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REQ.sheet), li = REQ.cols.indexOf('lines');
  if (rq) readRows(rq, REQ.cols.length).forEach((r, k) => {
    if (String(r[1]) !== P || String(r[li]).indexOf(String(F[0])) < 0) return;
    try { const L = JSON.parse(String(r[li])); let ch = 0; L.forEach(x => { if (String(x.itemId) === String(F[0])) { x.itemId = To[0]; x.itemName = String(To[1]); ch = 1; } });
      if (ch) rq.getRange(k + 2, li + 1).setValue(toCell(JSON.stringify(L))); } catch (e) {}
  });
  tk.getRange(iT + 2, 5).setValue(stock); tk.getRange(iT + 2, sc).setValue(site);
  if (+F[5] > +To[5]) tk.getRange(iT + 2, 6).setValue(+F[5]);
  const qc = T.cols.indexOf('maQL'); if (!String(To[qc]) && String(F[qc])) tk.getRange(iT + 2, qc + 1).setValue(toCell(String(F[qc])));
  tk.deleteRow(iF + 2);
  bumpTxnRev();
  writeLog(u, 'Gộp vật tư trùng', '"' + F[1] + '" → "' + To[1] + '" · ' + P + ' · ' + mv.length + ' phiếu chuyển' + (del.length ? ', bỏ ' + del.length + ' phiếu tồn có sẵn ghi thừa' : '') + (nl ? ', ' + nl + ' phiếu mượn' : '') + ' · ' + why);
  return { success:true, moved:mv.length, dropped:del.length, loans:nl, stock:stock };
}
function dropReq(u, d0) {
  const d = cleanObj(d0), lr = loanForUpdate(u, d);
  if (!lr) return { success:true, duplicate:true };
  const L = lr.loan, q = L.itemType === 'tb' ? loanRem_(L) : r3(d.qty), reason = String(d.reason || '').slice(0, 300);
  if (L.drop) fail('Phiếu này đang chờ duyệt bỏ thông tin mượn');
  if (!(q > 0) || q > loanRem_(L) + 1e-9) fail('Số lượng phải từ 0 đến ' + loanRem_(L));
  if (reason.length < 3) fail('Chọn / ghi lý do');
  L.drop = { id:String(d.id), q:q, reason:reason, note:String(d.note || '').slice(0, 300), by:u.id, byName:u.name, at:nowTxt() };
  saveLoan(lr.sh, lr.i, L);
  notify_(L.project, ['k_bomuon'], [], u.id, '🏷 Đề xuất bỏ thông tin mượn: ' + q + ' ' + L.unit + ' ' + L.itemName + ' · ' + L.party + '\nLý do: ' + reason + '\nMở app Kho → Tổng quan để duyệt.');
  return { success:true };
}
function dropDecide(u, d0) {
  const d = cleanObj(d0), lr = findLoanRow(d.loanId);
  if (!lr) fail('Không tìm thấy phiếu mượn');
  const L = lr.loan; mustAllow(u, L.project);
  if (!L.drop) return { success:true, duplicate:true };
  const r = L.drop;
  if (!d.ok) {
    const why = String(d.note || '').slice(0, 300); if (why.length < 3) fail('Ghi lý do từ chối');
    L.history.push({ id:r.id, t:'botc', q:r.q, note:r.reason + ' · từ chối: ' + why, by:r.byName, ap:u.name, at:nowTxt() });
    L.drop = null; saveLoan(lr.sh, lr.i, L);
    notify_(L.project, [], [r.by], u.id, '⛔ Không duyệt bỏ thông tin mượn ' + L.itemName + '\nLý do: ' + why);
    return { success:true };
  }
  const q = Math.min(r.q, loanRem_(L));
  L.closeQty = r3((+L.closeQty || 0) + q); L.closeReason = r.reason + (r.note ? ' · ' + r.note : '');
  if (loanRem_(L) <= 1e-9) L.status = 'closed';
  const h = { id:r.id, t:'bo', q:q, note:L.closeReason, by:r.byName, ap:u.name, at:nowTxt() };
  if (L.link && L.link.st === 'ok') { h.lk = 'cho'; notify_(L.link.p, ['k_loan'], [], u.id, '🏷 ' + L.project + ' bỏ thông tin mượn ' + q + ' ' + L.unit + ' ' + L.itemName + ' (' + r.reason + ')\nMở app Kho → Tổng quan để xác nhận theo.'); }
  L.history.push(h); L.drop = null; saveLoan(lr.sh, lr.i, L);
  writeLog(u, 'Duyệt bỏ thông tin mượn', q + ' ' + L.unit + ' ' + L.itemName + ' · ' + L.party + ' · ' + r.reason + ' · đề xuất: ' + r.byName);
  notify_(L.project, [], [r.by], u.id, '✅ Đã duyệt bỏ thông tin mượn ' + q + ' ' + L.unit + ' ' + L.itemName);
  return { success:true };
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
  if (!hasP(u, 'v_all')) return { success:false, forbidden:true, error:'Chỉ Admin và Lãnh đạo xem được tổng hợp dự án' };
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
    const it = { id:String(r[0]), name:String(r[1]), cat:String(r[2]), unit:String(r[3]), stock:+r[4] || 0, min:+r[5] || 0, proj:String(r[6]), site:+r[TABLES.items.cols.indexOf('site')] || 0 };
    it.dau = /\bd[aầ]u\s*d\.?o\b|diesel/i.test(it.name);              // dầu DO
    item[it.id] = it;
    const p = P[it.proj]; if (!p) return;
    p.items++; if (it.min > 0 && it.stock <= it.min) p.low++; if (it.stock <= 0 && !(it.site > 0)) p.out++;
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
function applyStock(changes, siteCh) {
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), rows = readRows(tk, T.cols.length), sc = ctSiteCol_();
  Object.keys(changes).forEach(id => {
    const d = changes[id]; if (!d) return;
    const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(id));
    if (i < 0) return;
    tk.getRange(i + 2, 5).setValue(Math.round(((+rows[i][4] || 0) + d) * 100) / 100);
  });
  Object.keys(siteCh || {}).forEach(id => {                 // v5.35: ở công trường
    const d = siteCh[id]; if (!d) return;
    const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(id));
    if (i >= 0) tk.getRange(i + 2, sc).setValue(Math.round(((+rows[i][sc - 1] || 0) + d) * 1000) / 1000);
  });
}
const ctColTx_ = () => TXN.cols.indexOf('ct');
function txnEffect(r) {                      // r: dòng GiaoDich (mảng) → tác động lên tồn
  return ctFx_(String(r[1]), r[ctColTx_()], +r[4] || 0)[0];
}
function siteEffect(r) { return ctFx_(String(r[1]), r[ctColTx_()], +r[4] || 0)[1]; }   // v5.35
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
  return (delta > 0 ? '+' : '') + delta + ' ' + t.unit + ' ' + t.itemName + (t.ct && CT_LBL[t.ct] ? ' · ' + CT_LBL[t.ct] : '') +
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
    rows.forEach((r, j) => { if ((String(r[4]) === 'Thêm ảnh biên bản' || String(r[4]) === THANG_LOG) && re.test(String(r[5]))) del[j] = 1; });
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
  const ch = {}, sch = {}, addS = (id, v) => { if (v) sch[String(id)] = (sch[String(id)] || 0) + v; };
  if (afterMoc_(old.itemId, old.datetime)) ch[String(old.itemId)] = (ch[String(old.itemId)] || 0) - txnEffect(rows[i]);
  if (afterMoc_(nw.itemId, nw.datetime)) ch[String(nw.itemId)] = (ch[String(nw.itemId)] || 0) + ctFx_(old.type, old.ct, qty)[0];
  addS(old.itemId, -siteEffect(rows[i])); addS(nw.itemId, ctFx_(old.type, old.ct, qty)[1]);   // v5.35
  const j = String(old.thangCT || '') !== '' ? rows.findIndex(r => r[0] !== '' && String(r[0]) === String(old.thangCT)) : -1;
  if (j >= 0) {                                                // v5.22: phiếu thẳng ra công trường → phiếu đi cặp đổi theo (vật tư, số lượng, ngày giờ)
    const po = rowToObj(TXN.cols, rows[j]);
    const pn = Object.assign({}, po, { itemId: nw.itemId, itemName: nw.itemName, unit: nw.unit, qty: qty, datetime: nw.datetime, clientTime: '' });
    gd.getRange(j + 2, 1, 1, TXN.cols.length).setValues([TXN.cols.map(c => toCell(pn[c] === undefined ? '' : pn[c]))]);
    if (afterMoc_(po.itemId, po.datetime)) ch[String(po.itemId)] = (ch[String(po.itemId)] || 0) - txnEffect(rows[j]);
    if (afterMoc_(pn.itemId, pn.datetime)) ch[String(pn.itemId)] = (ch[String(pn.itemId)] || 0) + ctFx_(po.type, po.ct, qty)[0];
    addS(po.itemId, -siteEffect(rows[j])); addS(pn.itemId, ctFx_(po.type, po.ct, qty)[1]);
    const rn = nw.type === 'nhap' ? nw : pn, rx = nw.type === 'nhap' ? pn : nw, lg = logSheet();
    if (lg) readRows(lg, LOG.cols.length).forEach((r, k) => { if (String(r[4]) === THANG_LOG && idRe(rn.id).test(String(r[5]))) {
      lg.getRange(k + 2, 1).setValue(toCell(String(nw.datetime))); lg.getRange(k + 2, 6).setValue(toCell(thangLogDetail_(rn, rx).slice(0, 500))); } });
  }
  applyStock(ch, sch);
  bumpTxnRev();
  return { success:true, datetime:nw.datetime };
}

function deleteTxn(u, d) {
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  const rows = gd ? readRows(gd, TXN.cols.length) : [];
  const i = rows.findIndex(r => r[0] !== '' && String(r[0]) === String(d.id));
  if (i < 0) return { success:true, duplicate:true };              // đã xóa rồi
  if (LOAN_TXN_LABEL[String(rows[i][1])]) fail('Phiếu cho mượn / trả: xóa ở mục Cho mượn / Trả');
  const del = [i], tc = TXN.cols.indexOf('thangCT');
  const pj = String(rows[i][tc] || '') !== '' ? rows.findIndex(r => r[0] !== '' && String(r[0]) === String(rows[i][tc])) : -1;
  if (pj >= 0) del.push(pj);                                   // v5.22: phiếu thẳng ra công trường → xóa cả phiếu đi cặp
  const roots = del.map(k => String(rows[k][0]));
  rows.forEach((r, k) => { if (del.indexOf(k) < 0 && String(r[1]) === 'dieuchinh' && roots.indexOf(String(r[12])) >= 0) del.push(k); });   // phiếu điều chỉnh gắn kèm
  const ch = {}, kkItems = [], sch = {};
  del.forEach(k => {
    const se = siteEffect(rows[k]); if (se) sch[String(rows[k][2])] = (sch[String(rows[k][2])] || 0) - se;   // v5.35
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
  applyStock(ch, sch);
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
    const lr = findLoanRow(d.txnId), hr = lr ? null : hongFind_(d.txnId);     // v5.50: ảnh báo hỏng
    if (!lr && !hr) fail('Không tìm thấy phiếu để gắn ảnh');
    photoProj = lr ? lr.loan.project : hr.project;
    label = lr ? (lr.loan.kind === 'cho' ? 'Cho mượn ' : 'Đi mượn ') + lr.loan.itemName : 'Báo hỏng ' + hr.itemName;
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
  t.salt = Utilities.getUuid(); t.hash = hashPw(TEMP_PW, t.salt); t.status = 'active'; t.role = 'ADM';
  saveUsers(users); revokeSessions(t.id);
  CacheService.getScriptCache().remove('F_' + ADMIN_USERNAME);
  writeLog({ id:'', name:'(Chủ Sheet)', role:'ADM' }, 'Đặt lại mật khẩu Admin', '@' + ADMIN_USERNAME);
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
  if (!hasP(u, 'g_view')) return { success:false, forbidden:true, error:'Bạn không có quyền xem chi phí vật tư' };
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
  if (hit) return Object.assign(hit, { canEdit:hasP(u, 'g_price'), canProgress:hasP(u, 'g_prog'), projects:projects, cached:true });
  const res = costCalc_(P);
  try { const t = JSON.stringify(res); if (t.length < 95000) cache.put(key, t, 600); } catch (e) {}
  return Object.assign(res, { canEdit:hasP(u, 'g_price'), canProgress:hasP(u, 'g_prog'), projects:projects });
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
  if (!hasP(u, 'g_view')) return { success:false, forbidden:true, error:'Bạn không có quyền xem giá vật tư' };
  const P = String(d.project || ''); mustAllow(u, P);
  const prices = loadPrices_(P), nCount = {};
  const gd = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TXN.sheet);
  (gd ? readRows(gd, 7) : []).forEach(r => { if (String(r[6]) === P && String(r[1]) === 'nhap') nCount[String(r[2])] = (nCount[String(r[2])] || 0) + 1; });
  return { success:true, project:P, canEdit:hasP(u, 'g_price'), today:Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'),
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
const REQ_ST = { cho:'Chờ kho giao', gui:'Kho đã giao', chohang:'Còn thiếu', xong:'Hoàn thành', tuchoi:'Từ chối', huy:'Đã hủy' };
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
const OLD_KEY = { tao:'y_tao', bs:'y_bs', duyet:'y_duyet', nhan:'y_nhan', xemMoi:'y_xem', ton:'v_ton', tienDo:'g_prog', chiPhi:'g_view' };
function can_(u, key) {
  return hasP(u, OLD_KEY[key] || key);                         // v5.15: theo bảng quyền chức danh
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

// ===== v5.43.0: NẠP SỔ NHẬP XUẤT TỪ EXCEL (Admin) — mỗi dòng sổ → 1 phiếu nhập / xuất; cột src = "đợt|khóa dòng" để nạp lại không nhân đôi, xóa được cả đợt =====
function nxtSrcCol_() { return TXN.cols.indexOf('src'); }
function nxtInfo(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const gd = sheetOf(TXN.sheet, TXN.head), rows = readRows(gd, TXN.cols.length), sc = nxtSrcCol_(), pc = TXN.cols.indexOf('project');
  const keys = [], B = {};
  rows.forEach(r => {
    const v = String(r[sc] || ''); if (!v || String(r[pc]) !== P) return;
    const k = v.indexOf('|'), b = v.slice(0, k); keys.push(v.slice(k + 1));
    if (!B[b]) B[b] = { batch:b, n:0, by:String(r[TXN.cols.indexOf('createdByName')] || '') }; B[b].n++;
  });
  const meta = jget_('nxtBatch', {});
  const batches = Object.keys(B).map(b => Object.assign(B[b], meta[b] || {})).sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
  return { success:true, keys:keys, batches:batches, maps:(jget_('nxtMap', {})[P]) || {} };
}
function nxtImport(u, d0) {
  const P = String(d0.project || ''); mustAllow(u, P);
  const batch = clean(String(d0.batch || ''), 40); if (!/^[A-Za-z0-9_-]{4,40}$/.test(batch)) fail('Mã đợt nạp không hợp lệ');
  const list = Array.isArray(d0.rows) ? d0.rows : []; if (list.length > 600) fail('Mỗi lần gửi tối đa 600 dòng');
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), items = readRows(tk, T.cols.length);
  const idMap = {}, base = Date.now() * 1000;
  let k = 0;
  // 1) món mới (chỉ gửi ở lần đầu của đợt) — trùng tên trong dự án thì dùng món có sẵn
  (Array.isArray(d0.newItems) ? d0.newItems : []).forEach(x => {
    const name = clean(String(x.name || ''), 150).trim(); if (!name) return;
    const nk = normName_(name), ex = items.find(r => r[0] !== '' && String(r[6]) === P && normName_(r[1]) === nk);
    if (ex) { idMap[String(x.tmp)] = ex[0]; return; }
    const cat = clean(String(x.cat || 'khac'), 30), fl = defaultFlags_(cat, name);
    const o = { id:base + (k++), name:name, cat:cat, unit:clean(String(x.unit || 'Cái'), 30) || 'Cái', stock:0, minStock:0, project:P, capThang:fl.capThang, canMay:fl.canMay, maQL:'', ngoaiDM:2, site:'', theoDoi:'' };
    tk.appendRow(T.cols.map(c => toCell(o[c] === undefined ? '' : o[c])));
    items.push(T.cols.map(c => o[c] === undefined ? '' : o[c]));
    idMap[String(x.tmp)] = o.id;
  });
  // 2) phiếu
  const gd = sheetOf(TXN.sheet, TXN.head), sc = nxtSrcCol_(), pc = TXN.cols.indexOf('project');
  const have = {}; readRows(gd, TXN.cols.length).forEach(r => { const v = String(r[sc] || ''); if (v && String(r[pc]) === P) have[v.slice(v.indexOf('|') + 1)] = 1; });
  const out = [], ch = {}, skip = { dup:0, bad:0 };
  list.forEach(x => {
    const key = clean(String(x.k || ''), 40);
    if (!key || have[key]) { skip.dup++; return; }
    const itemId = x.itemId !== undefined && x.itemId !== '' ? x.itemId : idMap[String(x.tmp)];
    const it = items.find(r => r[0] !== '' && String(r[0]) === String(itemId) && String(r[6]) === P);
    const qty = Math.round((+x.qty || 0) * 1000) / 1000, type = x.type === 'nhap' ? 'nhap' : x.type === 'xuat' ? 'xuat' : '';
    let when = ''; try { when = checkTime(x.time); } catch (e) {}
    if (!it || !(qty > 0) || !type || !when) { skip.bad++; return; }
    have[key] = 1;
    const row = { id:base + (k++), type:type, ct:'', itemId:it[0], itemName:String(it[1]), qty:qty, unit:String(it[3]), project:P,
      supplierOrReceiver:clean(String(x.party || ''), 150), thietBi:type === 'xuat' ? clean(String(x.thietBi || ''), 150) : '', datetime:when,
      note:clean(String(x.note || ''), 300), reason:'', refId:'', createdBy:u.id, createdByName:u.name, clientTime:'', meter:'', meterNote:'', thangCT:'', src:batch + '|' + key };
    out.push(TXN.cols.map(c => toCell(row[c] === undefined ? '' : row[c])));
    if (afterMoc_(it[0], when)) { const id = String(it[0]); ch[id] = (ch[id] || 0) + (type === 'nhap' ? qty : -qty); }
  });
  if (out.length) gd.getRange(gd.getLastRow() + 1, 1, out.length, TXN.cols.length).setValues(out);
  applyStock(ch, {});
  if (out.length) bumpTxnRev();
  if (Array.isArray(d0.maps) && d0.maps.length) { const M = jget_('nxtMap', {}); M[P] = M[P] || {}; d0.maps.slice(0, 20).forEach(x => { if (x && x.sig && x.m) M[P][clean(String(x.sig), 300)] = { hdr:+x.m.hdr || 0, kieu:+x.m.kieu === 2 ? 2 : 1, cols:x.m.cols || {} }; }); jset_('nxtMap', M); }
  const meta = jget_('nxtBatch', {}); if (!meta[batch]) { meta[batch] = { at:nowTxt(), file:clean(String(d0.file || ''), 120), project:P }; jset_('nxtBatch', meta); }
  if (d0.last) writeLog(u, 'Nạp sổ NXT từ Excel', P + ' · ' + clean(String(d0.file || ''), 120) + ' · đợt ' + batch);
  return { success:true, added:out.length, dup:skip.dup, bad:skip.bad, idMap:idMap };
}
function nxtUndo(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const batch = String(d.batch || ''); if (!batch) fail('Thiếu mã đợt');
  const gd = sheetOf(TXN.sheet, TXN.head), rows = readRows(gd, TXN.cols.length), sc = nxtSrcCol_(), pc = TXN.cols.indexOf('project');
  const keep = [], del = [], ch = {};
  rows.forEach((r, i) => {
    const v = String(r[sc] || '');
    if (v.indexOf(batch + '|') === 0 && String(r[pc]) === P) {
      del.push(i); const id = String(r[2]);
      if (afterMoc_(id, fromCell(r[9]))) ch[id] = (ch[id] || 0) - txnEffect(r);
    } else keep.push(r);
  });
  if (!del.length) return { success:true, deleted:0 };
  if (del.length <= 30) deleteSheetRows(gd, del);
  else writeAll(gd, TXN.cols, keep.map(r => rowToObj(TXN.cols, r)));
  applyStock(ch, {});
  bumpTxnRev();
  const meta = jget_('nxtBatch', {}); delete meta[batch]; jset_('nxtBatch', meta);
  writeLog(u, 'Xóa đợt nạp sổ NXT', P + ' · đợt ' + batch + ' · ' + del.length + ' phiếu');
  return { success:true, deleted:del.length };
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
    props_().setProperty('ckv', String(Date.now()));
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
  const auto = hasP(u, 'y_duyet');                            // người có quyền duyệt lập phiếu → không cần duyệt
  const r = { id:nextReqId_(), project:P, kind:kind, ckId:ckId, ckName:ckName, may:may, title:title, lines:lines, opt:opt, bs:bs,
    note:clean(String(d0.note || ''), 300), status:'cho', duyet: auto ? 'tudong' : 'chua', duyetBy:'', duyetAt:'', reject:'',
    createdBy:u.id, createdByName:u.name, createdRole:u.role, datetime:now, clientTime:String(d0.clientTime || '').slice(0, 40),
    log:[{ t:now, x:shortName_(u) + ' (' + (ROLE_NAME[u.role] || u.role) + ') tạo phiếu' + (auto ? ' · không cần duyệt' : '') }], test:'' };
  const sh = reqSheet_(); saveReq_(sh, readRows(sh, 1).length, r);
  writeLog(u, 'Tạo phiếu yêu cầu', r.id + ' · ' + title);
  const sum = lines.map(l => l.itemName.replace(/Cóc nối thép /i, 'Cóc ') + ': ' + l.req).join(', ');
  notify_(P, ['y_giao'].concat(auto ? [] : ['y_duyet']), [], u.id,
    '🔴 PHIẾU MỚI ' + r.id + '\n' + title + '\n' + sum + '\nNgười yêu cầu: ' + u.name + (auto ? '' : '\n⚠ Chờ CHT/CHP duyệt (kho vẫn giao trước được)'));
  return { success:true, req:r };
}

function approveReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (!can_(u, 'duyet')) fail('Bạn không có quyền duyệt phiếu');
  if (r.duyet !== 'chua') return { success:true, duplicate:true, req:r };
  if (r.status === 'tuchoi' || r.status === 'huy') fail('Phiếu đã ' + REQ_ST[r.status].toLowerCase());
  const now = nowTxt(), after = r.status !== 'cho';
  r.duyet = after ? 'sau' : 'da'; r.duyetBy = u.name; r.duyetAt = now;
  r.log.push({ t:now, x:shortName_(u) + ' (' + ROLE_NAME[u.role] + ') ' + (after ? 'duyệt sau khi kho giao' : 'duyệt') });
  saveReq_(x.sh, x.i, r);
  writeLog(u, 'Duyệt phiếu yêu cầu', r.id + (after ? ' (sau khi cấp)' : ''));
  return { success:true, req:r };
}

function rejectReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  const why = clean(String(d.reason || ''), 200);
  if (!why) fail('Nhập lý do từ chối');
  if (r.status !== 'cho' || r.lines.some(l => +l.sent > 0)) fail('Chỉ từ chối được phiếu chưa cấp');
  const kho = hasP(u, 'y_giao');
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
function fmtQ_(q) { return String(Math.round(q * 1000) / 1000).replace('.', ','); }
function issueReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (['cho','gui','chohang'].indexOf(r.status) < 0) fail('Phiếu đã ' + (REQ_ST[r.status] || r.status).toLowerCase());
  const send = Array.isArray(d.send) ? d.send : [];
  const T = TABLES.items, tk = sheetOf(T.sheet, T.head), items = readRows(tk, T.cols.length);
  const gd = sheetOf(TXN.sheet, TXN.head), now = nowTxt(), made = [];
  const fillT = d.fillAt && r.may ? fillAt_(d.fillAt) : '';          // v5.46: giờ cấp dầu thực tế
  const plan = r.lines.map((l, k) => {
    const q = Math.round((+send[k] || 0) * 1000) / 1000, rem = (+l.req || 0) - (+l.sent || 0);
    if (q < 0) fail('Số gửi không hợp lệ');
    if (q > rem + 1e-9) fail(l.itemName + ': giao vượt số chưa giao (' + rem + ')');
    const i = items.findIndex(z => String(z[0]) === String(l.itemId));
    if (i < 0) fail('Vật tư ' + l.itemName + ' không còn trong kho');
    if (q > (+items[i][4] || 0) + 1e-9) fail('Không đủ tồn kho ' + l.itemName + ' (còn ' + (+items[i][4] || 0) + '). Kiểm kê nếu thực tế còn hàng.');
    return { k:k, q:q, i:i };
  });
  if (!plan.some(p => p.q > 0)) fail('Nhập số lượng giao');
  const sig = plan.map(p => p.q).join('|'), dk = 'ISS_' + r.id, C = CacheService.getScriptCache();   // v5.20.3: giao trùng trong 2 phút → hỏi lại
  if (!d.force) {
    let last = null; try { last = JSON.parse(C.get(dk) || 'null'); } catch (e) {}
    if (last && last.by === u.id && last.sig === sig && Date.now() - last.t < 120000) {
      const at = Utilities.formatDate(new Date(last.t), TZ, 'HH:mm');
      return { success:false, dupConfirm:true, error:'Bạn vừa giao ' + plan.filter(p => p.q).map(p => fmtQ_(p.q) + ' ' + r.lines[p.k].unit + ' ' + r.lines[p.k].itemName).join(', ') +
        ' theo phiếu ' + r.id + ' lúc ' + at + '. Chắc chắn giao thêm 1 lần nữa cùng số lượng?' };
    }
  }
  let n = 0;
  plan.forEach(p => {
    if (!p.q) return;
    const l = r.lines[p.k], it = items[p.i];
    const pct = ctTrack_(it) ? 'ra' : '';                                       // v5.35: thiết bị / vật tư phụ trợ cấp ra công trường vẫn ghi nhận
    const row = { id: Date.now() * 100 + (n++), type:'xuat', ct: pct, itemId: it[0], itemName: String(it[1]), qty: p.q, unit: String(it[3]), project: r.project,
      supplierOrReceiver: r.createdByName, thietBi: r.may || '', datetime: fillT || now,
      note: 'Theo ' + r.id + (r.ckName ? ' · ' + r.ckName : '') + (r.duyet === 'chua' ? ' · ⚠ CHT/CHP CHƯA DUYỆT' : ''),
      reason:'', refId: r.id, createdBy: u.id, createdByName: u.name, clientTime: '',
      meter: d.meter !== '' && d.meter !== undefined && !isNaN(+d.meter) ? +d.meter : '', meterNote: clean(String(d.meterNote || ''), 120) };
    gd.appendRow(TXN.cols.map(c => toCell(row[c])));
    const v = Math.round(((+it[4] || 0) - p.q) * 100) / 100; tk.getRange(p.i + 2, 5).setValue(v); it[4] = v;
    if (pct) { const sc = ctSiteCol_(), sv = Math.round(((+it[sc - 1] || 0) + p.q) * 1000) / 1000; tk.getRange(p.i + 2, sc).setValue(sv); it[sc - 1] = sv; }
    l.sent = Math.round(((+l.sent || 0) + p.q) * 1000) / 1000; l.last = p.q; (l.px = l.px || []).push(String(row.id));
    made.push(row);
  });
  const partial = remain_(r) > 0;
  r.status = 'gui';
  r.log.push({ t:now, x:shortName_(u) + ' (Thủ kho) ' + (partial ? 'giao một phần' : 'đã giao hàng') + (r.duyet === 'chua' ? ' khi chưa duyệt' : '') });
  saveReq_(x.sh, x.i, r);
  try { C.put(dk, JSON.stringify({ by:u.id, sig:sig, t:Date.now() }), 600); } catch (e) {}
  made.forEach(row => writeLog(u, 'Phiếu xuất', txnLogDetail(row)));
  notify_(r.project, [], [r.createdBy], u.id, '🚚 Kho đã giao ' + r.id + (partial ? ' (MỘT PHẦN, phần thiếu giao sau)' : '') + '\n' + r.title +
    '\n' + made.map(m => m.itemName.replace(/Cóc nối thép /i, 'Cóc ') + ': ' + m.qty).join(', ') + '\nNhận hàng xong bấm "Đã nhận" trên app.');
  return { success:true, req:r, txns:made.map(m => TXN.cols.map(c => m[c])) };
}

// Bên yêu cầu xác nhận. recv[k] = số thực nhận của dòng k ở LẦN GỬI GẦN NHẤT (bỏ trống = nhận đủ). Phần thiếu hoàn kho bằng phiếu điều chỉnh.
function receiveReq(u, d) {
  const x = loadReq_(d.id), r = x.r; mustAllow(u, r.project);
  if (r.status !== 'gui') fail('Phiếu chưa ở trạng thái kho đã giao');
  if (r.createdBy !== u.id && !can_(u, 'nhan')) fail('Bạn không có quyền xác nhận nhận hàng');
  const recv = Array.isArray(d.recv) ? d.recv : [], now = nowTxt(), adj = [], gd = sheetOf(TXN.sheet, TXN.head);
  const pend = {}; r.lines.forEach(l => { pend[l.itemId] = 0; });
  let n = 0;
  r.lines.forEach((l, k) => {
    const lastQ = +l.last || 0; l.last = 0;                 // số kho gửi ở lần gần nhất
    if (recv[k] === undefined || recv[k] === null || recv[k] === '') return;
    const got = Math.round((+recv[k]) * 1000) / 1000;
    if (!(got >= 0) || got > lastQ) fail(l.itemName + ': số thực nhận phải từ 0 đến số kho giao lần này ' + lastQ);
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
    notify_(r.project, ['y_giao'], [], u.id, (r.status === 'chohang' ? '📦 ' + r.id + ' còn thiếu, cần giao tiếp' : 'ℹ️ ' + r.id + ' người nhận đã nhận') +
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
  let last = off; const replies = [];
  withLock(() => {
    const users = loadUsers(); let changed = false;
    res.result.forEach(up => {
      last = Math.max(last, up.update_id + 1);
      const m = up.message; if (!m || !m.text) return;
      const chat = String(m.chat.id), code = (String(m.text).match(/^\/start\s+(\S+)/) || [])[1];
      const u = code ? users.find(x => x.status === 'active' && tgCode_(x.id) === code) : null;
      if (u) { u.tgChat = chat; changed = true; replies.push({ chat_id:chat, text:'✅ Đã liên kết FECON Kho với tài khoản ' + u.name + '. Bạn sẽ nhận cảnh báo phiếu yêu cầu tại đây.' }); }
      else replies.push({ chat_id:chat, text:'Mở app FECON Kho → Menu → "Nhận cảnh báo Telegram" và bấm nút liên kết để kết nối.' });
    });
    if (changed) saveUsers(users);
  });
  replies.forEach(x => tgApi_('sendMessage', x));               // trả lời sau khi mở khóa
  props_().setProperty('TG_OFFSET', String(last));
}
// Gửi tin cho người trong dự án theo vai trò (roles) và/hoặc theo ID (ids); không gửi cho người thao tác
var TG_QUEUE = [];
function notify_(P, roles, ids, exceptId, text) { TG_QUEUE.push([P, roles, ids, exceptId, text]); }   // gửi sau khi mở khóa
function flushTg_() {
  const q = TG_QUEUE; TG_QUEUE = [];
  q.forEach(a => sendTg_(a[0], a[1], a[2], a[3], a[4]));
}
function sendTg_(P, roles, ids, exceptId, text) {
  try {
    const tok = tgToken_(); if (!tok) return;
    const all = loadUsers().filter(x => x.status === 'active' && x.tgChat && x.id !== exceptId &&
      (ids.indexOf(x.id) >= 0 || (roles.some(k => hasP(x, k)) && allowedProjects(x).indexOf(P) >= 0)));
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
function reqBundle_(u, P, d) {
  let reqs = readTable_(REQ, P).map(reqOut_);
  if (!hasP(u, 'y_xem')) reqs = reqs.filter(r => r.createdBy === u.id);
  const ckv = props_().getProperty('ckv') || '1';
  const sendCk = !d || String(d.ckv || '') !== ckv;                 // v5.14: chỉ gửi cấu kiện khi định mức đổi
  const ck = sendCk ? ckRows_(P).map(c => [String(c.id), String(c.hm), String(c.name), String(c.loai), String(c.banVe), String(c.fixed), String(c.optKind), +c.optN || 0]) : undefined;
  const bot = props_().getProperty('TG_BOT') || '';
  return { reqs:reqs, cauKien:ck, ckv:ckv, projCfg:projCfg_(P), kkMoc:kkMoc_(),
    tg:{ bot:bot, linked:!!u.tgChat, link: bot ? 'https://t.me/' + bot + '?start=' + tgCode_(u.id) : '' } };
}

// Cấu kiện dự án TTHC (đọc từ bản vẽ TTHC-FCS-SD-13…16 và DW-011…048): cọc theo loại [số cọc, bản vẽ, cóc cố định]; tấm [tên, thanh ngoài, thanh trong, bản vẽ, loại tấm]
const TTHC_CK_SEED = {"coc":{"P1":[116,"SD-13",{"D25":32,"D20":32,"D16":16}],"P2":[3,"SD-14",{"D25":32,"D20":32,"D16":16}],"P3":[240,"SD-15",{"D25":32,"D20":32,"D16":8}],"P4":[7,"SD-16",{"D25":32,"D20":32}]},"tv":[["P1",39,31,"DW-043","Tấm tiếp góc P1"],["P2",36,36,"DW-017","Tấm tiếp L=5.6m"],["P3",36,36,"DW-017","Tấm tiếp L=5.6m"],["P4",37,37,"DW-013","Tấm đóng L=5.6m"],["P5",36,36,"DW-017","Tấm tiếp L=5.6m"],["P6",36,36,"DW-017","Tấm tiếp L=5.6m"],["P7",36,36,"DW-017","Tấm tiếp L=5.6m"],["P8",36,36,"DW-017","Tấm tiếp L=5.6m"],["P9",36,36,"DW-017","Tấm tiếp L=5.6m"],["P10",20,20,"DW-027","Tấm tiếp L=3.3m"],["P11",35,31,"DW-045","Tấm tiếp góc P11"],["P12",36,36,"DW-017","Tấm tiếp L=5.6m"],["P13",34,34,"DW-011","Tấm mở L=5.6m"],["P14",36,36,"DW-017","Tấm tiếp L=5.6m"],["P15",36,36,"DW-017","Tấm tiếp L=5.6m"],["P16",36,36,"DW-017","Tấm tiếp L=5.6m"],["P17",36,36,"DW-017","Tấm tiếp L=5.6m"],["P18",36,36,"DW-017","Tấm tiếp L=5.6m"],["P19",36,36,"DW-017","Tấm tiếp L=5.6m"],["P20",36,36,"DW-017","Tấm tiếp L=5.6m"],["P21",36,36,"DW-017","Tấm tiếp L=5.6m"],["P22",36,36,"DW-017","Tấm tiếp L=5.6m"],["P23",36,36,"DW-017","Tấm tiếp L=5.6m"],["P24",37,37,"DW-013","Tấm đóng L=5.6m"],["P25",36,36,"DW-017","Tấm tiếp L=5.6m"],["P26",36,36,"DW-017","Tấm tiếp L=5.6m"],["P27",36,36,"DW-017","Tấm tiếp L=5.6m"],["P28",36,36,"DW-017","Tấm tiếp L=5.6m"],["P29",36,36,"DW-017","Tấm tiếp L=5.6m"],["P30",36,36,"DW-017","Tấm tiếp L=5.6m"],["P31",36,36,"DW-017","Tấm tiếp L=5.6m"],["P32",36,36,"DW-017","Tấm tiếp L=5.6m"],["P33",36,36,"DW-017","Tấm tiếp L=5.6m"],["P34",36,36,"DW-017","Tấm tiếp L=5.6m"],["P35",36,36,"DW-017","Tấm tiếp L=5.6m"],["P36",36,36,"DW-017","Tấm tiếp L=5.6m"],["P37",36,36,"DW-017","Tấm tiếp L=5.6m"],["P38",36,36,"DW-017","Tấm tiếp L=5.6m"],["P39",36,36,"DW-017","Tấm tiếp L=5.6m"],["P40",36,36,"DW-017","Tấm tiếp L=5.6m"],["P41",21,21,"DW-031","Tấm tiếp L=3.145m"],["P42",35,32,"DW-047","Tấm tiếp góc P42"],["P43",36,36,"DW-017","Tấm tiếp L=5.6m"],["P44",34,34,"DW-011","Tấm mở L=5.6m"],["P45",36,36,"DW-017","Tấm tiếp L=5.6m"],["P46",36,36,"DW-017","Tấm tiếp L=5.6m"],["P47",36,36,"DW-017","Tấm tiếp L=5.6m"],["P48",36,36,"DW-017","Tấm tiếp L=5.6m"],["P49",36,36,"DW-017","Tấm tiếp L=5.6m"],["P50",36,36,"DW-017","Tấm tiếp L=5.6m"],["P51",37,37,"DW-013","Tấm đóng L=5.6m"],["P52",35,35,"DW-019","Tấm tiếp L=5.547m"],["P53",35,33,"DW-041","Tấm tiếp góc P53"],["P54",36,36,"DW-017","Tấm tiếp L=5.6m"],["P55",36,36,"DW-017","Tấm tiếp L=5.6m"],["P56",36,36,"DW-017","Tấm tiếp L=5.6m"],["P57",28,28,"DW-021","Tấm tiếp L=4.448m"],["P58",35,29,"DW-039","Tấm tiếp góc P58"],["P59",21,21,"DW-025","Tấm tiếp L=3.457m"],["P60",36,36,"DW-017","Tấm tiếp L=5.6m"],["P61",36,36,"DW-017","Tấm tiếp L=5.6m"],["P62",36,36,"DW-017","Tấm tiếp L=5.6m"],["P63",36,36,"DW-017","Tấm tiếp L=5.6m"],["P64",36,36,"DW-017","Tấm tiếp L=5.6m"],["P65",36,36,"DW-017","Tấm tiếp L=5.6m"],["P66",34,34,"DW-011","Tấm mở L=5.6m"],["P67",36,36,"DW-017","Tấm tiếp L=5.6m"],["P68",36,36,"DW-017","Tấm tiếp L=5.6m"],["P69",36,36,"DW-017","Tấm tiếp L=5.6m"],["P70",36,36,"DW-017","Tấm tiếp L=5.6m"],["P71",36,36,"DW-017","Tấm tiếp L=5.6m"],["P72",37,37,"DW-013","Tấm đóng L=5.6m"],["P73",36,36,"DW-017","Tấm tiếp L=5.6m"],["P74",36,36,"DW-017","Tấm tiếp L=5.6m"],["P75",36,36,"DW-017","Tấm tiếp L=5.6m"],["P76",36,36,"DW-017","Tấm tiếp L=5.6m"],["P77",36,36,"DW-017","Tấm tiếp L=5.6m"],["P78",36,36,"DW-037","Tấm tiếp góc P78"],["P79",24,24,"DW-023","Tấm tiếp L=3.903m"],["P80",36,36,"DW-017","Tấm tiếp L=5.6m"],["P81",36,36,"DW-017","Tấm tiếp L=5.6m"],["P82",36,36,"DW-017","Tấm tiếp L=5.6m"],["P83",21,21,"DW-029","Tấm tiếp L=3.2m"],["P84",40,36,"DW-035","Tấm tiếp góc P84"],["P85",36,36,"DW-017","Tấm tiếp L=5.6m"],["P86",45,41,"DW-033","Tấm tiếp góc P86"],["P87",36,36,"DW-017","Tấm tiếp L=5.6m"],["P88",34,34,"DW-011","Tấm mở L=5.6m"],["P89",36,36,"DW-017","Tấm tiếp L=5.6m"],["P90",36,36,"DW-017","Tấm tiếp L=5.6m"],["P91",36,36,"DW-017","Tấm tiếp L=5.6m"],["P92",36,36,"DW-017","Tấm tiếp L=5.6m"],["P93",36,36,"DW-017","Tấm tiếp L=5.6m"],["P94",36,36,"DW-017","Tấm tiếp L=5.6m"],["P95",36,36,"DW-017","Tấm tiếp L=5.6m"],["P96",36,36,"DW-017","Tấm tiếp L=5.6m"],["P97",32,32,"DW-015","Tấm đóng L=4.8m"],["P98",36,36,"DW-017","Tấm tiếp L=5.6m"],["P99",36,36,"DW-017","Tấm tiếp L=5.6m"],["P100",36,36,"DW-017","Tấm tiếp L=5.6m"],["P101",36,36,"DW-017","Tấm tiếp L=5.6m"],["P102",36,36,"DW-017","Tấm tiếp L=5.6m"],["P103",36,36,"DW-017","Tấm tiếp L=5.6m"],["P104",36,36,"DW-017","Tấm tiếp L=5.6m"],["P105",34,34,"DW-011","Tấm mở L=5.6m"],["P106",36,36,"DW-017","Tấm tiếp L=5.6m"],["P107",36,36,"DW-017","Tấm tiếp L=5.6m"],["P108",36,36,"DW-017","Tấm tiếp L=5.6m"],["P109",36,36,"DW-017","Tấm tiếp L=5.6m"],["P110",36,36,"DW-017","Tấm tiếp L=5.6m"],["P111",36,36,"DW-017","Tấm tiếp L=5.6m"],["P112",36,36,"DW-017","Tấm tiếp L=5.6m"],["P113",36,36,"DW-017","Tấm tiếp L=5.6m"],["P114",36,36,"DW-017","Tấm tiếp L=5.6m"],["P115",36,36,"DW-017","Tấm tiếp L=5.6m"],["P116",36,36,"DW-017","Tấm tiếp L=5.6m"],["P117",36,36,"DW-017","Tấm tiếp L=5.6m"]]};


// ---------- v5.14: ghi 1 ô tài khoản ----------
function setUserField_(uid, field, value) {
  const sh = sheetOf(USERS.sheet, USERS.head), n = sh.getLastRow() - 1, ci = USERS.cols.indexOf(field);
  if (n < 1 || ci < 0) return;
  const ids = sh.getRange(2, 1, n, 1).getValues();
  const i = ids.findIndex(r => String(r[0]) === String(uid));
  if (i < 0) return;
  sh.getRange(i + 2, ci + 1).setValue(toCell(value));
  try {                                                         // cập nhật luôn bộ nhớ đệm, không phải đọc lại trang
    const c = CacheService.getScriptCache(), raw = c.get('users');
    if (raw) { const list = JSON.parse(raw), t = list.find(x => x.id === uid); if (t) { t[field] = String(value); c.put('users', JSON.stringify(list), 600); } }
  } catch (e) {}
}

// ---------- v5.14: chép danh mục vật tư từ dự án khác ----------
function normName_(s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/\s+/g, ' ').trim(); }
function listItemsOf(u, d) {
  const T = TABLES.items, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length).filter(r => r[0] !== '');
  const projects = projList().filter(p => p !== String(d.target || ''));
  const P = String(d.project || '');
  const items = P ? rows.filter(r => String(r[6]) === P).map(r => ({ id:String(r[0]), name:String(r[1]), cat:String(r[2]), unit:String(r[3]),
    capThang:+r[7] || 0, canMay:+r[8] || 0 })) : [];
  return { success:true, projects:projects, project:P, items:items };
}
function copyItems(u, d) {
  const to = String(d.toProject || ''), from = String(d.fromProject || '');
  mustAllow(u, to);
  if (!from || from === to) fail('Chọn dự án nguồn khác dự án hiện tại');
  const ids = (Array.isArray(d.ids) ? d.ids : []).map(String);
  if (!ids.length) fail('Chưa chọn vật tư nào');
  const T = TABLES.items, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length);
  const have = {}; rows.forEach(r => { if (String(r[6]) === to) have[normName_(r[1])] = 1; });
  const src = rows.filter(r => String(r[6]) === from && ids.indexOf(String(r[0])) >= 0);
  let k = 0; const add = [], skip = [];
  const base = Date.now() * 10;
  src.forEach(r => {
    const key = normName_(r[1]);
    if (have[key]) { skip.push(String(r[1])); return; }
    have[key] = 1;
    add.push([base + (k++), String(r[1]), String(r[2]), String(r[3]), 0, 0, to, +r[7] || 0, +r[8] || 0, String(r[9] || ''), r[10] === '' || r[10] === undefined ? '' : +r[10]]);
  });
  if (add.length) sh.getRange(rows.length + 2, 1, add.length, T.cols.length).setValues(add.map(r => r.map(toCell)));
  if (add.length) writeLog(u, 'Chép vật tư từ dự án khác', from + ' → ' + to + ': ' + add.length + ' vật tư' + (skip.length ? ' (bỏ qua ' + skip.length + ' đã có)' : ''));
  return { success:true, added:add.length, skipped:skip, duplicate: !add.length };
}

// =====================================================================
// v5.15.0 — CHỨC DANH & PHÂN QUYỀN DO ADMIN CÀI TRONG APP
// =====================================================================
const PERMS = ['v_pyc','v_home','v_nhap','v_xuat','v_ton','v_baocao','v_stat','v_all',
  'k_nhap','k_xuat','k_edit','k_kk','k_dm','k_copy','k_loan','g_view','g_price','g_prog',
  'y_tao','y_bs','y_duyet','y_giao','y_nhan','y_xem','x_nxt','x_pyc','k_meter','v_ver','k_thang','k_bomuon','k_hd',
  't_xem','t_ghi','t_qa','t_cht','t_kh','t_qs','t_qt'];                                    // v5.23: Thi công
// v5.23: quyền Thi công mặc định theo chức danh (Admin sửa lại được trong app)
const TC_DEF = { TS:['t_xem','t_ghi'], SE:['t_xem','t_ghi'], EE:['t_xem','t_ghi'], HSE:['t_xem','t_ghi'], PE:['t_xem','t_ghi','t_kh'],
  SUP:['t_xem','t_qa'], QS:['t_xem','t_qs'], SK:[], DEQ:['t_xem'], EQM:['t_xem'], DCM:['t_xem','t_ghi','t_qa','t_cht','t_kh'], CM:['t_xem','t_ghi','t_qa','t_cht','t_kh'],
  ACC:['t_xem'], PD:['t_xem','t_cht','t_kh','t_qs'], DMD:['t_xem'], MD:['t_xem'], QL:['t_xem','t_ghi','t_qa','t_cht','t_kh','t_qs','t_qt'] };
const VER_ROLES = ['CM','DCM','EQM','DEQ'];
const V_ALL6 = ['v_pyc','v_home','v_nhap','v_xuat','v_ton','v_baocao'];
const ROLE_GROUPS = {
  g1: ['① Phiếu YC', ['v_pyc','y_tao','y_bs','y_nhan','y_xem']],
  g2: ['② Giám sát', ['v_pyc','y_xem']],
  g3: ['③ Xem toàn bộ', V_ALL6.concat(['v_stat','g_view','y_xem','x_nxt','x_pyc'])],
  g4: ['④ Kho', V_ALL6.concat(['k_nhap','k_xuat','k_edit','k_kk','k_dm','k_copy','k_loan','y_giao','y_xem','x_nxt','x_pyc','k_meter','k_thang'])],
  g5: ['⑤ Đầy đủ', V_ALL6.concat(['v_stat','g_view','g_prog','y_xem','x_nxt','x_pyc','k_meter'])],
  g6: ['⑥ Lãnh đạo', V_ALL6.concat(['v_stat','v_all','g_view','y_xem','x_nxt','x_pyc'])],
  gq: ['Quản lý (cũ)', PERMS.filter(k => k !== 'v_all')],
  ga: ['Quản trị', PERMS]
};
const ROLE_SEED = [
  ['TS','Nhân viên kỹ thuật','g1'], ['SE','Kỹ sư công trường','g1'], ['EE','Kỹ sư điện','g1'], ['HSE','Kỹ sư an toàn','g1'], ['PE','Kỹ sư dự án','g1'],
  ['SUP','Giám sát','g2'], ['QS','Kỹ sư đấu thầu / báo giá','g3'], ['SK','Thủ kho','g4'],
  ['DEQ','Phó phòng QL thiết bị','g5'], ['EQM','Trưởng phòng QL thiết bị','g5'], ['DCM','Chỉ huy phó','g5'], ['CM','Chỉ huy trưởng','g5'],
  ['ACC','Kế toán','g5'], ['PD','Giám đốc dự án','g5'], ['DMD','Phó giám đốc công ty','g6'], ['MD','Giám đốc công ty','g6'],
  ['QL','Quản lý (cũ)','gq'], ['ADM','Quản trị hệ thống','ga']
];
const OLD_ROLE = { admin:'ADM', ql:'QL', tk:'SK', cht:'CM', chp:'DCM', ktv:'TS', ld:'MD', xem:'SUP' };
function presetPerm_(code, group) {
  const o = {}, on = (ROLE_GROUPS[group] || ROLE_GROUPS.g2)[1];
  PERMS.forEach(k => o[k] = on.indexOf(k) >= 0 ? 1 : 0);
  if (code === 'CM' || code === 'DCM') { o.y_tao = o.y_bs = o.y_duyet = o.y_nhan = 1; }
  if (code === 'ACC' || code === 'PD') o.k_meter = 0;           // v5.16: ghi giờ máy mặc định SK, DEQ, EQM, CM, DCM
  if (VER_ROLES.indexOf(code) >= 0) o.v_ver = 1;                 // v5.20.2: xem nội dung cập nhật phiên bản
  if (code === 'DEQ' || code === 'EQM') o.k_hd = 1;              // v5.46: ghi ngày máy bắt đầu hoạt động — P.QLTB
  (TC_DEF[code] || (group === 'ga' ? PERMS.filter(k => k.indexOf('t_') === 0) : ['t_xem'])).forEach(k => o[k] = 1);   // v5.23
  return o;
}
var ROLES_MEMO = null;
function rolesAll_() {
  if (ROLES_MEMO) return ROLES_MEMO;
  let r = jget_('roles515', null);
  if (!r) {
    r = {};
    ROLE_SEED.forEach(x => r[x[0]] = { abbr:x[0], name:x[1], group:x[2], perm:presetPerm_(x[0], x[2]) });
    jset_('roles515', r);
  }
  Object.keys(r).forEach(k => { const p = r[k].perm || {}; PERMS.forEach(x => { if (p[x] === undefined) p[x] = 0; }); r[k].perm = p; });
  if (!props_().getProperty('perm516')) {                       // v5.16: bật quyền ghi giờ máy cho SK, DEQ, EQM, CM, DCM, QL
    ['SK','DEQ','EQM','CM','DCM','QL'].forEach(k => { if (r[k]) r[k].perm.k_meter = 1; });
    jset_('roles515', r); props_().setProperty('perm516', '1');
  }
  if (!props_().getProperty('perm5202')) {                      // v5.20.2: bật quyền xem nội dung cập nhật cho CM, DCM, EQM, DEQ
    VER_ROLES.forEach(k => { if (r[k]) r[k].perm.v_ver = 1; });
    jset_('roles515', r); props_().setProperty('perm5202', '1');
  }
  if (!props_().getProperty('perm5400')) {                      // v5.40: duyệt bỏ thông tin mượn — CHT, CHP, P.QLTB
    ['CM','DCM','DEQ','EQM'].forEach(k => { if (r[k]) r[k].perm.k_bomuon = 1; });
    jset_('roles515', r); props_().setProperty('perm5400', '1');
  }
  if (!props_().getProperty('perm5460')) {                      // v5.46: ghi ngày máy bắt đầu hoạt động — PP / TP QLTB (Admin bật thêm cho cán bộ QLTB)
    Object.keys(r).forEach(k => { if (k === 'DEQ' || k === 'EQM' || /thiet bi|qltb/.test(String(r[k].name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'))) r[k].perm.k_hd = 1; });
    jset_('roles515', r); props_().setProperty('perm5460', '1');
  }
  if (!props_().getProperty('perm5230')) {                      // v5.23: quyền Thi công mặc định
    Object.keys(r).forEach(k => { const on = TC_DEF[k] || (k === 'ADM' ? PERMS.filter(x => x.indexOf('t_') === 0) : ['t_xem']); on.forEach(x => r[k].perm[x] = 1); });
    jset_('roles515', r); props_().setProperty('perm5230', '1');
  }
  if (!props_().getProperty('perm5220')) {                      // v5.22: nhập thẳng ra công trường — mặc định chỉ Thủ kho
    if (r.SK) r.SK.perm.k_thang = 1;
    jset_('roles515', r); props_().setProperty('perm5220', '1');
  }
  ROLES_MEMO = r; return r;
}
function hasP(u, k) {
  if (!u) return false;
  if (u.role === 'ADM') return true;
  const r = rolesAll_()[u.role];
  return !!(r && r.perm && r.perm[k]);
}
function isGroup_(u, g) { const r = rolesAll_()[u.role]; return !!(r && r.group === g); }
function roleLabel_(code) { const r = rolesAll_()[code]; return r ? r.abbr + ' – ' + r.name : String(code || ''); }
// Chuyển vai trò cũ (admin / ql / tk / cht / chp / ktv / ld / xem) sang chức danh mới — chạy 1 lần
function migrateRoles515_() {
  if (props_().getProperty('rolesMig515')) return;
  rolesAll_();
  const users = loadUsers(); let ch = false;
  users.forEach(x => { if (OLD_ROLE[x.role]) { x.role = OLD_ROLE[x.role]; ch = true; } });
  if (ch) saveUsers(users);
  props_().setProperty('rolesMig515', '1');
}
// Kiểm tra quyền cho từng thao tác (thay cho bậc quyền cũ)
const ANY = () => true, ADM = u => u.role === 'ADM';
const P_ = k => u => hasP(u, k);
const ACT = {
  me:ANY, getAll:ANY, getVersion:ANY, logout:ANY, changePassword:ANY, getPhoto:ANY, tgUnlink:ANY, tgTest:ANY, logoutOthers:ANY,
  addTransaction:(u, d) => hasP(u, d.type === 'nhap' ? 'k_nhap' : d.type === 'xuat' ? 'k_xuat' : 'k_edit'),
  addThang:P_('k_thang'), setThangDS:ADM, qkBatch:u => hasP(u, 'k_nhap') || hasP(u, 'k_xuat'), setDanhMuc:ADM, setCats:ADM, projAdmin:ADM, projRename:ADM, projDelete:ADM, projClose:ADM, setUnits:ADM, hongAdd:u => hasP(u, 'k_nhap') || hasP(u, 'k_xuat'), hongSet:u => hasP(u, 'k_nhap') || hasP(u, 'k_xuat'), hongMove:u => hasP(u, 'k_nhap') || hasP(u, 'k_xuat'),
  upsert:(u, d) => hasP(u, 'k_dm') || ADM(u),
  setMinStock:u => ADM(u) || u.role === 'QL' || (hasP(u, 'k_dm') && hasP(u, 'g_view')),
  uploadPhoto:u => hasP(u, 'k_nhap') || hasP(u, 'k_xuat') || hasP(u, 'k_edit'),
  addLoan:P_('k_loan'), returnLoan:P_('k_loan'), closeLoan:P_('k_loan'),
  loanLinkAccept:P_('k_loan'), loanLinkReject:P_('k_loan'), dropReq:P_('k_loan'), dropDecide:P_('k_bomuon'), loanFix:P_('k_loan'), mergeItems:ADM, setDevStart:u => ADM(u) || hasP(u, 'k_hd'),
  editTxn:ADM, deleteTxn:ADM, nxtInfo:ADM, nxtImport:ADM, nxtUndo:ADM, editLoan:ADM, deleteLoan:ADM,
  getSummary:P_('v_all'), getCost:u => hasP(u, 'g_view'), getPrices:u => hasP(u, 'g_view'),
  setPrice:P_('g_price'), setProgress:P_('g_prog'),
  remove:u => hasP(u, 'k_dm') || ADM(u), updateProjects:ADM, getLog:ADM,
  createReq:P_('y_tao'), approveReq:P_('y_duyet'), rejectReq:u => hasP(u, 'y_giao') || hasP(u, 'y_duyet'), cancelReq:ANY, receiveReq:ANY,
  issueReq:P_('y_giao'), closeDevice:P_('k_meter'), addCount:P_('k_kk'), listItemsOf:P_('k_copy'), copyItems:P_('k_copy'),
  deviceCatalog:u => hasP(u, 'k_dm') || u.role === 'ADM', itemCatalog:u => hasP(u, 'k_dm') || u.role === 'ADM', purgeItems:ADM, setTxnMeter:u => ADM(u) || hasP(u, 'k_xuat') || hasP(u, 'k_meter'), deviceAdminLog:ADM, verLog:P_('v_ver'), qltbSave:ADM, qltbList:ANY,
  saveRole:ADM, deleteRole:ADM, backupInfo:ADM, backupNow:ADM, backupSetup:ADM, setProjCfg:ADM, setItemFlags:ADM,
  listUsers:ADM, setUserProjects:ADM, approveUser:ADM, rejectUser:ADM, updateUser:ADM, deleteUser:ADM, revokeUserSessions:ADM
};
function saveRole(a, d) {
  const all = rolesAll_(), code = String(d.code || '').toUpperCase(), abbr = String(d.abbr || code).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (!abbr) fail('Nhập tên viết tắt');
  const name = clean(String(d.name || ''), 60); if (!name) fail('Nhập tên tiếng Việt');
  if (code === 'ADM' || abbr === 'ADM' && code !== 'ADM') fail('Không sửa được chức danh Quản trị');
  const isNew = !all[code];
  if ((isNew || abbr !== code) && all[abbr]) fail('Viết tắt "' + abbr + '" đã có');
  const group = ROLE_GROUPS[d.group] ? String(d.group) : (all[code] ? all[code].group : 'g2');
  const old = all[code];
  const perm = {}; PERMS.forEach(k => perm[k] = d.perm && d.perm[k] !== undefined ? (d.perm[k] ? 1 : 0) : (old && old.perm && old.perm[k] ? 1 : 0));   // v5.23: app cũ không gửi quyền mới → giữ nguyên
  delete all[code];
  all[abbr] = { abbr:abbr, name:name, group:group, perm:perm };
  if (!isNew && abbr !== code) {                              // đổi viết tắt → chuyển các tài khoản đang dùng
    const users = loadUsers(); let ch = false;
    users.forEach(x => { if (x.role === code) { x.role = abbr; ch = true; } });
    if (ch) saveUsers(users);
  }
  jset_('roles515', all); ROLES_MEMO = null;
  const on = PERMS.filter(k => perm[k]).length;
  writeLog(a, isNew ? 'Thêm chức danh' : 'Sửa quyền chức danh', abbr + ' – ' + name + ' · bật ' + on + '/' + PERMS.length + ' quyền' + (old && abbr !== code ? ' (đổi viết tắt từ ' + code + ')' : ''));
  return { success:true, roles:rolesAll_() };
}
function deleteRole(a, d) {
  const all = rolesAll_(), code = String(d.code || '');
  if (!all[code]) fail('Không tìm thấy chức danh');
  if (code === 'ADM') fail('Không xóa được chức danh Quản trị');
  const n = loadUsers().filter(x => x.role === code).length;
  if (n) fail('Còn ' + n + ' tài khoản dùng chức danh này — đổi chức danh cho họ trước');
  const nm = roleLabel_(code); delete all[code]; jset_('roles515', all); ROLES_MEMO = null;
  writeLog(a, 'Xóa chức danh', nm);
  return { success:true, roles:rolesAll_() };
}
function effPerm_(u) { const o = {}; PERMS.forEach(k => o[k] = hasP(u, k) ? 1 : 0); return o; }

// ---------- Báo đăng nhập trên máy mới (phương án A) ----------
function noteNewLogin_(u, device) {
  const props = props_(), all = props.getProperties(), now = Date.now();
  const others = Object.keys(all).filter(k => { if (k.indexOf('S_') !== 0) return false; try { const v = JSON.parse(all[k]); return v.u === u.id && v.e > now; } catch (e) { return false; } });
  if (others.length < 2) return;                              // chỉ báo khi tài khoản có từ 2 máy trở lên
  props.setProperty('NL_' + u.id, JSON.stringify({ d:String(device || 'máy không rõ tên'), c:now }));
  notify_('FECON Kho', [], [u.id], '', '🔐 Tài khoản ' + u.name + ' (@' + u.username + ') vừa đăng nhập trên máy: ' + (device || 'không rõ tên') +
    ' lúc ' + nowTxt() + '.\nNếu không phải bạn: mở app → Menu → Đổi mật khẩu.');
}
function newLoginInfo_(u) {
  const raw = props_().getProperty('NL_' + u.id); if (!raw) return null;
  try {
    const v = JSON.parse(raw), s = JSON.parse(props_().getProperty(u._key) || '{}');
    return v.c > (s.c || 0) + 5000 ? v : null;               // chỉ báo cho các máy đăng nhập TRƯỚC máy mới
  } catch (e) { return null; }
}
function logoutOthers(u) {
  revokeSessions(u.id, u._key);
  props_().deleteProperty('NL_' + u.id);
  writeLog(u, 'Đăng xuất các máy khác', '');
  return { success:true, duplicate:true };
}

// =====================================================================
// v5.16.0 — GIỜ MÁY THIẾT BỊ
// =====================================================================
function closeDevice(u, d) {
  const T = TABLES.devices, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length);
  const i = rows.findIndex(r => String(r[0]) === String(d.id));
  if (i < 0) fail('Không tìm thấy thiết bị');
  mustAllow(u, String(rows[i][T.cols.indexOf('project')]));
  const c = k => T.cols.indexOf(k) + 1, name = String(rows[i][1]);
  const P = String(rows[i][T.cols.indexOf('project')]), mq = String(rows[i][T.cols.indexOf('maQL')] || '');
  if (d.reopen) {                                               // v5.21: Mở lại = máy vào công trường lần nữa (ngày + số đồng hồ vào mới nếu có)
    if (mq && rows.some((r, k) => k !== i && String(r[T.cols.indexOf('project')]) === P && String(r[T.cols.indexOf('maQL')]) === mq && !r[c('outDate') - 1]))
      fail('Máy ' + mq + ' đang có mặt ở dự án (một dòng máy khác)');
    const inD = /^\d{4}-\d{2}-\d{2}$/.test(String(d.inDate || '')) ? String(d.inDate) : Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
    const inM = d.inMeter === '' || d.inMeter === undefined || isNaN(+d.inMeter) ? '' : +d.inMeter;
    sh.getRange(i + 2, c('outDate')).setValue(''); sh.getRange(i + 2, c('outMeter')).setValue('');
    sh.getRange(i + 2, c('startDate')).setValue(''); sh.getRange(i + 2, c('startBy')).setValue('');   // v5.46: vào lại → P.QLTB ghi ngày hoạt động mới
    if (d.inDate) { sh.getRange(i + 2, c('inDate')).setValue(toCell(inD)); sh.getRange(i + 2, c('inMeter')).setValue(inM); }
    devLog_({ id:'R' + Date.now(), deviceId:rows[i][0], deviceName:name, maQL:mq, kind:'vao', date:inD, meter:d.inDate ? inM : '', note:clean(String(d.note || 'Mở lại'), 200), project:P, by:u.name, at:nowTxt() });
    writeLog(u, 'Mở lại thiết bị ở công trình', name + ' · ' + inD);
    return { success:true };
  }
  const date = clean(String(d.outDate || ''), 20);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('Chọn ngày kết thúc');
  const unit = String(rows[i][c('meterUnit') - 1] || 'h');
  const m = d.outMeter === '' || d.outMeter === undefined ? '' : +d.outMeter;
  if (m !== '' && (isNaN(m) || m < 0)) fail('Số ' + (unit === 'km' ? 'km' : 'giờ máy') + ' lúc kết thúc không hợp lệ');   // v5.46: được bỏ trống, bổ sung sau
  sh.getRange(i + 2, c('outDate')).setValue(toCell(date)); sh.getRange(i + 2, c('outMeter')).setValue(m === '' ? '' : m);
  devLog_({ id:'X' + Date.now(), deviceId:rows[i][0], deviceName:name, maQL:mq, kind:'ra', date:date, meter:m, note:clean(String(d.note || ''), 200), project:P, by:u.name, at:nowTxt() });
  writeLog(u, 'Kết thúc thiết bị ở công trình', name + ' · ' + date + (m !== '' ? ' · ' + (unit === 'km' ? 'km ' : 'giờ máy ') + m : ''));
  return { success:true };
}
// Máy thêm từ trước: lấy người thêm + ngày thêm từ Nhật ký ("Thêm thiết bị")
function migrateDevBy516_() {
  if (props_().getProperty('devBy516')) return;
  const ss = SpreadsheetApp.getActiveSpreadsheet(), lg = ss.getSheetByName(LOG.sheet);
  const T = TABLES.devices, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length);
  const by = {};
  if (lg) readRows(lg, LOG.cols.length).forEach(r => {
    if (String(r[4]) !== 'Thêm thiết bị') return;
    String(r[5] || '').split(', ').forEach(n => { n = n.trim(); if (n && !by[n]) by[n] = [String(r[2]), fromCell(r[0])]; });
  });
  const ab = T.cols.indexOf('addedBy'), at = T.cols.indexOf('addedAt'), mu = T.cols.indexOf('meterUnit');
  let ch = false;
  rows.forEach(r => {
    if (!r[mu]) { r[mu] = 'h'; ch = true; }
    if (!r[ab] && by[String(r[1])]) { r[ab] = by[String(r[1])][0]; r[at] = by[String(r[1])][1]; ch = true; }
  });
  if (ch && rows.length) sh.getRange(2, 1, rows.length, T.cols.length).setValues(rows.map(x => x.map(toCell)));
  props_().setProperty('devBy516', '1');
}

// =====================================================================
// v5.17.0 — SAO LƯU DỮ LIỆU TỰ ĐỘNG
//   23:00 mỗi ngày: bản sao Google Sheet vào thư mục Drive "FECON Kho – Sao lưu" (giữ 30 bản = 30 ngày)
//   Bản đầu mỗi tháng giữ 12 tháng · Mỗi tuần 1 bản Excel (.xlsx) giữ 12 tuần · Ảnh biên bản không sao chép (đã nằm trên Drive)
//   Bật: Admin vào app → Menu → Sao lưu dữ liệu → "Bật sao lưu tự động"  (hoặc chạy hàm CAI_DAT_saoLuu trong trình soạn thảo)
// =====================================================================
const BK_FOLDER = 'FECON Kho – Sao lưu';
const BK_KEEP_DAILY = 30, BK_KEEP_MONTHLY = 12, BK_KEEP_XLSX = 12;
function bkFolder_() {
  const id = props_().getProperty('BK_FOLDER');
  if (id) { try { const f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (e) {} }
  const f = DriveApp.createFolder(BK_FOLDER);
  props_().setProperty('BK_FOLDER', f.getId());
  return f;
}
function bkStamp_() {                                          // giờ Việt Nam (UTC+7, không đổi giờ mùa) → "2026-10-05 23h00"
  const t = new Date(Date.now() + 7 * 3600e3), p = n => ('0' + n).slice(-2);
  return t.getUTCFullYear() + '-' + p(t.getUTCMonth() + 1) + '-' + p(t.getUTCDate()) + ' ' + p(t.getUTCHours()) + 'h' + p(t.getUTCMinutes());
}
function bkList_(folder) {
  const out = [], it = folder.getFiles();
  while (it.hasNext()) { const f = it.next(); out.push({ f:f, name:f.getName(), t:f.getDateCreated().getTime() }); }
  return out.sort((a, b) => b.t - a.t);
}
// Chạy một lần sao lưu. why: 'auto' (hẹn giờ) | tên người bấm "Sao lưu ngay"
function runBackup_(why) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), folder = bkFolder_(), stamp = bkStamp_();
  const src = DriveApp.getFileById(ss.getId());
  const made = [];
  src.makeCopy('Sao lưu ' + stamp, folder); made.push('Sao lưu ' + stamp);
  const all = bkList_(folder), month = stamp.slice(0, 7);
  if (!all.some(x => x.name === 'Sao lưu tháng ' + month)) { src.makeCopy('Sao lưu tháng ' + month, folder); made.push('Sao lưu tháng ' + month); }
  const lastX = all.find(x => /^Excel /.test(x.name));
  if (!lastX || Date.now() - lastX.t > 6.5 * 864e5) {                // mỗi tuần 1 bản Excel
    const blob = UrlFetchApp.fetch('https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=xlsx',
      { headers:{ Authorization:'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions:true });
    if (blob.getResponseCode && blob.getResponseCode() !== 200) throw new Error('Không xuất được Excel (mã ' + blob.getResponseCode() + ')');
    folder.createFile(blob.getBlob().setName('Excel ' + stamp.slice(0, 10) + '.xlsx')); made.push('Excel ' + stamp.slice(0, 10) + '.xlsx');
  }
  // dọn bản cũ
  const now = bkList_(folder);
  const trash = (re, keep) => now.filter(x => re.test(x.name)).slice(keep).forEach(x => x.f.setTrashed(true));
  trash(/^Sao lưu \d{4}-\d{2}-\d{2} /, BK_KEEP_DAILY); trash(/^Sao lưu tháng /, BK_KEEP_MONTHLY); trash(/^Excel /, BK_KEEP_XLSX);
  props_().setProperty('BK_LAST', JSON.stringify({ t:Date.now(), ok:1, by:why, made:made }));
  return made;
}
function SAO_LUU_tuDong() {
  try { runBackup_('auto'); }
  catch (e) {
    props_().setProperty('BK_LAST', JSON.stringify({ t:Date.now(), ok:0, by:'auto', err:String(e && e.message || e).slice(0, 200) }));
    const ids = loadUsers().filter(x => x.role === 'ADM' && x.status === 'active').map(x => x.id);
    notify_('FECON Kho', [], ids, '', '⚠️ Sao lưu dữ liệu tự động BỊ LỖI lúc ' + nowTxt() + ': ' + String(e && e.message || e).slice(0, 150) + '\nMở app → Menu → Sao lưu dữ liệu để thử lại.');
    flushTg_();
  }
}
function bkTriggersOn_() { return ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'SAO_LUU_tuDong').length; }
function CAI_DAT_saoLuu() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'SAO_LUU_tuDong').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('SAO_LUU_tuDong').timeBased().everyDays(1).atHour(23).inTimezone(TZ).create();
  const f = bkFolder_();
  Logger.log('Đã bật sao lưu tự động 23:00 mỗi ngày. Thư mục: ' + f.getUrl());
  return f.getUrl();
}
function backupInfo(u) {
  const f = bkFolder_(), list = bkList_(f).slice(0, 120).map(x => ({ name:x.name, t:x.t, url:x.f.getUrl(), size:x.f.getSize() }));
  let last = null; try { last = JSON.parse(props_().getProperty('BK_LAST') || 'null'); } catch (e) {}
  return { success:true, folderUrl:f.getUrl(), auto:bkTriggersOn_() >= 1, last:last, files:list };
}
function backupNow(u) {
  try { const made = runBackup_(u.name); writeLog(u, 'Sao lưu dữ liệu', made.join(', ')); return Object.assign(backupInfo(u), { made:made }); }
  catch (e) {
    props_().setProperty('BK_LAST', JSON.stringify({ t:Date.now(), ok:0, by:u.name, err:String(e && e.message || e).slice(0, 200) }));
    return { success:false, error:'Sao lưu lỗi: ' + String(e && e.message || e).slice(0, 150) };
  }
}
function backupSetup(u) { CAI_DAT_saoLuu(); writeLog(u, 'Bật sao lưu tự động', '23:00 mỗi ngày'); return backupInfo(u); }

// v5.18.0: danh mục máy đã khai báo ở mọi dự án (tên, nhóm, số hiệu, định mức dầu, đồng hồ) — chỉ để gợi ý khi thêm máy
function deviceCatalog(u) {
  const T = TABLES.devices, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length).filter(r => r[1] !== '');
  const c = k => T.cols.indexOf(k);
  return { success:true, devices: rows.map(r => ({ name:String(r[1]), cat:String(r[2]), type:String(r[3]), fuelRate:+r[4] || 0, plate:String(r[5] || ''),
    project:String(r[c('project')]), meterUnit:String(r[c('meterUnit')] || 'h'), out:!!r[c('outDate')], donVi:String(r[c('donVi')] || '') })) };
}

// =====================================================================
// v5.19.0 — TĂNG TỐC: ẢNH CHỤP DỮ LIỆU DỰ ÁN TRONG BỘ NHỚ ĐỆM + GIỮ ẤM
//   Mỗi dự án có 1 "ảnh chụp" (vật tư, máy, phiếu, phiếu YC, cấu kiện…) lưu trong CacheService theo số phiên bản.
//   Có ai ghi phiếu → số phiên bản tăng → lần đọc sau tự chụp lại. Sửa tay trong Google Sheet: tối đa 15 phút app mới thấy
//   (hoặc chạy hàm XOA_boNhoDem để thấy ngay).
// =====================================================================
const SNAP_TTL = 900;
function cacheGetJSON_(key) {
  try {
    const c = CacheService.getScriptCache(), n = +c.get(key + '#n');
    if (!n) return null;
    const ks = []; for (let i = 0; i < n; i++) ks.push(key + '#' + i);
    const m = c.getAll(ks); let s = '';
    for (let i = 0; i < n; i++) { const v = m[ks[i]]; if (v === null || v === undefined) return null; s += v; }
    return JSON.parse(s);
  } catch (e) { return null; }
}
function cachePutJSON_(key, obj, ttl) {
  try {
    const s = JSON.stringify(obj), o = {}, SZ = 30000; let n = 0;      // 30.000 ký tự ≤ 100KB kể cả chữ có dấu
    for (let i = 0; i < s.length; i += SZ) o[key + '#' + (n++)] = s.slice(i, i + SZ);
    if (n > 300) return;                                              // quá lớn (>~9MB) thì thôi, đọc thẳng Sheet
    o[key + '#n'] = String(n);
    CacheService.getScriptCache().putAll(o, ttl || SNAP_TTL);
  } catch (e) {}
}
function snapKey_(P) { return 'SNAP2|' + sha(P).slice(0, 16) + '|' + getVersion() + '|' + (props_().getProperty('snapGen') || '0'); }
function snapBuild_(P) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), o = { tables:{}, n:0, ids:[], rows:[], loans:[], photos:[] };
  Object.keys(TABLES).forEach(k => {
    const t = TABLES[k], sh = ss.getSheetByName(t.sheet), pi = t.cols.indexOf('project');
    o.tables[k] = sh ? readRows(sh, t.cols.length).filter(r => r[0] !== '' && String(r[pi]) === P).map(r => rowToObj(t.cols, r)) : [];
  });
  const gd = ss.getSheetByName(TXN.sheet);
  if (gd) {
    const n = Math.max(0, gd.getLastRow() - 1), pi = TXN.cols.indexOf('project');
    o.n = n;
    if (n > 0) gd.getRange(2, 1, n, TXN.cols.length).getValues().forEach((r, i) => {
      o.ids.push(String(r[0]));
      if (r[0] !== '' && String(r[pi]) === P) o.rows.push([i + 1].concat(r.map(fromCell)));
    });
  }
  const mt = ss.getSheetByName(LOAN.sheet);
  if (mt) o.loans = readRows(mt, LOAN.cols.length).filter(r => r[0] !== '' && String(r[11]) === P).map(loanOut);
  const ph = ss.getSheetByName(PHOTO.sheet);
  if (ph) o.photos = readRows(ph, PHOTO.cols.length).filter(r => r[0] !== '' && String(r[7]) === P)
    .map(r => ({ id:r[0], txnId:r[1], fileId:String(r[2]), addedByName:String(r[5]), time:fromCell(r[6]) }));
  o.reqs = readTable_(REQ, P).map(reqOut_);
  o.ck = ckRows_(P).map(c => [String(c.id), String(c.hm), String(c.name), String(c.loai), String(c.banVe), String(c.fixed), String(c.optKind), +c.optN || 0]);
  return o;
}
function snapGet_(P) {
  const key = snapKey_(P);
  let s = cacheGetJSON_(key), hit = !!s;
  if (!s) { s = snapBuild_(P); cachePutJSON_(key, s); }
  s._hit = hit;
  return s;
}
// Hàm hẹn giờ 5 phút/lần: chụp sẵn dữ liệu các dự án để người mở app không phải chờ đọc Sheet
function GIU_AM() {
  try { projList().forEach(P => snapGet_(P)); } catch (e) {}
  if (typeof gdTgDaily_ === 'function') gdTgDaily_();          // v5.33: nhắc giải động qua Telegram mỗi sáng
}
function CAI_DAT_giuAm() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'GIU_AM').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('GIU_AM').timeBased().everyMinutes(5).create();
  Logger.log('Đã bật giữ ấm máy chủ 5 phút/lần');
}
// Sửa tay trong Google Sheet xong → chạy hàm này để app thấy ngay
function XOA_boNhoDem() {
  props_().setProperty('snapGen', String(Date.now()));
  CacheService.getScriptCache().remove('users');
  Logger.log('Đã xóa bộ nhớ đệm — lần mở app sau đọc lại toàn bộ Google Sheet');
}
function rolesRev_() { return sha(JSON.stringify(rolesAll_())).slice(0, 12); }
// Chức danh cần được giao dự án (không phải Admin / Quản lý cũ / người xem mọi dự án)
function needsProj_(role) { if (role === 'ADM' || role === 'QL') return false; const r = rolesAll_()[role]; return !(r && r.perm && r.perm.v_all); }

// v5.19: Admin sửa giờ máy của 1 lần đổ dầu — dòng phiếu giữ nguyên người lập; chỉ Nhật ký (Admin xem) ghi số cũ → số mới
function setTxnMeter(u, d) {
  const sh = sheetOf(TXN.sheet, TXN.head), n = sh.getLastRow() - 1;
  if (n < 1) fail('Không tìm thấy phiếu');
  const ids = sh.getRange(2, 1, n, 1).getValues(), i = ids.findIndex(r => String(r[0]) === String(d.id));
  if (i < 0) fail('Không tìm thấy phiếu');
  const row = sh.getRange(i + 2, 1, 1, TXN.cols.length).getValues()[0], c = k => TXN.cols.indexOf(k);
  mustAllow(u, String(row[c('project')]));
  if (String(row[c('type')]) !== 'xuat') fail('Chỉ sửa giờ máy ở phiếu xuất');
  const m = d.meter === '' || d.meter === undefined ? '' : +d.meter;
  if (u.role !== 'ADM') {                                       // v5.46: thủ kho bổ sung giờ máy còn trống, trong 7 ngày kể từ lần cấp dầu
    if (String(row[c('meter')]) !== '') fail('Phiếu này đã có giờ máy — nhờ Admin sửa');
    if (m === '') fail('Nhập số đồng hồ');
    const dt = txtDate_(fromCell(row[c('datetime')]));
    if (!dt || Date.now() - dt.getTime() > 7 * 864e5) fail('Quá 7 ngày kể từ lần cấp dầu — nhờ Admin bổ sung');
  }
  if (m !== '' && (isNaN(m) || m < 0)) fail('Số đồng hồ không hợp lệ');
  const old = row[c('meter')], oldNote = String(row[c('meterNote')] || '');
  const note = d.meterNote === undefined ? (m !== '' && /^Đồng hồ hỏng/.test(oldNote) ? '' : oldNote) : clean(String(d.meterNote), 120);
  sh.getRange(i + 2, c('meter') + 1).setValue(m === '' ? '' : m);
  sh.getRange(i + 2, c('meterNote') + 1).setValue(toCell(note));
  bumpTxnRev();                                                  // máy khác tải lại phiếu đã sửa
  writeLog(u, u.role === 'ADM' ? 'Admin sửa giờ máy' : 'Bổ sung giờ máy', String(row[c('thietBi')]) + ' · lần ' + fromCell(row[c('datetime')]) + ' (' + String(row[c('createdByName')]) + ' ghi): ' +
    (old === '' ? (oldNote || '(trống)') : old) + ' → ' + (m === '' ? (note || '(trống)') : m));
  return { success:true };
}
function fillAt_(v) {                                          // v5.46: giờ cấp dầu thực tế: không quá 24 giờ trước, không ở tương lai
  const fa = checkTime(v), fd = txtDate_(fa), dd = fd ? Date.now() - fd.getTime() : -1;
  if (!(dd >= -5 * 60e3 && dd <= 24 * 36e5 + 5 * 60e3)) fail('Giờ cấp dầu thực tế chỉ được lùi trong 24 giờ');
  return fa;
}
function txtDate_(v) {                                          // 'HH:mm:ss d/M/yyyy' (giờ VN) → Date
  const m = String(v || '').match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? new Date(Date.UTC(+m[6], +m[5] - 1, +m[4], +m[1] - 7, +m[2], +(m[3] || 0))) : null;
}
function setDevStart(u, d) {                                    // v5.46: P.QLTB ghi ngày máy bắt đầu hoạt động
  const T = TABLES.devices, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length);
  const i = rows.findIndex(r => String(r[0]) === String(d.id)); if (i < 0) fail('Không tìm thấy máy');
  const c = k => T.cols.indexOf(k) + 1;
  mustAllow(u, String(rows[i][c('project') - 1]));
  const v = String(d.date || '');
  if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) fail('Ngày không hợp lệ');
  const inD = String(fromCell(rows[i][c('inDate') - 1]) || '').slice(0, 10);
  if (v && /^\d{4}-\d{2}-\d{2}$/.test(inD) && v < inD) fail('Ngày bắt đầu hoạt động trước ngày vào công trường (' + inD + ')');
  sh.getRange(i + 2, c('startDate')).setValue(toCell(v)); sh.getRange(i + 2, c('startBy')).setValue(v ? toCell(u.name) : '');
  writeLog(u, 'Ghi ngày máy bắt đầu hoạt động', String(rows[i][1]) + ' · ' + (v || '(xóa)'));
  return { success:true };
}
function deviceAdminLog(u, d) {
  const name = String(d.name || ''); if (!name) return { success:true, rows:[] };
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG.sheet);
  if (!sh || sh.getLastRow() < 2) return { success:true, rows:[] };
  const rows = readRows(sh, LOG.cols.length).filter(r => (String(r[4]) === 'Admin sửa máy' || String(r[4]) === 'Admin sửa giờ máy') && String(r[5]).indexOf(name) === 0)
    .reverse().slice(0, 50).map(r => ({ t:fromCell(r[0]), by:String(r[2]), x:String(r[5]).slice(name.length + 3) }));
  return { success:true, rows:rows };
}

// v5.20: gợi ý tên vật tư — tên, nhóm, đơn vị, cách cấp của vật tư ở mọi dự án (bỏ trùng tên)
function itemCatalog(u) {
  const T = TABLES.items, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length).filter(r => String(r[1]).trim() !== '');
  const seen = {}, out = [];
  rows.forEach(r => { const k = normName_(r[1]); if (seen[k]) return; seen[k] = 1;
    out.push({ name:String(r[1]), cat:String(r[2]), unit:String(r[3]), capThang:+r[7] || 0, canMay:+r[8] || 0, project:String(r[6]) }); });
  return { success:true, items:out };
}
// v5.20: Admin xóa toàn bộ danh mục vật tư của 1 dự án (chỉ khi dự án chưa có phiếu nào gắn với các vật tư đó)
function purgeItems(u, d) {
  const P = String(d.project || '');
  mustAllow(u, P);
  const T = TABLES.items, sh = sheetOf(T.sheet, T.head), rows = readRows(sh, T.cols.length), pc = T.cols.indexOf('project');
  const mine = rows.filter(r => String(r[pc]) === P), ids = {}; mine.forEach(r => ids[String(r[0])] = 1);
  if (!mine.length) return { success:true, removed:0, duplicate:true };
  const gd = sheetOf(TXN.sheet, TXN.head), n = gd.getLastRow() - 1, ic = TXN.cols.indexOf('itemId');
  const used = n > 0 ? gd.getRange(2, ic + 1, n, 1).getValues().filter(r => ids[String(r[0])]).length : 0;
  if (used) fail('Dự án ' + P + ' đã có ' + used + ' phiếu gắn với các vật tư này — không xóa được');
  const reqUsed = readTable_(REQ, P).length;
  if (reqUsed) fail('Dự án ' + P + ' đã có ' + reqUsed + ' phiếu yêu cầu — không xóa được');
  writeAll(sh, T.cols, rows.filter(r => String(r[pc]) !== P).map(r => rowToObj(T.cols, r)));
  writeLog(u, 'Xóa danh mục vật tư dự án', P + ': ' + mine.length + ' vật tư (đã sao lưu trước khi xóa)');
  return { success:true, removed:mine.length };
}

// =====================================================================
// v5.21.0 — DANH MỤC CHUẨN P.QLTB + MÁY VÀO / RA CÔNG TRƯỜNG
// =====================================================================
const QLTB = { sheet:'DM_QLTB', cols:['ma','kind','nhom','ma3','ma4','ma5','name','tenLoai','tenCT','maKT','cat','unit','plate','meterUnit','sl','soHuu','donVi','ncc','soHD'],
  head:['Mã P.QLTB','Loại (may = máy từng chiếc / vt = vật tư theo loại)','Mã 2','Mã 3','Mã 4','Mã 5 / quy cách','Tên trong app','Tên loại','Tên gọi công trường','Mã kế toán','Nhóm trong app','Đơn vị','Số hiệu / biển số','Đồng hồ','Số dòng trong file','Hình thức sở hữu','Đơn vị sở hữu','Nhà cung cấp / cho thuê','Số hợp đồng'] };
function devLog_(o) {
  const T = TABLES.devlog, sh = sheetOf(T.sheet, T.head);
  sh.appendRow(T.cols.map(c => toCell(o[c] === undefined ? '' : o[c])));
}
function qltbList_(d) {
  const rev = props_().getProperty('qltbRev') || '';
  const info = jget_('qltbInfo', null);
  if (d && String(d.rev || '') === rev && rev) return { success:true, rev:rev, same:true, info:info };
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(QLTB.sheet);
  const rows = sh ? readRows(sh, QLTB.cols.length).filter(r => String(r[0]).trim() !== '').map(r => QLTB.cols.map((c, i) => c === 'sl' ? +r[i] || 0 : String(fromCell(r[i]) ?? ''))) : [];
  return { success:true, rev:rev, cols:QLTB.cols, rows:rows, info:info };
}
function qltbSave_(u, d) {
  const list = Array.isArray(d.rows) ? d.rows : [];
  if (!list.length) fail('File không có dòng nào');
  if (list.length > 5000) fail('Danh mục quá lớn (tối đa 5.000 dòng)');
  const seen = {}, out = [];
  list.forEach((r, i) => {
    const o = {}; QLTB.cols.forEach(c => o[c] = clean(String(r[c] === undefined || r[c] === null ? '' : r[c]), 300));
    if (!/^FCS_[A-Z0-9]+_/.test(o.ma)) fail('Dòng ' + (i + 1) + ': mã không đúng dạng FCS_… (' + o.ma + ')');
    if (o.kind !== 'may' && o.kind !== 'vt') fail('Dòng ' + (i + 1) + ': loại phải là may hoặc vt');
    if (!o.name) fail('Dòng ' + (i + 1) + ': thiếu tên');
    if (seen[o.ma]) fail('Mã trùng: ' + o.ma);
    seen[o.ma] = 1; o.sl = +r.sl || 0; out.push(o);
  });
  const sh = sheetOf(QLTB.sheet, QLTB.head);
  writeAll(sh, QLTB.cols, out);
  const rev = String(Date.now());
  props_().setProperty('qltbRev', rev);
  const info = { file:clean(String(d.file || ''), 120), at:nowTxt(), by:u.name, may:out.filter(o => o.kind === 'may').length, vt:out.filter(o => o.kind === 'vt').length, src:+d.src || 0 };
  jset_('qltbInfo', info);
  writeLog(u, 'Nạp danh mục P.QLTB', info.file + ' · ' + info.may + ' máy, ' + info.vt + ' loại vật tư phụ trợ');
  return { success:true, rev:rev, info:info };
}

// =====================================================================
// v5.22.0 — NHẬP THẲNG RA CÔNG TRƯỜNG (nhập + xuất cùng lúc, tồn không đổi)
// =====================================================================
const THANG_LOG = 'Nhập thẳng ra công trường';
function thangLogDetail_(rn, rx) {
  return rn.qty + ' ' + rn.unit + ' ' + rn.itemName + (rn.supplierOrReceiver ? ' · NCC ' + rn.supplierOrReceiver : '') +
    (rx.supplierOrReceiver ? ' → ' + rx.supplierOrReceiver : '') + ' · nhập #' + rn.id + ' + xuất #' + rx.id;
}
const THANG_DS0 = ['Thép','Bentonite','Xi măng','Cát','Đá 40x40','Cừ Larsen','Cừ tràm','Cừ tường vây','Ống siêu âm'];
function thangDS_() { const v = jget_('thangDS', null); return Array.isArray(v) ? v : THANG_DS0.slice(); }
function thangNorm_(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[×*]/g, 'x').replace(/\s+/g, ' ').trim(); }
function setThangDS(u, d) {
  const seen = {}, out = [];
  (Array.isArray(d.list) ? d.list : []).forEach(x => {
    const v = clean(String(x || ''), 40).replace(/\s+/g, ' ').trim(), k = thangNorm_(v);
    if (v.length < 2 || seen[k]) return; seen[k] = 1; out.push(v);
  });
  if (out.length > 80) fail('Tối đa 80 tên');
  const old = thangDS_();
  jset_('thangDS', out);
  const add = out.filter(x => old.map(thangNorm_).indexOf(thangNorm_(x)) < 0), del = old.filter(x => out.map(thangNorm_).indexOf(thangNorm_(x)) < 0);
  writeLog(u, 'Tên vật tư gợi ý thêm', (add.length ? 'Thêm: ' + add.join(', ') : '') + (add.length && del.length ? ' · ' : '') + (del.length ? 'Bỏ: ' + del.join(', ') : '') || 'Không đổi');
  return { success:true, thangDS:out };
}
// d = { nhap:{id, itemId, qty, supplierOrReceiver, note, datetime}, xuat:{id, supplierOrReceiver, note} }
function addThang(u, d0) {
  const n = cleanObj(d0.nhap || {}), x = cleanObj(d0.xuat || {});
  if (!n.id || !x.id || String(n.id) === String(x.id)) fail('Thiếu số phiếu');
  const qty = Math.round((+n.qty || 0) * 1000) / 1000;
  if (!(qty > 0)) fail('Số lượng phải lớn hơn 0');
  const gd = sheetOf(TXN.sheet, TXN.head), ids = readRows(gd, 1).map(r => String(r[0]));
  const hasN = ids.indexOf(String(n.id)) >= 0, hasX = ids.indexOf(String(x.id)) >= 0;
  if (hasN && hasX) return { success:true, duplicate:true };            // đã ghi rồi (mạng chập chờn gửi lại)
  if (hasN || hasX) fail('Số phiếu đã dùng — tải lại app rồi lập lại');
  const T = TABLES.items, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length);
  const it = rows.find(r => r[0] !== '' && String(r[0]) === String(n.itemId));
  if (!it) fail('Vật tư không tồn tại trong kho');
  const itemProj = String(it[6]); mustAllow(u, itemProj);
  const at = u.role === 'ADM' && n.txTime ? checkTime(n.txTime) : '';
  const when = at || nowTxt(), ct = at ? '' : String(n.datetime || '').slice(0, 40);
  const base = { itemId: it[0], itemName: String(it[1]), qty: qty, unit: String(it[3]), project: itemProj, thietBi:'', datetime: when,
    reason:'', refId:'', createdBy: u.id, createdByName: u.name, clientTime: ct, meter:'', meterNote:'' };
  const rn = Object.assign({}, base, { id: n.id, type:'nhap', supplierOrReceiver: n.supplierOrReceiver || '', note: n.note || '', thangCT: String(x.id) });
  const xct = x.ct === undefined ? (ctTrack_(it) ? 'ra' : '') : (x.ct === 'ra' ? 'ra' : '');   // v5.35: món theo dõi → ghi nhận ở công trường
  const rx = Object.assign({}, base, { id: x.id, type:'xuat', ct: xct, supplierOrReceiver: x.supplierOrReceiver || '', note: x.note || '', thangCT: String(n.id) });
  gd.getRange(gd.getLastRow() + 1, 1, 2, TXN.cols.length).setValues([rn, rx].map(r => TXN.cols.map(c => toCell(r[c] === undefined ? '' : r[c]))));
  // tồn kho không đổi: +qty rồi −qty cùng một giờ · v5.35: món theo dõi → + ở công trường
  if (xct) { const T2 = TABLES.items, tk2 = sheetOf(T2.sheet, T2.head), ri = rows.indexOf(it), sc = ctSiteCol_(); tk2.getRange(ri + 2, sc).setValue(Math.round(((+it[sc - 1] || 0) + qty) * 1000) / 1000); }
  writeLog(u, THANG_LOG, thangLogDetail_(rn, rx), at);
  return { success:true, ids:[String(rn.id), String(rx.id)], datetime: when };
}

// =====================================================================
// v5.47.0 — NHẬP / XUẤT NHANH: lưu cả lệnh một lần. Kiểm hết mọi dòng trước (quyền, vật tư, tồn kho / ở công trường,
// phiếu mượn, máy), dòng nào sai thì không ghi gì. Sau đó ghi lần lượt bằng đúng các hàm sẵn có (addTxn, addThang,
// addLoan, returnLoan, upsert, closeDevice) nên dữ liệu giống hệt phiếu lập tay.
// d = { project, cmd (nguyên văn lệnh), ck (chống gửi trùng), ops:[{k, d, line}] }
//   k: item (vật tư mới) · txn (phiếu nhập / xuất) · thang (nhập thẳng ra công trường) · loan (cho mượn / đi mượn)
//      ret (nhận trả / trả lại) · dev (máy vào công trường, máy mới) · devIn (máy vào lại) · devOut (máy rời công trường)
// =====================================================================
const QK_ACT = { hong:'hongAdd', item:'upsert', dev:'upsert', txn:'addTransaction', thang:'addThang', loan:'addLoan', ret:'returnLoan', devIn:'closeDevice', devOut:'closeDevice' };
const QK_TRACK_ = cat => /^(tbPhuTro|vtPhuTro)$/.test(String(cat || ''));
function qkBatch(u, d0) {
  const P = String(d0.project || ''), ops = Array.isArray(d0.ops) ? d0.ops : [];
  if (!P) fail('Thiếu dự án');
  mustAllow(u, P);
  if (!ops.length) fail('Lệnh không có dòng nào để lưu');
  if (ops.length > 40) fail('Mỗi lệnh tối đa 40 dòng — chia làm nhiều lệnh');
  const cmd = clean(String(d0.cmd || ''), 300);
  const L = (o, k) => 'Dòng ' + (o.line || k + 1) + ': ';
  // 1) quyền từng dòng
  ops.forEach((o, k) => {
    const a = QK_ACT[o && o.k]; if (!a) fail(L(o || {}, k) + 'loại phiếu không hợp lệ');
    o.d = o.d || {};
    const pd = a === 'upsert' ? { table:o.k === 'item' ? 'items' : 'devices' } : o.d;
    if (!ACT[a](u, pd)) fail(L(o, k) + 'chức danh của bạn chưa được cấp quyền cho loại phiếu này');
  });
  // 2) chạy thử trên bản sao số liệu: vật tư có thật, đủ tồn / đủ ở công trường, phiếu mượn còn mở, máy đúng trạng thái
  const IT = TABLES.items, itRows = readRows(sheetOf(IT.sheet, IT.head), IT.cols.length);
  const S = {}, nameIn = {};
  itRows.forEach(r => { if (r[0] === '') return; const p = String(r[6]);
    S[String(r[0])] = { name:String(r[1]), unit:String(r[3]), stock:+r[4] || 0, site:+r[ctSiteCol_() - 1] || 0, project:p, track:ctTrack_(r) };
    if (p === P) nameIn[normKey_(r[1])] = 1; });
  const DV = TABLES.devices, dvRows = readRows(sheetOf(DV.sheet, DV.head), DV.cols.length), dc = k => DV.cols.indexOf(k);
  const dvState = {}; dvRows.forEach(r => { if (r[0] !== '') dvState[String(r[0])] = { project:String(r[dc('project')]), active:!r[dc('outDate')], ma:String(r[dc('maQL')] || ''), name:String(r[1]) }; });
  const loanLeft = {}, dateOk = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
  ops.forEach((o, k) => {
    const d = o.d, e = L(o, k), q = r3(d.qty);
    const it = id => { const x = S[String(id)]; if (!x) fail(e + 'không tìm thấy vật tư trong kho'); if (x.project !== P) fail(e + 'vật tư thuộc dự án khác'); return x; };
    if (o.k === 'item') {
      const nm = String(d.name || '').trim();
      if (nm.length < 2) fail(e + 'thiếu tên vật tư mới');
      if (!String(d.unit || '').trim()) fail(e + 'vật tư mới "' + nm + '" chưa có đơn vị');
      if (!String(d.cat || '').trim()) fail(e + 'vật tư mới "' + nm + '" chưa có nhóm');
      if (String(d.project) !== P) fail(e + 'vật tư mới phải thuộc dự án ' + P);
      if (nameIn[normKey_(nm)]) fail(e + 'đã có vật tư tên "' + nm + '" — chọn vật tư đó thay vì tạo mới');
      if (S[String(d.id)]) fail(e + 'số vật tư mới bị trùng — tải lại app rồi thử lại');
      nameIn[normKey_(nm)] = 1;
      S[String(d.id)] = { name:nm, unit:String(d.unit), stock:0, site:0, project:P, track:QK_TRACK_(d.cat) };
      return;
    }
    if (o.k === 'txn') {
      if (d.type !== 'nhap' && d.type !== 'xuat') fail(e + 'chỉ ghi được phiếu nhập hoặc xuất');
      if (!(q > 0)) fail(e + 'số lượng phải lớn hơn 0');
      const x = it(d.itemId), ct = ctOf_(d.type, d.ct), fx = ctFx_(d.type, ct, q);
      x.stock = r3(x.stock + fx[0]); x.site = r3(x.site + fx[1]);
      if (x.stock < -1e-9) fail(e + x.name + ': kho còn ' + r3(x.stock - fx[0]) + ' ' + x.unit + ', thiếu ' + r3(-x.stock) + ' ' + x.unit);
      if (x.site < -1e-9) fail(e + x.name + ': ở công trường còn ' + r3(x.site - fx[1]) + ' ' + x.unit + ', thiếu ' + r3(-x.site) + ' ' + x.unit);
      return;
    }
    if (o.k === 'thang') {
      const n = d.nhap || {}, qq = r3(n.qty);
      if (!(qq > 0)) fail(e + 'số lượng phải lớn hơn 0');
      if (!n.id || !d.xuat || !d.xuat.id || String(n.id) === String(d.xuat.id)) fail(e + 'thiếu số phiếu');
      const x = it(n.itemId);
      if ((d.xuat.ct === undefined ? x.track : d.xuat.ct === 'ra')) x.site = r3(x.site + qq);
      return;
    }
    if (o.k === 'hong') {                                        // v5.50: báo hỏng (không đổi tồn) — phải còn đủ hàng chưa báo hỏng
      if (!(q > 0)) fail(e + 'số lượng phải lớn hơn 0');
      if (String(d.reason || '').trim().length < 3) fail(e + 'ghi rõ hỏng gì');
      const x = it(d.itemId), lc = d.loc === 'ct' ? 'ct' : 'kho';
      if (x.hong === undefined) { const H = hongRead_().rows; x.hong = { kho:hongOpenQty_(H, P, d.itemId, 'kho'), ct:hongOpenQty_(H, P, d.itemId, 'ct') }; }
      const free = r3((lc === 'ct' ? x.site : x.stock) - x.hong[lc]);
      if (q > free + 1e-9) fail(e + x.name + ': ' + (lc === 'ct' ? 'ở công trường' : 'trong kho') + ' chỉ còn ' + Math.max(0, free) + ' ' + x.unit + ' chưa báo hỏng');
      x.hong[lc] = r3(x.hong[lc] + q);
      return;
    }
    if (o.k === 'loan') {
      if (d.kind !== 'cho' && d.kind !== 'di') fail(e + 'loại phiếu mượn không hợp lệ');
      if (d.itemType !== 'vt') fail(e + 'lệnh nhanh chỉ ghi mượn vật tư / thiết bị phụ trợ — máy cơ sở dùng phiếu Xuất');
      if (String(d.party || '').trim().length < 2) fail(e + (d.kind === 'cho' ? 'ghi rõ cho ai mượn' : 'ghi rõ mượn của ai'));
      if (d.dueDate && !dateOk(d.dueDate)) fail(e + 'hạn trả không hợp lệ');
      if (d.linkP && (projList().indexOf(String(d.linkP)) < 0 || String(d.linkP) === P)) fail(e + 'dự án "' + d.linkP + '" không hợp lệ');
      if (!(q > 0)) fail(e + 'số lượng phải lớn hơn 0');
      if (!d.txnId) fail(e + 'thiếu số phiếu kho');
      const x = it(d.itemId);
      x.stock = r3(x.stock + (d.kind === 'cho' ? -q : q));
      if (x.stock < -1e-9) fail(e + x.name + ': kho còn ' + r3(x.stock + q) + ' ' + x.unit + ', không đủ cho mượn ' + q);
      return;
    }
    if (o.k === 'ret') {
      const lr = findLoanRow(d.loanId); if (!lr) fail(e + 'không tìm thấy phiếu mượn');
      const l = lr.loan; if (l.project !== P) fail(e + 'phiếu mượn thuộc dự án khác');
      if (l.status !== 'open') fail(e + 'phiếu mượn đã xong / đã đóng');
      const id = String(l.id); if (loanLeft[id] === undefined) loanLeft[id] = loanRem_(l);
      if (l.itemType !== 'vt') fail(e + 'trả máy mượn: dùng phiếu Nhập / Xuất');
      if (!(q > 0)) fail(e + 'số lượng phải lớn hơn 0');
      if (q > loanLeft[id] + 1e-9) fail(e + l.itemName + ': phiếu mượn chỉ còn ' + loanLeft[id] + ' ' + l.unit + ' chưa trả');
      loanLeft[id] = r3(loanLeft[id] - q);
      const x = it(l.itemId); x.stock = r3(x.stock + (l.kind === 'cho' ? q : -q));
      if (x.stock < -1e-9) fail(e + x.name + ': kho còn ' + r3(x.stock + q) + ' ' + x.unit + ', không đủ để trả lại ' + q);
      return;
    }
    if (o.k === 'dev') {
      if (String(d.name || '').trim().length < 2) fail(e + 'thiếu tên máy');
      if (String(d.project) !== P) fail(e + 'máy phải thuộc dự án ' + P);
      if (!dateOk(d.inDate)) fail(e + 'thiếu ngày vào công trường');
      if (d.type === 'hire' && !String(d.donVi || '').trim()) fail(e + 'máy thuê ngoài: ghi đơn vị cho thuê');
      if (dvState[String(d.id)]) fail(e + 'số máy bị trùng — tải lại app rồi thử lại');
      const ma = String(d.maQL || ''), nk = normKey_(d.name);
      if (Object.keys(dvState).some(i => { const v = dvState[i]; return v.project === P && v.active && ((ma && v.ma === ma) || normKey_(v.name) === nk); }))
        fail(e + 'máy "' + d.name + '" đang có trong dự án — không nhập trùng');
      dvState[String(d.id)] = { project:P, active:true, ma:ma, name:String(d.name) };
      return;
    }
    if (o.k === 'devIn' || o.k === 'devOut') {
      const v = dvState[String(d.id)]; if (!v || v.project !== P) fail(e + 'không tìm thấy máy trong dự án');
      if (o.k === 'devOut') { if (!v.active) fail(e + 'máy "' + v.name + '" đã rời công trường'); if (!dateOk(d.outDate)) fail(e + 'thiếu ngày máy rời công trường'); v.active = false; }
      else { if (v.active) fail(e + 'máy "' + v.name + '" đang ở công trường'); if (!d.reopen) fail(e + 'thiếu thông tin máy vào lại'); v.active = true; }
    }
  });
  // 3) ghi thật — đúng thứ tự, bằng các hàm sẵn có
  const done = [];
  try {
    ops.forEach(o => {
      const d = o.d;
      const r = o.k === 'hong' ? hongAdd(u, Object.assign({ project:P }, d)) : o.k === 'item' ? upsert(u, 'items', [d]) : o.k === 'dev' ? upsert(u, 'devices', [d]) : o.k === 'txn' ? addTxn(u, d)
        : o.k === 'thang' ? addThang(u, d) : o.k === 'loan' ? addLoan(u, d) : o.k === 'ret' ? returnLoan(u, d) : closeDevice(u, d);
      if (r && r.success === false) throw new Error(r.error || 'không lưu được');
      done.push({ k:o.k, line:o.line || '', id:String(d.id || (d.nhap && d.nhap.id) || '') });
    });
  } catch (err) {
    const msg = String(err && err.message || err);
    if (done.length) {                                          // hiếm: lỗi giữa chừng sau khi đã kiểm — báo rõ dòng nào đã lưu
      bumpVersion();
      writeLog(u, 'Nhập/Xuất nhanh (lưu dở)', done.length + '/' + ops.length + ' dòng · lỗi: ' + msg + (cmd ? ' · lệnh: ' + cmd : ''));
    }
    return { success:false, partial:done.length, done:done, error:'Dòng ' + ((ops[done.length] || {}).line || done.length + 1) + ': ' + msg +
      (done.length ? ' — ' + done.length + ' dòng trước đã lưu, xem lịch sử trước khi lưu lại' : '') };
  }
  writeLog(u, 'Nhập/Xuất nhanh', ops.length + ' dòng' + (cmd ? ' · lệnh: ' + cmd : ''));
  return { success:true, saved:done.length, done:done };
}
// =====================================================================
// v5.48.0 — DANH MỤC VẬT TƯ CHUNG (mọi dự án) + NHÓM VẬT TƯ — chỉ Admin sửa
//   Danh mục lưu ở trang DanhMucVT (Script Properties giới hạn 9 KB/khóa nên không để ở đó). dmRev đổi mỗi lần lưu:
//   getAll chỉ gửi cả danh mục khi app chưa có đúng bản (d.dmRev). Nhóm (cats) nhỏ nên để Script Properties.
//   Sửa danh mục KHÔNG đổi nhóm / đơn vị của vật tư đã có trong kho — chỉ dùng khi nhập món mới + tự chọn Vào kho / Thẳng ra công trường.
// =====================================================================
const DMVT = { sheet:'DanhMucVT', cols:['name','cat','unit','mode','by','at'],
  head:['Tên vật tư (khớp cả tên bắt đầu bằng tên này)','Nhóm (mã)','Đơn vị','Khi nhập (k = vào kho · t = thẳng ra công trường)','Người sửa','Lúc sửa'] };
const CAT_BASE = ['nhienLieu','thep','cocNoi','ongSieuAm','capNang','gau','han','dien','ongNuoc','vatLieu','bhld','dungCu','tbPhuTro','vtPhuTro','khac'];
const CAT_LOCK = { tbPhuTro:'Thiết bị phụ trợ', vtPhuTro:'Vật tư phụ trợ', khac:'Khác' };
function dmRev_() { return props_().getProperty('dmRev') || ''; }
function dmList_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DMVT.sheet); if (!sh) return [];
  return readRows(sh, DMVT.cols.length).filter(r => String(r[0]).trim() !== '').map(r => [String(r[0]), String(r[1]), String(r[2]), String(r[3]) === 't' ? 't' : 'k']);
}
function catsGet_() { return jget_('cats', null); }                          // null = app dùng 15 nhóm mặc định
function catIds_() { const c = catsGet_(); return c ? c.map(x => x.id) : CAT_BASE.slice(); }
function setDanhMuc(u, d) {
  const L = Array.isArray(d.list) ? d.list : [];
  if (L.length > 3000) fail('Danh mục tối đa 3000 tên');
  const ids = catIds_(), seen = {}, rows = [];
  L.forEach(x => {
    if (!Array.isArray(x)) return;
    const n = clean(String(x[0] || ''), 120).replace(/\s+/g, ' ').trim(), k = normKey_(n);
    if (n.length < 2 || seen[k]) return; seen[k] = 1;
    const c = String(x[1] || '');
    rows.push([n, ids.indexOf(c) >= 0 ? c : '', clean(String(x[2] || ''), 20), x[3] === 't' ? 't' : 'k', u.name, nowTxt()]);
  });
  const sh = sheetOf(DMVT.sheet, DMVT.head), old = Math.max(0, sh.getLastRow() - 1);
  if (rows.length) sh.getRange(2, 1, rows.length, DMVT.cols.length).setValues(rows.map(r => r.map(toCell)));   // ghi trước, xóa phần thừa sau
  if (old > rows.length) sh.getRange(rows.length + 2, 1, old - rows.length, DMVT.cols.length).clearContent();
  const rev = String(Date.now()); props_().setProperty('dmRev', rev);
  writeLog(u, 'Danh mục vật tư', rows.length + ' tên · ' + rows.filter(r => r[3] === 't').length + ' thẳng ra công trường');
  return { success:true, dmRev:rev, count:rows.length };
}
function setCats(u, d) {
  const L = Array.isArray(d.list) ? d.list : [];
  if (!L.length || L.length > 40) fail('Danh sách nhóm không hợp lệ (tối đa 40 nhóm)');
  const out = [], ids = {}, hex = v => /^#[0-9A-Fa-f]{6}$/.test(String(v || '')) ? String(v) : '';
  L.forEach(x => {
    const id = String((x && x.id) || '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 24), nm = clean(String((x && x.name) || ''), 40).replace(/\s+/g, ' ').trim();
    if (!id || ids[id]) fail('Mã nhóm trống hoặc trùng');
    if (nm.length < 2) fail('Tên nhóm quá ngắn');
    ids[id] = 1;
    out.push({ id:id, name:nm, svg:String(x.svg || '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 24), color:hex(x.color), bg:hex(x.bg) });
  });
  Object.keys(CAT_LOCK).forEach(k => { if (!ids[k]) fail('Không xoá được nhóm "' + CAT_LOCK[k] + '"'); });
  const gone = catIds_().filter(k => !ids[k]);
  if (gone.length) {
    const T = TABLES.items, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length);
    gone.forEach(k => { const n = rows.filter(r => r[0] !== '' && String(r[2]) === k).length; if (n) fail('Nhóm "' + k + '" đang có ' + n + ' vật tư — không xoá được'); });
  }
  if (JSON.stringify(out).length > 8500) fail('Danh sách nhóm quá dài');
  jset_('cats', out);
  writeLog(u, 'Nhóm vật tư', out.length + ' nhóm' + (gone.length ? ' · bỏ: ' + gone.join(', ') : ''));
  return { success:true, cats:out };
}
// =====================================================================
// v5.49.0 — QUẢN LÝ DỰ ÁN: đổi tên (mọi bảng Kho + Thi công + Giải động trong 1 lần), xoá dự án trống, đóng / mở lại
//   projClosed (Script Properties): { tên: {at, by} } — dự án đã đóng: chỉ xem; máy chủ chặn mọi lệnh ghi (PJ_W)
//   projAlias: { tên cũ: tên mới } — app / phiếu chờ gửi còn dùng tên cũ vẫn ghi đúng dự án mới
//   Xem dự án đã đóng: ADM, MD, DMD (tất cả) · PD, EQM, DEQ (dự án được giao)
// =====================================================================
let PJ_W = false;
const PJ_TCW = { tcSave:1, tcDel:1, tcPhoto:1, tcImportCk:1, tcImportRecs:1, tcCfgSave:1, tcSeed:1, tcReset:1 };                                                 // lượt này là lệnh ghi → mustAllow chặn dự án đã đóng
const PJ_SEE_ALL = { ADM:1, MD:1, DMD:1 }, PJ_SEE_MINE = { PD:1, EQM:1, DEQ:1 };
const PJ_RO = { nxtInfo:1, tgTest:1, tgUnlink:1, logout:1, changePassword:1, logoutOthers:1, setDevStart:0 };
function pjKho_() { return typeof gdKho_ === 'function' ? gdKho_() : (typeof GD_KHO !== 'undefined' ? GD_KHO : ''); }   // v5.49.2 tên kho công ty
function pjClosed_() { return jget_('projClosed', {}) || {}; }
function pjAlias_() { return jget_('projAlias', {}) || {}; }
function pjIsClosed_(P) { return !!pjClosed_()[String(P)]; }
function pjCanSeeClosed_(u, P) {
  if (PJ_SEE_ALL[u.role]) return true;
  return !!PJ_SEE_MINE[u.role] && userProjects(u).indexOf(String(P)) >= 0;
}
function pjMapData_(data) {                                       // tên cũ → tên mới (app chưa tải lại / phiếu chờ gửi lúc mất mạng)
  const A = pjAlias_(); if (!data || !Object.keys(A).length) return;
  const m = v => (typeof v === 'string' && A[v]) ? A[v] : v;
  ['project', 'linkP', 'to', 'from', 'src'].forEach(k => { if (k in data) data[k] = m(data[k]); });
  ['rows', 'ops'].forEach(k => (Array.isArray(data[k]) ? data[k] : []).forEach(x => { if (x && typeof x === 'object') { if ('project' in x) x.project = m(x.project); if (x.d && 'project' in x.d) x.d.project = m(x.d.project); } }));
  ['nhap', 'xuat'].forEach(k => { if (data[k] && data[k].project) data[k].project = m(data[k].project); });
}
// Các bảng có cột Dự án (Kho + Thi công + Giải động). Bảng Thi công / Giải động nằm ở tệp thicong.gs cùng dự án Apps Script.
function pjTables_() {
  const L = [['Vật tư', TABLES.items], ['Máy / thiết bị', TABLES.devices], ['Máy vào / ra', TABLES.devlog], ['Sửa chữa', TABLES.repairs], ['Ghi chú', TABLES.notes],
    ['Phiếu nhập / xuất', TXN], ['Phiếu mượn', LOAN], ['Ảnh biên bản', PHOTO], ['Bảng giá', PRICE], ['Hạng mục', HANGMUC], ['Kế hoạch', PLAN],
    ['Phiếu yêu cầu', REQ], ['Cấu kiện (Kho)', CK]];
  if (typeof TC_CK !== 'undefined') L.push(['Thi công: cấu kiện', TC_CK], ['Thi công: bản ghi', TC_REC], ['Thi công: ảnh', TC_PH], ['Thi công: cấu hình', TC_CF]);
  if (typeof GD !== 'undefined') L.push(['Giải động', GD]);
  L.push(['Báo hỏng', HONG]);
  return L.map(x => ({ label:x[0], sheet:x[1].sheet, cols:x[1].cols, pc:x[1].cols.indexOf('project') })).filter(x => x.pc >= 0);
}
function pjCol_(sh, col) { const n = sh.getLastRow() - 1; return n > 0 ? sh.getRange(2, col, n, 1).getValues() : []; }
// Đếm (và đổi nếu to) mọi chỗ có tên dự án P
function pjScan_(P, to) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), out = [], P0 = String(P);
  const sw = (o) => { let n = 0; const w = v => { if (typeof v === 'string') { if (v === P0) { n++; return to; } return v; }
    if (Array.isArray(v)) return v.map(w); if (v && typeof v === 'object') { Object.keys(v).forEach(k => v[k] = w(v[k])); } return v; }; const r = w(o); return { n:n, v:r }; };
  pjTables_().forEach(t => {
    const sh = ss.getSheetByName(t.sheet); if (!sh) return;
    const vals = pjCol_(sh, t.pc + 1); let n = 0;
    vals.forEach(r => { if (String(fromCell(r[0])) === P0) { n++; if (to) r[0] = toCell(to); } });
    if (to && n) sh.getRange(2, t.pc + 1, vals.length, 1).setValues(vals);
    // tên dự án nằm trong cột khác: phiếu mượn giữa 2 dự án (Người / đơn vị, Liên kết, Đề xuất bỏ) · giải động (chuyển đến dự án)
    const extra = t.sheet === LOAN.sheet ? ['party', 'link', 'drop'] : (typeof GD !== 'undefined' && t.sheet === GD.sheet) ? ['hist'] : [];
    let x = 0;
    extra.forEach(c => {
      const ci = t.cols.indexOf(c); if (ci < 0) return;
      const col = pjCol_(sh, ci + 1); let ch = 0;
      col.forEach(r => {
        const s = String(fromCell(r[0]) || ''); if (!s) return;
        if (c === 'party') { if (s === P0) { x++; ch++; if (to) r[0] = toCell(to); } return; }
        if (s.indexOf(P0) < 0) return;
        try { const o = JSON.parse(s), res = sw(o); if (res.n) { x += res.n; ch++; if (to) r[0] = toCell(JSON.stringify(res.v)); } } catch (e) {}
      });
      if (to && ch) sh.getRange(2, ci + 1, col.length, 1).setValues(col);
    });
    if (n || x) out.push({ label:t.label, n:n + x });
  });
  const users = loadUsers().filter(x => userProjects(x).indexOf(P0) >= 0);
  if (to && users.length) {
    const all = loadUsers(); all.forEach(x => { const L = userProjects(x); const i = L.indexOf(P0); if (i >= 0) { L[i] = to; x.projects = L.join('|'); } }); saveUsers(all);
  }
  return { rows:out, total:out.reduce((s, r) => s + r.n, 0), users:users.length };
}
function pjValidName_(name) {
  const n = clean(String(name || ''), 100).replace(/\s+/g, ' ').trim();
  if (n.length < 2) fail('Tên dự án quá ngắn');
  if (projList().some(p => normKey_(p) === normKey_(n))) fail('Đã có dự án tên "' + n + '"');
  return n;
}
function projAdmin(u) {                                          // màn Quản lý dự án: số liệu từng dự án
  const C = pjClosed_(), L = projList(), ss = SpreadsheetApp.getActiveSpreadsheet(), cnt = {};
  L.forEach(p => cnt[p] = { items:0, txns:0, loansOpen:0, devOn:0, other:0 });
  const tally = (T, f) => { const sh = ss.getSheetByName(T.sheet); if (!sh) return; readRows(sh, T.cols.length).forEach(r => { if (r[0] === '') return; const p = String(r[T.cols.indexOf('project')]); if (cnt[p]) f(cnt[p], r); }); };
  tally(TABLES.items, c => c.items++);
  tally(TXN, c => c.txns++);
  tally(LOAN, (c, r) => { if (String(r[LOAN.cols.indexOf('status')]) === 'open') c.loansOpen++; });
  tally(TABLES.devices, (c, r) => { if (!String(fromCell(r[TABLES.devices.cols.indexOf('outDate')]) || '')) c.devOn++; });
  const busy = {}; pjTables_().forEach(t => { const sh = ss.getSheetByName(t.sheet); if (!sh) return; pjCol_(sh, t.pc + 1).forEach(r => { const p = String(fromCell(r[0])); if (cnt[p]) busy[p] = (busy[p] || 0) + 1; }); });
  const us = loadUsers().filter(x => x.status === 'active');
  const hgOpen = {}; try { hongRead_().rows.forEach(o => { if (HONG_OPEN[o.state] && cnt[o.project]) hgOpen[o.project] = (hgOpen[o.project] || 0) + o.qty; }); } catch (e) {}   // v5.50
  const stockSum = {}; { const sh = ss.getSheetByName(TABLES.items.sheet); if (sh) readRows(sh, TABLES.items.cols.length).forEach(r => { const p = String(r[6]); if (!cnt[p] || r[0] === '') return; const s = (+r[4] || 0) + (+r[TABLES.items.cols.indexOf('site')] || 0); if (s > 0) { stockSum[p] = stockSum[p] || { n:0, q:0 }; stockSum[p].n++; stockSum[p].q += s; } }); }
  return { success:true, kho:pjKho_(), list:L.map(p => Object.assign({ name:p, closed:C[p] || null, rows:busy[p] || 0,
    users:us.filter(x => userProjects(x).indexOf(p) >= 0).length, hongOpen:Math.round((hgOpen[p] || 0) * 1000) / 1000, stockN:(stockSum[p] || {}).n || 0, stockQ:Math.round(((stockSum[p] || {}).q || 0) * 1000) / 1000 }, cnt[p])) };
}
function projRename(u, d) {
  const from = String(d.from || ''); if (projList().indexOf(from) < 0) fail('Không có dự án "' + from + '"');
  const to = pjValidName_(d.to);
  if (d.dry) return Object.assign({ success:true, dry:true, from:from, to:to }, pjScan_(from));
  const res = pjScan_(from, to);
  const sh = sheetOf(DUAN, ['id','name']), L = projList().map(p => p === from ? to : p);
  sh.getRange(2, 1, L.length, 2).setValues(L.map((p, i) => [i + 1, toCell(p)]));
  const mv = (key, obj) => { if (obj && obj[from] !== undefined) { obj[to] = obj[from]; delete obj[from]; jset_(key, obj); } };
  mv('projCfg', jget_('projCfg', {})); mv('nxtMap', jget_('nxtMap', {})); mv('projClosed', pjClosed_()); mv('tcVer', jget_('tcVer', {}));
  const nb = jget_('nxtBatch', {}); let nbc = 0; Object.keys(nb).forEach(k => { if (nb[k] && nb[k].project === from) { nb[k].project = to; nbc++; } }); if (nbc) jset_('nxtBatch', nb);
  const A = pjAlias_(); Object.keys(A).forEach(k => { if (A[k] === from) A[k] = to; }); A[from] = to; delete A[to]; jset_('projAlias', A);
  try { if (typeof tcBump_ === 'function') tcBump_(to); } catch (e) {}
  const KHO = pjKho_(); if (KHO && from === KHO) props_().setProperty('gdKho', to);   // v5.49.2: đổi tên kho công ty → Giải động "Về kho …" theo tên mới
  writeLog(u, 'Đổi tên dự án', from + ' → ' + to + ' · ' + res.total + ' dòng (' + res.rows.map(r => r.label + ' ' + r.n).join(', ') + ') · ' + res.users + ' tài khoản');
  return Object.assign({ success:true, from:from, to:to }, res);
}
function projDelete(u, d) {
  const P = String(d.name || ''); if (projList().indexOf(P) < 0) fail('Không có dự án "' + P + '"');
  if (projList().length <= 1) fail('Phải còn ít nhất 1 dự án');
  const s = pjScan_(P);
  if (s.total) fail('Dự án "' + P + '" còn ' + s.total + ' dòng dữ liệu (' + s.rows.map(r => r.label + ' ' + r.n).join(', ') + ') — chỉ xoá được dự án trống. Dùng "Đóng dự án".');
  const sh = sheetOf(DUAN, ['id','name']), L = projList().filter(p => p !== P), n = sh.getLastRow() - 1;
  if (n > 0) sh.getRange(2, 1, n, 2).clearContent();
  sh.getRange(2, 1, L.length, 2).setValues(L.map((p, i) => [i + 1, toCell(p)]));
  if (s.users) { const all = loadUsers(); all.forEach(x => { const L2 = userProjects(x); if (L2.indexOf(P) >= 0) x.projects = L2.filter(p => p !== P).join('|'); }); saveUsers(all); }
  ['projCfg', 'nxtMap', 'projClosed', 'tcVer'].forEach(k => { const o = jget_(k, {}); if (o && o[P] !== undefined) { delete o[P]; jset_(k, o); } });
  const A = pjAlias_(); let ac = 0; Object.keys(A).forEach(k => { if (A[k] === P) { delete A[k]; ac++; } }); if (ac) jset_('projAlias', A);
  writeLog(u, 'Xoá dự án trống', P + (s.users ? ' · bỏ khỏi ' + s.users + ' tài khoản' : ''));
  return { success:true };
}
function projClose(u, d) {
  const P = String(d.name || ''); if (projList().indexOf(P) < 0) fail('Không có dự án "' + P + '"');
  const C = pjClosed_();
  if (d.open) { if (!C[P]) return { success:true }; delete C[P]; jset_('projClosed', C); writeLog(u, 'Mở lại dự án', P); return { success:true }; }
  if (String(d.confirm || '') !== P) fail('Gõ đúng tên dự án để xác nhận');
  if (projList().filter(p => !C[p] && p !== P).length < 1) fail('Phải còn ít nhất 1 dự án đang chạy');
  C[P] = { at:nowTxt(), by:u.name }; jset_('projClosed', C);
  writeLog(u, 'Đóng dự án', P + (d.note ? ' · ' + clean(String(d.note), 200) : ''));
  return { success:true };
}
// v5.49.1 — ĐƠN VỊ TÍNH: Admin thêm / bỏ / xếp thứ tự (Script Properties 'units'); null = app dùng danh sách sẵn có
function unitsGet_() { const v = jget_('units', null); return Array.isArray(v) ? v : null; }
function setUnits(u, d) {
  const L = Array.isArray(d.list) ? d.list : [], out = [], seen = {};
  L.forEach(x => {
    const n = clean(String(x || ''), 20).replace(/\s+/g, ' ').trim(); if (!n) return;
    const k = normKey_(n); if (seen[k]) return; seen[k] = 1; out.push(n);
  });
  if (out.length < 3 || out.length > 120) fail('Danh sách đơn vị phải có từ 3 đến 120 đơn vị');
  const T = TABLES.items, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length), used = {};
  rows.forEach(r => { if (r[0] !== '' && String(r[3]).trim()) used[normKey_(r[3])] = String(r[3]).trim(); });
  const old = unitsGet_() || [];
  const gone = old.filter(x => !seen[normKey_(x)] && used[normKey_(x)]);
  if (gone.length) fail('Đơn vị đang có vật tư dùng, không bỏ được: ' + gone.join(', '));
  Object.keys(used).forEach(k => { if (!seen[k]) { seen[k] = 1; out.push(used[k]); } });   // vật tư dự án khác đang dùng đơn vị chưa có trong danh sách → tự thêm
  jset_('units', out);
  const added = out.filter(x => !old.some(o => normKey_(o) === normKey_(x)));
  writeLog(u, 'Đơn vị tính', out.length + ' đơn vị' + (added.length && old.length ? ' · thêm: ' + added.join(', ') : ''));
  return { success:true, units:out };
}
// =====================================================================
// v5.50.0 — BÁO HỎNG vật tư / thiết bị phụ trợ (trang HuHong). Máy móc có mã vẫn dùng SuaChua.
//   state: cho = hỏng, để chờ (chưa sửa) · sua = đang sửa (tại chỗ / xưởng) · xong = sửa xong · bo = không sửa được (đã xuất thanh lý) · di = chuyển đi nơi khác
//   loc: kho / ct (ở công trường). cho + sua KHÔNG đổi tồn; bo tạo 1 phiếu xuất (kho: ngoai · công trường: ctra) "Hư hỏng – thanh lý".
//   Chuyển hàng hỏng sang dự án FECON khác (giải động về kho công ty, chuyển dự án, cho mượn) → bên nhận có ngay bản ghi "hỏng – để chờ".
// =====================================================================
const HONG = { sheet:'HuHong', cols:['id','project','itemId','itemName','unit','qty','loc','state','reason','where','from','txnId','hist','by','at','upd'],
  head:['Số báo hỏng','Dự án','ID vật tư','Tên vật tư','Đơn vị','Số lượng','Ở đâu (kho / ct)','Tình trạng (cho = để chờ · sua = đang sửa · xong = sửa xong · bo = thanh lý · di = chuyển đi)',
        'Hỏng gì','Sửa ở đâu','Chuyển từ (dự án · số báo hỏng)','Phiếu xuất thanh lý','Lịch sử (JSON)','Người báo','Lúc báo','Cập nhật lúc'] };
const HONG_OPEN = { cho:1, sua:1 };
function hongRead_() {
  const sh = sheetOf(HONG.sheet, HONG.head);
  const rows = readRows(sh, HONG.cols.length).map((r, i) => { const o = rowToObj(HONG.cols, r); o._i = i; o.qty = +o.qty || 0; o.id = String(o.id);
    try { o.hist = JSON.parse(String(o.hist || '[]')); } catch (e) { o.hist = []; } return o; }).filter(o => o.id !== '');
  return { sh, rows };
}
function hongWrite_(sh, o) {
  const v = HONG.cols.map(c => toCell(c === 'hist' ? JSON.stringify(o.hist || []).slice(0, 45000) : (o[c] === undefined ? '' : o[c])));
  if (o._i === undefined) sh.appendRow(v); else sh.getRange(o._i + 2, 1, 1, v.length).setValues([v]);
}
function hongFind_(id) { try { return hongRead_().rows.find(o => o.id === String(id)) || null; } catch (e) { return null; } }
function hongList_(P) {
  const rows = hongRead_().rows.filter(o => o.project === P), open = rows.filter(o => HONG_OPEN[o.state]), shut = rows.filter(o => !HONG_OPEN[o.state]).slice(-300);
  return open.concat(shut).map(o => { const x = Object.assign({}, o); delete x._i; return x; });
}
function hongOpenQty_(rows, P, itemId, loc) { return rows.filter(o => o.project === P && String(o.itemId) === String(itemId) && o.loc === loc && HONG_OPEN[o.state]).reduce((s, o) => s + o.qty, 0); }
function hongItem_(P, itemId) {
  const T = TABLES.items, rows = readRows(sheetOf(T.sheet, T.head), T.cols.length);
  const r = rows.find(x => x[0] !== '' && String(x[0]) === String(itemId)); if (!r) fail('Vật tư không tồn tại trong kho');
  if (String(r[6]) !== P) fail('Vật tư thuộc dự án khác');
  return { id:r[0], name:String(r[1]), unit:String(r[3]), stock:+r[4] || 0, site:+r[ctSiteCol_() - 1] || 0, track:ctTrack_(r) };
}
function hongBoTxn_(u, o, txnId, reason) {
  const r = addTxn(u, { id:txnId, type:'xuat', itemId:o.itemId, qty:o.qty, ct:o.loc === 'ct' ? 'ctra' : 'ngoai', supplierOrReceiver:'Hư hỏng – thanh lý',
    note:('🗑 Hư hỏng – thanh lý: ' + (reason || o.reason || '')).slice(0, 300) + ' · báo hỏng #' + o.id });
  if (r && r.success === false) fail(r.error || 'Không ghi được phiếu thanh lý');
}
function hongAdd(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const id = String(d.id || ''); if (!/^\d{6,20}$/.test(id)) fail('Thiếu số báo hỏng');
  const { sh, rows } = hongRead_(); if (rows.some(o => o.id === id)) return { success:true, duplicate:true };
  const it = hongItem_(P, d.itemId), q = Math.round((+d.qty || 0) * 1000) / 1000, loc = d.loc === 'ct' ? 'ct' : 'kho';
  const st = ['cho', 'sua', 'bo'].indexOf(d.state) >= 0 ? d.state : 'cho';
  const reason = clean(String(d.reason || ''), 300).trim(), where = clean(String(d.where || ''), 120).trim();
  if (!(q > 0)) fail('Số lượng phải lớn hơn 0');
  if (reason.length < 3) fail('Ghi rõ hỏng gì');
  const have = loc === 'ct' ? it.site : it.stock, used = hongOpenQty_(rows, P, it.id, loc), free = Math.round((have - used) * 1000) / 1000;
  if (q > free + 1e-9) fail((loc === 'ct' ? 'Ở công trường' : 'Trong kho') + ' chỉ còn ' + Math.max(0, free) + ' ' + it.unit + ' ' + it.name + ' chưa báo hỏng');
  const o = { id, project:P, itemId:it.id, itemName:it.name, unit:it.unit, qty:q, loc, state:st, reason, where, from:'', txnId:'', by:u.name, at:nowTxt(), upd:nowTxt(),
    hist:[{ t:st === 'bo' ? 'bo' : 'add', s:st, q, by:u.name, at:nowTxt(), w:where }] };
  if (st === 'bo') { o.txnId = String(d.txnId || (id + '1')); hongBoTxn_(u, o, o.txnId, reason); }
  hongWrite_(sh, o);
  writeLog(u, st === 'bo' ? 'Hỏng – thanh lý' : 'Báo hỏng', q + ' ' + it.unit + ' ' + it.name + ' · ' + (loc === 'ct' ? 'ở công trường' : 'trong kho') + ' · ' + reason + (where ? ' · sửa ở ' + where : '') + ' — ' + P);
  return { success:true, id, txnId:o.txnId };
}
function hongSet(u, d) {
  const { sh, rows } = hongRead_(), o = rows.find(x => x.id === String(d.id || ''));
  if (!o) fail('Không tìm thấy bản ghi hỏng'); mustAllow(u, o.project);
  if (!HONG_OPEN[o.state]) fail('Bản ghi đã xử lý xong');
  const act = String(d.act || ''); if (['sua', 'cho', 'xong', 'bo'].indexOf(act) < 0) fail('Thao tác không hợp lệ');
  const q = Math.round((+d.qty || o.qty) * 1000) / 1000; if (!(q > 0) || q > o.qty + 1e-9) fail('Số lượng không hợp lệ (tối đa ' + o.qty + ')');
  const where = clean(String(d.where || ''), 120).trim(), note = clean(String(d.note || ''), 300).trim();
  if (act === 'bo' && !(note.length >= 3 || o.reason)) fail('Ghi lý do không sửa được');
  let x = o;
  if (q < o.qty - 1e-9) {                                       // tách một phần
    const nid = String(d.newId || ''); if (!/^\d{6,20}$/.test(nid) || rows.some(r => r.id === nid)) fail('Thiếu số bản ghi mới');
    o.qty = Math.round((o.qty - q) * 1000) / 1000; o.upd = nowTxt(); o.hist.push({ t:'tach', q, to:nid, by:u.name, at:nowTxt() }); hongWrite_(sh, o);
    x = Object.assign({}, o, { _i:undefined, id:nid, qty:q, hist:[{ t:'tach', q, from:o.id, by:u.name, at:nowTxt() }] });
  }
  x.state = act; x.upd = nowTxt(); if (act === 'sua' && where) x.where = where;
  if (act === 'bo') { x.txnId = String(d.txnId || (x.id + '1')); hongBoTxn_(u, x, x.txnId, note || x.reason); }
  x.hist.push({ t:act, q, by:u.name, at:nowTxt(), w:where, n:note });
  hongWrite_(sh, x);
  const L = { sua:'Gửi sửa', cho:'Hỏng – để chờ', xong:'Sửa xong', bo:'Hỏng – thanh lý' }[act];
  writeLog(u, L, q + ' ' + x.unit + ' ' + x.itemName + (where ? ' · ' + where : '') + (note ? ' · ' + note : '') + ' — ' + x.project);
  return { success:true, id:x.id, txnId:x.txnId || '' };
}
// Hàng hỏng rời dự án theo phiếu xuất / cho mượn: trừ bản ghi hỏng ở nơi đi; dự án FECON nhận → tạo "hỏng – để chờ" ở kho bên nhận
function hongMove(u, d) {
  const P = String(d.project || ''); mustAllow(u, P);
  const key = String(d.key || ''); const { sh, rows } = hongRead_();
  if (key && rows.some(o => (o.hist || []).some(h => h.k === key))) return { success:true, duplicate:true };
  let left = Math.round((+d.qty || 0) * 1000) / 1000; if (!(left > 0)) fail('Số lượng không hợp lệ');
  const loc = d.loc === 'ct' ? 'ct' : 'kho', bo = !!d.bo, dest = clean(String(d.dest || ''), 120), destP = String(d.destP || '');
  const src = rows.filter(o => o.project === P && String(o.itemId) === String(d.itemId) && o.loc === loc && HONG_OPEN[o.state]);
  if (!src.length) return { success:true, moved:0 };
  const moved = []; let k = 0;
  src.forEach(o => {
    if (left <= 1e-9) return;
    const q = Math.min(o.qty, left); left = Math.round((left - q) * 1000) / 1000;
    let x = o;
    if (q < o.qty - 1e-9) { o.qty = Math.round((o.qty - q) * 1000) / 1000; o.upd = nowTxt(); hongWrite_(sh, o);
      x = Object.assign({}, o, { _i:undefined, id:String(o.id) + 'm' + (++k), qty:q, hist:[{ t:'tach', q, from:o.id, by:u.name, at:nowTxt() }] }); }
    x.state = bo ? 'bo' : 'di'; x.upd = nowTxt(); x.txnId = String(d.txnId || '');
    x.hist.push({ t:bo ? 'bo' : 'di', q, by:u.name, at:nowTxt(), dest:dest || destP, k:key });
    hongWrite_(sh, x); moved.push(x);
  });
  let to = 0;
  if (!bo && destP && destP !== P && projList().indexOf(destP) >= 0) {
    const T = TABLES.items, items = readRows(sheetOf(T.sheet, T.head), T.cols.length);
    moved.forEach((x, j) => {
      const tgt = items.find(r => r[0] !== '' && String(r[6]) === destP && normName_(r[1]) === normName_(x.itemName));
      const y = { id:String(x.id) + 'd', project:destP, itemId:tgt ? tgt[0] : '', itemName:x.itemName, unit:x.unit, qty:x.qty, loc:'kho', state:'cho', reason:x.reason,
        where:'', from:P + ' · #' + x.id, txnId:'', by:u.name, at:nowTxt(), upd:nowTxt(), hist:[{ t:'den', q:x.qty, from:P, by:u.name, at:nowTxt(), k:key }] };
      hongWrite_(sh, y); to += x.qty;
    });
  }
  const n = moved.reduce((s, x) => s + x.qty, 0);
  writeLog(u, bo ? 'Hỏng – thanh lý' : 'Chuyển hàng hỏng', n + ' ' + (moved[0] ? moved[0].unit + ' ' + moved[0].itemName : '') + ' → ' + (dest || destP) + ' — ' + P);
  return { success:true, moved:n, to:to };
}
const normKey_ = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();

// =====================================================================
// v5.20.2 — NỘI DUNG CÁC PHIÊN BẢN APP (chỉ người có quyền v_ver mới đọc được qua verLog)
// Mỗi bản: v, d (ngày), type ('bug' sửa lỗi / 'up' nâng cấp / 'new' tính năng mới), title, who (ảnh hưởng tới), sum (tóm tắt 2–3 dòng),
//   bugs: [{t, loi, sua, thu:[[1 đã thử | 0 chưa thử, 'mô tả'], ...]}], txt (nội dung), thu (thử nghiệm chung), todo (người dùng cần làm gì), old (bản trước 5.28)
// Bản mới nhất ở đầu. Thêm bản mới: chép 1 khối, sửa nội dung, Triển khai → Phiên bản mới TRƯỚC khi thay index.html trên GitHub.
// =====================================================================
const VER_LOG = [
 { v:'5.51.0', d:'16/10/2026', type:'up', title:'Kho: báo cáo Excel kiểu mới',
   who:'Thủ kho, CHT, QLTB',
   sum:['Nút Xuất Excel ra file "Báo cáo kho": Tổng quan (số chính, mục Cần kiểm tra tự phát hiện) · Tổng hợp NXT theo nhóm (có cột Ở công trường) · Sổ nhập kho · Sổ xuất kho · Nhiên liệu (tồn DO từng dòng, tổng hợp theo máy)',
        'Thép ghi cả cây và kg · số phiếu tạm PN / PX theo ngày · chỗ ký cuối mỗi sheet, in vừa khổ A4',
        'Phiếu nhập có thêm ô "Số chứng từ / biên bản giao hàng" (không bắt buộc, trong mục Thêm thông tin)'],
   todo:['Thay index.html + sw.js + thicong.html trên GitHub'] },
 { v:'5.50.2', d:'16/10/2026', type:'bug', title:'Sửa: lỗi ngầm mỗi lần mở app (Tổng quan)',
   who:'Mọi người',
   sum:['Mở app → Tổng quan báo lỗi ngầm "byTimeDescL is not defined" và ghi vào trang LoiApp mỗi lần mở (có từ 5.44.1) → đã sửa, nhật ký lỗi không còn bị ghi rác',
        'Gốc lỗi: màn đầu tiên được vẽ trước khi app tải xong các phần bổ sung → nay chờ tải đủ rồi mới vẽ (dữ liệu trên máy vẫn mở ngay, kể cả khi mất mạng)'],
   todo:['Chỉ thay index.html + sw.js + thicong.html trên GitHub — không cần dán Apps Script'] },
 { v:'5.50.1', d:'16/10/2026', type:'up', title:'Kho: xếp danh sách Tồn kho',
   who:'Thủ kho, CHT, Admin',
   sum:['Tồn kho: ô "⇅ Xếp" → Số lượng nhiều → ít (mặc định) / ít → nhiều / Tên A→Z (D20 < D25 < D100) / Chủng loại / Mới phát sinh; app nhớ trên máy',
        'Số lượng = trong kho + ở công trường. Món tồn âm luôn ở đầu (đỏ), món số lượng 0 luôn ở cuối'],
   todo:['Chỉ thay index.html + sw.js trên GitHub (không cần dán Apps Script nếu đã ở 5.50.0)'] },
 { v:'5.50.1', d:'16/10/2026', type:'up', title:'Kho: xếp danh sách Tồn kho',
   who:'Thủ kho, CHT, Admin',
   sum:['Tồn kho: nút Xếp theo — Số lượng (mặc định, nhiều → ít, bấm lại đảo) · Tên A→Z (D20 < D25 < D100) · Chủng loại (thu gọn từng nhóm) · Mới phát sinh',
        'Số lượng = trong kho + ở công trường; tồn âm luôn lên đầu (đỏ), số lượng 0 luôn xuống cuối'],
   todo:['Chỉ thay index.html + sw.js trên GitHub (không cần dán Apps Script nếu đã ở 5.50.0)'] },
 { v:'5.50.0', d:'16/10/2026', type:'new', title:'Kho: Báo hỏng vật tư / thiết bị phụ trợ',
   who:'Thủ kho, CHT, Admin',
   sum:['Tồn kho → 📒 Thẻ kho → 🔧 Báo hỏng: hỏng có thể sửa (để chờ / đang sửa — tồn giữ nguyên) hoặc hỏng không sửa được (trừ ngay, phiếu "Hư hỏng – thanh lý"); bắt buộc ghi hỏng gì + ảnh',
        'Đang hỏng chờ sửa: Gửi sửa · Sửa xong · Không sửa được; đang sửa quá 30 ngày nhắc ở Tổng quan',
        'Chuyển hàng hỏng (giải động về kho công ty, chuyển dự án, cho mượn): phiếu hỏi mấy cái hỏng, bên nhận thấy luôn "hỏng – để chờ"',
        'Tồn kho hiện "🔧 x hỏng · y dùng được"; Sổ NXT Excel thêm cột Đang hỏng; ô Nhập / Xuất nhanh hiểu "báo hỏng 2 tank bent", "hỏng bỏ 1 gàu d800"'],
   todo:['Admin dán tệp Apps Script chính (máy chủ 5.50.0) TRƯỚC, rồi mới thay 3 tệp GitHub'] },
 { v:'5.49.4', d:'16/10/2026', type:'up', title:'Kho: ô tìm kiếm ở Phiếu nhập / Phiếu xuất · Thẻ kho từng vật tư',
   who:'Thủ kho, CHT, Admin',
   sum:['Phiếu nhập / Phiếu xuất: ô tìm theo tên vật tư, NCC / người nhận, ghi chú (mã phiếu giấy), số phiếu, người lập — gõ không dấu được',
        'Tồn kho: nút "📒 Thẻ kho" ở mỗi vật tư — mọi phiếu của món đó, tồn trong kho sau từng phiếu; dòng làm tồn âm tô đỏ; bấm phiếu để xem / sửa / xoá (Admin)'],
   todo:['Chỉ thay index.html + sw.js trên GitHub (không cần dán Apps Script nếu đã ở 5.49.2)'] },
 { v:'5.49.3', d:'15/10/2026', type:'bug', title:'Sửa: không đổi tên được kho công ty trên app',
   who:'Admin',
   sum:['Quản lý dự án → Đổi tên "Kho FECON Đồng Nai" báo "kho bãi công ty — không đổi tên được" dù máy chủ 5.49.2 đã cho đổi → bỏ chặn trên app'],
   todo:['Chỉ thay index.html + sw.js trên GitHub (KHÔNG cần dán Apps Script nếu đã ở 5.49.2)'] },
 { v:'5.49.2', d:'15/10/2026', type:'up', title:'Kho công ty đổi tên được (Kho FECON Đồng Nai → Kho Biên Hòa)',
   who:'Admin, Thủ kho, P.QLTB',
   sum:['Admin: Menu → Quản lý dự án → Đổi tên áp dụng được cho kho công ty; lịch sử giải động, nút "🏭 Về …" trên phiếu xuất đổi theo',
        'Ô Nhập / Xuất nhanh hiểu thêm "về kho Biên Hòa", "về kho công ty" (câu cũ "về kho Đồng Nai" vẫn dùng được)',
        'Đơn vị tính thêm sẵn: Quả, Đoạn, Búa, Giá, Đầu; đơn vị vật tư đang dùng tự có trong ô chọn'],
   todo:['Admin dán CẢ 2 tệp Apps Script (tệp chính 5.49.2 + thicong.gs 1.5.1) TRƯỚC, rồi mới thay 3 tệp GitHub', 'Admin: Quản lý dự án → Đổi tên "Kho FECON Đồng Nai" → "Kho Biên Hòa"'] },
 { v:'5.49.1', d:'15/10/2026', type:'up', title:'Đơn vị tính: Admin tự thêm',
   who:'Admin, Thủ kho',
   sum:['Admin: Menu → Danh mục vật tư → nút "📏 Đơn vị" — thêm đơn vị mới, đưa lên đầu, bỏ đơn vị không dùng; dùng chung mọi dự án',
        'Thêm sẵn: Ống, Bao, Bình, Chiếc, Cặp, Bó, Lô, Xe, Chuyến, Ca',
        'Đơn vị đang có vật tư dùng thì không bỏ được; thủ kho chỉ chọn trong danh sách (tránh "ống" / "Ống" thành 2 đơn vị)'],
   todo:['Admin dán tệp Apps Script chính (máy chủ 5.49.1) TRƯỚC, rồi mới thay 3 tệp GitHub'] },
 { v:'5.49.0', d:'15/10/2026', type:'new', title:'Quản lý dự án: đổi tên · đóng / mở lại · xoá dự án trống',
   who:'Admin, Lãnh đạo, Giám đốc dự án, P.QLTB',
   sum:['Admin: Menu → Quản lý dự án — mỗi dự án hiện số vật tư, phiếu, phiếu mượn chưa trả, máy ở công trường, số người được giao',
        'Đổi tên dự án: đổi cùng lúc ở mọi bảng Kho, Thi công, Giải động và tài khoản; phiếu chờ gửi (mất mạng) mang tên cũ vẫn ghi đúng dự án',
        'Đóng dự án: chỉ xem (báo cáo, Sổ NXT vẫn mở được), không lập / sửa phiếu; chỉ Admin, Giám đốc / Phó giám đốc công ty, Giám đốc dự án, Trưởng / Phó phòng QLTB (dự án được giao) còn thấy',
        'Xoá dự án: chỉ dự án trống (tạo nhầm)'],
   todo:['Admin dán tệp Apps Script chính (máy chủ 5.49.0) TRƯỚC, rồi mới thay 3 tệp GitHub'] },
 { v:'5.48.0', d:'15/10/2026', type:'new', title:'Kho: phiếu nhập gọn · danh mục vật tư chung · nhóm vật tư · lịch sử thẳng công trường 1 dòng',
   who:'Thủ kho, Admin',
   sum:['Nhập thẳng ra công trường: Tổng quan, lịch sử, báo cáo ngày chỉ hiện 1 dòng nhập "🏗 Thẳng ra công trường" (dữ liệu và sổ NXT Excel vẫn đủ 2 phiếu nhập + xuất)',
        'Phiếu nhập gọn: tên dự án ở dòng tiêu đề; gõ tên vật tư → nhóm, đơn vị, Vào kho / Thẳng ra công trường tự chọn theo danh mục; nhà cung cấp, ghi chú, ảnh gom vào "Thêm thông tin"',
        'Admin: Menu → Danh mục vật tư — mỗi tên có nhóm, đơn vị, Kho / Thẳng; tên "Thép" áp cho mọi "Thép cây D… x …m"; dùng chung mọi dự án; xuất Excel',
        'Admin: Menu → Nhóm vật tư — đổi tên, thêm nhóm, chọn biểu tượng; chọn nhóm bằng danh sách có biểu tượng'],
   todo:['Admin dán tệp Apps Script chính (máy chủ 5.48.0) TRƯỚC, rồi mới thay 3 tệp GitHub', 'Admin mở Menu → Danh mục vật tư, rà và bấm Lưu một lần để mọi máy dùng chung'] },
 { v:'5.47.1', d:'15/10/2026', type:'up', title:'Kho: ô Nhập / Xuất nhanh gọn hơn',
   who:'Thủ kho, CHT',
   sum:['Ô Nhập / Xuất nhanh về lại dưới 2 ô Nhập kho / Xuất kho, thu gọn thành 1 thanh "⚡ Nhập / Xuất nhanh" — bấm vào thanh để mở ô gõ lệnh',
        'Còn lệnh gõ dở chưa lưu thì ô tự mở sẵn; lưu xong ô tự đóng',
        'Cách gõ lệnh: bấm nút ? ở màn xem trước → bài "Nhập / Xuất nhanh"'] },
 { v:'5.47.0', d:'14/10/2026', type:'new', title:'Kho: ô Nhập / Xuất nhanh — gõ hoặc nói một lệnh, app tự tách phiếu',
   who:'Thủ kho, CHT',
   sum:['Tổng quan Kho: ô "Nhập / Xuất nhanh" nằm trên 2 ô Nhập kho / Xuất kho. Gõ hoặc bấm Nói, ví dụ: "nhập 2 tank bent, 1 tank đất, 32 tấn bentonite" — mỗi món cách nhau dấu phẩy hoặc xuống dòng',
        'App tự phân loại: thiết bị / vật tư phụ trợ nhập thẳng ra công trường, vật tư tiêu hao vào kho, máy vào công trường, cho mượn, trả, ra khỏi công trình',
        'Bảng xem trước: ô vàng còn thiếu (để trống vẫn lưu), dòng đỏ phải sửa (kho không đủ hàng, chưa chọn đúng loại); lưu cả lệnh một lần — một dòng sai thì không lưu dòng nào',
        'Nhập hàng trùng với hàng dự án khác đang cho mượn chờ xác nhận → bắt buộc chọn: Xác nhận phiếu mượn hoặc Nhập thường và đóng thẻ chờ (không bị cộng 2 lần)',
        'Danh mục: Bentonite tính theo Tấn, cóc nối theo Bộ, thép cây theo Cây; thêm Tank chứa nước'],
   todo:['Admin dán tệp Apps Script chính (máy chủ 5.47.0) TRƯỚC, rồi mới thay 3 tệp GitHub'] },
 { v:'5.46.1', d:'13/10/2026', type:'fix', title:'Kho: đổi / gỡ mã P.QLTB · đổi tên máy giữ lịch sử dầu',
   who:'Thủ kho, P.QLTB, Admin',
   sum:['Chi tiết máy: nút "🔗 Đổi mã" và "✕ Gỡ mã · ngoài danh mục" (ghi lý do, lưu nhật ký) — trước đây gắn nhầm mã thì không sửa được',
        'Chi tiết vật tư: thêm nút "Gỡ mã · không thuộc P.QLTB"',
        'Đổi tên máy (Sửa thiết bị): các phiếu cấp dầu, phiếu yêu cầu cũ đổi theo tên mới — không còn mất lịch sử dầu / định mức / giờ máy',
        'Máy chủ giữ ngày bắt đầu hoạt động khi điện thoại chưa cập nhật app sửa thông tin máy'] },
 { v:'5.46.0', d:'13/10/2026', type:'new', title:'Kho: giờ máy không bắt buộc · ngày máy bắt đầu hoạt động · định mức dầu thực tế',
   who:'Thủ kho, P.QLTB, CHT',
   sum:['Máy vào / thêm máy / máy rời công trường / cấp dầu: được bỏ trống giờ máy. Cấp dầu bỏ trống thì báo "chưa có giờ máy — bổ sung trong 7 ngày"; chi tiết máy có nút "＋ Giờ máy" (thủ kho trong 7 ngày, quá hạn nhờ Admin)',
        'Phiếu cấp dầu có ô "Giờ cấp dầu thực tế" — nhập muộn thì sửa lại, lùi tối đa 24 giờ',
        'Ngày máy bắt đầu hoạt động: P.QLTB (PP / TP QLTB — Admin bật thêm quyền cho cán bộ QLTB) ghi trong chi tiết máy; lần cấp dầu đầu tiên hiện để tham khảo. File BM05 ghi vào cột Ghi chú',
        'Định mức dầu thực tế = trung bình 3 khoảng gần nhất giữa các lần cấp dầu: có giờ máy → theo giờ máy; không có → theo giờ giữa 2 lần cấp (máy chạy 24/24, khoảng ≤ 48 giờ). Lần vượt TB quá 20% → cảnh báo',
        'Tổng quan: thẻ "Máy & dầu cần xem" — vượt định mức, cấp dầu chưa có giờ máy, máy vào ≥ 7 ngày chưa hoạt động (máy thuê ngoài ghi "đang tính tiền")'] },
 { v:'5.45.1', d:'13/10/2026', type:'fix', title:'Kho: sửa số phiếu mượn hiện rõ trong lịch sử',
   who:'Thủ kho',
   sum:['Sửa số lượng phiếu mượn (VD 1 → 2) ghi thêm 1 dòng "✏️ Sửa số cho mượn −1" đúng lúc sửa, thay cho sửa ngầm phiếu cũ — trước đây lịch sử chỉ thấy dòng "Tồn đầu +1" mà không thấy phần cho mượn thêm'] },
 { v:'5.45.0', d:'13/10/2026', type:'new', title:'Kho: sửa số lượng phiếu mượn · chọn đúng vật tư khi xác nhận mượn · gộp vật tư trùng tên',
   who:'Thủ kho, Admin',
   sum:['Chi tiết phiếu mượn có nút "✏️ Sửa số lượng (ghi nhầm)" — ghi số đúng + lý do. Phiếu đã khớp với dự án khác: gửi đề nghị, bên kia bấm "Đồng ý sửa" thì sửa cả 2 dự án (phiếu kho + tồn)',
        'Xác nhận hàng mượn từ dự án khác: tên bên kia ghi khác tên trong kho → app gợi ý món gần giống để chọn đúng, không tạo thêm tên trùng',
        'Admin: Vật tư → bấm món ghi sai tên → "🔗 Gộp" vào món đúng (cùng đơn vị). Mọi phiếu chuyển sang tên đúng; có thể bỏ phiếu "Tồn có sẵn – chưa cập nhật lên app" ghi thừa',
        'Tổng quan + Lịch sử nhập / xuất hiện cả phiếu cho mượn / nhận trả / đi mượn / trả lại; bấm xác nhận thì thẻ tắt ngay'] },
 { v:'5.44.1', d:'13/10/2026', type:'fix', title:'Kho: sửa 9 lỗi nhập kho, máy vào, giải động, cho mượn',
   who:'Thủ kho',
   sum:['Nút xác nhận đúng màu + chữ theo từng việc (máy vào, mượn, nhận trả, về kho) — không còn nút xám trông như bị khóa',
        'Máy vào công trường: ẩn ô ngày giờ phiếu không dùng; ngày vào mặc định đúng giờ Việt Nam (trước bị lùi 1 ngày nếu nhập trước 7h sáng)',
        'Tổng quan: "Nhập / Xuất gần nhất" có cả lượt 🏗 máy vào / ra',
        'Danh sách vật tư: tole, tank, cont… ghi nơi đang ở (📦 Trong kho · 🏗 Ở công trường · 📦 5 · 🏗 4) thay cho "Đủ hàng"',
        'Món trong danh sách xuất thẳng tự chọn sẵn "🏗 Thẳng ra công trường" (bấm 📦 Vào kho nếu cất vào kho)',
        'Nhận máy giải động: app tự tìm đúng máy trong danh mục P.QLTB (theo mã kế toán / tên) và mở thẳng màn Máy vào công trường; ô tìm P.QLTB tìm được theo mã kế toán',
        'Dự án khác báo đã mượn của bạn mà kho trên app thiếu (đồ có sẵn, chưa nhập lên app): xác nhận được — app ghi "Tồn có sẵn – chưa cập nhật lên app" phần thiếu rồi ghi cho mượn',
        'Vật tư mới phải chọn Nhóm + Đơn vị (trước để sẵn Nhiên liệu · Lít)'] },
 { v:'5.44.0', d:'12/10/2026', type:'up', title:'Kho: gợi ý tên thêm 192 vật tư thông dụng khi nhập kho',
   who:'Thủ kho, người lập phiếu nhập',
   sum:['Phiếu nhập: gõ vài chữ (vd "que han", "coc noi 25", "ong sieu am") → nhóm gợi ý mới "📚 Vật tư thông dụng" — chọn là điền sẵn tên, nhóm, đơn vị',
        'Danh mục: thép CB400-V D12–D32, thép hình kingpost, cóc nối ren, ống siêu âm & phụ kiện, bentonite / polymer, nhiên liệu & dầu mỡ, cáp & ma ní, răng gàu & lọc máy, hàn & cắt, điện, ống nước, bảo hộ lao động, dụng cụ thí nghiệm dung dịch / bê tông',
        'Món đã có trong kho dự án thì không gợi ý lại; phiếu xuất vẫn gợi ý thiết bị phụ trợ như cũ'],
   txt:['Chỉ đổi app (GitHub). Dán lại Apps Script chính không bắt buộc — chỉ để mục "Có gì mới" hiện bản 5.44.0', 'Vật tư tiêu hao phải nhập kho trước rồi mới xuất được'],
   thu:[[1,'Phiếu nhập → gõ "que han" → chọn "Que hàn 3.2" → nhóm Hàn & cắt, đơn vị Kg tự điền']] },
 { v:'5.43.0', d:'11/10/2026', type:'new', title:'Kho: nạp sổ nhập xuất từ Excel của thủ kho (Admin)',
   who:'Admin, thủ kho (gửi file cho Admin)',
   sum:['Menu → 📥 Nạp sổ nhập xuất từ Excel: mỗi dòng sổ thành 1 phiếu nhập / xuất đúng ngày, NCC, máy / nơi nhận — giữ đủ lịch sử, sổ NXT và tiêu thụ dầu theo máy',
        'Mỗi dự án 1 mẫu Excel khác nhau vẫn nạp được: app tự tìm dòng tiêu đề, đoán cột, Admin chỉnh nếu sai; app nhớ cách ghép theo dự án',
        'Nạp lại file đã cập nhật: chỉ thêm dòng mới, không nhân đôi; xóa được cả đợt nạp; bảng chênh lệch tồn so với file → tích món để kiểm kê điều chỉnh'],
   txt:['Phải dán lại tệp Apps Script chính (thêm cột "Nạp từ Excel" ở trang GiaoDich)', 'Tự sửa ngày bị Excel đảo ngày/tháng (vd 10/01 → 01/10) theo thứ tự dòng', 'Tên gần giống (vd "Dầu Do" / "Dầu DO") cho chọn gộp hay tạo mới; dòng xuất ghi tên trùng máy trong app được nối vào đúng máy'],
   thu:[[1,'Nạp file sổ NXT dự án TTHC (2 sheet ~2.200 dòng) → nạp lại cùng file: 0 dòng mới → xóa đợt: tồn trả về như cũ']] },
 { v:'5.42.0', d:'11/10/2026', type:'up', title:'Thi công: kingpost trên bản vẽ mặt bằng · lọc Kingpost',
   who:'Mọi người dùng app Thi công',
   sum:['Cọc có kingpost hiện chữ H giữa cọc, xoay theo hướng cánh thiết kế: H đặc = đã hạ, H rỗng = chưa hạ (cả Tổng quan và tab Mặt bằng)',
        'Tab Mặt bằng: chip "⌶ Kingpost đã hạ/tổng" — chỉ sáng cọc có kingpost, dùng chung với lọc trạng thái',
        'Chạm cọc: dòng kingpost (loại, tiết diện, dài, đỉnh TK, đã hạ / chưa hạ, đỉnh TT)'],
   txt:['Không cần dán Apps Script (chỉ thay 3 tệp trên GitHub)', 'Hướng chữ H lấy từ điểm tim (1) và điểm hướng (b) trang KP của sổ hồ sơ cọc — chưa nạp tọa độ thì H nằm ngang'],
   thu:[[1,'Dự án mẫu: cọc có KP hiện H, đã hạ đặc / chưa hạ rỗng, xoay đúng góc; chip Kingpost làm mờ cọc không có KP']] },
 { v:'5.41.0', d:'11/10/2026', type:'up', title:'Thi công: bản vẽ mặt bằng ngay ở Tổng quan · chỗ đang làm tỏa sóng',
   who:'Mọi người dùng app Thi công',
   sum:['Tổng quan: bản vẽ mặt bằng đầy đủ nằm ngay dưới nút Ghi nhật ký thi công (phóng to / kéo / chạm cọc như tab Mặt bằng)',
        'Cọc, panel đang thi công nhấp nháy và tỏa 3 vòng sóng (cọc: vòng tròn · panel: theo viền panel) — cả ở Tổng quan và tab Mặt bằng',
        'Phóng to thì hiện mã cọc / panel; nút ⌖ về xem toàn bộ'],
   txt:['Không cần dán Apps Script (chỉ cần thay 3 tệp trên GitHub)'],
   thu:[[1,'Tổng quan dự án mẫu TTHC: bản vẽ hiện, cọc đang làm nhấp nháy + tỏa sóng, chạm cọc hiện thẻ Tiếp tục'],[1,'Tab Mặt bằng: bộ lọc vẫn làm mờ đúng, sóng chỉ ở cấu kiện đang làm']] },
 { v:'5.40.0', d:'11/10/2026', type:'new', title:'Kho: mượn / cho mượn ngoài công trình · liên kết 2 dự án · bỏ thông tin mượn',
   who:'Thủ kho, CHT / CHP, P.QLTB',
   sum:['Cho mượn / mượn chọn đối tượng: 👷 Tổ đội trong CT · 🏢 Dự án FECON khác · 🏭 Đơn vị ngoài; hạn trả không bắt buộc (chọn nhanh +7 / +15 / +30)',
        'Dự án FECON khác: liên kết 2 đầu — dự án bên kia thấy thẻ ở Tổng quan (Hàng mượn đến / Hàng trả về / Báo đã mượn) và bấm xác nhận, 2 bên khớp số',
        'Nút 🏷 Bỏ thông tin mượn (chọn số lượng, lý do, ghi chú): thủ kho đề xuất → CHT / CHP / P.QLTB duyệt; không tạo phiếu mới, tồn không đổi'],
   txt:['Phải dán lại tệp Apps Script chính (bảng MuonTra thêm 3 cột, quyền mới k_bomuon)', 'Tank, cont ở công trường cho mượn được ngay (app tự ghi về kho)', 'Đồ cho mượn hết không còn "Hết hàng" mà hiện "🔁 Cho mượn n"; đồ đi mượn hiện "🤝 Đồ mượn"'],
   thu:[[1,'TTHC cho Nhơn Trạch mượn 2 tank từ công trường → Nhơn Trạch nhận → trả 1 → bỏ thông tin mượn 1 (CHT duyệt) → 2 dự án khớp số']],
   todo:'Dán lại apps_script_fecon_v5_40_0.gs (tệp chính) → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub.' },
 { v:'5.39.0', d:'11/10/2026', type:'new', title:'Thi công: phiếu Hạ kingpost',
   who:'Kỹ sư hiện trường, QA/QC',
   sum:['Phiếu mới "Hạ kingpost" 4 bước: Thông tin (tự điền loại, tiết diện, chiều dài, cao độ) → Hạ (giờ, khung hạ, cẩu) → Đo kiểm (tim + điểm hướng, góc xoay, cao độ đỉnh) → Ảnh & gửi Hold',
        'Cọc có kingpost: hình tiến độ thêm bước "Hạ kingpost" sau Đổ bê tông; ITP thêm điểm Hold lắp đặt kingpost; biên bản 011 tự điền tọa độ, sai số',
        'Nạp sổ hồ sơ: lấy thêm tọa độ thiết kế điểm tim (1) và điểm hướng (b) từ trang KP'],
   txt:['Chỉ đổi app', 'Dung sai kingpost khai ở Quản trị → Cấu hình (để trống: chỉ ghi số, không kết luận — ITP-0001-C không ghi số dung sai)'],
   thu:[[1,'Cọc có KP: lệch tim, góc xoay, sai số cao độ tính đúng; biên bản 011 có số']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub. Nạp lại sổ hồ sơ cọc (Thêm / cập nhật theo mã) để có tọa độ kingpost. Không phải dán Apps Script.' },
 { v:'5.38.0', d:'11/10/2026', type:'up', title:'Thi công: QA/QC duyệt ngay trên thẻ · Xe bê tông từng bước · nhắc thông minh',
   who:'QA/QC, kỹ sư hiện trường, người lập kế hoạch',
   sum:['Việc → "Chờ bạn duyệt": mỗi phiếu là 1 thẻ có tóm tắt số đo (đoạn lồng, đỉnh thép, tổ hợp ống, checklist, số ảnh) và nút ↩ Trả về / ✓ Xác nhận (Giải phóng Hold) ngay trên thẻ',
        'Xe bê tông 3 bước: Phiếu giao → Kiểm tra → Nhận & phân bổ; thêm "Cách xe trước" (báo khi chờ quá 60 phút)',
        'Đăng ký bê tông: giờ xe cuối dự kiến · Quan trắc: so với lần đo trước cùng điểm · Kế hoạch: báo máy đã có việc trong ngày'],
   txt:['Chỉ đổi app'], thu:[[1,'QA duyệt trên thẻ → phiếu chuyển Đã xác nhận'], [1,'Xe đến sau xe trước 90 phút → cảnh báo'], [1,'Quan trắc I-03: 18,4 → 19,2 hiện +0,8']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub. Không phải dán Apps Script (dán lại chỉ để hiện nhật ký phiên bản).' },
 { v:'5.37.0', d:'11/10/2026', type:'up', title:'Thi công: Định vị, Khoan, Trước đổ, Đổ bê tông từng bước · nút Tiếp tục đúng bước',
   who:'Kỹ sư hiện trường, QA/QC',
   sum:['Định vị (3 bước), Khoan (3), Trước đổ (4), Đổ bê tông (4) theo kiểu từng bước như Lồng thép — đủ các ô cũ, chỉ sắp lại',
        'Hồ sơ cấu kiện và Mặt bằng: nút "▶ Tiếp tục" mở đúng bước đang làm (sửa lỗi đang đổ BT mà nút vẫn mở Định vị)',
        'Mặt bằng: chạm cọc → thẻ có nút Tiếp tục; từ Hồ sơ bấm Mặt bằng → phóng tới cọc, vòng cam nhấp nháy'],
   txt:['Chỉ đổi app', 'Đổ BT: nút "✓ Đã tháo n ống" ghi gián đoạn và lần đo sau tự điền số ống còn', 'Khoan: nhắc khi số đo nhỏ hơn lần trước hoặc tăng > 15 m', 'Trước đổ, Định vị: thêm checklist + ảnh ở bước cuối'],
   thu:[[1,'Mở từng phiếu → vào thẳng bước chưa xong'], [1,'Cọc đang đổ: Hồ sơ hiện "Tiếp tục: Đổ bê tông"'], [1,'Bấm Đã tháo 2 ống → lần đo sau tự điền ống còn']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub. Không phải dán Apps Script (dán lại chỉ để hiện nhật ký phiên bản).' },
 { v:'5.36.0', d:'11/10/2026', type:'up', title:'Thi công: phiếu Lồng thép từng bước · Tổng quan "Làm tiếp"',
   who:'Kỹ sư hiện trường, QA/QC',
   sum:['Phiếu Lồng thép chia 4 bước: Đoạn lồng → Treo lồng → Đo lại → Ảnh & gửi; mỗi màn chỉ vài ô số đo, nút Tiếp lớn ở dưới',
        'Bỏ phần tính đoạn nối khỏi phiếu — chuyển sang menu ☰ › Công cụ tính (tham khảo, không lưu hồ sơ)',
        'Tổng quan: thẻ Làm tiếp cho từng cấu kiện đang làm, bấm là mở đúng bước đang dở'],
   txt:['Chỉ đổi app', 'Thêm ô Đoạn nối thực tế (đã hàn) và Lệch tim lồng; râu ghi rõ đo thẳng đứng', 'Phiếu đã gửi / đã xác nhận vẫn hiện đủ mọi mục trên 1 màn để QA/QC xem'],
   thu:[[1,'Mở Lồng thép cọc mới → bước 1, hạ đủ đoạn → mở lại vào thẳng bước 2'], [1,'Bước 4 có checklist + ảnh + Gửi kiểm tra Hold'], [1,'Công cụ tính lấy số đo từ phiếu, ra đoạn nối / phiếu cắt']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub. Không phải dán Apps Script (dán lại chỉ để hiện nhật ký phiên bản).' },
 { v:'5.35.1', d:'10/10/2026', type:'fix', title:'Kho: tank, cont… không còn hiện "Hết hàng"',
   who:'Thủ kho',
   sum:['Thiết bị / vật tư phụ trợ có tổng = 0 ghi rõ lý do: 🚚 Đã ra khỏi CT (kèm nơi đi + ngày), ⏳ Chờ xác nhận ở CT (app tính còn ở công trường), Chưa có phiếu (mới có tên)',
        'Vật tư tiêu hao vẫn dùng Đủ hàng / Sắp hết / Hết hàng như cũ'],
   txt:['Chỉ đổi app'], thu:[[1,'Tank giải động về Kho Đồng Nai → "Đã ra khỏi CT · Về Kho FECON Đồng Nai"; cont xuất kiểu cũ → "Chờ xác nhận ở CT"; món mới có tên → "Chưa có phiếu"']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub. Không phải dán Apps Script (dán lại chỉ để hiện nhật ký phiên bản).' },
 { v:'5.35.0', d:'10/10/2026', type:'up', title:'Kho: tank, cont… xuất ra công trường vẫn ghi nhận, không còn báo "Hết hàng"',
   who:'Thủ kho, P/TP.QLTB, CHT/CHP, Admin',
   sum:['Mỗi vật tư có 2 số: Trong kho + Ở công trường; tổng là số đang ghi nhận tại dự án. Thiết bị / vật tư phụ trợ tự theo dõi, món khác bật "Theo dõi ở công trường" trong mục Vật tư',
        'Phiếu xuất: 🏗 Ra công trường (vẫn ghi nhận) · 🚚 Ra khỏi công trình (trả bên cho thuê / NCC, chuyển dự án, về Kho FECON Đồng Nai, hư hỏng / thanh lý, khác — chọn lấy từ kho hay công trường) · Xuất dùng (vật tư tiêu hao)',
        'Phiếu nhập: 📥 Từ ngoài vào · ↩ Công trường về kho. Nhập thẳng ra công trường món phụ trợ → ghi vào Ở công trường',
        'Menu → Ở công trường: app tính sẵn số tank, cont… đã xuất trước đây, thủ kho xem và bấm xác nhận; sửa số khi kiểm đếm',
        'Giải động gộp vào nút Ra khỏi công trình; phiếu theo phiếu yêu cầu của món phụ trợ cũng ghi ra công trường'],
   txt:['Trang tính TonKho thêm cột "Ở công trường", "Theo dõi ở công trường"; GiaoDich thêm cột "Kiểu" (máy chủ tự tạo)'],
   thu:[[1,'Nhập thẳng CT 2 tank → Kho 0 · Ở CT 2; trả 1 tank từ công trường; 1 tank về kho; ra công trường lại; xi măng xuất dùng như cũ; xác nhận cont cũ = 3; sửa/xóa phiếu tính đúng cả 2 số']],
   todo:'Admin: dán lại tệp Apps Script chính → Triển khai → Phiên bản mới TRƯỚC, rồi thay index.html, sw.js, thicong.html trên GitHub. Thủ kho: Menu → Ở công trường → xác nhận số đề xuất.' },
 { v:'5.34.0', d:'10/10/2026', type:'up', title:'Thi công: hình cọc tự vẽ theo tiến độ + tính treo lồng, ống đổ, đổ bê tông',
   who:'Kỹ sư hiện trường, QA/QC, CHT/CHP, Admin Thi công',
   sum:['Hồ sơ cấu kiện → Hiện trạng: hình cọc / panel tự vẽ theo số đo, 10 bước, phần đã làm tô cam, phần đang làm nhấp nháy; chạm bước xem ô phóng to và mở form 1 chạm',
        'Lồng thép: đoạn lồng tự điền theo bản vẽ, bấm "Hạ ✓"; nhập đỉnh móc + râu thực tế → đoạn nối râu, phiếu cắt thép, checklist có ảnh, đo lại sau treo báo xanh/đỏ',
        'Kiểm tra trước đổ: nhập đáy + ống nhô → app chọn tổ hợp ống 3,15 m + ống lẻ, đầu ống cách đáy 0,30–0,50 m',
        'Đổ bê tông: nhập thước dây + số ống còn lắp → độ ngập h, số ống tháo được, m³ còn cần, số xe gọi thêm',
        'Quản trị → Loại TK: thông số lồng / râu / ống vách / lớp đất theo loại cọc (PBP có sẵn theo bản vẽ); Cấu hình: số mặc định mới (ngập gợi ý 2,0 m, ống 3,15 m, hàn 10d, đổ dư 1,0 m, xe 7 m³)'],
   txt:['Máy chủ Thi công không đổi'], thu:[[1,'Nạp 7 cọc PBP (Thêm), ghi PBP.4: móc 3,55, sin 3,25, râu 2,2 → nối 0,50 m; đáy 68,85 m, ống nhô 0,25 → 21 × 3,15 + 1,5 + 1,0']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub. Dán lại tệp Apps Script chính chỉ để hiện nhật ký phiên bản (không bắt buộc).' },
 { v:'5.33.2', d:'09/10/2026', type:'up', title:'Gợi ý sẵn thiết bị & vật tư phụ trợ (không cần tải BM05)',
   who:'Thủ kho',
   sum:['Phiếu nhập và phiếu xuất luôn gợi ý ~110 tên thiết bị / vật tư phụ trợ (ống vách, gàu, bơm, tole, cừ, cont, dây điện…) kèm đơn vị',
        'Phiếu xuất: chọn món phụ trợ chưa ghi kho → cứ nhập số lượng và xuất, app tự ghi tồn đầu phần còn thiếu',
        'Phiếu nhập: chọn tên phụ trợ → app tự chọn nhóm và đơn vị'],
   txt:['Chỉ đổi app'], thu:[[1,'Chưa tải BM05: xuất gõ "si" ra Silo chứa bent, xuất 2 cái; nhập gõ "tole 20" ra Tole lót']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub.' },
 { v:'5.33.1', d:'09/10/2026', type:'fix', title:'Phiếu xuất gợi ý tên như phiếu nhập',
   who:'Thủ kho',
   sum:['Gõ vài chữ (không dấu, không cần đúng thứ tự) là hiện: Danh sách giải động · Trong kho dự án · Máy móc đang ở công trình; không còn lọc theo nhóm vật tư',
        'Mục giải động chưa có trong kho vẫn hiện; chọn là app tự thêm vào kho (tồn đầu) và mở sẵn chế độ Giải động'],
   txt:['Chỉ đổi app'], thu:[[1,'Gõ "si" → Silo chứa bent; "bom chim" → 4 loại bơm chìm']],
   todo:'Thay index.html, sw.js, thicong.html trên GitHub (Apps Script giữ như 5.33.0).' },
 { v:'5.33.0', d:'09/10/2026', type:'up', title:'Kho: mọi thao tác máy, thiết bị, vật tư chỉ qua 2 ô Nhập và Xuất',
   who:'Thủ kho, P/TP.QLTB, CHT/CHP',
   sum:['Phiếu xuất: chọn tên → Xuất dùng / Cho mượn / Trả đồ đi mượn / Giải động; gõ tên máy → Máy rời công trình (kèm hướng giải động, số đồng hồ) hoặc Cho mượn máy',
        'Phiếu nhập: Nhập kho / Đi mượn / Nhận trả (gõ tên hoặc người mượn là hiện phiếu đang cho mượn); tự vào danh sách Mượn/trả',
        'Màn Mượn/trả chỉ để theo dõi (bỏ nút + Lập phiếu)',
        'Nhắc giải động qua Telegram mỗi sáng; xuất Excel mẫu BM05 có ngày giải động thực tế và hướng'],
   txt:['Apps Script: GIU_AM gọi nhắc giải động (cần trình kích hoạt giữ ấm đang bật)'], thu:[[1,'Cho mượn → nhận trả, đi mượn → trả lại, máy rời công trình về Kho FECON Đồng Nai, xuất BM05']],
   todo:'Admin: dán lại 2 tệp Apps Script → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub.' },
 { v:'5.32.0', d:'09/10/2026', type:'up', title:'Kho: Giải động máy, thiết bị, vật tư phụ trợ cuối dự án',
   who:'Thủ kho, P/TP.QLTB, CHT/CHP, Admin',
   sum:['Menu → Giải động: tải file BM05 (Danh sách tổng hợp HĐ-GĐ), app tự chia Máy cơ sở / Thiết bị phụ trợ / Vật tư phụ trợ và ghi tồn đầu',
        'Phiếu xuất: gõ tên có trong danh sách → chọn Xuất giải động: Trả bên cho thuê / Chuyển dự án khác / Về Kho FECON Đồng Nai; danh sách tự tích',
        'Công trình nhận: ô Nhập hiện "Hàng giải động chuyển đến", lịch sử nhập ghi "Giải động từ công trình …"',
        'Cảnh báo ở Tổng quan khi mục giải động quá hạn hoặc còn ≤ 3 ngày mà chưa xuất'],
   txt:['Trang tính mới GiaiDong (máy chủ tự tạo)'], thu:[[1,'Tải file BM05 TTHC (61 mục), xuất gàu sang Nhà hát, nhập ở Nhà hát, máy về Kho FECON Đồng Nai']],
   todo:'Admin: dán lại thicong.gs và tệp Apps Script chính → Triển khai → Phiên bản mới; thêm dự án "Kho FECON Đồng Nai" và giao cho thủ kho kho bãi; thay index.html, sw.js, thicong.html trên GitHub.' },
 { v:'5.31.11', d:'09/10/2026', type:'up', title:'Thi công: thêm Hướng dẫn sử dụng',
   who:'Mọi người dùng Thi công',
   sum:['Menu Thi công có mục Hướng dẫn sử dụng: 18 bài theo vai trò, có ô tìm kiếm, từng bước kèm ảnh chụp màn hình','Nút ? góc trên mỗi màn hình mở đúng bài hướng dẫn của màn hình đó'],
   txt:['Chỉ thêm nội dung hướng dẫn và ảnh'], thu:[[1,'Mở từng bài, nút ? trên mặt bằng, hồ sơ cọc, form khoan, biên bản, quản trị']],
   todo:'Admin: thay index.html, sw.js, thicong.html, tải thêm ảnh tc_*.webp vào thư mục huongdan trên GitHub, và dán lại Apps Script (chỉ đổi nhật ký phiên bản).' },
 { v:'5.31.10', d:'09/10/2026', type:'up', title:'Thi công trên máy tính: hiện đầy đủ màn hình',
   who:'Người dùng Thi công trên máy tính',
   sum:['Mở Thi công trên trình duyệt máy tính: dùng hết chiều ngang như Kho (nội dung giữa màn hình, rộng tối đa 1.280 px)','Tổng quan 4 ô một hàng, mặt bằng lớn hơn; điện thoại giữ nguyên'],
   txt:['Chỉ đổi giao diện'], thu:[[1,'Xem trên màn hình 1.600 px và khung điện thoại 390 px']],
   todo:'Admin: thay index.html, sw.js, thicong.html trên GitHub (Apps Script không đổi).' },
 { v:'5.31.9', d:'09/10/2026', type:'up', title:'Giao diện: bộ biểu tượng mới đồng bộ màu FECON thay cho emoji',
   who:'Mọi người dùng',
   sum:['Toàn bộ biểu tượng trong Kho và Thi công đổi sang bộ nét hai tông màu cam FECON — mọi điện thoại, máy tính hiện giống nhau','Menu bên: biểu tượng trong ô nền cam nhạt; nút chuyển Kho / Thi công biểu tượng trắng'],
   txt:['Biểu tượng nhúng sẵn trong app (không cần mạng)','Bộ biểu tượng Phosphor Icons, giấy phép MIT'],
   thu:[[1,'Xem các màn chính Kho và Thi công trên khung điện thoại'],[0,'Chưa xem trên iPhone / Android thật']],
   todo:'Admin: thay index.html, sw.js, thicong.html trên GitHub (Apps Script không đổi).' },
 { v:'5.31.8', d:'09/10/2026', type:'up', title:'Giao diện: tên app FECON, chữ to hơn 10%, nút chuyển Kho / Thi công nổi bật',
   who:'Mọi người dùng',
   sum:['Tên app trên màn hình điện thoại: FECON · câu giới thiệu: SmartSite · Quản lý thi công & vật tư','Chữ trong app to hơn khoảng 10% cho dễ đọc','Menu: nút "Chuyển sang Kho / Chuyển sang Thi công" nền cam chữ trắng; cuối menu chỉ ghi "Phiên bản …"','Bỏ các dòng chú thích không cần thiết (màn chọn phần làm việc, hướng dẫn trong màn hình)'],
   txt:['Chỉ đổi giao diện, không đổi dữ liệu'],
   thu:[[1,'Xem trên khung điện thoại 390 px và máy tính: không vỡ bố cục'],[0,'Chưa xem trên iPhone / Android thật']],
   todo:'Admin: thay index.html, sw.js, thicong.html, manifest.json trên GitHub (Apps Script không đổi). Tên mới trên màn hình điện thoại: xóa biểu tượng cũ rồi Thêm vào màn hình chính lại.' },
 { v:'5.31.7', d:'08/10/2026', type:'new', title:'Thi công 1.4: Admin phân quyền Thi công và giao dự án ngay trong Thi công',
   who:'Admin',
   sum:['Thi công → ☰ → Quản trị Thi công → tab "Phân quyền": bảng chức danh × 7 quyền Thi công (Xem, Ghi, QA, CHT, KH, QS, QT), chạm ô để bật / tắt rồi Lưu',
        'Danh sách người dùng: thấy ngay ai vào được Thi công, quyền gì, được giao dự án nào; chạm để giao dự án',
        'Dùng chung bảng chức danh với Kho — sửa ở Thi công hay ở Kho đều như nhau; lưu quyền Thi công không làm đổi quyền Kho'],
   txt:['Máy chủ Thi công 1.4.0: thêm lệnh tcRoles (chỉ Admin)'],
   thu:[[1,'Bật / tắt quyền Thi công cho chức danh, quyền Kho giữ nguyên; giao dự án cho người dùng'],[0,'Chưa thử trên máy chủ Google thật']],
   todo:'Admin: thay tệp thicong trong Apps Script → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub.' },
 { v:'5.31.6', d:'08/10/2026', type:'up', title:'Giao diện: menu Thi công giống Kho · màn chọn phần làm việc dùng nền đăng nhập',
   who:'Mọi người dùng',
   sum:['☰ Menu Thi công cùng kiểu với Kho: đầu menu nền trắng có logo, ô "Thi công đang xem" để đổi dự án ngay trong menu','Màn "Chọn phần làm việc" (Kho / Thi công) dùng ảnh nền giống màn đăng nhập'],
   txt:['Chỉ đổi giao diện, không đổi dữ liệu'],
   thu:[[1,'Xem trên khung điện thoại và máy tính'],[0,'Chưa xem trên iPhone thật']],
   todo:'Admin: thay index.html, sw.js, thicong.html trên GitHub (Apps Script không đổi). Người dùng: bấm Cập nhật.' },
 { v:'5.31.5', d:'08/10/2026', type:'bug', title:'Thi công 1.3.1: sửa kẹt "Đang tải dữ liệu thi công…" khi đổi dự án',
   who:'Người dùng Thi công có từ 2 dự án trở lên',
   bugs:[{ t:'Đổi dự án lúc app đang đồng bộ thì bị kẹt, không thao tác được',
     loi:'Kết quả đồng bộ của dự án cũ về sau khi đã đổi dự án → app tự nhảy về dự án cũ nhưng mất danh sách cọc, đứng ở "Đang tải dữ liệu thi công…"',
     sua:'Đổi dự án chờ lần đồng bộ đang chạy xong; bỏ kết quả của dự án cũ; thiếu danh sách cọc thì tự xin lại đủ',
     thu:[[1,'Máy chủ chậm như Google, đổi dự án lúc đang đồng bộ: đúng dự án, không kẹt'],[1,'Đổi qua lại nhanh 4 lần: dừng đúng dự án cuối, đủ cọc'],[1,'Bản cũ 5.31.4 chạy cùng bài thử: kẹt (đúng lỗi bạn gặp)']] }],
   sum:['Đổi dự án lúc đang đồng bộ không còn bị kẹt','Dự án chưa có cọc: có nút "Chuyển sang dự án …" để quay lại ngay','Không cho nạp dữ liệu mẫu TTHC vào dự án làm thật (Nhà hát)'],
   txt:['Máy chủ Thi công 1.3.1: chặn nạp dữ liệu mẫu vào dự án khác TTHC'],
   todo:'Admin: thay tệp thicong trong Apps Script → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub. Người dùng: Thi công → thẻ "Có phiên bản mới" → Cập nhật ngay.' },
 { v:'5.31.4', d:'08/10/2026', type:'up', title:'Thi công 1.3: cập nhật phiên bản ngay trong Thi công · chạm cọc hiện mặt cắt tức thì',
   who:'Mọi người dùng Thi công',
   sum:['Thi công có thẻ "Có phiên bản mới" ở Tổng quan và mục ☰ → Cập nhật phiên bản: bấm Cập nhật ngay, không phải sang Kho (người chỉ có quyền Thi công trước đây không cập nhật được)',
        'App tải nền toàn bộ bản ghi của dự án 1 lần và lưu trong máy: chạm cọc / panel hiện mặt cắt + hiện trạng ngay, không chờ máy chủ (trước ~2–3 giây mỗi lần chạm)',
        'Mở hồ sơ cấu kiện và bộ biên bản cũng hiện ngay, phần ảnh tải thêm sau'],
   txt:['Máy chủ Thi công 1.3.0: thêm lệnh tcAll (tải toàn bộ bản ghi dự án)','Bản ghi lưu trong máy được làm mới khi có thay đổi và đã quá 10 phút; đăng xuất thì xóa'],
   thu:[[1,'Đo trên máy giả lập (CPU chậm 4×, máy chủ trễ như Google): chạm cọc từ ~2,7 giây còn dưới 0,3 giây'],[1,'Cập nhật từ 5.31.3 lên 5.31.4 ngay trong Thi công'],[0,'Chưa đo trên Google Apps Script và điện thoại thật']],
   todo:'Admin: thay tệp thicong trong Apps Script → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub.' },
 { v:'5.31.3', d:'08/10/2026', type:'fix', title:'Thi công 1.2.1: bấm cọc / panel hiện ngay thẻ mặt cắt + hiện trạng nổi trên mặt bằng',
   who:'Mọi người dùng Thi công',
   sum:['Trước: thẻ thông tin hiện ở dưới mặt bằng, trên điện thoại phải cuộn xuống mới thấy nên tưởng không hiện','Nay: chạm cọc / panel → thẻ nổi lên ngay phía trên thanh menu dưới, có mặt cắt đứng + bảng hiện trạng, nút ✕ Đóng / Hồ sơ ›'],
   txt:['Chỉ thay 3 file trên GitHub, không cần sửa Apps Script'],
   thu:[[1,'Thử trên màn hình điện thoại 390 px: chạm P1.1, P110 hiện thẻ ngay'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Admin: thay index.html, sw.js, thicong.html trên GitHub (Apps Script không đổi).' },
 { v:'5.31.2', d:'08/10/2026', type:'up', title:'Thi công 1.2: theo ITP đã duyệt · bộ biên bản cọc 13 biểu / tường vây 12 biểu (in PDF, Excel)',
   who:'Kỹ sư, QA/QC, CHT Thi công',
   sum:['Ngưỡng kiểm tra và thông tin dự án theo ITP-0001-C, ITP-0003-A (TVGS SunPMC, bản vẽ SHO-0002-A / 0003 / 0004-A); dung dịch: xanh = đạt ITP, vàng = chỉ đạt biểu mẫu, đỏ = vượt',
        'Mỗi điểm H/W/R ghi rõ vai từng bên (NTP / NTC / TVGS)',
        'Hồ sơ cấu kiện → "Bộ biên bản theo ITP": tự điền số liệu vào đúng mẫu đã duyệt, in / lưu PDF hoặc tải Excel; Báo cáo ngày in được cả bộ cho các cấu kiện đổ trong ngày'],
   txt:['Quản trị Thi công → Cấu hình → "Áp dụng thông tin & ngưỡng theo ITP" (làm 1 lần cho dự án TTHC)','Máy chủ Thi công 1.2.0 (tệp thicong.gs)'],
   thu:[[1,'Xuất thử bộ biên bản cọc P1.1 và panel P110 từ số liệu sổ hồ sơ'],[0,'Chưa thử in trên iPhone / Android thật']],
   todo:'Admin: thay tệp thicong trong Apps Script → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub; Quản trị Thi công → Cấu hình → Áp dụng theo ITP.' },
 { v:'5.31.1', d:'08/10/2026', type:'up', title:'Thi công 1.1: nạp sổ hồ sơ Excel · bấm cọc / panel hiện mặt cắt + hiện trạng',
   who:'Admin (nạp sổ), mọi người dùng Thi công',
   sum:['Quản trị Thi công → Cấu kiện → "Nạp sổ hồ sơ thi công": đọc sổ cọc khoan nhồi + sổ tường vây (mẫu FECON), nạp tọa độ thật và số liệu từng công đoạn, từng xe bê tông',
        'Bấm vào cọc / panel trên mặt bằng: hiện ngay mặt cắt đứng của cấu kiện (đáy thiết kế / thực tế, bê tông, kingpost, gioăng) và bảng hiện trạng',
        'Hồ sơ cấu kiện có thêm tab "Hiện trạng"; panel tường vây vẽ đúng hình theo tọa độ góc tấm'],
   txt:['Nạp lại sổ lần sau chỉ cập nhật, không nhân đôi; bản ghi đã sửa trong app được giữ nguyên','Máy chủ Thi công 1.1.0 (tệp thicong.gs)'],
   thu:[[1,'Nạp thử 2 sổ TTHC: 366 cọc + 12 cọc T + 118 panel, 7.663 bản ghi; nạp lại không trùng'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Admin: thay tệp thicong trong Apps Script → Phiên bản mới; thay index.html, sw.js, thicong.html trên GitHub; nạp 2 sổ hồ sơ.' },
 { v:'5.31.0', d:'08/10/2026', type:'new', title:'Thêm phần Thi công · chọn Kho / Thi công sau đăng nhập',
   who:'Mọi người được cấp quyền Thi công (kỹ sư, QA/QC, chỉ huy), Admin',
   sum:['Đăng nhập xong chọn 📦 Kho hoặc 🏗️ Thi công (chỉ hiện phần được cấp quyền). Menu có "Chuyển sang Thi công", không phải đăng nhập lại',
        'Thi công: mặt bằng cọc / panel theo màu trạng thái, mặt cắt, hồ sơ từng cấu kiện, nhật ký khoan, dung dịch, lồng thép, xe bê tông, tremie, nghiệm thu, báo cáo ngày',
        'Bảng phân quyền chức danh có thêm mục ⑦ Thi công (7 quyền)'],
   txt:['Thủ kho mặc định không có quyền Thi công → vào Kho như cũ, không thấy gì thay đổi',
        'Admin sửa quyền Thi công ở Menu → Phân quyền chức danh → mục ⑦ Thi công',
        'Máy chủ 5.23.0 + tệp thicong.gs (máy chủ TC 1.0.0) trong cùng dự án Apps Script; dữ liệu Thi công nằm ở các trang TC_ trong cùng file Google Sheet'],
   thu:[[1,'Thử máy chủ Thi công 31/31; giao diện Thi công 43/43 trên máy giả lập (kỹ sư, QA/QC, CHT, thủ kho, Admin; mất mạng; Excel)'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Admin: dán Apps Script mới + thêm tệp thicong rồi triển khai Phiên bản mới; thay index.html, sw.js và thêm thicong.html trên GitHub.' },
 { v:'5.30.0', d:'07/10/2026', type:'new', title:'Nhập thẳng ra công trường · gợi ý đủ tên vật tư',
   who:'Thủ kho (phiếu nhập), Admin (tên vật tư gợi ý thêm, sửa / xóa phiếu)',
   sum:['Phiếu nhập có 2 ô 📦 Vào kho / 🏗 Thẳng ra công trường, thủ kho tự chọn (không chọn sẵn). Chọn 🏗 → app ghi 1 phiếu nhập + 1 phiếu xuất cùng lúc, tồn kho không đổi',
        'Bấm vào ô Tên vật tư là thấy tất cả tên: trong kho dự án, tên Admin nạp thêm, danh mục P.QLTB; gõ không dấu để lọc',
        'Không phải lập 2 phiếu, không còn tồn ảo khi quên phiếu xuất'],
   txt:['Hai ô 📦 / 🏗 có ở mọi phiếu nhập vật tư của chức danh có quyền "Nhập thẳng ra công trường" (mặc định chỉ Thủ kho). Chưa chọn ô thì app nhắc, không lưu',
        'Chọn 🏗: thêm ô "Giao cho" (không bắt buộc), nút lưu màu cam. Lưu xong có 2 phiếu cùng giờ, cùng số lượng, nhãn "🏗 Thẳng CT"; mở phiếu thấy "Phiếu đi cặp". Chọn máy (Máy vào công trường) thì không có 2 ô này',
        'Ô Tên vật tư: bấm vào là hiện 3 nhóm 📦 Trong kho dự án · ⭐ Tên gợi ý thêm · 📚 Danh mục P.QLTB, mỗi nhóm có "Xem thêm"; tên đã có trong kho không lặp lại',
        'Menu (Admin) → ⭐ Tên vật tư gợi ý thêm: có sẵn Thép, Bentonite, Xi măng, Cát, Đá 40x40, Cừ Larsen, Cừ tràm, Cừ tường vây, Ống siêu âm; thêm / bớt, dùng chung mọi kho',
        'Lịch sử nhập / xuất có ô lọc "🏗 Thẳng CT". Gửi Zalo: 1 tin ghi cả nhà cung cấp và người nhận. Excel Chi tiết phiếu thêm cột "Thẳng CT"',
        'Phiếu thẳng không tạo phiếu điều chỉnh riêng. Admin sửa (vật tư, số lượng, ngày giờ) hoặc xóa 1 phiếu thì phiếu đi cặp đổi / xóa theo',
        'Máy chủ 5.22.0: trang GiaoDich thêm cột "Thẳng CT (số phiếu đi cặp)"; phiếu cũ để trống, không đổi gì. App cũ vẫn chạy bình thường'],
   thu:[[1,'Thử trên máy giả lập theo thao tác thật của thủ kho (34/34): bấm vào ô tên → thấy đủ 3 nhóm, Xem thêm, gõ "cu" ra Cừ tràm / Cừ tường vây CWS / Cọc cừ Larsen; chọn tên gợi ý thêm → tạo vật tư mới đúng nhóm; chưa chọn ô → nhắc, không lưu; dầu chọn 🏗 được; lưu 🏗 → cặp nhập + xuất, tồn không đổi; lịch sử, ô lọc, mở phiếu, Gửi Zalo, Excel; mất mạng vẫn lưu cặp, có mạng tự gửi không trùng; CM không thấy 2 ô; Admin thêm / bớt / chặn trùng tên; sửa cả cặp, xóa cả cặp'],
        [1,'Thử máy chủ (34/34): nâng từ 5.21.2 giữ phiếu cũ; quyền mặc định chỉ Thủ kho; gửi lại lần 2 không ghi thêm; chặn phiếu điều chỉnh riêng 1 phiếu của cặp; sửa từ app cũ cặp vẫn khớp; Admin ghi lùi giờ cả cặp; nhật ký sửa / xóa theo'],
        [1,'Chạy lại bộ thử các bản trước trên máy chủ mới; app cũ 5.29.3 chạy với máy chủ mới; cập nhật 5.29.3 → 5.30.0'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Admin: triển khai Apps Script mới trước (Phiên bản mới), rồi thay index.html + sw.js trên GitHub. Xem lại Menu → ⭐ Tên vật tư gợi ý thêm. Thủ kho: mỗi phiếu nhập chọn 📦 Vào kho hoặc 🏗 Thẳng ra công trường.' },
 { v:'5.29.3', d:'07/10/2026', type:'bug', title:'Sửa phiếu: bấm vào ô Vật tư là có gợi ý',
   who:'Admin (sửa phiếu nhập / xuất / điều chỉnh)',
   sum:['Sửa phiếu: bấm vào ô Vật tư là thấy ngay gợi ý gần giống trong kho và trong danh mục P.QLTB, có % giống',
        'Gõ tìm hiểu tên viết khác: "tole 6m 2m 20mm", "ton 25 ly" đều ra đúng loại; nút ✕ xóa nhanh tên cũ'],
   bugs:[
    { t:'Sửa phiếu nhập không hiện gợi ý tên',
      loi:'Bản 5.29.1 có gợi ý nhưng ô Vật tư đã điền sẵn tên cũ (VD "Tole chống lầy 6M*2M*20MM"), app tìm đúng nguyên cụm chữ đó nên chỉ ra chính vật tư đó; P.QLTB viết khác ("Thép tấm/ Tole 20x2000x6000mm") nên không hiện. Phải xóa tên cũ, gõ lại chữ ngắn mới thấy gợi ý. Lần thử trước chỉ thử kiểu xóa rồi gõ nên không phát hiện.',
      sua:'Bấm vào ô (chưa gõ gì): hiện vật tư đang chọn, 5 vật tư trong kho gần giống nhất và 5 loại P.QLTB gần giống nhất kèm % giống. Gõ tìm: khớp chữ trước, rồi gần giống theo cách so tên của Gắn mã (tole = tôn = thép tấm, 6m = 6000mm, 25 ly = 25mm). Thêm nút ✕ trong ô.',
      thu:[[1,'Thử trên máy giả lập theo đúng thao tác thật (8/8): mở phiếu → bấm vào ô, không xóa → hiện Đang chọn + Thép tấm/ Tole 20x2000x6000mm (67%) + Tôn lót đường 20 ly trong kho; ✕ xóa ô; gõ "tole 6m 2m 20mm", "ton 25 ly" ra đúng; chọn gợi ý P.QLTB rồi lưu → phiếu chuyển sang vật tư mới, tồn 9 / cũ 0; tên lạ không lưu']] }
   ],
   thu:[[1,'Chạy lại bộ thử: máy thuê ngoài 5.29.2 (18/18), gắn mã + sửa phiếu 5.29.1 (11/11), danh mục P.QLTB (25/25), chống bấm 2 lần (15/15), máy chủ, cập nhật 5.29.1 → 5.29.3 (3/3), 5 chức danh không lỗi'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Không cần làm gì thêm. Admin sửa phiếu: bấm vào ô Vật tư để xem gợi ý, hoặc bấm ✕ rồi gõ tên.' },
 { v:'5.29.2', d:'07/10/2026', type:'bug', title:'Máy thuê ngoài theo P.QLTB · gợi ý tên máy chính xác hơn',
   who:'Thủ kho (nhập máy, gắn mã, sửa máy), Admin (nạp danh mục P.QLTB), người xuất Excel đối chiếu',
   sum:['Máy thuê ngoài vẫn thuộc P.QLTB quản lý: app đọc Hình thức sở hữu trong file P.QLTB và gắn nhãn "🏷 Thuê ngắn hạn · Hương Hoa Mai"',
        'Chọn máy thuê ở Phiếu nhập / Thêm máy: app tự chọn Thuê ngoài, điền sẵn đơn vị cho thuê. Máy thuê bắt buộc ghi đơn vị cho thuê',
        'Gắn mã không còn gợi ý nhầm: "BM600" không bị hiểu là cẩu SCC600A, cẩu bánh xích không bị gợi ý thành xe cẩu thùng'],
   bugs:[
    { t:'Gợi ý nhầm máy khi gắn mã P.QLTB',
      loi:'Cẩu bánh xích thuê của Hương Hoa Mai phục vụ BM600 (thủ kho ghi "Xe cẩu phục vụ BM 600") được gợi ý thành cẩu SCC600A của công ty, vì app thấy số 600 trùng nhau; xe cẩu thùng cũng nằm trong gợi ý dù khác loại máy. Bấm "Gắn mã này" là gắn sai tài sản.',
      sua:'Số dính liền chữ (BM600, SCC600A, SR285R…) là số hiệu máy, chỉ khớp khi giống hệt; kích thước (D1000, 6m, 55T…) vẫn so như cũ. Tên có loại máy khác nhau (cẩu bánh xích / xe cẩu thùng / cẩu bánh lốp / cẩu tháp…) thì không gợi ý. Máy cũng chỉ được gợi ý khi giống từ 35% trở lên, giống vật tư. App so cả "Tên gọi công trường" trong file P.QLTB.',
      thu:[[1,'Bộ tên thật (27 tên): "Xe cẩu phục vụ BM 600", "Cẩu phục vụ BM600", "Cẩu bánh xích thuê Hương Hoa Mai" không còn gợi ý cẩu SCC600A hay xe cẩu thùng; cẩu SCC600A-6, cẩu cạp BM900, xe cẩu thùng 51C-709.35, các vật tư tole / gầu / casing… vẫn ra đúng'],[1,'Thử trên máy giả lập với file P.QLTB có thêm cẩu thuê Hương Hoa Mai (tên gọi công trường "Cẩu phục vụ BM600"): máy "Xe cẩu phục vụ BM 600" được gợi ý đúng cẩu thuê, kèm nhãn thuê']] },
    { t:'App không biết máy nào là máy thuê theo P.QLTB',
      loi:'File P.QLTB có cột Hình thức sở hữu (Sở hữu FCS / Thuê dài hạn / Thuê ngắn hạn / Mượn – điều chuyển nội bộ), Nhà cung cấp, Số hợp đồng nhưng app không đọc. Thủ kho tự chọn Công ty / Thuê ngoài, dễ ghi sai; app không có chỗ ghi đơn vị cho thuê.',
      sua:'Nạp danh mục: app đọc thêm 4 cột sở hữu, màn xem trước đếm máy sở hữu FCS / thuê / chưa ghi. Gợi ý, chi tiết máy, Gắn mã hiện nhãn hình thức sở hữu. Máy thuê có ô Đơn vị cho thuê (bắt buộc). Chi tiết máy cảnh báo khi Công ty / Thuê ngoài trong app khác file P.QLTB. Excel "Đối chiếu P.QLTB" thêm cột Đơn vị cho thuê và Hình thức sở hữu (P.QLTB), báo "Lệch hình thức sở hữu" và "Chưa có mã — P.QLTB cần cấp mã".',
      thu:[[1,'Thử trên máy giả lập (18/18 mục): nạp file có 2 máy thuê → đếm đúng 37 / 2 / 94, máy chủ lưu đủ 4 cột; gắn mã cẩu thuê → chi tiết máy cảnh báo lệch (app ghi Công ty); sửa sang Thuê ngoài mà bỏ trống đơn vị → bị nhắc, ghi Hương Hoa Mai → hết cảnh báo; Phiếu nhập chọn máy đào thuê Phú Tài → tự chọn Thuê ngoài + Phú Tài; Thêm máy chọn cẩu thuê → tự điền; Excel có 2 cột mới, dòng cẩu thuê "Khớp danh mục"']] }
   ],
   txt:['Máy chưa có trong file P.QLTB (kể cả máy thuê mới về): vẫn nhập như cũ, chọn "Đã kiểm tra, vẫn nhập". Excel đối chiếu ghi "Chưa có mã — P.QLTB cần cấp mã" để P.QLTB bổ sung; P.QLTB gửi file mới thì Admin nạp lại rồi thủ kho vào Gắn mã',
        'Máy thuê đã có trong app nhưng chưa ghi đơn vị cho thuê: chi tiết máy nhắc, bấm Sửa thiết bị để ghi',
        'Máy chủ 5.21.2: danh mục P.QLTB thêm 4 cột sở hữu, trang Thiết bị thêm cột Đơn vị cho thuê (app cũ không gửi thì giữ nguyên)'],
   thu:[[1,'Chạy lại bộ thử cũ trên 5.29.2: danh mục P.QLTB, máy vào / ra, Excel (25/25); gắn mã, sửa phiếu (11/11); chống bấm 2 lần (15/15); máy chủ mới (11/11: nâng từ 5.21.1 giữ dữ liệu, app cũ sửa máy không mất đơn vị cho thuê) và bộ thử máy chủ cũ; app cũ 5.29.1 chạy với máy chủ mới (11/11, 15/15); cập nhật 5.29.1 → 5.29.2 (3/3); 5 chức danh qua các màn chính không lỗi'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Admin: nạp lại file P.QLTB khi P.QLTB đã ghi cột Hình thức sở hữu / Nhà cung cấp cho máy thuê. Thủ kho: mở từng máy thuê → Sửa thiết bị → chọn Thuê ngoài và ghi đơn vị cho thuê.' },
 { v:'5.29.1', d:'07/10/2026', type:'up', title:'Gắn mã P.QLTB dễ hơn · Sửa phiếu có gợi ý tên',
   who:'Thủ kho (gắn mã, sửa vật tư), Admin (sửa phiếu nhập / xuất)',
   sum:['Gắn mã P.QLTB: so khớp tên tốt hơn (hiểu "tole" = thép tấm, "6M*2M*20MM" = 20x2000x6000mm…), hiện tất cả vật tư chưa gắn',
        'Một nút đánh dấu các vật tư không có gợi ý (dầu, que hàn…) là vật tư tiêu hao',
        'Màn sửa vật tư có dòng Mã P.QLTB và nút Gắn mã',
        'Admin sửa phiếu: ô Vật tư gõ tìm, có gợi ý vật tư trong kho và danh mục P.QLTB'],
   bugs:[
    { t:'Gắn mã không gợi ý được cho tên viết khác P.QLTB',
      loi:'Thủ kho ghi "Tole chống lầy 6M*2M*20MM", P.QLTB ghi "Thép tấm/ Tole 20x2000x6000mm": cách so tên cũ chỉ đếm chữ giống nhau nên không ra gợi ý, vật tư đó còn bị ẩn khỏi danh sách gắn mã. Vật tư không gợi ý được thì không có chỗ nào để gắn tay.',
      sua:'So tên kiểu mới: hiểu từ đồng nghĩa (tole / tôn / thép tấm, casing / ống vách, thùng / tank…) và quy đổi kích thước về mm (6M → 6000, 2M → 2000) rồi so cả chữ lẫn số. Danh sách hiện tất cả vật tư chưa gắn, cái nào không có gợi ý vẫn có nút chọn mã khác. Thêm nút Gắn mã ở màn sửa vật tư.',
      thu:[[1,'Bộ 21 tên thật (tole, gầu, casing, tải, cừ, container, silo, máy): đều ra đúng loại; dầu DO, cóc nối, que hàn không bị gợi ý nhầm (21/21)'],[1,'Thử trên máy giả lập: Tole chống lầy 6M*2M*20MM gợi ý đúng, gắn xong đổi tên theo P.QLTB, tồn 9 giữ nguyên, phiếu cũ vẫn đúng vật tư; gắn mã từ màn sửa vật tư cập nhật ngay']] },
    { t:'Sửa phiếu nhập không có gợi ý tên',
      loi:'Màn Sửa phiếu (Admin) chỉ có danh sách thả xuống rất dài, phải cuộn tìm, không chọn được tên theo P.QLTB.',
      sua:'Ô Vật tư thành ô gõ tìm (gõ không dấu hoặc mã), gợi ý 2 nhóm: vật tư trong kho và danh mục P.QLTB. Chọn loại P.QLTB chưa có trong kho thì app tạo vật tư mới theo P.QLTB và chuyển phiếu sang; tồn của cả 2 vật tư tự tính lại. Gõ tên không có trong gợi ý thì app không lưu, nhắc chọn trong danh sách.',
      thu:[[1,'Thử trên máy giả lập: chuyển phiếu nhập 9 tấm sang loại tole 25mm → tạo vật tư mới, tồn mới 9, tồn cũ 0; đổi lại về vật tư cũ → tồn trả về 9; gõ tên lạ → không lưu']] }
   ],
   txt:['Đánh dấu tiêu hao hàng loạt chỉ áp dụng cho vật tư không có gợi ý nào; app hỏi lại trước khi đánh dấu. Vật tư có gợi ý không bị đụng tới',
        'Không cần đổi máy chủ cho tính năng; máy chủ 5.21.1 chỉ thêm nội dung lịch sử phiên bản này'],
   thu:[[1,'Chạy lại bộ thử cũ trên 5.29.1: danh mục P.QLTB, máy vào / ra, Excel (25/25); chống bấm 2 lần (15/15); máy chủ (33/33, 18/18, 10/10); cập nhật 5.29.0 → 5.29.1 (3/3); 5 chức danh qua các màn chính không lỗi'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Thủ kho: Menu → Gắn mã P.QLTB, gắn các vật tư có gợi ý rồi bấm "Đánh dấu các vật tư còn lại là tiêu hao" nếu đúng là đồ tiêu hao.' },
 { v:'5.29.0', d:'07/10/2026', type:'new', title:'Danh mục chuẩn P.QLTB · máy vào / ra trong lịch sử',
   who:'Thủ kho (nhập kho, thêm máy, gắn mã), Admin (nạp danh mục), người xuất Excel đối chiếu',
   sum:['Phiếu nhập gợi ý tên máy / vật tư phụ trợ theo danh mục P.QLTB (593 tài sản)',
        'Chọn một máy → phiếu thành "Máy vào công trường": máy tự có trong Máy móc & Thiết bị, hiện ở Lịch sử nhập; Kết thúc → hiện ở Lịch sử xuất',
        'Tên ngoài danh mục: app nhắc kiểm tra với P.QLTB; Excel có trang "Đối chiếu P.QLTB"'],
   txt:['Menu (Admin) → Danh mục P.QLTB: chọn file Excel của P.QLTB → xem trước → Lưu. P.QLTB gửi file mới thì nạp lại, không cần cập nhật app',
        'Máy (TBC + TBP) theo từng chiếc, có mã; vật tư phụ trợ (VTP: gầu, tole, ống vách, tải ép cọc, container…) gộp theo loại + quy cách',
        'Ô tên ở Phiếu nhập có 2 nhóm: Vật tư trong kho dự án và Danh mục P.QLTB (gõ không dấu hoặc gõ mã)',
        'Chọn máy: nhập ngày vào + số đồng hồ lúc vào. Máy đang ở dự án thì không hiện, không nhập trùng. Máy đã rời mà quay lại: ghi "Máy vào" lần nữa',
        'Tên không có trong danh mục: chọn "Đã kiểm tra, vẫn nhập" (ghi Ngoài danh mục), "Vật tư tiêu hao" (dầu, que hàn…) hoặc "Sửa lại"',
        'Menu → Gắn mã P.QLTB: gợi ý mã cho máy / vật tư đã nhập trước đây. Vật tư đổi tên theo P.QLTB; máy giữ tên (không lệch lịch sử cấp dầu)',
        'Excel NXT: trang NXT vật tư thêm cột Mã P.QLTB · Tên theo P.QLTB · Ngoài danh mục; thêm trang "Đối chiếu P.QLTB" (máy, vật tư phụ trợ, lịch sử vào / ra)'],
   thu:[[1,'Nạp file thật của P.QLTB (593 dòng): đọc đúng 131 máy + 46 loại vật tư phụ trợ, không dòng lỗi; file không phải Excel, mã trùng, mã sai dạng, file rỗng đều bị từ chối, danh mục đang dùng giữ nguyên'],[1,'Thử trên máy giả lập (25/25 mục): chọn xe cẩu → Máy vào, có trong Máy móc & Thiết bị và Lịch sử nhập, tồn vật tư không đổi; máy đang ở dự án không nhập trùng; Kết thúc → Lịch sử xuất (Máy ra); máy quay lại ghi Máy vào lần 2; chọn vật tư phụ trợ → đúng tên + mã; 3 lựa chọn khi tên ngoài danh mục; gắn mã; Excel có cột và trang mới'],[1,'Máy chủ giả (33/33): app cũ 5.28 sửa vật tư / máy không mất mã, chép vật tư giữ mã, nâng từ 5.20.3 giữ nguyên dữ liệu. Chạy lại bộ thử cũ: chống bấm 2 lần (15/15 trên 5.29.0, 15/15 app cũ 5.28.1 với máy chủ mới), chống ghi trùng (18/18), phân quyền (10/10), cập nhật 5.28.1 → 5.29.0 (3/3), 5 chức danh qua các màn chính không lỗi'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Admin: Menu → Danh mục P.QLTB → nạp file Excel của P.QLTB. Thủ kho: Menu → Gắn mã P.QLTB cho máy / vật tư đã có; từ nay nhập máy ở Phiếu nhập.' },
 { v:'5.28.1', d:'06/10/2026', type:'bug', title:'Sửa lỗi bấm 2 lần ra 2 phiếu',
   who:'Thủ kho (phiếu nhập, phiếu xuất, giao phiếu YC, kiểm kê), người nhận hàng, người lập phiếu yêu cầu',
   sum:['Bấm "Xác nhận" 2 lần khi máy chậm không còn tạo ra 2 phiếu',
        'Nút khóa lại và hiện "Đang lưu…" ngay khi bấm; phiếu nhập/xuất về Tổng quan ngay',
        'Xuất / nhập / giao trùng cùng số lượng trong 2 phút: app hỏi lại trước khi ghi'],
   bugs:[
    { t:'Phiếu xuất / phiếu nhập bị ghi 2 lần',
      loi:'Bấm "Xác nhận" xong, app chờ lưu xong ảnh mới về Tổng quan; trong lúc đó màn phiếu còn nguyên số và nút vẫn bấm được → bấm lần 2 ra thêm 1 phiếu, tồn bị trừ (cộng) 2 lần.',
      sua:'Nút khóa ngay khi bấm ("Đang lưu…"); app về Tổng quan và xóa ô nhập ngay, ảnh lưu ngầm sau. Vừa lập phiếu cùng vật tư, cùng số lượng trong 2 phút thì app hỏi lại.',
      thu:[[1,'Thử trên máy giả lập (điện thoại chậm 10 lần, lưu 1 ảnh mất 1,5 giây): bản cũ bấm lại sau 0,7 giây ra 2 phiếu; bản mới về Tổng quan ngay, bấm đúp nhanh hay bấm lại đều chỉ 1 phiếu (chạy 5 lần đều đạt). Xuất / nhập lại cùng số lượng: hộp hỏi lại hiện đúng, "Không" thì không ghi, "Đúng" thì ghi thêm']] },
    { t:'Giao phiếu yêu cầu bị giao 2 lần',
      loi:'Máy chủ đã giao xong nhưng app còn tải lại dữ liệu vài giây (có khi hơn 20 giây) mà vẫn để ô giao và nút Giao → bấm lại thì giao thêm lần nữa (khi giao một phần mà kho còn hàng). Máy chủ chậm quá 40 giây hoặc Google lỗi tạm, app tự gửi lại cũng có thể giao 2 lần.',
      sua:'Màn "Đang gửi…" che kín tới khi tải lại xong; có kết quả là ẩn ô giao ngay. Mỗi lần bấm có mã riêng, máy chủ gặp lại mã cũ thì không giao lại. Giao lại cùng số lượng trong 2 phút: máy chủ hỏi lại (bản app cũ chưa cập nhật thì bị chặn).',
      thu:[[1,'Thử trên máy giả lập (máy chủ chậm 4 giây): bản cũ bấm Giao lại ra 2 phiếu xuất, giao 80 thay vì 40; bản mới che màn tới khi xong, chỉ 1 phiếu, đúng 40. Google lỗi 503 sau khi đã ghi, app tự gửi lại: không giao 2 lần. Mất mạng giữa chừng rồi bấm lại: máy chủ hỏi lại. App cũ 5.28.0 giao trùng: máy chủ chặn']] },
    { t:'Kiểm kê, tạo phiếu và xác nhận nhận hàng có thể ghi trùng',
      loi:'Lưu kiểm kê xong bảng đếm vẫn còn trong lúc tải lại → bấm lại ghi thêm 1 mốc trùng. Tạo phiếu yêu cầu khi máy chủ chậm, app tự gửi lại có thể ra 2 phiếu.',
      sua:'Khóa nút, che màn tới khi xong; mã riêng mỗi lần bấm để máy chủ không ghi trùng.',
      thu:[[1,'Thử trên máy chủ giả: tạo phiếu, giao, nhận hàng, kiểm kê gửi lại cùng mã đều không ghi trùng (18/18 mục). Trên app: kiểm kê bấm 2 lần chỉ 1 mốc; cho mượn bấm đúp chỉ 1 phiếu']] }
   ],
   thu:[[1,'Chạy lại bộ thử cũ: cập nhật 5.27.0 → 5.28.0 → 5.28.1, Để sau giữ bản cũ, mất mạng (28/28); nâng máy chủ từ 5.20.1 và 5.20.2 lên 5.20.3, phân quyền giữ đúng (20/20); các màn chính với 5 chức danh không lỗi'],[0,'Chưa thử trên iPhone / Android thật']],
   todo:'Bấm "Cập nhật" trên thẻ thông báo (hoặc Menu → Cập nhật phiên bản mới). Từ bản này, nếu bạn xuất / nhập / giao cùng vật tư, cùng số lượng 2 lần trong 2 phút, app sẽ hỏi lại cho chắc.' },
 { v:'5.28.0', d:'05/10/2026', type:'up', title:'Thông báo cập nhật & lịch sử phiên bản',
   who:'Mọi người dùng. Nội dung chi tiết hiện với CM, DCM, EQM, DEQ, Admin (Admin chọn thêm trong Phân quyền chức danh)',
   sum:['Có bản mới: thẻ thông báo trên màn hình chính, chọn Cập nhật hoặc Để sau',
        'Menu → Cập nhật phiên bản mới: bản đang dùng, nút Kiểm tra bản mới, lịch sử các bản'],
   txt:['Từ bản sau, điện thoại giữ nguyên bản đang dùng cho đến khi bạn bấm Cập nhật',
        'Bấm "Để sau, giữ bản cũ": thẻ không hiện lại, Menu có chấm đỏ để tự cập nhật khi muốn',
        'Mỗi bản ghi rõ: ảnh hưởng tới ai; nếu sửa lỗi thì lỗi gì, cách sửa, đã thử nghiệm chưa; người dùng cần làm gì',
        'Sau khi cập nhật, thẻ "Có gì mới" hiện 1 lần',
        'Quyền mới "Xem nội dung cập nhật phiên bản" (Phân quyền chức danh → Màn hình được thấy). Người không có quyền chỉ thấy thông báo ngắn và nút Cập nhật / Để sau'],
   thu:[[1,'Thử trên máy giả lập (Chrome) với 2 bản liên tiếp, 28/28 mục đạt: thẻ hiện đúng; Để sau → tắt app mở lại vẫn giữ bản cũ, còn chấm đỏ; mất mạng vẫn mở được bản đang dùng; cập nhật từ Menu; máy cài lần đầu nhận bản mới nhất; bộ nhớ bản cũ được dọn; GitHub tải lên dở → báo "chưa đầy đủ", không bị kẹt'],
        [1,'Thử phân quyền trên máy chủ giả, 31/31 mục đạt: CM, DCM, EQM, DEQ, Admin xem được nội dung; Thủ kho, KTV, Giám đốc chỉ thấy thông báo ngắn; máy chủ từ chối người không có quyền; nâng máy chủ từ 5.20.1 tự bật quyền đúng 4 chức danh'],
        [1,'Thử lại các màn chính (Tổng quan, Phiếu YC, Phiếu nhập/xuất, Tồn kho, Báo cáo, Phân quyền) với 5 chức danh: không phát sinh lỗi'],
        [0,'Chưa thử trên iPhone / Android thật — đang chờ thử']],
   todo:'Bản này tự cập nhật như trước. Từ bản sau, khi có bản mới bạn được chọn Cập nhật hoặc Để sau.' },
 { v:'5.27.0', d:'', type:'new', title:'Mở khóa app bằng Face ID / vân tay', who:'Mọi người dùng', old:1,
   sum:['Hỏi bật 1 lần sau khi đăng nhập bằng mật khẩu; công tắc trong Menu','Lần đầu mở app mỗi ngày: quét Face ID / vân tay, hoặc "Dùng mật khẩu"','Điện thoại tự xác thực, app không lưu vân tay / khuôn mặt'] },
 { v:'5.26.0', d:'', type:'new', title:'Gợi ý tên khi thêm vật tư · Admin xóa danh mục vật tư', who:'Thủ kho, Quản lý, Admin', old:1,
   sum:['Ô "Tên vật tư" gợi ý từ danh mục các dự án, chọn là tự điền nhóm / đơn vị / cách cấp','Chặn trùng tên vật tư trong cùng dự án','Admin xóa toàn bộ danh mục vật tư của 1 dự án (phải gõ đúng tên dự án, tự sao lưu trước, chặn nếu dự án đã có phiếu)'] },
 { v:'5.25.0', d:'', type:'new', title:'Hướng dẫn sử dụng trong app', who:'Mọi người dùng', old:1,
   sum:['Menu → Hướng dẫn sử dụng: 15 bài, 51 ảnh chụp app thật','Nút "?" ở đầu trang và các trang chi tiết mở đúng bài của màn đó','Chỉ hiện bài hợp với quyền chức danh'] },
 { v:'5.24.1', d:'', type:'up', title:'Thanh thông báo đồng bộ dạng chữ', who:'Mọi người dùng', old:1,
   sum:['Bỏ nền màu: vàng = đang đồng bộ, xanh = đã đồng bộ, đỏ = lỗi / chờ gửi'] },
 { v:'5.24.0', d:'', type:'up', title:'Giao diện nền trắng', who:'Mọi người dùng', old:1,
   sum:['Đầu trang và Menu nền trắng, vạch cam','Thanh trạng thái điện thoại chữ đen'] },
 { v:'5.23.0', d:'', type:'up', title:'Đổi tài khoản giữ dữ liệu · tăng tốc · báo lỗi rõ hơn', who:'Mọi người dùng', old:1,
   sum:['Đổi tài khoản không phải tải lại dữ liệu dự án','Gặp lỗi tạm của Google: tự thử lại; báo đúng mất mạng / máy chủ chậm / chưa được giao dự án','Admin sửa mọi thông tin máy và giờ máy từng lần, có nhật ký sửa'] },
 { v:'5.22.2', d:'', type:'new', title:'Chọn máy có sẵn khi thêm thiết bị', who:'Thủ kho, Quản lý, QLTB', old:1,
   sum:['Ô "Tên thiết bị" có danh sách 53 máy (BM02 MMTB 09/2026) + máy đã khai báo ở các dự án','Chọn máy tự điền nhóm, loại hình, định mức dầu, số hiệu, loại đồng hồ','Không cho thêm / đổi tên trùng máy khác trong cùng dự án (5.22.1, 5.22.2)'] },
 { v:'5.21.0', d:'', type:'new', title:'Sao lưu dữ liệu tự động', who:'Admin', old:1,
   sum:['Tự sao lưu 23:00 mỗi ngày vào Google Drive: giữ 30 ngày, bản đầu tháng giữ 12 tháng, Excel hằng tuần giữ 12 tuần','Menu → Sao lưu dữ liệu: trạng thái, sao lưu ngay, danh sách bản'] },
 { v:'5.20.0', d:'', type:'new', title:'Giờ máy thiết bị', who:'Thủ kho, QLTB, Chỉ huy', old:1,
   sum:['Xuất dầu DO cho máy có đồng hồ: bắt buộc nhập giờ máy (chặn số nhỏ hơn lần trước, trừ khi đồng hồ đã thay / hỏng)','Chi tiết máy: tổng giờ chạy, lít/giờ so với định mức, lịch sử','Excel NXT thêm trang "Giờ máy"'] },
 { v:'5.19.1', d:'', type:'bug', title:'Sửa màn chào bị lóe màn đăng nhập', who:'Mọi người dùng', old:1,
   bugs:[{t:'Lóe màn đăng nhập khi mở app', loi:'Mở app thấy màn đăng nhập hiện thoáng qua trước màn chào', sua:'Màn chào hiện ngay khung hình đầu; Android dùng màn chờ cùng màu nền và logo mới', thu:[]}],
   sum:['Màn chào hiện ngay từ khung hình đầu, hết lóe màn đăng nhập'] },
 { v:'5.19.0', d:'', type:'new', title:'Chức danh & phân quyền', who:'Mọi người dùng, Admin', old:1,
   sum:['18 chức danh, 26 quyền; Admin bật / tắt quyền theo chức danh trong app','Màn không có quyền thì ẩn hẳn; máy chủ kiểm tra từng thao tác','Báo đăng nhập trên máy mới (Telegram + thông báo trên máy cũ)'] },
 { v:'5.18.0', d:'', type:'new', title:'Màn chào · chép danh mục vật tư · tăng tốc', who:'Mọi người dùng', old:1,
   sum:['Màn chào và màn đăng nhập nền ảnh công trường, chấm báo chất lượng mạng','Chép danh mục vật tư từ dự án khác','Đăng nhập và tải dữ liệu nhanh hơn'] },
 { v:'5.17.1', d:'', type:'up', title:'Phiếu yêu cầu dễ đọc hơn', who:'Thủ kho, KTV, Chỉ huy', old:1,
   sum:['Tìm vật tư gõ không dấu; trạng thái phiếu dạng dải màu + "Việc của bạn"','Thẻ vật tư số to: Yêu cầu / Kho đã giao / Chưa giao / Tồn','Nút Gửi Zalo trên phiếu; Excel "Xuất báo cáo phiếu YC"'] },
 { v:'5.17.0', d:'', type:'new', title:'Phiếu yêu cầu cấp vật tư', who:'Mọi người dùng', old:1,
   sum:['Quy trình phiếu: chờ kho cấp → đang giao → hoàn thành; CHT/CHP duyệt phiếu của KTV','Kho bấm giao: tự trừ tồn và tạo phiếu xuất; bên nhận báo sai lệch','Cóc nối theo cấu kiện, kiểm kê làm mốc, cảnh báo Telegram'] }
];
