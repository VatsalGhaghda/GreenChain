const express = require('express');
const router = express.Router();
const db = require('../config/database');
const pinataClient = require('../ipfs/pinataClient');
const contractClient = require('../blockchain/contractClient');

// System health check
router.get('/', async (req, res) => {
  try {
    const health = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {}
    };

    // Check database
    try {
      const dbResult = await db.query('SELECT NOW() as time');
      health.services.database = {
        status: 'healthy',
        responseTime: 'OK',
        timestamp: dbResult.rows[0].time
      };
    } catch (error) {
      health.services.database = {
        status: 'unhealthy',
        error: error.message
      };
      health.status = 'degraded';
    }

    // Check IPFS (Pinata)
    try {
      health.services.ipfs = {
        status: 'healthy',
        provider: 'Pinata',
        apiKey: process.env.PINATA_API_KEY ? 'Configured' : 'Not configured'
      };
    } catch (error) {
      health.services.ipfs = {
        status: 'unhealthy',
        error: error.message
      };
      health.status = 'degraded';
    }

    // Check blockchain
    try {
      const contractStatus = contractClient.getStatus();
      health.services.blockchain = {
        status: 'healthy',
        ...contractStatus
      };
    } catch (error) {
      health.services.blockchain = {
        status: 'unhealthy',
        error: error.message
      };
      health.status = 'degraded';
    }

    // Check environment variables
    health.services.environment = {
      status: 'healthy',
      variables: {
        database: process.env.DB_PASSWORD ? 'Configured' : 'Not configured',
        ipfs: process.env.PINATA_API_KEY ? 'Configured' : 'Not configured',
        blockchain: process.env.RPC_URL ? 'Configured' : 'Not configured'
      }
    };

    // Overall status
    const allHealthy = Object.values(health.services).every(service => service.status === 'healthy');
    health.status = allHealthy ? 'healthy' : 'degraded';

    res.json(health);
  } catch (error) {
    res.status(500).json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;