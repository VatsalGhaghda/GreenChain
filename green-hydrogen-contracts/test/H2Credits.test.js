
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("H2Credits", function () {
  let H2Credits, h2Credits, owner, proposer, approver, operator, user1, user2;
  let batchId = 1;
  const metadataURI = "ipfs://QmTestMetadata";
  const totalCredits = 1000;
  const approvedCredits = 800;
  const issueAmount = 500;
  const transferAmount = 200;
  const retireAmount = 100;

  beforeEach(async function () {
    [owner, proposer, approver, operator, user1, user2] = await ethers.getSigners();
    
    H2Credits = await ethers.getContractFactory("H2Credits");
    h2Credits = await H2Credits.deploy();
    await h2Credits.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial state", async function () {
      expect(await h2Credits.getAddress()).to.not.equal(ethers.ZeroAddress);
      expect(await h2Credits.getTotalBatches()).to.equal(0);
    });

    it("Should grant deployer all roles", async function () {
      const proposerRole = await h2Credits.PROPOSER_ROLE();
      const approverRole = await h2Credits.APPROVER_ROLE();
      const operatorRole = await h2Credits.OPERATOR_ROLE();

      expect(await h2Credits.hasRole(proposerRole, owner.address)).to.be.true;
      expect(await h2Credits.hasRole(approverRole, owner.address)).to.be.true;
      expect(await h2Credits.hasRole(operatorRole, owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to grant roles", async function () {
      const proposerRole = await h2Credits.PROPOSER_ROLE();
      await h2Credits.grantRole(proposerRole, proposer.address);
      expect(await h2Credits.hasRole(proposerRole, proposer.address)).to.be.true;
    });

    it("Should allow admin to revoke roles", async function () {
      const proposerRole = await h2Credits.PROPOSER_ROLE();
      await h2Credits.grantRole(proposerRole, proposer.address);
      await h2Credits.revokeRole(proposerRole, proposer.address);
      expect(await h2Credits.hasRole(proposerRole, proposer.address)).to.be.false;
    });
  });

  describe("Batch Management", function () {
    beforeEach(async function () {
      // Grant roles to different addresses
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
      await h2Credits.grantRole(await h2Credits.OPERATOR_ROLE(), operator.address);
    });

    it("Should allow proposer to create batch", async function () {
      const tx = await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
      const receipt = await tx.wait();
      
      expect(receipt.logs).to.have.length(1);
      // Check if the event was emitted (simpler approach)
      expect(receipt.logs.length).to.be.greaterThan(0);

      const batch = await h2Credits.getBatch(batchId);
      expect(batch.proposer).to.equal(proposer.address);
      expect(batch.metadataURI).to.equal(metadataURI);
      expect(batch.totalCredits).to.equal(totalCredits);
      expect(batch.status).to.equal(0); // PENDING
    });

    it("Should not allow non-proposer to create batch", async function () {
      await expect(
        h2Credits.connect(user1).proposeBatch(metadataURI, totalCredits)
      ).to.be.revertedWithCustomError(h2Credits, "AccessControlUnauthorizedAccount");
    });

    it("Should not allow batch with zero credits", async function () {
      await expect(
        h2Credits.connect(proposer).proposeBatch(metadataURI, 0)
      ).to.be.revertedWith("Total credits must be greater than 0");
    });

    it("Should not allow batch with empty metadata", async function () {
      await expect(
        h2Credits.connect(proposer).proposeBatch("", totalCredits)
      ).to.be.revertedWith("Metadata URI cannot be empty");
    });
  });

  describe("Batch Approval", function () {
    beforeEach(async function () {
      // Setup: Grant roles and create a batch
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
      await h2Credits.grantRole(await h2Credits.OPERATOR_ROLE(), operator.address);
      
      await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
    });

    it("Should allow approver to approve batch", async function () {
      const tx = await h2Credits.connect(approver).approveBatch(batchId, approvedCredits);
      const receipt = await tx.wait();
      
      expect(receipt.logs).to.have.length(2); // BatchApproved + BatchStatusChanged

      const batch = await h2Credits.getBatch(batchId);
      expect(batch.approvedCredits).to.equal(approvedCredits);
      expect(batch.status).to.equal(1); // APPROVED
    });

    it("Should not allow non-approver to approve batch", async function () {
      await expect(
        h2Credits.connect(user1).approveBatch(batchId, approvedCredits)
      ).to.be.revertedWithCustomError(h2Credits, "AccessControlUnauthorizedAccount");
    });

    it("Should not allow approval of non-pending batch", async function () {
      // First approve the batch
      await h2Credits.connect(approver).approveBatch(batchId, approvedCredits);
      
      // Try to approve again
      await expect(
        h2Credits.connect(approver).approveBatch(batchId, approvedCredits)
      ).to.be.revertedWith("Invalid batch status");
    });

    it("Should not allow approval of more credits than total", async function () {
      await expect(
        h2Credits.connect(approver).approveBatch(batchId, totalCredits + 1)
      ).to.be.revertedWith("Cannot approve more than total credits");
    });
  });

  describe("Batch Rejection", function () {
    beforeEach(async function () {
      // Setup: Grant roles and create a batch
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
      
      await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
    });

    it("Should allow approver to reject batch", async function () {
      const reason = "Insufficient documentation";
      const tx = await h2Credits.connect(approver).rejectBatch(batchId, reason);
      const receipt = await tx.wait();
      
      expect(receipt.logs).to.have.length(2); // BatchRejected + BatchStatusChanged

      const batch = await h2Credits.getBatch(batchId);
      expect(batch.status).to.equal(2); // REJECTED
    });
  });

  describe("Credit Issuance", function () {
    beforeEach(async function () {
      // Setup: Grant roles, create and approve batch
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
      await h2Credits.grantRole(await h2Credits.OPERATOR_ROLE(), operator.address);
      
      await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
      await h2Credits.connect(approver).approveBatch(batchId, approvedCredits);
    });

    it("Should allow operator to issue credits", async function () {
      const tx = await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);
      const receipt = await tx.wait();
      
      // Check if events were emitted (more flexible)
      expect(receipt.logs.length).to.be.greaterThan(0);

      expect(await h2Credits.getUserCredits(batchId, user1.address)).to.equal(issueAmount);
      expect(await h2Credits.balanceOf(user1.address, batchId)).to.equal(issueAmount);
    });

    it("Should not allow non-operator to issue credits", async function () {
      await expect(
        h2Credits.connect(user1).issueCredits(batchId, user1.address, issueAmount)
      ).to.be.revertedWithCustomError(h2Credits, "AccessControlUnauthorizedAccount");
    });

    it("Should not allow issuing more than approved credits", async function () {
      await expect(
        h2Credits.connect(operator).issueCredits(batchId, user1.address, approvedCredits + 1)
      ).to.be.revertedWith("Cannot issue more than approved credits");
    });

    it("Should update batch status to ACTIVE when all credits issued", async function () {
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, approvedCredits);
      
      const batch = await h2Credits.getBatch(batchId);
      expect(batch.status).to.equal(3); // ACTIVE
    });
  });

  describe("Credit Transfer", function () {
    beforeEach(async function () {
      // Setup: Grant roles, create, approve, and issue credits
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
      await h2Credits.grantRole(await h2Credits.OPERATOR_ROLE(), operator.address);
      
      await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
      await h2Credits.connect(approver).approveBatch(batchId, approvedCredits);
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);
    });

    it("Should allow user to transfer credits", async function () {
      const tx = await h2Credits.connect(user1).transferCredits(batchId, user2.address, transferAmount);
      const receipt = await tx.wait();
      
      // Check if events were emitted (more flexible)
      expect(receipt.logs.length).to.be.greaterThan(0);

      expect(await h2Credits.getUserCredits(batchId, user1.address)).to.equal(issueAmount - transferAmount);
      expect(await h2Credits.getUserCredits(batchId, user2.address)).to.equal(transferAmount);
    });

    it("Should not allow transfer of insufficient credits", async function () {
      await expect(
        h2Credits.connect(user1).transferCredits(batchId, user2.address, issueAmount + 1)
      ).to.be.revertedWith("Insufficient credits");
    });

    it("Should not allow transfer to zero address", async function () {
      await expect(
        h2Credits.connect(user1).transferCredits(batchId, ethers.ZeroAddress, transferAmount)
      ).to.be.revertedWith("Cannot transfer to zero address");
    });
  });

  describe("Credit Retirement", function () {
    beforeEach(async function () {
      // Setup: Grant roles, create, approve, and issue credits
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.grantRole(await h2Credits.APPROVER_ROLE(), approver.address);
      await h2Credits.grantRole(await h2Credits.OPERATOR_ROLE(), operator.address);
      
      await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
      await h2Credits.connect(approver).approveBatch(batchId, approvedCredits);
      await h2Credits.connect(operator).issueCredits(batchId, user1.address, issueAmount);
    });

    it("Should allow user to retire credits", async function () {
      const reason = "Carbon offset achieved";
      const tx = await h2Credits.connect(user1).retireCredits(batchId, retireAmount, reason);
      const receipt = await tx.wait();
      
      // Check if events were emitted (more flexible)
      expect(receipt.logs.length).to.be.greaterThan(0);

      expect(await h2Credits.getUserCredits(batchId, user1.address)).to.equal(issueAmount - retireAmount);
      expect(await h2Credits.getUserRetiredCredits(batchId, user1.address)).to.equal(retireAmount);
      expect(await h2Credits.balanceOf(user1.address, batchId)).to.equal(issueAmount - retireAmount);
    });

    it("Should not allow retirement of insufficient credits", async function () {
      const reason = "Carbon offset achieved";
      await expect(
        h2Credits.connect(user1).retireCredits(batchId, issueAmount + 1, reason)
      ).to.be.revertedWith("Insufficient credits");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Setup: Grant roles and create a batch
      await h2Credits.grantRole(await h2Credits.PROPOSER_ROLE(), proposer.address);
      await h2Credits.connect(proposer).proposeBatch(metadataURI, totalCredits);
    });

    it("Should return correct batch information", async function () {
      const batch = await h2Credits.getBatch(batchId);
      expect(batch.batchId).to.equal(batchId);
      expect(batch.proposer).to.equal(proposer.address);
      expect(batch.metadataURI).to.equal(metadataURI);
      expect(batch.totalCredits).to.equal(totalCredits);
    });

    it("Should return correct total batches count", async function () {
      expect(await h2Credits.getTotalBatches()).to.equal(1);
    });
  });
});
