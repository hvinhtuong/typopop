# Typo Pop – Game gõ từ tiếng Anh

## Giới thiệu
**Typo Pop** là tựa game luyện gõ từ vựng tiếng Anh vui nhộn, tốc độ cao. Người chơi cần gõ chính xác các từ tiếng Anh đang rơi xuống trước khi chúng chạm đáy, kết hợp phát âm chuẩn xác, hệ thống chủ đề đa dạng và bảng xếp hạng kỷ lục.

## Cấu trúc dự án
- `index.html` – File chuyển hướng tự động lên GitHub Pages (hoặc chạy gốc)
- `www/index.html` – Giao diện chính và các màn hình (menu, nhập tên, bảng xếp hạng, game over)
- `www/style.css` – Giao diện và hiệu ứng giao diện (UI/UX)
- `www/game.js` – Toàn bộ logic game (xử lý từ vựng theo chủ đề, phát âm Web Speech API, âm thanh Web Audio API, lưu điểm localStorage)
- `capacitor.config.json`, `package.json` – Cấu hình đóng gói thành ứng dụng di động Android/iOS qua Capacitor

## Chạy trên máy tính
- Cách nhanh nhất: mở `www/index.html` trực tiếp bằng trình duyệt web.
- Hoặc chạy qua server cục bộ (yêu cầu Node.js): 
  ```bash
  npm install
  npm start
