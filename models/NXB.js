const mongoose = require('mongoose');

const NXBSchema = new mongoose.Schema(
  {
    MaNXB: {
      type: String,
      unique: true,
      index: true
    },

    TenNXB: {
      type: String,
      required: [true, 'Tên nhà xuất bản là bắt buộc'],
      trim: true
    },

    DiaChi: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);


// ================= AUTO TẠO MÃ NXB =================
NXBSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) return next();

    const last = await mongoose
      .model('NXB')
      .findOne({ MaNXB: { $regex: /^NXB/ } })
      .sort({ createdAt: -1 });

    let number = 1;

    if (last && last.MaNXB) {
      const parsed = parseInt(last.MaNXB.replace('NXB', ''));
      number = isNaN(parsed) ? 1 : parsed + 1;
    }

    this.MaNXB = `NXB${String(number).padStart(3, '0')}`;

    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('NXB', NXBSchema);