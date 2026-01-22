/**
 * Schema Inference Utilities
 * Automatically detects data types and infers schema
 */

/**
 * Column data types
 */
export const DataTypes = {
  NUMERIC: 'numeric',
  INTEGER: 'integer',
  FLOAT: 'float',
  BOOLEAN: 'boolean',
  CATEGORICAL: 'categorical',
  TEMPORAL: 'temporal',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
  TEXT: 'text',
  URL: 'url',
  EMAIL: 'email',
  UNKNOWN: 'unknown',
};

/**
 * Regular expressions for pattern matching
 */
const PATTERNS = {
  integer: /^-?\d+$/,
  float: /^-?\d+\.?\d*([eE]-?\d+)?$|^-?\.\d+([eE]-?\d+)?$/,
  boolean: /^(true|false|yes|no|1|0|on|off)$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^(https?|ftp):\/\/[^\s]+$|^www\.[^\s]+$/i,
  date: /^\d{4}[-\/]\d{2}[-\/]\d{2}$|^\d{2}[-\/]\d{2}[-\/]\d{4}$/, // YYYY-MM-DD or DD/MM/YYYY
  datetime: /^\d{4}[-\/]\d{2}[-\/]\d{2}[T\s]\d{2}:\d{2}(:\d{2})?/,
  time: /^\d{2}:\d{2}(:\d{2})?$/,
  iso8601: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
};

/**
 * Infer data type of a single value
 */
export const inferValueType = (value) => {
  if (value === null || value === undefined) {
    return DataTypes.UNKNOWN;
  }

  const str = String(value).trim();

  if (str.length === 0) {
    return DataTypes.UNKNOWN;
  }

  // Check specific patterns in order
  if (PATTERNS.iso8601.test(str)) {
    return DataTypes.DATETIME;
  }

  if (PATTERNS.datetime.test(str)) {
    return DataTypes.DATETIME;
  }

  if (PATTERNS.date.test(str)) {
    return DataTypes.DATE;
  }

  if (PATTERNS.time.test(str)) {
    return DataTypes.TIME;
  }

  if (PATTERNS.email.test(str)) {
    return DataTypes.EMAIL;
  }

  if (PATTERNS.url.test(str)) {
    return DataTypes.URL;
  }

  if (PATTERNS.boolean.test(str)) {
    return DataTypes.BOOLEAN;
  }

  if (PATTERNS.integer.test(str)) {
    return DataTypes.INTEGER;
  }

  if (PATTERNS.float.test(str)) {
    return DataTypes.FLOAT;
  }

  return DataTypes.TEXT;
};

/**
 * Infer column type from sample values
 */
export const inferColumnType = (values, columnName = '') => {
  if (!values || values.length === 0) {
    return DataTypes.UNKNOWN;
  }

  // Filter out empty values
  const nonEmptyValues = values.filter(v => 
    v !== null && v !== undefined && String(v).trim().length > 0
  );

  if (nonEmptyValues.length === 0) {
    return DataTypes.UNKNOWN;
  }

  // Infer type of each non-empty value
  const types = nonEmptyValues.map(v => inferValueType(v));

  // Count type occurrences
  const typeCounts = {};
  types.forEach(type => {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Remove UNKNOWN from consideration if other types present
  const filteredTypes = types.filter(t => t !== DataTypes.UNKNOWN);
  
  if (filteredTypes.length === 0) {
    return DataTypes.UNKNOWN;
  }

  // Get the most common type
  let dominantType = filteredTypes[0];
  let maxCount = 0;

  Object.entries(typeCounts).forEach(([type, count]) => {
    if (type !== DataTypes.UNKNOWN && count > maxCount) {
      maxCount = count;
      dominantType = type;
    }
  });

  // Consolidate numeric types
  if (dominantType === DataTypes.FLOAT || dominantType === DataTypes.INTEGER) {
    // Check if all are integers
    const allIntegers = filteredTypes.every(t => t === DataTypes.INTEGER);
    return allIntegers ? DataTypes.INTEGER : DataTypes.FLOAT;
  }

  // Consolidate date types
  if ([DataTypes.DATE, DataTypes.DATETIME, DataTypes.TIME].includes(dominantType)) {
    return DataTypes.DATETIME;
  }

  return dominantType;
};

/**
 * Infer complete schema from data
 */
export const inferSchema = (headers, data, sampleSize = 100) => {
  if (!headers || headers.length === 0) {
    throw new Error('No headers provided');
  }

  if (!data || data.length === 0) {
    throw new Error('No data provided');
  }

  const schema = {};
  const sample = data.slice(0, sampleSize);

  headers.forEach(header => {
    const values = sample.map(row => row[header]);
    const dataType = inferColumnType(values, header);
    const uniqueCount = new Set(values.filter(v => v !== null && v !== undefined && String(v).trim().length > 0)).size;
    const nullCount = values.filter(v => v === null || v === undefined || String(v).trim().length === 0).length;

    schema[header] = {
      name: header,
      type: dataType,
      nullable: nullCount > 0,
      nullCount,
      uniqueCount,
      sampleSize: sample.length,
    };

    // Add additional properties based on type
    if (dataType === DataTypes.NUMERIC || dataType === DataTypes.INTEGER || dataType === DataTypes.FLOAT) {
      const numValues = values
        .map(v => {
          const num = Number(v);
          return isNaN(num) ? null : num;
        })
        .filter(v => v !== null);

      if (numValues.length > 0) {
        schema[header].min = Math.min(...numValues);
        schema[header].max = Math.max(...numValues);
        schema[header].mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
      }
    } else if (dataType === DataTypes.CATEGORICAL) {
      const categories = Array.from(new Set(
        values.filter(v => v !== null && v !== undefined && String(v).trim().length > 0)
      ));
      schema[header].categories = categories.slice(0, 100); // Limit to 100 unique values
      schema[header].categoriesCount = categories.length;
    }
  });

  return schema;
};

/**
 * Get display name for data type
 */
export const getTypeLabel = (dataType) => {
  const labels = {
    [DataTypes.NUMERIC]: 'Numeric',
    [DataTypes.INTEGER]: 'Integer',
    [DataTypes.FLOAT]: 'Float',
    [DataTypes.BOOLEAN]: 'Boolean',
    [DataTypes.CATEGORICAL]: 'Categorical',
    [DataTypes.TEMPORAL]: 'Temporal',
    [DataTypes.DATE]: 'Date',
    [DataTypes.DATETIME]: 'DateTime',
    [DataTypes.TIME]: 'Time',
    [DataTypes.TEXT]: 'Text',
    [DataTypes.URL]: 'URL',
    [DataTypes.EMAIL]: 'Email',
    [DataTypes.UNKNOWN]: 'Unknown',
  };

  return labels[dataType] || dataType;
};

/**
 * Get icon name for data type (for UI display)
 */
export const getTypeIcon = (dataType) => {
  const icons = {
    [DataTypes.NUMERIC]: '🔢',
    [DataTypes.INTEGER]: '#️⃣',
    [DataTypes.FLOAT]: '🔢',
    [DataTypes.BOOLEAN]: '✓',
    [DataTypes.CATEGORICAL]: '🏷️',
    [DataTypes.TEMPORAL]: '📅',
    [DataTypes.DATE]: '📅',
    [DataTypes.DATETIME]: '📅',
    [DataTypes.TIME]: '🕐',
    [DataTypes.TEXT]: '📝',
    [DataTypes.URL]: '🔗',
    [DataTypes.EMAIL]: '📧',
    [DataTypes.UNKNOWN]: '❓',
  };

  return icons[dataType] || '❓';
};

/**
 * Check if type is numeric
 */
export const isNumericType = (dataType) => {
  return [DataTypes.NUMERIC, DataTypes.INTEGER, DataTypes.FLOAT].includes(dataType);
};

/**
 * Check if type is temporal
 */
export const isTemporalType = (dataType) => {
  return [DataTypes.TEMPORAL, DataTypes.DATE, DataTypes.DATETIME, DataTypes.TIME].includes(dataType);
};

/**
 * Check if type is categorical
 */
export const isCategoricalType = (dataType) => {
  return [DataTypes.CATEGORICAL, DataTypes.BOOLEAN, DataTypes.TEXT, DataTypes.EMAIL, DataTypes.URL].includes(dataType);
};
