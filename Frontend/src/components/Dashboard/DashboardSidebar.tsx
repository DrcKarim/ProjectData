/**
 * DashboardSidebar.tsx
 * Left sidebar for data selection and chart configuration
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles';

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${p => p.theme.colors.background.secondary};
  color: ${p => p.theme.colors.text.primary};
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${p => p.theme.colors.border.default};
  background: ${p => p.theme.colors.background.primary};
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: ${p => p.theme.spacing.md};
  background: transparent;
  border: none;
  color: ${p =>
    p.active
      ? p.theme.colors.interactive.primary
      : p.theme.colors.text.secondary};
  font-weight: ${p =>
    p.active
      ? p.theme.typographyScale.label.fontWeight
      : p.theme.typographyScale.body2.fontWeight};
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  cursor: pointer;
  transition: ${p => p.theme.transition.color};
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;

  ${p =>
    p.active &&
    `
    border-bottom-color: ${p.theme.colors.interactive.primary};
    background: ${p.theme.colors.background.secondary};
  `}

  &:hover {
    color: ${p =>
      p.active
        ? p.theme.colors.interactive.primary
        : p.theme.colors.text.primary};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${p => p.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${p => p.theme.typographyScale.h6.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.h6.fontWeight};
  color: ${p => p.theme.colors.text.primary};
  margin: ${p => p.theme.spacing.md} 0 ${p => p.theme.spacing.sm} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${p => p.theme.colors.text.secondary};
`;

const DatasetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.sm};
`;

const DatasetItem = styled.button<{ active: boolean }>`
  padding: ${p => p.theme.spacing.md};
  background: ${p =>
    p.active
      ? p.theme.colors.interactive.primary + '10'
      : p.theme.colors.background.primary};
  border: 1px solid
    ${p =>
      p.active
        ? p.theme.colors.interactive.primary
        : p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  color: ${p =>
    p.active
      ? p.theme.colors.interactive.primary
      : p.theme.colors.text.primary};
  cursor: pointer;
  transition: ${p => p.theme.transition.default};
  text-align: left;
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;

  &:hover {
    background: ${p =>
      p.active
        ? p.theme.colors.interactive.primary + '15'
        : p.theme.colors.background.secondary};
    border-color: ${p => p.theme.colors.interactive.primary};
    box-shadow: ${p => p.theme.shadows.xs};
  }

  &:active {
    box-shadow: ${p => p.theme.shadows.sm};
  }
`;

const DatasetItemTitle = styled.div`
  font-weight: 500;
  margin-bottom: ${p => p.theme.spacing.xs};
`;

const DatasetItemMeta = styled.div`
  font-size: 11px;
  color: ${p => p.theme.colors.text.secondary};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${p => p.theme.spacing.md};
  padding: ${p => p.theme.spacing.md};
  background: ${p => p.theme.colors.background.primary};
  border-radius: ${p => p.theme.componentBorderRadius.card};
  border: 1px solid ${p => p.theme.colors.border.default};
`;

const Label = styled.label`
  display: block;
  font-size: ${p => p.theme.typographyScale.label.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.label.fontWeight};
  color: ${p => p.theme.colors.text.primary};
  margin-bottom: ${p => p.theme.spacing.sm};
`;

const SelectInput = styled.select`
  width: 100%;
  padding: ${p => p.theme.spacing.sm};
  background: ${p => p.theme.colors.background.secondary};
  border: 1px solid ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.input};
  color: ${p => p.theme.colors.text.primary};
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  cursor: pointer;
  transition: ${p => p.theme.transition.default};

  &:hover {
    border-color: ${p => p.theme.colors.interactive.primary};
  }

  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.interactive.primary};
    box-shadow: 0 0 0 3px ${p => p.theme.colors.interactive.primary}15;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.md};
  padding: ${p => p.theme.spacing.sm} 0;
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${p => p.theme.colors.interactive.primary};
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  color: ${p => p.theme.colors.text.primary};
  user-select: none;
`;

const ResetButton = styled.button`
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.md};
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  color: ${p => p.theme.colors.text.secondary};
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  cursor: pointer;
  transition: ${p => p.theme.transition.default};

  &:hover {
    border-color: ${p => p.theme.colors.semantic.warning};
    color: ${p => p.theme.colors.semantic.warning};
    background: ${p => p.theme.colors.semantic.warning}10;
  }

  &:active {
    background: ${p => p.theme.colors.semantic.warning}20;
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface Dataset {
  id: string;
  name: string;
  rowCount: number;
}

export interface DashboardSidebarProps {
  datasets?: Dataset[];
  activeDatasetId?: string;
  onDatasetChange?: (datasetId: string) => void;
  selectedTab?: 'data' | 'config';
  onTabChange?: (tab: 'data' | 'config') => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  datasets = [],
  activeDatasetId = '',
  onDatasetChange,
  selectedTab = 'data',
  onTabChange,
}) => {
  const { theme } = useTheme();

  const handleDatasetSelect = (datasetId: string) => {
    if (onDatasetChange) {
      onDatasetChange(datasetId);
    }
  };

  const handleTabChange = (tab: 'data' | 'config') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleReset = () => {
    // Reset all filters logic
  };

  return (
    <SidebarContainer>
      {/* Tab Navigation */}
      <TabBar>
        <Tab
          active={selectedTab === 'data'}
          onClick={() => handleTabChange('data')}
        >
          📊 Data
        </Tab>
        <Tab
          active={selectedTab === 'config'}
          onClick={() => handleTabChange('config')}
        >
          ⚙️ Config
        </Tab>
      </TabBar>

      {/* Tab Content */}
      <SidebarContent>
        {selectedTab === 'data' && (
          <>
            {/* Available Datasets */}
            <div>
              <SectionTitle>Datasets</SectionTitle>
              {datasets.length > 0 ? (
                <DatasetList>
                  {datasets.map(dataset => (
                    <DatasetItem
                      key={dataset.id}
                      active={dataset.id === activeDatasetId}
                      onClick={() => handleDatasetSelect(dataset.id)}
                    >
                      <DatasetItemTitle>{dataset.name}</DatasetItemTitle>
                      <DatasetItemMeta>
                        {dataset.rowCount.toLocaleString()} rows
                      </DatasetItemMeta>
                    </DatasetItem>
                  ))}
                </DatasetList>
              ) : (
                <DatasetItem disabled style={{ opacity: 0.5 }}>
                  <DatasetItemTitle>No datasets available</DatasetItemTitle>
                  <DatasetItemMeta>
                    Upload data to get started
                  </DatasetItemMeta>
                </DatasetItem>
              )}
            </div>
          </>
        )}

        {selectedTab === 'config' && (
          <>
            {/* Visualization Configuration */}
            <div>
              <SectionTitle>Chart Type</SectionTitle>
              <FilterGroup>
                <Label htmlFor="chart-type">Select visualization:</Label>
                <SelectInput id="chart-type">
                  <option value="">-- Choose a chart --</option>
                  <option value="bar">📊 Bar Chart</option>
                  <option value="line">📈 Line Chart</option>
                  <option value="scatter">🔵 Scatter Plot</option>
                  <option value="pie">🥧 Pie Chart</option>
                  <option value="heatmap">🔥 Heatmap</option>
                  <option value="map">🗺️ Map</option>
                </SelectInput>
              </FilterGroup>
            </div>

            {/* Filter Options */}
            <div>
              <SectionTitle>Display Options</SectionTitle>
              <FilterGroup>
                <CheckboxGroup>
                  <CheckboxInput id="grid" defaultChecked />
                  <CheckboxLabel htmlFor="grid">Show grid</CheckboxLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <CheckboxInput id="legend" defaultChecked />
                  <CheckboxLabel htmlFor="legend">Show legend</CheckboxLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <CheckboxInput id="tooltip" defaultChecked />
                  <CheckboxLabel htmlFor="tooltip">
                    Show tooltip on hover
                  </CheckboxLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <CheckboxInput id="animation" defaultChecked />
                  <CheckboxLabel htmlFor="animation">Enable animations</CheckboxLabel>
                </CheckboxGroup>
              </FilterGroup>
            </div>

            {/* Reset Button */}
            <ResetButton onClick={handleReset}>
              ↻ Reset Settings
            </ResetButton>
          </>
        )}
      </SidebarContent>
    </SidebarContainer>
  );
};

export default DashboardSidebar;
