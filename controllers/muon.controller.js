const MuonSach = require('../models/MuonSach');
const Sach = require('../models/Sach.model'); // Kiểm tra lại nếu file là Sach.js thì sửa lại nhé
const DocGia = require('../models/DocGia');

/* ================= USER FUNCTIONS ================= */

// Tạo yêu cầu mượn sách
const requestBorrow = async (req, res) => {
    try {
        const { MaSach, NgayTraDuKien } = req.body;
        const MaDocGia = req.user.id;
        const duplicate = await MuonSach.findOne({ MaDocGia, MaSach, status: { $in: ['pending', 'approved'] } });
        if (duplicate) return res.status(400).json({ success: false, message: 'Bạn đang yêu cầu hoặc đang mượn sách này' });

        const newRequest = await MuonSach.create({ MaDocGia, MaSach, NgayTraDuKien, status: 'pending' });
        res.status(201).json({ success: true, message: 'Gửi yêu cầu thành công', data: newRequest });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

// Xem danh sách mượn của chính mình
const getByUser = async (req, res) => {
    try {
        const list = await MuonSach.find({ MaDocGia: req.user.id }).populate('MaSach');
        res.json({ success: true, data: list });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

/* ================= ADMIN FUNCTIONS ================= */

const getAll = async (req, res) => {
    try {
        const list = await MuonSach.find().populate('MaDocGia MaSach');
        res.json({ success: true, data: list });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const listPending = async (req, res) => {
    try {
        const list = await MuonSach.find({ status: 'pending' }).populate('MaDocGia MaSach');
        res.json({ success: true, data: list });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const listApproved = async (req, res) => {
    try {
        const list = await MuonSach.find({ status: 'approved' }).populate('MaDocGia MaSach');
        res.json({ success: true, data: list });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const approveBorrow = async (req, res) => {
    try {
        const record = await MuonSach.findById(req.params.id);
        if (!record || record.status !== 'pending') return res.status(400).json({ success: false, message: 'Yêu cầu không hợp lệ' });
        
        const sach = await Sach.findById(record.MaSach);
        if (!sach || sach.SoQuyen <= 0) return res.status(400).json({ success: false, message: 'Hết sách' });

        sach.SoQuyen -= 1; await sach.save();
        record.status = 'approved'; record.NgayMuon = new Date();
        await record.save();
        res.json({ success: true, message: 'Đã duyệt', data: record });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const rejectRequest = async (req, res) => {
    try {
        const record = await MuonSach.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json({ success: true, message: 'Đã từ chối', data: record });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const markReturned = async (req, res) => {
    try {
        const record = await MuonSach.findById(req.params.id);
        if (!record || record.status !== 'approved') return res.status(400).json({ success: false, message: 'Không thể trả' });
        
        record.status = 'returned'; record.NgayTra = new Date();
        await record.save();
        const sach = await Sach.findById(record.MaSach);
        if (sach) { sach.SoQuyen += 1; await sach.save(); }
        res.json({ success: true, message: 'Đã trả sách', data: record });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const deleteRecord = async (req, res) => {
    try {
        await MuonSach.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Đã xóa' });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const getStats = async (req, res) => {
    try {
        const totalPending = await MuonSach.countDocuments({ status: 'pending' });
        const totalApproved = await MuonSach.countDocuments({ status: 'approved' });
        res.json({ success: true, data: { totalPending, totalApproved } });
    } catch (error) { res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

module.exports = {
    requestBorrow, getByUser, markReturned,
    getAll, listPending, listApproved,
    approveBorrow, rejectRequest, deleteRecord, getStats
};