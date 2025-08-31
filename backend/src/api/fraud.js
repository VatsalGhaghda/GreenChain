const express = require('express');
const router = express.Router();
const contractClient = require('../blockchain/contractClient');

// Issue credits with fraud detection
router.post('/issue-credits', async (req, res) => {
  try {
    const { batchId, recipient, amount } = req.body;
    
    if (!batchId || !recipient || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: batchId, recipient, amount'
      });
    }

    const receipt = await contractClient.issueCredits(batchId, recipient, amount);
    
    res.json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        batchId,
        recipient,
        amount,
        blockNumber: receipt.blockNumber
      }
    });
  } catch (error) {
    console.error('Fraud detection - Issue credits failed:', error);
    
    // Check for fraud detection errors
    if (error.message.includes('Duplicate credit issue detected')) {
      return res.status(409).json({
        success: false,
        error: 'FRAUD_DETECTED',
        message: 'Duplicate credit issue attempt detected',
        fraudType: 'DUPLICATE_ISSUE'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Credit issuance failed',
      message: error.message
    });
  }
});

// Retire credits with fraud detection
router.post('/retire-credits', async (req, res) => {
  try {
    const { batchId, amount, reason } = req.body;
    
    if (!batchId || !amount || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: batchId, amount, reason'
      });
    }

    const receipt = await contractClient.retireCredits(batchId, amount, reason);
    
    res.json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        batchId,
        amount,
        reason,
        blockNumber: receipt.blockNumber
      }
    });
  } catch (error) {
    console.error('Fraud detection - Retire credits failed:', error);
    
    // Check for fraud detection errors
    if (error.message.includes('Double retirement detected')) {
      return res.status(409).json({
        success: false,
        error: 'FRAUD_DETECTED',
        message: 'Double retirement attempt detected',
        fraudType: 'DOUBLE_RETIREMENT'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Credit retirement failed',
      message: error.message
    });
  }
});

// Demo fraud scenarios
router.post('/demo-fraud', async (req, res) => {
  try {
    const { fraudType, batchId, recipient, amount, reason } = req.body;
    
    let result;
    
    switch (fraudType) {
      case 'DUPLICATE_ISSUE':
        // First issue
        await contractClient.issueCredits(batchId, recipient, amount);
        // Try duplicate issue (should fail)
        result = await contractClient.issueCredits(batchId, recipient, amount);
        break;
        
      case 'DOUBLE_RETIREMENT':
        // First retirement
        await contractClient.retireCredits(batchId, amount, reason);
        // Try duplicate retirement (should fail)
        result = await contractClient.retireCredits(batchId, amount, reason);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid fraud type. Use DUPLICATE_ISSUE or DOUBLE_RETIREMENT'
        });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    // This is expected for fraud demo
    res.json({
      success: false,
      fraudDetected: true,
      fraudType: req.body.fraudType,
      message: error.message
    });
  }
});

// Get fraud events
router.get('/fraud-events', async (req, res) => {
  try {
    const events = await contractClient.getEvents('FraudAttemptDetected');
    
    const fraudEvents = events.map(event => ({
      fraudType: event.args[0],
      actor: event.args[1],
      timestamp: event.args[2],
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));
    
    res.json({
      success: true,
      data: fraudEvents
    });
  } catch (error) {
    console.error('Get fraud events failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve fraud events',
      message: error.message
    });
  }
});

module.exports = router;
