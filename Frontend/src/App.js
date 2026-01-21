import React, { useState } from 'react';
import UploadCSV from './components/UploadCSV';
import DatasetInfo from './components/DatasetInfo';
import Charts from './components/Charts';
import Filters from './components/Filters';
import './App.css';

/**
 * Main App Component
 * Manages state for the entire CSV Dataset Explorer application
 */
function App() {
  // State for dataset information
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [filteredRows, setFilteredRows] = useState(null);
  
  // State for error and success messages
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'

  /**
   * Handle successful CSV upload
   */
  const handleUploadSuccess = (data) => {
    setDatasetInfo(data);
    setChartData(data.chart_data);
    setFilteredRows(null); // Reset filter
    setMessage('Dataset uploaded successfully!');
    setMessageType('success');
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  /**
   * Handle upload error
   */
  const handleUploadError = (error) => {
    setMessage(error);
    setMessageType('error');
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  /**
   * Handle filter application
   */
  const handleFilterApply = (filteredData) => {
    setFilteredRows(filteredData.num_rows);
    setChartData(filteredData.chart_data);
    
    // Update statistics in dataset info
    if (datasetInfo) {
      setDatasetInfo({
        ...datasetInfo,
        statistics: filteredData.statistics
      });
    }
    
    setMessage(`Filter applied! Showing ${filteredData.num_rows} rows`);
    setMessageType('success');
    
    setTimeout(() => setMessage(null), 3000);
  };

  /**
   * Handle filter reset
   */
  const handleReset = async () => {
    try {
      const response = await fetch('http://localhost:8000/reset', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Reset failed');
      }

      const data = await response.json();
      setDatasetInfo(data);
      setChartData(data.chart_data);
      setFilteredRows(null);
      
      setMessage('Filters reset successfully!');
      setMessageType('success');
      
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error('Reset error:', error);
      setMessage('Failed to reset filters');
      setMessageType('error');
      
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>📊 Interactive CSV Dataset Explorer</h1>
        <p>Upload, analyze, and visualize your CSV datasets</p>
      </header>

      <div className="container">
        {/* Message Display */}
        {message && (
          <div className={messageType === 'error' ? 'error' : 'success'}>
            {message}
          </div>
        )}

        {/* Upload Section */}
        <UploadCSV 
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {/* Main Content - Only show if dataset is loaded */}
        {datasetInfo && (
          <>
            {/* Dataset Information */}
            <DatasetInfo 
              datasetInfo={datasetInfo}
              filteredRows={filteredRows}
            />

            {/* Filters */}
            <Filters
              datasetInfo={datasetInfo}
              onFilterApply={handleFilterApply}
              onReset={handleReset}
            />

            {/* Charts */}
            <Charts 
              chartData={chartData}
              columnTypes={datasetInfo.column_types}
            />
          </>
        )}

        {/* Instructions - Show when no dataset is loaded */}
        {!datasetInfo && (
          <div className="instructions">
            <h2>Getting Started</h2>
            <ol>
              <li>Click "Choose CSV file" to select a CSV file from your computer</li>
              <li>Click "Upload & Analyze" to process the file</li>
              <li>View dataset statistics and visualizations</li>
              <li>Use filters to explore specific subsets of your data</li>
            </ol>
            
            <div className="features">
              <h3>Features:</h3>
              <ul>
                <li>✅ Automatic column type detection (numeric/categorical)</li>
                <li>✅ Statistical analysis for numeric columns</li>
                <li>✅ Interactive charts and visualizations</li>
                <li>✅ Dynamic filtering capabilities</li>
                <li>✅ Real-time data exploration</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>CSV Dataset Explorer • Built with React + FastAPI</p>
      </footer>
    </div>
  );
}

export default App;
