const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

router.post('/user/register', auth.registerUser);
router.post('/user/login', auth.loginUser);
router.post('/admin/login', auth.loginAdmin);

module.exports = router;