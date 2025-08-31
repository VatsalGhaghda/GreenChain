require('dotenv').config();
const { ethers } = require('ethers');
const contractConfig = require('./src/blockchain/contractConfig');

async function testConnection() {
    console.log('🔧 Testing blockchain connection...');
    
    try {
        // Test RPC connection
        console.log('📡 Connecting to RPC:', process.env.RPC_URL);
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        
        // Test network connection
        const network = await provider.getNetwork();
        console.log('✅ Connected to network:', network.name, 'Chain ID:', network.chainId.toString());
        
        // Test wallet connection
        if (process.env.PRIVATE_KEY) {
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            console.log('✅ Wallet connected:', wallet.address);
            
            // Test balance
            const balance = await provider.getBalance(wallet.address);
            console.log('💰 Wallet balance:', ethers.formatEther(balance), 'ETH');
        } else {
            console.log('⚠️  No private key found - read-only mode');
        }
        
        // Test contract connection
        console.log('📄 Testing contract connection...');
        const contract = new ethers.Contract(
            contractConfig.address,
            contractConfig.abi,
            provider
        );
        
        // Test contract call
        const name = await contract.name();
        console.log('✅ Contract connected:', name);
        
        console.log('🎉 All connections successful!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
