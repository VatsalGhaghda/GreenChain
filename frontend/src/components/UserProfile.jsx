import { useState, useRef, useEffect } from 'react';

const roleInfo = {
  producer: {
    name: 'Producer',
    color: 'bg-green-100 text-green-800',
    icon: '🏭',
    description: 'Create and submit hydrogen production batches'
  },
  certifier: {
    name: 'Certifier',
    color: 'bg-blue-100 text-blue-800',
    icon: '✅',
    description: 'Verify and approve production batches'
  },
  regulator: {
    name: 'Regulator',
    color: 'bg-purple-100 text-purple-800',
    icon: '🏛️',
    description: 'Oversee compliance and regulatory matters'
  },
  consumer: {
    name: 'Consumer',
    color: 'bg-orange-100 text-orange-800',
    icon: '🛒',
    description: 'Buy and retire hydrogen credits'
  }
};

export default function UserProfile({ currentRole, walletAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const role = roleInfo[currentRole];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {/* Role indicator */}
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${role.color}`}>
          <span className="mr-1">{role.icon}</span>
          {role.name}
        </div>
        
        {/* Wallet address */}
        <div className="hidden sm:block text-sm text-gray-600">
          {walletAddress}
        </div>
        
        {/* Dropdown arrow */}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${role.color}`}>
                {role.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{role.name}</h3>
                <p className="text-xs text-gray-500">{role.description}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Wallet: {walletAddress}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2">
            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
              Quick Actions
            </h4>
            <div className="space-y-1">
              {currentRole === 'producer' && (
                <>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Issue New Batch
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View My Batches
                  </button>
                </>
              )}
              
              {(currentRole === 'certifier' || currentRole === 'regulator') && (
                <>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Review Pending Approvals
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Approved Batches
                  </button>
                </>
              )}
              
              {currentRole === 'consumer' && (
                <>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Browse Marketplace
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                    View Portfolio
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Connected to Mumbai Testnet</span>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
