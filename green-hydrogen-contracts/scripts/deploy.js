const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting H2Credits deployment...");
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🔗 Network:", network.name);
  console.log("🔢 Chain ID:", network.chainId);

  // Get the contract factory
  const H2Credits = await ethers.getContractFactory("H2Credits");
  console.log("📋 Contract factory loaded");

  // Deploy the contract
  console.log("⛏️ Deploying H2Credits contract...");
  const h2Credits = await H2Credits.deploy();
  
  // Wait for deployment to complete
  await h2Credits.waitForDeployment();
  
  const contractAddress = await h2Credits.getAddress();
  console.log("✅ H2Credits deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("👤 Deployer:", (await ethers.getSigners())[0].address);

  // Verify deployment by calling a view function
  try {
    const totalBatches = await h2Credits.getTotalBatches();
    console.log("📊 Initial total batches:", totalBatches.toString());
    
    // Check if deployer has all roles
    const hasProposerRole = await h2Credits.hasRole(await h2Credits.PROPOSER_ROLE(), (await ethers.getSigners())[0].address);
    const hasApproverRole = await h2Credits.hasRole(await h2Credits.APPROVER_ROLE(), (await ethers.getSigners())[0].address);
    const hasOperatorRole = await h2Credits.hasRole(await h2Credits.OPERATOR_ROLE(), (await ethers.getSigners())[0].address);
    
    console.log("🔐 Deployer roles:");
    console.log("   - PROPOSER_ROLE:", hasProposerRole);
    console.log("   - APPROVER_ROLE:", hasApproverRole);
    console.log("   - OPERATOR_ROLE:", hasOperatorRole);
    
  } catch (error) {
    console.log("⚠️ Warning: Could not verify contract state:", error.message);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📝 Next steps:");
  console.log("   1. Save the contract address above");
  console.log("   2. Run tests: npx hardhat test");
  console.log("   3. Verify on Blockscout and Sourcify");
  
  // If on Sepolia, provide verification info
  if (network.chainId === 11155111n) {
    console.log("\n🔍 For verification (Blockscout + Sourcify):");
    console.log("   npx hardhat verify --network sepolia", contractAddress);
    console.log("\n🔗 View on Blockscout:");
    console.log(`   https://eth-sepolia.blockscout.com/address/${contractAddress}#code`);
    console.log("\n🔗 View on Sourcify:");
    console.log(`   https://repo.sourcify.dev/contracts/full_match/11155111/${contractAddress}/`);
  }
  
  return contractAddress;
}

// Handle errors
main()
  .then((address) => {
    console.log("\n🏆 H2Credits contract deployed at:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
