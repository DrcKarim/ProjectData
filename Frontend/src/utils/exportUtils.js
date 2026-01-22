/**
 * Export Utilities
 * Export charts and dashboards to PNG, SVG, PDF with high quality
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export options configuration
 */
export const ExportFormats = {
  PNG: 'png',
  SVG: 'svg',
  PDF: 'pdf',
};

export const ExportResolutions = {
  LOW: { dpi: 72, label: 'Low (72 DPI) - Smaller file' },
  MEDIUM: { dpi: 150, label: 'Medium (150 DPI) - Balanced' },
  HIGH: { dpi: 300, label: 'High (300 DPI) - Print quality' },
  ULTRA: { dpi: 600, label: 'Ultra (600 DPI) - Best quality' },
};

/**
 * Export a single chart to PNG
 * @param {HTMLElement} chartElement - The chart DOM element
 * @param {Object} options - Export options
 * @returns {Promise<Blob>}
 */
export async function exportChartAsPNG(chartElement, options = {}) {
  const {
    filename = 'chart.png',
    resolution = ExportResolutions.HIGH.dpi,
    backgroundColor = '#ffffff',
    scale = resolution / 72, // Convert DPI to scale factor
    quality = 0.95,
  } = options;

  try {
    // Create canvas from DOM element
    const canvas = await html2canvas(chartElement, {
      scale,
      backgroundColor,
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 10000,
    });

    // Convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        quality
      );
    });
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
    throw error;
  }
}

/**
 * Export a chart as SVG (using ECharts native SVG rendering)
 * @param {Object} echartsInstance - ECharts instance
 * @param {Object} options - Export options
 * @returns {Promise<string>}
 */
export async function exportChartAsSVG(echartsInstance, options = {}) {
  const { filename = 'chart.svg' } = options;

  try {
    // Get SVG from ECharts
    const svg = echartsInstance.getDataURL({
      type: 'svg',
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    // Extract SVG content (remove data URI prefix)
    const svgContent = svg.replace(/^data:image\/svg\+xml;base64,/, '');
    const decodedSVG = atob(svgContent);

    return new Blob([decodedSVG], { type: 'image/svg+xml' });
  } catch (error) {
    console.error('Failed to export chart as SVG:', error);
    throw error;
  }
}

/**
 * Export a chart as PDF
 * @param {HTMLElement} chartElement - The chart DOM element
 * @param {Object} options - Export options
 * @returns {Promise<Blob>}
 */
export async function exportChartAsPDF(chartElement, options = {}) {
  const {
    filename = 'chart.pdf',
    title = '',
    resolution = ExportResolutions.HIGH.dpi,
    orientation = 'landscape',
    pageSize = 'a4',
  } = options;

  try {
    // Create canvas from chart element
    const scale = resolution / 72;
    const canvas = await html2canvas(chartElement, {
      scale,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize,
      compress: true,
    });

    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Calculate image dimensions to fit page
    const maxWidth = pdfWidth - margin * 2;
    const maxHeight = pdfHeight - margin * 2 - (title ? 15 : 0);

    // Calculate aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const aspectRatio = imgWidth / imgHeight;

    let finalWidth, finalHeight;
    if (maxWidth / maxHeight < aspectRatio) {
      // Width is the limiting factor
      finalWidth = maxWidth;
      finalHeight = maxWidth / aspectRatio;
    } else {
      // Height is the limiting factor
      finalHeight = maxHeight;
      finalWidth = maxHeight * aspectRatio;
    }

    // Add title if provided
    let yPos = margin;
    if (title) {
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text(title, margin, yPos);
      yPos += 15;
    }

    // Add chart image
    const imgData = canvas.toDataURL('image/png');
    const xPos = (pdfWidth - finalWidth) / 2;
    pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight);

    // Add metadata
    pdf.setProperties({
      title: title || 'Chart Export',
      subject: 'Data Visualization Export',
      author: 'Data Visualization System',
      keywords: ['chart', 'export', 'data'],
      creator: 'Data Visualization System',
    });

    return new Promise((resolve) => {
      pdf.output('blob').then((blob) => {
        resolve(blob);
      });
    });
  } catch (error) {
    console.error('Failed to export chart as PDF:', error);
    throw error;
  }
}

/**
 * Export dashboard (multiple charts) as PDF
 * @param {Array<HTMLElement>} chartElements - Array of chart DOM elements
 * @param {Object} options - Export options
 * @returns {Promise<Blob>}
 */
export async function exportDashboardAsPDF(chartElements, options = {}) {
  const {
    filename = 'dashboard.pdf',
    title = 'Dashboard Report',
    subtitle = '',
    author = '',
    resolution = ExportResolutions.HIGH.dpi,
    orientation = 'landscape',
    pageSize = 'a4',
    includeTimestamp = true,
    chartsPerPage = 1, // 1 or 2
  } = options;

  try {
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize,
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Add title page
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text(title, margin, margin + 20);

    if (subtitle) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'normal');
      pdf.text(subtitle, margin, margin + 35);
    }

    if (author) {
      pdf.setFontSize(10);
      pdf.text(`Author: ${author}`, margin, margin + 50);
    }

    if (includeTimestamp) {
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(10);
      pdf.text(`Generated: ${timestamp}`, margin, pdfHeight - margin - 10);
    }

    let isFirstPage = true;
    let pageChartCount = 0;

    // Add each chart
    for (let i = 0; i < chartElements.length; i++) {
      const chartElement = chartElements[i];

      // Check if new page needed
      if (pageChartCount >= chartsPerPage && pageChartCount > 0) {
        pdf.addPage();
        pageChartCount = 0;
      } else if (!isFirstPage && pageChartCount === 0) {
        // Skip title page on first iteration
      }

      if (pageChartCount === 0 && !isFirstPage) {
        isFirstPage = false;
      }

      // Add new page after title page
      if (isFirstPage && i === 0) {
        pdf.addPage();
        isFirstPage = false;
      }

      // Convert chart to canvas
      const scale = resolution / 72;
      const canvas = await html2canvas(chartElement, {
        scale,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Calculate dimensions
      const maxWidth = pdfWidth - margin * 2;
      const maxHeight = chartsPerPage === 1
        ? pdfHeight - margin * 2 - 20
        : (pdfHeight - margin * 3) / 2;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;

      let finalWidth, finalHeight;
      if (maxWidth / maxHeight < aspectRatio) {
        finalWidth = maxWidth;
        finalHeight = maxWidth / aspectRatio;
      } else {
        finalHeight = maxHeight;
        finalWidth = maxHeight * aspectRatio;
      }

      // Position image
      const xPos = (pdfWidth - finalWidth) / 2;
      let yPos = margin;

      if (chartsPerPage === 2 && pageChartCount === 1) {
        yPos += maxHeight + margin;
      }

      // Add image
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight);

      pageChartCount++;
    }

    // Add metadata
    pdf.setProperties({
      title,
      subject: subtitle || 'Dashboard Export',
      author: author || 'Data Visualization System',
      keywords: ['dashboard', 'report', 'data'],
      creator: 'Data Visualization System',
    });

    return new Promise((resolve) => {
      pdf.output('blob').then((blob) => {
        resolve(blob);
      });
    });
  } catch (error) {
    console.error('Failed to export dashboard as PDF:', error);
    throw error;
  }
}

/**
 * Download blob as file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get timestamp for filenames
 */
export function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}`;
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9_\-. ]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 255);
}

/**
 * Export configuration (for saving export settings)
 */
export const DefaultExportConfig = {
  format: ExportFormats.PNG,
  resolution: 300,
  filename: 'export',
  backgroundColor: '#ffffff',
  includeTitle: true,
  includeTimestamp: true,
};

/**
 * Get file extension for format
 */
export function getFileExtension(format) {
  const extensions = {
    [ExportFormats.PNG]: 'png',
    [ExportFormats.SVG]: 'svg',
    [ExportFormats.PDF]: 'pdf',
  };
  return extensions[format] || 'png';
}

/**
 * Calculate file size estimate (in KB)
 */
export function estimateFileSize(format, width, height) {
  switch (format) {
    case ExportFormats.PNG:
      // Rough estimate: (width * height * 4 bytes per pixel) / 1024
      return Math.round((width * height * 4) / 1024);

    case ExportFormats.SVG:
      // SVG is text-based, roughly 50KB base + 100 bytes per element
      return Math.round(50 + (width * height) / 10000);

    case ExportFormats.PDF:
      // PDF is compressed, roughly 100KB base + 50KB per page
      return Math.round(100 + (width * height * 50) / 100000);

    default:
      return 0;
  }
}

/**
 * Export presentation as PDF
 * @param {Array<Slide>} slides - Presentation slides
 * @param {Object} options - Export options
 * @returns {Promise<Blob>}
 */
export async function exportPresentationAsPDF(slides, options = {}) {
  const {
    filename = 'presentation.pdf',
    title = 'Presentation',
    resolution = ExportResolutions.HIGH.dpi,
    includeNotes = false,
  } = options;

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Add title page
    pdf.setFontSize(28);
    pdf.setFont(undefined, 'bold');
    pdf.text(title, margin, pdfHeight / 2 - 20);

    if (includeNotes) {
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Slides: ${slides.length}`, margin, pdfHeight / 2 + 20);
    }

    let isFirstPage = true;

    // Add slides
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      if (isFirstPage) {
        pdf.addPage();
        isFirstPage = false;
      } else {
        pdf.addPage();
      }

      // Add slide title
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${i + 1}. ${slide.title || 'Slide'}`, margin, margin + 10);

      // Add slide subtitle if exists
      if (slide.subtitle) {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(slide.subtitle, margin, margin + 20);
      }

      // Add speaker notes if requested
      if (includeNotes && slide.notes) {
        const noteText = `Notes: ${slide.notes}`;
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'italic');
        const splitText = pdf.splitTextToSize(
          noteText,
          pdfWidth - margin * 2
        );
        pdf.text(splitText, margin, pdfHeight - margin - 20);
      }
    }

    return new Promise((resolve) => {
      pdf.output('blob').then((blob) => {
        resolve(blob);
      });
    });
  } catch (error) {
    console.error('Failed to export presentation as PDF:', error);
    throw error;
  }
}
