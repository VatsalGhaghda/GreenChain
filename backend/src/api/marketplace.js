const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Create marketplace listing
router.post('/listings', async (req, res) => {
  try {
    const { sellerAddress, tokenId, amount, price } = req.body;
    
    // Validate required fields
    if (!sellerAddress || !tokenId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create listing
    const result = await db.query(
      'INSERT INTO marketplace_listings (seller_address, token_id, amount, price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sellerAddress, tokenId, amount, price || null, 'active']
    );
    
    res.json({
      success: true,
      listing: result.rows[0],
      message: 'Listing created successfully'
    });
    
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all marketplace listings
router.get('/listings', async (req, res) => {
  try {
    const { status, tokenId } = req.query;
    let query = 'SELECT * FROM marketplace_listings';
    let params = [];
    let conditions = [];
    
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (tokenId) {
      conditions.push(`token_id = $${params.length + 1}`);
      params.push(tokenId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      listings: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get listing by ID
router.get('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT * FROM marketplace_listings WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({
      success: true,
      listing: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update listing status
router.patch('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price } = req.body;
    
    let query = 'UPDATE marketplace_listings SET';
    let params = [];
    let updates = [];
    
    if (status !== undefined) {
      updates.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (price !== undefined) {
      updates.push(`price = $${params.length + 1}`);
      params.push(price);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    query += ' ' + updates.join(', ') + ' WHERE id = $' + (params.length + 1);
    params.push(id);
    
    const result = await db.query(query + ' RETURNING *', params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json({
      success: true,
      listing: result.rows[0],
      message: 'Listing updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;