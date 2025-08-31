// Contract configuration for H2Credits with fraud prevention
const CONTRACT_CONFIG = {
  address: "0xf01136fa90021B23D9F249D513f0DCBF8e51C20B",
  network: "sepolia",
  rpcUrl: "https://sepolia.infura.io/v3/8b996c6a3b984ac681bac263eaff05c7",
  
  // Key functions for fraud prevention
  functions: {
    // Core functions
    proposeBatch: "proposeBatch(uint256,uint256,string)",
    approveBatch: "approveBatch(uint256)",
    issueCredits: "issueCredits(uint256,address,uint256)",
    retireCredits: "retireCredits(uint256,uint256,string)",
    transferCredits: "transferCredits(uint256,address,uint256)",
    
    // Fraud prevention functions
    issuedCreditsHashes: "issuedCreditsHashes(bytes32)",
    retiredCreditsHashes: "retiredCreditsHashes(bytes32)",
    
    // View functions
    getBatch: "getBatch(uint256)",
    getUserCredits: "getUserCredits(uint256,address)",
    getUserRetiredCredits: "getUserRetiredCredits(uint256,address)",
    getTotalBatches: "getTotalBatches()"
  },
  
  // Events for monitoring
  events: {
    BatchProposed: "BatchProposed",
    BatchApproved: "BatchApproved", 
    CreditsIssued: "CreditsIssued",
    CreditsRetired: "CreditsRetired",
    CreditsTransferred: "CreditsTransferred",
    FraudAttemptDetected: "FraudAttemptDetected"
  }
};

module.exports = CONTRACT_CONFIG;
