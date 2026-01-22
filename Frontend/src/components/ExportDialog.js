/**
 * Export Dialog Component
 * UI for exporting charts and dashboards to PNG, SVG, PDF
 */

import React, { useState } from 'react';
import {
  ExportFormats,
  ExportResolutions,
  exportChartAsPNG,
  exportChartAsSVG,
  exportChartAsPDF,
  downloadBlob,
  sanitizeFilename,
  getFileExtension,
  getTimestamp,
} from '../utils/exportUtils';
import './ExportDialog.css';

const ExportDialog = ({
  chartElement,
  echartsInstance,
  title = 'Export Chart',
  onClose,
  exportType = 'chart', // 'chart', 'dashboard', 'presentation'
}) => {
  const [format, setFormat] = useState(ExportFormats.PNG);
  const [resolution, setResolution] = useState(300);
  const [filename, setFilename] = useState(
    `chart_${getTimestamp()}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setProgress(0);

    try {
      const sanitized = sanitizeFilename(filename);
      const fileExtension = getFileExtension(format);
      const fullFilename = `${sanitized}.${fileExtension}`;

      setProgress(20);

      let blob;

      switch (format) {
        case ExportFormats.PNG:
          blob = await exportChartAsPNG(chartElement, {
            filename: fullFilename,
            resolution,
          });
          break;

        case ExportFormats.SVG:
          if (!echartsInstance) {
            throw new Error(
              'SVG export requires ECharts instance'
            );
          }
          blob = await exportChartAsSVG(echartsInstance, {
            filename: fullFilename,
          });
          break;

        case ExportFormats.PDF:
          blob = await exportChartAsPDF(chartElement, {
            filename: fullFilename,
            title: sanitized,
            resolution,
          });
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      setProgress(80);

      // Download the blob
      downloadBlob(blob, fullFilename);

      setProgress(100);

      // Reset and close after delay
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.message);
      setIsExporting(false);
    }
  };

  const formatLabels = {
    [ExportFormats.PNG]: 'PNG Image',
    [ExportFormats.SVG]: 'SVG Vector',
    [ExportFormats.PDF]: 'PDF Document',
  };

  return (
    <div className="export-dialog-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-dialog-header">
          <h2>{title}</h2>
          <button
            className="export-dialog-close"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="export-dialog-content">
          {/* Format Selection */}
          <div className="export-form-group">
            <label className="export-label">Export Format</label>
            <div className="export-format-buttons">
              {Object.entries(formatLabels).map(([fmt, label]) => (
                <button
                  key={fmt}
                  className={`export-format-btn ${
                    format === fmt ? 'active' : ''
                  }`}
                  onClick={() => setFormat(fmt)}
                  disabled={isExporting}
                >
                  <span className="format-icon">
                    {fmt === ExportFormats.PNG && '🖼️'}
                    {fmt === ExportFormats.SVG && '✏️'}
                    {fmt === ExportFormats.PDF && '📄'}
                  </span>
                  <span className="format-label">{label}</span>
                </button>
              ))}
            </div>
            <p className="export-format-desc">
              {format === ExportFormats.PNG &&
                'Raster format - Best for web, includes all styling'}
              {format === ExportFormats.SVG &&
                'Vector format - Scalable, smaller file size'}
              {format === ExportFormats.PDF &&
                'Document format - Best for printing and sharing'}
            </p>
          </div>

          {/* Resolution Selection (PNG and PDF only) */}
          {(format === ExportFormats.PNG || format === ExportFormats.PDF) && (
            <div className="export-form-group">
              <label className="export-label">Resolution / Quality</label>
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
              <p className="export-resolution-desc">
                Higher resolution = larger file size, better quality for printing
              </p>
            </div>
          )}

          {/* Filename Input */}
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
              <span className="export-extension">
                .{getFileExtension(format)}
              </span>
            </div>
            <p className="export-filename-desc">
              Special characters will be removed automatically
            </p>
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
          <div className="export-info-box">
            <strong>💡 Tip:</strong>
            <ul>
              <li>PNG: Best for web, fast download</li>
              <li>SVG: Scalable, ideal for presentations</li>
              <li>PDF: Professional reports, printing</li>
            </ul>
          </div>
        </div>

        <div className="export-dialog-footer">
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
            disabled={
              isExporting ||
              !filename ||
              (format === ExportFormats.SVG && !echartsInstance)
            }
          >
            {isExporting ? `Exporting... ${progress}%` : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
