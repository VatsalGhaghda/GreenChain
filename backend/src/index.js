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
const transferRoutes = require('./api/transfers');
const marketplaceRoutes = require('./api/marketplace');
const retirementRoutes = require('./api/retirement');
const healthRoutes = require('./api/health');
const fraudRoutes = require('./api/fraud');
const ipfsRoutes = require('./api/ipfs');
const performanceMonitor = require('./monitoring/performance');

// Use API routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/retirement', retirementRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/ipfs', ipfsRoutes);

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const success = res.statusCode < 400;
    performanceMonitor.recordRequest(responseTime, success);
  });
  
  next();
});

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