import React, { useState } from 'react';
import PaymentProofUpload from './PaymentProofUpload';

const PaymentTest = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploadSuccess = (fileData) => {
    setUploadedFiles(prev => [...prev, fileData]);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Proof Upload Test
          </h1>
          <p className="text-gray-600">
            Test the payment proof upload functionality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
            <PaymentProofUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              tournamentId="test-tournament-123"
            />
          </div>

          {/* Uploaded Files Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            {uploadedFiles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No files uploaded yet
              </p>
            ) : (
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={file.url}
                        alt="Payment proof"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{file.originalName}</p>
                        <p className="text-sm text-gray-500">
                          Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-sm text-gray-500">
                          Filename: {file.filename}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-2 text-sm font-mono">
            <p><span className="text-green-600">POST</span> /api/payments/upload-proof</p>
            <p><span className="text-blue-600">GET</span> /api/payments/proof/:filename</p>
            <p><span className="text-red-600">DELETE</span> /api/payments/proof/:filename</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest; 