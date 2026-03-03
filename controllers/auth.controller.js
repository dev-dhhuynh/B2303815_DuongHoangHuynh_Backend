const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');
const jwt = require('jsonwebtoken');

/* ================= TẠO TOKEN (FIX CỨNG KEY) ================= */
const generateToken = (userId, role, identifier) => {
    const JWT_SECRET_FIXED = "HoangHuynh_B2303815_SecretKey_2026";
    
    return jwt.sign(
        {
            id: userId.toString(),
            role,
            identifier
        },
        JWT_SECRET_FIXED,
        { expiresIn: '7d' }
    );
};

/* ================= REGISTER ADMIN (TẠO NHÂN VIÊN) ================= */
const registerAdmin = async (req, res) => {
    try {
        const { HoTenNV, password, ChucVu, DiaChi, SoDienThoai } = req.body;

        if (!HoTenNV || !password) {
            return res.status(400).json({
                success: false,
                message: 'Họ tên và mật khẩu là bắt buộc'
            });
        }

        // Tạo nhân viên mới (MSNV tự động tạo NVxxx theo Model)
        const newAdmin = await NhanVien.create({
            HoTenNV,
            password, 
            ChucVu: ChucVu || 'admin',
            DiaChi,
            SoDienThoai
        });

        res.status(201).json({
            success: true,
            message: 'Tạo tài khoản nhân viên thành công',
            admin: {
                MSNV: newAdmin.MSNV,
                HoTenNV: newAdmin.HoTenNV,
                ChucVu: newAdmin.ChucVu
            }
        });
    } catch (error) {
        console.error('❌ Lỗi tạo admin:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= LOGIN ADMIN (NHÂN VIÊN) ================= */
const loginAdmin = async (req, res) => {
    try {
        const { MSNV, password } = req.body;

        if (!MSNV || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập MSNV và mật khẩu'
            });
        }

        const admin = await NhanVien.findOne({ MSNV }).select('+password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'MSNV hoặc mật khẩu không đúng'
            });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'MSNV hoặc mật khẩu không đúng'
            });
        }

        // Tạo token với quyền admin
        const token = generateToken(admin._id, 'admin', admin.MSNV);

        res.json({
            success: true,
            message: 'Đăng nhập Admin thành công',
            token,
            admin: {
                id: admin._id,
                MSNV: admin.MSNV,
                HoTenNV: admin.HoTenNV,
                role: 'admin'
            }
        });

    } catch (error) {
        console.error('❌ Lỗi đăng nhập admin:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập admin' });
    }
};

/* ================= REGISTER USER (ĐỘC GIẢ) ================= */
const registerUser = async (req, res) => {
    try {
        let { email, password, HoDem, Ten, DienThoai, NgaySinh, Phai, DiaChi } = req.body;

        if (!email || !password || !HoDem || !Ten || !DienThoai) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin'
            });
        }

        email = email.toLowerCase();
        const emailExists = await DocGia.exists({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
        }

        const createdUser = await DocGia.create({
            email,
            password, 
            HoDem,
            Ten,
            DienThoai,
            NgaySinh: NgaySinh || null,
            Phai: Phai || 'Khac',
            DiaChi: DiaChi || ''
        });

        const token = generateToken(createdUser._id, 'user', createdUser.email);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            user: {
                _id: createdUser._id,
                MaDocGia: createdUser.MaDocGia,
                HoDem: createdUser.HoDem,
                Ten: createdUser.Ten,
                email: createdUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ================= LOGIN USER (ĐỘC GIẢ) ================= */
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Nhập email và mật khẩu' });
        }

        email = email.toLowerCase();
        const user = await DocGia.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Thông tin không chính xác' });
        }

        const token = generateToken(user._id, 'user', user.email);

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                _id: user._id,
                HoDem: user.HoDem,
                Ten: user.Ten,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin
};