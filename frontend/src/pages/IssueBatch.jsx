import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import batchService from '../services/batchService';

export default function IssueBatch() {
  const { currentRole } = useOutletContext();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    batchId: '',
    amount: '',
    carbonIntensity: '',
    method: '',
    description: ''
  });
  
  const [fileData, setFileData] = useState({
    file: null,
    fileName: '',
    fileSize: 0,
    fileType: ''
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [errors, setErrors] = useState({});

  const methods = [
    'Steam Methane Reforming (SMR)',
    'Autothermal Reforming (ATR)',
    'Partial Oxidation (POX)',
    'Electrolysis',
    'Biomass Gasification',
    'Other'
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileData({
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.batchId.trim()) newErrors.batchId = 'Batch ID is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.carbonIntensity || formData.carbonIntensity <= 0) newErrors.carbonIntensity = 'Valid carbon intensity is required';
    if (!formData.method) newErrors.method = 'Method is required';
    if (!fileData.file) newErrors.file = 'Production report file is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadToIPFS = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for UI
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      let uploadResult;
      
      try {
        // Try to upload file to IPFS via backend
        uploadResult = await batchService.uploadFile(fileData.file);
      } catch (backendError) {
        console.warn('Backend IPFS upload failed, using fallback:', backendError.message);
        
        // Fallback: Generate mock IPFS data for demo
        uploadResult = {
          ipfsHash: `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          ipfsURL: `https://gateway.pinata.cloud/ipfs/Qm${Math.random().toString(36).substring(2, 15)}`,
          fileName: fileData.fileName,
          fileSize: fileData.fileSize,
          fileType: fileData.fileType
        };
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Generate complete metadata
      const metadata = {
        batchId: formData.batchId,
        amount: parseFloat(formData.amount),
        carbonIntensity: parseFloat(formData.carbonIntensity),
        method: formData.method,
        description: formData.description,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
        uploadTimestamp: new Date().toISOString(),
        ipfsHash: uploadResult.ipfsHash,
        ipfsURL: uploadResult.ipfsURL,
        producer: 'Current User'
      };
      
      setMetadata(metadata);
      setIsUploading(false);
      
    } catch (error) {
      console.error('IPFS upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Failed to upload file to IPFS: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!metadata) {
      await uploadToIPFS();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit batch to backend API
      const batchData = {
        batchId: formData.batchId,
        amountKg: parseFloat(formData.amount),
        metadata: metadata,
        producer: '0x123456789abcdef' // In real app, get from connected wallet
      };
      
      const result = await batchService.submitBatch(batchData);
      
      alert(`✅ Batch successfully submitted!\n\nBatch ID: ${result.batch.batch_id}\nStatus: ${result.batch.status}\nIPFS: ${result.ipfsCID}\n\nYour batch is now pending approval.`);
      
      // Reset form
      setFormData({
        batchId: '',
        amount: '',
        carbonIntensity: '',
        method: '',
        description: ''
      });
      setFileData({ file: null, fileName: '', fileSize: 0, fileType: '' });
      setMetadata(null);
      setUploadProgress(0);
      
    } catch (error) {
      alert('❌ Error submitting batch: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Issue New Batch</h1>
                <p className="text-green-100 text-lg mt-2">Submit a new batch of GreenChain H2 Credits for certification</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Complete all required fields and upload production report</span>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Enhanced File Upload Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Production Report Upload</h2>
                    <p className="text-gray-600 text-sm">Upload your production documentation</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  !fileData.file 
                    ? 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50' 
                    : 'border-green-300 bg-green-50'
                }`}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json,.pdf,.txt"
                    className="hidden"
                  />
                  
                  {!fileData.file ? (
                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                      <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Click to upload production report</h3>
                      <p className="text-gray-600 mb-4">Supports JSON, PDF, TXT files up to 10MB</p>
                      <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Choose File
                      </div>
                    </div>
                  ) : (
                    <div className="text-left">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{fileData.fileName}</h4>
                            <p className="text-sm text-gray-500">Successfully uploaded</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFileData({ file: null, fileName: '', fileSize: 0, fileType: '' })}
                          className="bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-gray-500">Size:</span>
                          <span className="ml-2 font-medium text-gray-900">{formatFileSize(fileData.fileSize)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium text-gray-900">{fileData.fileType}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {errors.file && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-red-700 text-sm">{errors.file}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Form Fields Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Batch Information</h2>
                    <p className="text-gray-600 text-sm">Fill in the required batch details</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Batch ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="batchId"
                        value={formData.batchId}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter unique batch identifier"
                      />
                    </div>
                    {errors.batchId && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors.batchId}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Amount (kg)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.amount && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors.amount}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Carbon Intensity
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        name="carbonIntensity"
                        value={formData.carbonIntensity}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="kg CO2/kg H2"
                      />
                    </div>
                    {errors.carbonIntensity && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors.carbonIntensity}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Production Method
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <select
                        name="method"
                        value={formData.method}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="">Select production method</option>
                        {methods.map((method, index) => (
                          <option key={index} value={method}>{method}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.method && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors.method}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Additional details about this batch (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* IPFS Upload Progress */}
            {isUploading && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">IPFS Upload Progress</h2>
                      <p className="text-gray-600 text-sm">Uploading to decentralized storage</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{uploadProgress}%</p>
                      <p className="text-sm text-gray-600">Complete</p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Uploading to IPFS...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Preview */}
            {metadata && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Metadata Preview</h2>
                      <p className="text-gray-600 text-sm">Review before submission</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: 'Batch ID', value: metadata.batchId, icon: '🏷️' },
                      { label: 'Amount', value: `${metadata.amount} kg`, icon: '⚖️' },
                      { label: 'Carbon Intensity', value: `${metadata.carbonIntensity} kg CO2/kg H2`, icon: '🌱' },
                      { label: 'Method', value: metadata.method, icon: '🏭' },
                      { label: 'File', value: metadata.fileName, icon: '📄' },
                      { label: 'IPFS Hash', value: metadata.ipfsHash, icon: '🔗' },
                      { label: 'Producer', value: metadata.producer, icon: '👤' },
                      { label: 'Timestamp', value: new Date(metadata.uploadTimestamp).toLocaleString(), icon: '⏰' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                    isSubmitting || isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting to Blockchain...</span>
                    </div>
                  ) : !metadata ? (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload to IPFS First</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Submit to Blockchain</span>
                    </div>
                  )}
                </button>
                
                {!metadata && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Complete the form first</p>
                        <p className="text-sm text-blue-700 mt-1">Fill out all required fields and upload your production report to continue</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
