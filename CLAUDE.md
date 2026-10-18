# FECON — Kho vật tư + Thi công

Người dùng rành vận hành app và hiện trường, không chuyên lập trình. Trả lời tiếng Việt, ngắn gọn, dễ hiểu.

## Các file

| File | Là gì | Phiên bản |
|---|---|---|
| `index.html` | App Kho (một file, ~12.000 dòng, ~1,1 MB) | `APP_VERSION = '…'` |
| `thicong.html` | App Thi công cọc khoan nhồi / tường vây (~4.300 dòng) | |
| `apps_script_fecon*.gs` | Máy chủ Google Apps Script | `SERVER_VERSION = '…'` |
| `sw.js`, `manifest.json` | Cài app lên điện thoại, chạy khi mất mạng | |
| `huongdan/*.webp`, `*.jpg`, `*.png` | Ảnh hướng dẫn / giao diện: KHÔNG đọc | |

⚠ File `.gs` trong repo có thể cũ hơn máy chủ thật (bản thật nằm trong trình soạn Apps Script). Trước khi sửa phần máy chủ: so `SERVER_VERSION` với lời nhắc "máy chủ cần bản x.y.z" trong `index.html`; nếu lệch thì xin người dùng chép code Apps Script hiện tại, đừng sửa trên bản cũ.

## Đọc code tiết kiệm token (bắt buộc)

- KHÔNG BAO GIỜ đọc cả `index.html` hay `thicong.html`.
- Xem bản đồ trước: `grep -n "// =====" index.html` (mỗi phần có mốc `// ===== TÊN PHẦN =====`, phần mới ghi kèm số bản, vd `// ===== v5.32.0: GIẢI ĐỘNG …`).
- Tìm đúng hàm / chuỗi bằng Grep, rồi Read với `offset` + `limit` (tối đa ~150 dòng mỗi lần).
- Tránh các dòng ảnh nhúng: mỗi dòng dài hàng chục nghìn ký tự. Tìm chúng bằng `grep -n "data:image" index.html thicong.html` và đừng đọc khoảng chứa chúng. Grep thì dùng `-o` với ngữ cảnh ngắn, đừng in nguyên dòng dài.
- Số dòng thay đổi sau mỗi bản: luôn tìm lại theo mốc, đừng nhớ số dòng.

## Quy trình làm việc (theo quy trình FECON của người dùng)

1. Phản biện trước nếu yêu cầu chưa hợp lý.
2. Tự mở rộng A → B, C, D: màn hình / phiếu khác, báo cáo / Excel / sổ kho / BM05, quyền và duyệt, dữ liệu cũ, dự án liên kết, ngoại lệ (máy không đồng hồ, máy thuê, mất mạng, nhập nhầm, sửa sau), phần Thi công dùng chung dữ liệu.
3. Chốt DANH SÁCH SỬA đánh số, ghi rõ có phải dán Apps Script không.
4. Chỉ sửa khi người dùng nói "làm" / "ok chốt".
5. Khi làm: tăng phiên bản; gói `FECON_x.y.z.zip` + `HUONG_DAN_CAP_NHAT.txt` (bấm gì, có dán Apps Script không); chạy thử trên máy chủ giả + xem ảnh chụp rồi mới gửi; cập nhật `BAN_GIAO.md`.
6. Không làm tính năng giúp khai số đo khác thực tế trong hồ sơ nghiệm thu.

## Chia việc theo model (tiết kiệm chi phí)

Phiên chính chạy Opus: hiểu yêu cầu, phản biện, B-C-D, chốt danh sách, quyết định, kiểm tra kết quả cuối. Không giao các việc này đi.

Giao cho trợ lý phụ khi phần việc LỚN và TÁCH RIÊNG được:
- `tim-ma` (Haiku, chỉ đọc): dò vị trí code trong các file lớn, liệt kê chỗ dùng một hàm / trường dữ liệu, trả về số dòng + đoạn ngắn.
- `viet-ma` (Sonnet): sửa code đúng theo danh sách đã chốt, nhiều chỗ / nhiều file, rồi báo lại đã sửa gì.

Không giao: câu hỏi, tư vấn, sửa 1–2 chỗ nhỏ (Opus làm thẳng rẻ hơn, vì trợ lý phụ phải đọc lại từ đầu). Khi giao, ghi rõ trong lời giao: file, mốc `// =====`, tên hàm, việc cần làm, điều không được đụng tới. Sau khi trợ lý làm xong, Opus tự kiểm tra lại phần đã sửa trước khi báo người dùng.
