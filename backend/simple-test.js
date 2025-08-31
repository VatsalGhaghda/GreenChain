require('dotenv').config();
const { ethers } = require('ethers');

async function simpleTest() {
    try {
        console.log('Testing RPC connection...');
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const network = await provider.getNetwork();
        console.log('Network:', network.chainId.toString());
        
        if (process.env.PRIVATE_KEY) {
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            console.log('Wallet:', wallet.address);
        }
        
        console.log('Connection successful!');
    } catch (error) {
        console.log('Error:', error.message);
    }
}

simpleTest();
