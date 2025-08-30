import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import RoleSelector from './RoleSelector';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import UserProfile from './UserProfile';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('producer'); // Default role for demo

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        currentRole={currentRole}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className={`lg:pl-64 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
        {/* Top header */}
        <header className='bg-white shadow-sm border-b border-gray-200'>
          <div className='flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4'>
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumbs */}
            <div className="flex-1 px-4">
              <Breadcrumbs />
            </div>

            {/* Right side - Role selector and user profile */}
            <div className='flex items-center space-x-4'>
              <RoleSelector 
                currentRole={currentRole} 
                onRoleChange={setCurrentRole}
              />
              <UserProfile 
                currentRole={currentRole}
                walletAddress="0x1234...5678"
              />
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className='py-6 px-4 sm:px-6 lg:px-8'>
          <Outlet context={{ currentRole }} />
        </main>
      </div>
    </div>
  );
}