import React, { useMemo } from 'react';
import './DatasetInfo.css';

/**
 * Dataset Information Panel
 * Displays file metadata, column info, and detailed statistics
 */
function DatasetInfo({ datasetInfo, filteredRows }) {
  const columnTypeCounts = useMemo(() => {
    if (!datasetInfo?.column_types) return {};
    const counts = {};
    Object.values(datasetInfo.column_types).forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [datasetInfo?.column_types]);

  if (!datasetInfo) {
    return null;
  }

  const { filename, num_rows, num_columns, column_names, column_types, statistics, file_type } = datasetInfo;

  // Determine if data is filtered
  const displayRows = filteredRows !== undefined && filteredRows !== null ? filteredRows : num_rows;
  const isFiltered = filteredRows !== undefined && filteredRows !== null && filteredRows !== num_rows;
  const filterPercentage = isFiltered ? ((displayRows / num_rows) * 100).toFixed(1) : 100;

  // Count column types
  return (
    <div className="dataset-info-container">
      <div className="info-header">
        <h2>📊 Dataset Overview</h2>
        {isFiltered && <span className="filter-indicator">Filtered View</span>}
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📄</div>
          <div className="metric-content">
            <span className="metric-label">File</span>
            <span className="metric-value">{filename}</span>
            <span className="metric-detail">{file_type?.toUpperCase() || 'Unknown'} format</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <span className="metric-label">Rows</span>
            <span className="metric-value">
              {displayRows.toLocaleString()}
              {isFiltered && <span className="filter-badge">/{num_rows.toLocaleString()}</span>}
            </span>
            {isFiltered && <span className="metric-detail">{filterPercentage}% of original</span>}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <span className="metric-label">Columns</span>
            <span className="metric-value">{num_columns}</span>
            <span className="metric-detail">
              {Object.entries(columnTypeCounts).map(([type, count]) => `${count} ${type}`).join(' • ')}
            </span>
          </div>
        </div>
      </div>

      {/* Column Information */}
      <div className="columns-section">
        <h3>Columns ({num_columns})</h3>
        <div className="columns-grid">
          {column_names.map((col, index) => (
            <div key={index} className="column-badge">
              <span className="column-name">{col}</span>
              <span className={`column-type-badge ${column_types[col]}`}>
                {column_types[col].charAt(0).toUpperCase() + column_types[col].slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="statistics-section">
        <h3>Summary Statistics</h3>
        <div className="stats-grid">
          {Object.entries(statistics || {}).map(([col, stats]) => {
            const colType = column_types[col];
            return (
              <div key={col} className="stat-card">
                <h4>
                  <span className="stat-name">{col}</span>
                  <span className={`stat-type ${colType}`}>{colType}</span>
                </h4>

                {colType === 'numeric' && (
                  <div className="stat-details numeric">
                    <div className="stat-grid-2">
                      <div className="stat-item">
                        <span className="stat-key">Count</span>
                        <span className="stat-val">{stats?.count || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-key">Missing</span>
                        <span className="stat-val">{stats?.missing || 0}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-key">Mean</span>
                        <span className="stat-val">{(stats?.mean || 0).toFixed(2)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-key">Median</span>
                        <span className="stat-val">{(stats?.median || 0).toFixed(2)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-key">Std Dev</span>
                        <span className="stat-val">{(stats?.std || 0).toFixed(2)}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-key">Range</span>
                        <span className="stat-val">
                          {(stats?.min || 0).toFixed(2)} - {(stats?.max || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="stat-row">
                      <span className="stat-key">Q1-Q3</span>
                      <span className="stat-val">
                        {(stats?.q25 || 0).toFixed(2)} - {(stats?.q75 || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {colType === 'categorical' && (
                  <div className="stat-details categorical">
                    <div className="stat-row">
                      <span className="stat-key">Unique Values</span>
                      <span className="stat-val">{stats?.unique_values || 0}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-key">Non-Missing</span>
                      <span className="stat-val">{stats?.count || 0}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-key">Missing</span>
                      <span className="stat-val">{stats?.missing || 0}</span>
                    </div>
                    {stats?.top_values && Object.entries(stats.top_values).slice(0, 3).length > 0 && (
                      <div className="top-values">
                        <span className="stat-key">Top Values</span>
                        <div className="values-list">
                          {Object.entries(stats.top_values).slice(0, 3).map(([val, count]) => (
                            <div key={val} className="value-item">
                              <span className="value-label">{val}</span>
                              <span className="value-count">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {colType === 'temporal' && (
                  <div className="stat-details temporal">
                    <div className="stat-row">
                      <span className="stat-key">Count</span>
                      <span className="stat-val">{stats?.count || 0}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-key">Missing</span>
                      <span className="stat-val">{stats?.missing || 0}</span>
                    </div>
                    {stats?.min_date && (
                      <div className="stat-row">
                        <span className="stat-key">Date Range</span>
                        <span className="stat-val" title={`${stats.min_date} to ${stats.max_date}`}>
                          {new Date(stats.min_date).toLocaleDateString()} to{' '}
                          {new Date(stats.max_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DatasetInfo;
