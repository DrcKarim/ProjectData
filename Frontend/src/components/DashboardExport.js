/**
 * Dashboard Export Component
 * Multi-chart export functionality
 */

import React, { useState } from 'react';
import {
  ExportFormats,
  ExportResolutions,
  exportDashboardAsPDF,
  downloadBlob,
  sanitizeFilename,
  getTimestamp,
} from '../utils/exportUtils';
import './DashboardExport.css';

const DashboardExport = ({
  chartElements = [],
  title = 'Dashboard Report',
  onClose,
}) => {
  const [format, setFormat] = useState(ExportFormats.PDF);
  const [resolution, setResolution] = useState(300);
  const [filename, setFilename] = useState(
    `dashboard_${getTimestamp()}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [chartsPerPage, setChartsPerPage] = useState(1);

  const handleExport = async () => {
    if (chartElements.length === 0) {
      setError('No charts to export');
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress(0);

    try {
      const sanitized = sanitizeFilename(filename);
      const fullFilename = `${sanitized}.pdf`;

      setProgress(20);

      const blob = await exportDashboardAsPDF(chartElements, {
        filename: fullFilename,
        title: sanitized,
        subtitle,
        author,
        resolution,
        includeTimestamp,
        chartsPerPage,
      });

      setProgress(80);

      // Download
      downloadBlob(blob, fullFilename);

      setProgress(100);

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Dashboard export failed:', err);
      setError(err.message);
      setIsExporting(false);
    }
  };

  return (
    <div
      className="dashboard-export-overlay"
      onClick={onClose}
    >
      <div
        className="dashboard-export"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dashboard-export-header">
          <h2>Export Dashboard Report</h2>
          <button
            className="dashboard-export-close"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="dashboard-export-content">
          {/* Charts Count */}
          <div className="dashboard-info">
            <strong>📊 Charts to Export:</strong> {chartElements.length}
          </div>

          {/* Report Title */}
          <div className="export-form-group">
            <label className="export-label">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dashboard title"
              disabled={isExporting}
              className="export-input"
            />
          </div>

          {/* Subtitle */}
          <div className="export-form-group">
            <label className="export-label">Subtitle (Optional)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Add subtitle or description"
              disabled={isExporting}
              className="export-input"
            />
          </div>

          {/* Author */}
          <div className="export-form-group">
            <label className="export-label">Author (Optional)</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name or organization"
              disabled={isExporting}
              className="export-input"
            />
          </div>

          {/* Resolution */}
          <div className="export-form-group">
            <label className="export-label">Resolution</label>
            <div className="export-resolution-options">
              {Object.entries(ExportResolutions).map(
                ([key, { dpi, label }]) => (
                  <button
                    key={key}
                    className={`export-resolution-btn ${
                      resolution === dpi ? 'active' : ''
                    }`}
                    onClick={() => setResolution(dpi)}
                    disabled={isExporting}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Charts Per Page */}
          <div className="export-form-group">
            <label className="export-label">Layout</label>
            <div className="charts-per-page-options">
              <button
                className={`layout-btn ${chartsPerPage === 1 ? 'active' : ''}`}
                onClick={() => setChartsPerPage(1)}
                disabled={isExporting}
              >
                <span className="layout-icon">📄</span>
                1 Chart per Page
              </button>
              <button
                className={`layout-btn ${chartsPerPage === 2 ? 'active' : ''}`}
                onClick={() => setChartsPerPage(2)}
                disabled={isExporting}
              >
                <span className="layout-icon">📋</span>
                2 Charts per Page
              </button>
            </div>
          </div>

          {/* Metadata Options */}
          <div className="export-form-group">
            <label className="export-label">Options</label>
            <div className="export-checkbox-group">
              <label className="export-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeTimestamp}
                  onChange={(e) => setIncludeTimestamp(e.target.checked)}
                  disabled={isExporting}
                />
                <span>Include generation timestamp</span>
              </label>
            </div>
          </div>

          {/* Filename */}
          <div className="export-form-group">
            <label className="export-label">Filename</label>
            <div className="export-filename-input">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                disabled={isExporting}
                className="export-input"
              />
              <span className="export-extension">.pdf</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="export-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Progress Bar */}
          {isExporting && progress > 0 && (
            <div className="export-progress-container">
              <div className="export-progress-bar">
                <div
                  className="export-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="export-progress-text">
                {progress < 100
                  ? `Exporting... ${progress}%`
                  : 'Complete!'}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="dashboard-info-box">
            <strong>💡 Export Tips:</strong>
            <ul>
              <li>
                High resolution (300+ DPI) recommended for printing
              </li>
              <li>1 chart per page for detailed analysis</li>
              <li>2 charts per page for compact reports</li>
              <li>Include timestamp for audit trail</li>
            </ul>
          </div>
        </div>

        <div className="dashboard-export-footer">
          <button
            className="export-btn-cancel"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            className="export-btn-export"
            onClick={handleExport}
            disabled={isExporting || !filename}
          >
            {isExporting ? `Exporting... ${progress}%` : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardExport;
