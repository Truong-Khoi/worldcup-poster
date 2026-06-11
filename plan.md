# Kế Hoạch Phát Triển & Nâng Cấp Dự Án Lịch Thi Đấu World Cup 2026

Tài liệu này phác thảo các định hướng phát triển, tính năng mới và cải tiến giao diện cho dự án Bản đồ Lịch thi đấu World Cup 2026 tương tác.

---

## 🎯 Mục Tiêu Tổng Quan
Biến trang web lịch thi đấu từ một công cụ nhập điểm tĩnh/thủ công thành một ứng dụng mô phỏng giải đấu thông minh, tự động tính toán bảng xếp hạng vòng bảng, xếp cặp vòng đấu loại trực tiếp (Knockout) theo đúng quy chế FIFA World Cup 2026, đồng thời cải thiện trải nghiệm thị giác (UI/UX) đạt chuẩn cao cấp.

---

## 📂 Chi Tiết Các Giai Đoạn Phát Triển

### 1. Vòng 1: Hoàn Thiện Logic & Tính Năng Cốt Lõi (Core Logic & Rules)

#### A. Tự động tính toán bảng xếp hạng vòng bảng (Dynamic Group Standings)
*   **Mô tả:** Khi người dùng nhập/sửa tỉ số ở vòng bảng, hệ thống sẽ tự động cập nhật bảng xếp hạng trong thời gian thực.
*   **Các chỉ số tính toán:**
    *   Số trận đã đấu (P - Played)
    *   Số trận thắng (W - Won) / Hòa (D - Drawn) / Thua (L - Lost)
    *   Số bàn thắng ghi được (GF - Goals For) / Bàn thua (GA - Goals Against)
    *   Hiệu số bàn thắng bại (GD - Goal Difference)
    *   Điểm số (Pts - Points): Thắng = 3 điểm, Hòa = 1 điểm, Thua = 0 điểm.
*   **Luật sắp xếp xếp hạng (FIFA Tiêu chuẩn):**
    1.  Điểm số cao hơn.
    2.  Hiệu số bàn thắng bại tốt hơn.
    3.  Tổng số bàn thắng ghi được nhiều hơn.
    4.  *(Tùy chọn nâng cao)* Đối đầu trực tiếp hoặc điểm Fair Play.

#### B. Tự động điền nhánh đấu Vòng 1/16 (Auto-populate Knockout Bracket)
*   **Mô tả:** World Cup 2026 áp dụng thể thức 48 đội (12 bảng đấu từ A đến L). Các đội đi tiếp vào Vòng 32 đội (Round of 32) gồm:
    *   2 đội đứng đầu mỗi bảng (12 bảng × 2 = 24 đội).
    *   8 đội xếp thứ 3 có thành tích tốt nhất trong số 12 bảng.
*   **Logic cần xây dựng:**
    *   Bộ so sánh thành tích các đội đứng thứ 3 (Điểm -> Hiệu số -> Bàn thắng).
    *   Thuật toán phân bổ các đội đứng thứ 3 vào các nhánh đấu theo bảng quy định của FIFA (tránh việc đội cùng bảng gặp lại nhau quá sớm).
    *   Thêm nút **"Tự động điền vòng KO" (Auto-fill KO)** ở Header hoặc khu vực trung gian để điền nhanh các đội đủ điều kiện vào Vòng 1/16.

#### C. Kích hoạt bộ chọn múi giờ (Timezone Selector)
*   **Mô tả:** Sử dụng thành phần `TimezoneSelector` có sẵn để cho phép chuyển đổi múi giờ.
*   **Chi tiết:**
    *   Hiển thị bộ chọn múi giờ trên Header.
    *   Đổi trạng thái `useUTC` từ biến tĩnh thành state để đồng bộ định dạng ngày/giờ của tất cả các trận đấu giữa **Giờ Việt Nam (GMT+7)** và **Giờ Quốc tế (UTC)**.

---

### 2. Vòng 2: Nâng Cấp Giao Diện & Trải Nghiệm Thị Giác (Premium UI/UX)

#### A. Bảng xếp hạng chi tiết (Interactive Group Standings Modal/Accordion)
*   **Mô tả:** Thay vì chỉ hiển thị danh sách các đội tĩnh trong bảng đấu, người dùng có thể nhấp vào tiêu đề của bảng đấu để xem chi tiết.
*   **Chi tiết thiết kế:**
    *   Hiển thị dạng **Accordion** (mở rộng ngay tại chỗ) hoặc **Modal Glassmorphism** mượt mà.
    *   Hiển thị đầy đủ bảng điểm hàng ngang (P, W, D, L, GF/GA, GD, Pts).
    *   Highlight màu sắc: Hạng 1 & 2 (Màu xanh lá nhẹ - Đi tiếp chắc chắn), Hạng 3 (Màu vàng nhẹ - Đang xét duyệt), Hạng 4 (Màu đỏ nhẹ - Bị loại).

#### B. Sáng tỏ nhánh đấu động khi Hover (Interactive Bracket Pathway Glow)
*   **Mô tả:** Tăng tính tương tác trực quan cho sơ đồ cây (Knockout Tree).
*   **Chi tiết thiết kế:**
    *   Khi hover chuột vào một đội tuyển (ví dụ: Brazil) ở bất kỳ vòng đấu nào, toàn bộ đường nối SVG liên kết hành trình của đội tuyển đó (từ Vòng 32 -> Chung kết) sẽ phát sáng với hiệu ứng **Glow Neon** (màu xanh lá/vàng đại diện của Brazil hoặc màu Indigo rực rỡ).
    *   Các đội tuyển bị loại ở các nhánh đấu sẽ hiển thị mờ đi (opacity thấp) để làm nổi bật đội chiến thắng.

#### C. Chế độ giao diện Sáng/Tối (Light/Dark Mode Theme)
*   **Mô tả:** Thêm tùy chọn giao diện sáng cho người dùng thích đọc tin tức thể thao phong cách tạp chí.
*   **Chi tiết:**
    *   Theme tối mặc định: Thể hiện không khí sân vận động đêm huyền ảo.
    *   Theme sáng mới: Sử dụng nền trắng/xám nhạt sạch sẽ, chữ đen/xanh navy đậm, độ tương phản cao.

---

### 3. Vòng 3: Tiện Ích Mở Rộng & Chia Sẻ (Export & Share Tools)

#### A. Lưu trữ và Xuất/Nhập dữ liệu dự đoán (Save & Sync Predictions)
*   **Mô tả:** Cho phép lưu trữ và phục hồi các kết quả dự đoán khác nhau.
*   **Tính năng:**
    *   Nút **Export JSON**: Xuất file cấu hình tỉ số của toàn bộ giải đấu về máy tính cá nhân.
    *   Nút **Import JSON**: Cho phép tải lên file dự đoán trước đó để tiếp tục điền tỉ số.

#### B. Tải ảnh sơ đồ nhánh đấu (Download Bracket Image)
*   **Mô tả:** Tạo một nút bấm chụp ảnh sơ đồ nhánh đấu để chia sẻ lên các mạng xã hội.
*   **Thực hiện:** Sử dụng thư viện nhẹ như `html-to-image` hoặc `dom-to-image` để kết xuất vùng sơ đồ cây (`KnockoutTree`) thành tệp ảnh PNG chất lượng cao.

---

## 🛠️ Kế Hoạch Triển Khai Chi Tiết

| Giai đoạn | Nhiệm vụ | File liên quan chính | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Giai đoạn 1** | Tích hợp bộ chọn Múi giờ (`useUTC`) | `src/app/page.tsx`, `src/components/header.tsx` | ⏳ Chưa bắt đầu |
| **Giai đoạn 2** | Triển khai Logic tự động tính điểm & Bảng xếp hạng Vòng bảng | `src/hooks/useMatches.ts`, `src/components/groups-grid.tsx` | ⏳ Chưa bắt đầu |
| **Giai đoạn 3** | Triển khai Thuật toán xếp cặp 32 đội & Điền nhanh vòng Knockout | `src/hooks/useMatches.ts`, `src/constants/progression.ts` | ⏳ Chưa bắt đầu |
| **Giai đoạn 4** | Thiết kế UI Bảng xếp hạng chi tiết (Glassmorphism Modal/Accordion) | `src/components/groups-grid.tsx` | ⏳ Chưa bắt đầu |
| **Giai đoạn 5** | Thêm hiệu ứng đường nối phát sáng động khi Hover sơ đồ cây | `src/components/knockout-tree.tsx` | ⏳ Chưa bắt đầu |
| **Giai đoạn 6** | Tích hợp công cụ Nhập/Xuất JSON và Tải ảnh sơ đồ nhánh đấu | `src/components/header.tsx`, `src/hooks/useMatches.ts` | ⏳ Chưa bắt đầu |
