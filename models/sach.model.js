const mongoose = require('mongoose');

const SachSchema = new mongoose.Schema(
  {
    MaSach: {
      type: String,
      unique: true,
      index: true
    },

    TenSach: {
      type: String,
      required: [true, 'Tên sách là bắt buộc'],
      trim: true,
      index: true
    },

    DonGia: {
      type: Number,
      min: [0, 'Đơn giá không được âm'],
      default: 0
    },

    SoQuyen: {
      type: Number,
      required: true,
      min: [0, 'Số lượng không được âm'],
      default: 1
    },

    NamXuatBan: {
      type: Number,
      min: [1900, 'Năm xuất bản không hợp lệ']
    },

    NXB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NXB',
      required: true
    },

    TacGia: {
      type: String,
      trim: true
    },

    MoTa: {
      type: String,
      trim: true
    },

    HinhBia: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);


// ================= AUTO TẠO MÃ SÁCH =================
SachSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) return next();

    const last = await mongoose
      .model('Sach')
      .findOne({ MaSach: { $regex: /^S/ } })
      .sort({ createdAt: -1 });

    let number = 1;

    if (last && last.MaSach) {
      const parsed = parseInt(last.MaSach.replace('S', ''));
      number = isNaN(parsed) ? 1 : parsed + 1;
    }

    this.MaSach = `S${String(number).padStart(4, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('Sach', SachSchema);