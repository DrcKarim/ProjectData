import React from 'react';
import './DatasetInfo.css';

/**
 * Component to display dataset information and statistics
 * Shows row/column counts, column types, and basic statistics
 */
function DatasetInfo({ datasetInfo, filteredRows }) {
  if (!datasetInfo) {
    return null;
  }

  const { filename, num_rows, num_columns, column_names, column_types, statistics } = datasetInfo;

  // Determine if data is filtered - ensure displayRows is always a valid number
  const isFiltered = filteredRows !== undefined && filteredRows !== null && filteredRows !== num_rows;
  const displayRows = (isFiltered && filteredRows !== null) ? filteredRows : num_rows;

  return (
    <div className="dataset-info-container">
      <h2>📁 Dataset Information</h2>
      
      {/* Basic Info */}
      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">Filename</div>
          <div className="info-value">{filename}</div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Rows</div>
          <div className="info-value">
            {displayRows.toLocaleString()}
            {isFiltered && <span className="filtered-label"> (filtered)</span>}
          </div>
        </div>
        
        <div className="info-card">
          <div className="info-label">Columns</div>
          <div className="info-value">{num_columns}</div>
        </div>
      </div>

      {/* Column Information */}
      <div className="columns-section">
        <h3>Columns</h3>
        <div className="columns-grid">
          {column_names.map((col, index) => (
            <div key={index} className="column-item">
              <span className="column-name">{col}</span>
              <span className={`column-type ${column_types[col]}`}>
                {column_types[col]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="statistics-section">
        <h3>Statistics</h3>
        <div className="stats-grid">
          {Object.entries(statistics || {}).map(([col, stats]) => (
            <div key={col} className="stat-card">
              <h4>{col}</h4>
              {column_types[col] === 'numeric' ? (
                <div className="stat-details">
                  <div className="stat-row">
                    <span>Mean:</span>
                    <strong>{stats?.mean?.toFixed(2) || 'N/A'}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Min:</span>
                    <strong>{stats?.min?.toFixed(2) || 'N/A'}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Max:</span>
                    <strong>{stats?.max?.toFixed(2) || 'N/A'}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Median:</span>
                    <strong>{stats?.median?.toFixed(2) || 'N/A'}</strong>
                  </div>
                </div>
              ) : (
                <div className="stat-details">
                  <div className="stat-row">
                    <span>Unique Values:</span>
                    <strong>{stats?.unique_values || 0}</strong>
                  </div>
                  <div className="top-values">
                    <span>Top Values:</span>
                    {Object.entries(stats?.top_values || {}).slice(0, 5).map(([val, count]) => (
                      <div key={val} className="value-count">
                        <span className="value-label">{val}:</span>
                        <span className="value-number">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DatasetInfo;
