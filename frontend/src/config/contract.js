// Contract configuration for H2Credits with fraud prevention
export const CONTRACT_CONFIG = {
  address: '0xf01136fa90021B23D9F249D513f0DCBF8e51C20B',
  network: "sepolia",
  chainId: 11155111,
  rpcUrl: "https://sepolia.infura.io/v3/8b996c6a3b984ac681bac263eaff05c7",
  
  // Backend API configuration
  apiUrl: "http://localhost:3001/api",
  
  // Contract functions
  functions: {
    proposeBatch: "proposeBatch",
    approveBatch: "approveBatch", 
    issueCredits: "issueCredits",
    retireCredits: "retireCredits",
    transferCredits: "transferCredits",
    getBatch: "getBatch",
    getUserCredits: "getUserCredits",
    getUserRetiredCredits: "getUserRetiredCredits"
  },
  
  // Fraud prevention endpoints
  fraudEndpoints: {
    issueCredits: "/fraud/issue-credits",
    retireCredits: "/fraud/retire-credits", 
    demoFraud: "/fraud/demo-fraud",
    fraudEvents: "/fraud/fraud-events"
  },
  
  // Explorer links
  explorer: {
    base: "https://eth-sepolia.blockscout.com",
    address: `https://eth-sepolia.blockscout.com/address/0xf01136fa90021B23D9F249D513f0DCBF8e51C20B`,
    sourcify: `https://repo.sourcify.dev/contracts/full_match/11155111/0xf01136fa90021B23D9F249D513f0DCBF8e51C20B/`
  }
};

export default CONTRACT_CONFIG;
