const express = require('express');
const router = express.Router();

const docGiaController = require('../controllers/docgia.controller');
const authAdmin = require('../middleware/authAdmin');
const authUser = require('../middleware/authUser');

/**
 * =========================
 * USER ROUTES
 * =========================
 */

// Người dùng cập nhật thông tin cá nhân (Khớp với updateProfile trong controller)
router.put('/me', authUser, docGiaController.updateProfile);


/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Lấy danh sách độc giả (Khớp với getAllDocGia)
router.get('/', authAdmin, docGiaController.getAllDocGia);

// Lấy chi tiết độc giả (Khớp với getDocGiaById)
router.get('/:id', authAdmin, docGiaController.getDocGiaById);

// Cập nhật độc giả (Khớp với updateDocGia)
router.put('/:id', authAdmin, docGiaController.updateDocGia);

// Xóa độc giả (Khớp với deleteDocGia)
router.delete('/:id', authAdmin, docGiaController.deleteDocGia);

module.exports = router;