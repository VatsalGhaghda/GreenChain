const { ethers } = require('ethers');
const db = require('../config/database');
const contractClient = require('../blockchain/contractClient');

class EventIndexer {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.isRunning = false;
    this.lastProcessedBlock = 0;
  }

  // Initialize the indexer
  async initialize(rpcUrl, contractAddress, abi) {
    try {
      console.log('�� Initializing Event Indexer...');
      
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.contract = new ethers.Contract(contractAddress, abi, this.provider);
      
      // Get last processed block from database
      await this.loadLastProcessedBlock();
      
      console.log('✅ Event Indexer initialized successfully');
      console.log(`📍 Contract: ${contractAddress}`);
      console.log(`📍 Last processed block: ${this.lastProcessedBlock}`);
      
      return true;
    } catch (error) {
      console.error('❌ Event Indexer initialization failed:', error);
      throw error;
    }
  }

  // Load last processed block from database
  async loadLastProcessedBlock() {
    try {
      const result = await db.query(
        'SELECT MAX(block_number) as last_block FROM events WHERE block_number IS NOT NULL'
      );
      
      this.lastProcessedBlock = result.rows[0].last_block || 0;
      console.log(`📊 Loaded last processed block: ${this.lastProcessedBlock}`);
    } catch (error) {
      console.error('❌ Failed to load last processed block:', error);
      this.lastProcessedBlock = 0;
    }
  }

  // Start listening to events
  async startListening() {
    if (this.isRunning) {
      console.log('⚠️ Event Indexer is already running');
      return;
    }

    try {
      console.log('🎧 Starting event listening...');
      this.isRunning = true;

      // Listen to BatchProposed events
      this.contract.on('BatchProposed', async (batchId, producer, amountKg, cid, event) => {
        await this.handleBatchProposed(batchId, producer, amountKg, cid, event);
      });

      // Listen to BatchApproved events
      this.contract.on('BatchApproved', async (batchId, approver, event) => {
        await this.handleBatchApproved(batchId, approver, event);
      });

      // Listen to CreditsIssued events
      this.contract.on('CreditsIssued', async (batchId, tokenId, amount, event) => {
        await this.handleCreditsIssued(batchId, tokenId, amount, event);
      });

      // Listen to CreditsTransferred events
      this.contract.on('CreditsTransferred', async (tokenId, from, to, amount, event) => {
        await this.handleCreditsTransferred(tokenId, from, to, amount, event);
      });

      // Listen to CreditsRetired events
      this.contract.on('CreditsRetired', async (tokenId, by, amount, retirementCID, event) => {
        await this.handleCreditsRetired(tokenId, by, amount, retirementCID, event);
      });

      console.log('✅ Event listening started successfully');
      
    } catch (error) {
      console.error('❌ Failed to start event listening:', error);
      this.isRunning = false;
      throw error;
    }
  }

  // Handle BatchProposed event
  async handleBatchProposed(batchId, producer, amountKg, cid, event) {
    try {
      console.log(`📝 Processing BatchProposed: ${batchId}`);
      
      await db.query(
        'INSERT INTO events (event_type, batch_id, from_address, amount, metadata, tx_hash, block_number) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['BatchProposed', batchId, producer, amountKg, { cid: cid }, event.transactionHash, event.blockNumber]
      );

      console.log(`✅ BatchProposed event indexed: ${batchId}`);
    } catch (error) {
      console.error(`❌ Failed to index BatchProposed event: ${error.message}`);
    }
  }

  // Handle BatchApproved event
  async handleBatchApproved(batchId, approver, event) {
    try {
      console.log(`✅ Processing BatchApproved: ${batchId}`);
      
      await db.query(
        'INSERT INTO events (event_type, batch_id, from_address, tx_hash, block_number) VALUES ($1, $2, $3, $4, $5)',
        ['BatchApproved', batchId, approver, event.transactionHash, event.blockNumber]
      );

      console.log(`✅ BatchApproved event indexed: ${batchId}`);
    } catch (error) {
      console.error(`❌ Failed to index BatchApproved event: ${error.message}`);
    }
  }

  // Handle CreditsIssued event
  async handleCreditsIssued(batchId, tokenId, amount, event) {
    try {
      console.log(`�� Processing CreditsIssued: ${batchId} -> Token ${tokenId}`);
      
      await db.query(
        'INSERT INTO events (event_type, batch_id, token_id, amount, tx_hash, block_number) VALUES ($1, $2, $3, $4, $5, $6)',
        ['CreditsIssued', batchId, tokenId, amount, event.transactionHash, event.blockNumber]
      );

      // Update batch status to issued
      await db.query(
        'UPDATE batches SET status = $1, token_id = $2 WHERE batch_id = $3',
        ['issued', tokenId, batchId]
      );

      console.log(`✅ CreditsIssued event indexed: ${batchId} -> Token ${tokenId}`);
    } catch (error) {
      console.error(`❌ Failed to index CreditsIssued event: ${error.message}`);
    }
  }

  // Handle CreditsTransferred event
  async handleCreditsTransferred(tokenId, from, to, amount, event) {
    try {
      console.log(`�� Processing CreditsTransferred: Token ${tokenId}`);
      
      await db.query(
        'INSERT INTO events (event_type, token_id, from_address, to_address, amount, tx_hash, block_number) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['CreditsTransferred', tokenId, from, to, amount, event.transactionHash, event.blockNumber]
      );

      console.log(`✅ CreditsTransferred event indexed: Token ${tokenId}`);
    } catch (error) {
      console.error(`❌ Failed to index CreditsTransferred event: ${error.message}`);
    }
  }

  // Handle CreditsRetired event
  async handleCreditsRetired(tokenId, by, amount, retirementCID, event) {
    try {
      console.log(`♻️ Processing CreditsRetired: Token ${tokenId}`);
      
      await db.query(
        'INSERT INTO events (event_type, token_id, from_address, amount, metadata, tx_hash, block_number) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['CreditsRetired', tokenId, by, amount, { retirementCID: retirementCID }, event.transactionHash, event.blockNumber]
      );

      console.log(`✅ CreditsRetired event indexed: Token ${tokenId}`);
    } catch (error) {
      console.error(`❌ Failed to index CreditsRetired event: ${error.message}`);
    }
  }

  // Stop listening to events
  stopListening() {
    if (!this.isRunning) {
      console.log('⚠️ Event Indexer is not running');
      return;
    }

    try {
      console.log('🛑 Stopping event listening...');
      
      // Remove all listeners
      this.contract.removeAllListeners();
      this.isRunning = false;
      
      console.log('✅ Event listening stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop event listening:', error);
    }
  }

  // Get indexer status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastProcessedBlock: this.lastProcessedBlock,
      contractAddress: this.contract?.target,
      provider: this.provider?.connection?.url
    };
  }
}

module.exports = new EventIndexer();