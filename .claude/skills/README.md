# Skill dùng cho app FECON

| Skill | Nguồn | Giấy phép | Cách dùng |
|---|---|---|---|
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Apache 2.0 | Claude tự dùng khi làm giao diện. Có thêm ghi chú FECON: giữ giao diện cũ, chỉ áp dụng cho màn hình mới. |
| `design-auditor` | [Ashutos1997/claude-design-auditor-skill](https://github.com/Ashutos1997/claude-design-auditor-skill) v1.2.13 | MIT | Chỉ chạy khi gọi tên (`/design-auditor` hoặc "kiểm tra giao diện màn X"). File nặng ~40.000 token mỗi lần. |
| `systematic-debugging` | [obra/superpowers](https://github.com/obra/superpowers) | MIT | Claude tự dùng khi gặp lỗi: tìm nguyên nhân gốc trước khi sửa. |
| `verification-before-completion` | [obra/superpowers](https://github.com/obra/superpowers) | MIT | Claude tự dùng trước khi báo "xong": phải chạy thử và có bằng chứng. |

Lấy ngày 01/11/2026. Từ Superpowers chỉ lấy 2 skill trên; KHÔNG lấy phần còn lại (bàn ý tưởng bắt buộc, viết test trước, tự chia việc cho trợ lý phụ, lệnh tự chạy khi mở phiên) vì trái quy trình FECON trong `CLAUDE.md`. Quy tắc trong `CLAUDE.md` luôn được ưu tiên hơn skill.

Skill trong thư mục này chỉ có tác dụng khi Claude làm việc với repo này (Claude Code). Muốn dùng trong khung chat claude.ai: nén từng thư mục skill thành .zip và tải lên ở Cài đặt → Khả năng → Skills.
