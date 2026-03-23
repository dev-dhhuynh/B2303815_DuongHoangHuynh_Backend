require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sach', require('./routes/sach.routes'));
app.use('/api/nxb', require('./routes/nxb.routes'));
app.use('/api/docgia', require('./routes/docgia.routes'));
app.use('/api/nhanvien', require('./routes/nhanvien.routes'));
app.use('/api/muon', require('./routes/muon.routes'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));