/**
 * Chart Interactions State Manager
 * Manages cross-filtering, brushing, linking, and hover synchronization
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * Interaction types
 */
export const InteractionTypes = {
  HOVER: 'hover',
  BRUSH: 'brush',
  CLICK: 'click',
  FILTER: 'filter',
};

/**
 * Create interaction store using Zustand
 */
export const useInteractionStore = create(
  subscribeWithSelector((set, get) => ({
    // Active interactions state
    activeHover: null,           // { chartId, dataPoint, field, value }
    activeBrush: null,           // { chartId, selection, field, range }
    activeFilters: {},           // { chartId: [filters] }
    linkedCharts: [],            // Array of chart IDs that are linked
    
    // Hover synchronization
    setActiveHover: (hoverData) => {
      set({ activeHover: hoverData });
    },
    
    clearActiveHover: () => {
      set({ activeHover: null });
    },
    
    // Brush selection
    setActiveBrush: (brushData) => {
      set({ activeBrush: brushData });
    },
    
    clearActiveBrush: () => {
      set({ activeBrush: null });
    },
    
    // Filter management
    addFilter: (chartId, filter) => {
      const { activeFilters } = get();
      const chartFilters = activeFilters[chartId] || [];
      
      set({
        activeFilters: {
          ...activeFilters,
          [chartId]: [...chartFilters, filter],
        },
      });
    },
    
    removeFilter: (chartId, filterId) => {
      const { activeFilters } = get();
      const chartFilters = activeFilters[chartId] || [];
      
      set({
        activeFilters: {
          ...activeFilters,
          [chartId]: chartFilters.filter(f => f.id !== filterId),
        },
      });
    },
    
    clearFilters: (chartId) => {
      const { activeFilters } = get();
      const newFilters = { ...activeFilters };
      delete newFilters[chartId];
      
      set({ activeFilters: newFilters });
    },
    
    clearAllFilters: () => {
      set({ activeFilters: {} });
    },
    
    // Chart linking
    linkCharts: (chartIds) => {
      set({ linkedCharts: chartIds });
    },
    
    unlinkCharts: () => {
      set({ linkedCharts: [] });
    },
    
    // Get all active filters
    getAllFilters: () => {
      const { activeFilters } = get();
      return Object.values(activeFilters).flat();
    },
    
    // Get filters for specific chart
    getChartFilters: (chartId) => {
      const { activeFilters } = get();
      return activeFilters[chartId] || [];
    },
  }))
);

/**
 * Apply cross-filters to data
 */
export const applyCrossFilters = (data, filters, excludeChartId = null) => {
  if (!filters || filters.length === 0) return data;
  
  return data.filter(row => {
    return filters.every(filter => {
      // Skip filters from the source chart
      if (filter.chartId === excludeChartId) return true;
      
      const value = row[filter.field];
      
      switch (filter.type) {
        case 'equals':
          return value === filter.value;
        
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        
        case 'range':
          const numValue = Number(value);
          return numValue >= filter.min && numValue <= filter.max;
        
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        
        default:
          return true;
      }
    });
  });
};

/**
 * Check if data point matches hover criteria
 */
export const matchesHoverCriteria = (dataPoint, hoverData, field) => {
  if (!hoverData || !field) return false;
  
  // Match by field value
  if (hoverData.field === field) {
    return dataPoint[field] === hoverData.value;
  }
  
  // Match by related fields
  if (hoverData.relatedFields && hoverData.relatedFields[field]) {
    return dataPoint[field] === hoverData.relatedFields[field];
  }
  
  return false;
};

/**
 * Check if data point is within brush selection
 */
export const isInBrushSelection = (dataPoint, brushData, xField, yField) => {
  if (!brushData || !brushData.selection) return false;
  
  const { selection } = brushData;
  
  // Handle 1D brush (single axis)
  if (selection.field === xField || selection.field === yField) {
    const value = Number(dataPoint[selection.field]);
    return value >= selection.min && value <= selection.max;
  }
  
  // Handle 2D brush (rectangular selection)
  if (selection.xField && selection.yField) {
    const xValue = Number(dataPoint[selection.xField]);
    const yValue = Number(dataPoint[selection.yField]);
    
    return (
      xValue >= selection.xMin &&
      xValue <= selection.xMax &&
      yValue >= selection.yMin &&
      yValue <= selection.yMax
    );
  }
  
  return false;
};

/**
 * Create filter from click event
 */
export const createClickFilter = (chartId, dataPoint, field) => {
  return {
    id: `${chartId}-${field}-${Date.now()}`,
    chartId,
    field,
    type: 'equals',
    value: dataPoint[field],
    label: `${field} = ${dataPoint[field]}`,
  };
};

/**
 * Create filter from brush selection
 */
export const createBrushFilter = (chartId, selection, field) => {
  if (selection.min !== undefined && selection.max !== undefined) {
    return {
      id: `${chartId}-${field}-${Date.now()}`,
      chartId,
      field,
      type: 'range',
      min: selection.min,
      max: selection.max,
      label: `${field}: ${selection.min.toFixed(2)} - ${selection.max.toFixed(2)}`,
    };
  }
  
  if (Array.isArray(selection.values)) {
    return {
      id: `${chartId}-${field}-${Date.now()}`,
      chartId,
      field,
      type: 'in',
      value: selection.values,
      label: `${field} in [${selection.values.join(', ')}]`,
    };
  }
  
  return null;
};

/**
 * Debounce function for performance
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Calculate linked field mappings between charts
 */
export const calculateFieldMappings = (charts) => {
  const mappings = {};
  
  charts.forEach((chart, index) => {
    const chartId = chart.id;
    mappings[chartId] = {};
    
    // Find common fields with other charts
    charts.forEach((otherChart, otherIndex) => {
      if (index === otherIndex) return;
      
      const otherChartId = otherChart.id;
      const commonFields = findCommonFields(
        chart.config.dataMapping,
        otherChart.config.dataMapping
      );
      
      if (commonFields.length > 0) {
        mappings[chartId][otherChartId] = commonFields;
      }
    });
  });
  
  return mappings;
};

/**
 * Find common fields between two data mappings
 */
const findCommonFields = (mapping1, mapping2) => {
  const fields1 = Object.values(mapping1).filter(Boolean);
  const fields2 = Object.values(mapping2).filter(Boolean);
  
  return fields1.filter(field => fields2.includes(field));
};

/**
 * Animation configuration presets
 */
export const AnimationPresets = {
  FAST: {
    duration: 200,
    easing: 'cubicOut',
  },
  NORMAL: {
    duration: 400,
    easing: 'cubicInOut',
  },
  SLOW: {
    duration: 600,
    easing: 'elasticOut',
  },
  SMOOTH: {
    duration: 300,
    easing: 'quadInOut',
  },
};

/**
 * Generate ECharts animation configuration
 */
export const getAnimationConfig = (preset = 'NORMAL') => {
  const config = AnimationPresets[preset] || AnimationPresets.NORMAL;
  
  return {
    animation: true,
    animationDuration: config.duration,
    animationEasing: config.easing,
    animationThreshold: 2000,
    animationDelay: 0,
    animationDurationUpdate: config.duration,
    animationEasingUpdate: config.easing,
    animationDelayUpdate: 0,
  };
};

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTime: [],
      interactionTime: [],
      dataProcessingTime: [],
    };
  }
  
  startMeasure(label) {
    return performance.now();
  }
  
  endMeasure(label, startTime) {
    const duration = performance.now() - startTime;
    
    if (this.metrics[label]) {
      this.metrics[label].push(duration);
      
      // Keep only last 100 measurements
      if (this.metrics[label].length > 100) {
        this.metrics[label].shift();
      }
    }
    
    return duration;
  }
  
  getAverageTime(label) {
    const times = this.metrics[label];
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  getMetrics() {
    return {
      avgRenderTime: this.getAverageTime('renderTime'),
      avgInteractionTime: this.getAverageTime('interactionTime'),
      avgDataProcessingTime: this.getAverageTime('dataProcessingTime'),
    };
  }
}

/**
 * Data sampling for large datasets
 */
export const sampleData = (data, maxSize = 5000, method = 'systematic') => {
  if (data.length <= maxSize) return data;
  
  switch (method) {
    case 'random':
      // Random sampling
      return data
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .slice(0, maxSize)
        .map(({ item }) => item);
    
    case 'systematic':
      // Systematic sampling (every nth item)
      const step = Math.floor(data.length / maxSize);
      return data.filter((_, index) => index % step === 0).slice(0, maxSize);
    
    case 'stratified':
      // Stratified sampling (preserve distribution)
      // Implementation depends on field - using systematic as fallback
      return data.filter((_, index) => index % Math.floor(data.length / maxSize) === 0);
    
    default:
      return data.slice(0, maxSize);
  }
};

/**
 * Memoization for expensive calculations
 */
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

export default {
  useInteractionStore,
  applyCrossFilters,
  matchesHoverCriteria,
  isInBrushSelection,
  createClickFilter,
  createBrushFilter,
  debounce,
  throttle,
  calculateFieldMappings,
  AnimationPresets,
  getAnimationConfig,
  PerformanceMonitor,
  sampleData,
  memoize,
};
