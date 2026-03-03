const NhanVien = require('../models/NhanVien');
const bcrypt = require('bcrypt');

/* ================= LẤY DANH SÁCH ================= */
const getAllNhanVien = async (req, res) => {
  try {
    const list = await NhanVien.find().select('-password');
    res.json({
      success: true,
      message: 'Lấy danh sách nhân viên thành công',
      data: list
    });
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách nhân viên:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/* ================= TẠO NHÂN VIÊN ================= */
const createNhanVien = async (req, res) => {
  try {
    const { MSNV, HoTenNV, password, ChucVu } = req.body;

    if (!MSNV || !HoTenNV || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const existed = await NhanVien.findOne({ MSNV });
    if (existed) {
      return res.status(400).json({ success: false, message: 'MSNV đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newNhanVien = await NhanVien.create({
      MSNV,
      HoTenNV,
      password: hashedPassword,
      ChucVu: ChucVu || 'Nhân viên'
    });

    res.status(201).json({
      success: true,
      message: 'Tạo nhân viên thành công',
      data: { id: newNhanVien._id, MSNV: newNhanVien.MSNV, HoTenNV: newNhanVien.HoTenNV }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo nhân viên' });
  }
};

/* ================= CẬP NHẬT ================= */
const updateNhanVien = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await NhanVien.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });

    res.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/* ================= XÓA ================= */
const deleteNhanVien = async (req, res) => {
  try {
    const deleted = await NhanVien.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    res.json({ success: true, message: 'Xóa nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// EXPORT ĐÚNG TÊN HÀM
module.exports = {
  getAllNhanVien,
  createNhanVien,
  updateNhanVien,
  deleteNhanVien
};