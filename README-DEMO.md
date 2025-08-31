# Green Hydrogen Credit Registry - Hackathon Demo

## 🚀 Quick Start Guide

### Prerequisites
- Node.js installed
- MetaMask or similar Web3 wallet
- Sepolia testnet ETH for transactions

### 1. Start the Application
```bash
# Run the startup script
start-servers.bat

# Or manually:
# Terminal 1 - Backend
cd backend
node src/index.js

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 2. Test Data Flow
```bash
# Test backend API (optional)
node test-data-flow.js
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Contract**: 0xf01136fa90021B23D9F249D513f0DCBF8e51C20B (Sepolia)

## 🛡️ Fraud Prevention Demo

### Key Features Demonstrated
1. **Duplicate Credit Issue Prevention**
   - Navigate to `/fraud-demo`
   - Click "Run Attack Test" on "Duplicate Batch Issuance"
   - Shows smart contract blocking duplicate credits

2. **Double Retirement Protection**
   - Test double retirement scenarios
   - Demonstrates blockchain-level fraud detection

3. **Role-Based Access Control**
   - Different user roles with specific permissions
   - PROPOSER, APPROVER, OPERATOR roles

4. **Real-time Fraud Detection**
   - Hash-based transaction verification
   - Event logging for audit trails

## 🎯 Demo Scenarios

### Scenario 1: Normal Credit Lifecycle
1. **Propose Batch** (PROPOSER role)
   - Create new hydrogen production batch
   - Upload production reports to IPFS
   - Submit for approval

2. **Approve Batch** (APPROVER role)
   - Review production data
   - Verify carbon intensity calculations
   - Approve for credit issuance

3. **Issue Credits** (OPERATOR role)
   - Mint credits based on approved batch
   - Credits become tradeable tokens

4. **Retire Credits** (Any holder)
   - Permanently retire credits for carbon offsetting
   - Cannot be retired twice (fraud prevention)

### Scenario 2: Fraud Prevention
1. **Duplicate Issue Attempt**
   - Try to issue credits for same batch twice
   - Smart contract rejects with fraud detection

2. **Double Retirement Attack**
   - Attempt to retire same credits multiple times
   - Blockchain prevents duplicate retirement

3. **Role Escalation Test**
   - Try to perform actions outside assigned role
   - Access control prevents unauthorized actions

## 🔧 Technical Architecture

### Smart Contract (Sepolia)
- **Address**: 0xf01136fa90021B23D9F249D513f0DCBF8e51C20B
- **Standard**: ERC-1155 (Multi-token)
- **Features**: Fraud prevention, role-based access, event logging

### Backend (Node.js/Express)
- **Port**: 3001
- **Database**: PostgreSQL
- **Blockchain**: Ethers.js integration
- **IPFS**: Pinata for metadata storage

### Frontend (React)
- **Port**: 3000
- **Routing**: React Router
- **Web3**: MetaMask integration
- **UI**: Tailwind CSS + Heroicons

## 🏆 Hackathon Highlights

### Innovation Points
1. **Advanced Fraud Prevention**: Hash-based duplicate detection
2. **Real-world Integration**: IPFS for document storage
3. **Production Ready**: Comprehensive error handling
4. **User Experience**: Intuitive fraud demo interface
5. **Transparency**: Dual verification (Blockscout + Sourcify)

### Security Features
- ✅ Immutable blockchain records
- ✅ Cryptographic fraud detection
- ✅ Role-based permissions
- ✅ Third-party verification
- ✅ Audit trail logging

## 📊 Demo Flow

1. **Start Application** → Both servers running
2. **Connect Wallet** → MetaMask to Sepolia
3. **Navigate to Fraud Demo** → `/fraud-demo`
4. **Run Fraud Tests** → See prevention in action
5. **Check Blockchain** → Verify on Sepolia explorer
6. **Show Real Transactions** → Live blockchain interaction

## 🎪 Presentation Tips

1. **Open with Problem**: Carbon credit fraud costs billions
2. **Show Solution**: Live fraud prevention demo
3. **Demonstrate Technology**: Real blockchain transactions
4. **Highlight Innovation**: Advanced fraud detection algorithms
5. **Emphasize Impact**: Protecting environmental integrity

## 🔗 Resources

- **Sepolia Explorer**: https://sepolia.etherscan.io/address/0xf01136fa90021B23D9F249D513f0DCBF8e51C20B
- **Blockscout**: https://eth-sepolia.blockscout.com/address/0xf01136fa90021B23D9F249D513f0DCBF8e51C20B
- **Contract Verification**: Verified on both explorers
- **IPFS Gateway**: https://gateway.pinata.cloud/

---

**Ready for Demo! 🚀**
