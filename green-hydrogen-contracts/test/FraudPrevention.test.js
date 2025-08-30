const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("H2Credits Fraud Prevention", function () {
  let H2Credits, h2Credits, owner, proposer, approver, operator, user1, user2;
  let batchId = 1;
  const metadataURI = "ipfs://QmTestMetadata";
  const totalCredits = 1000;
  const approvedCredits = 800;
  const issueAmount = 200; // Reduced to allow duplicate test
  const retireAmount = 50;

  beforeEach(async function () {
    [owner, proposer, approver, operator, user1, user2] = await ethers.getSigners();
    
    H2Credits = await ethers.getContractFactory("H2Credits");
    h2Credits = await H2Credits.deploy();
    await h2Credits.waitForDeployment();

    // Setup roles
    await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
    await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
    await h2Credits.grantRole(await h2Credits.OPERATOR_ROLE(), operator.address);

    // Create and approve a batch
    await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
    await h2Credits.connect(approver).approveBatch(batchId, approvedCredits);
  });

  describe("Duplicate Issue Prevention", function () {
    it("Should allow first credit issue", async function () {
      await expect(
        h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount)
      ).to.not.be.reverted;

      expect(await h2Credits.getUserCredits(batchId, user1.address)).to.equal(issueAmount);
    });

    it("Should prevent duplicate credit issue with same parameters", async function () {
      // First issue should succeed
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);

      // Second identical issue should fail
      await expect(
        h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount)
      ).to.be.revertedWith("Duplicate credit issue detected - fraud attempt");
    });

    it("Should allow different issue transactions", async function () {
      // Issue to user1
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);
      
      // Issue different amount to user2 should work
      await expect(
        h2Credits.connect(operator).issueCredits(batchId, user2.address, 200)
      ).to.not.be.reverted;

      expect(await h2Credits.getUserCredits(batchId, user1.address)).to.equal(issueAmount);
      expect(await h2Credits.getUserCredits(batchId, user2.address)).to.equal(200);
    });
  });

  describe("Double Retirement Prevention", function () {
    beforeEach(async function () {
      // Issue credits to user1 first
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);
    });

    it("Should allow first credit retirement", async function () {
      const reason = "Carbon offset achieved";
      
      await expect(
        h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason)
      ).to.not.be.reverted;

      expect(await h2Credits.getUserCredits(batchId, user1.address)).to.equal(issueAmount - retireAmount);
      expect(await h2Credits.getUserRetiredCredits(batchId, user1.address)).to.equal(retireAmount);
    });

    it("Should prevent double retirement with same parameters", async function () {
      const reason = "Carbon offset achieved";
      
      // First retirement should succeed
      await h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason);

      // Second identical retirement should fail
      await expect(
        h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason)
      ).to.be.revertedWith("Double retirement detected - fraud attempt");
    });

    it("Should allow different retirement transactions", async function () {
      const reason1 = "Carbon offset achieved";
      const reason2 = "Environmental compliance";
      
      // First retirement
      await h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason1);
      
      // Different retirement should work
      await expect(
        h2Credits.connect(user1).retireCredits(batchId, 25, reason2)
      ).to.not.be.reverted;

      expect(await h2Credits.getUserRetiredCredits(batchId, user1.address)).to.equal(retireAmount + 25);
    });

    it("Should allow same amount retirement with different reason", async function () {
      const reason1 = "Carbon offset achieved";
      const reason2 = "Environmental compliance";
      
      // First retirement
      await h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason1);
      
      // Same amount but different reason should work
      await expect(
        h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason2)
      ).to.not.be.reverted;

      expect(await h2Credits.getUserRetiredCredits(batchId, user1.address)).to.equal(retireAmount * 2);
    });
  });

  describe("Fraud Prevention Edge Cases", function () {
    it("Should handle rapid successive transactions", async function () {
      // Issue credits
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);
      
      const reason = "Rapid retirement test";
      
      // First retirement
      await h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason);
      
      // Immediate second attempt should fail
      await expect(
        h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason)
      ).to.be.revertedWith("Double retirement detected - fraud attempt");
    });

    it("Should prevent fraud across different blocks", async function () {
      // Issue smaller amount first
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, 100);
      
      // Mine a block to change timestamp
      await ethers.provider.send("evm_mine");
      
      // Try duplicate issue - should still fail due to hash tracking
      await expect(
        h2Credits.connect(operator).issueCredits(batchId, user1.address, 100)
      ).to.be.revertedWith("Duplicate credit issue detected - fraud attempt");
    });
  });
});
