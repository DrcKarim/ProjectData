import React, { useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import * as echarts from 'echarts';
import { transformForChart, getColorValue, getColorFromScale } from '../utils/chartAggregation';
import { ChartTypes, ColorScaleMetadata } from '../utils/chartConfig';

/**
 * EChartsRenderer - Render charts using Apache ECharts
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 400px;
`;

const ChartWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  position: relative;
  overflow: hidden;
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  font-size: 14px;
  padding: 40px;
  text-align: center;

  strong {
    font-size: 16px;
    color: ${props => props.theme?.colors?.text || '#1f2937'};
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
  font-size: 13px;

  strong {
    color: #7f1d1d;
  }
`;

/**
 * EChartsRenderer Component
 * 
 * @param {object} config - Chart configuration
 * @param {array} data - Chart data
 * @param {object} theme - Theme configuration
 * @param {string} title - Chart title
 */
const EChartsRenderer = ({
  config,
  data = [],
  theme = {},
  title = 'Chart',
  onInstanceReady = null,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Transform data based on configuration
  const transformedData = useMemo(() => {
    try {
      return transformForChart(data, config);
    } catch (error) {
      console.error('Data transformation error:', error);
      return [];
    }
  }, [data, config]);

  // Generate ECharts options
  const chartOptions = useMemo(() => {
    try {
      if (!transformedData || transformedData.length === 0) {
        return null;
      }

      const mapping = config.dataMapping || {};
      const options = {
        title: {
          text: config.title || title,
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: theme?.colors?.text || '#1f2937',
          },
        },
        tooltip: generateTooltipConfig(config.tooltip),
        legend: generateLegendConfig(config.legend),
        grid: config.grid || { top: 60, right: 40, bottom: 60, left: 60 },
        xAxis: generateXAxisConfig(config.type, mapping.x, transformedData),
        yAxis: generateYAxisConfig(config.type, mapping.y, transformedData),
        series: generateSeriesConfig(config, transformedData, theme),
        color: generateColorPalette(config.colorScale),
        responsive: true,
        maintainAspectRatio: false,
      };

      return options;
    } catch (error) {
      console.error('Chart options generation error:', error);
      return null;
    }
  }, [transformedData, config, theme, title]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartRef.current || !chartOptions) return;

    try {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current, null, {
          renderer: 'canvas',
          useDirtyRect: true,
        });
        
        // Call onInstanceReady callback
        if (onInstanceReady) {
          onInstanceReady(chartInstance.current);
        }
      }

      chartInstance.current.setOption(chartOptions, true);

      // Handle window resize
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('ECharts initialization error:', error);
    }
  }, [chartOptions, onInstanceReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  if (!chartOptions) {
    return (
      <Container>
        <ChartWrapper theme={theme}>
          <NoDataMessage theme={theme}>
            <strong>Unable to render chart</strong>
            <div>Please ensure:</div>
            <div>• Data is available</div>
            <div>• X and Y axes are mapped</div>
            <div>• Chart type is selected</div>
          </NoDataMessage>
        </ChartWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ChartWrapper ref={chartRef} theme={theme} />
    </Container>
  );
};

/**
 * Generate tooltip configuration
 */
function generateTooltipConfig(tooltipConfig = {}) {
  return {
    trigger: tooltipConfig.trigger || 'item',
    backgroundColor: tooltipConfig.backgroundColor || 'rgba(50, 50, 50, 0.7)',
    textStyle: {
      color: tooltipConfig.textColor || '#ffffff',
      fontSize: 12,
    },
    borderColor: 'transparent',
    borderRadius: 4,
    padding: [8, 12],
    confine: true,
  };
}

/**
 * Generate legend configuration
 */
function generateLegendConfig(legendConfig = {}) {
  return {
    show: legendConfig.show !== false,
    orient: legendConfig.orient || 'bottom',
    bottom: legendConfig.bottom || 0,
    left: 'center',
    textStyle: {
      fontSize: 12,
    },
    icon: 'rect',
  };
}

/**
 * Generate X-Axis configuration
 */
function generateXAxisConfig(chartType, xField, data) {
  const isCategory = [ChartTypes.BAR, ChartTypes.COLUMN].includes(chartType);

  if (isCategory && xField) {
    const categories = [...new Set(data.map(d => d[xField]))];
    return {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 11,
        rotate: 45,
        interval: Math.max(0, Math.floor(categories.length / 10)),
      },
      axisTick: {
        alignWithLabel: true,
      },
    };
  }

  if (xField) {
    const values = data.map(d => Number(d[xField])).filter(v => !isNaN(v));
    return {
      type: 'value',
      axisLabel: { fontSize: 11 },
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  return { type: 'category' };
}

/**
 * Generate Y-Axis configuration
 */
function generateYAxisConfig(chartType, yField, data) {
  if (yField) {
    const values = data.map(d => Number(d[yField])).filter(v => !isNaN(v));
    if (values.length === 0) {
      return { type: 'value' };
    }

    return {
      type: 'value',
      axisLabel: { fontSize: 11 },
      min: 0,
      max: Math.max(...values) * 1.1,
    };
  }

  return { type: 'value' };
}

/**
 * Generate series configuration based on chart type
 */
function generateSeriesConfig(config, data, theme) {
  const mapping = config.dataMapping || {};
  const chartType = config.type;

  const series = [];

  // Group data by series if applicable
  const seriesGroups = groupBySeries(data, mapping.series);

  Object.entries(seriesGroups).forEach(([seriesName, seriesData]) => {
    const seriesConfig = {
      name: seriesName,
      type: getEChartsType(chartType),
      data: seriesData.map(d => {
        const xVal = mapping.x ? d[mapping.x] : null;
        const yVal = mapping.y ? Number(d[mapping.y]) : 0;
        return mapping.x ? [xVal, yVal] : yVal;
      }),
      smooth: [ChartTypes.LINE, ChartTypes.AREA].includes(chartType),
      areaStyle: chartType === ChartTypes.AREA ? {} : undefined,
      itemStyle: generateItemStyle(config, seriesData, theme),
    };

    // Add label for pie charts
    if ([ChartTypes.PIE, ChartTypes.DONUT].includes(chartType)) {
      seriesConfig.label = {
        show: true,
        position: 'outside',
        formatter: '{b}: {d}%',
      };
    }

    series.push(seriesConfig);
  });

  return series;
}

/**
 * Group data by series field
 */
function groupBySeries(data, seriesField) {
  if (!seriesField) {
    return { 'Data': data };
  }

  const grouped = {};
  data.forEach(row => {
    const key = String(row[seriesField] || 'Other');
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(row);
  });

  return grouped;
}

/**
 * Get ECharts type from chart configuration type
 */
function getEChartsType(chartType) {
  const mapping = {
    [ChartTypes.BAR]: 'bar',
    [ChartTypes.COLUMN]: 'bar',
    [ChartTypes.LINE]: 'line',
    [ChartTypes.AREA]: 'line',
    [ChartTypes.SCATTER]: 'scatter',
    [ChartTypes.PIE]: 'pie',
    [ChartTypes.DONUT]: 'pie',
    [ChartTypes.HEATMAP]: 'heatmap',
    [ChartTypes.TREEMAP]: 'treemap',
    [ChartTypes.SUNBURST]: 'sunburst',
    [ChartTypes.GAUGE]: 'gauge',
    [ChartTypes.FUNNEL]: 'funnel',
    [ChartTypes.SANKEY]: 'sankey',
  };
  return mapping[chartType] || 'bar';
}

/**
 * Generate item styling based on color scale
 */
function generateItemStyle(config, data, theme) {
  if (!config.colorScale || !config.dataMapping.color) {
    return {};
  }

  const colorField = config.dataMapping.color;
  const colorScaleType = config.colorScale.type;
  const colorScaleMetadata = ColorScaleMetadata[colorScaleType];

  if (!colorScaleMetadata) {
    return {};
  }

  return {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 0,
      colorStops: generateColorStops(colorScaleMetadata.colors || ['#cccccc']),
    },
  };
}

/**
 * Generate color stops for gradients
 */
function generateColorStops(colors) {
  return colors.map((color, index) => ({
    offset: index / (colors.length - 1),
    color: color,
  }));
}

/**
 * Generate color palette
 */
function generateColorPalette(colorScaleConfig = {}) {
  const defaultPalette = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1',
  ];

  if (!colorScaleConfig) {
    return defaultPalette;
  }

  const metadata = ColorScaleMetadata[colorScaleConfig.type];
  if (!metadata || !metadata.colors) {
    return defaultPalette;
  }

  let colors = [...metadata.colors];
  if (colorScaleConfig.reverse) {
    colors = colors.reverse();
  }

  // Extend palette if needed
  while (colors.length < 10) {
    colors.push(...metadata.colors);
  }

  return colors.slice(0, 10);
}

export default EChartsRenderer;
