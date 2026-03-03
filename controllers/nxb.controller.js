const NXB = require('../models/NXB');

/* ================= LẤY DANH SÁCH ================= */
const getAllNXB = async (req, res) => {
  try {
    const list = await NXB.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Lấy danh sách nhà xuất bản thành công',
      data: list
    });

  } catch (error) {
    console.error('❌ Lỗi lấy danh sách NXB:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/* ================= TẠO NXB ================= */
const createNXB = async (req, res) => {
  try {
    const { TenNXB, DiaChi, DienThoai } = req.body;

    if (!TenNXB) {
      return res.status(400).json({
        success: false,
        message: 'Tên nhà xuất bản là bắt buộc'
      });
    }

    const existed = await NXB.findOne({ TenNXB });
    if (existed) {
      return res.status(400).json({
        success: false,
        message: 'Nhà xuất bản đã tồn tại'
      });
    }

    const newNXB = await NXB.create({
      TenNXB,
      DiaChi: DiaChi || '',
      DienThoai: DienThoai || ''
    });

    res.status(201).json({
      success: true,
      message: 'Thêm nhà xuất bản thành công',
      data: newNXB
    });

  } catch (error) {
    console.error('❌ Lỗi thêm NXB:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm NXB'
    });
  }
};

/* ================= CẬP NHẬT ================= */
const updateNXB = async (req, res) => {
  try {
    const updated = await NXB.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật nhà xuất bản thành công',
      data: updated
    });

  } catch (error) {
    console.error('❌ Lỗi cập nhật NXB:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/* ================= XÓA ================= */
const deleteNXB = async (req, res) => {
  try {
    const deleted = await NXB.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà xuất bản'
      });
    }

    res.json({
      success: true,
      message: 'Xóa nhà xuất bản thành công'
    });

  } catch (error) {
    console.error('❌ Lỗi xóa NXB:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa'
    });
  }
};

module.exports = {
  getAllNXB,
  createNXB,
  updateNXB,
  deleteNXB
};