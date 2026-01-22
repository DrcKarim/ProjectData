/**
 * Data Profiling Utilities
 * Generates comprehensive data quality and statistical summaries
 */

import { isNumericType, isTemporalType, isCategoricalType } from './schemaInference';

/**
 * Calculate statistical summary for a numeric column
 */
const getNumericStats = (values) => {
  const numbers = values
    .map(v => Number(v))
    .filter(v => !isNaN(v) && v !== null && v !== undefined);

  if (numbers.length === 0) {
    return null;
  }

  numbers.sort((a, b) => a - b);

  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;
  const median = numbers.length % 2 === 0
    ? (numbers[numbers.length / 2 - 1] + numbers[numbers.length / 2]) / 2
    : numbers[Math.floor(numbers.length / 2)];

  // Calculate standard deviation
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  // Calculate quartiles
  const q1Index = Math.floor(numbers.length * 0.25);
  const q3Index = Math.floor(numbers.length * 0.75);

  return {
    count: numbers.length,
    min: numbers[0],
    max: numbers[numbers.length - 1],
    mean: parseFloat(mean.toFixed(4)),
    median: median,
    stdDev: parseFloat(stdDev.toFixed(4)),
    q1: numbers[q1Index],
    q3: numbers[q3Index],
    range: numbers[numbers.length - 1] - numbers[0],
  };
};

/**
 * Calculate frequency distribution for categorical data
 */
const getCategoricalStats = (values, limit = 10) => {
  const frequencies = {};

  values
    .filter(v => v !== null && v !== undefined && String(v).trim().length > 0)
    .forEach(v => {
      const key = String(v);
      frequencies[key] = (frequencies[key] || 0) + 1;
    });

  // Sort by frequency
  const sorted = Object.entries(frequencies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  return {
    uniqueCount: Object.keys(frequencies).length,
    topValues: sorted.map(([value, count]) => ({
      value,
      count,
      percentage: parseFloat((count / values.length * 100).toFixed(2)),
    })),
  };
};

/**
 * Calculate temporal range for date columns
 */
const getTemporalStats = (values) => {
  const dates = values
    .map(v => {
      try {
        const d = new Date(v);
        return d.getTime() ? d : null;
      } catch {
        return null;
      }
    })
    .filter(d => d !== null);

  if (dates.length === 0) {
    return null;
  }

  dates.sort((a, b) => a - b);

  return {
    count: dates.length,
    minDate: new Date(dates[0]).toISOString().split('T')[0],
    maxDate: new Date(dates[dates.length - 1]).toISOString().split('T')[0],
    spanDays: Math.floor((dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24)),
  };
};

/**
 * Generate comprehensive profile for a single column
 */
export const profileColumn = (columnName, values, dataType) => {
  const profile = {
    name: columnName,
    type: dataType,
    totalCount: values.length,
    nullCount: values.filter(v => v === null || v === undefined || String(v).trim().length === 0).length,
  };

  const nonNullValues = values.filter(v => v !== null && v !== undefined && String(v).trim().length > 0);
  profile.nonNullCount = nonNullValues.length;
  profile.nullPercentage = parseFloat(((profile.nullCount / values.length) * 100).toFixed(2));

  // Add type-specific stats
  if (isNumericType(dataType)) {
    profile.stats = getNumericStats(nonNullValues);
  } else if (isCategoricalType(dataType)) {
    profile.stats = getCategoricalStats(nonNullValues);
  } else if (isTemporalType(dataType)) {
    profile.stats = getTemporalStats(nonNullValues);
  }

  // Detect duplicates
  const uniqueCount = new Set(nonNullValues.map(v => String(v))).size;
  profile.uniqueCount = uniqueCount;
  profile.duplicatePercentage = parseFloat((((nonNullValues.length - uniqueCount) / nonNullValues.length) * 100).toFixed(2));

  return profile;
};

/**
 * Generate complete data profile
 */
export const profileData = (headers, data, schema) => {
  const profile = {
    summary: {
      totalRows: data.length,
      totalColumns: headers.length,
      timestamp: new Date().toISOString(),
    },
    columns: {},
    quality: {},
  };

  // Profile each column
  headers.forEach(header => {
    const columnData = data.map(row => row[header]);
    const columnSchema = schema[header];
    const columnType = columnSchema?.type || 'unknown';

    profile.columns[header] = profileColumn(header, columnData, columnType);
  });

  // Calculate overall data quality
  const totalCells = data.length * headers.length;
  let nullCells = 0;

  Object.values(profile.columns).forEach(col => {
    nullCells += col.nullCount;
  });

  const completenessScore = parseFloat((((totalCells - nullCells) / totalCells) * 100).toFixed(2));
  const validityScore = 95; // Placeholder - would validate based on schema constraints

  profile.quality = {
    completeness: completenessScore,
    validity: validityScore,
    overall: parseFloat((((completenessScore + validityScore) / 2)).toFixed(2)),
    issues: [],
  };

  // Detect quality issues
  const issues = [];

  headers.forEach(header => {
    const col = profile.columns[header];
    
    if (col.nullPercentage > 50) {
      issues.push({
        severity: 'warning',
        column: header,
        message: `${col.nullPercentage}% missing values`,
      });
    }

    if (col.duplicatePercentage > 80) {
      issues.push({
        severity: 'info',
        column: header,
        message: `${col.duplicatePercentage}% duplicate values`,
      });
    }

    if (isNumericType(col.type) && col.stats?.stdDev === 0) {
      issues.push({
        severity: 'info',
        column: header,
        message: 'Column has no variance (constant value)',
      });
    }
  });

  profile.quality.issues = issues;

  return profile;
};

/**
 * Generate human-readable summary
 */
export const generateProfileSummary = (profile) => {
  const summary = {
    overview: `Dataset with ${profile.summary.totalRows} rows and ${profile.summary.totalColumns} columns`,
    quality: `Data quality score: ${profile.quality.overall}% (${profile.quality.completeness}% complete)`,
    insights: [],
  };

  // Generate key insights
  const numericCols = Object.values(profile.columns).filter(c => isNumericType(c.type));
  const categoricalCols = Object.values(profile.columns).filter(c => isCategoricalType(c.type));
  const temporalCols = Object.values(profile.columns).filter(c => isTemporalType(c.type));

  if (numericCols.length > 0) {
    summary.insights.push(`${numericCols.length} numeric column(s)`);
  }

  if (categoricalCols.length > 0) {
    summary.insights.push(`${categoricalCols.length} categorical column(s)`);
  }

  if (temporalCols.length > 0) {
    summary.insights.push(`${temporalCols.length} temporal column(s)`);
  }

  // Check for missing data
  const colsWithMissing = Object.values(profile.columns).filter(c => c.nullCount > 0);
  if (colsWithMissing.length > 0) {
    summary.insights.push(`${colsWithMissing.length} column(s) with missing values`);
  }

  // Check for issues
  if (profile.quality.issues.length > 0) {
    summary.insights.push(`${profile.quality.issues.length} data quality issue(s) detected`);
  }

  return summary;
};

/**
 * Calculate memory usage estimate
 */
export const estimateDataSize = (data, headers) => {
  if (data.length === 0 || headers.length === 0) {
    return 0;
  }

  // Rough estimate: average string length per cell * number of cells
  let totalChars = 0;
  const sampleSize = Math.min(100, data.length);

  for (let i = 0; i < sampleSize; i++) {
    headers.forEach(header => {
      const value = data[i][header];
      totalChars += String(value || '').length;
    });
  }

  const avgCharsPerCell = totalChars / (sampleSize * headers.length);
  const estimatedChars = data.length * headers.length * avgCharsPerCell;
  const estimatedBytes = estimatedChars * 2; // Rough estimate for UTF-8

  return {
    bytes: estimatedBytes,
    kb: parseFloat((estimatedBytes / 1024).toFixed(2)),
    mb: parseFloat((estimatedBytes / (1024 * 1024)).toFixed(2)),
  };
};
