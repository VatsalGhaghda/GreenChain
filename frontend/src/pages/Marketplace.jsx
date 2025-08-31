import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  PlusIcon, 
  EyeIcon, 
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

const safeGet = (obj, path, defaultValue = '') => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

const formatDateSafe = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

export default function Marketplace() {
  const { currentRole } = useOutletContext();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price');

  // Mock data for available credits
  const mockCredits = [
    {
      id: 'CREDIT-001',
      batchId: 'BATCH-001',
      seller: 'Green Hydrogen Corp',
      sellerAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: 500,
      availableAmount: 500,
      price: 25.50,
      currency: 'USD',
      carbonIntensity: 2.1,
      method: 'Steam Methane Reforming (SMR)',
      location: 'Texas, USA',
      certification: 'ISO 14001',
      listingDate: '2024-01-15T10:30:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      status: 'active',
      metadata: {
        facility: 'GH-Plant-01',
        technology: 'Advanced SMR with CCS',
        compliance: 'EPA Standards',
        verification: 'Third-party verified'
      }
    },
    {
      id: 'CREDIT-002',
      batchId: 'BATCH-002',
      seller: 'Blue Energy Solutions',
      sellerAddress: '0x8ba1f109551bA432b0F6c4c8B0F8B8B8B8B8B8B8',
      amount: 300,
      availableAmount: 300,
      price: 32.75,
      currency: 'USD',
      carbonIntensity: 1.8,
      method: 'Electrolysis',
      location: 'California, USA',
      certification: 'Green Energy Certified',
      listingDate: '2024-01-14T14:20:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      status: 'active',
      metadata: {
        facility: 'BE-Solar-02',
        technology: 'PEM Electrolysis',
        compliance: 'CARB Standards',
        verification: 'Third-party verified'
      }
    },
    {
      id: 'CREDIT-003',
      batchId: 'BATCH-003',
      seller: 'EcoFuel Industries',
      sellerAddress: '0x9ca1f109551bA432b0F6c4c8B0F8B8B8B8B8B8B8',
      amount: 750,
      availableAmount: 750,
      price: 28.90,
      currency: 'USD',
      carbonIntensity: 3.2,
      method: 'Biomass Gasification',
      location: 'Oregon, USA',
      certification: 'FSC Certified',
      listingDate: '2024-01-13T09:15:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      status: 'active',
      metadata: {
        facility: 'EF-Bio-03',
        technology: 'Advanced Biomass Gasification',
        compliance: 'State Standards',
        verification: 'Third-party verified'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCredits(mockCredits);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCredits = credits.filter(credit => {
    const batchId = safeGet(credit, 'batchId', '');
    const seller = safeGet(credit, 'seller', '');
    const location = safeGet(credit, 'location', '');
    
    const matchesSearch = batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || credit.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedCredits = [...filteredCredits].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'amount':
        return b.amount - a.amount;
      case 'date':
        return new Date(b.listingDate) - new Date(a.listingDate);
      case 'carbonIntensity':
        return a.carbonIntensity - b.carbonIntensity;
      default:
        return 0;
    }
  });

  const handleBuyCredit = (credit) => {
    setSelectedCredit(credit);
    setShowBuyModal(true);
  };

  const handleViewDetails = (credit) => {
    setSelectedCredit(credit);
    setShowDetailsModal(true);
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
            <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Marketplace</h1>
            <p className="mt-2 text-gray-600">
              Buy, sell, and trade verified carbon credits from green hydrogen production
            </p>
          </div>
          {currentRole === 'producer' && (
            <button
              onClick={() => setShowCreateListing(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Listing
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search credits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EyeIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="price">Price</option>
              <option value="amount">Amount</option>
              <option value="date">Date</option>
              <option value="carbonIntensity">Carbon Intensity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Credits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCredits.map((credit) => (
          <div key={credit.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{credit.batchId}</h3>
                  <p className="text-sm text-gray-600">{credit.seller}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {credit.status}
                </span>
              </div>

              {/* Credit Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount Available:</span>
                  <span className="text-sm font-medium text-gray-900">{credit.availableAmount} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-lg font-bold text-green-600">{formatPrice(credit.price)}/kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Carbon Intensity:</span>
                  <span className="text-sm font-medium text-gray-900">{credit.carbonIntensity} kg CO2e/kg H2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Method:</span>
                  <span className="text-sm font-medium text-gray-900">{credit.method.split(' ')[0]}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(credit)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Details
                </button>
                {currentRole === 'consumer' && (
                  <button
                    onClick={() => handleBuyCredit(credit)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Buy
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedCredits.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No credits found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Listing</h3>
              <p className="text-sm text-gray-600 mb-4">
                This feature will be implemented to allow producers to list their carbon credits for sale.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateListing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Details Modal */}
      {showDetailsModal && selectedCredit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Credit Details</h3>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Batch ID</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.batchId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Seller</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.seller}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Total Amount</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.amount} kg</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Available Amount</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.availableAmount} kg</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Technical Details</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Production Method</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.method}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Carbon Intensity</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.carbonIntensity} kg CO2e/kg H2</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Location</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Certification</dt>
                      <dd className="text-sm text-gray-900">{selectedCredit.certification}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Metadata</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Facility</dt>
                    <dd className="text-sm text-gray-900">{selectedCredit.metadata.facility}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Technology</dt>
                    <dd className="text-sm text-gray-900">{selectedCredit.metadata.technology}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Compliance</dt>
                    <dd className="text-sm text-gray-900">{selectedCredit.metadata.compliance}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Verification</dt>
                    <dd className="text-sm text-gray-900">{selectedCredit.metadata.verification}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Credit Modal */}
      {showBuyModal && selectedCredit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Buy Carbon Credits</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Batch: {selectedCredit.batchId}</p>
                <p className="text-sm text-gray-600 mb-2">Seller: {selectedCredit.seller}</p>
                <p className="text-sm text-gray-600 mb-2">Price: {formatPrice(selectedCredit.price)}/kg</p>
                <p className="text-sm text-gray-600 mb-4">Available: {selectedCredit.availableAmount} kg</p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Buy (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedCredit.availableAmount}
                    defaultValue="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement actual purchase logic
                    setShowBuyModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
