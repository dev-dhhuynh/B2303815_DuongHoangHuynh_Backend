const express = require('express');
const router = express.Router();

const muonController = require('../controllers/muon.controller');
const authUser = require('../middleware/authUser');
const authAdmin = require('../middleware/authAdmin');

/**
 * =========================
 *          USER
 * =========================
 */

// Tạo yêu cầu mượn sách
router.post('/', authUser, muonController.requestBorrow);

// Xem danh sách mượn của chính mình
router.get('/me', authUser, muonController.getByUser);

// Trả sách (user hoặc admin đều có thể gọi, quyền xử lý trong controller)
router.put('/:id/return', authUser, muonController.markReturned);


/**
 * =========================
 *          ADMIN
 * =========================
 */

// Thống kê
router.get('/stats', authAdmin, muonController.getStats);

// Danh sách chờ duyệt
router.get('/pending', authAdmin, muonController.listPending);

// Danh sách đã duyệt
router.get('/approved', authAdmin, muonController.listApproved);

// Lấy tất cả
router.get('/', authAdmin, muonController.getAll);

// Duyệt yêu cầu
router.put('/:id/approve', authAdmin, muonController.approveBorrow);

// Từ chối yêu cầu
router.put('/:id/reject', authAdmin, muonController.rejectRequest);

// Xóa record
router.delete('/:id', authAdmin, muonController.deleteRecord);

module.exports = router;