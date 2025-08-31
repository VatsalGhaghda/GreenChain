// Test script to verify complete data flow
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3001/api';

async function testDataFlow() {
    console.log('🧪 Testing Complete Data Flow\n');
    
    try {
        // 1. Test backend health
        console.log('1. Testing backend connection...');
        const healthResponse = await axios.get(`${BACKEND_URL}/test`);
        console.log('✅ Backend is running\n');
        
        // 2. Test batch submission
        console.log('2. Testing batch submission...');
        const testBatch = {
            batchId: 'TEST-BATCH-001',
            amountKg: 1000,
            metadata: {
                batchId: 'TEST-BATCH-001',
                amount: 1000,
                carbonIntensity: 2.5,
                method: 'Electrolysis',
                description: 'Test batch for integration',
                fileName: 'test-report.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                uploadTimestamp: new Date().toISOString(),
                ipfsHash: 'QmTestHash123456789',
                producer: 'Test User'
            },
            producer: '0x123456789abcdef'
        };
        
        const submitResponse = await axios.post(`${BACKEND_URL}/batches/submit`, testBatch);
        console.log('✅ Batch submitted successfully');
        console.log('   Batch ID:', submitResponse.data.batch.batch_id);
        console.log('   Status:', submitResponse.data.batch.status);
        console.log('   IPFS CID:', submitResponse.data.ipfsCID);
        
        // 3. Test pending batches retrieval
        console.log('\n3. Testing pending batches retrieval...');
        const pendingResponse = await axios.get(`${BACKEND_URL}/batches/pending`);
        console.log('✅ Pending batches retrieved');
        console.log('   Count:', pendingResponse.data.count);
        console.log('   Batches:', pendingResponse.data.batches.map(b => b.batch_id));
        
        // 4. Test all batches retrieval
        console.log('\n4. Testing all batches retrieval...');
        const allResponse = await axios.get(`${BACKEND_URL}/batches`);
        console.log('✅ All batches retrieved');
        console.log('   Total count:', allResponse.data.count);
        
        // 5. Test batch approval
        console.log('\n5. Testing batch approval...');
        const approveResponse = await axios.post(`${BACKEND_URL}/batches/approve/TEST-BATCH-001`);
        console.log('✅ Batch approved successfully');
        console.log('   New status:', approveResponse.data.batch.status);
        
        console.log('\n🎉 Complete Data Flow Test PASSED!');
        console.log('📊 Summary:');
        console.log('   - Backend Connection: ✅');
        console.log('   - Batch Submission: ✅');
        console.log('   - Data Storage: ✅');
        console.log('   - Data Retrieval: ✅');
        console.log('   - Batch Approval: ✅');
        
    } catch (error) {
        console.error('❌ Data flow test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Ensure backend server is running: node src/index.js');
        console.log('2. Check backend logs for errors');
        console.log('3. Verify API endpoints are properly configured');
    }
}

testDataFlow();
