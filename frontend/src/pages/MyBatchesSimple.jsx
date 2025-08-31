import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function MyBatchesSimple() {
  const { currentRole } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetchMyBatches();
  }, []);

  const fetchMyBatches = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/batches');
      const data = await response.json();
      
      if (data.success) {
        const formattedBatches = data.batches.map(batch => ({
          id: batch.batch_id,
          producer: batch.producer_address,
          amount: batch.amount_kg,
          status: batch.status,
          date: new Date(batch.created_at).toLocaleDateString(),
          metadata: batch.metadata || {}
        }));
        setBatches(formattedBatches);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      // Fallback to mock data
      setBatches([
        {
          id: 'BATCH-DEMO-001',
          producer: '0x123...def',
          amount: 1000,
          status: 'pending',
          date: new Date().toLocaleDateString(),
          metadata: { location: 'Demo Location' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Batches</h1>
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Batches</h1>
        <p className="text-gray-600 mt-1">Track all your submitted hydrogen credit batches</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total batches: {batches.length}</span>
          <button
            onClick={fetchMyBatches}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      {batches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
          <p className="text-gray-500">Create your first batch to get started.</p>
          <button
            onClick={() => window.location.href = '/issue-batch'}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Issue New Batch
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{batch.id}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        batch.status === 'approved' ? 'bg-green-100 text-green-800' :
                        batch.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">Producer: {batch.producer}</p>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Amount:</span> {batch.amount.toLocaleString()} kg H2
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {batch.metadata.location || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {batch.date}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                  {batch.status === 'approved' && (
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
