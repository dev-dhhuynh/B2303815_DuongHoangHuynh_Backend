const jwt = require('jsonwebtoken');

const userMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    // 1️⃣ Kiểm tra header
    if (!authorization) {
      console.log('❌ Không có Authorization header');
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập'
      });
    }

    const parts = authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('❌ Header Authorization sai định dạng');
      return res.status(401).json({
        message: 'Token không hợp lệ'
      });
    }

    const token = parts[1];

    // 2️⃣ Giải mã token - ĐÃ FIX CỨNG SECRET KEY ĐỂ KHÁM PHÁ TOKEN CỦA HUỲNH
    const JWT_SECRET_FIXED = "HoangHuynh_B2303815_SecretKey_2026";
    const decoded = jwt.verify(token, JWT_SECRET_FIXED);

    // 3️⃣ Kiểm tra id hợp lệ
    if (!decoded.id && !decoded._id) {
      console.log('❌ Token không chứa id hợp lệ');
      return res.status(401).json({
        message: 'Token không hợp lệ'
      });
    }

    const userId = decoded.id || decoded._id;

    // 4️⃣ Gắn user vào request
    req.user = {
      id: String(userId),
      role: decoded.role || 'user',
      email: decoded.identifier || decoded.email || null
    };

    console.log('✅ Xác thực user thành công:', req.user.id);

    next();

  } catch (error) {
    console.log('❌ Lỗi xác thực token:', error.message);
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = userMiddleware;