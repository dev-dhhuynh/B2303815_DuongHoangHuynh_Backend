const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const NhanVienSchema = new mongoose.Schema(
  {
    MSNV: {
      type: String,
      unique: true,
      index: true
    },

    HoTenNV: {
      type: String,
      required: [true, 'Họ tên nhân viên là bắt buộc'],
      trim: true
    },

    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
      select: false
    },

    ChucVu: {
      type: String,
      enum: {
        values: ['admin', 'staff'],
        message: 'Chức vụ không hợp lệ'
      },
      default: 'staff'
    },

    DiaChi: {
      type: String,
      trim: true
    },

    SoDienThoai: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);


// ================= AUTO TẠO MÃ NHÂN VIÊN =================
NhanVienSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) return next();

    const last = await mongoose
      .model('NhanVien')
      .findOne({ MSNV: { $regex: /^NV/ } })
      .sort({ createdAt: -1 });

    let number = 1;

    if (last && last.MSNV) {
      const parsed = parseInt(last.MSNV.replace('NV', ''));
      number = isNaN(parsed) ? 1 : parsed + 1;
    }

    this.MSNV = `NV${String(number).padStart(3, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});


// ================= HASH PASSWORD =================
NhanVienSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


// ================= SO SÁNH PASSWORD =================
NhanVienSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


module.exports = mongoose.model('NhanVien', NhanVienSchema);