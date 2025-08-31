const express = require('express');
const router = express.Router();
const db = require('../config/database');
const pinataClient = require('../ipfs/pinataClient');
const certificateGenerator = require('../pdf/certificateGenerator');

router.post('/', async (req, res) => {
    try {
      const { tokenId, amount, batchId, fromAddress, retirementReason } = req.body;
      
      // Validate required fields
      if (!tokenId || !amount || !batchId || !fromAddress) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Generate transaction hash
      const txHash = `0x${Math.random().toString(36).substr(2, 64)}`;
      
      // Generate PDF certificate
      const pdfDoc = await certificateGenerator.generateRetirementCertificate({
        tokenId,
        amount,
        batchId,
        fromAddress,
        retirementReason,
        txHash
      });
      
      // Get PDF buffer
      const pdfBuffer = await certificateGenerator.getBuffer();
      
      // Upload PDF to IPFS
      const pdfCID = await pinataClient.uploadFile(
        pdfBuffer, 
        `retirement-cert-${tokenId}-${Date.now()}.pdf`,
        'application/pdf'
      );
      
      // Store retirement in database
      const result = await db.query(
        'INSERT INTO events (event_type, token_id, amount, batch_id, from_address, tx_hash, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        ['retirement', tokenId, amount, batchId, fromAddress, txHash, { 
          reason: retirementReason,
          pdfCID: pdfCID,
          pdfURL: pinataClient.getGatewayURL(pdfCID)
        }]
      );
      
      res.json({
        success: true,
        retirement: result.rows[0],
        certificate: {
          pdfCID: pdfCID,
          pdfURL: pinataClient.getGatewayURL(pdfCID),
          downloadURL: `https://gateway.pinata.cloud/ipfs/${pdfCID}`
        },
        message: 'Retirement request created successfully with certificate'
      });
      
    } catch (error) {
      console.error('Error creating retirement:', error);
      res.status(500).json({ error: error.message });
    }
  });
  

// Get retirement history
router.get('/', async (req, res) => {
  try {
    const { fromAddress, tokenId, batchId } = req.query;
    let query = 'SELECT * FROM events WHERE event_type = $1';
    let params = ['retirement'];
    let paramCount = 1;
    
    if (fromAddress) {
      paramCount++;
      query += ` AND from_address = $${paramCount}`;
      params.push(fromAddress);
    }
    
    if (tokenId) {
      paramCount++;
      query += ` AND token_id = $${paramCount}`;
      params.push(tokenId);
    }
    
    if (batchId) {
      paramCount++;
      query += ` AND batch_id = $${paramCount}`;
      params.push(batchId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      retirements: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    console.error('Error fetching retirements:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;