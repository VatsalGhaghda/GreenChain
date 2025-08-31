// Utility functions to safely render data and prevent white screens

export const safeGet = (obj, path, defaultValue = '') => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeArray = (arr, defaultValue = []) => {
  return Array.isArray(arr) ? arr : defaultValue;
};

export const safeString = (str, defaultValue = '') => {
  return typeof str === 'string' ? str : String(str || defaultValue);
};

export const safeNumber = (num, defaultValue = 0) => {
  const parsed = parseFloat(num);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const formatDate = (dateString, defaultValue = 'N/A') => {
  try {
    if (!dateString) return defaultValue;
    return new Date(dateString).toLocaleDateString();
  } catch {
    return defaultValue;
  }
};

export const formatDateTime = (dateString, defaultValue = 'N/A') => {
  try {
    if (!dateString) return defaultValue;
    return new Date(dateString).toLocaleString();
  } catch {
    return defaultValue;
  }
};

// Batch data normalization
export const normalizeBatch = (batch) => {
  if (!batch) return null;
  
  return {
    id: batch.id || batch.batch_id || `batch-${Date.now()}`,
    batchId: batch.batch_id || batch.batchId || batch.id || 'Unknown',
    producer: batch.producer || batch.producer_address || 'Unknown Producer',
    producerAddress: batch.producer_address || batch.producerAddress || '',
    amount: safeNumber(batch.amount_kg || batch.amount),
    carbonIntensity: safeNumber(safeGet(batch, 'metadata.carbonIntensity') || batch.carbonIntensity),
    method: safeGet(batch, 'metadata.method') || batch.method || 'Unknown Method',
    description: safeGet(batch, 'metadata.description') || batch.description || 'No description available',
    status: batch.status || 'pending',
    priority: batch.priority || 'medium',
    submissionDate: batch.created_at || batch.submissionDate || new Date().toISOString(),
    approvalDate: batch.approval_date || batch.approvalDate || null,
    timeline: safeArray(batch.timeline, [
      { event: 'Submitted', status: 'completed', timestamp: batch.created_at || batch.submissionDate },
      { event: 'Under Review', status: batch.status === 'pending' ? 'in_progress' : 'completed' },
      { event: 'Approved', status: batch.status === 'approved' ? 'completed' : 'pending' }
    ]),
    documents: safeArray(batch.documents, []),
    metadata: {
      location: safeGet(batch, 'metadata.location', 'Unknown Location'),
      facility: safeGet(batch, 'metadata.facility', 'Unknown Facility'),
      technology: safeGet(batch, 'metadata.technology', 'Unknown Technology'),
      certification: safeGet(batch, 'metadata.certification', 'Unknown Certification'),
      ipfsHash: safeGet(batch, 'metadata.ipfsHash') || batch.metadata_cid || 'N/A',
      ...batch.metadata
    }
  };
};

// Safe component wrapper
export const withErrorBoundary = (Component, fallback = null) => {
  return function SafeComponent(props) {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error('Component render error:', error);
      return fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error loading component</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Reload
          </button>
        </div>
      );
    }
  };
};
