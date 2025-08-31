import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function PendingApprovalsSimple() {
  const { currentRole } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchPendingBatches();
  }, []);

  const fetchPendingBatches = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/batches/pending');
      const data = await response.json();
      
      if (data.success) {
        const formattedBatches = data.batches.map(batch => ({
          id: batch.batch_id,
          producer: batch.producer_address,
          amount: batch.amount_kg,
          status: batch.status,
          priority: 'medium',
          location: batch.metadata?.location || 'Unknown',
          date: new Date(batch.created_at).toLocaleDateString()
        }));
        setBatches(formattedBatches);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      // Fallback to mock data
      setBatches([
        {
          id: 'BATCH-001',
          producer: 'Green Hydrogen Corp',
          amount: 1500,
          status: 'pending',
          priority: 'high',
          location: 'Mumbai, India',
          date: '2025-08-30'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (batchId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/batches/approve/${batchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setBatches(prev => prev.map(batch => 
          batch.id === batchId ? { ...batch, status: 'approved' } : batch
        ));
      }
    } catch (error) {
      console.error('Error approving batch:', error);
    }
  };

  const handleReject = async (batchId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/batches/reject/${batchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setBatches(prev => prev.map(batch => 
          batch.id === batchId ? { ...batch, status: 'rejected' } : batch
        ));
      }
    } catch (error) {
      console.error('Error rejecting batch:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Approvals</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const pendingBatches = batches.filter(batch => batch.status === 'pending');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve hydrogen credit batches</p>
        <div className="mt-2 flex items-center space-x-4">
          <span className="text-sm text-gray-500">Role: {currentRole || 'Producer'}</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{pendingBatches.length} pending batches</span>
        </div>
      </div>
      
      {pendingBatches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-500">No pending batches require approval at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBatches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{batch.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        batch.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        batch.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {batch.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{batch.producer}</p>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Amount:</span> {batch.amount.toLocaleString()} kg H2
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {batch.location}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {batch.date}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={fetchPendingBatches}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    🔄 Refresh
                  </button>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReject(batch.id)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(batch.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {batches.some(batch => batch.status !== 'pending') && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Actions</h2>
          <div className="space-y-2">
            {batches.filter(batch => batch.status !== 'pending').map((batch) => (
              <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">{batch.id} - {batch.producer}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  batch.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {batch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
