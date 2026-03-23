const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sach.controller');
const authAdmin = require('../middleware/authAdmin');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/book-covers'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.post('/', authAdmin, upload.single('HinhBia'), ctrl.create);
router.put('/:id', authAdmin, upload.single('HinhBia'), ctrl.update);
router.delete('/:id', authAdmin, ctrl.delete);

module.exports = router;