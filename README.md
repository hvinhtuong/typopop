# Mưa Từ Vựng – game gõ từ tiếng Anh

## Cấu trúc
- `www/index.html` – giao diện và các màn hình (menu, hết lượt)
- `www/style.css` – giao diện
- `www/game.js` – toàn bộ logic game (danh sách từ nằm ở dòng đầu tiên, biến `WORDS`)
- `capacitor.config.json`, `package.json` – dùng để đóng gói thành app Android/iOS

## Chạy trên máy tính
Cách nhanh nhất: mở `www/index.html` bằng trình duyệt.
Hoặc chạy server cục bộ (cần Node.js): `npm start`

## Đưa lên web
Tải thư mục `www` lên bất kỳ hosting tĩnh nào (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## Đóng gói thành app Android/iOS (Capacitor)
1. `npm install`
2. `npm run cap:init` (chỉ chạy một lần)
3. Mỗi lần sửa code: `npm run cap:sync`
4. `npm run android` mở Android Studio, `npm run ios` mở Xcode (cần máy Mac)
Đổi `appId` trong `capacitor.config.json` thành ID của bạn trước khi phát hành.

## Lưu ý
- Font Fredoka tải từ Google Fonts. Muốn chạy offline trong app, tải file font về và khai báo `@font-face` trong `style.css`.
- Thêm từ vựng: sửa chuỗi `WORDS` trong `game.js`, mỗi từ dạng `english:nghĩa tiếng Việt`, ngăn cách bằng dấu `|`.
