const mongoose = require('mongoose');

const NhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, unique: true, sparse: true },
  HoTenNV: String,
  password: String,
  ChucVu: { type: String, default: 'admin' },
  DiaChi: String,
  SoDienThoai: String
}, { timestamps: true });

module.exports = mongoose.model('NhanVien', NhanVienSchema);