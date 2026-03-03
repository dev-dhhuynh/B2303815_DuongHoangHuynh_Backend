require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

/* =======================
   1. Middleware
======================= */

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder (upload ảnh)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


/* =======================
   2. Routes
======================= */

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/sach', require('./routes/sach.routes'));
app.use('/api/nxb', require('./routes/nxb.routes'));
app.use('/api/docgia', require('./routes/docgia.routes'));
app.use('/api/nhanvien', require('./routes/nhanvien.routes'));
app.use('/api/muon', require('./routes/muon.routes'));


/* =======================
   3. 404 Handler
======================= */

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});


/* =======================
   4. Global Error Handler
======================= */

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  // Mongoose ObjectId error
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});


/* =======================
   5. Start Server
======================= */

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Stop server nếu DB fail
  });