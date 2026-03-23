const Sach = require('../models/Sach');
const NXB = require('../models/NXB');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

module.exports = {
  getAll: async (req, res) => {
    const q = req.query.q || '';
    const filter = q ? { TenSach: { $regex: q, $options: 'i' } } : {};
    const data = await Sach.find(filter).populate('MaNXB', 'TenNXB');
    res.json(data);
  },

  getOne: async (req, res) => {
    try {
      const s = await Sach.findById(req.params.id).populate('MaNXB', 'TenNXB');
      if (!s) return res.status(404).json({ message: 'Không tìm thấy sách' });
      res.json(s);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const s = new Sach(req.body);

      if (req.file) {
        s.HinhBia = `/uploads/book-covers/${req.file.filename}`;
      }

      await s.save();
      res.json({ message: 'Đã thêm sách', sach: s });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.HinhBia = `/uploads/book-covers/${req.file.filename}`;

        const oldBook = await Sach.findById(req.params.id);
        if (oldBook && oldBook.HinhBia) {
          const oldImagePath = path.join(__dirname, '../public', oldBook.HinhBia);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      if (updateData.MaNXB) {
        if (updateData.MaNXB === '' || updateData.MaNXB === 'null' || updateData.MaNXB === null) {
          delete updateData.MaNXB;
        } else if (mongoose.Types.ObjectId.isValid(updateData.MaNXB)) {
          updateData.MaNXB = new mongoose.Types.ObjectId(updateData.MaNXB);
        }
      }

      const s = await Sach.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('MaNXB', 'TenNXB');

      if (!s) {
        return res.status(404).json({ message: 'Không tìm thấy sách' });
      }

      res.json({ message: 'Đã cập nhật', sach: s });
    } catch (error) {
      console.error('❌ Update book error:', error);
      res.status(500).json({
        message: 'Lỗi server khi cập nhật sách',
        error: error.message,
        details: error.errors
      });
    }
  },

  delete: async (req, res) => {
    try {
      const book = await Sach.findById(req.params.id);
      if (book && book.HinhBia) {
        const imagePath = path.join(__dirname, '../public', book.HinhBia);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await Sach.findByIdAndDelete(req.params.id);
      res.json({ message: 'Đã xóa' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};