const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database and routes
const db = require('./db');
const authRoutes = require('./routes/auth');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Stay Planner API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/db/status', (req, res) => {
  try {
    // Test database connection
    const result = db.db.prepare('SELECT 1 as test').get();
    res.json({ 
      ok: true, 
      message: 'Database connected successfully',
      test: result.test 
    });
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database status: http://localhost:${PORT}/api/db/status`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
});
