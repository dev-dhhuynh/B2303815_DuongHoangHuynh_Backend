const MuonSach = require('../models/MuonSach');
const Sach = require('../models/Sach');
const DocGia = require('../models/DocGia');
const NhanVien = require('../models/NhanVien');

module.exports = {
  requestBorrow: async (req, res) => {
    try {
      const { MaSach, NgayTraDuKien } = req.body;
      const MaDocGia = req.user.id;
      const sach = await Sach.findById(MaSach);
      if (!sach) return res.status(404).json({ message: 'Sách không tồn tại' });

      const reqRecord = new MuonSach({
        MaDocGia,
        MaSach,
        NgayTraDuKien,
        status: 'pending'
      });
      await reqRecord.save();
      res.json({ message: 'Yêu cầu mượn đã được gửi (chờ duyệt)', reqRecord });
    } catch (err) { res.status(500).json({ message: err.message }); }
  },

  listPending: async (req, res) => {
    const pending = await MuonSach.find({ status: 'pending' }).populate('MaDocGia', 'HoLot Ten email').populate('MaSach', 'TenSach SoQuyen');
    res.json(pending);
  },

  listApproved: async (req, res) => {
    // Hiển thị cả sách đã duyệt và đã trả
    const approved = await MuonSach.find({
      status: { $in: ['approved', 'returned'] }
    })
      .populate('MaDocGia', 'HoLot Ten email')
      .populate('MaSach', 'TenSach')
      .sort({ createdAt: -1 });
    res.json(approved);
  },

  approveBorrow: async (req, res) => {
    try {
      const id = req.params.id;
      const adminId = req.admin.id;
      const rec = await MuonSach.findById(id);
      if (!rec) return res.status(404).json({ message: 'Record not found' });
      if (rec.status !== 'pending') return res.status(400).json({ message: 'Không phải trạng thái pending' });

      const sach = await Sach.findById(rec.MaSach);
      if (!sach) return res.status(404).json({ message: 'Sách không tồn tại' });

      if (sach.SoQuyen <= 0) {
        rec.status = 'rejected';
        await rec.save();
        return res.status(400).json({ message: 'Không đủ quyển để mượn. Yêu cầu bị từ chối' });
      }

      sach.SoQuyen = sach.SoQuyen - 1;
      await sach.save();

      rec.status = 'approved';
      rec.approvedBy = adminId;
      rec.NgayMuon = rec.NgayMuon || Date.now();
      await rec.save();

      res.json({ message: 'Đã duyệt yêu cầu mượn', rec });
    } catch (err) { res.status(500).json({ message: err.message }); }
  },

  markReturned: async (req, res) => {
    try {
      const id = req.params.id;
      const rec = await MuonSach.findById(id);
      if (!rec) return res.status(404).json({ message: 'Record not found' });
      if (rec.status !== 'approved') return res.status(400).json({ message: 'Chỉ có thể trả khi đang ở trạng thái approved' });

      rec.status = 'returned';
      rec.NgayTra = Date.now();
      await rec.save();

      const sach = await Sach.findById(rec.MaSach);
      if (sach) {
        sach.SoQuyen = (sach.SoQuyen || 0) + 1;
        await sach.save();
      }

      res.json({ message: 'Đã trả sách', rec });
    } catch (err) { res.status(500).json({ message: err.message }); }
  },

  rejectRequest: async (req, res) => {
    try {
      const id = req.params.id;
      const rec = await MuonSach.findById(id);
      if (!rec) return res.status(404).json({ message: 'Record not found' });
      if (rec.status !== 'pending') return res.status(400).json({ message: 'Chỉ đóng yêu cầu đang chờ' });

      rec.status = 'rejected';
      await rec.save();
      res.json({ message: 'Đã từ chối yêu cầu', rec });
    } catch (err) { res.status(500).json({ message: err.message }); }
  },

  getByUser: async (req, res) => {
    const id = req.user.id;
    const items = await MuonSach.find({ MaDocGia: id }).populate('MaSach', 'TenSach').sort({ createdAt: -1 });
    res.json(items);
  },

  getAll: async (req, res) => {
    const q = req.query.status;
    const filter = q ? { status: q } : {};
    const items = await MuonSach.find(filter)
      .populate('MaDocGia', 'HoLot Ten email DienThoai')
      .populate('MaSach', 'TenSach TacGia SoQuyen')
      .sort({ createdAt: -1 });
    res.json(items);
  },

  // Thêm vào muon.controller.js, sau hàm getAll
  getStats: async (req, res) => {
    try {
      const totalBooks = await Sach.countDocuments();
      const availableBooks = await Sach.aggregate([
        { $group: { _id: null, total: { $sum: "$SoQuyen" } } }
      ]);

      const totalReaders = await DocGia.countDocuments();

      // Tổng số lượt mượn đã được duyệt (approved + returned)
      const totalApprovedBorrows = await MuonSach.countDocuments({
        status: { $in: ['approved', 'returned'] }
      });

      // Tổng số lượt mượn đang chờ duyệt
      const totalPendingBorrows = await MuonSach.countDocuments({ status: 'pending' });

      // Tổng số lượt mượn đã trả
      const totalReturnedBorrows = await MuonSach.countDocuments({ status: 'returned' });

      // Tổng số lượt mượn đang mượn (chưa trả)
      const totalCurrentBorrows = await MuonSach.countDocuments({ status: 'approved' });

      res.json({
        totalBooks,
        availableBooks: availableBooks[0]?.total || 0,
        totalReaders,
        totalBorrows: totalApprovedBorrows, // Tổng tất cả lượt mượn đã duyệt
        totalPendingBorrows,
        totalApprovedBorrows, // Tổng lượt đã duyệt (approved + returned)
        totalReturnedBorrows,
        totalCurrentBorrows
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteRecord: async (req, res) => {
    try {
      const id = req.params.id;
      const record = await MuonSach.findById(id);

      if (!record) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
      }

      if (record.status === 'approved') {
        return res.status(400).json({
          message: 'Không thể xoá bản ghi đang mượn. Vui lòng đánh dấu đã trả trước.'
        });
      }

      await MuonSach.findByIdAndDelete(id);
      res.json({ message: 'Đã xoá bản ghi mượn sách' });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
