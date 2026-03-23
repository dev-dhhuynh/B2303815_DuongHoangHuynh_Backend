const DocGia = require('../models/DocGia');
const bcrypt = require('bcrypt');

module.exports = {
  getAll: async (req, res) => res.json(await DocGia.find().select('-password')),

  getOne: async (req, res) => {
    const d = await DocGia.findById(req.params.id).select('-password');
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json(d);
  },

  update: async (req, res) => {
    await DocGia.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Đã cập nhật' });
  },

  delete: async (req, res) => {
    await DocGia.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa' });
  },

  updateSelf: async (req, res) => {
    try {
      const userId = req.user.id;
      const updateData = { ...req.body };

      console.log('🔄 User updating self - userId:', userId);
      console.log('📝 Update data:', updateData);
      console.log('🔍 userId type:', typeof userId);
      console.log('🔍 Request user object:', req.user);

      if (updateData.password) {
        if (updateData.password.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự'
          });
        }
        updateData.password = await bcrypt.hash(updateData.password, 10);
      } else {
        delete updateData.password;
      }

      if (updateData.email) {
        const existingUser = await DocGia.findOne({ email: updateData.email });

        console.log('🔍 DEBUG EMAIL CHECK ===============');
        console.log('   Email to check:', updateData.email);
        console.log('   Current userId (string):', userId);
        console.log('   Existing user found:', existingUser);

        if (existingUser) {
          console.log('   Existing user ID:', existingUser._id.toString());
          console.log('   Existing user ID type:', typeof existingUser._id.toString());
          console.log('   Current user ID type:', typeof userId);
          console.log('   Are they equal?', existingUser._id.toString() === userId);
          console.log('   Are they strictly equal?', existingUser._id.toString() === String(userId));

          const userIdStr = String(userId);
          const existingUserIdStr = existingUser._id.toString();

          console.log('   userIdStr:', userIdStr);
          console.log('   existingUserIdStr:', existingUserIdStr);
          console.log('   Final comparison:', userIdStr !== existingUserIdStr);

          if (userIdStr !== existingUserIdStr) {
            console.log('   ❌ Email already used by different user');
            return res.status(400).json({
              success: false,
              message: 'Email đã được sử dụng bởi tài khoản khác'
            });
          }
          console.log('   ✅ Same user, email update allowed');
        } else {
          console.log('   ✅ No existing user with this email');
        }
        console.log('====================================');
      }

      if (updateData.MaDocGia) {
        delete updateData.MaDocGia;
      }

      console.log('📤 Final update data:', updateData);

      const updatedUser = await DocGia.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      console.log('✅ User updated successfully:', updatedUser._id);

      res.json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        user: updatedUser
      });

    } catch (error) {
      console.error('❌ Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật thông tin',
        error: error.message
      });
    }
  }
};