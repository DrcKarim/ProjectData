import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import InteractiveEChartsRenderer from './InteractiveEChartsRenderer';
import { useInteractionStore, PerformanceMonitor } from '../utils/chartInteractions';
import { createDefaultChartConfig, ChartTypes } from '../utils/chartConfig';

/**
 * InteractiveChartsContainer - Manage multiple linked charts with interactions
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  border-radius: 8px;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  align-items: center;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' && `
    background: ${props.theme?.colors?.primary || '#3b82f6'};
    color: white;

    &:hover {
      background: ${props.theme?.colors?.primaryDark || '#1d4ed8'};
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${props.theme?.colors?.backgroundSecondary || '#f3f4f6'};
    color: ${props.theme?.colors?.text || '#1f2937'};
    border: 1px solid ${props.theme?.colors?.border || '#d1d5db'};

    &:hover {
      background: ${props.theme?.colors?.border || '#e5e7eb'};
    }
  `}

  ${props => props.variant === 'danger' && `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;

    &:hover {
      background: #fecaca;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 12px;
  flex: 1;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 16px;
  font-size: 12px;
  color: #1e40af;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
  display: flex;
  align-items: center;

  &:hover {
    color: #991b1b;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => {
    switch (props.layout) {
      case '1x1': return '1fr';
      case '2x1': return 'repeat(2, 1fr)';
      case '3x1': return 'repeat(3, 1fr)';
      case '2x2': return 'repeat(2, 1fr)';
      default: return 'repeat(auto-fit, minmax(500px, 1fr))';
    }
  }};
  gap: 20px;
  
  ${props => props.layout === '2x2' && `
    grid-template-rows: repeat(2, 1fr);
  `}

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const PerformanceInfo = styled.div`
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  background: #f0f9ff;
  border-radius: 6px;
  font-size: 11px;
  color: #0c4a6e;
`;

const Stat = styled.div`
  display: flex;
  gap: 4px;
  
  strong {
    font-weight: 600;
  }
`;

const AddChartButton = styled(Button)`
  align-self: flex-start;
`;

/**
 * InteractiveChartsContainer Component
 * 
 * @param {array} data - Data to visualize
 * @param {array} initialCharts - Initial chart configurations
 * @param {object} theme - Theme configuration
 * @param {string} defaultLayout - Default grid layout ('1x1', '2x1', '3x1', '2x2')
 */
const InteractiveChartsContainer = ({
  data = [],
  initialCharts = [],
  theme = {},
  defaultLayout = '2x1',
}) => {
  const [charts, setCharts] = useState(() => {
    if (initialCharts.length > 0) {
      return initialCharts.map((chart, index) => ({
        id: `chart-${index}`,
        config: chart,
      }));
    }
    
    // Default: create 2 charts
    return [
      {
        id: 'chart-0',
        config: createDefaultChartConfig(ChartTypes.BAR),
      },
      {
        id: 'chart-1',
        config: createDefaultChartConfig(ChartTypes.LINE),
      },
    ];
  });

  const [enableCrossFiltering, setEnableCrossFiltering] = useState(true);
  const [enableBrushing, setEnableBrushing] = useState(true);
  const [enableHoverSync, setEnableHoverSync] = useState(true);
  const [layout, setLayout] = useState(defaultLayout);
  const [showPerformance, setShowPerformance] = useState(false);

  const performanceMonitor = useMemo(() => new PerformanceMonitor(), []);

  // Get interaction state
  const {
    activeFilters,
    removeFilter,
    clearAllFilters,
    linkCharts,
  } = useInteractionStore();

  // Link all charts together
  React.useEffect(() => {
    linkCharts(charts.map(c => c.id));
  }, [charts, linkCharts]);

  // Get all active filters across all charts
  const allActiveFilters = useMemo(() => {
    const filters = [];
    Object.entries(activeFilters).forEach(([chartId, chartFilters]) => {
      chartFilters.forEach(filter => {
        filters.push({
          ...filter,
          chartId,
        });
      });
    });
    return filters;
  }, [activeFilters]);

  // Add new chart
  const handleAddChart = useCallback(() => {
    const newChart = {
      id: `chart-${charts.length}`,
      config: createDefaultChartConfig(ChartTypes.SCATTER),
    };
    setCharts([...charts, newChart]);
  }, [charts]);

  // Remove chart
  const handleRemoveChart = useCallback((chartId) => {
    setCharts(charts.filter(c => c.id !== chartId));
  }, [charts]);

  // Update chart configuration
  const handleChartConfigChange = useCallback((chartId, newConfig) => {
    setCharts(charts.map(chart => 
      chart.id === chartId ? { ...chart, config: newConfig } : chart
    ));
  }, [charts]);

  // Remove specific filter
  const handleRemoveFilter = useCallback((chartId, filterId) => {
    removeFilter(chartId, filterId);
  }, [removeFilter]);

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  // Toggle cross-filtering
  const handleToggleCrossFiltering = useCallback(() => {
    setEnableCrossFiltering(!enableCrossFiltering);
    if (!enableCrossFiltering) {
      clearAllFilters();
    }
  }, [enableCrossFiltering, clearAllFilters]);

  return (
    <Container theme={theme}>
      {/* Control Panel */}
      <ControlPanel theme={theme}>
        <ControlGroup>
          <Label theme={theme}>
            <Checkbox
              type="checkbox"
              checked={enableCrossFiltering}
              onChange={handleToggleCrossFiltering}
            />
            Cross-Filtering
          </Label>
        </ControlGroup>

        <ControlGroup>
          <Label theme={theme}>
            <Checkbox
              type="checkbox"
              checked={enableBrushing}
              onChange={() => setEnableBrushing(!enableBrushing)}
            />
            Brushing
          </Label>
        </ControlGroup>

        <ControlGroup>
          <Label theme={theme}>
            <Checkbox
              type="checkbox"
              checked={enableHoverSync}
              onChange={() => setEnableHoverSync(!enableHoverSync)}
            />
            Hover Sync
          </Label>
        </ControlGroup>

        <ControlGroup>
          <Label theme={theme}>Layout:</Label>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              fontSize: '12px',
            }}
          >
            <option value="1x1">1 Column</option>
            <option value="2x1">2 Columns</option>
            <option value="3x1">3 Columns</option>
            <option value="2x2">2x2 Grid</option>
          </select>
        </ControlGroup>

        <ControlGroup>
          <Label theme={theme}>
            <Checkbox
              type="checkbox"
              checked={showPerformance}
              onChange={() => setShowPerformance(!showPerformance)}
            />
            Performance
          </Label>
        </ControlGroup>

        {allActiveFilters.length > 0 && (
          <>
            <div style={{
              height: '24px',
              width: '1px',
              background: '#e0e0e0',
              margin: '0 8px',
            }} />
            
            <FilterList>
              {allActiveFilters.map((filter) => (
                <FilterChip key={filter.id}>
                  {filter.label}
                  <RemoveButton
                    onClick={() => handleRemoveFilter(filter.chartId, filter.id)}
                    title="Remove filter"
                  >
                    ×
                  </RemoveButton>
                </FilterChip>
              ))}
            </FilterList>

            <Button
              variant="danger"
              onClick={handleClearAllFilters}
            >
              Clear All Filters
            </Button>
          </>
        )}
      </ControlPanel>

      {/* Performance Info */}
      {showPerformance && (
        <PerformanceInfo>
          <Stat>
            <strong>Charts:</strong> {charts.length}
          </Stat>
          <Stat>
            <strong>Data Points:</strong> {data.length}
          </Stat>
          <Stat>
            <strong>Active Filters:</strong> {allActiveFilters.length}
          </Stat>
          <Stat>
            <strong>Cross-Filtering:</strong> {enableCrossFiltering ? 'ON' : 'OFF'}
          </Stat>
          <Stat>
            <strong>Hover Sync:</strong> {enableHoverSync ? 'ON' : 'OFF'}
          </Stat>
        </PerformanceInfo>
      )}

      {/* Charts Grid */}
      <ChartsGrid layout={layout}>
        {charts.map((chart) => (
          <ChartCard key={chart.id} theme={theme}>
            <InteractiveEChartsRenderer
              chartId={chart.id}
              config={chart.config}
              data={data}
              theme={theme}
              enableCrossFiltering={enableCrossFiltering}
              enableBrushing={enableBrushing && chart.config.type === ChartTypes.SCATTER}
              enableHoverSync={enableHoverSync}
              linkedChartIds={charts.map(c => c.id)}
            />
          </ChartCard>
        ))}
      </ChartsGrid>

      {/* Add Chart Button */}
      {charts.length < 6 && (
        <AddChartButton
          variant="primary"
          onClick={handleAddChart}
        >
          + Add Chart
        </AddChartButton>
      )}
    </Container>
  );
};

export default InteractiveChartsContainer;
