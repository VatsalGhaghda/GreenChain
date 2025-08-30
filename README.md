# GreenChain Backend

A blockchain-based carbon credit management system backend built with Node.js, Express, and PostgreSQL.

## 🚀 Current Implementation Status

### ✅ **Phase 1: Foundation & Core Infrastructure** - COMPLETED
- **Express.js Server Setup**: Basic server with CORS and middleware configuration
- **Database Schema**: PostgreSQL database with core tables (users, batches, events, certificates, marketplace_listings)
- **Environment Configuration**: Dotenv setup for environment variables
- **Basic API Structure**: RESTful API endpoints foundation

### ✅ **Phase 2: Authentication & User Management** - COMPLETED
- **Demo Authentication System**: Basic login endpoint with wallet address validation
- **User Role Management**: Support for producer, certifier, regulator, and consumer roles
- **User Info Endpoints**: GET /me endpoint for user information

### ✅ **Phase 3: Batch Management System** - COMPLETED
- **Batch Submission**: POST /submit endpoint for new carbon credit batches
- **Batch Status Management**: Pending, approved, and issued statuses
- **Batch Retrieval**: Endpoints for fetching all batches and pending batches
- **Batch Approval**: Demo approval system for certifiers

### ✅ **Phase 4: Event Tracking & Blockchain Integration** - COMPLETED
- **Event Management**: Comprehensive event tracking system
- **Blockchain Event Storage**: Transaction hash and block number tracking
- **Event Types**: Support for various carbon credit lifecycle events
- **Demo Event Creation**: Testing endpoint for event generation

### ✅ **Phase 5: Metrics & Analytics** - COMPLETED
- **Overview Metrics**: Total batches, pending/approved counts, user statistics
- **Compliance Tracking**: Demo compliance rate and carbon intensity metrics
- **Real-time Data**: Live database queries for current system status

## 🔄 **Phase 6: IPFS & File Management** - IN PROGRESS
- **IPFS Integration**: Web3.storage dependency added, implementation pending
- **Metadata Storage**: CID-based metadata management system
- **File Upload Handling**: Multer middleware configured for file processing

## 🔄 **Phase 7: PDF Generation & Certificate Management** - IN PROGRESS
- **PDF Generation**: PDFKit dependency added, implementation pending
- **Certificate Creation**: Digital certificate generation system
- **IPFS Storage**: Certificate storage on decentralized storage

## 🔄 **Phase 8: Advanced Features & Optimization** - PLANNED
- **Transfer System**: Carbon credit transfer between users
- **Marketplace Integration**: Trading and listing functionality
- **Blockchain Indexer**: Real-time blockchain event processing
- **Advanced Analytics**: Detailed reporting and compliance metrics

## 🛠️ **Technology Stack**

### Core Dependencies
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with pg driver
- **Blockchain**: Ethers.js for Ethereum integration
- **File Storage**: Web3.storage (IPFS) for decentralized storage
- **File Processing**: Multer for file uploads, PDFKit for document generation
- **Utilities**: CORS, dotenv, QR code generation

### Development Dependencies
- **Hot Reload**: Nodemon for development server

## 📁 **Project Structure**

```
backend/
├── src/
│   ├── api/                 # API route handlers
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── batches.js      # Batch management
│   │   ├── events.js       # Event tracking
│   │   ├── metrics.js      # Analytics & metrics
│   │   └── transfers.js    # Transfer system (placeholder)
│   ├── config/             # Configuration files
│   │   └── database.js     # Database connection
│   ├── db/                 # Database migrations
│   │   └── migrations.sql  # Schema and sample data
│   ├── indexer/            # Blockchain event indexer (planned)
│   ├── ipfs/               # IPFS integration (planned)
│   ├── pdf/                # PDF generation (planned)
│   └── index.js            # Main server entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Environment variables configured

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables
```env
DB_PASSWORD=your_postgres_password
PORT=3001
# Add other required environment variables
```

## 📊 **API Endpoints**

### Authentication
- `POST /api/auth/login` - User login with wallet address
- `GET /api/auth/me` - Get current user information

### Batch Management
- `POST /api/batches/submit` - Submit new carbon credit batch
- `GET /api/batches/pending` - Get pending batches
- `GET /api/batches` - Get all batches
- `POST /api/batches/approve/:batchId` - Approve batch (certifier only)

### Event Tracking
- `GET /api/events` - Get all events (filterable by batchId)
- `POST /api/events/demo` - Create demo event for testing

### Metrics & Analytics
- `GET /api/metrics/overview` - Get system overview metrics

### Testing
- `GET /test` - Basic server health check
- `GET /test-db` - Database connection test

## 🔧 **Database Schema**

### Core Tables
- **users**: User accounts with wallet addresses and roles
- **batches**: Carbon credit batches with metadata and status
- **events**: Blockchain events and transaction tracking
- **certificates**: Digital certificates with IPFS storage
- **marketplace_listings**: Trading marketplace functionality

## 🎯 **Next Steps & Roadmap**

### Immediate Priorities (Phase 6-7)
1. **Complete IPFS Integration**
   - Implement file upload to IPFS
   - Add metadata CID management
   - Create file retrieval endpoints

2. **PDF Generation System**
   - Implement certificate generation
   - Add QR code integration
   - Create certificate storage workflow

### Short-term Goals (Phase 8)
1. **Transfer System Implementation**
   - Carbon credit transfer between users
   - Transaction validation and recording
   - Balance management

2. **Marketplace Features**
   - Listing creation and management
   - Price discovery mechanisms
   - Trading execution

3. **Blockchain Indexer**
   - Real-time event processing
   - Smart contract integration
   - Automated compliance checking

### Long-term Vision
- **Advanced Analytics Dashboard**
- **Regulatory Compliance Tools**
- **Multi-chain Support**
- **Mobile API Optimization**
- **Real-time Notifications**

## 🤝 **Contributing**

This project is part of the GreenChain carbon credit management system. For contribution guidelines and development setup, please refer to the main project documentation.

## 📝 **License**

ISC License - see package.json for details.

---

**Status**: Phase 5 Complete | Phase 6-7 In Progress | Phase 8 Planned
**Last Updated**: January 2025
**Version**: 1.0.0


# GreenChain Frontend - H2 Credits Platform

A comprehensive React-based frontend application for managing hydrogen (H2) carbon credits on the blockchain. This platform provides role-based access control for producers, certifiers, regulators, and consumers to manage the entire lifecycle of hydrogen credits.

## 🚀 Features

### Core Functionality
- **Multi-Role Dashboard**: Tailored interfaces for different user types
- **Wallet Integration**: MetaMask wallet connection for blockchain interactions
- **Responsive Design**: Mobile-first approach with responsive sidebar navigation
- **Real-time Updates**: Dynamic content updates and live statistics

### User Roles & Capabilities

#### 🏭 Producer
- Issue new hydrogen production batches
- Track batch approval status
- View production statistics and credits issued
- Access marketplace for credit trading

#### ✅ Certifier
- Review and approve pending production batches
- Generate certificates for approved batches
- Track certification metrics and completion rates
- Manage batch verification workflow

#### 🏛️ Regulator
- Oversee compliance and regulatory matters
- Review pending approvals
- Access audit trails and compliance reports
- Monitor platform risk scores

#### 🛒 Consumer
- Browse and purchase hydrogen credits
- Manage credit portfolio
- Retire credits for environmental impact
- Track retirement certificates

## 🛠️ Technology Stack

### Frontend Framework
- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.2** - Fast build tool and development server
- **React Router DOM 7.8.2** - Client-side routing

### Styling & UI
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Headless UI 2.2.7** - Unstyled, accessible UI components
- **Heroicons 2.2.0** - Beautiful hand-crafted SVG icons

### Blockchain Integration
- **Ethers.js 6.15.0** - Ethereum library for wallet interactions
- **MetaMask Integration** - Browser wallet connection

### Data Visualization
- **Recharts 3.1.2** - Composable charting library for React

### Development Tools
- **ESLint 9.33.0** - Code linting and quality enforcement
- **PostCSS 8.5.6** - CSS processing and optimization
- **Autoprefixer 10.4.21** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main application layout
│   ├── Sidebar.jsx     # Navigation sidebar with role-based menus
│   ├── Dashboard.jsx   # Main dashboard page
│   ├── WalletConnect.jsx # MetaMask wallet integration
│   ├── RoleSelector.jsx # User role switching component
│   ├── UserProfile.jsx # User profile and quick actions
│   └── Breadcrumbs.jsx # Navigation breadcrumbs
├── pages/              # Page components
│   └── Dashboard.jsx   # Role-specific dashboard views
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Component Architecture

### Layout Component
- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Header Management**: Top navigation with breadcrumbs and user controls
- **Content Area**: Dynamic routing with role-based context

### Sidebar Navigation
- **Role-Based Menus**: Different navigation items per user role
- **Icon System**: Custom SVG icons for each navigation item
- **Mobile Support**: Touch-friendly mobile navigation
- **Active States**: Visual feedback for current page

### Dashboard System
- **Role-Specific Stats**: Customized metrics for each user type
- **Quick Actions**: Role-appropriate action buttons
- **Recent Activity**: Real-time activity feed
- **Dynamic Content**: Content updates based on selected role

### Wallet Integration
- **MetaMask Support**: Browser wallet connection
- **Account Display**: Truncated wallet address display
- **Connection States**: Connect/disconnect functionality
- **Error Handling**: User-friendly error messages

## 🔧 Configuration

### Tailwind CSS
- Custom color scheme for role-based theming
- Responsive breakpoints for mobile-first design
- Component-specific styling utilities

### Vite Configuration
- React plugin for JSX support
- Development server configuration
- Build optimization settings

### ESLint Configuration
- React-specific linting rules
- Hooks and refresh plugin integration
- Code quality enforcement

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MetaMask browser extension

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd GreenChain/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Available Routes

### Core Routes
- `/` - Main dashboard (role-specific)
- `/issue-batch` - Create new production batches
- `/my-batches` - View user's production batches
- `/marketplace` - Credit trading platform
- `/approvals` - Pending approval management
- `/approved-batches` - Approved batch overview
- `/certificates` - Certificate management
- `/compliance` - Regulatory compliance overview
- `/audit-trail` - System audit logs
- `/portfolio` - User's credit portfolio
- `/retire` - Credit retirement interface

## 🎯 Key Features Implementation

### Role-Based Access Control
- Dynamic navigation menus based on user role
- Role-specific dashboard statistics
- Conditional component rendering
- Role-appropriate quick actions

### Responsive Design
- Mobile-first CSS approach
- Collapsible sidebar for mobile devices
- Touch-friendly navigation
- Adaptive layouts for different screen sizes

### State Management
- React hooks for local state
- Context-based role management
- Route-based navigation state
- Wallet connection state

### User Experience
- Intuitive navigation with breadcrumbs
- Visual feedback for active states
- Smooth transitions and animations
- Consistent design language

## 🔮 Future Enhancements

### Planned Features
- **Advanced Analytics**: Detailed reporting and insights
- **Notification System**: Real-time alerts and updates
- **Advanced Search**: Enhanced filtering and search capabilities
- **Export Functionality**: Data export in various formats
- **Multi-Language Support**: Internationalization features

### Technical Improvements
- **State Management**: Redux or Zustand integration
- **Testing**: Unit and integration test coverage
- **Performance**: Code splitting and lazy loading
- **Accessibility**: Enhanced ARIA support and keyboard navigation

## 🤝 Contributing

### Development Guidelines
- Follow React best practices
- Use functional components with hooks
- Maintain consistent code formatting
- Write meaningful component documentation
- Test components across different screen sizes

### Code Quality
- ESLint configuration for code consistency
- Component reusability and modularity
- Responsive design principles
- Accessibility considerations

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Considerations

- MetaMask integration for secure wallet connections
- Role-based access control
- Input validation and sanitization
- Secure communication protocols

## 📄 License

This project is part of the GreenChain H2 Credits platform. Please refer to the project license for usage terms.

## 📞 Support

For technical support or questions about the GreenChain platform, please contact the development team or refer to the project documentation.

---

**GreenChain v1.0.0** - Building a sustainable future with hydrogen credits on the blockchain.

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

