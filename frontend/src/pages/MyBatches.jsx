import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';
import * as batchService from '../services/batchService';
import { normalizeBatch, safeArray } from '../utils/safeRender';

export default function MyBatches() {
  const { currentRole } = useOutletContext();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Mock data for user's batches
  const mockBatches = [
    {
      id: 'BATCH-001',
      batchId: 'GH-2024-001',
      amount: 1500.5,
      carbonIntensity: 2.1,
      method: 'Steam Methane Reforming (SMR)',
      description: 'Large-scale hydrogen production batch with carbon capture',
      submissionDate: '2024-01-15T10:30:00Z',
      approvalDate: '2024-01-18T14:20:00Z',
      status: 'approved',
      priority: 'high',
      documents: [
        { name: 'Production Report.pdf', size: '2.4 MB', type: 'pdf', url: '#' },
        { name: 'Carbon Intensity Analysis.json', size: '156 KB', type: 'json', url: '#' },
        { name: 'Quality Assurance Report.txt', size: '89 KB', type: 'txt', url: '#' }
      ],
      metadata: {
        location: 'Texas, USA',
        facility: 'GH-Plant-01',
        technology: 'Advanced SMR with CCS',
        certification: 'ISO 14001',
        compliance: 'EPA Standards',
        ipfsHash: 'QmX1234567890abcdef1234567890abcdef12345678'
      },
      timeline: [
        { event: 'Batch Created', timestamp: '2024-01-15T10:30:00Z', status: 'completed', icon: 'DocumentTextIcon' },
        { event: 'Submitted for Review', timestamp: '2024-01-15T10:35:00Z', status: 'completed', icon: 'ClockIcon' },
        { event: 'Under Review', timestamp: '2024-01-16T09:00:00Z', status: 'completed', icon: 'EyeIcon' },
        { event: 'Approved', timestamp: '2024-01-18T14:20:00Z', status: 'completed', icon: 'CheckCircleIcon' },
        { event: 'Credits Issued', timestamp: '2024-01-18T15:00:00Z', status: 'completed', icon: 'CheckCircleIcon' }
      ]
    },
    {
      id: 'BATCH-002',
      batchId: 'GH-2024-002',
      amount: 875.25,
      carbonIntensity: 1.8,
      method: 'Electrolysis',
      description: 'Renewable energy powered hydrogen production',
      submissionDate: '2024-01-20T14:20:00Z',
      approvalDate: null,
      status: 'pending',
      priority: 'medium',
      documents: [
        { name: 'Renewable Energy Certificate.pdf', size: '1.2 MB', type: 'pdf', url: '#' },
        { name: 'Electrolysis Efficiency Data.json', size: '234 KB', type: 'json', url: '#' }
      ],
      metadata: {
        location: 'California, USA',
        facility: 'GH-Solar-02',
        technology: 'PEM Electrolysis',
        certification: 'Green Energy Certified',
        compliance: 'CARB Standards',
        ipfsHash: 'QmY9876543210fedcba9876543210fedcba98765432'
      },
      timeline: [
        { event: 'Batch Created', timestamp: '2024-01-20T14:20:00Z', status: 'completed', icon: 'DocumentTextIcon' },
        { event: 'Submitted for Review', timestamp: '2024-01-20T14:25:00Z', status: 'completed', icon: 'ClockIcon' },
        { event: 'Under Review', timestamp: '2024-01-21T09:00:00Z', status: 'in-progress', icon: 'EyeIcon' },
        { event: 'Approval Decision', timestamp: null, status: 'pending', icon: 'CheckCircleIcon' },
        { event: 'Credits Issued', timestamp: null, status: 'pending', icon: 'CheckCircleIcon' }
      ]
    },
    {
      id: 'BATCH-003',
      batchId: 'GH-2024-003',
      amount: 2200.0,
      carbonIntensity: 3.2,
      method: 'Biomass Gasification',
      description: 'Sustainable biomass-based hydrogen production',
      submissionDate: '2024-01-25T09:15:00Z',
      approvalDate: null,
      status: 'rejected',
      priority: 'low',
      documents: [
        { name: 'Biomass Source Verification.pdf', size: '3.1 MB', type: 'pdf', url: '#' },
        { name: 'Gasification Process Data.json', size: '445 KB', type: 'json', url: '#' },
        { name: 'Sustainability Assessment.txt', size: '178 KB', type: 'txt', url: '#' }
      ],
      metadata: {
        location: 'Oregon, USA',
        facility: 'GH-Bio-03',
        technology: 'Advanced Biomass Gasification',
        certification: 'FSC Certified',
        compliance: 'State Standards',
        ipfsHash: 'QmZ555666777888999aaaabbbcccdddeeefff000111'
      },
      timeline: [
        { event: 'Batch Created', timestamp: '2024-01-25T09:15:00Z', status: 'completed', icon: 'DocumentTextIcon' },
        { event: 'Submitted for Review', timestamp: '2024-01-25T09:20:00Z', status: 'completed', icon: 'ClockIcon' },
        { event: 'Under Review', timestamp: '2024-01-26T09:00:00Z', status: 'completed', icon: 'EyeIcon' },
        { event: 'Rejected', timestamp: '2024-01-28T11:30:00Z', status: 'completed', icon: 'XCircleIcon' },
        { event: 'Credits Issued', timestamp: null, status: 'cancelled', icon: 'XCircleIcon' }
      ],
      rejectionReason: 'Insufficient documentation for biomass source verification. Please provide additional sustainability metrics and third-party verification.'
    }
  ];

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      // Fetch batches from backend
      const response = await fetch('http://localhost:3001/api/batches');
      const data = await response.json();
      
      if (data.success && data.batches) {
        const formattedBatches = data.batches.map(batch => ({
          id: batch.id,
          batchId: batch.batch_id,
          amount: batch.amount_kg,
          carbonIntensity: 2.1,
          method: batch.metadata?.method || 'Electrolysis',
          description: batch.metadata?.description || 'Hydrogen production batch',
          submissionDate: batch.created_at,
          approvalDate: batch.status === 'approved' ? batch.updated_at : null,
          status: batch.status,
          priority: 'medium',
          documents: [],
          metadata: {
            location: batch.metadata?.location || 'Unknown',
            facility: batch.metadata?.facility || 'Production Facility',
            technology: batch.metadata?.technology || 'Advanced Electrolysis',
            certification: 'ISO 14001',
            compliance: 'Standards Compliant',
            ipfsHash: batch.metadata_cid || 'QmX1234567890abcdef'
          },
          timeline: [
            { event: 'Batch Created', timestamp: batch.created_at, status: 'completed', icon: 'DocumentTextIcon' },
            { event: 'Submitted for Review', timestamp: batch.created_at, status: 'completed', icon: 'ClockIcon' },
            { event: 'Under Review', timestamp: batch.status === 'pending' ? batch.updated_at : null, status: batch.status === 'pending' ? 'in-progress' : 'completed', icon: 'EyeIcon' },
            { event: 'Approval Decision', timestamp: batch.status === 'approved' ? batch.updated_at : null, status: batch.status === 'approved' ? 'completed' : 'pending', icon: 'CheckCircleIcon' }
          ]
        }));
        setBatches(formattedBatches);
      } else {
        // Fallback to mock data
        setBatches(mockBatches);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
      // Fallback to mock data if backend is not available
      setBatches(mockBatches);
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedBatches = [...filteredBatches].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.submissionDate) - new Date(a.submissionDate);
      case 'amount':
        return b.amount - a.amount;
      case 'status':
        return a.status.localeCompare(b.status);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
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
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'draft':
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleViewDetails = (batch) => {
    setSelectedBatch(batch);
    setShowDetailsModal(true);
  };

  const formatDateSafe = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const getTimelineStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-300';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
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
            <h1 className="text-3xl font-bold text-gray-900">My Batches</h1>
            <p className="mt-2 text-gray-600">
              Track all your submitted carbon credit batches and their approval status
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => window.location.href = '/issue-batch'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              New Batch
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-semibold text-gray-900">{batches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {batches.filter(b => b.status === 'approved').length}
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
                {batches.filter(b => b.status === 'pending').length}
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
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {batches.filter(b => b.status === 'rejected').length}
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
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="date">Submission Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batches List */}
      <div className="space-y-6">
        {sortedBatches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{batch.batchId}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(batch.priority)}`}>
                      {batch.priority}
                    </span>
                  </div>
                  <p className="text-gray-600">{batch.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(batch.status)}
                </div>
              </div>

              {/* Batch Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Amount:</span>
                  <p className="text-lg font-semibold text-gray-900">{batch.amount} kg</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Carbon Intensity:</span>
                  <p className="text-lg font-semibold text-gray-900">{batch.carbonIntensity} kg CO2e/kg H2</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Method:</span>
                  <p className="text-lg font-semibold text-gray-900">{batch.method.split(' ')[0]}</p>
                </div>
              </div>

              {/* Timeline Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Progress Timeline</h4>
                <div className="flex items-center space-x-2">
                  {batch.timeline.slice(0, 5).map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getTimelineStatusColor(step.status)}`}></div>
                      {index < batch.timeline.length - 1 && (
                        <div className={`w-8 h-0.5 ${step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Submitted</span>
                  <span>Issued</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Submitted: {formatDateSafe(batch.submissionDate)}</span>
                  {batch.approvalDate && (
                    <span>Approved: {formatDateSafe(batch.approvalDate)}</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(batch)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  {batch.status === 'approved' && (
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download Certificate
                    </button>
                  )}
                  
                  {batch.status === 'rejected' && (
                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Resubmit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedBatches.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No batches found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first batch.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/issue-batch'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Create First Batch
              </button>
            </div>
          )}
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
                      <dt className="text-sm font-medium text-gray-600">Amount</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.amount} kg</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Carbon Intensity</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.carbonIntensity} kg CO2e/kg H2</dd>
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
                  
                  <h4 className="font-medium text-gray-900 mb-4 mt-6">Metadata</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Location</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.metadata.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Facility</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.metadata.facility}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Technology</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.metadata.technology}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Certification</dt>
                      <dd className="text-sm text-gray-900">{selectedBatch.metadata.certification}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">IPFS Hash</dt>
                      <dd className="text-sm text-gray-900 font-mono break-all">{selectedBatch.metadata.ipfsHash}</dd>
                    </div>
                  </dl>
                </div>
                
                {/* Right Column - Timeline & Documents */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Timeline</h4>
                  <div className="space-y-4">
                    {selectedBatch.timeline.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${getTimelineStatusColor(step.status)}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{step.event}</p>
                          <p className="text-sm text-gray-600">
                            {step.timestamp ? formatDateSafe(step.timestamp) : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
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
                  
                  {selectedBatch.status === 'rejected' && selectedBatch.rejectionReason && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                      <p className="text-sm text-red-700">{selectedBatch.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
