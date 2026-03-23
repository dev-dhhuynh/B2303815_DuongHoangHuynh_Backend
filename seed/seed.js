require("dotenv").config();
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const Sach = require("../models/Sach");
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
  await connectDB();

  await Sach.deleteMany({});
  await NXB.deleteMany({});
  await NhanVien.deleteMany({});
  await DocGia.deleteMany({});

  const uploadsDir = path.join(__dirname, "../public/uploads/book-covers");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const nxbs = await NXB.create([
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
      TacGia: "Gene Kim & Jez Humble & Patrick Debois & John Willis & Nicole Forsgren",
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
      TacGia: "Erich Gamma, Richard Helm, Ralph Johnson và John Vlissides",
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
    },
    {
      _id: FIXED_IDS.SACH.S16,
      MaSach: "S016",
      TenSach: "Introduction to Algorithms",
      TacGia: "Thomas H. Cormen",
      NamXuatBan: 2022,
      DonGia: 2750000,
      SoQuyen: 3,
      MoTa: "Giới thiệu về thuật toán",
      HinhBia: "/uploads/book-covers/hinh16.png",
      isFeatured: true,
    },
    {
      _id: FIXED_IDS.SACH.S17,
      MaSach: "S017",
      TenSach: "Database System Concepts",
      TacGia: "Abraham Silberschatz",
      NamXuatBan: 2022,
      DonGia: 1100000,
      SoQuyen: 5,
      MoTa: "Khái niệm hệ thống cơ sở dữ liệu",
      HinhBia: "/uploads/book-covers/hinh17.jpg",
      isFeatured: true,
    },
    {
      _id: FIXED_IDS.SACH.S18,
      MaSach: "S018",
      TenSach: "Nhập môn HTML và CSS",
      TacGia: "Nguyễn Quang Hải",
      NamXuatBan: 2022,
      DonGia: 90000,
      SoQuyen: 6,
      MoTa: "Sách giúp người học có kiến thức cơ bản về HTML và CSS.",
      HinhBia: "/uploads/book-covers/hinh18.jpg",
      isFeatured: true,
    },
    {
      _id: FIXED_IDS.SACH.S19,
      MaSach: "S019",
      TenSach: "100 bài tập Javascript có lời giải",
      TacGia: "Lưu Trường Hải Lân",
      NamXuatBan: 2022,
      DonGia: 120000,
      SoQuyen: 4,
      MoTa: "Cuốn sách không chỉ là một nguồn tài nguyên học tập mà còn là một hướng dẫn chi tiết và đầy đủ, giúp bạn phát triển kỹ năng lập trình một cách toàn diện và hiệu quả.",
      HinhBia: "/uploads/book-covers/hinh19.jpg",
      isFeatured: true,
    },
    {
      _id: FIXED_IDS.SACH.S20,
      MaSach: "S020",
      TenSach: "LẬP TRÌNH PYTHON CHO NGƯỜI MỚI BẮT ĐẦU",
      TacGia: "Nguyễn Ngọc Tân",
      NamXuatBan: 2021,
      DonGia: 100000,
      SoQuyen: 2,
      MoTa: "Sách được chia thành nhiều bài học, từ cơ bản đến nâng cao, tập trung vào việc phát triển tư duy và kỹ năng thực hành thông qua việc phân tích, thực hành và xây dựng các chương trình và ứng dụng Python.",
      HinhBia: "/uploads/book-covers/hinh20.jpg",
      isFeatured: true,
    },
    {
      _id: FIXED_IDS.SACH.S21,
      MaSach: "S021",
      TenSach: "Bảy Viên Ngọc Rồng Siêu Cấp - Chương 12",
      TacGia: "Akira Toriyama, Toyotarou",
      NamXuatBan: 2021,
      DonGia: 28000,
      SoQuyen: 10,
      MoTa: "Dragon Ball Super là phần tiếp theo của loạt manga huyền thoại Dragon Ball Z, thuộc thể loại hành động, viễn tưởng, võ thuật, siêu năng lực.",
      HinhBia: "/uploads/book-covers/hinh21.jpg",
    },
    {
      _id: FIXED_IDS.SACH.S22,
      MaSach: "S022",
      TenSach: "Nàng Búp Bê Thử Đồ Biết Yêu - Vol. 7",
      TacGia: "Fukuda Shinichi",
      NamXuatBan: 2021,
      DonGia: 190000,
      SoQuyen: 5,
      MoTa: "Sono Bisque Doll wa Koi wo Suru / My Dress-Up Darling là một manga thể loại rom-com (hài lãng mạn) pha chút slice of life và cosplay.",
      HinhBia: "/uploads/book-covers/hinh22.jpg",
    },
    {
      _id: FIXED_IDS.SACH.S23,
      MaSach: "S023",
      TenSach: "Thất Hình Đại Tội - Chương 1",
      TacGia: "Suzuki Nakaba",
      NamXuatBan: 2021,
      DonGia: 20000,
      SoQuyen: 3,
      MoTa: "The Seven Deadly Sins / Nanatsu no Taizai là một manga phiêu lưu – hành động – giả tưởng nổi tiếng của Nhật Bản, với bối cảnh trung cổ, hiệp sĩ và phép thuật.",
      HinhBia: "/uploads/book-covers/hinh23.webp",
    },
    {
      _id: FIXED_IDS.SACH.S24,
      MaSach: "S024",
      TenSach: "Đại chiến Titan - Chương 11",
      TacGia: "Hajime Isayama",
      NamXuatBan: 2020,
      DonGia: 22000,
      SoQuyen: 6,
      MoTa: "Attack on Titan / Shingeki no Kyojin là một manga nổi tiếng toàn cầu, thuộc thể loại hành động, hậu tận thế, giả tưởng đen tối.",
      HinhBia: "/uploads/book-covers/hinh24.webp",
    },
    {
      _id: FIXED_IDS.SACH.S25,
      MaSach: "S025",
      TenSach: "Chỉ mình tôi thăng cấp - Chương 1",
      TacGia: "Dubu (Redice Studio), Chugong",
      NamXuatBan: 2020,
      DonGia: 85000,
      SoQuyen: 4,
      MoTa: "Solo Leveling là một web novel Hàn Quốc, sau đó được chuyển thể thành manhwa rất nổi tiếng, thuộc thể loại hành động, giả tưởng, hệ thống.",
      HinhBia: "/uploads/book-covers/hinh25.webp",
    },
    {
      _id: FIXED_IDS.SACH.S26,
      MaSach: "S026",
      TenSach: "Thất nghiệp chuyển sinh ~ Sống hết mình sau khi tới thế giới khác (Light Novel) Vol. 1",
      TacGia: "Rifujin na Magonote, Shirotaka",
      NamXuatBan: 2020,
      DonGia: 615000,
      SoQuyen: 3,
      MoTa: "Mushoku Tensei: Isekai Ittara Honki Dasu là một light novel isekai nổi bật, pha trộn giữa phiêu lưu, trưởng thành, phép thuật và tình cảm.",
      HinhBia: "/uploads/book-covers/hinh26.jpg",
    },
    {
      _id: FIXED_IDS.SACH.S27,
      MaSach: "S027",
      TenSach: "Hãy ban phúc lành cho thế giới tuyệt vời này! (Light Novel) Vol. 1",
      TacGia: "Akatsuki Natsume, Mishima Kurone",
      NamXuatBan: 2020,
      DonGia: 530000,
      SoQuyen: 2,
      MoTa: "Kono Subarashii Sekai ni Shukufuku wo! là một light novel isekai nổi tiếng pha trộn hài hước, phiêu lưu và đời sống thường nhật.",
      HinhBia: "/uploads/book-covers/hinh27.jpg",
    },
    {
      _id: FIXED_IDS.SACH.S28,
      MaSach: "S028",
      TenSach: "Về Chuyện Tôi Chuyển Sinh Thành Slime - (Light Novel) Vol. 1",
      TacGia: "Fuse, Mizt Vah",
      NamXuatBan: 2019,
      DonGia: 135000,
      SoQuyen: 7,
      MoTa: "Tensei Shitara Slime Datta Ken là một light novel isekai nổi tiếng, pha trộn phiêu lưu, hành động, phép thuật và xây dựng thế giới.",
      HinhBia: "/uploads/book-covers/hinh28.jpg",
    },
    {
      _id: FIXED_IDS.SACH.S29,
      MaSach: "S029",
      TenSach: "Nhất Quyền Nhân - Chương 30",
      TacGia: "ONE, Yusuke Murata",
      NamXuatBan: 2019,
      DonGia: 30000,
      SoQuyen: 9,
      MoTa: "One Punch Man là một truyện tranh (manga) thể loại hành động, siêu anh hùng pha trộn hài hước và châm biếm.",
      HinhBia: "/uploads/book-covers/hinh29.jpg",
    },
    {
      _id: FIXED_IDS.SACH.S30,
      MaSach: "S030",
      TenSach: "Overlord (Light Novel) Vol. 1",
      TacGia: "Kugane Maruyama",
      NamXuatBan: 2019,
      DonGia: 130000,
      SoQuyen: 4,
      MoTa: "Overlord là một light novel Nhật Bản thuộc thể loại isekai (dị giới), giả tưởng đen tối và hành động.",
      HinhBia: "/uploads/book-covers/hinh30.jpg",
    },
  ];

  const nxbsIds = Object.values(FIXED_IDS.NXB);
  const booksWithNXB = sachList.map((book) => ({
    ...book,
    MaNXB: nxbsIds[Math.floor(Math.random() * nxbsIds.length)],
  }));

  await Sach.insertMany(booksWithNXB);

  const hashedAdmin = await bcrypt.hash("admin123", 10);
  const hashedStaff = await bcrypt.hash("staff123", 10);

  await NhanVien.create([
    {
      _id: FIXED_IDS.NHANVIEN.NV001,
      MSNV: "admin001",
      HoTenNV: "Quản trị viên hệ thống",
      password: hashedAdmin,
      ChucVu: "admin",
      SoDienThoai: "0123456789",
      DiaChi: "Hà Nội",
    },
    {
      _id: FIXED_IDS.NHANVIEN.NV002,
      MSNV: "staff001",
      HoTenNV: "Nhân viên thư viện",
      password: hashedStaff,
      ChucVu: "staff",
      SoDienThoai: "0987654321",
      DiaChi: "TP.HCM",
    },
    {
      _id: FIXED_IDS.NHANVIEN.NV003,
      MSNV: "staff002",
      HoTenNV: "Nhân viên lễ tân",
      password: hashedStaff,
      ChucVu: "staff",
      SoDienThoai: "0909123456",
      DiaChi: "Đà Nẵng",
    },
  ]);

  const hashedUser1 = await bcrypt.hash("user123", 10);
  const hashedUser2 = await bcrypt.hash("user456", 10);
  const hashedUser3 = await bcrypt.hash("user789", 10);

  await DocGia.create([
    {
      _id: FIXED_IDS.DOCGIA.DG001,
      MaDocGia: "DG001",
      HoLot: "Nguyễn Thị",
      Ten: "Ngọc",
      email: "user@example.com",
      password: hashedUser1,
      DienThoai: "0987654321",
      NgaySinh: new Date("1990-05-15"),
      Phai: "Nu",
      DiaChi: "TP.HCM",
    },
    {
      _id: FIXED_IDS.DOCGIA.DG002,
      MaDocGia: "DG002",
      HoLot: "Trần Văn",
      Ten: "Minh",
      email: "minh@example.com",
      password: hashedUser2,
      DienThoai: "0912345678",
      NgaySinh: new Date("1995-08-20"),
      Phai: "Nam",
      DiaChi: "Hà Nội",
    },
    {
      _id: FIXED_IDS.DOCGIA.DG003,
      MaDocGia: "DG003",
      HoLot: "Lê Thị",
      Ten: "Hương",
      email: "huong@example.com",
      password: hashedUser3,
      DienThoai: "0934567890",
      NgaySinh: new Date("1988-12-10"),
      Phai: "Nu",
      DiaChi: "Đà Nẵng",
    },
  ]);

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});