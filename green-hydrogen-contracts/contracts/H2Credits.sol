// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title H2Credits
 * @dev Green Hydrogen Credit Registry using ERC-1155 standard
 * @dev Implements role-based access control for batch management
 */
contract H2Credits is ERC1155, AccessControl {
    // Version for tracking contract updates
    string public constant VERSION = "2.0.0";
    // Role definitions
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Batch structure
    struct Batch {
        uint256 batchId;
        address proposer;
        string metadataURI;
        uint256 totalCredits;
        uint256 approvedCredits;
        uint256 issuedCredits;
        uint256 retiredCredits;
        BatchStatus status;
        uint256 createdAt;
        uint256 approvedAt;
    }

    // Batch status enum
    enum BatchStatus {
        PENDING,
        APPROVED,
        REJECTED,
        ACTIVE,
        COMPLETED
    }

    // State variables
    uint256 private _batchIds = 0;
    mapping(uint256 => Batch) public batches;
    mapping(uint256 => mapping(address => uint256)) public userCredits;
    mapping(uint256 => mapping(address => uint256)) public userRetiredCredits;
    
    // Fraud prevention mappings
    mapping(bytes32 => bool) private issuedCreditHashes;
    mapping(bytes32 => bool) private retirementHashes;

    // Events
    event BatchProposed(
        uint256 indexed batchId,
        address indexed proposer,
        string metadataURI,
        uint256 totalCredits,
        uint256 timestamp
    );

    event BatchApproved(
        uint256 indexed batchId,
        address indexed approver,
        uint256 approvedCredits,
        uint256 timestamp
    );

    event BatchRejected(
        uint256 indexed batchId,
        address indexed approver,
        string reason,
        uint256 timestamp
    );

    event CreditsIssued(
        uint256 indexed batchId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    event CreditsTransferred(
        uint256 indexed batchId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    event CreditsRetired(
        uint256 indexed batchId,
        address indexed owner,
        uint256 amount,
        string reason,
        uint256 timestamp
    );

    event FraudAttemptDetected(
        string indexed fraudType,
        address indexed attacker,
        bytes32 transactionHash,
        uint256 timestamp
    );

    event BatchStatusChanged(
        uint256 indexed batchId,
        BatchStatus oldStatus,
        BatchStatus newStatus,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyBatchExists(uint256 batchId) {
        require(batches[batchId].batchId != 0, "Batch does not exist");
        _;
    }

    modifier onlyBatchStatus(uint256 batchId, BatchStatus status) {
        require(batches[batchId].status == status, "Invalid batch status");
        _;
    }

    // Constructor
    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
        _grantRole(APPROVER_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /**
     * @dev Propose a new batch of green hydrogen credits
     * @param metadataURI IPFS URI containing batch metadata
     * @param totalCredits Total number of credits in the batch
     */
    function proposeBatch(
        string memory metadataURI,
        uint256 totalCredits
    ) external onlyRole(PROPOSER_ROLE) {
        require(totalCredits > 0, "Total credits must be greater than 0");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");

        _batchIds++;
        uint256 batchId = _batchIds;

        batches[batchId] = Batch({
            batchId: batchId,
            proposer: msg.sender,
            metadataURI: metadataURI,
            totalCredits: totalCredits,
            approvedCredits: 0,
            issuedCredits: 0,
            retiredCredits: 0,
            status: BatchStatus.PENDING,
            createdAt: block.timestamp,
            approvedAt: 0
        });

        emit BatchProposed(batchId, msg.sender, metadataURI, totalCredits, block.timestamp);
    }

    /**
     * @dev Approve a pending batch
     * @param batchId ID of the batch to approve
     * @param approvedCredits Number of credits to approve
     */
    function approveBatch(
        uint256 batchId,
        uint256 approvedCredits
    ) external onlyRole(APPROVER_ROLE) onlyBatchExists(batchId) onlyBatchStatus(batchId, BatchStatus.PENDING) {
        Batch storage batch = batches[batchId];
        require(approvedCredits > 0, "Approved credits must be greater than 0");
        require(approvedCredits <= batch.totalCredits, "Cannot approve more than total credits");

        batch.approvedCredits = approvedCredits;
        batch.status = BatchStatus.APPROVED;
        batch.approvedAt = block.timestamp;

        emit BatchApproved(batchId, msg.sender, approvedCredits, block.timestamp);
        emit BatchStatusChanged(batchId, BatchStatus.PENDING, BatchStatus.APPROVED, block.timestamp);
    }

    /**
     * @dev Reject a pending batch
     * @param batchId ID of the batch to reject
     * @param reason Reason for rejection
     */
    function rejectBatch(
        uint256 batchId,
        string memory reason
    ) external onlyRole(APPROVER_ROLE) onlyBatchExists(batchId) onlyBatchStatus(batchId, BatchStatus.PENDING) {
        Batch storage batch = batches[batchId];
        batch.status = BatchStatus.REJECTED;

        emit BatchRejected(batchId, msg.sender, reason, block.timestamp);
        emit BatchStatusChanged(batchId, BatchStatus.PENDING, BatchStatus.REJECTED, block.timestamp);
    }

    /**
     * @dev Issue credits from an approved batch to a recipient
     * @param batchId ID of the batch
     * @param recipient Address to receive the credits
     * @param amount Amount of credits to issue
     */
    function issueCredits(
        uint256 batchId,
        address recipient,
        uint256 amount
    ) external onlyRole(OPERATOR_ROLE) onlyBatchExists(batchId) onlyBatchStatus(batchId, BatchStatus.APPROVED) {
        Batch storage batch = batches[batchId];
        require(amount > 0, "Amount must be greater than 0");
        require(
            batch.issuedCredits + amount <= batch.approvedCredits,
            "Cannot issue more than approved credits"
        );

        // Generate unique hash for this issue transaction
        bytes32 issueHash = _generateIssueHash(batchId, recipient, amount);
        
        // Check for duplicate issue attempt
        if (issuedCreditHashes[issueHash]) {
            emit FraudAttemptDetected("DUPLICATE_ISSUE", msg.sender, issueHash, block.timestamp);
            revert("Duplicate credit issue detected - fraud attempt");
        }
        
        // Mark this hash as used
        issuedCreditHashes[issueHash] = true;

        batch.issuedCredits += amount;
        userCredits[batchId][recipient] += amount;

        // Mint ERC-1155 tokens
        _mint(recipient, batchId, amount, "");

        // Update batch status if all credits are issued
        if (batch.issuedCredits == batch.approvedCredits) {
            batch.status = BatchStatus.ACTIVE;
            emit BatchStatusChanged(batchId, BatchStatus.APPROVED, BatchStatus.ACTIVE, block.timestamp);
        }

        emit CreditsIssued(batchId, recipient, amount, block.timestamp);
    }

    /**
     * @dev Transfer credits between users
     * @param batchId ID of the batch
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function transferCredits(
        uint256 batchId,
        address to,
        uint256 amount
    ) external onlyBatchExists(batchId) {
        require(to != address(0), "Cannot transfer to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(
            userCredits[batchId][msg.sender] >= amount,
            "Insufficient credits"
        );

        userCredits[batchId][msg.sender] -= amount;
        userCredits[batchId][to] += amount;

        // Transfer ERC-1155 tokens
        _safeTransferFrom(msg.sender, to, batchId, amount, "");

        emit CreditsTransferred(batchId, msg.sender, to, amount, block.timestamp);
    }

    /**
     * @dev Retire credits (permanently remove from circulation)
     * @param batchId ID of the batch
     * @param amount Amount to retire
     * @param reason Reason for retirement
     */
    function retireCredits(
        uint256 batchId,
        uint256 amount,
        string memory reason
    ) external onlyBatchExists(batchId) {
        require(amount > 0, "Amount must be greater than 0");
        require(
            userCredits[batchId][msg.sender] >= amount,
            "Insufficient credits"
        );

        // Generate unique hash for this retirement transaction
        bytes32 retirementHash = _generateRetirementHash(batchId, msg.sender, amount, reason);
        
        // Check for double retirement attempt
        if (retirementHashes[retirementHash]) {
            emit FraudAttemptDetected("DOUBLE_RETIREMENT", msg.sender, retirementHash, block.timestamp);
            revert("Double retirement detected - fraud attempt");
        }
        
        // Mark this hash as used
        retirementHashes[retirementHash] = true;

        userCredits[batchId][msg.sender] -= amount;
        userRetiredCredits[batchId][msg.sender] += amount;

        Batch storage batch = batches[batchId];
        batch.retiredCredits += amount;

        // Burn ERC-1155 tokens
        _burn(msg.sender, batchId, amount);

        emit CreditsRetired(batchId, msg.sender, amount, reason, block.timestamp);
    }

    /**
     * @dev Get batch information
     * @param batchId ID of the batch
     * @return Batch information
     */
    function getBatch(uint256 batchId) external view onlyBatchExists(batchId) returns (Batch memory) {
        return batches[batchId];
    }

    /**
     * @dev Get user credits for a specific batch
     * @param batchId ID of the batch
     * @param user User address
     * @return Available credits
     */
    function getUserCredits(uint256 batchId, address user) external view returns (uint256) {
        return userCredits[batchId][user];
    }

    /**
     * @dev Get user retired credits for a specific batch
     * @param batchId ID of the batch
     * @param user User address
     * @return Retired credits
     */
    function getUserRetiredCredits(uint256 batchId, address user) external view returns (uint256) {
        return userRetiredCredits[batchId][user];
    }

    /**
     * @dev Get total number of batches
     * @return Total batch count
     */
    function getTotalBatches() external view returns (uint256) {
        return _batchIds;
    }

    /**
     * @dev Generate unique hash for issue transactions
     */
    function _generateIssueHash(
    uint256 batchId,
    address recipient,
    uint256 amount
) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(batchId, recipient, amount));
}

    /**
     * @dev Generate unique hash for retirement transactions
     */
    function _generateRetirementHash(
    uint256 batchId,
    address user,
    uint256 amount,
    string memory reason
) private pure returns (bytes32) {
    return keccak256(abi.encodePacked(batchId, user, amount, reason));
}

    /**
     * @dev Override required for AccessControl
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
