const mongoose = require('mongoose');

const SachSchema = new mongoose.Schema({
  MaSach: { type: String, unique: true, sparse: true },
  TenSach: { type: String, required: true },
  DonGia: Number,
  SoQuyen: { type: Number, default: 1 },
  NamXuatBan: Number,
  MaNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'NXB' },
  TacGia: String,
  MoTa: String,
  HinhBia: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Sach', SachSchema);