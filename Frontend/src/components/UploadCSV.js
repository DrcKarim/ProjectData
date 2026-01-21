import React, { useState } from 'react';
import './UploadCSV.css';

/**
 * Component for CSV file upload
 * Handles file selection and upload to backend
 */
function UploadCSV({ onUploadSuccess, onUploadError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        onUploadError('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadError('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Send file to backend
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      
      // Validate the response data
      if (!data || !data.num_rows || !data.column_names) {
        throw new Error('Invalid response from server');
      }
      
      // Notify parent component of successful upload
      onUploadSuccess(data);
      
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error.message || 'Failed to upload file. Make sure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📊 Upload CSV Dataset</h2>
      
      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          disabled={uploading}
          id="file-input"
        />
        
        <label htmlFor="file-input" className="file-label">
          {selectedFile ? selectedFile.name : 'Choose CSV file'}
        </label>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </div>

      {selectedFile && (
        <div className="file-info">
          <p>Selected: <strong>{selectedFile.name}</strong></p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
}

export default UploadCSV;
