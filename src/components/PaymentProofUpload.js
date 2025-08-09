import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { buildApiUrl } from '../config/api';

const PaymentProofUpload = ({ onUploadSuccess, onUploadError, tournamentId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = (selectedFile) => {
    setError('');
    setSuccess('');

    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.');
      return;
    }

    // Validate file size
    if (selectedFile.size > maxSize) {
      setError('File too large. Maximum allowed size is 5MB.');
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    if (tournamentId) {
      formData.append('tournamentId', tournamentId);
    }

    try {
      const response = await fetch(buildApiUrl('/payments/upload-proof'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Payment proof uploaded successfully!');
        setFile(null);
        setPreview(null);
        if (onUploadSuccess) {
          onUploadSuccess(data.data);
        }
      } else {
        setError(data.message || 'Upload failed');
        if (onUploadError) {
          onUploadError(data.message);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      if (onUploadError) {
        onUploadError('Network error');
      }
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-md mx-auto">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Upload Area */}
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF, WEBP up to 5MB
          </p>
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Payment proof preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {file.type}</p>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Payment Proof'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}
    </div>
  );
};

export default PaymentProofUpload; 