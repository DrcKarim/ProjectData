import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import * as echarts from 'echarts';
import { transformForChart } from '../utils/chartAggregation';
import { ChartTypes, ColorScaleMetadata } from '../utils/chartConfig';
import {
  useInteractionStore,
  matchesHoverCriteria,
  isInBrushSelection,
  createClickFilter,
  createBrushFilter,
  debounce,
  throttle,
  getAnimationConfig,
} from '../utils/chartInteractions';

/**
 * InteractiveEChartsRenderer - Enhanced chart with cross-filtering, brushing, and linking
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
`;

const ChartWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 2px solid ${props => props.isActive 
    ? (props.theme?.colors?.primary || '#3b82f6')
    : (props.theme?.colors?.border || '#e0e0e0')};
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  ${props => props.isActive && `
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  `}

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }
`;

const ChartTitle = styled.div`
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
`;

const InteractionBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  display: flex;
  gap: 6px;
  z-index: 10;
`;

const Badge = styled.span`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${props => {
    switch (props.type) {
      case 'hover': return '#eff6ff';
      case 'brush': return '#fef3c7';
      case 'filter': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'hover': return '#1d4ed8';
      case 'brush': return '#92400e';
      case 'filter': return '#991b1b';
      default: return '#4b5563';
    }
  }};
  font-weight: 500;
`;

/**
 * InteractiveEChartsRenderer Component
 * 
 * @param {string} chartId - Unique chart identifier
 * @param {object} config - Chart configuration
 * @param {array} data - Chart data
 * @param {object} theme - Theme configuration
 * @param {boolean} enableCrossFiltering - Enable cross-filtering
 * @param {boolean} enableBrushing - Enable brushing
 * @param {boolean} enableHoverSync - Enable hover synchronization
 * @param {array} linkedChartIds - IDs of linked charts
 */
const InteractiveEChartsRenderer = ({
  chartId,
  config,
  data = [],
  theme = {},
  enableCrossFiltering = true,
  enableBrushing = true,
  enableHoverSync = true,
  linkedChartIds = [],
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const hoverDebounceRef = useRef(null);

  // Get interaction state
  const {
    activeHover,
    activeBrush,
    activeFilters,
    setActiveHover,
    clearActiveHover,
    setActiveBrush,
    addFilter,
    getAllFilters,
  } = useInteractionStore();

  const isActive = useMemo(() => {
    return (
      (activeHover && activeHover.chartId === chartId) ||
      (activeBrush && activeBrush.chartId === chartId) ||
      Object.keys(activeFilters).includes(chartId)
    );
  }, [activeHover, activeBrush, activeFilters, chartId]);

  // Apply cross-filters to data
  const filteredData = useMemo(() => {
    if (!enableCrossFiltering) return data;
    
    const allFilters = getAllFilters();
    if (allFilters.length === 0) return data;

    return data.filter(row => {
      return allFilters.every(filter => {
        // Don't apply filters from this chart
        if (filter.chartId === chartId) return true;

        const value = row[filter.field];
        
        switch (filter.type) {
          case 'equals':
            return value === filter.value;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
          case 'range':
            const numValue = Number(value);
            return numValue >= filter.min && numValue <= filter.max;
          default:
            return true;
        }
      });
    });
  }, [data, activeFilters, chartId, enableCrossFiltering, getAllFilters]);

  // Transform data based on configuration
  const transformedData = useMemo(() => {
    try {
      return transformForChart(filteredData, config);
    } catch (error) {
      console.error('Data transformation error:', error);
      return [];
    }
  }, [filteredData, config]);

  // Generate ECharts options with interaction support
  const chartOptions = useMemo(() => {
    if (!transformedData || transformedData.length === 0) return null;

    const mapping = config.dataMapping || {};
    const options = {
      ...getAnimationConfig('SMOOTH'),
      title: {
        show: false, // Use custom title overlay
      },
      tooltip: {
        trigger: config.tooltip?.trigger || 'item',
        backgroundColor: config.tooltip?.backgroundColor || 'rgba(50, 50, 50, 0.9)',
        textStyle: {
          color: config.tooltip?.textColor || '#ffffff',
        },
        confine: true,
        transitionDuration: 0.2,
      },
      legend: {
        show: config.legend?.show !== false,
        orient: config.legend?.orient || 'bottom',
        bottom: 10,
        textStyle: {
          fontSize: 11,
        },
      },
      grid: config.grid || { top: 40, right: 40, bottom: 60, left: 60 },
      xAxis: generateXAxis(config, transformedData, mapping),
      yAxis: generateYAxis(config, transformedData, mapping),
      series: generateSeries(config, transformedData, theme, {
        activeHover,
        activeBrush,
        chartId,
        enableHoverSync,
        enableBrushing,
      }),
      color: generateColorPalette(config.colorScale),
    };

    // Add brush component if enabled
    if (enableBrushing && config.type === ChartTypes.SCATTER) {
      options.brush = {
        toolbox: ['rect', 'polygon', 'clear'],
        xAxisIndex: 0,
        yAxisIndex: 0,
        brushStyle: {
          borderWidth: 2,
          color: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 0.8)',
        },
        throttleType: 'debounce',
        throttleDelay: 300,
      };

      options.toolbox = {
        feature: {
          brush: {
            type: ['rect', 'polygon', 'clear'],
          },
        },
      };
    }

    return options;
  }, [transformedData, config, theme, activeHover, activeBrush, chartId, enableHoverSync, enableBrushing]);

  // Handle chart click
  const handleChartClick = useCallback((params) => {
    if (!enableCrossFiltering) return;

    const dataPoint = transformedData[params.dataIndex];
    if (!dataPoint) return;

    const mapping = config.dataMapping;
    const primaryField = mapping.x || mapping.y;
    
    if (primaryField && dataPoint[primaryField]) {
      const filter = createClickFilter(chartId, dataPoint, primaryField);
      addFilter(chartId, filter);
    }
  }, [chartId, config, transformedData, enableCrossFiltering, addFilter]);

  // Handle chart hover
  const handleChartHover = useCallback(
    throttle((params) => {
      if (!enableHoverSync) return;

      if (params && params.dataIndex !== undefined) {
        const dataPoint = transformedData[params.dataIndex];
        if (!dataPoint) return;

        const mapping = config.dataMapping;
        const hoverData = {
          chartId,
          dataPoint,
          field: mapping.x || mapping.y,
          value: dataPoint[mapping.x || mapping.y],
          relatedFields: {},
        };

        // Add related field values
        Object.entries(mapping).forEach(([key, field]) => {
          if (field && dataPoint[field]) {
            hoverData.relatedFields[field] = dataPoint[field];
          }
        });

        setActiveHover(hoverData);
      }
    }, 100),
    [chartId, config, transformedData, enableHoverSync, setActiveHover]
  );

  // Handle mouse out
  const handleMouseOut = useCallback(() => {
    if (enableHoverSync) {
      clearActiveHover();
    }
  }, [enableHoverSync, clearActiveHover]);

  // Handle brush selection
  const handleBrushSelected = useCallback((params) => {
    if (!enableBrushing || !params.batch || params.batch.length === 0) return;

    const batch = params.batch[0];
    if (!batch.selected || batch.selected.length === 0) return;

    const selectedIndices = batch.selected[0].dataIndex;
    const selectedData = selectedIndices.map(index => transformedData[index]);

    const mapping = config.dataMapping;
    const field = mapping.y || mapping.x;

    if (field && selectedData.length > 0) {
      const values = selectedData.map(d => d[field]);
      const min = Math.min(...values.filter(v => !isNaN(v)));
      const max = Math.max(...values.filter(v => !isNaN(v)));

      const filter = createBrushFilter(chartId, { min, max }, field);
      if (filter) {
        addFilter(chartId, filter);
      }

      setActiveBrush({
        chartId,
        selection: { field, min, max },
      });
    }
  }, [chartId, config, transformedData, enableBrushing, addFilter, setActiveBrush]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartRef.current || !chartOptions) return;

    try {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current, null, {
          renderer: 'canvas',
          useDirtyRect: true,
        });

        // Register event listeners
        chartInstance.current.on('click', handleChartClick);
        chartInstance.current.on('mouseover', handleChartHover);
        chartInstance.current.on('mouseout', handleMouseOut);
        chartInstance.current.on('brushSelected', handleBrushSelected);
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
  }, [chartOptions, handleChartClick, handleChartHover, handleMouseOut, handleBrushSelected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.off('click', handleChartClick);
        chartInstance.current.off('mouseover', handleChartHover);
        chartInstance.current.off('mouseout', handleMouseOut);
        chartInstance.current.off('brushSelected', handleBrushSelected);
        chartInstance.current.dispose();
      }
    };
  }, []);

  // Get active interaction badges
  const activeInteractions = useMemo(() => {
    const badges = [];
    
    if (activeHover && enableHoverSync) {
      badges.push({ type: 'hover', label: 'Hover' });
    }
    
    if (activeBrush && enableBrushing) {
      badges.push({ type: 'brush', label: 'Brush' });
    }
    
    const chartFilters = activeFilters[chartId];
    if (chartFilters && chartFilters.length > 0) {
      badges.push({ type: 'filter', label: `${chartFilters.length} Filter${chartFilters.length > 1 ? 's' : ''}` });
    }
    
    return badges;
  }, [activeHover, activeBrush, activeFilters, chartId, enableHoverSync, enableBrushing]);

  return (
    <Container>
      <ChartWrapper 
        ref={chartRef} 
        theme={theme} 
        isActive={isActive}
      />
      
      {config.title && (
        <ChartTitle theme={theme}>
          {config.title}
        </ChartTitle>
      )}
      
      {activeInteractions.length > 0 && (
        <InteractionBadge>
          {activeInteractions.map((interaction, index) => (
            <Badge key={index} type={interaction.type}>
              {interaction.label}
            </Badge>
          ))}
        </InteractionBadge>
      )}
    </Container>
  );
};

// Helper functions for generating chart configuration

function generateXAxis(config, data, mapping) {
  const isCategory = [ChartTypes.BAR, ChartTypes.COLUMN].includes(config.type);

  if (isCategory && mapping.x) {
    const categories = [...new Set(data.map(d => d[mapping.x]))];
    return {
      type: 'category',
      data: categories,
      axisLabel: {
        fontSize: 11,
        rotate: categories.length > 10 ? 45 : 0,
      },
    };
  }

  if (mapping.x) {
    return {
      type: 'value',
      axisLabel: { fontSize: 11 },
    };
  }

  return { type: 'category' };
}

function generateYAxis(config, data, mapping) {
  if (mapping.y) {
    return {
      type: 'value',
      axisLabel: { fontSize: 11 },
    };
  }

  return { type: 'value' };
}

function generateSeries(config, data, theme, interactionState) {
  const mapping = config.dataMapping || {};
  const { activeHover, activeBrush, chartId, enableHoverSync, enableBrushing } = interactionState;

  const series = [];
  const seriesGroups = groupBySeries(data, mapping.series);

  Object.entries(seriesGroups).forEach(([seriesName, seriesData]) => {
    const seriesConfig = {
      name: seriesName,
      type: getEChartsType(config.type),
      data: seriesData.map((d, index) => {
        const xVal = mapping.x ? d[mapping.x] : index;
        const yVal = mapping.y ? Number(d[mapping.y]) : 0;
        
        // Calculate emphasis state
        let emphasis = {};
        let isHighlighted = false;

        // Check hover synchronization
        if (enableHoverSync && activeHover && activeHover.chartId !== chartId) {
          isHighlighted = matchesHoverCriteria(d, activeHover, mapping.x) ||
                         matchesHoverCriteria(d, activeHover, mapping.y);
        }

        // Check brush selection
        if (enableBrushing && activeBrush && activeBrush.chartId !== chartId) {
          isHighlighted = isHighlighted || isInBrushSelection(d, activeBrush, mapping.x, mapping.y);
        }

        return {
          value: mapping.x ? [xVal, yVal] : yVal,
          itemStyle: {
            opacity: isHighlighted ? 1 : (activeHover || activeBrush ? 0.3 : 1),
            borderWidth: isHighlighted ? 2 : 0,
            borderColor: theme?.colors?.primary || '#3b82f6',
          },
        };
      }),
      smooth: [ChartTypes.LINE, ChartTypes.AREA].includes(config.type),
      areaStyle: config.type === ChartTypes.AREA ? {} : undefined,
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 2,
        },
      },
    };

    series.push(seriesConfig);
  });

  return series;
}

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

function getEChartsType(chartType) {
  const mapping = {
    [ChartTypes.BAR]: 'bar',
    [ChartTypes.COLUMN]: 'bar',
    [ChartTypes.LINE]: 'line',
    [ChartTypes.AREA]: 'line',
    [ChartTypes.SCATTER]: 'scatter',
    [ChartTypes.PIE]: 'pie',
    [ChartTypes.DONUT]: 'pie',
  };
  return mapping[chartType] || 'bar';
}

function generateColorPalette(colorScaleConfig = {}) {
  const defaultPalette = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1',
  ];

  if (!colorScaleConfig) return defaultPalette;

  const metadata = ColorScaleMetadata[colorScaleConfig.type];
  if (!metadata || !metadata.colors) return defaultPalette;

  let colors = [...metadata.colors];
  if (colorScaleConfig.reverse) {
    colors = colors.reverse();
  }

  return colors;
}

export default InteractiveEChartsRenderer;
