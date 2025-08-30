import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Dashboard() {
  const { currentRole } = useOutletContext();
  const [stats] = useState({
    totalBatches: 12,
    pendingApprovals: 3,
    totalCredits: 1500,
    complianceRate: 95
  });

  const roleSpecificStats = {
    producer: [
      { label: 'My Batches', value: 5, color: 'text-blue-600', icon: '📋' },
      { label: 'Pending Approval', value: 2, color: 'text-orange-600', icon: '⏳' },
      { label: 'Approved Batches', value: 3, color: 'text-green-600', icon: '✅' },
      { label: 'Total Credits Issued', value: 800, color: 'text-purple-600', icon: '🏭' }
    ],
    certifier: [
      { label: 'Pending Reviews', value: 8, color: 'text-orange-600', icon: '⏳' },
      { label: 'Reviews Completed', value: 24, color: 'text-green-600', icon: '✅' },
      { label: 'Batches Certified', value: 32, color: 'text-blue-600', icon: '📋' },
      { label: 'Certification Rate', value: '96%', color: 'text-purple-600', icon: '📊' }
    ],
    regulator: [
      { label: 'Compliance Rate', value: '95%', color: 'text-green-600', icon: '🛡️' },
      { label: 'Pending Approvals', value: 3, color: 'text-orange-600', icon: '⏳' },
      { label: 'Total Audits', value: 18, color: 'text-blue-600', icon: '📋' },
      { label: 'Risk Score', value: 'Low', color: 'text-green-600', icon: '📊' }
    ],
    consumer: [
      { label: 'Credits Purchased', value: 200, color: 'text-blue-600', icon: '🛒' },
      { label: 'Credits Retired', value: 150, color: 'text-green-600', icon: '♻️' },
      { label: 'Available Balance', value: 50, color: 'text-purple-600', icon: '💰' },
      { label: 'Retirement Rate', value: '75%', color: 'text-orange-600', icon: '📊' }
    ]
  };

  const roleSpecificActions = {
    producer: [
      { name: 'Issue New Batch', href: '/issue-batch', color: 'bg-green-600 hover:bg-green-700', icon: '➕' },
      { name: 'View My Batches', href: '/my-batches', color: 'bg-blue-600 hover:bg-blue-700', icon: '📋' },
      { name: 'Marketplace', href: '/marketplace', color: 'bg-purple-600 hover:bg-purple-700', icon: '🛒' }
    ],
    certifier: [
      { name: 'Review Pending', href: '/approvals', color: 'bg-orange-600 hover:bg-orange-700', icon: '⏳' },
      { name: 'View Approved', href: '/approved-batches', color: 'bg-green-600 hover:bg-green-700', icon: '✅' },
      { name: 'Certificates', href: '/certificates', color: 'bg-blue-600 hover:bg-blue-700', icon: '📜' }
    ],
    regulator: [
      { name: 'Review Approvals', href: '/approvals', color: 'bg-orange-600 hover:bg-orange-700', icon: '⏳' },
      { name: 'Compliance Overview', href: '/compliance', color: 'bg-purple-600 hover:bg-purple-700', icon: '🛡️' },
      { name: 'Audit Trail', href: '/audit-trail', color: 'bg-blue-600 hover:bg-blue-700', icon: '📋' }
    ],
    consumer: [
      { name: 'Buy Credits', href: '/marketplace', color: 'bg-blue-600 hover:bg-blue-700', icon: '🛒' },
      { name: 'View Portfolio', href: '/portfolio', color: 'bg-purple-600 hover:bg-purple-700', icon: '💰' },
      { name: 'Retire Credits', href: '/retire', color: 'bg-green-600 hover:bg-green-700', icon: '♻️' }
    ]
  };

  const currentStats = roleSpecificStats[currentRole] || [];
  const currentActions = roleSpecificActions[currentRole] || [];

  const roleNames = {
    producer: 'Producer',
    certifier: 'Certifier',
    regulator: 'Regulator',
    consumer: 'Consumer'
  };

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Welcome back, {roleNames[currentRole]}!
            </h1>
            <p className='text-gray-600 mt-2'>
              Here's what's happening with your GreenChain H2 Credits today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Last updated</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Role-specific Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {currentStats.map((stat, index) => (
          <div key={index} className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
            <div className="flex items-center justify-between">
              <div>
                <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {currentActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className={`${action.color} text-white p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-2`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium">{action.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
        <div className='space-y-3'>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">New batch submitted and approved</span>
            </div>
            <span className='text-sm text-gray-500'>2 hours ago</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Credits transferred to marketplace</span>
            </div>
            <span className='text-sm text-gray-500'>4 hours ago</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Certificate generated for retirement</span>
            </div>
            <span className='text-sm text-gray-500'>6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}