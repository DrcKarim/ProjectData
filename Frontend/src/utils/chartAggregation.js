/**
 * Data Aggregation and Transformation Utilities
 */

import { AggregationFunctions } from './chartConfig';

/**
 * Apply aggregation function to array of values
 */
export const applyAggregation = (values, aggregationFunc) => {
  if (!Array.isArray(values) || values.length === 0) return 0;

  const numValues = values
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  switch (aggregationFunc) {
    case AggregationFunctions.SUM:
      return numValues.reduce((sum, val) => sum + val, 0);

    case AggregationFunctions.AVG:
      return numValues.length > 0 
        ? numValues.reduce((sum, val) => sum + val, 0) / numValues.length 
        : 0;

    case AggregationFunctions.COUNT:
      return values.length;

    case AggregationFunctions.MIN:
      return numValues.length > 0 ? Math.min(...numValues) : 0;

    case AggregationFunctions.MAX:
      return numValues.length > 0 ? Math.max(...numValues) : 0;

    case AggregationFunctions.MEDIAN: {
      const sorted = [...numValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    case AggregationFunctions.STDDEV: {
      if (numValues.length < 2) return 0;
      const mean = numValues.reduce((sum, val) => sum + val, 0) / numValues.length;
      const variance = numValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numValues.length;
      return Math.sqrt(variance);
    }

    case AggregationFunctions.DISTINCT:
      return new Set(values.map(v => String(v))).size;

    case AggregationFunctions.FIRST:
      return values[0] !== undefined ? values[0] : null;

    case AggregationFunctions.LAST:
      return values[values.length - 1] !== undefined ? values[values.length - 1] : null;

    default:
      return values.length;
  }
};

/**
 * Group data by one or more fields
 */
export const groupData = (data, groupByFields) => {
  const grouped = {};

  data.forEach(row => {
    const key = groupByFields.map(field => String(row[field] ?? '')).join('|');
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(row);
  });

  return grouped;
};

/**
 * Aggregate grouped data
 */
export const aggregateData = (data, groupByFields, aggregations) => {
  const grouped = groupData(data, groupByFields);
  const result = [];

  Object.entries(grouped).forEach(([key, rows]) => {
    const keyValues = key.split('|');
    const row = {};

    // Add grouping fields
    groupByFields.forEach((field, index) => {
      row[field] = keyValues[index];
    });

    // Add aggregations
    Object.entries(aggregations).forEach(([fieldName, aggFunc]) => {
      const values = rows.map(r => r[fieldName]);
      row[fieldName] = applyAggregation(values, aggFunc);
    });

    result.push(row);
  });

  return result;
};

/**
 * Transform data for chart visualization
 */
export const transformForChart = (data, config) => {
  let transformed = [...data];

  // Apply filters
  if (config.filters && config.filters.length > 0) {
    transformed = applyFilters(transformed, config.filters);
  }

  // Apply aggregation if needed
  if (config.aggregation?.enabled) {
    const groupByFields = [];
    if (config.dataMapping.x) groupByFields.push(config.dataMapping.x);
    if (config.dataMapping.series) groupByFields.push(config.dataMapping.series);

    if (groupByFields.length > 0) {
      const aggregations = {};
      if (config.dataMapping.y) {
        aggregations[config.dataMapping.y] = config.aggregation.yAgg || AggregationFunctions.SUM;
      }
      if (config.dataMapping.size) {
        aggregations[config.dataMapping.size] = AggregationFunctions.SUM;
      }

      transformed = aggregateData(transformed, groupByFields, aggregations);
    }
  }

  // Apply sorting
  if (config.sorting?.enabled && config.sorting.field) {
    transformed.sort((a, b) => {
      const aVal = a[config.sorting.field];
      const bVal = b[config.sorting.field];
      const compare = isNaN(aVal) 
        ? String(aVal).localeCompare(String(bVal))
        : Number(aVal) - Number(bVal);
      return config.sorting.direction === 'asc' ? compare : -compare;
    });
  }

  return transformed;
};

/**
 * Apply filters to data
 */
export const applyFilters = (data, filters) => {
  return data.filter(row => {
    return filters.every(filter => {
      const value = row[filter.field];
      
      switch (filter.operator) {
        case 'equals':
          return value == filter.value;
        case 'notEquals':
          return value != filter.value;
        case 'greaterThan':
          return Number(value) > Number(filter.value);
        case 'lessThan':
          return Number(value) < Number(filter.value);
        case 'greaterThanOrEqual':
          return Number(value) >= Number(filter.value);
        case 'lessThanOrEqual':
          return Number(value) <= Number(filter.value);
        case 'contains':
          return String(value).includes(String(filter.value));
        case 'notContains':
          return !String(value).includes(String(filter.value));
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        case 'notIn':
          return !Array.isArray(filter.value) || !filter.value.includes(value);
        case 'isEmpty':
          return value === null || value === undefined || String(value).trim() === '';
        case 'isNotEmpty':
          return value !== null && value !== undefined && String(value).trim() !== '';
        default:
          return true;
      }
    });
  });
};

/**
 * Calculate color value for data point
 */
export const getColorValue = (value, colorField, data) => {
  if (!colorField) return null;

  const values = data.map(d => {
    const v = Number(d[colorField]);
    return isNaN(v) ? null : v;
  }).filter(v => v !== null);

  if (values.length === 0) return null;

  return {
    value,
    min: Math.min(...values),
    max: Math.max(...values),
    normalized: (value - Math.min(...values)) / (Math.max(...values) - Math.min(...values)),
  };
};

/**
 * Generate color from scale
 */
export const getColorFromScale = (normalized, colorScale) => {
  if (normalized < 0 || normalized > 1 || isNaN(normalized)) {
    return '#cccccc';
  }

  // Simple color interpolation for sequential and diverging scales
  const colors = colorScale.colors || ['#f7fbff', '#08519c'];
  
  if (colors.length === 2) {
    // Linear interpolation between two colors
    const startColor = hexToRgb(colors[0]);
    const endColor = hexToRgb(colors[1]);

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalized);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalized);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalized);

    return rgbToHex(r, g, b);
  }

  if (colors.length === 3) {
    // Diverging scale (3 colors)
    if (normalized < 0.5) {
      // Interpolate between first and middle color
      const startColor = hexToRgb(colors[0]);
      const midColor = hexToRgb(colors[1]);
      const t = normalized * 2;

      const r = Math.round(startColor.r + (midColor.r - startColor.r) * t);
      const g = Math.round(startColor.g + (midColor.g - startColor.g) * t);
      const b = Math.round(startColor.b + (midColor.b - startColor.b) * t);

      return rgbToHex(r, g, b);
    } else {
      // Interpolate between middle and end color
      const midColor = hexToRgb(colors[1]);
      const endColor = hexToRgb(colors[2]);
      const t = (normalized - 0.5) * 2;

      const r = Math.round(midColor.r + (endColor.r - midColor.r) * t);
      const g = Math.round(midColor.g + (endColor.g - midColor.g) * t);
      const b = Math.round(midColor.b + (endColor.b - midColor.b) * t);

      return rgbToHex(r, g, b);
    }
  }

  return colors[0] || '#cccccc';
};

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 200, g: 200, b: 200 };
};

/**
 * Convert RGB to hex
 */
const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Get statistics for a numeric field
 */
export const getFieldStats = (data, field) => {
  const values = data
    .map(d => Number(d[field]))
    .filter(v => !isNaN(v));

  if (values.length === 0) {
    return null;
  }

  values.sort((a, b) => a - b);

  return {
    count: values.length,
    min: values[0],
    max: values[values.length - 1],
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    median: values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)],
    sum: values.reduce((a, b) => a + b, 0),
    stdDev: calculateStdDev(values),
  };
};

/**
 * Calculate standard deviation
 */
const calculateStdDev = (values) => {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Get unique values for a field
 */
export const getFieldUniqueValues = (data, field) => {
  return Array.from(new Set(data.map(d => d[field]))).sort();
};

/**
 * Get field suggestions for data
 */
export const getFieldSuggestions = (data, fieldType = 'all') => {
  if (!data || data.length === 0) return [];

  const firstRow = data[0];
  return Object.keys(firstRow).map(field => {
    const values = data.map(d => d[field]);
    const isNumeric = values.every(v => !isNaN(Number(v)) && v !== '' && v !== null);
    
    return {
      name: field,
      type: isNumeric ? 'numeric' : 'categorical',
      uniqueCount: new Set(values).size,
    };
  }).filter(f => {
    if (fieldType === 'numeric') return f.type === 'numeric';
    if (fieldType === 'categorical') return f.type === 'categorical';
    return true;
  });
};
