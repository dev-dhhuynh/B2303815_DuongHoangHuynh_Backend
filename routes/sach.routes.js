const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const sachController = require('../controllers/sach.controller');
const authAdmin = require('../middleware/authAdmin');

/**
 * =========================
 * UPLOAD CONFIG
 * =========================
 */
const uploadDir = path.join(__dirname, '../public/uploads/book-covers');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      'book-' +
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

/**
 * =========================
 * ROUTES
 * =========================
 */

// PUBLIC
router.get('/', sachController.getAllSach);
router.get('/:id', sachController.getSachById);

// ADMIN ONLY
router.post(
  '/',
  authAdmin,
  upload.single('HinhBia'),
  sachController.createSach
);

router.put(
  '/:id',
  authAdmin,
  upload.single('HinhBia'),
  sachController.updateSach
);

router.delete('/:id', authAdmin, sachController.deleteSach);

// ============================================================
// DÒNG NÀY LÀ QUAN TRỌNG NHẤT - BẠN ĐANG THIẾU DÒNG NÀY:
module.exports = router; 
// ============================================================