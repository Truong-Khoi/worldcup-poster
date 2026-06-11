# 🏆 Bản Đồ Lịch Thi Đấu World Cup 2026 - Stitch Mockup Interactive

Chào mừng bạn đến với dự án **Lịch thi đấu World Cup 2026 tương tác**. Đây là một ứng dụng web hiện đại được thiết kế dựa trên phong cách poster thể thao cao cấp và sơ đồ cây (bracket) chuyên nghiệp, cho phép người hâm mộ bóng đá theo dõi lịch thi đấu, cập nhật tỉ số và dự đoán nhánh đấu của giải đấu lớn nhất hành tinh.

---

## ✨ Các Tính Năng Nổi Bật

*   **🗺️ Chế độ Bản Đồ Poster (Poster View):** Tái tạo một tấm poster lịch thi đấu truyền thống khổng lồ với đầy đủ thông tin về 12 bảng đấu (A-L), lịch trình chi tiết và thông tin trận Chung kết/Tranh hạng 3 được thiết kế nổi bật ở trung tâm.
*   **🌳 Chế độ Sơ Đồ Cây (Bracket View):** Cho phép theo dõi nhánh đấu trực quan của 32 đội đi tiếp trong vòng loại trực tiếp (Round of 32, 16, Tứ kết, Bán kết và Chung kết) bằng sơ đồ kết nối thông minh.
*   **✏️ Chế độ Nhập Điểm Số (Interactive Edit Mode):**
    *   Cho phép người dùng tự điền tỉ số trận đấu trực tiếp ngay trên giao diện.
    *   Tự động phân định đội thắng cuộc để đưa vào vòng tiếp theo.
    *   Hỗ trợ chọn đội thắng bằng đá Luân lưu (Penalty Shootout) trong trường hợp hòa ở vòng đấu loại trực tiếp.
*   **💾 Đồng bộ hóa LocalStorage:** Mọi kết quả tỉ số, chỉnh sửa đội tuyển và dự đoán của bạn sẽ được lưu tự động trên trình duyệt và không bị mất khi tải lại trang.
*   **🔍 Tìm kiếm & Lọc nhanh**: Tích hợp thanh tìm kiếm thông minh giúp lọc lịch thi đấu theo tên đội tuyển yêu thích một cách tức thì.

---

## 🛠️ Công Nghệ Sử Dụng

Dự án được xây dựng trên nền tảng các công nghệ web hiện đại, tối ưu hiệu suất và giao diện:

*   **Framework:** [Next.js 16](https://nextjs.org/) (React 19) với cấu trúc thư mục `src` tối ưu.
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) mang lại hiệu ứng giao diện bóng bẩy, responsive tốt trên mọi thiết bị.
*   **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/) đảm bảo tính an toàn dữ liệu và code chuẩn mực.
*   **Quản lý trạng thái:** React Hooks tự tùy chỉnh (`useMatches`) giúp đồng bộ hóa dữ liệu.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

Làm theo các bước sau để thiết lập dự án trên máy cục bộ của bạn:

### 1. Tải mã nguồn về máy
```bash
git clone https://github.com/Truong-Khoi/worldcup-poster.git
cd worldcup-poster
```

### 2. Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 3. Khởi chạy máy chủ phát triển (Development Server)
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn để trải nghiệm ứng dụng.

---

## 📅 Định Hướng Phát Triển Tương Lai

Chúng tôi đang có kế hoạch phát triển nhiều tính năng thú vị hơn nữa, bao gồm:
*   Tự động tính điểm & cập nhật bảng xếp hạng vòng bảng theo thời gian thực.
*   Thuật toán tự động xếp đội hạng 3 tốt nhất đi tiếp vào vòng loại trực tiếp (Knockout).
*   Chuyển đổi linh hoạt múi giờ GMT+7 (Việt Nam) và UTC (Quốc tế).
*   Xuất/Nhập dữ liệu dự đoán dưới dạng tệp JSON và tải ảnh chụp sơ đồ nhánh đấu để chia sẻ.

*Xem chi tiết kế hoạch tại tệp tin: [plan.md](file:///d:/worldcup-poster/plan.md).*

---

## 👤 Tác Giả & Bản Quyền

*   **Phát triển bởi:** Trương Minh Khôi
*   **Bản quyền:** © 2026 Lịch thi đấu World Cup 2026. Mọi quyền được bảo lưu.
