const express = require('express');
const router = express.Router();

// Simple demo auth - in real app, this would use JWT
router.post('/login', (req, res) => {
  const { address, role } = req.body;
  
  // Demo mode - accept any valid address
  if (address && address.length === 42 && address.startsWith('0x')) {
    res.json({
      success: true,
      user: { address, role: role || 'producer' },
      message: 'Demo login successful'
    });
  } else {
    res.status(400).json({ error: 'Invalid address format' });
  }
});

// Get user info
router.get('/me', (req, res) => {
  // Demo mode - return mock user
  res.json({
    address: '0x1234567890123456789012345678901234567890',
    role: 'producer',
    name: 'Demo User'
  });
});

module.exports = router;
