const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing Sepolia connection...");
  
  try {
    // Get network info
    const network = await ethers.provider.getNetwork();
    console.log("✅ Connection successful!");
    console.log("🔗 Network:", network.name);
    console.log("🔢 Chain ID:", network.chainId);
    
    // Get signer info
    const [signer] = await ethers.getSigners();
    console.log("👤 Signer address:", signer.address);
    
    // Get balance
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Full error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
