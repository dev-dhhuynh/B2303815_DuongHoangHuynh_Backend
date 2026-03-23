const mongoose = require('mongoose');

const NXBSchema = new mongoose.Schema({
  MaNXB: { type: String, unique: true, sparse: true },
  TenNXB: String,
  DiaChi: String
}, { timestamps: true });

module.exports = mongoose.model('NXB', NXBSchema);