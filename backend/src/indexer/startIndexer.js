require('dotenv').config();
const eventIndexer = require('./eventIndexer');

// Sample ABI (you'll replace this with your actual contract ABI)
const sampleABI = [
  "event BatchProposed(bytes32 indexed batchId, address indexed producer, uint256 amountKg, string cid)",
  "event BatchApproved(bytes32 indexed batchId, address approver)",
  "event CreditsIssued(bytes32 indexed batchId, uint256 indexed tokenId, uint256 amount)",
  "event CreditsTransferred(uint256 indexed tokenId, address indexed from, address indexed to, uint256 amount)",
  "event CreditsRetired(uint256 indexed tokenId, address indexed by, uint256 amount, string retirementCID)"
];

async function startIndexer() {
  try {
    console.log('🚀 Starting GreenChain Event Indexer...');
    
    // Initialize indexer
    await eventIndexer.initialize(
      process.env.RPC_URL,
      process.env.CONTRACT_ADDRESS,
      sampleABI
    );
    
    // Start listening to events
    await eventIndexer.startListening();
    
    console.log('✅ Event Indexer started successfully!');
    console.log('📊 Status:', eventIndexer.getStatus());
    
    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Event Indexer...');
      eventIndexer.stopListening();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start Event Indexer:', error);
    process.exit(1);
  }
}

// Start the indexer
startIndexer();