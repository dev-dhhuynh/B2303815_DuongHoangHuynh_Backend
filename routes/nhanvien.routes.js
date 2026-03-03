const express = require('express');
const router = express.Router();

const nhanVienController = require('../controllers/nhanvien.controller');
const authAdmin = require('../middleware/authAdmin');

/**
 * =========================
 * ADMIN ONLY
 * =========================
 */

// Lấy danh sách nhân viên - Đã sửa thành getAllNhanVien
router.get('/', authAdmin, nhanVienController.getAllNhanVien);

// Tạo nhân viên mới - Đã sửa thành createNhanVien
router.post('/', authAdmin, nhanVienController.createNhanVien);

// Cập nhật nhân viên - Đã sửa thành updateNhanVien
router.put('/:id', authAdmin, nhanVienController.updateNhanVien);

// Xóa nhân viên - Đã sửa thành deleteNhanVien
router.delete('/:id', authAdmin, nhanVienController.deleteNhanVien);

module.exports = router;