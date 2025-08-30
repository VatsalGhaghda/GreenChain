# 🚀 Green Hydrogen Credit Registry - Smart Contracts

This repository contains the smart contracts for the Green Hydrogen Credit Registry built with Hardhat and Solidity.

## 🏗️ Project Structure

```
├── contracts/
│   └── H2Credits.sol          # Main smart contract
├── scripts/
│   └── deploy.js              # Deployment script
├── test/
│   └── H2Credits.test.js      # Test suite
├── hardhat.config.js           # Hardhat configuration
├── .env                        # Environment variables
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet with Sepolia testnet configured

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory with the following variables:

```env
# Sepolia Testnet Configuration (Alchemy)
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (OPTIONAL - FREE for Sepolia testnet)
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Gas Reporting
REPORT_GAS=true
```

#### Getting Your Keys:
1. **Alchemy API Key**: 
   - Go to [Alchemy](https://www.alchemy.com/)
   - Create an account and app
   - Select Sepolia testnet
   - Copy the HTTP URL

2. **Private Key**: 
   - Export from MetaMask (Account → Three dots → Account details → Export private key)
   - ⚠️ **NEVER share or commit your private key!**

3. **Etherscan API Key (OPTIONAL)**:
   - **FREE for Sepolia testnet** - No costs involved
   - Go to [Etherscan](https://etherscan.io/)
   - Create account and get API key
   - **Alternative**: Use Sourcify (completely free) or skip verification

### 3. Compile Contracts
```bash
npx hardhat compile
```

### 4. Run Tests
```bash
npx hardhat test
```

### 5. Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 📋 Smart Contract Features

### H2Credits Contract
- **ERC-1155 Standard**: Multi-token standard for credit management
- **Role-Based Access Control**: PROPOSER, APPROVER, OPERATOR roles
- **Batch Management**: Create, approve, reject credit batches
- **Credit Operations**: Issue, transfer, and retire credits
- **Event Logging**: Comprehensive event system for tracking

### Core Functions
- `proposeBatch()` - Create new credit batches
- `approveBatch()` - Approve pending batches
- `rejectBatch()` - Reject pending batches
- `issueCredits()` - Issue credits to recipients
- `transferCredits()` - Transfer between users
- `retireCredits()` - Permanently retire credits

## 🔧 Configuration

### Networks
- **Hardhat**: Local development (chainId: 31337)
- **Sepolia**: Testnet deployment (chainId: 11155111)

### Gas Optimization
- Solidity optimizer enabled with 200 runs
- Gas reporting enabled for cost analysis

## 🧪 Testing

The test suite covers:
- Contract deployment
- Role management
- Batch operations
- Credit issuance and transfer
- Access control validation
- Event emission verification

## 🚀 Deployment

### Local Network
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### Sepolia Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 🔍 Contract Verification (FREE Options)

### Option 1: Etherscan (FREE for Sepolia)
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```
- **Cost**: FREE for testnet
- **Requires**: Etherscan API key

### Option 2: Sourcify (COMPLETELY FREE)
```bash
# Sourcify is automatically enabled in our config
# No additional setup needed
```
- **Cost**: 100% FREE
- **Requires**: Nothing extra
- **Works**: On all networks

### Option 3: Local Verification (FREE)
```bash
# Verify contract functionality locally
npx hardhat test
```
- **Cost**: FREE
- **Requires**: Nothing extra
- **Perfect**: For development and testing

## 💰 Cost Breakdown

| Service | Sepolia Testnet | Mainnet | Notes |
|---------|----------------|---------|-------|
| **Etherscan** | 🆓 FREE | 💰 Paid | Free for testnet |
| **Sourcify** | 🆓 FREE | 🆓 FREE | Always free |
| **Local Testing** | 🆓 FREE | 🆓 FREE | No external costs |
| **Alchemy** | 🆓 FREE | 🆓 FREE | Free tier available |

## 📊 Gas Usage

Monitor gas usage with:
```bash
REPORT_GAS=true npx hardhat test
```

## 🔒 Security Features

- Role-based access control
- Input validation
- Safe math operations
- Event logging for audit trails

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the test suite for usage examples
- Review the smart contract code
- Open an issue in the repository

---

**🚀 Ready to deploy your Green Hydrogen Credit Registry!**

**💡 Pro Tip**: For hackathons and development, you can skip Etherscan verification entirely and use Sourcify or local testing - both are completely FREE!
