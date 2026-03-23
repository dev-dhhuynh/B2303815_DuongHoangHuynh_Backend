const mongoose = require('mongoose');

const DocGiaSchema = new mongoose.Schema({
  MaDocGia: {
    type: String,
    unique: true,
    sparse: true
  },
  HoLot: {
    type: String,
    required: [true, 'Họ lót là bắt buộc']
  },
  Ten: {
    type: String,
    required: [true, 'Tên là bắt buộc']
  },
  NgaySinh: Date,
  Phai: {
    type: String,
    enum: ['Nam', 'Nu', 'Khac'],
    default: 'Khac'
  },
  DiaChi: String,
  DienThoai: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email là bắt buộc'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
  }
}, {
  timestamps: true
});

DocGiaSchema.pre('save', async function (next) {
  if (!this.MaDocGia) {
    const lastDocGia = await mongoose.model('DocGia').findOne().sort({ MaDocGia: -1 });
    let newNumber = 1;
    if (lastDocGia && lastDocGia.MaDocGia) {
      const lastNumber = parseInt(lastDocGia.MaDocGia.replace('DG', '')) || 0;
      newNumber = lastNumber + 1;
    }
    this.MaDocGia = 'DG' + String(newNumber).padStart(3, '0');
  }
  next();
});

module.exports = mongoose.model('DocGia', DocGiaSchema);