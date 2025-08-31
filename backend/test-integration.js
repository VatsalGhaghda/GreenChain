require('dotenv').config();
const { ethers } = require('ethers');
const contractConfig = require('./src/blockchain/contractConfig');

async function testIntegration() {
    console.log('🧪 Testing Backend-Blockchain Integration\n');
    
    try {
        // Initialize provider and contract directly
        console.log('1. Initializing blockchain connection...');
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const network = await provider.getNetwork();
        console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})\n`);
        
        // Initialize wallet
        console.log('2. Initializing wallet...');
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log(`✅ Wallet connected: ${wallet.address}\n`);
        
        // Initialize contract
        console.log('3. Initializing contract...');
        const contract = new ethers.Contract(
            contractConfig.address,
            contractConfig.abi,
            provider
        );
        console.log(`✅ Contract connected: ${contractConfig.address}\n`);
        
        // Test contract read operations
        console.log('4. Testing contract read operations...');
        const contractName = await contract.name();
        console.log(`✅ Contract name: ${contractName}`);
        
        const contractSymbol = await contract.symbol();
        console.log(`✅ Contract symbol: ${contractSymbol}\n`);
        
        // Test user balance query
        console.log('5. Testing balance queries...');
        const balance = await contract.balanceOf(wallet.address, 1);
        console.log(`✅ User balance for token 1: ${balance.toString()}\n`);
        
        console.log('🎉 Backend-Blockchain Integration Test PASSED!');
        console.log('📊 Summary:');
        console.log('   - RPC Connection: ✅');
        console.log('   - Wallet Connection: ✅');
        console.log('   - Contract Connection: ✅');
        console.log('   - Read Operations: ✅');
        
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        process.exit(1);
    }
}

testIntegration();
