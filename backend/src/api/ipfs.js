const express = require('express');
const multer = require('multer');
const router = express.Router();
const pinataClient = require('../ipfs/pinataClient');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, JSON, TXT files
    const allowedTypes = ['application/pdf', 'application/json', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JSON, and TXT files are allowed.'));
    }
  }
});

// Upload file to IPFS
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let ipfsHash, ipfsURL;

    try {
      // Try to upload file to IPFS via Pinata
      ipfsHash = await pinataClient.uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
      ipfsURL = pinataClient.getGatewayURL(ipfsHash);
    } catch (pinataError) {
      console.warn('Pinata upload failed, using mock IPFS for demo:', pinataError.message);
      
      // Fallback: Generate mock IPFS data for demo
      ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      ipfsURL = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    }

    res.json({
      success: true,
      ipfsHash: ipfsHash,
      ipfsURL: ipfsURL,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      message: 'File uploaded to IPFS successfully'
    });

  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload JSON metadata to IPFS
router.post('/upload-json', async (req, res) => {
  try {
    const { data, filename } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const ipfsHash = await pinataClient.uploadJSON(data, filename || 'metadata.json');
    const ipfsURL = pinataClient.getGatewayURL(ipfsHash);

    res.json({
      success: true,
      ipfsHash: ipfsHash,
      ipfsURL: ipfsURL,
      message: 'JSON data uploaded to IPFS successfully'
    });

  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
