import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserIcon,
  ScaleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

const formatDateSafe = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

export default function PendingApprovals() {
  const { currentRole } = useOutletContext();
  const [pendingBatches, setPendingBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for pending batches
  const mockPendingBatches = [
    {
      id: 'BATCH-001',
      producer: 'Green Hydrogen Corp',
      producerAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: 1500.5,
      carbonIntensity: 2.1,
      method: 'Steam Methane Reforming (SMR)',
      description: 'Large-scale hydrogen production batch with carbon capture',
      submissionDate: '2024-01-15T10:30:00Z',
      status: 'pending',
      priority: 'high',
      documents: [
        { name: 'Production Report.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Carbon Intensity Analysis.json', size: '156 KB', type: 'json' },
        { name: 'Quality Assurance Report.txt', size: '89 KB', type: 'txt' }
      ],
      metadata: {
        location: 'Texas, USA',
        facility: 'GH-Plant-01',
        technology: 'Advanced SMR with CCS',
        certification: 'ISO 14001',
        compliance: 'EPA Standards'
      }
    },
    {
      id: 'BATCH-002',
      producer: 'Blue Energy Solutions',
      producerAddress: '0x8ba1f109551bA432b0F6c4c8B0F8B8B8B8B8B8B8',
      amount: 875.25,
      carbonIntensity: 1.8,
      method: 'Electrolysis',
      description: 'Renewable energy powered hydrogen production',
      submissionDate: '2024-01-14T14:20:00Z',
      status: 'pending',
      priority: 'medium',
      documents: [
        { name: 'Renewable Energy Certificate.pdf', size: '1.2 MB', type: 'pdf' },
        { name: 'Electrolysis Efficiency Data.json', size: '234 KB', type: 'json' }
      ],
      metadata: {
        location: 'California, USA',
        facility: 'BE-Solar-02',
        technology: 'PEM Electrolysis',
        certification: 'Green Energy Certified',
        compliance: 'CARB Standards'
      }
    },
    {
      id: 'BATCH-003',
      producer: 'EcoFuel Industries',
      producerAddress: '0x9ca1f109551bA432b0F6c4c8B0F8B8B8B8B8B8B8',
      amount: 2200.0,
      carbonIntensity: 3.2,
      method: 'Biomass Gasification',
      description: 'Sustainable biomass-based hydrogen production',
      submissionDate: '2024-01-13T09:15:00Z',
      status: 'pending',
      priority: 'low',
      documents: [
        { name: 'Biomass Source Verification.pdf', size: '3.1 MB', type: 'pdf' },
        { name: 'Gasification Process Data.json', size: '445 KB', type: 'json' },
        { name: 'Sustainability Assessment.txt', size: '178 KB', type: 'txt' }
      ],
      metadata: {
        location: 'Oregon, USA',
        facility: 'EF-Bio-03',
        technology: 'Advanced Biomass Gasification',
        certification: 'FSC Certified',
        compliance: 'Oregon DEQ Standards'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchPendingBatches = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPendingBatches(mockPendingBatches || []);
      } catch (error) {
        console.error('Error fetching pending batches:', error);
        setPendingBatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBatches();
  }, []);

  // Check if user has access to approvals
  const hasAccess = currentRole === 'certifier' || currentRole === 'regulator';

  // Filter batches based on search and filter
  const filteredBatches = pendingBatches.filter(batch => {
    try {
      const batchId = batch.id || batch.batch_id || '';
      const producer = batch.producer || batch.producer_address || '';
      const method = batch.method || batch.metadata?.method || '';
      
      const matchesSearch = batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           method.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || batch.priority === filterStatus;
      return matchesSearch && matchesFilter;
    } catch (error) {
      console.error('Error filtering batch:', error);
      return false;
    }
  });

  const handleApprove = async () => {
    if (!selectedBatch || !approvalReason.trim()) return;
    
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setPendingBatches(prev => prev.filter(batch => batch.id !== selectedBatch.id));
      
      // Close modals
      setShowApprovalModal(false);
      setShowDetailsModal(false);
      setSelectedBatch(null);
      setApprovalReason('');
      
      // Show success message
      alert(`Batch ${selectedBatch.id} has been approved successfully!`);
    } catch (error) {
      alert('Error approving batch: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBatch || !rejectionReason.trim()) return;
    
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setPendingBatches(prev => prev.filter(batch => batch.id !== selectedBatch.id));
      
      // Close modals
      setShowRejectionModal(false);
      setShowDetailsModal(false);
      setSelectedBatch(null);
      setRejectionReason('');
      
      // Show success message
      alert(`Batch ${selectedBatch.id} has been rejected.`);
    } catch (error) {
      alert('Error rejecting batch: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'medium': return <ClockIcon className="w-4 h-4" />;
      case 'low': return <CheckCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the Pending Approvals page. 
              Only certifiers and regulators can review and approve batches.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Current Role: <span className="font-semibold text-gray-700">{currentRole || 'Unknown'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <ScaleIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Pending Approvals</h1>
                <p className="text-orange-100 text-lg mt-2">
                  Review and approve pending GreenChain H2 Credit batches
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-orange-100">
              <ClockIcon className="w-5 h-5" />
              <span className="text-sm">
                {pendingBatches.length} batch{pendingBatches.length !== 1 ? 'es' : ''} awaiting review
              </span>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search batches by ID, producer, or method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pending Batches Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Pending Batches</h2>
                  <p className="text-gray-600 text-sm">
                    {filteredBatches.length} of {pendingBatches.length} batches
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading pending batches...</p>
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Batches</h3>
              <p className="text-gray-600">All batches have been reviewed and processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount & Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBatches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{batch.id}</div>
                            <div className="text-sm text-gray-500">{batch.description}</div>
                            <div className="text-xs text-gray-400">
                              {(batch.documents || []).length} document{(batch.documents || []).length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <UserIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{batch.producer}</div>
                            <div className="text-xs text-gray-500 font-mono">
                              {batch.producerAddress ? `${batch.producerAddress.slice(0, 6)}...${batch.producerAddress.slice(-4)}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {(batch.amount || 0).toLocaleString()} kg
                          </div>
                          <div className="text-sm text-gray-500">{batch.method || 'N/A'}</div>
                          <div className="text-xs text-gray-400">
                            {batch.carbonIntensity || 'N/A'} kg CO2/kg H2
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(batch.priority)}`}>
                          {getPriorityIcon(batch.priority)}
                          <span className="ml-1 capitalize">{batch.priority}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(batch.submissionDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(batch.submissionDate).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBatch(batch);
                              setShowDetailsModal(true);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBatch(batch);
                              setShowApprovalModal(true);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBatch(batch);
                              setShowRejectionModal(true);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircleIcon className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Batch Details Modal */}
      <Dialog
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-900">
                      Batch Details - {selectedBatch?.id}
                    </Dialog.Title>
                    <p className="text-gray-600 text-sm">Complete information about this batch</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {selectedBatch && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Batch ID:</span>
                        <span className="text-sm text-gray-900">{selectedBatch.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Amount:</span>
                        <span className="text-sm text-gray-900">{selectedBatch.amount.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Carbon Intensity:</span>
                        <span className="text-sm text-gray-900">{selectedBatch.carbonIntensity} kg CO2/kg H2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Method:</span>
                        <span className="text-sm text-gray-900">{selectedBatch.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Priority:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedBatch.priority)}`}>
                          {getPriorityIcon(selectedBatch.priority)}
                          <span className="ml-1 capitalize">{selectedBatch.priority}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Producer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Producer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Company:</span>
                        <span className="text-sm text-gray-900">{selectedBatch.producer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Address:</span>
                        <span className="text-sm text-gray-900 font-mono">{selectedBatch.producerAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Submitted:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(selectedBatch.submissionDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedBatch.documents.map((doc, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size} • {doc.type.toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Additional Metadata
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(selectedBatch.metadata).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{key}</p>
                          <p className="text-sm text-gray-900 mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {selectedBatch.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowApprovalModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircleIcon className="w-4 h-4 inline mr-2" />
                    Approve Batch
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowRejectionModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircleIcon className="w-4 h-4 inline mr-2" />
                    Reject Batch
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Approval Modal */}
      <Dialog
        open={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Approve Batch
                  </Dialog.Title>
                  <p className="text-gray-600 text-sm">
                    Confirm approval for batch {selectedBatch?.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Reason (Optional)
                </label>
                <textarea
                  value={approvalReason}
                  onChange={(e) => setApprovalReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes about this approval..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  disabled={processing}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog
        open={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-2 rounded-lg">
                  <XCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Reject Batch
                  </Dialog.Title>
                  <p className="text-gray-600 text-sm">
                    Confirm rejection for batch {selectedBatch?.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  disabled={processing}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
