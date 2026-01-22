/**
 * Chart Configuration Types and Constants
 */

export const ChartTypes = {
  // Basic charts
  BAR: 'bar',
  LINE: 'line',
  AREA: 'area',
  SCATTER: 'scatter',
  PIE: 'pie',
  DONUT: 'donut',
  
  // Advanced charts
  HEATMAP: 'heatmap',
  TREEMAP: 'treemap',
  SUNBURST: 'sunburst',
  GAUGE: 'gauge',
  FUNNEL: 'funnel',
  SANKEY: 'sankey',
  BOXPLOT: 'boxplot',
  HISTOGRAM: 'histogram',
};

export const ChartTypeMetadata = {
  [ChartTypes.BAR]: {
    name: 'Bar Chart',
    icon: '📊',
    description: 'Compare values across categories',
    requiresX: true,
    requiresY: true,
    supportsSeries: true,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.LINE]: {
    name: 'Line Chart',
    icon: '📈',
    description: 'Show trends over time or categories',
    requiresX: true,
    requiresY: true,
    supportsSeries: true,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.AREA]: {
    name: 'Area Chart',
    icon: '📉',
    description: 'Display cumulative trends',
    requiresX: true,
    requiresY: true,
    supportsSeries: true,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.SCATTER]: {
    name: 'Scatter Plot',
    icon: '🎯',
    description: 'Analyze relationships between variables',
    requiresX: true,
    requiresY: true,
    supportsSeries: true,
    supportsAggregation: false,
    supportsColorScale: true,
  },
  [ChartTypes.PIE]: {
    name: 'Pie Chart',
    icon: '🥧',
    description: 'Show parts of a whole',
    requiresX: true,
    requiresY: false,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.DONUT]: {
    name: 'Donut Chart',
    icon: '⭕',
    description: 'Show parts of a whole with center space',
    requiresX: true,
    requiresY: false,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.HEATMAP]: {
    name: 'Heatmap',
    icon: '🔥',
    description: 'Display values in a grid with color intensity',
    requiresX: true,
    requiresY: true,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: true,
  },
  [ChartTypes.TREEMAP]: {
    name: 'Treemap',
    icon: '🌳',
    description: 'Hierarchical data with rectangles',
    requiresX: true,
    requiresY: false,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: true,
  },
  [ChartTypes.SUNBURST]: {
    name: 'Sunburst',
    icon: '☀️',
    description: 'Hierarchical data in circular layout',
    requiresX: true,
    requiresY: false,
    supportsSeries: false,
    supportsAggregation: false,
    supportsColorScale: true,
  },
  [ChartTypes.GAUGE]: {
    name: 'Gauge Chart',
    icon: '🎚️',
    description: 'Show single metric against a scale',
    requiresX: false,
    requiresY: true,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.FUNNEL]: {
    name: 'Funnel Chart',
    icon: '🔻',
    description: 'Show progression through stages',
    requiresX: true,
    requiresY: true,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: false,
  },
  [ChartTypes.SANKEY]: {
    name: 'Sankey Diagram',
    icon: '🔀',
    description: 'Show flow between nodes',
    requiresX: true,
    requiresY: true,
    supportsSeries: false,
    supportsAggregation: false,
    supportsColorScale: false,
  },
  [ChartTypes.BOXPLOT]: {
    name: 'Box Plot',
    icon: '📦',
    description: 'Show distribution and outliers',
    requiresX: true,
    requiresY: true,
    supportsSeries: true,
    supportsAggregation: false,
    supportsColorScale: false,
  },
  [ChartTypes.HISTOGRAM]: {
    name: 'Histogram',
    icon: '📊',
    description: 'Show distribution of values',
    requiresX: true,
    requiresY: false,
    supportsSeries: false,
    supportsAggregation: true,
    supportsColorScale: false,
  },
};

export const AggregationFunctions = {
  SUM: 'sum',
  AVG: 'average',
  COUNT: 'count',
  MIN: 'min',
  MAX: 'max',
  MEDIAN: 'median',
  STDDEV: 'stdDev',
  DISTINCT: 'distinctCount',
  FIRST: 'first',
  LAST: 'last',
};

export const AggregationMetadata = {
  [AggregationFunctions.SUM]: { name: 'Sum', symbol: '∑', numeric: true },
  [AggregationFunctions.AVG]: { name: 'Average', symbol: 'avg', numeric: true },
  [AggregationFunctions.COUNT]: { name: 'Count', symbol: '#', numeric: true },
  [AggregationFunctions.MIN]: { name: 'Minimum', symbol: 'min', numeric: true },
  [AggregationFunctions.MAX]: { name: 'Maximum', symbol: 'max', numeric: true },
  [AggregationFunctions.MEDIAN]: { name: 'Median', symbol: 'med', numeric: true },
  [AggregationFunctions.STDDEV]: { name: 'Std Dev', symbol: 'σ', numeric: true },
  [AggregationFunctions.DISTINCT]: { name: 'Distinct Count', symbol: 'D', numeric: true },
  [AggregationFunctions.FIRST]: { name: 'First', symbol: '|→', numeric: false },
  [AggregationFunctions.LAST]: { name: 'Last', symbol: '→|', numeric: false },
};

export const ColorScales = {
  // Sequential
  BLUES: 'blues',
  GREENS: 'greens',
  REDS: 'reds',
  GREYS: 'greys',
  PURPLES: 'purples',
  
  // Diverging
  RED_BLUE: 'red-blue',
  COOL_WARM: 'cool-warm',
  
  // Categorical
  CATEGORY: 'category',
  DARK: 'dark',
  LIGHT: 'light',
  PASTEL: 'pastel',
  VIBRANT: 'vibrant',
};

export const ColorScaleMetadata = {
  [ColorScales.BLUES]: { name: 'Blues (Sequential)', colors: ['#f7fbff', '#08519c'] },
  [ColorScales.GREENS]: { name: 'Greens (Sequential)', colors: ['#f7fcf5', '#00441b'] },
  [ColorScales.REDS]: { name: 'Reds (Sequential)', colors: ['#fff5f0', '#67000d'] },
  [ColorScales.GREYS]: { name: 'Greys (Sequential)', colors: ['#ffffff', '#000000'] },
  [ColorScales.PURPLES]: { name: 'Purples (Sequential)', colors: ['#fcf0f5', '#49006a'] },
  [ColorScales.RED_BLUE]: { name: 'Red-Blue (Diverging)', colors: ['#d73027', '#4575b4'] },
  [ColorScales.COOL_WARM]: { name: 'Cool-Warm (Diverging)', colors: ['#3b4cc0', '#f7f7f7', '#b40426'] },
  [ColorScales.CATEGORY]: { name: 'Category (Categorical)', colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'] },
  [ColorScales.DARK]: { name: 'Dark (Categorical)', colors: ['#1a1a1a', '#333333', '#666666', '#999999'] },
  [ColorScales.LIGHT]: { name: 'Light (Categorical)', colors: ['#e6e6e6', '#cccccc', '#b3b3b3', '#999999'] },
  [ColorScales.PASTEL]: { name: 'Pastel (Categorical)', colors: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4'] },
  [ColorScales.VIBRANT]: { name: 'Vibrant (Categorical)', colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'] },
};

export const TooltipTrigger = {
  ITEM: 'item',
  AXIS: 'axis',
  NONE: 'none',
};

export const TooltipTriggerMetadata = {
  [TooltipTrigger.ITEM]: 'Hover individual items',
  [TooltipTrigger.AXIS]: 'Hover on axis',
  [TooltipTrigger.NONE]: 'No tooltip',
};

/**
 * Default chart configuration
 */
export const createDefaultChartConfig = (chartType = ChartTypes.BAR) => ({
  type: chartType,
  title: 'Untitled Chart',
  description: '',
  dataMapping: {
    x: null,
    y: null,
    series: null,
    size: null,
    color: null,
  },
  aggregation: {
    xAgg: AggregationFunctions.FIRST,
    yAgg: AggregationFunctions.SUM,
    enabled: true,
  },
  colorScale: {
    type: ColorScales.CATEGORY,
    reverse: false,
    min: null,
    max: null,
  },
  tooltip: {
    trigger: TooltipTrigger.ITEM,
    formatter: null,
    showSeriesName: true,
    showValue: true,
    showPercent: false,
  },
  filters: [],
  sorting: {
    enabled: false,
    field: null,
    direction: 'asc', // 'asc' or 'desc'
  },
  legend: {
    show: true,
    orient: 'bottom', // 'top', 'right', 'bottom', 'left'
    align: 'center',
  },
  grid: {
    top: 60,
    right: 40,
    bottom: 60,
    left: 60,
  },
});

/**
 * Validate chart configuration
 */
export const validateChartConfig = (config) => {
  const errors = [];
  const warnings = [];

  if (!config.type || !ChartTypeMetadata[config.type]) {
    errors.push('Invalid chart type');
  }

  const metadata = ChartTypeMetadata[config.type];

  if (metadata?.requiresX && !config.dataMapping.x) {
    errors.push(`Chart type requires X-axis mapping`);
  }

  if (metadata?.requiresY && !config.dataMapping.y) {
    errors.push(`Chart type requires Y-axis mapping`);
  }

  if (!config.title || config.title.trim().length === 0) {
    warnings.push('Chart has no title');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Get list of available chart types
 */
export const getAvailableChartTypes = (filterByCapability = null) => {
  return Object.entries(ChartTypeMetadata)
    .filter(([_, metadata]) => {
      if (!filterByCapability) return true;
      if (filterByCapability === 'numeric' && metadata.supportsAggregation) return true;
      if (filterByCapability === 'colorScale' && metadata.supportsColorScale) return true;
      if (filterByCapability === 'series' && metadata.supportsSeries) return true;
      return false;
    })
    .map(([type, metadata]) => ({
      type,
      ...metadata,
    }));
};
