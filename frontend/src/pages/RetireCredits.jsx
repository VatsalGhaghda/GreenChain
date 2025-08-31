import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
          DocumentTextIcon, 
          CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function RetireCredits() {
  const { currentRole } = useOutletContext();
  const [retirementData, setRetirementData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRetirement, setSelectedRetirement] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRetirementModal, setShowRetirementModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

  // Mock retirement data
  const mockRetirementData = {
    totalRetired: 1250,
    totalImpact: 1250, // metric tons of CO2 equivalent
    pendingRetirements: 2,
    completedRetirements: 8,
    availableCredits: 7500,
    retirementHistory: [
      {
        id: 'RET-001',
        date: '2024-01-20T14:30:00Z',
        status: 'completed',
        creditsRetired: 200,
        projectName: 'Amazon Rainforest Conservation',
        projectType: 'Forest Conservation',
        location: 'Brazil',
        impact: 200,
        certificateId: 'CERT-2024-001',
        blockchainTx: '0x1234567890abcdef1234567890abcdef12345678',
        ipfsHash: 'QmX1234567890abcdef1234567890abcdef12345678',
        description: 'Retired credits to support rainforest conservation and carbon sequestration',
        verificationStatus: 'verified',
        verifier: 'Third-party verification agency',
        documents: [
          { name: 'Retirement Certificate.pdf', size: '1.2 MB', type: 'pdf', url: '#' },
          { name: 'Impact Report.pdf', size: '2.1 MB', type: 'pdf', url: '#' },
          { name: 'Verification Report.pdf', size: '1.8 MB', type: 'pdf', url: '#' }
        ]
      },
      {
        id: 'RET-002',
        date: '2024-01-18T11:15:00Z',
        status: 'completed',
        creditsRetired: 150,
        projectName: 'Solar Energy Development',
        projectType: 'Renewable Energy',
        location: 'India',
        impact: 150,
        certificateId: 'CERT-2024-002',
        blockchainTx: '0x9876543210fedcba9876543210fedcba98765432',
        ipfsHash: 'QmY9876543210fedcba9876543210fedcba98765432',
        description: 'Retired credits to support solar energy infrastructure development',
        verificationStatus: 'verified',
        verifier: 'Third-party verification agency',
        documents: [
          { name: 'Retirement Certificate.pdf', size: '1.1 MB', type: 'pdf', url: '#' },
          { name: 'Impact Report.pdf', size: '1.9 MB', type: 'pdf', url: '#' }
        ]
      },
      {
        id: 'RET-003',
        date: '2024-01-15T16:45:00Z',
        status: 'completed',
        creditsRetired: 300,
        projectName: 'Ocean Cleanup Initiative',
        projectType: 'Ocean Conservation',
        location: 'Pacific Ocean',
        impact: 300,
        certificateId: 'CERT-2024-003',
        blockchainTx: '0x555666777888999aaaabbbcccdddeeefff000111',
        ipfsHash: 'QmZ555666777888999aaaabbbcccdddeeefff000111',
        description: 'Retired credits to support ocean cleanup and marine ecosystem restoration',
        verificationStatus: 'verified',
        verifier: 'Third-party verification agency',
        documents: [
          { name: 'Retirement Certificate.pdf', size: '1.3 MB', type: 'pdf', url: '#' },
          { name: 'Impact Report.pdf', size: '2.4 MB', type: 'pdf', url: '#' },
          { name: 'Verification Report.pdf', size: '1.6 MB', type: 'pdf', url: '#' }
        ]
      },
      {
        id: 'RET-004',
        date: '2024-01-12T09:20:00Z',
        status: 'pending',
        creditsRetired: 100,
        projectName: 'Urban Tree Planting',
        projectType: 'Urban Forestry',
        location: 'New York, USA',
        impact: 100,
        certificateId: 'CERT-2024-004',
        blockchainTx: '0xa111222333444555666777888999aaabbbcccddd111',
        ipfsHash: 'QmA111222333444555666777888999aaabbbcccddd',
        description: 'Retired credits to support urban tree planting and green infrastructure',
        verificationStatus: 'pending',
        verifier: 'Third-party verification agency',
        documents: [
          { name: 'Retirement Application.pdf', size: '1.5 MB', type: 'pdf', url: '#' },
          { name: 'Project Proposal.pdf', size: '2.2 MB', type: 'pdf', url: '#' }
        ]
      },
      {
        id: 'RET-005',
        date: '2024-01-10T13:15:00Z',
        status: 'pending',
        creditsRetired: 75,
        projectName: 'Wetland Restoration',
        projectType: 'Wetland Conservation',
        location: 'Louisiana, USA',
        impact: 75,
        certificateId: 'CERT-2024-005',
        blockchainTx: '0xb222333444555666777888999aaabbbcccdddeee222',
        ipfsHash: 'QmB222333444555666777888999aaabbbcccdddeee222',
        description: 'Retired credits to support wetland restoration and biodiversity conservation',
        verificationStatus: 'pending',
        verifier: 'Third-party verification agency',
        documents: [
          { name: 'Retirement Application.pdf', size: '1.7 MB', type: 'pdf', url: '#' },
          { name: 'Project Proposal.pdf', size: '2.8 MB', type: 'pdf', url: '#' }
        ]
      }
    ],
    availableProjects: [
      {
        id: 'PROJ-001',
        name: 'Amazon Rainforest Conservation',
        type: 'Forest Conservation',
        location: 'Brazil',
        description: 'Protecting and restoring the Amazon rainforest to sequester carbon and preserve biodiversity',
        creditsRequired: 100,
        impact: 100,
        verificationStatus: 'verified',
        organization: 'Amazon Conservation Association',
        website: 'https://amazonconservation.org'
      },
      {
        id: 'PROJ-002',
        name: 'Solar Energy Development',
        type: 'Renewable Energy',
        location: 'India',
        description: 'Developing solar energy infrastructure to replace fossil fuel-based electricity generation',
        creditsRequired: 200,
        impact: 200,
        verificationStatus: 'verified',
        organization: 'Solar Energy Corporation of India',
        website: 'https://seci.co.in'
      },
      {
        id: 'PROJ-003',
        name: 'Ocean Cleanup Initiative',
        type: 'Ocean Conservation',
        location: 'Pacific Ocean',
        description: 'Removing plastic waste from the ocean and restoring marine ecosystems',
        creditsRequired: 150,
        impact: 150,
        verificationStatus: 'verified',
        organization: 'The Ocean Cleanup',
        website: 'https://theoceancleanup.com'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRetirementData(mockRetirementData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRetirements = retirementData.retirementHistory?.filter(retirement => {
    const matchesSearch = retirement.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retirement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retirement.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || retirement.status === filterStatus;
    const matchesProject = filterProject === 'all' || retirement.projectType === filterProject;
    return matchesSearch && matchesStatus && matchesProject;
  }) || [];

  const handleViewDetails = (retirement) => {
    setSelectedRetirement(retirement);
    setShowDetailsModal(true);
  };

  const handleRetireCredits = () => {
    setShowRetirementModal(true);
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

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Retire Credits</h1>
            <p className="mt-2 text-gray-600">
              Retire your carbon credits to make a real environmental impact and receive retirement certificates
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
                                <button 
                      onClick={handleRetireCredits}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Retire Credits
                    </button>
          </div>
        </div>
      </div>

      {/* Impact Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Retired</p>
                      <p className="text-2xl font-semibold text-gray-900">{retirementData.totalRetired.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Environmental Impact</p>
              <p className="text-2xl font-semibold text-gray-900">{retirementData.totalImpact.toLocaleString()} tCO2e</p>
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
              <p className="text-2xl font-semibold text-gray-900">{retirementData.pendingRetirements}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{retirementData.completedRetirements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Projects */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Projects for Credit Retirement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retirementData.availableProjects?.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{project.type}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(project.verificationStatus)}`}>
                    {project.verificationStatus}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>{project.organization}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Credits Required:</span>
                    <p className="text-lg font-semibold text-gray-900">{project.creditsRequired.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-600">Impact:</span>
                    <p className="text-lg font-semibold text-gray-900">{project.impact} tCO2e</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                                            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Retire Credits
                          </button>
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <GlobeAltIcon className="h-4 w-4" />
                  </a>
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search retirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
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
            
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Project Types</option>
              <option value="Forest Conservation">Forest Conservation</option>
              <option value="Renewable Energy">Renewable Energy</option>
              <option value="Ocean Conservation">Ocean Conservation</option>
              <option value="Urban Forestry">Urban Forestry</option>
              <option value="Wetland Conservation">Wetland Conservation</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Showing {filteredRetirements.length} of {retirementData.retirementHistory?.length} retirements
            </span>
          </div>
        </div>
      </div>

      {/* Retirement History */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Retirement History</h3>
        <div className="space-y-4">
          {filteredRetirements.map((retirement) => (
            <div key={retirement.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{retirement.projectName}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(retirement.status)}`}>
                        {retirement.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(retirement.verificationStatus)}`}>
                        {retirement.verificationStatus}
                      </span>
                    </div>
                    <p className="text-gray-600">{retirement.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {retirement.location}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(retirement.date)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{retirement.creditsRetired.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">credits retired</p>
                  </div>
                </div>

                {/* Retirement Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Project Type:</span>
                    <p className="text-sm text-gray-900 capitalize">{retirement.projectType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Environmental Impact:</span>
                    <p className="text-sm text-gray-900">{retirement.impact} tCO2e</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Certificate ID:</span>
                    <p className="text-sm text-gray-900 font-mono">{retirement.certificateId}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Status: {retirement.status}</span>
                    <span>Verification: {retirement.verificationStatus}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(retirement)}
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
      {filteredRetirements.length === 0 && (
                      <div className="text-center py-12">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No retirements found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterProject !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No credits have been retired yet.'
                  }
                </p>
              </div>
      )}

      {/* Retirement Details Modal */}
      {showDetailsModal && selectedRetirement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Retirement Details: {selectedRetirement.projectName}</h3>
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
                  <h4 className="font-medium text-gray-900 mb-4">Retirement Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Retirement ID</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedRetirement.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedRetirement.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Credits Retired</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.creditsRetired.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Environmental Impact</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.impact} tCO2e</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Certificate ID</dt>
                      <dd className="text-sm text-gray-900 font-mono">{selectedRetirement.certificateId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Description</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.description}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Project Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Project Name</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.projectName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Project Type</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedRetirement.projectType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Location</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.location}</dd>
                    </div>
                  </dl>
                </div>
                
                {/* Right Column - Verification & Documents */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Verification Information</h4>
                  <dl className="space-y-3 mb-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verification Status</dt>
                      <dd className="text-sm text-gray-900 capitalize">{selectedRetirement.verificationStatus}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verifier</dt>
                      <dd className="text-sm text-gray-900">{selectedRetirement.verifier}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4">Blockchain Information</h4>
                  <dl className="space-y-3 mb-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Transaction Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedRetirement.blockchainTx}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">IPFS Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedRetirement.ipfsHash}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                  <div className="space-y-2">
                    {selectedRetirement.documents.map((doc, index) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retire Credits Modal */}
      {showRetirementModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Retire Carbon Credits</h3>
                <button
                  onClick={() => setShowRetirementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Credits
                  </label>
                  <div className="text-2xl font-bold text-gray-900">
                    {retirementData.availableCredits?.toLocaleString()} credits
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits to Retire
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={retirementData.availableCredits}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter number of credits"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                    <option value="">Choose a project...</option>
                    {retirementData.availableProjects?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.type} ({project.location})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retirement Purpose
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe the purpose of this credit retirement..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowRetirementModal(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                                            <button className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <CheckCircleIcon className="h-4 w-4 mr-2 inline" />
                            Retire Credits
                          </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
