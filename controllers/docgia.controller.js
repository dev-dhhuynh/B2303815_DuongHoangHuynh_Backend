const DocGia = require('../models/DocGia');
const bcrypt = require('bcrypt');

/* ================= LẤY DANH SÁCH ================= */
const getAllDocGia = async (req, res) => {
  try {
    const list = await DocGia.find().select('-password');
    res.json({ success: true, message: 'Lấy danh sách độc giả thành công', data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/* ================= LẤY CHI TIẾT ================= */
const getDocGiaById = async (req, res) => {
  try {
    const docGia = await DocGia.findById(req.params.id).select('-password');
    if (!docGia) return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    res.json({ success: true, data: docGia });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/* ================= CẬP NHẬT ADMIN ================= */
const updateDocGia = async (req, res) => {
  try {
    const updated = await DocGia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    res.json({ success: true, message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/* ================= XÓA ================= */
const deleteDocGia = async (req, res) => {
  try {
    const deleted = await DocGia.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    res.json({ success: true, message: 'Xóa độc giả thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/* ================= USER TỰ CẬP NHẬT ================= */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await DocGia.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    res.json({ success: true, message: 'Cập nhật thành công', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getAllDocGia,
  getDocGiaById,
  updateDocGia,
  deleteDocGia,
  updateProfile
};