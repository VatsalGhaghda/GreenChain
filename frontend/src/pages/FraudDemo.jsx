import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import fraudService from '../services/fraudService';
import { 
  ShieldExclamationIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClockIcon,
  FireIcon,
  UserIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from '../components/Breadcrumbs';

export default function FraudDemo() {
  const { currentRole } = useOutletContext();
  const [activeTab, setActiveTab] = useState('duplicate-batch');
  const [demoResults, setDemoResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const fraudTests = {
    'duplicate-batch': {
      title: 'Duplicate Batch Issuance',
      description: 'Attempt to create a batch with the same ID as an existing approved batch',
      risk: 'High',
      impact: 'Double counting of carbon credits, inflation of credit supply',
      prevention: 'Unique batch ID validation, blockchain transaction verification',
      status: 'pending'
    },
    'double-retirement': {
      title: 'Double Retirement Attack',
      description: 'Try to retire the same carbon credits multiple times',
      risk: 'High',
      impact: 'Credits counted as retired multiple times, false environmental claims',
      prevention: 'Credit state tracking, retirement verification on blockchain',
      status: 'pending'
    },
    'fake-metadata': {
      title: 'Fake Metadata Injection',
      description: 'Attempt to submit production reports with falsified carbon intensity data',
      risk: 'Medium',
      impact: 'Credits issued for higher-than-actual carbon reduction',
      prevention: 'Third-party verification, IPFS hash validation, document integrity checks',
      status: 'pending'
    },
    'role-escalation': {
      title: 'Role Escalation Attack',
      description: 'Try to perform actions outside of assigned user role permissions',
      risk: 'Medium',
      impact: 'Unauthorized access to sensitive functions, data manipulation',
      prevention: 'Role-based access control (RBAC), permission validation',
      status: 'pending'
    },
    'front-running': {
      title: 'Front-Running Protection',
      description: 'Simulate front-running attacks on credit transactions',
      risk: 'Low',
      impact: 'Market manipulation, unfair transaction ordering',
      prevention: 'Commit-reveal schemes, transaction ordering protection',
      status: 'pending'
    }
  };

  const runFraudTest = async (testKey) => {
    setIsRunning(true);
    setCurrentTest(testKey);
    
    let result;
    try {
      switch (testKey) {
        case 'duplicate-batch':
          // Test duplicate issue fraud
          result = await fraudService.demoFraud('DUPLICATE_ISSUE', 1, '0x123456789', 100);
          if (result.fraudDetected) {
            result = {
              success: false,
              message: '❌ Duplicate credit issue detected! Transaction rejected.',
              details: 'Smart contract fraud prevention blocked duplicate credit issuance.',
              blockchainTx: result.transactionHash || 'N/A',
              timestamp: new Date().toISOString(),
              securityFeatures: ['Hash-based fraud detection', 'Smart contract validation', 'Transaction rejection']
            };
          }
          break;
        
        case 'double-retirement':
          // Test double retirement fraud
          result = await fraudService.demoFraud('DOUBLE_RETIREMENT', 1, null, 50, 'Carbon offset');
          if (result.fraudDetected) {
            result = {
              success: false,
              message: '❌ Double retirement detected! Transaction rejected.',
              details: 'Smart contract fraud prevention blocked duplicate credit retirement.',
              blockchainTx: result.transactionHash || 'N/A',
              timestamp: new Date().toISOString(),
              securityFeatures: ['Hash-based fraud detection', 'Retirement tracking', 'Transaction rejection']
            };
          }
          break;
        
        case 'fake-metadata':
          result = {
            success: false,
            message: '❌ Metadata validation failed! Inconsistent carbon intensity data.',
            details: 'Third-party verification detected discrepancies between submitted data and verified production records.',
            blockchainTx: '0x555666777888999aaaabbbcccdddeeefff000111',
            timestamp: new Date().toISOString(),
            securityFeatures: ['Data integrity checks', 'Third-party verification', 'IPFS hash validation']
          };
          break;
        
        case 'role-escalation':
          result = {
            success: false,
            message: '❌ Access denied! Insufficient permissions for this action.',
            details: 'Role-based access control prevented producer from accessing certifier-only functions.',
            blockchainTx: '0x222333444555666777888999aaabbbcccdddeee',
            timestamp: new Date().toISOString(),
            securityFeatures: ['RBAC enforcement', 'Permission validation', 'Access logging']
          };
          break;
        
        case 'front-running':
          result = {
            success: true,
            message: '✅ Front-running protection active! Transaction ordering preserved.',
            details: 'Commit-reveal scheme successfully protected transaction from front-running attacks.',
            blockchainTx: '0x111222333444555666777888999aaabbbcccddd',
            timestamp: new Date().toISOString(),
            securityFeatures: ['Commit-reveal scheme', 'Transaction ordering', 'MEV protection']
          };
          break;
        
        default:
          result = {
            success: false,
            message: '❌ Test failed! Unknown test type.',
            details: 'The specified fraud test could not be executed.',
            blockchainTx: null,
            timestamp: new Date().toISOString(),
            securityFeatures: []
          };
      }
    } catch (error) {
      result = {
        success: false,
        message: '❌ Test execution failed!',
        details: `Error: ${error.message}`,
        blockchainTx: null,
        timestamp: new Date().toISOString(),
        securityFeatures: []
      };
    }
    
    setDemoResults(prev => ({
      ...prev,
      [testKey]: result
    }));
    
    setIsRunning(false);
    setCurrentTest('');
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fraud Prevention Demo</h1>
            <p className="mt-2 text-gray-600">
              Interactive demonstration of blockchain security features and fraud prevention mechanisms
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <ShieldExclamationIcon className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">Security Active</span>
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <LockClosedIcon className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-green-900 mb-2">Security Features Overview</h3>
            <p className="text-green-700 mb-4">
              This platform implements multiple layers of security to prevent fraud and ensure the integrity of carbon credit transactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Blockchain Security</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Immutable transaction records</li>
                  <li>• Smart contract validation</li>
                  <li>• Cryptographic verification</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Data Integrity</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• IPFS hash validation</li>
                  <li>• Document integrity checks</li>
                  <li>• Third-party verification</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Access Control</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Role-based permissions</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Audit logging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Selection Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {Object.entries(fraudTests).map(([key, test]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {test.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Test Panel */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {fraudTests[activeTab].title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(fraudTests[activeTab].risk)}`}>
                  {fraudTests[activeTab].risk} Risk
                </span>
              </div>
              <p className="text-gray-600 mb-4">{fraudTests[activeTab].description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Potential Impact</h4>
                  <p className="text-sm text-gray-600">{fraudTests[activeTab].impact}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prevention Mechanisms</h4>
                  <p className="text-sm text-gray-600">{fraudTests[activeTab].prevention}</p>
                </div>
              </div>
            </div>
            
            <div className="ml-6">
              <button
                onClick={() => runFraudTest(activeTab)}
                disabled={isRunning}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isRunning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isRunning && currentTest === activeTab ? (
                  <>
                    <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <FireIcon className="h-4 w-4 mr-2" />
                    Run Attack Test
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Results */}
          {demoResults[activeTab] && (
            <div className={`border rounded-lg p-4 ${
              demoResults[activeTab].success 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {demoResults[activeTab].success ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">Test Result</h4>
                  <p className={`text-sm font-medium mb-2 ${
                    demoResults[activeTab].success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {demoResults[activeTab].message}
                  </p>
                  <p className="text-sm text-gray-700 mb-3">{demoResults[activeTab].details}</p>
                  
                  {demoResults[activeTab].blockchainTx && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600">Blockchain Transaction:</span>
                      <p className="text-sm font-mono text-gray-900 break-all">
                        {demoResults[activeTab].blockchainTx}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">Security Features Triggered:</span>
                    <ul className="text-sm text-gray-700 mt-1">
                      {demoResults[activeTab].securityFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Test executed at: {new Date(demoResults[activeTab].timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Instructions */}
          {!demoResults[activeTab] && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Test Instructions</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Click the "Run Attack Test" button to simulate this fraud attempt. The system will demonstrate how security features prevent the attack.
                  </p>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>Note:</strong> This is a demonstration environment. All tests are simulated and do not affect real data or blockchain state.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center h-12 w-12 mx-auto bg-green-100 rounded-lg mb-4">
            <ShieldExclamationIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">5</h3>
          <p className="text-sm text-gray-600">Security Tests</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center h-12 w-12 mx-auto bg-green-100 rounded-lg mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">100%</h3>
          <p className="text-sm text-gray-600">Attack Prevention</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-100 rounded-lg mb-4">
            <LockClosedIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Multi-Layer</h3>
          <p className="text-sm text-gray-600">Security Architecture</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center h-12 w-12 mx-auto bg-purple-100 rounded-lg mb-4">
            <KeyIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Real-Time</h3>
          <p className="text-sm text-gray-600">Threat Detection</p>
        </div>
      </div>

      {/* Additional Security Information */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Security Measures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Blockchain Security</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Immutable transaction records on Ethereum</li>
              <li>• Smart contract validation and execution</li>
              <li>• Cryptographic proof of ownership</li>
              <li>• Decentralized consensus mechanism</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data Protection</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• IPFS decentralized storage</li>
              <li>• Content-addressed file integrity</li>
              <li>• Encrypted sensitive data</li>
              <li>• Regular security audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
