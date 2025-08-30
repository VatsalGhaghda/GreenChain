const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Submit new batch
router.post('/submit', async (req, res) => {
  try {
    const { batchId, amountKg, metadata, producer } = req.body;
    
    // Validate required fields
    if (!batchId || !amountKg || !metadata || !producer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Store in database
    const result = await db.query(
      'INSERT INTO batches (batch_id, producer_address, amount_kg, metadata_cid, status) VALUES (, , , , ) RETURNING *',
      [batchId, producer, amountKg, metadata, 'pending']
    );
    
    res.json({
      success: true,
      batch: result.rows[0],
      message: 'Batch submitted successfully'
    });
    
  } catch (error) {
    console.error('Error submitting batch:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get pending batches
router.get('/pending', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM batches WHERE status =  ORDER BY created_at DESC',
      ['pending']
    );
    
    res.json({
      success: true,
      batches: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching pending batches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all batches
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM batches ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      batches: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Approve batch (demo mode)
router.post('/approve/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Update batch status
    const result = await db.query(
      'UPDATE batches SET status =  WHERE batch_id =  RETURNING *',
      ['approved', batchId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    res.json({
      success: true,
      batch: result.rows[0],
      message: 'Batch approved successfully'
    });
    
  } catch (error) {
    console.error('Error approving batch:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
