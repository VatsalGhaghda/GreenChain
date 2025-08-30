const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all events
router.get('/', async (req, res) => {
  try {
    const { batchId } = req.query;
    let query = 'SELECT * FROM events ORDER BY created_at DESC';
    let params = [];
    
    if (batchId) {
      query = 'SELECT * FROM events WHERE batch_id = $1 ORDER BY created_at DESC';
      params = [batchId];
    }
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      events: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add demo event
router.post('/demo', async (req, res) => {
  try {
    const { eventType, batchId, amount } = req.body;
    
    const result = await db.query(
      'INSERT INTO events (event_type, tx_hash, batch_id, amount) VALUES ($1, $2, $3, $4) RETURNING *',
      [eventType, `0x${Math.random().toString(36).substr(2, 64)}`, batchId, amount]
    );
    
    res.json({
      success: true,
      event: result.rows[0],
      message: 'Demo event created'
    });
    
  } catch (error) {
    console.error('Error creating demo event:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;