import { CONTRACT_CONFIG } from '../config/contract';

class BatchService {
  constructor() {
    this.baseURL = CONTRACT_CONFIG.apiUrl;
  }

  async submitBatch(batchData) {
    try {
      const response = await fetch(`${this.baseURL}/batches/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit batch');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting batch:', error);
      throw error;
    }
  }

  async getPendingBatches() {
    try {
      const response = await fetch(`${this.baseURL}/batches/pending`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending batches');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pending batches:', error);
      throw error;
    }
  }

  async getAllBatches() {
    try {
      const response = await fetch(`${this.baseURL}/batches`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch batches');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }

  async getBatch(batchId) {
    try {
      const response = await fetch(`${this.baseURL}/batches/${batchId}`);
      
      if (!response.ok) {
        throw new Error('Batch not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching batch:', error);
      throw error;
    }
  }

  async approveBatch(batchId) {
    try {
      const response = await fetch(`${this.baseURL}/batches/approve/${batchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve batch');
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving batch:', error);
      throw error;
    }
  }

  // Upload file to IPFS via backend
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseURL}/ipfs/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file to IPFS');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

export default new BatchService();
