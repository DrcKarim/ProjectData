import React, { useState, useRef } from 'react';
import useStore from '../store';
import { api } from '../api';
import { FaUpload, FaFile } from 'react-icons/fa';
import './UploadCSV.css';

/**
 * Component for multi-format file upload
 * Supports: CSV, JSON, TXT, XLSX, TSV
 */
function UploadCSV() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    setDatasetInfo,
    setChartData,
    setSampleData,
    setWordFrequencies,
    setFileType,
    setMessage,
    setLoading,
    resetAll
  } = useStore();

  const supportedFormats = ['.csv', '.json', '.txt', '.xlsx', '.tsv'];

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!supportedFormats.includes(ext)) {
      setMessage(`Unsupported file format: ${ext}. Supported: ${supportedFormats.join(', ')}`, 'error');
      return;
    }

    setSelectedFile(file);
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first', 'error');
      return;
    }

    setUploading(true);
    setLoading(true);

    try {
      // Send file to backend
      const response = await api.uploadFile(selectedFile);
      const data = response.data;
      
      // Validate response
      if (!data || !data.num_rows || !data.column_names) {
        throw new Error('Invalid response from server');
      }
      
      // Update store
      setDatasetInfo(data);
      setChartData(data.chart_data);
      setSampleData(data.sample_data);
      setWordFrequencies(data.word_frequencies);
      setFileType(data.file_type);
      
      setMessage(`✅ ${data.filename} uploaded successfully! (${data.num_rows} rows, ${data.num_columns} columns)`, 'success');
      
      // Reset file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to upload file. Ensure backend is running on http://localhost:8000';
      setMessage(errorMsg, 'error');
      resetAll();
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate file input change
      const event = { target: { files: [file] } };
      handleFileSelect(event);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2><FaUpload /> Upload Your Data</h2>
        <p>Supports: CSV, JSON, TXT, XLSX, TSV</p>
      </div>
      
      <div 
        className={`upload-box ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
          id="file-input"
          className="file-input"
        />
        
        <label htmlFor="file-input" className="file-label">
          <FaFile className="file-icon" />
          <div>
            <p className="label-title">
              {selectedFile ? selectedFile.name : 'Choose file or drag & drop'}
            </p>
            {!selectedFile && (
              <p className="label-subtitle">Supported formats: CSV, JSON, TXT, XLSX, TSV</p>
            )}
          </div>
        </label>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="upload-button"
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Uploading...
            </>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      </div>

      {selectedFile && (
        <div className="file-info">
          <p>📄 <strong>{selectedFile.name}</strong></p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
}

export default UploadCSV;
