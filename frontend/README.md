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
