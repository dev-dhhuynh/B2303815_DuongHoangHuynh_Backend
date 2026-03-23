const mongoose = require('mongoose');

const MuonSachSchema = new mongoose.Schema({
  MaDocGia: { type: mongoose.Schema.Types.ObjectId, ref: 'DocGia', required: true },
  MaSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Sach', required: true },
  NgayMuon: { type: Date, default: Date.now },
  NgayTraDuKien: Date,
  NgayTra: Date,
  status: { type: String, enum: ['pending', 'approved', 'returned', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' },
  note: String
}, { timestamps: true });

module.exports = mongoose.model('MuonSach', MuonSachSchema);