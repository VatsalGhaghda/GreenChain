const axios = require('axios');
const FormData = require('form-data');

class PinataClient {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_KEY;
    this.baseURL = 'https://api.pinata.cloud';
  }

  // Upload JSON data to IPFS via Pinata
  async uploadJSON(data, name = 'data.json') {
    try {
      console.log('Uploading to IPFS via Pinata:', name);
      
      const response = await axios.post(`${this.baseURL}/pinning/pinJSONToIPFS`, {
        pinataMetadata: {
          name: name,
          keyvalues: {
            timestamp: new Date().toISOString(),
            type: 'json'
          }
        },
        pinataContent: data
      }, {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey
        }
      });

      const cid = response.data.IpfsHash;
      console.log('✅ Pinata upload successful, CID:', cid);
      
      return cid;
    } catch (error) {
      console.error('❌ Pinata upload failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Upload file to IPFS via Pinata
  async uploadFile(fileBuffer, filename, mimeType = 'application/octet-stream') {
    try {
      console.log('Uploading file to IPFS via Pinata:', filename);
      
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: filename,
        contentType: mimeType
      });

      const response = await axios.post(`${this.baseURL}/pinning/pinFileToIPFS`, formData, {
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
          ...formData.getHeaders()
        }
      });

      const cid = response.data.IpfsHash;
      console.log('✅ File upload successful, CID:', cid);
      
      return cid;
    } catch (error) {
      console.error('❌ File upload failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get IPFS gateway URL
  getGatewayURL(cid) {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }

  // Validate CID format
  isValidCID(cid) {
    return cid && cid.length > 0;
  }
}

module.exports = new PinataClient();