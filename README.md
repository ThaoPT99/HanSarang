# 🇰🇷 Thông Tin Trường Hàn

**Trang web tra cứu thông tin trường đại học Hàn Quốc dành cho du học sinh Việt Nam**

## Tính năng

- 🎓 **45+ trường đại học Hàn Quốc** - Thông tin chi tiết về các trường từ SKY đến các trường vùng
- 🔍 **Tìm kiếm và lọc** - Tìm trường theo tên, khu vực, loại hình, nhóm trường
- ⚖️ **So sánh trường** - So sánh 2-3 trường để chọn lựa phù hợp
- 📚 **Cẩm nang du học** - Hướng dẫn visa, học bổng, chi phí, cuộc sống
- 🎯 **Học bổng** - Thông tin học bổng GKS và học bổng từ trường
- 📱 **Responsive** - Hiển thị tốt trên mọi thiết bị

## Công nghệ sử dụng

- HTML5, CSS3, JavaScript (Vanilla)
- Font Awesome 6 cho icons
- Google Fonts (Inter + Noto Sans)
- Không dependencies - chạy trực tiếp trên trình duyệt

## Cấu trúc thư mục

```
thong-tin-truong-han/
├── index.html              # Trang chủ
├── truong-hoc.html         # Danh sách trường + So sánh
├── chi-tiet-truong.html    # Chi tiết trường
├── cam-nang-du-hoc.html    # Cẩm nang du học
├── css/
│   └── style.css           # Stylesheet chính
├── js/
│   ├── university-data.js  # Database 45+ trường
│   └── main.js             # JavaScript chính
└── README.md
```

## Cách sử dụng

Mở file `index.html` trong trình duyệt web (Chrome, Firefox, Edge...).

Không cần cài đặt thêm bất cứ thứ gì!

## API Database

Database các trường bao gồm các thông tin:
- Tên (Tiếng Việt, Hàn, Anh)
- Khu vực (Seoul, Busan, Daejeon...)
- Loại hình (Công lập/Tư thục)
- Xếp hạng (SKY, Top 10, Top 20...)
- Học phí
- Yêu cầu đầu vào (TOPIK, IELTS)
- Học bổng
- Ngành học nổi bật

## Phát triển

Để thêm trường mới, chỉ cần thêm object vào mảng `universities` trong `js/university-data.js`.
