import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ClockIcon, 
  DocumentTextIcon, 
  UserIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AuditTrail() {
  const { currentRole } = useOutletContext();
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  // Mock audit trail data
  const mockAuditData = [
    {
      id: 'AUDIT-001',
      timestamp: '2024-01-20T14:30:00Z',
      eventType: 'batch_submission',
      status: 'success',
      user: 'john.doe@greenhydrogen.com',
      userRole: 'producer',
      action: 'Submitted new hydrogen production batch',
      description: 'Producer submitted batch GH-2024-005 for carbon credit verification',
      details: {
        batchId: 'GH-2024-005',
        amount: 1200.5,
        method: 'Electrolysis',
        location: 'California, USA',
        ipfsHash: 'QmX1234567890abcdef1234567890abcdef12345678',
        blockchainTx: '0x1234567890abcdef1234567890abcdef12345678'
      },
      metadata: {
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        sessionId: 'sess_abc123def456',
        requestId: 'req_789ghi012jkl'
      },
      impact: 'medium',
      category: 'production'
    },
    {
      id: 'AUDIT-002',
      timestamp: '2024-01-20T14:25:00Z',
      eventType: 'verification_approval',
      status: 'success',
      user: 'sarah.verifier@certagency.com',
      userRole: 'certifier',
      action: 'Approved batch verification',
      description: 'Third-party verifier approved batch GH-2024-004 after review',
      details: {
        batchId: 'GH-2024-004',
        verificationScore: 95,
        complianceStatus: 'compliant',
        verificationReport: 'verification_report_004.pdf',
        auditor: 'Sarah Johnson'
      },
      metadata: {
        ipAddress: '203.45.67.89',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionId: 'sess_def456ghi789',
        requestId: 'req_012jkl345mno'
      },
      impact: 'high',
      category: 'verification'
    },
    {
      id: 'AUDIT-003',
      timestamp: '2024-01-20T14:20:00Z',
      eventType: 'credit_issuance',
      status: 'success',
      user: 'system@blockchain.com',
      userRole: 'system',
      action: 'Issued carbon credits',
      description: 'System automatically issued 2,200 carbon credits for approved batch',
      details: {
        batchId: 'GH-2024-003',
        creditsIssued: 2200,
        creditPrice: 22.00,
        totalValue: 48400.00,
        recipient: 'EcoFuel Industries',
        walletAddress: '0xEcoFuel1234567890abcdef1234567890abcdef12'
      },
      metadata: {
        ipAddress: '127.0.0.1',
        userAgent: 'System/1.0',
        sessionId: 'system_sess_001',
        requestId: 'system_req_001'
      },
      impact: 'high',
      category: 'financial'
    },
    {
      id: 'AUDIT-004',
      timestamp: '2024-01-20T14:15:00Z',
      eventType: 'marketplace_transaction',
      status: 'success',
      user: 'buyer@energycorp.com',
      userRole: 'consumer',
      action: 'Purchased carbon credits',
      description: 'Energy Corp purchased 500 carbon credits from marketplace',
      details: {
        transactionId: 'TXN-2024-001',
        creditsPurchased: 500,
        pricePerCredit: 25.50,
        totalAmount: 12750.00,
        seller: 'Green Hydrogen Corp',
        paymentMethod: 'Ethereum'
      },
      metadata: {
        ipAddress: '45.67.89.123',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        sessionId: 'sess_ghi789jkl012',
        requestId: 'req_345mno678pqr'
      },
      impact: 'medium',
      category: 'marketplace'
    },
    {
      id: 'AUDIT-005',
      timestamp: '2024-01-20T14:10:00Z',
      eventType: 'compliance_check',
      status: 'warning',
      user: 'regulator@epa.gov',
      userRole: 'regulator',
      action: 'Identified compliance issue',
      description: 'Regulator identified minor compliance issue in batch verification process',
      details: {
        batchId: 'GH-2024-002',
        issueType: 'documentation_incomplete',
        severity: 'low',
        correctiveAction: 'Additional documentation required',
        deadline: '2024-01-27T14:10:00Z'
      },
      metadata: {
        ipAddress: '198.51.100.45',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        sessionId: 'sess_jkl012mno345',
        requestId: 'req_678pqr901stu'
      },
      impact: 'medium',
      category: 'compliance'
    },
    {
      id: 'AUDIT-006',
      timestamp: '2024-01-20T14:05:00Z',
      eventType: 'system_maintenance',
      status: 'info',
      user: 'admin@system.com',
      userRole: 'admin',
      action: 'Scheduled system maintenance',
      description: 'System administrator scheduled routine maintenance for blockchain nodes',
      details: {
        maintenanceType: 'blockchain_sync',
        duration: '2 hours',
        affectedServices: 'Transaction processing, Credit verification',
        startTime: '2024-01-21T02:00:00Z',
        endTime: '2024-01-21T04:00:00Z'
      },
      metadata: {
        ipAddress: '10.0.0.1',
        userAgent: 'Admin/1.0',
        sessionId: 'admin_sess_001',
        requestId: 'admin_req_001'
      },
      impact: 'low',
      category: 'system'
    },
    {
      id: 'AUDIT-007',
      timestamp: '2024-01-20T14:00:00Z',
      eventType: 'fraud_detection',
      status: 'error',
      user: 'security@system.com',
      userRole: 'system',
      action: 'Detected potential fraud attempt',
      description: 'Security system detected suspicious activity in batch submission',
      details: {
        batchId: 'GH-2024-006',
        fraudType: 'duplicate_submission',
        confidence: 95,
        actionTaken: 'Submission blocked, user account flagged',
        securityLevel: 'high'
      },
      metadata: {
        ipAddress: '127.0.0.1',
        userAgent: 'Security/1.0',
        sessionId: 'security_sess_001',
        requestId: 'security_req_001'
      },
      impact: 'critical',
      category: 'security'
    },
    {
      id: 'AUDIT-008',
      timestamp: '2024-01-20T13:55:00Z',
      eventType: 'user_login',
      status: 'success',
      user: 'jane.certifier@verification.com',
      userRole: 'certifier',
      action: 'User logged in',
      description: 'Certifier user successfully authenticated to the system',
      details: {
        loginMethod: 'password_2fa',
        location: 'New York, USA',
        deviceType: 'desktop',
        lastLogin: '2024-01-19T09:30:00Z'
      },
      metadata: {
        ipAddress: '172.16.1.50',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        sessionId: 'sess_mno345pqr678',
        requestId: 'req_901stu234vwx'
      },
      impact: 'low',
      category: 'authentication'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAuditData(mockAuditData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = auditData.filter(event => {
    const matchesSearch = event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.eventType === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesUser = filterUser === 'all' || event.userRole === filterUser;
    return matchesSearch && matchesType && matchesStatus && matchesUser;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'timestamp':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'impact':
        const impactOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      case 'user':
        return a.user.localeCompare(b.user);
      case 'eventType':
        return a.eventType.localeCompare(b.eventType);
      default:
        return 0;
    }
  });

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case 'batch_submission':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />;
      case 'verification_approval':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'credit_issuance':
        return <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />;
      case 'marketplace_transaction':
        return <ChartBarIcon className="h-5 w-5 text-indigo-600" />;
      case 'compliance_check':
        return <ShieldExclamationIcon className="h-5 w-5 text-yellow-600" />;
      case 'system_maintenance':
        return <CogIcon className="h-5 w-5 text-gray-600" />;
      case 'fraud_detection':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'user_login':
        return <UserIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const eventTypeOptions = [
    { value: 'all', label: 'All Event Types' },
    { value: 'batch_submission', label: 'Batch Submission' },
    { value: 'verification_approval', label: 'Verification Approval' },
    { value: 'credit_issuance', label: 'Credit Issuance' },
    { value: 'marketplace_transaction', label: 'Marketplace Transaction' },
    { value: 'compliance_check', label: 'Compliance Check' },
    { value: 'system_maintenance', label: 'System Maintenance' },
    { value: 'fraud_detection', label: 'Fraud Detection' },
    { value: 'user_login', label: 'User Login' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' }
  ];

  const userRoleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'producer', label: 'Producer' },
    { value: 'certifier', label: 'Certifier' },
    { value: 'regulator', label: 'Regulator' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'admin', label: 'Admin' },
    { value: 'system', label: 'System' }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
            <p className="mt-2 text-gray-600">
              Complete audit log of all system activities, transactions, and user actions
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Log
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{auditData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-semibold text-gray-900">
                {auditData.filter(e => e.status === 'success').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {auditData.filter(e => e.status === 'warning').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {auditData.filter(e => e.status === 'error').length}
              </p>
            </div>
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
                placeholder="Search events..."
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
              {eventTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {userRoleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="timestamp">Timestamp</option>
              <option value="impact">Impact</option>
              <option value="user">User</option>
              <option value="eventType">Event Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Events List */}
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getEventTypeIcon(event.eventType)}
                    <h3 className="text-lg font-semibold text-gray-900">{event.action}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {event.user}
                    </span>
                    <span className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      {event.userRole}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(event.status)}
                </div>
              </div>

              {/* Event Details Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <p className="text-sm text-gray-900 capitalize">{event.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Event Type:</span>
                  <p className="text-sm text-gray-900 capitalize">{event.eventType.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Impact: {event.impact}</span>
                  <span>Category: {event.category}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(event)}
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

      {/* Empty State */}
      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No audit events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterUser !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No audit events have been recorded yet.'
            }
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Event Details: {selectedEvent.action}</h3>
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
                {/* Left Column - Basic Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Event Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Event ID</dt>
                      <dd className="text-sm text-gray-900">{selectedEvent.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Timestamp</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedEvent.timestamp)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Event Type</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedEvent.eventType.replace('_', ' ')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedEvent.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Impact</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedEvent.impact}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Category</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedEvent.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Action</dt>
                      <dd className="text-sm text-gray-900">{selectedEvent.action}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Description</dt>
                      <dd className="text-sm text-gray-900">{selectedEvent.description}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">User Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">User</dt>
                      <dd className="text-sm text-gray-900">{selectedEvent.user}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Role</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedEvent.userRole}</dd>
                    </div>
                  </dl>
                </div>
                
                {/* Right Column - Details & Metadata */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Event Details</h4>
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedEvent.details, null, 2)}
                    </pre>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-4">Metadata</h4>
                  <dl className="space-y-3 mb-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">IP Address</dt>
                      <dd className="text-sm text-gray-900 font-mono">{selectedEvent.metadata.ipAddress}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">User Agent</dt>
                      <dd className="text-sm text-gray-900 font-mono text-xs break-all">{selectedEvent.metadata.userAgent}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Session ID</dt>
                      <dd className="text-sm text-gray-900 font-mono">{selectedEvent.metadata.sessionId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Request ID</dt>
                      <dd className="text-sm text-gray-900 font-mono">{selectedEvent.metadata.requestId}</dd>
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
