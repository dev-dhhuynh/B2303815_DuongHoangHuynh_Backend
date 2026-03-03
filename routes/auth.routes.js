const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * ===== USER =====
 */
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

/**
 * ===== ADMIN =====
 */
router.post('/admin/login', authController.loginAdmin);
router.post('/admin/register', authController.registerAdmin);
module.exports = router;