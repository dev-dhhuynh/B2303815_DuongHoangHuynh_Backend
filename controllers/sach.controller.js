const Sach = require('../models/Sach.model');
const NXB = require('../models/NXB');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

/* ================= LẤY DANH SÁCH ================= */
const getAllSach = async (req, res) => {
  try {
    const keyword = req.query.q || '';

    const filter = keyword
      ? { TenSach: { $regex: keyword, $options: 'i' } }
      : {};

    const list = await Sach.find(filter)
      .populate('MaNXB', 'TenNXB')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Lấy danh sách sách thành công',
      data: list
    });

  } catch (error) {
    console.error('❌ Lỗi lấy danh sách sách:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/* ================= LẤY CHI TIẾT ================= */
const getSachById = async (req, res) => {
  try {
    const book = await Sach.findById(req.params.id)
      .populate('MaNXB', 'TenNXB');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    res.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('❌ Lỗi lấy chi tiết sách:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/* ================= TẠO SÁCH ================= */
const createSach = async (req, res) => {
  try {
    const { TenSach, TacGia, SoQuyen, MaNXB } = req.body;

    if (!TenSach || !SoQuyen) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    if (SoQuyen < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng không hợp lệ'
      });
    }

    if (MaNXB) {
      const existedNXB = await NXB.findById(MaNXB);
      if (!existedNXB) {
        return res.status(400).json({
          success: false,
          message: 'Nhà xuất bản không tồn tại'
        });
      }
    }

    const newBook = new Sach(req.body);

    if (req.file) {
      newBook.HinhBia = `/uploads/book-covers/${req.file.filename}`;
    }

    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Thêm sách thành công',
      data: newBook
    });

  } catch (error) {
    console.error('❌ Lỗi thêm sách:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm sách'
    });
  }
};

/* ================= CẬP NHẬT ================= */
const updateSach = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.SoQuyen && updateData.SoQuyen < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng không hợp lệ'
      });
    }

    if (updateData.MaNXB && mongoose.Types.ObjectId.isValid(updateData.MaNXB)) {
      const existedNXB = await NXB.findById(updateData.MaNXB);
      if (!existedNXB) {
        return res.status(400).json({
          success: false,
          message: 'Nhà xuất bản không tồn tại'
        });
      }
    }

    if (req.file) {
      updateData.HinhBia = `/uploads/book-covers/${req.file.filename}`;

      const oldBook = await Sach.findById(req.params.id);
      if (oldBook?.HinhBia) {
        const oldPath = path.join(__dirname, '../public', oldBook.HinhBia);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const updated = await Sach.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('MaNXB', 'TenNXB');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sách thành công',
      data: updated
    });

  } catch (error) {
    console.error('❌ Lỗi cập nhật sách:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

/* ================= XÓA ================= */
const deleteSach = async (req, res) => {
  try {
    const book = await Sach.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    if (book.HinhBia) {
      const imagePath = path.join(__dirname, '../public', book.HinhBia);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: 'Xóa sách thành công'
    });

  } catch (error) {
    console.error('❌ Lỗi xóa sách:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  getAllSach,
  getSachById,
  createSach,
  updateSach,
  deleteSach
};