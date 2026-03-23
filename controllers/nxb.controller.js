const NXB = require('../models/NXB');

module.exports = {
  getAll: async (req, res) => res.json(await NXB.find()),
  create: async (req, res) => {
    const p = new NXB(req.body);
    await p.save();
    res.json({ message: 'Đã thêm NXB' });
  },
  update: async (req, res) => {
    await NXB.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Đã cập nhật' });
  },
  delete: async (req, res) => {
    await NXB.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa' });
  }
};
