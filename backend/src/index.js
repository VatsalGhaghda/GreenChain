const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import API routes
const authRoutes = require('./api/auth');
const batchRoutes = require('./api/batches');
const metricsRoutes = require('./api/metrics');
const eventRoutes = require('./api/events');

// Use API routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/events', eventRoutes);

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is running!', timestamp: new Date().toISOString() });
});

// Database test route
app.get('/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    const result = await db.query('SELECT COUNT(*) as user_count FROM users');
    res.json({ 
      message: 'Database connection successful!', 
      userCount: result.rows[0].user_count,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`📍 API endpoints available at /api/*`);
});