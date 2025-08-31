import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ComplianceOverview() {
  const { currentRole } = useOutletContext();
  const [complianceData, setComplianceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock compliance data
  const mockComplianceData = {
    overallScore: 87,
    status: 'compliant',
    lastAudit: '2024-01-15T10:00:00Z',
    nextAudit: '2024-07-15T10:00:00Z',
    totalRequirements: 24,
    compliantRequirements: 21,
    nonCompliantRequirements: 2,
    pendingRequirements: 1,
    riskLevel: 'low',
    categories: {
      environmental: { score: 92, status: 'compliant', requirements: 8, compliant: 8, nonCompliant: 0, pending: 0 },
      regulatory: { score: 85, status: 'compliant', requirements: 10, compliant: 8, nonCompliant: 1, pending: 1 },
      technical: { score: 88, status: 'compliant', requirements: 6, compliant: 5, nonCompliant: 1, pending: 0 }
    },
    requirements: [
      {
        id: 'REQ-001',
        title: 'Carbon Intensity Monitoring',
        category: 'environmental',
        description: 'Continuous monitoring of carbon intensity during hydrogen production',
        status: 'compliant',
        priority: 'high',
        lastChecked: '2024-01-10T14:30:00Z',
        nextCheck: '2024-02-10T14:30:00Z',
        evidence: 'Real-time monitoring system operational, data logged every 15 minutes',
        documents: [
          { name: 'Monitoring System Report.pdf', size: '2.1 MB', type: 'pdf', url: '#' },
          { name: 'Data Logs.json', size: '156 KB', type: 'json', url: '#' }
        ],
        auditor: 'Environmental Compliance Agency',
        notes: 'System exceeds minimum requirements, excellent data quality'
      },
      {
        id: 'REQ-002',
        title: 'IPFS Document Storage',
        category: 'technical',
        description: 'All production documents must be stored on IPFS with verifiable hashes',
        status: 'compliant',
        priority: 'high',
        lastChecked: '2024-01-12T09:15:00Z',
        nextCheck: '2024-02-12T09:15:00Z',
        evidence: '100% of documents stored on IPFS, hashes verified on blockchain',
        documents: [
          { name: 'IPFS Storage Report.pdf', size: '1.8 MB', type: 'pdf', url: '#' },
          { name: 'Hash Verification Log.json', size: '89 KB', type: 'json', url: '#' }
        ],
        auditor: 'Technical Standards Board',
        notes: 'Implementation exceeds requirements, excellent security measures'
      },
      {
        id: 'REQ-003',
        title: 'Third-Party Verification',
        category: 'regulatory',
        description: 'All carbon credit claims must be verified by accredited third-party verifiers',
        status: 'compliant',
        priority: 'critical',
        lastChecked: '2024-01-08T16:45:00Z',
        nextCheck: '2024-02-08T16:45:00Z',
        evidence: 'All batches verified by accredited verifiers, verification reports submitted',
        documents: [
          { name: 'Verification Reports.pdf', size: '3.2 MB', type: 'pdf', url: '#' },
          { name: 'Verifier Accreditation.pdf', size: '1.5 MB', type: 'pdf', url: '#' }
        ],
        auditor: 'Regulatory Compliance Office',
        notes: 'All verifications completed on time, excellent documentation'
      },
      {
        id: 'REQ-004',
        title: 'Blockchain Transaction Recording',
        category: 'technical',
        description: 'All credit transactions must be recorded on the blockchain',
        status: 'non-compliant',
        priority: 'high',
        lastChecked: '2024-01-14T11:20:00Z',
        nextCheck: '2024-01-21T11:20:00Z',
        evidence: '3 out of 15 transactions not recorded due to network congestion',
        documents: [
          { name: 'Transaction Log.pdf', size: '2.4 MB', type: 'pdf', url: '#' },
          { name: 'Network Status Report.json', size: '234 KB', type: 'json', url: '#' }
        ],
        auditor: 'Technical Standards Board',
        notes: 'Issue identified, corrective action plan in place, expected resolution within 7 days'
      },
      {
        id: 'REQ-005',
        title: 'Annual Sustainability Report',
        category: 'environmental',
        description: 'Comprehensive annual report on environmental impact and sustainability measures',
        status: 'pending',
        priority: 'medium',
        lastChecked: '2024-01-05T13:00:00Z',
        nextCheck: '2024-02-05T13:00:00Z',
        evidence: 'Report in progress, 70% complete, expected completion by deadline',
        documents: [
          { name: 'Draft Report.pdf', size: '4.1 MB', type: 'pdf', url: '#' },
          { name: 'Data Collection Log.json', size: '445 KB', type: 'json', url: '#' }
        ],
        auditor: 'Environmental Compliance Agency',
        notes: 'Progress on track, no concerns identified'
      }
    ],
    recentAudits: [
      {
        id: 'AUDIT-001',
        date: '2024-01-15T10:00:00Z',
        type: 'Annual Compliance',
        auditor: 'Environmental Compliance Agency',
        score: 87,
        status: 'passed',
        findings: 'Minor issues identified, corrective actions required',
        recommendations: 'Improve blockchain transaction recording, enhance IPFS backup systems'
      },
      {
        id: 'AUDIT-002',
        date: '2023-10-20T14:30:00Z',
        type: 'Technical Assessment',
        auditor: 'Technical Standards Board',
        score: 89,
        status: 'passed',
        findings: 'Technical systems meet requirements',
        recommendations: 'Consider implementing additional security measures'
      },
      {
        id: 'AUDIT-003',
        date: '2023-07-12T09:15:00Z',
        type: 'Regulatory Review',
        auditor: 'Regulatory Compliance Office',
        score: 85,
        status: 'passed',
        findings: 'Regulatory requirements met',
        recommendations: 'Streamline verification process documentation'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComplianceData(mockComplianceData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequirements = complianceData.requirements?.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || req.category === filterCategory;
    return matchesStatus && matchesCategory;
  }) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'non-compliant':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleViewDetails = (requirement) => {
    setSelectedRequirement(requirement);
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

  const getOverallStatusColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
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
            <h1 className="text-3xl font-bold text-gray-900">Compliance Overview</h1>
            <p className="mt-2 text-gray-600">
              Monitor compliance status, regulatory requirements, and audit results
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Overall Compliance Score</h2>
              <p className="text-gray-600">Current compliance status across all categories</p>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getOverallStatusColor(complianceData.overallScore)}`}>
                {complianceData.overallScore}%
              </div>
              <div className="text-sm text-gray-600">
                Status: <span className="capitalize">{complianceData.status}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Compliance Progress</span>
              <span>{complianceData.overallScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${complianceData.overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliant</p>
              <p className="text-2xl font-semibold text-gray-900">{complianceData.compliantRequirements}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non-Compliant</p>
              <p className="text-2xl font-semibold text-gray-900">{complianceData.nonCompliantRequirements}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{complianceData.pendingRequirements}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-semibold text-gray-900 capitalize">{complianceData.riskLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(complianceData.categories || {}).map(([category, data]) => (
            <div key={category} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize">{category}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
                  {data.status}
                </span>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-2">{data.score}%</div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Requirements:</span>
                  <span>{data.requirements}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliant:</span>
                  <span className="text-green-600">{data.compliant}</span>
                </div>
                <div className="flex justify-between">
                  <span>Non-Compliant:</span>
                  <span className="text-red-600">{data.nonCompliant}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="text-yellow-600">{data.pending}</span>
                </div>
              </div>
              
              {/* Category Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Categories</option>
              <option value="environmental">Environmental</option>
              <option value="regulatory">Regulatory</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {filteredRequirements.length} of {complianceData.totalRequirements} requirements
            </span>
          </div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Compliance Requirements</h2>
        <div className="space-y-4">
          {filteredRequirements.map((requirement) => (
            <div key={requirement.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{requirement.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                        {requirement.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                        {requirement.priority}
                      </span>
                    </div>
                    <p className="text-gray-600">{requirement.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Category: {requirement.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(requirement.status)}
                  </div>
                </div>

                {/* Requirement Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Last Checked:</span>
                    <p className="text-sm text-gray-900">{formatDate(requirement.lastChecked)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Next Check:</span>
                    <p className="text-sm text-gray-900">{formatDate(requirement.nextCheck)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Auditor:</span>
                    <p className="text-sm text-gray-900">{requirement.auditor}</p>
                  </div>
                </div>

                {/* Evidence */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence:</h4>
                  <p className="text-sm text-gray-600">{requirement.evidence}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Priority: {requirement.priority}</span>
                    <span>Category: {requirement.category}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(requirement)}
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

      {/* Recent Audits */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Audits</h2>
        <div className="space-y-4">
          {complianceData.recentAudits?.map((audit) => (
            <div key={audit.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{audit.type}</h3>
                  <p className="text-sm text-gray-600">Auditor: {audit.auditor}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{audit.score}%</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                    {audit.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Date:</span>
                  <p className="text-gray-900">{formatDate(audit.date)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Findings:</span>
                  <p className="text-gray-900">{audit.findings}</p>
                </div>
              </div>
              
              {audit.recommendations && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendations:</h4>
                  <p className="text-sm text-blue-700">{audit.recommendations}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requirement Details Modal */}
      {showDetailsModal && selectedRequirement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Requirement Details: {selectedRequirement.title}</h3>
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
                  <h4 className="font-medium text-gray-900 mb-4">Requirement Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Title</dt>
                      <dd className="text-sm text-gray-900">{selectedRequirement.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Category</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedRequirement.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Priority</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedRequirement.priority}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedRequirement.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Description</dt>
                      <dd className="text-sm text-gray-900">{selectedRequirement.description}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Timeline</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Last Checked</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedRequirement.lastChecked)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Next Check</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedRequirement.nextCheck)}</dd>
                    </div>
                  </dl>
                </div>
                
                {/* Right Column - Evidence & Documents */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Evidence</h4>
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <p className="text-sm text-gray-700">{selectedRequirement.evidence}</p>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                  <div className="space-y-2">
                    {selectedRequirement.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Auditor Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Auditor</dt>
                      <dd className="text-sm text-gray-900">{selectedRequirement.auditor}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Notes</dt>
                      <dd className="text-sm text-gray-900">{selectedRequirement.notes}</dd>
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
