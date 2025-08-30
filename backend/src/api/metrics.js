const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get overview metrics
router.get('/overview', async (req, res) => {
  try {
    const [totalBatches, pendingBatches, approvedBatches, totalUsers] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM batches'),
      db.query('SELECT COUNT(*) as count FROM batches WHERE status = $1', ['pending']),
      db.query('SELECT COUNT(*) as count FROM batches WHERE status = $1', ['approved']),
      db.query('SELECT COUNT(*) as count FROM users')
    ]);
    
    res.json({
      success: true,
      metrics: {
        totalBatches: parseInt(totalBatches.rows[0].count),
        pendingBatches: parseInt(pendingBatches.rows[0].count),
        approvedBatches: parseInt(approvedBatches.rows[0].count),
        totalUsers: parseInt(totalUsers.rows[0].count),
        complianceRate: '95%', // Demo value
        avgCarbonIntensity: 1.2 // Demo value
      }
    });
    
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;