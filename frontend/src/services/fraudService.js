import { CONTRACT_CONFIG } from '../config/contract';

class FraudService {
  constructor() {
    this.baseUrl = CONTRACT_CONFIG.apiUrl;
  }

  // Issue credits with fraud detection
  async issueCredits(batchId, recipient, amount) {
    try {
      const response = await fetch(`${this.baseUrl}${CONTRACT_CONFIG.fraudEndpoints.issueCredits}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchId, recipient, amount })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Credit issuance failed');
      }

      return data;
    } catch (error) {
      console.error('Issue credits failed:', error);
      throw error;
    }
  }

  // Retire credits with fraud detection
  async retireCredits(batchId, amount, reason) {
    try {
      const response = await fetch(`${this.baseUrl}${CONTRACT_CONFIG.fraudEndpoints.retireCredits}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchId, amount, reason })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Credit retirement failed');
      }

      return data;
    } catch (error) {
      console.error('Retire credits failed:', error);
      throw error;
    }
  }

  // Demo fraud scenarios
  async demoFraud(fraudType, batchId, recipient, amount, reason) {
    try {
      const response = await fetch(`${this.baseUrl}${CONTRACT_CONFIG.fraudEndpoints.demoFraud}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fraudType, batchId, recipient, amount, reason })
      });

      const data = await response.json();
      return data; // Return both success and fraud detection results
    } catch (error) {
      console.error('Demo fraud failed:', error);
      throw error;
    }
  }

  // Get fraud events
  async getFraudEvents() {
    try {
      const response = await fetch(`${this.baseUrl}${CONTRACT_CONFIG.fraudEndpoints.fraudEvents}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch fraud events');
      }

      return data.data;
    } catch (error) {
      console.error('Get fraud events failed:', error);
      throw error;
    }
  }

  // Check if error is fraud-related
  isFraudError(error) {
    return error.message.includes('Duplicate') || 
           error.message.includes('Double') ||
           error.message.includes('fraud');
  }

  // Get fraud type from error
  getFraudType(error) {
    if (error.message.includes('Duplicate credit issue')) {
      return 'DUPLICATE_ISSUE';
    }
    if (error.message.includes('Double retirement')) {
      return 'DOUBLE_RETIREMENT';
    }
    return 'UNKNOWN';
  }
}

export default new FraudService();
