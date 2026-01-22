/**
 * Data Parser Utilities
 * Handles parsing of CSV, JSON, and TXT files
 */

/**
 * Detect file type from filename or content
 */
export const detectFileType = (filename) => {
  const ext = filename.toLowerCase().split('.').pop();
  const supportedTypes = ['csv', 'json', 'txt', 'tsv', 'xlsx'];
  
  if (supportedTypes.includes(ext)) {
    return ext;
  }
  throw new Error(`Unsupported file type: .${ext}`);
};

/**
 * Parse CSV content into array of objects
 */
export const parseCSV = (content) => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must have headers and at least one row');
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data = lines.slice(1)
    .filter(line => line.trim().length > 0)
    .map((line, index) => {
      try {
        const values = parseCSVLine(line);
        
        // Ensure same number of columns
        const row = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      } catch (e) {
        console.warn(`Warning: Row ${index + 2} skipped due to parsing error`);
        return null;
      }
    })
    .filter(row => row !== null);

  if (data.length === 0) {
    throw new Error('No valid rows found in CSV file');
  }

  return { headers, data };
};

/**
 * Parse a single CSV line handling quoted fields
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  
  return result;
};

/**
 * Parse TSV content (tab-separated values)
 */
export const parseTSV = (content) => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('TSV file must have headers and at least one row');
  }

  const headers = lines[0].split('\t').map(h => h.trim());
  
  const data = lines.slice(1)
    .filter(line => line.trim().length > 0)
    .map((line, index) => {
      try {
        const values = line.split('\t').map(v => v.trim());
        const row = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      } catch (e) {
        console.warn(`Warning: Row ${index + 2} skipped due to parsing error`);
        return null;
      }
    })
    .filter(row => row !== null);

  if (data.length === 0) {
    throw new Error('No valid rows found in TSV file');
  }

  return { headers, data };
};

/**
 * Parse JSON content
 */
export const parseJSON = (content) => {
  try {
    const parsed = JSON.parse(content);
    
    // Check if it's an array
    if (!Array.isArray(parsed)) {
      throw new Error('JSON must be an array of objects');
    }

    if (parsed.length === 0) {
      throw new Error('JSON array is empty');
    }

    // Extract headers from first object
    const headers = Object.keys(parsed[0]);
    
    if (headers.length === 0) {
      throw new Error('JSON objects have no properties');
    }

    // Normalize all objects to have same keys
    const data = parsed.map((obj, index) => {
      if (typeof obj !== 'object' || obj === null) {
        throw new Error(`Row ${index + 1} is not an object`);
      }
      
      const row = {};
      headers.forEach(header => {
        row[header] = obj[header] !== undefined ? String(obj[header]) : '';
      });
      return row;
    });

    return { headers, data };
  } catch (e) {
    if (e.message.includes('JSON')) {
      throw e;
    }
    throw new Error(`Invalid JSON: ${e.message}`);
  }
};

/**
 * Parse TXT file (plain text or line-delimited)
 */
export const parseTXT = (content) => {
  const lines = content.trim().split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('TXT file is empty');
  }

  // If looks like structured data (tab or comma separated)
  if (lines[0].includes('\t')) {
    return parseTSV(content);
  }
  
  if (lines[0].includes(',')) {
    return parseCSV(content);
  }

  // Otherwise treat as document text
  const data = lines.map((line, index) => ({
    line_number: index + 1,
    text: line,
  }));

  return { 
    headers: ['line_number', 'text'], 
    data 
  };
};

/**
 * Main parser function - routes to appropriate parser
 */
export const parseFile = async (file) => {
  try {
    const fileType = detectFileType(file.name);
    const content = await file.text();

    if (content.trim().length === 0) {
      throw new Error('File is empty');
    }

    let result;
    
    switch (fileType) {
      case 'csv':
        result = parseCSV(content);
        break;
      case 'tsv':
        result = parseTSV(content);
        break;
      case 'json':
        result = parseJSON(content);
        break;
      case 'txt':
        result = parseTXT(content);
        break;
      case 'xlsx':
        throw new Error('XLSX files require backend processing');
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    return {
      ...result,
      fileType,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (e) {
    throw new Error(`Failed to parse file: ${e.message}`);
  }
};

/**
 * Validate parsed data
 */
export const validateData = (parsed) => {
  const errors = [];
  const warnings = [];

  if (!parsed.data || !Array.isArray(parsed.data)) {
    errors.push('Invalid data format');
  }

  if (parsed.data.length === 0) {
    errors.push('No data rows found');
  }

  if (!parsed.headers || parsed.headers.length === 0) {
    errors.push('No headers found');
  }

  // Check for duplicate headers
  const headerSet = new Set(parsed.headers);
  if (headerSet.size !== parsed.headers.length) {
    warnings.push('Duplicate column headers detected');
  }

  // Check for empty headers
  if (parsed.headers.some(h => h.trim().length === 0)) {
    warnings.push('Empty or whitespace-only column headers found');
  }

  return { errors, warnings, isValid: errors.length === 0 };
};
