const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const errorHandler = require('./middleware/errorHandler');
const menuRoutes = require('./routes/menu');
const reservationRoutes = require('./routes/reservations');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5000', 'https://restaurant-website-pvz6.onrender.com'],
  credentials: true
}));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve public frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Fallback to index.html for non-API routes (SPA routing)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
