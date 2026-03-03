const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DocGiaSchema = new mongoose.Schema(
  {
    MaDocGia: {
      type: String,
      unique: true,
      index: true
    },

    HoDem: {
      type: String,
      required: [true, 'Họ đệm là bắt buộc'],
      trim: true
    },

    Ten: {
      type: String,
      required: [true, 'Tên là bắt buộc'],
      trim: true
    },

    NgaySinh: {
      type: Date
    },

    Phai: {
      type: String,
      enum: {
        values: ['Nam', 'Nu', 'Khac'],
        message: 'Giới tính không hợp lệ'
      },
      default: 'Khac'
    },

    DiaChi: {
      type: String,
      trim: true
    },

    DienThoai: {
      type: String,
      required: [true, 'Số điện thoại là bắt buộc'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email không hợp lệ'
      ]
    },

    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
      select: false
    }
  },
  {
    timestamps: true
  }
);


// ================= AUTO TẠO MÃ ĐỘC GIẢ =================
DocGiaSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) return next();

    const last = await mongoose
      .model('DocGia')
      .findOne({ MaDocGia: { $regex: /^DG/ } })
      .sort({ createdAt: -1 });

    let number = 1;

    if (last && last.MaDocGia) {
      const parsed = parseInt(last.MaDocGia.replace('DG', ''));
      number = isNaN(parsed) ? 1 : parsed + 1;
    }

    this.MaDocGia = `DG${String(number).padStart(3, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});


// ================= HASH PASSWORD =================
DocGiaSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// ================= METHOD SO SÁNH PASSWORD =================
DocGiaSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


module.exports = mongoose.model('DocGia', DocGiaSchema);