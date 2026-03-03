require("dotenv").config();
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const Sach = require("../models/Sach.model");
const NXB = require("../models/NXB");
const NhanVien = require("../models/NhanVien");
const DocGia = require("../models/DocGia");

const generateFixedIds = () => {
  const ids = {
    NXB: {},
    SACH: {},
    NHANVIEN: {},
    DOCGIA: {},
  };

  const nxbIds = [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015",
  ];

  nxbIds.forEach((id, index) => {
    ids.NXB[`NXB00${index + 1}`] = new mongoose.Types.ObjectId(id);
  });

  const sachBaseId = "607f1f77bcf86cd7994390";
  for (let i = 1; i <= 30; i++) {
    const paddedNum = i.toString().padStart(2, "0");
    const id = `${sachBaseId}${20 + i}`;
    ids.SACH[`S${paddedNum}`] = new mongoose.Types.ObjectId(id);
  }

  const nhanVienIds = [
    "707f1f77bcf86cd799439031",
    "707f1f77bcf86cd799439032",
    "707f1f77bcf86cd799439033",
  ];

  nhanVienIds.forEach((id, index) => {
    ids.NHANVIEN[`NV00${index + 1}`] = new mongoose.Types.ObjectId(id);
  });

  const docGiaIds = [
    "807f1f77bcf86cd799439041",
    "807f1f77bcf86cd799439042",
    "807f1f77bcf86cd799439043",
  ];

  docGiaIds.forEach((id, index) => {
    ids.DOCGIA[`DG00${index + 1}`] = new mongoose.Types.ObjectId(id);
  });

  return ids;
};

const FIXED_IDS = generateFixedIds();

const seed = async () => {
  try {
    await connectDB();
    console.log("🧹 Đang xóa dữ liệu cũ...");

    await Sach.deleteMany({});
    await NXB.deleteMany({});
    await NhanVien.deleteMany({});
    await DocGia.deleteMany({});

    const uploadsDir = path.join(__dirname, "../public/uploads/book-covers");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    console.log("📚 Đang tạo NXB...");
    await NXB.create([
      {
        _id: FIXED_IDS.NXB.NXB001,
        MaNXB: "NXB001",
        TenNXB: "NXB Giáo Dục",
        DiaChi: "Hà Nội",
      },
      {
        _id: FIXED_IDS.NXB.NXB002,
        MaNXB: "NXB002",
        TenNXB: "NXB Kim Đồng",
        DiaChi: "TP.HCM",
      },
      {
        _id: FIXED_IDS.NXB.NXB003,
        MaNXB: "NXB003",
        TenNXB: "NXB Trẻ",
        DiaChi: "Hà Nội",
      },
      {
        _id: FIXED_IDS.NXB.NXB004,
        MaNXB: "NXB004",
        TenNXB: "NXB Dân Trí",
        DiaChi: "Hà Nội",
      },
      {
        _id: FIXED_IDS.NXB.NXB005,
        MaNXB: "NXB005",
        TenNXB: "NXB Tổng Hợp TP.HCM",
        DiaChi: "TP.HCM",
      },
    ]);

    console.log("📖 Đang tạo Sách...");

    const sachList = [
      {
        _id: FIXED_IDS.SACH.S01,
        MaSach: "S001",
        TenSach: "Get Programming with Node.js",
        TacGia: "Jonathan Wexler",
        NamXuatBan: 2024,
        DonGia: 1300000,
        SoQuyen: 3,
        MoTa: "Sách dạy lập trình Node.js",
        HinhBia: "/uploads/book-covers/hinh1.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S02,
        MaSach: "S002",
        TenSach: "Vue.js – Up and running",
        TacGia: "Callum Macrae",
        NamXuatBan: 2024,
        DonGia: 140000,
        SoQuyen: 2,
        MoTa: "Sách hướng dẫn sử dụng Vue.js",
        HinhBia: "/uploads/book-covers/hinh2.png",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S03,
        MaSach: "S003",
        TenSach: "Cấu trúc dữ liệu và giải thuật",
        TacGia: "Nguyễn Trung Trực",
        NamXuatBan: 2019,
        DonGia: 120000,
        SoQuyen: 1,
        MoTa: "Giáo trình về cấu trúc dữ liệu và các thuật toán cơ bản",
        HinhBia: "/uploads/book-covers/hinh3.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S04,
        MaSach: "S004",
        TenSach: "Learning Web Design",
        TacGia: "O'Reilly Media",
        NamXuatBan: 2024,
        DonGia: 200000,
        SoQuyen: 4,
        MoTa: "Sách hướng dẫn thiết kế website dành cho người mới",
        HinhBia: "/uploads/book-covers/hinh4.png",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S05,
        MaSach: "S005",
        TenSach: "Machine Learning cơ bản",
        TacGia: "Vũ Hữu Tiệp",
        NamXuatBan: 2024,
        DonGia: 200000,
        SoQuyen: 2,
        MoTa: "Giới thiệu về Machine Learning và các ứng dụng thực tế",
        HinhBia: "/uploads/book-covers/hinh5.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S06,
        MaSach: "S006",
        TenSach: "7 Thói Quen Hiệu Quả",
        TacGia: "Stephen R. Covey",
        NamXuatBan: 2024,
        DonGia: 99000,
        SoQuyen: 3,
        MoTa: "Cẩm nang phát triển bản thân bền vững.",
        HinhBia: "/uploads/book-covers/hinh6.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S07,
        MaSach: "S007",
        TenSach: "Dế Mèn Phiêu Lưu Ký",
        TacGia: "Tô Hoài",
        NamXuatBan: 2024,
        DonGia: 65000,
        SoQuyen: 5,
        MoTa: "Câu chuyện về chú dế nhỏ gan dạ",
        HinhBia: "/uploads/book-covers/hinh7.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S08,
        MaSach: "S008",
        TenSach: "React 18 Mastery",
        TacGia: "Carlos Santana Roldán",
        NamXuatBan: 2024,
        DonGia: 1200000,
        SoQuyen: 3,
        MoTa: "Làm chủ React 18 với các tính năng mới nhất",
        HinhBia: "/uploads/book-covers/hinh8.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S09,
        MaSach: "S009",
        TenSach: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
        TacGia: "Nguyễn Nhật Ánh",
        NamXuatBan: 2024,
        DonGia: 72000,
        SoQuyen: 4,
        MoTa: "Hồi tưởng thời thơ ấu đầy xúc cảm.",
        HinhBia: "/uploads/book-covers/hinh9.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S10,
        MaSach: "S010",
        TenSach: "Nhà Giả Kim",
        TacGia: "Paulo Coelho",
        NamXuatBan: 2024,
        DonGia: 87000,
        SoQuyen: 6,
        MoTa: "Hành trình theo đuổi ước mơ của chàng chăn cừu.",
        HinhBia: "/uploads/book-covers/hinh10.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S11,
        MaSach: "S011",
        TenSach: "The Devops Handbook",
        TacGia:
          "Gene Kim & Jez Humble & Patrick Debois & John Willis & Nicole Forsgren",
        NamXuatBan: 2023,
        DonGia: 300000,
        SoQuyen: 2,
        MoTa: "Cẩm nang DevOps cho doanh nghiệp",
        HinhBia: "/uploads/book-covers/hinh11.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S12,
        MaSach: "S012",
        TenSach: "Clean Code",
        TacGia: "Robert C. Martin",
        NamXuatBan: 2023,
        DonGia: 300000,
        SoQuyen: 8,
        MoTa: "Nghệ thuật viết code sạch",
        HinhBia: "/uploads/book-covers/hinh12.png",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S13,
        MaSach: "S013",
        TenSach: "Design Patterns",
        TacGia:
          "Erich Gamma, Richard Helm, Ralph Johnson và John Vlissides",
        NamXuatBan: 2023,
        DonGia: 2300000,
        SoQuyen: 6,
        MoTa: "Các mẫu thiết kế trong lập trình",
        HinhBia: "/uploads/book-covers/hinh13.jpeg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S14,
        MaSach: "S014",
        TenSach: "Eloquent JavaScript",
        TacGia: "Marijn Haverbeke",
        NamXuatBan: 2023,
        DonGia: 800000,
        SoQuyen: 5,
        MoTa: "Học JavaScript một cách trôi chảy",
        HinhBia: "/uploads/book-covers/hinh14.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S15,
        MaSach: "S015",
        TenSach: "The Pragmatic Programmer",
        TacGia: "David Thomas",
        NamXuatBan: 2023,
        DonGia: 170000,
        SoQuyen: 4,
        MoTa: "Lập trình viên thực dụng",
        HinhBia: "/uploads/book-covers/hinh15.jpg",
        isFeatured: true,
      },      {
        _id: FIXED_IDS.SACH.S16,
        MaSach: "S016",
        TenSach: "You Don't Know JS Yet",
        TacGia: "Kyle Simpson",
        NamXuatBan: 2023,
        DonGia: 950000,
        SoQuyen: 4,
        MoTa: "Hiểu sâu về JavaScript",
        HinhBia: "/uploads/book-covers/hinh16.jpg",
        isFeatured: true,
      },
      {
        _id: FIXED_IDS.SACH.S17,
        MaSach: "S017",
        TenSach: "Atomic Habits",
        TacGia: "James Clear",
        NamXuatBan: 2023,
        DonGia: 120000,
        SoQuyen: 6,
        MoTa: "Xây dựng thói quen tốt mỗi ngày",
        HinhBia: "/uploads/book-covers/hinh17.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S18,
        MaSach: "S018",
        TenSach: "Deep Work",
        TacGia: "Cal Newport",
        NamXuatBan: 2023,
        DonGia: 110000,
        SoQuyen: 5,
        MoTa: "Tập trung để thành công trong công việc",
        HinhBia: "/uploads/book-covers/hinh18.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S19,
        MaSach: "S019",
        TenSach: "Rich Dad Poor Dad",
        TacGia: "Robert Kiyosaki",
        NamXuatBan: 2022,
        DonGia: 99000,
        SoQuyen: 7,
        MoTa: "Bài học tài chính cá nhân",
        HinhBia: "/uploads/book-covers/hinh19.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S20,
        MaSach: "S020",
        TenSach: "Start With Why",
        TacGia: "Simon Sinek",
        NamXuatBan: 2022,
        DonGia: 105000,
        SoQuyen: 5,
        MoTa: "Tìm ra lý do để thành công",
        HinhBia: "/uploads/book-covers/hinh20.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S21,
        MaSach: "S021",
        TenSach: "JavaScript: The Good Parts",
        TacGia: "Douglas Crockford",
        NamXuatBan: 2022,
        DonGia: 880000,
        SoQuyen: 3,
        MoTa: "Những phần tinh túy của JavaScript",
        HinhBia: "/uploads/book-covers/hinh21.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S22,
        MaSach: "S022",
        TenSach: "Refactoring",
        TacGia: "Martin Fowler",
        NamXuatBan: 2022,
        DonGia: 2200000,
        SoQuyen: 4,
        MoTa: "Cải tiến mã nguồn hiệu quả",
        HinhBia: "/uploads/book-covers/hinh22.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S23,
        MaSach: "S023",
        TenSach: "Introduction to Algorithms",
        TacGia: "Thomas H. Cormen",
        NamXuatBan: 2022,
        DonGia: 2500000,
        SoQuyen: 2,
        MoTa: "Giáo trình thuật toán kinh điển",
        HinhBia: "/uploads/book-covers/hinh23.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S24,
        MaSach: "S024",
        TenSach: "Think and Grow Rich",
        TacGia: "Napoleon Hill",
        NamXuatBan: 2022,
        DonGia: 98000,
        SoQuyen: 6,
        MoTa: "Tư duy làm giàu",
        HinhBia: "/uploads/book-covers/hinh24.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S25,
        MaSach: "S025",
        TenSach: "The Lean Startup",
        TacGia: "Eric Ries",
        NamXuatBan: 2022,
        DonGia: 115000,
        SoQuyen: 4,
        MoTa: "Khởi nghiệp tinh gọn",
        HinhBia: "/uploads/book-covers/hinh25.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S26,
        MaSach: "S026",
        TenSach: "Python Crash Course",
        TacGia: "Eric Matthes",
        NamXuatBan: 2021,
        DonGia: 1500000,
        SoQuyen: 3,
        MoTa: "Học Python từ cơ bản đến nâng cao",
        HinhBia: "/uploads/book-covers/hinh26.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S27,
        MaSach: "S027",
        TenSach: "The Psychology of Money",
        TacGia: "Morgan Housel",
        NamXuatBan: 2021,
        DonGia: 100000,
        SoQuyen: 6,
        MoTa: "Tâm lý học về tiền bạc",
        HinhBia: "/uploads/book-covers/hinh27.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S28,
        MaSach: "S028",
        TenSach: "Zero to One",
        TacGia: "Peter Thiel",
        NamXuatBan: 2021,
        DonGia: 125000,
        SoQuyen: 5,
        MoTa: "Xây dựng startup đột phá",
        HinhBia: "/uploads/book-covers/hinh28.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S29,
        MaSach: "S029",
        TenSach: "The Clean Coder",
        TacGia: "Robert C. Martin",
        NamXuatBan: 2021,
        DonGia: 210000,
        SoQuyen: 4,
        MoTa: "Tác phong chuyên nghiệp của lập trình viên",
        HinhBia: "/uploads/book-covers/hinh29.jpg",
      },
      {
        _id: FIXED_IDS.SACH.S30,
        MaSach: "S030",
        TenSach: "Don't Make Me Think",
        TacGia: "Steve Krug",
        NamXuatBan: 2021,
        DonGia: 90000,
        SoQuyen: 5,
        MoTa: "Nguyên lý thiết kế UX cơ bản",
        HinhBia: "/uploads/book-covers/hinh30.jpg",
      },
    ];

    await Sach.insertMany(sachList);

    console.log("👨‍💼 Đang tạo Nhân viên...");
    const hashedPassword = await bcrypt.hash("123456", 10);

    await NhanVien.create([
      {
        _id: FIXED_IDS.NHANVIEN.NV001,
        MaNV: "NV001",
        HoTenNV: "Nguyễn Văn Admin",
        Password: hashedPassword,
        ChucVu: "Admin",
        DiaChi: "Cần Thơ",
        SoDienThoai: "0900000001",
      },
      {
        _id: FIXED_IDS.NHANVIEN.NV002,
        MaNV: "NV002",
        HoTenNV: "Trần Thị Nhân Viên",
        Password: hashedPassword,
        ChucVu: "Staff",
        DiaChi: "Hà Nội",
        SoDienThoai: "0900000002",
      },
      {
        _id: FIXED_IDS.NHANVIEN.NV003,
        MaNV: "NV003",
        HoTenNV: "Lê Văn Thư",
        Password: hashedPassword,
        ChucVu: "Staff",
        DiaChi: "TP.HCM",
        SoDienThoai: "0900000003",
      },
    ]);

    console.log("👥 Đang tạo Độc giả...");
    await DocGia.create([
      {
        _id: FIXED_IDS.DOCGIA.DG001,
        MaDocGia: "DG001",
        HoLot: "Nguyễn Văn",
        Ten: "A",
        NgaySinh: new Date("2000-01-01"),
        Phai: "Nam",
        DiaChi: "Cần Thơ",
        DienThoai: "0911111111",
      },
      {
        _id: FIXED_IDS.DOCGIA.DG002,
        MaDocGia: "DG002",
        HoLot: "Trần Thị",
        Ten: "B",
        NgaySinh: new Date("1999-05-12"),
        Phai: "Nữ",
        DiaChi: "Hà Nội",
        DienThoai: "0922222222",
      },
      {
        _id: FIXED_IDS.DOCGIA.DG003,
        MaDocGia: "DG003",
        HoLot: "Lê Văn",
        Ten: "C",
        NgaySinh: new Date("2001-09-20"),
        Phai: "Nam",
        DiaChi: "TP.HCM",
        DienThoai: "0933333333",
      },
    ]);

    console.log("✅ Seed thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed lỗi:", error);
    process.exit(1);
  }
};

seed();