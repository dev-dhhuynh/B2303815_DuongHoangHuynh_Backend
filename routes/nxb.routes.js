const express = require('express');
const router = express.Router();

const nxbController = require('../controllers/nxb.controller');
const authAdmin = require('../middleware/authAdmin');

/**
 * =========================
 * PUBLIC
 * =========================
 */

// Sửa từ .getAll thành .getAllNXB cho khớp với controller
router.get('/', nxbController.getAllNXB);


/**
 * =========================
 * ADMIN ONLY
 * =========================
 */

// Sửa thành .createNXB
router.post('/', authAdmin, nxbController.createNXB);

// Sửa thành .updateNXB
router.put('/:id', authAdmin, nxbController.updateNXB);

// Sửa thành .deleteNXB
router.delete('/:id', authAdmin, nxbController.deleteNXB);

module.exports = router;