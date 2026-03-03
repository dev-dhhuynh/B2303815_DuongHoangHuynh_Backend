const mongoose = require('mongoose');

const muonSachSchema = new mongoose.Schema(
  {
    DocGia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocGia',
      required: true
    },

    NhanVienDuyet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NhanVien',
      default: null
    },

    DanhSachSach: [
      {
        Sach: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Sach',
          required: true
        },
        SoLuong: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        }
      }
    ],

    NgayMuon: {
      type: Date,
      default: Date.now
    },

    HanTra: {
      type: Date,
      required: true
    },

    NgayTra: {
      type: Date,
      default: null
    },

    TrangThai: {
      type: String,
      enum: ['cho_duyet', 'da_duyet', 'da_tra', 'tu_choi'],
      default: 'cho_duyet'
    },

    GhiChu: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MuonSach', muonSachSchema);