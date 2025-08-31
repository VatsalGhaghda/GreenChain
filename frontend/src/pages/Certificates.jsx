import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  QrCodeIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Certificates() {
  const { currentRole } = useOutletContext();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Mock data for retirement certificates
  const mockCertificates = [
    {
      id: 'CERT-001',
      certificateNumber: 'RC-2024-001',
      batchId: 'BATCH-001',
      producer: 'Green Hydrogen Corp',
      amount: 500,
      carbonIntensity: 2.1,
      method: 'Steam Methane Reforming (SMR)',
      retirementDate: '2024-01-20T14:30:00Z',
      retirementReason: 'Corporate sustainability commitment',
      status: 'verified',
      verificationHash: '0x1234567890abcdef1234567890abcdef12345678',
      ipfsHash: 'QmX1234567890abcdef1234567890abcdef12345678',
      metadata: {
        location: 'Texas, USA',
        facility: 'GH-Plant-01',
        technology: 'Advanced SMR with CCS',
        certification: 'ISO 14001',
        compliance: 'EPA Standards',
        verifier: 'Third-party verification agency',
        verificationDate: '2024-01-20T15:00:00Z'
      },
      documents: [
        { name: 'Retirement Certificate.pdf', size: '2.1 MB', type: 'pdf', url: '#' },
        { name: 'Verification Report.pdf', size: '1.8 MB', type: 'pdf', url: '#' },
        { name: 'Blockchain Transaction.json', size: '156 KB', type: 'json', url: '#' }
      ]
    },
    {
      id: 'CERT-002',
      certificateNumber: 'RC-2024-002',
      batchId: 'BATCH-002',
      producer: 'Blue Energy Solutions',
      amount: 300,
      carbonIntensity: 1.8,
      method: 'Electrolysis',
      retirementDate: '2024-01-22T10:15:00Z',
      retirementReason: 'Product carbon neutrality',
      status: 'verified',
      verificationHash: '0x9876543210fedcba9876543210fedcba98765432',
      ipfsHash: 'QmY9876543210fedcba9876543210fedcba98765432',
      metadata: {
        location: 'California, USA',
        facility: 'BE-Solar-02',
        technology: 'PEM Electrolysis',
        certification: 'Green Energy Certified',
        compliance: 'CARB Standards',
        verifier: 'Third-party verification agency',
        verificationDate: '2024-01-22T11:00:00Z'
      },
      documents: [
        { name: 'Retirement Certificate.pdf', size: '1.9 MB', type: 'pdf', url: '#' },
        { name: 'Verification Report.pdf', size: '1.6 MB', type: 'pdf', url: '#' },
        { name: 'Blockchain Transaction.json', size: '142 KB', type: 'json', url: '#' }
      ]
    },
    {
      id: 'CERT-003',
      certificateNumber: 'RC-2024-003',
      batchId: 'BATCH-003',
      producer: 'EcoFuel Industries',
      amount: 750,
      carbonIntensity: 3.2,
      method: 'Biomass Gasification',
      retirementDate: '2024-01-25T16:45:00Z',
      retirementReason: 'Event carbon offset',
      status: 'pending',
      verificationHash: null,
      ipfsHash: 'QmZ555666777888999aaaabbbcccdddeeefff000111',
      metadata: {
        location: 'Oregon, USA',
        facility: 'EF-Bio-03',
        technology: 'Advanced Biomass Gasification',
        certification: 'FSC Certified',
        compliance: 'State Standards',
        verifier: 'Pending verification',
        verificationDate: null
      },
      documents: [
        { name: 'Retirement Certificate.pdf', size: '2.3 MB', type: 'pdf', url: '#' },
        { name: 'Event Documentation.pdf', size: '1.4 MB', type: 'pdf', url: '#' },
        { name: 'Blockchain Transaction.json', size: '167 KB', type: 'json', url: '#' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCertificates(mockCertificates);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.retirementReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedCertificates = [...filteredCertificates].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.retirementDate) - new Date(a.retirementDate);
      case 'amount':
        return b.amount - a.amount;
      case 'status':
        return a.status.localeCompare(b.status);
      case 'number':
        return a.certificateNumber.localeCompare(b.certificateNumber);
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleViewDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setShowDetailsModal(true);
  };

  const handleViewQR = (certificate) => {
    setSelectedCertificate(certificate);
    setShowQRModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateQRCode = (certificate) => {
    // In a real implementation, this would generate an actual QR code
    // For now, we'll create a simple visual representation
    const qrData = `${certificate.certificateNumber}|${certificate.verificationHash || 'pending'}|${certificate.ipfsHash}`;
    return qrData;
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
            <h1 className="text-3xl font-bold text-gray-900">Retirement Certificates</h1>
            <p className="mt-2 text-gray-600">
              View and manage carbon credit retirement certificates with verification tools
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export All
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Generate Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-2xl font-semibold text-gray-900">{certificates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">
                {certificates.filter(c => c.status === 'verified').length}
              </p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {certificates.filter(c => c.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Retired</p>
              <p className="text-2xl font-semibold text-gray-900">
                {certificates.reduce((sum, c) => sum + c.amount, 0)} kg
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
                placeholder="Search certificates..."
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
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="date">Retirement Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="number">Certificate Number</option>
            </select>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-6">
        {sortedCertificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{certificate.certificateNumber}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                      {certificate.status}
                    </span>
                  </div>
                  <p className="text-gray-600">Batch: {certificate.batchId} • Producer: {certificate.producer}</p>
                  <p className="text-sm text-gray-500 mt-1">{certificate.retirementReason}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(certificate.status)}
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Amount Retired:</span>
                  <p className="text-lg font-semibold text-gray-900">{certificate.amount} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Carbon Intensity:</span>
                  <p className="text-lg font-semibold text-gray-900">{certificate.carbonIntensity} kg CO2e/kg H2</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Method:</span>
                  <p className="text-lg font-semibold text-gray-900">{certificate.method.split(' ')[0]}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Retirement Date:</span>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(certificate.retirementDate)}</p>
                </div>
              </div>

              {/* Verification Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Verification Hash:</span>
                    <p className="text-sm font-mono text-gray-900 break-all">
                      {certificate.verificationHash || 'Pending verification'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">IPFS Hash:</span>
                    <p className="text-sm font-mono text-gray-900 break-all">{certificate.ipfsHash}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Retired: {formatDate(certificate.retirementDate)}</span>
                  {certificate.metadata.verificationDate && (
                    <span>Verified: {formatDate(certificate.metadata.verificationDate)}</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(certificate)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  <button
                    onClick={() => handleViewQR(certificate)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <QrCodeIcon className="h-4 w-4 mr-2" />
                    QR Code
                  </button>
                  
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedCertificates.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No retirement certificates have been generated yet.'
            }
          </p>
        </div>
      )}

      {/* Certificate Details Modal */}
      {showDetailsModal && selectedCertificate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">Certificate Details: {selectedCertificate.certificateNumber}</h3>
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
                  <h4 className="font-medium text-gray-900 mb-4">Certificate Information</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Certificate Number</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.certificateNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Batch ID</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.batchId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Producer</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.producer}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Amount Retired</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.amount} kg</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Carbon Intensity</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.carbonIntensity} kg CO2e/kg H2</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Production Method</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.method}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Retirement Reason</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.retirementReason}</dd>
                    </div>
                  </dl>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Verification Details</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Status</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verification Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">
                        {selectedCertificate.verificationHash || 'Pending verification'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">IPFS Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedCertificate.ipfsHash}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verifier</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.metadata.verifier}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Verification Date</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedCertificate.metadata.verificationDate ? formatDate(selectedCertificate.metadata.verificationDate) : 'Pending'}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                {/* Right Column - Documents & Metadata */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Documents</h4>
                  <div className="space-y-2">
                    {selectedCertificate.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <ArrowUpTrayIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Production Metadata</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Location</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.metadata.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Facility</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.metadata.facility}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Technology</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.metadata.technology}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Certification</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.metadata.certification}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Compliance</dt>
                      <dd className="text-sm text-gray-900">{selectedCertificate.metadata.compliance}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedCertificate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code for Verification</h3>
              <div className="mb-4">
                <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <QrCodeIcon className="h-24 w-24 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">QR Code representation</p>
              </div>
              
              <div className="text-left mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Certificate Data:</p>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono break-all">
                  {generateQRCode(selectedCertificate)}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
