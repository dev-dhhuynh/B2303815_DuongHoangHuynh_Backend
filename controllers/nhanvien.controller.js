const NhanVien = require('../models/NhanVien');
const bcrypt = require('bcrypt');

module.exports = {
  getAll: async (req, res) => res.json(await NhanVien.find().select('-password')),

  create: async (req, res) => {
  try {
    const { MSNV, HoTenNV, password, ChucVu } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const nv = new NhanVien({
      MSNV,
      HoTenNV,
      password: hashed,
      ChucVu
    });

    await nv.save();

    res.status(201).json({
      message: 'Đã tạo nhân viên',
      data: nv   // 👈 thêm cái này để lấy _id luôn
    });

  } catch (err) {
    console.error('Create NV error:', err);
    res.status(500).json({
      message: 'Lỗi tạo nhân viên'
    });
  }
},

  update: async (req, res) => {
    const body = { ...req.body };
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    await NhanVien.findByIdAndUpdate(req.params.id, body);
    res.json({ message: 'Đã cập nhật' });
  },

  delete: async (req, res) => {
  try {
    const deleted = await NhanVien.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Không tìm thấy nhân viên'
      });
    }

    res.json({ message: 'Đã xóa' });

  } catch (err) {
    console.error('Delete error:', err);
    res.status(400).json({
      message: 'ID không hợp lệ'
    });
  }
}
};
