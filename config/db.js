const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Nếu process.env.MONGO_URI không đọc được, dùng tạm chuỗi cứng này
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quanlymuonsach';
    
    console.log('--- Đang kết nối Database ---');
    console.log('URI sử dụng:', uri);

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    console.log('👉 Nhắc Huỳnh: Bạn cần cài đặt và mở MongoDB Community Server / Compass lên nhé!');
    // Tạm thời comment dòng dưới để server không bị tắt ngang khi chưa có DB
    // process.exit(1); 
  }
};

module.exports = connectDB;