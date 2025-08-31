import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Portfolio() {
  const { currentRole } = useOutletContext();
  const [portfolioData, setPortfolioData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('1M');

  // Mock portfolio data
  const mockPortfolioData = {
    totalCredits: 8750,
    totalValue: 218750.00,
    averagePrice: 25.00,
    totalReturn: 12.5,
    monthlyReturn: 2.3,
    creditBreakdown: [
      { category: 'Electrolysis', credits: 3200, value: 89600.00, percentage: 36.6 },
      { category: 'Steam Methane Reforming', credits: 2800, value: 67200.00, percentage: 30.7 },
      { category: 'Biomass Gasification', credits: 1750, value: 38500.00, percentage: 17.6 },
      { category: 'Solar Electrolysis', credits: 1000, value: 23450.00, percentage: 10.7 }
    ],
    recentTransactions: [
      {
        id: 'TXN-001',
        date: '2024-01-20T14:15:00Z',
        type: 'purchase',
        credits: 500,
        price: 25.50,
        total: 12750.00,
        seller: 'Green Hydrogen Corp',
        batchId: 'GH-2024-001',
        status: 'completed',
        blockchainTx: '0x1234567890abcdef1234567890abcdef12345678'
      },
      {
        id: 'TXN-002',
        date: '2024-01-18T11:30:00Z',
        type: 'purchase',
        credits: 300,
        price: 24.75,
        total: 7425.00,
        seller: 'Blue Energy Solutions',
        batchId: 'GH-2024-002',
        status: 'completed',
        blockchainTx: '0x9876543210fedcba9876543210fedcba98765432'
      },
      {
        id: 'TXN-003',
        date: '2024-01-15T16:45:00Z',
        type: 'sale',
        credits: 200,
        price: 26.00,
        total: 5200.00,
        buyer: 'Energy Corp',
        batchId: 'GH-2024-003',
        status: 'completed',
        blockchainTx: '0x555666777888999aaaabbbcccdddeeefff000111'
      },
      {
        id: 'TXN-004',
        date: '2024-01-12T09:20:00Z',
        type: 'purchase',
        credits: 750,
        price: 23.50,
        total: 17625.00,
        seller: 'EcoFuel Industries',
        batchId: 'GH-2024-004',
        status: 'completed',
        blockchainTx: '0xa111222333444555666777888999aaabbbcccddd111'
      },
      {
        id: 'TXN-005',
        date: '2024-01-10T13:15:00Z',
        type: 'purchase',
        credits: 400,
        price: 25.25,
        total: 10100.00,
        seller: 'Solar Hydrogen Ltd',
        batchId: 'GH-2024-005',
        status: 'pending',
        blockchainTx: '0xb222333444555666777888999aaabbbcccdddeee222'
      }
    ],
    performanceHistory: [
      { date: '2024-01-01', credits: 8000, value: 200000.00, return: 0 },
      { date: '2024-01-07', credits: 8200, value: 205000.00, return: 2.5 },
      { date: '2024-01-14', credits: 8500, value: 212500.00, return: 6.25 },
      { date: '2024-01-21', credits: 8750, value: 218750.00, return: 9.38 }
    ],
    upcomingExpirations: [
      {
        batchId: 'GH-2023-001',
        credits: 500,
        expirationDate: '2024-03-15T00:00:00Z',
        daysUntilExpiration: 54,
        producer: 'Green Hydrogen Corp',
        location: 'Texas, USA'
      },
      {
        batchId: 'GH-2023-002',
        credits: 300,
        expirationDate: '2024-04-20T00:00:00Z',
        daysUntilExpiration: 90,
        producer: 'Blue Energy Solutions',
        location: 'California, USA'
      }
    ],
    riskMetrics: {
      diversificationScore: 85,
      creditQualityScore: 92,
      liquidityScore: 78,
      overallRisk: 'low'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPortfolioData(mockPortfolioData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTransactions = portfolioData.recentTransactions?.filter(transaction => {
    const matchesSearch = transaction.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.seller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.buyer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'purchase':
        return 'bg-blue-100 text-blue-800';
      case 'sale':
        return 'bg-purple-100 text-purple-800';
      case 'transfer':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpirationColor = (days) => {
    if (days <= 30) return 'bg-red-100 text-red-800';
    if (days <= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
            <p className="mt-2 text-gray-600">
              Track your carbon credit holdings, performance, and transaction history
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-semibold text-gray-900">{portfolioData.totalCredits.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(portfolioData.totalValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">{portfolioData.totalReturn}%</p>
                <ArrowUpIcon className="h-5 w-5 text-green-600 ml-2" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(portfolioData.averagePrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Breakdown and Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Credit Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Breakdown by Category</h3>
          <div className="space-y-4">
            {portfolioData.creditBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{category.credits.toLocaleString()} credits</p>
                  <p className="text-xs text-gray-500">{formatCurrency(category.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Diversification Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${portfolioData.riskMetrics.diversificationScore}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{portfolioData.riskMetrics.diversificationScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Credit Quality</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${portfolioData.riskMetrics.creditQualityScore}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{portfolioData.riskMetrics.creditQualityScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Liquidity</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${portfolioData.riskMetrics.liquidityScore}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{portfolioData.riskMetrics.liquidityScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-900">Overall Risk</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(portfolioData.riskMetrics.overallRisk)}`}>
                {portfolioData.riskMetrics.overallRisk}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Expirations */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Credit Expirations</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolioData.upcomingExpirations.map((expiration, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expiration.batchId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expiration.credits.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(expiration.expirationDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpirationColor(expiration.daysUntilExpiration)}`}>
                        {expiration.daysUntilExpiration} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expiration.producer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expiration.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              <option value="purchase">Purchase</option>
              <option value="sale">Sale</option>
              <option value="transfer">Transfer</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="1W">1 Week</option>
              <option value="1M">1 Month</option>
              <option value="3M">3 Months</option>
              <option value="1Y">1 Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{transaction.batchId}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {transaction.type === 'purchase' ? `Purchased from ${transaction.seller}` : `Sold to ${transaction.buyer}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{transaction.credits.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">credits</p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Price per Credit:</span>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(transaction.price)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(transaction.total)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Date:</span>
                    <p className="text-sm text-gray-900">{formatDate(transaction.date)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Type: {transaction.type}</span>
                    <span>Status: {transaction.status}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(transaction)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No transactions have been recorded yet.'
            }
          </p>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Transaction Details: {selectedTransaction.batchId}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Transaction Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Transaction Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Transaction ID</dt>
                      <dd className="text-sm text-gray-900">{selectedTransaction.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Type</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedTransaction.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedTransaction.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedTransaction.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Credits</dt>
                      <dd className="text-sm text-gray-900">{selectedTransaction.credits.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Price per Credit</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(selectedTransaction.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Total Amount</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(selectedTransaction.total)}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Counterparty Information</h4>
                  <dl className="space-y-3">
                    {selectedTransaction.type === 'purchase' ? (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Seller</dt>
                        <dd className="text-sm text-gray-900">{selectedTransaction.seller}</dd>
                      </div>
                    ) : (
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Buyer</dt>
                        <dd className="text-sm text-gray-900">{selectedTransaction.buyer}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                {/* Right Column - Blockchain & Batch Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Blockchain Information</h4>
                  <dl className="space-y-3 mb-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Transaction Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedTransaction.blockchainTx}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4">Batch Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Batch ID</dt>
                      <dd className="text-sm text-gray-900">{selectedTransaction.batchId}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
