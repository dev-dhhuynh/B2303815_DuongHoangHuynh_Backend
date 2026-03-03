const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // 1️⃣ Kiểm tra header tồn tại
    if (!authorization) {
      console.log('❌ Không có header Authorization');
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập'
      });
    }

    // 2️⃣ Kiểm tra định dạng Bearer token
    const arr = authorization.split(' ');
    if (arr.length !== 2 || arr[0] !== 'Bearer') {
      console.log('❌ Authorization sai định dạng');
      return res.status(401).json({
        message: 'Token không đúng định dạng'
      });
    }

    const token = arr[1];

    // 3️⃣ Giải mã token - ĐÃ FIX CỨNG SECRET KEY ĐỂ KHỚP VỚI CONTROLLER
    const JWT_SECRET_FIXED = "HoangHuynh_B2303815_SecretKey_2026";
    const decoded = jwt.verify(token, JWT_SECRET_FIXED);

    // 4️⃣ Kiểm tra quyền admin
    if (decoded.role !== 'admin') {
      console.log('⛔ Người dùng không phải admin');
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập (Yêu cầu quyền Admin)'
      });
    }

    // 5️⃣ Gắn thông tin user vào request
    req.user = decoded;

    console.log('✅ Xác thực admin thành công');
    next();

  } catch (error) {
    console.log('❌ Lỗi xác thực token:', error.message);
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = adminMiddleware;