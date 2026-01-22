import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { createDefaultChartConfig, ChartTypes } from '../utils/chartConfig';
import ChartTypeSelector from './ChartTypeSelector';
import DataMappingPanel from './DataMappingPanel';
import AggregationControls from './AggregationControls';
import ColorScaleConfig from './ColorScaleConfig';
import TooltipConfig from './TooltipConfig';
import EChartsRenderer from './EChartsRenderer';
import InteractiveChartsContainer from './InteractiveChartsContainer';
import PresentationMode from './PresentationMode';
import PresentationBuilder from './PresentationBuilder';
import { usePresentationStore } from '../utils/presentationUtils';
import ExportDialog from './ExportDialog';
import DashboardExport from './DashboardExport';

/**
 * VisualizationBuilder - Main component for building interactive visualizations
 */

const BuilderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 200px);
  padding: 20px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  border-radius: 8px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  max-height: calc(100vh - 200px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#f3f4f6'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.border || '#d1d5db'};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme?.colors?.text || '#1f2937'};
    }
  }
`;

const ChartAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  overflow-y: auto;
  max-height: calc(100vh - 200px);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#f3f4f6'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.border || '#d1d5db'};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme?.colors?.text || '#1f2937'};
    }
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: ${props => props.theme?.colors?.border || '#e0e0e0'};
  margin: 8px 0;
`;

const ToolbarContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  border-radius: 6px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
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
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
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

const ChartTitleInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme?.colors?.border || '#d1d5db'};
  border-radius: 4px;
  font-size: 13px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TabbedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.isActive
    ? (props.theme?.colors?.primary || '#3b82f6')
    : 'transparent'};
  color: ${props => props.isActive
    ? (props.theme?.colors?.primary || '#3b82f6')
    : (props.theme?.colors?.textSecondary || '#6b7280')};
  font-size: 13px;
  font-weight: ${props => props.isActive ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }
`;

const TabContent = styled.div`
  display: ${props => props.isActive ? 'block' : 'none'};
`;

/**
 * VisualizationBuilder Component
 * 
 * @param {array} data - Data to visualize
 * @param {object} theme - Theme configuration
 * @param {function} onConfigChange - Callback when configuration changes
 */
const VisualizationBuilder = ({
  data = [],
  theme = {},
  onConfigChange,
}) => {
  const [config, setConfig] = useState(() => 
    createDefaultChartConfig(ChartTypes.BAR)
  );
  const [activeTab, setActiveTab] = useState('type');
  const [viewMode, setViewMode] = useState('single'); // 'single', 'multi', 'presentation', or 'present'
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDashboardExport, setShowDashboardExport] = useState(false);
  const chartContainerRef = useRef(null);
  const echartsInstanceRef = useRef(null);

  const { isPresenting, startPresentation, endPresentation } = usePresentationStore();

  // Handle presentation mode
  const handleEnterPresentationBuilder = () => {
    setViewMode('presentation');
  };

  const handleStartPresentation = () => {
    startPresentation();
    setViewMode('present');
  };

  const handleExitPresentation = () => {
    endPresentation();
    setViewMode('single');
  };

  // Handle configuration changes
  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  }, [onConfigChange]);

  // Update chart title
  const handleTitleChange = (e) => {
    const newConfig = {
      ...config,
      title: e.target.value,
    };
    handleConfigChange(newConfig);
  };

  // Change chart type
  const handleChartTypeChange = (type) => {
    const newConfig = createDefaultChartConfig(type);
    // Preserve data mapping if compatible
    handleConfigChange(newConfig);
    setActiveTab('mapping');
  };

  // Export configuration
  const handleExportConfig = () => {
    const json = JSON.stringify(config, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(json));
    element.setAttribute('download', `chart-config-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('Reset chart to default configuration?')) {
      const newConfig = createDefaultChartConfig(ChartTypes.BAR);
      handleConfigChange(newConfig);
    }
  };

  // Handle export chart
  const handleExportChart = () => {
    setShowExportDialog(true);
  };

  // Handle dashboard export
  const handleDashboardExport = () => {
    setShowDashboardExport(true);
  };

  const tabs = [
    { id: 'type', label: 'Chart Type', icon: '📊' },
    { id: 'mapping', label: 'Data Mapping', icon: '🗂️' },
    { id: 'aggregation', label: 'Aggregation', icon: '📈' },
    { id: 'color', label: 'Color & Tooltip', icon: '🎨' },
  ];

  return (
    <BuilderContainer theme={theme}>
      {/* Sidebar Controls */}
      <SidebarContainer theme={theme}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '6px',
            color: theme?.colors?.text || '#1f2937',
          }}>
            View Mode
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <Button
              variant={viewMode === 'single' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('single')}
              style={{ width: '100%' }}
            >
              📊 Single Chart
            </Button>
            <Button
              variant={viewMode === 'multi' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('multi')}
              style={{ width: '100%' }}
            >
              📈 Multi-Chart Interactive
            </Button>
            <Button
              variant={viewMode === 'presentation' ? 'primary' : 'secondary'}
              onClick={handleEnterPresentationBuilder}
              style={{ width: '100%' }}
            >
              🎬 Presentation Mode
            </Button>
          </div>
        </div>

        {viewMode === 'single' && (
          <>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '6px',
                color: theme?.colors?.text || '#1f2937',
              }}>
                Chart Title
              </label>
              <ChartTitleInput
                type="text"
                value={config.title}
                onChange={handleTitleChange}
                placeholder="Enter chart title..."
                theme={theme}
              />
            </div>

            <SectionDivider theme={theme} />

            <TabbedContent>
              <TabButtons theme={theme}>
                {tabs.map(tab => (
                  <TabButton
                    key={tab.id}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    theme={theme}
                  >
                    {tab.icon} {tab.label}
                  </TabButton>
                ))}
              </TabButtons>

          <TabContent isActive={activeTab === 'type'}>
            <ChartTypeSelector
              selectedType={config.type}
              onChange={handleChartTypeChange}
              theme={theme}
            />
          </TabContent>

          <TabContent isActive={activeTab === 'mapping'}>
            <DataMappingPanel
              config={config}
              onChange={handleConfigChange}
              data={data}
              chartType={config.type}
              theme={theme}
            />
          </TabContent>

          <TabContent isActive={activeTab === 'aggregation'}>
            <AggregationControls
              config={config}
              onChange={handleConfigChange}
              dataMapping={config.dataMapping}
              chartType={config.type}
              theme={theme}
            />
          </TabContent>

          <TabContent isActive={activeTab === 'color'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ColorScaleConfig
                config={config}
                onChange={handleConfigChange}
                theme={theme}
              />
              <SectionDivider theme={theme} />
              <TooltipConfig
                config={config}
                onChange={handleConfigChange}
                theme={theme}
              />
            </div>
          </TabContent>
        </TabbedContent>

        <SectionDivider theme={theme} />

        <ToolbarContainer theme={theme}>
          <Button
            variant="primary"
            onClick={() => {}}
            disabled
            title="Save configuration (coming soon)"
          >
            💾 Save
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportConfig}
            title="Download configuration as JSON"
          >
            ⬇️ Export Config
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportChart}
            title="Export chart as PNG, SVG, or PDF"
          >
            📥 Export Chart
          </Button>
          {viewMode === 'multi' && (
            <Button
              variant="secondary"
              onClick={handleDashboardExport}
              title="Export all charts as PDF report"
            >
              📋 Export Dashboard
            </Button>
          )}
          <Button
            variant="danger"
            onClick={handleReset}
            title="Reset to default configuration"
          >
            ↺ Reset
          </Button>
        </ToolbarContainer>
          </>
        )}

        {viewMode === 'multi' && (
          <div style={{
            padding: '16px',
            background: '#f0f9ff',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#0c4a6e',
            lineHeight: '1.6',
          }}>
            <strong>📊 Multi-Chart Interactive Mode</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li><strong>Cross-Filtering:</strong> Click data points to filter other charts</li>
              <li><strong>Brushing:</strong> Select regions on scatter plots</li>
              <li><strong>Hover Sync:</strong> Highlight related data across charts</li>
              <li><strong>Smooth Transitions:</strong> Animated data updates</li>
            </ul>
            <div style={{ marginTop: '12px', padding: '8px', background: 'white', borderRadius: '4px' }}>
              ℹ️ <strong>Tip:</strong> Enable options in the control panel above charts to customize interactions.
            </div>
          </div>
        )}

        {viewMode === 'presentation' && (
          <div style={{
            padding: '16px',
            background: '#fef3c7',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#78350f',
            lineHeight: '1.6',
          }}>
            <strong>🎬 Executive Presentation Mode</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li><strong>Fullscreen:</strong> Immersive presentation experience</li>
              <li><strong>Step-Based:</strong> Guide audience through insights</li>
              <li><strong>Annotations:</strong> Highlight key points visually</li>
              <li><strong>Keyboard:</strong> Arrow keys, space, and shortcuts</li>
            </ul>
            <div style={{ marginTop: '12px', padding: '8px', background: 'white', borderRadius: '4px' }}>
              💡 <strong>Tip:</strong> Build slides below, then click "Present" to start fullscreen mode.
            </div>
          </div>
        )}
      </SidebarContainer>

      {/* Chart Display Area */}
      <ChartAreaContainer theme={theme} ref={chartContainerRef}>
        {viewMode === 'present' ? (
          <PresentationMode
            data={data}
            onExit={handleExitPresentation}
          />
        ) : viewMode === 'presentation' ? (
          <PresentationBuilder
            data={data}
            onStartPresentation={handleStartPresentation}
          />
        ) : data.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            height: '400px',
            color: theme?.colors?.textSecondary || '#6b7280',
            fontSize: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px' }}>📊</div>
            <strong>No data available</strong>
            <div>Upload a CSV, JSON, or TXT file to get started</div>
          </div>
        ) : viewMode === 'single' ? (
          <EChartsRenderer
            config={config}
            data={data}
            theme={theme}
            title={config.title}
            onInstanceReady={(instance) => {
              echartsInstanceRef.current = instance;
            }}
          />
        ) : (
          <InteractiveChartsContainer
            data={data}
            initialCharts={[
              createDefaultChartConfig(ChartTypes.BAR),
              createDefaultChartConfig(ChartTypes.SCATTER),
            ]}
            theme={theme}
            defaultLayout="2x1"
          />
        )}
      </ChartAreaContainer>

      {/* Export Dialogs */}
      {showExportDialog && (
        <ExportDialog
          chartElement={chartContainerRef.current}
          echartsInstance={echartsInstanceRef.current}
          title={`Export: ${config.title || 'Chart'}`}
          onClose={() => setShowExportDialog(false)}
          exportType="chart"
        />
      )}

      {showDashboardExport && (
        <DashboardExport
          chartElements={chartContainerRef.current ? [chartContainerRef.current] : []}
          title="Dashboard Report"
          onClose={() => setShowDashboardExport(false)}
        />
      )}
    </BuilderContainer>
  );
};

export default VisualizationBuilder;

