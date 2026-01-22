import React, { useState } from 'react';
import styled from 'styled-components';
import { ChartTypes, ChartTypeMetadata } from '../utils/chartConfig';

/**
 * ChartTypeSelector - Interactive chart type selection component
 * Displays all available chart types in a grid with descriptions
 */

const SelectorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const ChartTypeCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 2px solid ${props => props.isSelected 
    ? (props.theme?.colors?.primary || '#3b82f6')
    : (props.theme?.colors?.border || '#e0e0e0')};
  background: ${props => props.isSelected
    ? (props.theme?.colors?.primaryLight || '#eff6ff')
    : '#ffffff'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  min-height: 140px;

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
    background: ${props => !props.isSelected && (props.theme?.colors?.primaryLight || '#eff6ff')};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChartIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
  line-height: 1;
`;

const ChartName = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  margin-bottom: 4px;
`;

const ChartDescription = styled.div`
  font-size: 11px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  line-height: 1.3;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  border-radius: 6px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.isActive
    ? (props.theme?.colors?.primary || '#3b82f6')
    : (props.theme?.colors?.border || '#d1d5db')};
  background: ${props => props.isActive
    ? (props.theme?.colors?.primary || '#3b82f6')
    : '#ffffff'};
  color: ${props => props.isActive ? '#ffffff' : (props.theme?.colors?.text || '#1f2937')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
`;

const CountBadge = styled.span`
  background: ${props => props.theme?.colors?.primary || '#3b82f6'};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;

/**
 * ChartTypeSelector Component
 * 
 * @param {string} selectedType - Currently selected chart type
 * @param {function} onChange - Callback when chart type is selected
 * @param {string} filterByCapability - Filter types by capability: 'all', 'numeric', 'colorScale', 'series'
 * @param {object} theme - Theme object for styling
 */
const ChartTypeSelector = ({
  selectedType,
  onChange,
  filterByCapability = 'all',
  theme = {},
}) => {
  const [activeFilter, setActiveFilter] = useState(filterByCapability);

  // Get all chart types and their metadata
  const allChartTypes = Object.values(ChartTypes);
  
  // Filter types based on capability
  const filteredTypes = activeFilter === 'all' 
    ? allChartTypes
    : allChartTypes.filter(type => {
        const metadata = ChartTypeMetadata[type];
        switch (activeFilter) {
          case 'numeric':
            return metadata.supportsAggregation;
          case 'colorScale':
            return metadata.supportsColorScale;
          case 'series':
            return metadata.supportsSeries;
          default:
            return true;
        }
      });

  const handleTypeSelect = (type) => {
    onChange(type);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div>
      <HeaderSection>
        <Title>Chart Type</Title>
        <CountBadge>{filteredTypes.length}</CountBadge>
      </HeaderSection>

      <FilterSection>
        <FilterButton
          isActive={activeFilter === 'all'}
          onClick={() => handleFilterClick('all')}
          title="Show all chart types"
        >
          All Charts
        </FilterButton>
        <FilterButton
          isActive={activeFilter === 'numeric'}
          onClick={() => handleFilterClick('numeric')}
          title="Show charts that support aggregation"
        >
          Numeric
        </FilterButton>
        <FilterButton
          isActive={activeFilter === 'colorScale'}
          onClick={() => handleFilterClick('colorScale')}
          title="Show charts that support color scales"
        >
          Color Scale
        </FilterButton>
        <FilterButton
          isActive={activeFilter === 'series'}
          onClick={() => handleFilterClick('series')}
          title="Show charts that support multiple series"
        >
          Multi-Series
        </FilterButton>
      </FilterSection>

      <SelectorContainer theme={theme}>
        {filteredTypes.map(type => {
          const metadata = ChartTypeMetadata[type];
          
          return (
            <ChartTypeCard
              key={type}
              isSelected={selectedType === type}
              onClick={() => handleTypeSelect(type)}
              title={metadata.description}
              theme={theme}
            >
              <ChartIcon>{metadata.icon}</ChartIcon>
              <ChartName>{metadata.name}</ChartName>
              <ChartDescription>{metadata.description}</ChartDescription>
            </ChartTypeCard>
          );
        })}
      </SelectorContainer>

      {filteredTypes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '32px',
          color: theme?.colors?.textSecondary || '#6b7280',
          fontSize: '14px',
        }}>
          No chart types available with the selected filters
        </div>
      )}
    </div>
  );
};

export default ChartTypeSelector;
