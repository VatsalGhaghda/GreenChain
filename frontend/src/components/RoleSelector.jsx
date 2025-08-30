import { useState } from 'react';

export default function RoleSelector({ currentRole, onRoleChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'producer', name: 'Producer', color: 'bg-green-500', icon: '🏭' },
    { id: 'certifier', name: 'Certifier', color: 'bg-blue-500', icon: '✅' },
    { id: 'regulator', name: 'Regulator', color: 'bg-purple-500', icon: '🏛️' },
    { id: 'consumer', name: 'Consumer', color: 'bg-orange-500', icon: '🛒' }
  ];

  const currentRoleData = roles.find(role => role.id === currentRole);

  const handleRoleChange = (roleId) => {
    onRoleChange(roleId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
      >
        <span className="mr-2">{currentRoleData?.icon}</span>
        <span className="hidden sm:inline">{currentRoleData?.name}</span>
        <svg
          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentRole === role.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{role.icon}</span>
                <span>{role.name}</span>
                {currentRole === role.id && (
                  <svg className="ml-auto h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

