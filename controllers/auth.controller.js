const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signToken = (payload) => {
  console.log('🔐 Signing token with payload:', payload);
  console.log('🔐 payload._id:', payload._id);
  console.log('🔐 payload._id type:', typeof payload._id);

  const tokenPayload = {
    id: String(payload._id || payload.id),
    role: payload.role,
    email: payload.email || payload.MSNV || ''
  };

  console.log('🔐 Final token payload:', tokenPayload);

  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { email, password, HoLot, Ten, DienThoai, NgaySinh, Phai, DiaChi } = req.body;

      if (!email || !password || !HoLot || !Ten || !DienThoai) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      const existingEmail = await DocGia.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new DocGia({
        email,
        password: hashedPassword,
        HoLot,
        Ten,
        DienThoai,
        NgaySinh: NgaySinh || null,
        Phai: Phai || 'Khac',
        DiaChi: DiaChi || ''
      });

      await newUser.save();

      const token = signToken({
        id: newUser._id,
        role: 'user',
        email: newUser.email
      });

      const userResponse = {
        _id: newUser._id,
        MaDocGia: newUser.MaDocGia,
        HoLot: newUser.HoLot,
        Ten: newUser.Ten,
        NgaySinh: newUser.NgaySinh,
        Phai: newUser.Phai,
        DiaChi: newUser.DiaChi,
        DienThoai: newUser.DienThoai,
        email: newUser.email
      };

      res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng ký'
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập email và mật khẩu'
        });
      }

      const user = await DocGia.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      const token = signToken({
        id: user._id,
        role: 'user',
        email: user.email
      });

      const userResponse = {
        _id: user._id,
        MaDocGia: user.MaDocGia,
        HoLot: user.HoLot,
        Ten: user.Ten,
        NgaySinh: user.NgaySinh,
        Phai: user.Phai,
        DiaChi: user.DiaChi,
        DienThoai: user.DienThoai,
        email: user.email
      };

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập'
      });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { MSNV, password } = req.body;
      const admin = await NhanVien.findOne({ MSNV });
      if (!admin) return res.status(400).json({
        success: false,
        message: 'Sai MSNV hoặc mật khẩu'
      });

      const match = await bcrypt.compare(password, admin.password || '');
      if (!match) return res.status(400).json({
        success: false,
        message: 'Sai MSNV hoặc mật khẩu'
      });

      const token = signToken({
        id: admin._id,
        role: 'admin',
        MSNV: admin.MSNV
      });

      res.json({
        success: true,
        message: 'Đăng nhập admin thành công',
        token,
        admin: {
          id: admin._id,
          MSNV: admin.MSNV,
          HoTenNV: admin.HoTenNV
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};