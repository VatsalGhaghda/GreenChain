import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  EyeIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ApprovedBatches() {
  const { currentRole } = useOutletContext();
  const [approvedBatches, setApprovedBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [sortBy, setSortBy] = useState('approvalDate');

  // Mock data for approved batches
  const mockApprovedBatches = [
    {
      id: 'BATCH-001',
      batchId: 'GH-2024-001',
      producer: 'Green Hydrogen Corp',
      amount: 1500.5,
      carbonIntensity: 2.1,
      method: 'Steam Methane Reforming (SMR)',
      description: 'Large-scale hydrogen production batch with carbon capture',
      submissionDate: '2024-01-15T10:30:00Z',
      approvalDate: '2024-01-18T14:20:00Z',
      creditsIssued: 1500,
      creditPrice: 25.50,
      totalValue: 38262.75,
      location: 'Texas, USA',
      facility: 'GH-Plant-01',
      technology: 'Advanced SMR with CCS',
      certification: 'ISO 14001',
      compliance: 'EPA Standards',
      ipfsHash: 'QmX1234567890abcdef1234567890abcdef12345678',
      blockchainTx: '0x1234567890abcdef1234567890abcdef12345678',
      verifier: 'Third-party verification agency',
      verificationDate: '2024-01-17T16:00:00Z',
      documents: [
        { name: 'Production Report.pdf', size: '2.4 MB', type: 'pdf', url: '#' },
        { name: 'Carbon Intensity Analysis.json', size: '156 KB', type: 'json', url: '#' },
        { name: 'Quality Assurance Report.txt', size: '89 KB', type: 'txt', url: '#' },
        { name: 'Approval Certificate.pdf', size: '1.2 MB', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 'BATCH-002',
      batchId: 'GH-2024-002',
      producer: 'Blue Energy Solutions',
      amount: 875.25,
      carbonIntensity: 1.8,
      method: 'Electrolysis',
      description: 'Renewable energy powered hydrogen production',
      submissionDate: '2024-01-20T14:20:00Z',
      approvalDate: '2024-01-23T11:15:00Z',
      creditsIssued: 875,
      creditPrice: 28.75,
      totalValue: 25156.25,
      location: 'California, USA',
      facility: 'BE-Solar-02',
      technology: 'PEM Electrolysis',
      certification: 'Green Energy Certified',
      compliance: 'CARB Standards',
      ipfsHash: 'QmY9876543210fedcba9876543210fedcba98765432',
      blockchainTx: '0x9876543210fedcba9876543210fedcba98765432',
      verifier: 'Third-party verification agency',
      verificationDate: '2024-01-22T14:30:00Z',
      documents: [
        { name: 'Renewable Energy Certificate.pdf', size: '1.2 MB', type: 'pdf', url: '#' },
        { name: 'Electrolysis Efficiency Data.json', size: '234 KB', type: 'json', url: '#' },
        { name: 'Approval Certificate.pdf', size: '1.1 MB', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 'BATCH-003',
      batchId: 'GH-2024-003',
      producer: 'EcoFuel Industries',
      amount: 2200.0,
      carbonIntensity: 3.2,
      method: 'Biomass Gasification',
      description: 'Sustainable biomass-based hydrogen production',
      submissionDate: '2024-01-25T09:15:00Z',
      approvalDate: '2024-01-28T15:45:00Z',
      creditsIssued: 2200,
      creditPrice: 22.00,
      totalValue: 48400.00,
      location: 'Oregon, USA',
      facility: 'EF-Bio-03',
      technology: 'Advanced Biomass Gasification',
      certification: 'FSC Certified',
      compliance: 'State Standards',
      ipfsHash: 'QmZ555666777888999aaaabbbcccdddeeefff000111',
      blockchainTx: '0x555666777888999aaaabbbcccdddeeefff000111222',
      verifier: 'Third-party verification agency',
      verificationDate: '2024-01-27T12:00:00Z',
      documents: [
        { name: 'Biomass Source Verification.pdf', size: '3.1 MB', type: 'pdf', url: '#' },
        { name: 'Gasification Process Data.json', size: '445 KB', type: 'json', url: '#' },
        { name: 'Sustainability Assessment.txt', size: '178 KB', type: 'txt', url: '#' },
        { name: 'Approval Certificate.pdf', size: '1.3 MB', type: 'pdf', url: '#' }
      ]
    },
    {
      id: 'BATCH-004',
      batchId: 'GH-2024-004',
      producer: 'Solar Hydrogen Ltd',
      amount: 650.75,
      carbonIntensity: 1.2,
      method: 'Solar Electrolysis',
      description: 'Direct solar-powered hydrogen production',
      submissionDate: '2024-01-30T08:45:00Z',
      approvalDate: '2024-02-02T13:20:00Z',
      creditsIssued: 650,
      creditPrice: 32.50,
      totalValue: 21125.00,
      location: 'Arizona, USA',
      facility: 'SH-Solar-04',
      technology: 'Concentrated Solar + PEM',
      certification: 'Solar Energy Certified',
      compliance: 'Federal Standards',
      ipfsHash: 'QmA111222333444555666777888999aaabbbcccddd',
      blockchainTx: '0xa111222333444555666777888999aaabbbcccddd111',
      verifier: 'Third-party verification agency',
      verificationDate: '2024-02-01T10:15:00Z',
      documents: [
        { name: 'Solar Energy Certificate.pdf', size: '1.8 MB', type: 'pdf', url: '#' },
        { name: 'Electrolysis Performance Data.json', size: '189 KB', type: 'json', url: '#' },
        { name: 'Approval Certificate.pdf', size: '1.0 MB', type: 'pdf', url: '#' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApprovedBatches(mockApprovedBatches);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBatches = approvedBatches.filter(batch => {
    const matchesSearch = batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMethod === 'all' || batch.method.toLowerCase().includes(filterMethod.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const sortedBatches = [...filteredBatches].sort((a, b) => {
    switch (sortBy) {
      case 'approvalDate':
        return new Date(b.approvalDate) - new Date(a.approvalDate);
      case 'amount':
        return b.amount - a.amount;
      case 'creditsIssued':
        return b.creditsIssued - a.creditsIssued;
      case 'totalValue':
        return b.totalValue - a.totalValue;
      case 'producer':
        return a.producer.localeCompare(b.producer);
      default:
        return 0;
    }
  });

  const handleViewDetails = (batch) => {
    setSelectedBatch(batch);
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

  const totalCreditsIssued = approvedBatches.reduce((sum, batch) => sum + batch.creditsIssued, 0);
  const totalValue = approvedBatches.reduce((sum, batch) => sum + batch.totalValue, 0);
  const averageCarbonIntensity = approvedBatches.reduce((sum, batch) => sum + batch.carbonIntensity, 0) / approvedBatches.length;

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
            <h1 className="text-3xl font-bold text-gray-900">Approved Batches</h1>
            <p className="mt-2 text-gray-600">
              View all approved carbon credit batches and their issued credits
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Data
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
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedBatches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Credits Issued</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCreditsIssued.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Carbon Intensity</p>
              <p className="text-2xl font-semibold text-gray-900">{averageCarbonIntensity.toFixed(1)} kg CO2e/kg H2</p>
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
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Methods</option>
              <option value="SMR">Steam Methane Reforming</option>
              <option value="Electrolysis">Electrolysis</option>
              <option value="Biomass">Biomass Gasification</option>
              <option value="Solar">Solar Electrolysis</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="approvalDate">Approval Date</option>
              <option value="amount">Production Amount</option>
              <option value="creditsIssued">Credits Issued</option>
              <option value="totalValue">Total Value</option>
              <option value="producer">Producer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approved Batches List */}
      <div className="space-y-6">
        {sortedBatches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{batch.batchId}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Approved
                    </span>
                  </div>
                  <p className="text-gray-600">{batch.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Producer: {batch.producer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>

              {/* Batch Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Production Amount:</span>
                  <p className="text-lg font-semibold text-gray-900">{batch.amount} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Credits Issued:</span>
                  <p className="text-lg font-semibold text-gray-900">{batch.creditsIssued.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Credit Price:</span>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(batch.creditPrice)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Total Value:</span>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(batch.totalValue)}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{batch.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{batch.facility}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Approved: {formatDate(batch.approvalDate)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Submitted: {formatDate(batch.submissionDate)}</span>
                  <span>Approved: {formatDate(batch.approvalDate)}</span>
                  <span>Verifier: {batch.verifier}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(batch)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <DocumentDuplicateIcon className="h-4 w-4 mr-2" />
                    View Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedBatches.length === 0 && (
        <div className="text-center py-12">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No approved batches found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterMethod !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No batches have been approved yet.'
            }
          </p>
        </div>
      )}

      {/* Batch Details Modal */}
      {showDetailsModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Batch Details: {selectedBatch.batchId}</h3>
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
                  <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Batch ID</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.batchId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Producer</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.producer}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Production Amount</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.amount} kg</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Credits Issued</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.creditsIssued.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Credit Price</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(selectedBatch.creditPrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Total Value</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(selectedBatch.totalValue)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Production Method</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.method}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Description</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.description}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Timeline</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Submission Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedBatch.submissionDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verification Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedBatch.verificationDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Approval Date</dt>
                      <dd className="text-sm text-gray-900">{formatDate(selectedBatch.approvalDate)}</dd>
                    </div>
                  </dl>
                </div>
                
                {/* Right Column - Technical Details & Documents */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Technical Details</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Carbon Intensity</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.carbonIntensity} kg CO2e/kg H2</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Technology</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.technology}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Location</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Facility</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.facility}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Certification</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.certification}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Compliance</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.compliance}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verifier</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.verifier}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Blockchain & IPFS</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Blockchain Transaction</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedBatch.blockchainTx}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">IPFS Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedBatch.ipfsHash}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Documents</h4>
                  <div className="space-y-2">
                    {selectedBatch.documents.map((doc, index) => (
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
    </div>
  );
}
