import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import useStore from './store';
import UploadCSV from './components/UploadCSV';
import DataUpload from './components/DataUpload';
import DataProfile from './components/DataProfile';
import DatasetInfo from './components/DatasetInfo';
import Charts from './components/Charts';
import Filters from './components/Filters';
import Header from './components/Header';
import MessageBanner from './components/MessageBanner';
import VisualizationBuilder from './components/VisualizationBuilder';
import styled from 'styled-components';
import { LightTheme, DarkTheme } from './styles';
import './App.css';

/**
 * Main App Component
 * Global state managed with Zustand for scalability
 * Supports: CSV, JSON, TXT, XLSX, TSV
 */

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border?.default || '#e0e0e0'};
  padding: 0 24px;
`;

const TabButton = styled.button`
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#1976d2' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#1976d2' : 'transparent'};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: #1976d2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function App() {
  // Global state from Zustand
  const {
    datasetInfo,
    chartData,
    filteredRows,
    message,
    messageType,
    darkMode,
    setDatasetInfo,
    setChartData
  } = useStore();

  const [uploadTab, setUploadTab] = useState('enhanced');
  const [uploadedData, setUploadedData] = useState(null);
  const [activeMainTab, setActiveMainTab] = useState('upload');

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Handle new data upload
  const handleDataLoaded = (data) => {
    setUploadedData(data);
    console.log('Data loaded:', data);
    
    // Optionally transform and store in Zustand
    if (data.parsed && data.profile) {
      setDatasetInfo({
        filename: data.parsed.fileName,
        file_type: data.parsed.fileType,
        num_rows: data.parsed.data.length,
        num_columns: data.parsed.headers.length,
        column_names: data.parsed.headers,
        column_types: Object.fromEntries(
          Object.entries(data.schema).map(([key, val]) => [key, val.type])
        ),
        statistics: data.profile,
        upload_time: new Date().toISOString(),
      });
    }
  };

  return (
    <ThemeProvider theme={darkMode ? DarkTheme : LightTheme}>
      <div className={`App ${darkMode ? 'dark' : 'light'}`}>
        {/* Header with Dark Mode Toggle */}
      <Header />

      <div className="container">
        {/* Message Banner */}
        {message && (
          <MessageBanner 
            message={message}
            type={messageType}
          />
        )}

        {/* Upload Section with Tabs */}
        <TabContainer>
          <TabButton 
            active={activeMainTab === 'upload'} 
            onClick={() => setActiveMainTab('upload')}
          >
            📤 Upload & Explore
          </TabButton>
          <TabButton 
            active={activeMainTab === 'builder'} 
            onClick={() => setActiveMainTab('builder')}
            disabled={!uploadedData}
            title={!uploadedData ? 'Upload data first' : ''}
          >
            📊 Visualization Builder
          </TabButton>
        </TabContainer>

        {/* Upload Tab Content */}
        {/* Upload Tab Content */}
        {activeMainTab === 'upload' && (
          <>
            <TabContainer>
              <TabButton 
                active={uploadTab === 'enhanced'} 
                onClick={() => setUploadTab('enhanced')}
              >
                ✨ Enhanced Upload (Recommended)
              </TabButton>
              <TabButton 
                active={uploadTab === 'classic'} 
                onClick={() => setUploadTab('classic')}
              >
                📁 Classic Upload
              </TabButton>
            </TabContainer>

            {uploadTab === 'enhanced' && (
              <div style={{ marginBottom: '32px' }}>
                <DataUpload onDataLoaded={handleDataLoaded} />
              </div>
            )}

            {uploadTab === 'classic' && (
              <div style={{ marginBottom: '32px' }}>
                <UploadCSV />
              </div>
            )}

            {/* Data Profile Section - Shows after enhanced upload */}
            {uploadedData && uploadTab === 'enhanced' && (
              <div style={{ marginBottom: '32px', marginTop: '32px' }}>
                <DataProfile 
                  profile={uploadedData.profile}
                  data={uploadedData.parsed.data}
                  headers={uploadedData.parsed.headers}
                />
              </div>
            )}

            {/* Main Content - Only show if dataset is loaded */}
            {datasetInfo && (
              <>
                {/* Dataset Information Panel */}
                <DatasetInfo 
                  datasetInfo={datasetInfo}
                  filteredRows={filteredRows}
                />

                {/* Filter Controls */}
                <Filters datasetInfo={datasetInfo} />

                {/* Visualizations */}
                <Charts 
                  chartData={chartData}
                  columnTypes={datasetInfo.column_types}
                  wordFrequencies={datasetInfo.word_frequencies}
                />
              </>
            )}

            {/* Welcome Screen */}
            {!datasetInfo && (
              <div className="welcome-section">
                <div className="welcome-card">
                  <h2>📊 Data Visualization Explorer</h2>
                  <p>Transform your data into interactive insights</p>
                  
                  <div className="supported-formats">
                    <h3>Supported Formats:</h3>
                    <div className="format-badges">
                      <span className="badge">CSV</span>
                      <span className="badge">JSON</span>
                      <span className="badge">TXT</span>
                      <span className="badge">TSV</span>
                      <span className="badge">XLSX</span>
                    </div>
                  </div>

                  <div className="features-grid">
                    <div className="feature-item">
                      <h4>📈 Macro Analysis</h4>
                      <p>Histograms, bar charts, line charts, word clouds</p>
                    </div>
                    <div className="feature-item">
                      <h4>🔍 Micro Exploration</h4>
                      <p>Drill-down, filters, tooltips, data tables</p>
                    </div>
                    <div className="feature-item">
                      <h4>⚡ Interactive</h4>
                      <p>Hover, click, brush, link across visualizations</p>
                    </div>
                    <div className="feature-item">
                      <h4>🎨 Multiple Libraries</h4>
                      <p>Recharts, Plotly, D3, Vega-Lite</p>
                    </div>
                  </div>

                  <div className="instructions">
                    <h3>How to Get Started:</h3>
                    <ol>
                      <li>Click <strong>"Choose File"</strong> above</li>
                      <li>Select any CSV, JSON, TXT, or XLSX file</li>
                      <li>Click <strong>"Upload & Analyze"</strong></li>
                      <li>Explore your data with interactive visualizations</li>
                      <li>Use filters to drill down into specific insights</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Visualization Builder Tab */}
        {activeMainTab === 'builder' && uploadedData && (
          <VisualizationBuilder
            data={uploadedData.parsed.data}
            theme={{
              colors: {
                primary: '#3b82f6',
                primaryDark: '#1d4ed8',
                primaryLight: '#eff6ff',
                background: '#ffffff',
                backgroundSecondary: '#f9fafb',
                border: '#e0e0e0',
                text: '#1f2937',
                textSecondary: '#6b7280',
              },
            }}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>Interactive Data Visualization System • Master-Level Course</p>
        <p>Frontend: React | Backend: FastAPI | Status: ✅ Production Ready</p>
      </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
