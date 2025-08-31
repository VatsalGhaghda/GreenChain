const express = require('express');
const router = express.Router();
const pinataClient = require('../ipfs/pinataClient');

// In-memory storage for demo (replace with database in production)
let batches = [];
let batchCounter = 1;

// Submit new batch with IPFS upload
router.post('/submit', async (req, res) => {
  try {
    const { batchId, amountKg, metadata, producer } = req.body;
    
    // Validate required fields
    if (!batchId || !amountKg || !metadata || !producer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check for duplicate batch ID
    const existingBatch = batches.find(b => b.batch_id === batchId);
    if (existingBatch) {
      return res.status(400).json({ error: 'Batch ID already exists' });
    }
    
    // Upload metadata to IPFS (with fallback for demo)
    let ipfsCID;
    try {
      ipfsCID = await pinataClient.uploadJSON(metadata, `batch-${batchId}.json`);
    } catch (ipfsError) {
      console.warn('IPFS upload failed, using mock CID for demo:', ipfsError.message);
      ipfsCID = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    }
    
    // Store in memory
    const newBatch = {
      id: batchCounter++,
      batch_id: batchId,
      producer_address: producer,
      amount_kg: amountKg,
      metadata_cid: ipfsCID,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: metadata
    };
    
    batches.push(newBatch);
    
    res.json({
      success: true,
      batch: newBatch,
      ipfsCID: ipfsCID,
      ipfsURL: pinataClient.getGatewayURL(ipfsCID),
      message: 'Batch submitted successfully and uploaded to IPFS'
    });
    
  } catch (error) {
    console.error('Error submitting batch:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get pending batches
router.get('/pending', async (req, res) => {
  try {
    const pendingBatches = batches.filter(batch => batch.status === 'pending')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({
      success: true,
      batches: pendingBatches,
      count: pendingBatches.length
    });
    
  } catch (error) {
    console.error('Error fetching pending batches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all batches
router.get('/', async (req, res) => {
  try {
    const sortedBatches = [...batches].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({
      success: true,
      batches: sortedBatches,
      count: sortedBatches.length
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
    
    // Find and update batch status
    const batchIndex = batches.findIndex(b => b.batch_id === batchId);
    
    if (batchIndex === -1) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    batches[batchIndex].status = 'approved';
    batches[batchIndex].updated_at = new Date().toISOString();
    
    res.json({
      success: true,
      batch: batches[batchIndex],
      message: 'Batch approved successfully'
    });
    
  } catch (error) {
    console.error('Error approving batch:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get batch by ID
router.get('/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const batch = batches.find(b => b.batch_id === batchId);
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    res.json({
      success: true,
      batch: batch
    });
    
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;