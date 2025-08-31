import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { currentRole } = useOutletContext();
  const [stats, setStats] = useState({
    totalBatches: 12,
    pendingApprovals: 3,
    totalCredits: 1500,
    complianceRate: 95
  });

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalCredits: prev.totalCredits + Math.floor(Math.random() * 10) - 5,
        pendingApprovals: Math.max(0, prev.pendingApprovals + Math.floor(Math.random() * 3) - 1)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Chart data for credits over time
  const creditsData = [
    { month: 'Jan', issued: 120, retired: 80, net: 40 },
    { month: 'Feb', issued: 150, retired: 90, net: 60 },
    { month: 'Mar', issued: 180, retired: 110, net: 70 },
    { month: 'Apr', issued: 200, retired: 130, net: 70 },
    { month: 'May', issued: 220, retired: 150, net: 70 },
    { month: 'Jun', issued: 250, retired: 180, net: 70 },
    { month: 'Jul', issued: 280, retired: 200, net: 80 },
    { month: 'Aug', issued: 300, retired: 220, net: 80 },
    { month: 'Sep', issued: 320, retired: 240, net: 80 },
    { month: 'Oct', issued: 350, retired: 270, net: 80 },
    { month: 'Nov', issued: 380, retired: 300, net: 80 },
    { month: 'Dec', issued: 400, retired: 320, net: 80 }
  ];

  // Role-specific enhanced stats
  const roleSpecificStats = {
    producer: [
      { label: 'My Batches', value: 5, color: 'text-blue-600', icon: '📋', trend: '+12%', trendColor: 'text-green-600' },
      { label: 'Pending Approval', value: 2, color: 'text-orange-600', icon: '⏳', trend: '-5%', trendColor: 'text-red-600' },
      { label: 'Approved Batches', value: 3, color: 'text-green-600', icon: '✅', trend: '+8%', trendColor: 'text-green-600' },
      { label: 'Total Credits Issued', value: 800, color: 'text-purple-600', icon: '🏭', trend: '+15%', trendColor: 'text-green-600' }
    ],
    certifier: [
      { label: 'Pending Reviews', value: 8, color: 'text-orange-600', icon: '⏳', trend: '+3%', trendColor: 'text-orange-600' },
      { label: 'Reviews Completed', value: 24, color: 'text-green-600', icon: '✅', trend: '+18%', trendColor: 'text-green-600' },
      { label: 'Batches Certified', value: 32, color: 'text-blue-600', icon: '📋', trend: '+22%', trendColor: 'text-green-600' },
      { label: 'Certification Rate', value: '96%', color: 'text-purple-600', icon: '📊', trend: '+2%', trendColor: 'text-green-600' }
    ],
    regulator: [
      { label: 'Compliance Rate', value: '95%', color: 'text-green-600', icon: '🛡️', trend: '+3%', trendColor: 'text-green-600' },
      { label: 'Pending Approvals', value: 3, color: 'text-orange-600', icon: '⏳', trend: '-10%', trendColor: 'text-green-600' },
      { label: 'Total Audits', value: 18, color: 'text-blue-600', icon: '📋', trend: '+25%', trendColor: 'text-green-600' },
      { label: 'Risk Score', value: 'Low', color: 'text-green-600', icon: '📊', trend: 'Stable', trendColor: 'text-blue-600' }
    ],
    consumer: [
      { label: 'Credits Purchased', value: 200, color: 'text-blue-600', icon: '🛒', trend: '+30%', trendColor: 'text-green-600' },
      { label: 'Credits Retired', value: 150, color: 'text-green-600', icon: '♻️', trend: '+20%', trendColor: 'text-green-600' },
      { label: 'Available Balance', value: 50, color: 'text-purple-600', icon: '💰', trend: '+10%', trendColor: 'text-green-600' },
      { label: 'Retirement Rate', value: '75%', color: 'text-orange-600', icon: '📊', trend: '+5%', trendColor: 'text-green-600' }
    ]
  };

  const roleSpecificActions = {
    producer: [
      { name: 'Issue New Batch', href: '/issue-batch', color: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800', icon: '➕', description: 'Create and submit new credit batch' },
      { name: 'View My Batches', href: '/my-batches', color: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800', icon: '📋', description: 'Track all your submitted batches' },
      { name: 'Marketplace', href: '/marketplace', color: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800', icon: '🛒', description: 'Trade credits on the marketplace' }
    ],
    certifier: [
      { name: 'Review Pending', href: '/approvals', color: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800', icon: '⏳', description: 'Review pending batch submissions' },
      { name: 'View Approved', href: '/approved-batches', color: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800', icon: '✅', description: 'View all approved batches' },
      { name: 'Certificates', href: '/certificates', color: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800', icon: '📜', description: 'Generate and manage certificates' }
    ],
    regulator: [
      { name: 'Review Approvals', href: '/approvals', color: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800', icon: '⏳', description: 'Review regulatory approvals' },
      { name: 'Compliance Overview', href: '/compliance', color: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800', icon: '🛡️', description: 'Monitor compliance metrics' },
      { name: 'Audit Trail', href: '/audit-trail', color: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800', icon: '📋', description: 'View complete audit history' }
    ],
    consumer: [
      { name: 'Buy Credits', href: '/marketplace', color: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800', icon: '🛒', description: 'Purchase credits from marketplace' },
      { name: 'View Portfolio', href: '/portfolio', color: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800', icon: '💰', description: 'Manage your credit portfolio' },
      { name: 'Retire Credits', href: '/retire', color: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800', icon: '♻️', description: 'Retire credits for environmental impact' }
    ]
  };

  // Enhanced recent activity data
  const recentActivity = [
    { id: 1, type: 'batch_approved', message: 'New batch submitted and approved', time: '2 hours ago', status: 'success', icon: '✅', color: 'bg-green-500' },
    { id: 2, type: 'credits_transferred', message: 'Credits transferred to marketplace', time: '4 hours ago', status: 'info', icon: '🔄', color: 'bg-blue-500' },
    { id: 3, type: 'certificate_generated', message: 'Certificate generated for retirement', time: '6 hours ago', status: 'success', icon: '📜', color: 'bg-purple-500' },
    { id: 4, type: 'compliance_check', message: 'Monthly compliance check completed', time: '8 hours ago', status: 'warning', icon: '⚠️', color: 'bg-yellow-500' },
    { id: 5, type: 'audit_started', message: 'New audit cycle initiated', time: '12 hours ago', status: 'info', icon: '🔍', color: 'bg-indigo-500' }
  ];

  const currentStats = roleSpecificStats[currentRole] || [];
  const currentActions = roleSpecificActions[currentRole] || [];

  const roleNames = {
    producer: 'Producer',
    certifier: 'Certifier',
    regulator: 'Regulator',
    consumer: 'Consumer'
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className='space-y-6'>
      {/* Enhanced Welcome Header with Real-time Updates */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className='text-3xl font-bold'>
              Welcome back, {roleNames[currentRole]}!
            </h1>
            <p className='text-blue-100 mt-2'>
              Here's what's happening with your GreenChain H2 Credits today.
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-100">Live updates enabled</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Last updated</div>
            <div className="text-sm font-medium">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Role-specific Stats with Trends */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {currentStats.map((stat, index) => (
          <div key={index} className='bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500'>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className='text-sm font-medium text-gray-600'>{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${stat.trendColor}`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credits Over Time Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Credits Issued vs Retired Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={creditsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="issued" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="retired" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Net Credits Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Net Credits (Issued - Retired)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={creditsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="net" stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className='text-xl font-semibold mb-4 text-gray-800'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {currentActions.map((action, index) => (
            <div
              key={index}
              className={`${action.color} text-white p-6 rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
            >
              <div className="text-center space-y-3">
                <span className="text-3xl block">{action.icon}</span>
                <span className="font-semibold text-lg block">{action.name}</span>
                <span className="text-sm opacity-90 block">{action.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Recent Activity Timeline */}
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <h2 className='text-xl font-semibold mb-4 text-gray-800'>Recent Activity Timeline</h2>
        <div className='space-y-4'>
          {recentActivity.map((activity) => (
            <div key={activity.id} className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
              <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'success' ? 'bg-green-100 text-green-800' :
                    activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                  <span className='text-sm text-gray-500'>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Blockchain</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Synced
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Market Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Credit Price</span>
              <span className="font-medium text-green-600">$2.45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">24h Volume</span>
              <span className="font-medium text-blue-600">1,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Market Cap</span>
              <span className="font-medium text-purple-600">$3.68M</span>
            </div>
            </div>
          </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">3 pending approvals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">2 compliance alerts</span>
          </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">5 new certificates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}