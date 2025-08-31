const { ethers } = require('ethers');
const CONTRACT_CONFIG = require('./contractConfig');

class ContractClient {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contractAddress = null;
    this.contract = null;
  }

  // Initialize contract with ABI
  async initialize(rpcUrl, contractAddress, abi) {
    try {
      console.log('🔧 Initializing Contract Client...');
      
      // Initialize provider
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      console.log('✅ Provider initialized');
      
      // Initialize wallet (only if private key is provided)
      if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'your_actual_private_key_here') {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        console.log('✅ Wallet initialized');
      } else {
        console.log('⚠️ No private key provided - read-only mode');
      }
      
      // Initialize contract
      this.contractAddress = contractAddress;
      if (this.wallet) {
        this.contract = new ethers.Contract(contractAddress, abi, this.wallet);
      } else {
        this.contract = new ethers.Contract(contractAddress, abi, this.provider);
      }
      
      console.log('✅ Contract initialized successfully');
      console.log(`📍 Contract Address: ${contractAddress}`);
      console.log(`📍 RPC URL: ${rpcUrl}`);
      
      return this.contract;
    } catch (error) {
      console.error('❌ Contract initialization failed:', error);
      throw error;
    }
  }

  // Propose batch to smart contract (requires wallet)
  async proposeBatch(batchId, amountKg, metadataCID) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      if (!this.wallet) {
        throw new Error('Wallet not initialized - cannot send transactions');
      }

      console.log('Proposing batch:', batchId);
      const tx = await this.contract.proposeBatch(batchId, amountKg, metadataCID);
      const receipt = await tx.wait();
      
      console.log('✅ Batch proposed successfully, TX:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('❌ Batch proposal failed:', error);
      throw error;
    }
  }

  // Approve batch (requires wallet)
  async approveBatch(batchId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      if (!this.wallet) {
        throw new Error('Wallet not initialized - cannot send transactions');
      }

      console.log('Approving batch:', batchId);
      const tx = await this.contract.approveBatch(batchId);
      const receipt = await tx.wait();
      
      console.log('✅ Batch approved successfully, TX:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('❌ Batch approval failed:', error);
      throw error;
    }
  }

  // Get contract events (read-only, no wallet needed)
  async getEvents(eventName, fromBlock = 0) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      console.log(`📡 Querying events: ${eventName} from block ${fromBlock}`);
      const events = await this.contract.queryFilter(eventName, fromBlock);
      console.log(`✅ Found ${events.length} events`);
      
      return events;
    } catch (error) {
      console.error('❌ Event query failed:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getBalance() {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized');
      }
      
      const balance = await this.wallet.getBalance();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Balance check failed:', error);
      throw error;
    }
  }

  // Issue credits with fraud prevention (requires wallet)
  async issueCredits(batchId, recipient, amount) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      if (!this.wallet) {
        throw new Error('Wallet not initialized - cannot send transactions');
      }

      console.log('Issuing credits:', { batchId, recipient, amount });
      const tx = await this.contract.issueCredits(batchId, recipient, amount);
      const receipt = await tx.wait();
      
      console.log('✅ Credits issued successfully, TX:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('❌ Credit issuance failed:', error);
      throw error;
    }
  }

  // Retire credits with fraud prevention (requires wallet)
  async retireCredits(batchId, amount, reason) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      if (!this.wallet) {
        throw new Error('Wallet not initialized - cannot send transactions');
      }

      console.log('Retiring credits:', { batchId, amount, reason });
      const tx = await this.contract.retireCredits(batchId, amount, reason);
      const receipt = await tx.wait();
      
      console.log('✅ Credits retired successfully, TX:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('❌ Credit retirement failed:', error);
      throw error;
    }
  }

  // Get batch information
  async getBatch(batchId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      console.log('Getting batch info:', batchId);
      const batch = await this.contract.getBatch(batchId);
      console.log('✅ Batch info retrieved');
      
      return batch;
    } catch (error) {
      console.error('❌ Batch info retrieval failed:', error);
      throw error;
    }
  }

  // Get user credits
  async getUserCredits(batchId, userAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const credits = await this.contract.getUserCredits(batchId, userAddress);
      return credits;
    } catch (error) {
      console.error('❌ User credits retrieval failed:', error);
      throw error;
    }
  }

  // Get contract status
  getStatus() {
    return {
      provider: this.provider ? 'Connected' : 'Not connected',
      wallet: this.wallet ? 'Initialized' : 'Not initialized',
      contract: this.contract ? 'Initialized' : 'Not initialized',
      contractAddress: this.contractAddress,
      rpcUrl: this.provider?.connection?.url
    };
  }
}

module.exports = new ContractClient();