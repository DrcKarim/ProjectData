import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ChartTypeMetadata, ChartTypes } from '../utils/chartConfig';
import { getFieldSuggestions, getFieldStats } from '../utils/chartAggregation';

/**
 * DataMappingPanel - Configure data field mappings for chart axes
 */

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const MappingRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  border-radius: 6px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const MappingLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  gap: 4px;

  ${props => props.required && `
    &::after {
      content: '*';
      color: #ef4444;
    }
  `}
`;

const MappingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme?.colors?.border || '#d1d5db'};
  border-radius: 4px;
  background: white;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#f3f4f6'};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FieldInfo = styled.div`
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  flex-wrap: wrap;
`;

const InfoBadge = styled.span`
  background: ${props => {
    switch (props.type) {
      case 'numeric':
        return 'rgba(79, 70, 229, 0.1)';
      case 'categorical':
        return 'rgba(139, 92, 246, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'numeric':
        return '#4f46e5';
      case 'categorical':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  }};
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 500;
`;

const ClearButton = styled.button`
  padding: 6px 12px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fecaca;
    color: #7f1d1d;
  }
`;

const RequirementNote = styled.div`
  padding: 8px 12px;
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  border-radius: 4px;
  font-size: 12px;
  color: #92400e;
  margin-top: 8px;
`;

const NoFieldsMessage = styled.div`
  padding: 16px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f3f4f6'};
  border-radius: 4px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  font-size: 13px;
  text-align: center;
`;

/**
 * DataMappingPanel Component
 * 
 * @param {object} config - Current chart configuration
 * @param {function} onChange - Callback when mapping changes (receives updated config)
 * @param {array} data - Data array with rows
 * @param {string} chartType - Selected chart type
 * @param {object} theme - Theme object for styling
 */
const DataMappingPanel = ({
  config,
  onChange,
  data = [],
  chartType = ChartTypes.BAR,
  theme = {},
}) => {
  // Get chart metadata to understand requirements
  const metadata = ChartTypeMetadata[chartType];
  
  // Get available fields from data
  const numericFields = useMemo(
    () => getFieldSuggestions(data, 'numeric').map(f => f.name),
    [data]
  );

  const categoricalFields = useMemo(
    () => getFieldSuggestions(data, 'categorical').map(f => f.name),
    [data]
  );

  const allFields = useMemo(
    () => getFieldSuggestions(data).map(f => f.name),
    [data]
  );

  // Get stats for currently selected fields
  const getFieldType = (field) => {
    if (!field) return null;
    if (numericFields.includes(field)) return 'numeric';
    if (categoricalFields.includes(field)) return 'categorical';
    return 'unknown';
  };

  const getFieldStats = (field) => {
    if (!field || !numericFields.includes(field)) return null;
    
    const values = data
      .map(d => Number(d[field]))
      .filter(v => !isNaN(v));
    
    if (values.length === 0) return null;

    return {
      count: values.length,
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    };
  };

  const handleMappingChange = (mappingKey, value) => {
    const newConfig = {
      ...config,
      dataMapping: {
        ...config.dataMapping,
        [mappingKey]: value || null,
      },
    };
    onChange(newConfig);
  };

  const handleClearMapping = (mappingKey) => {
    handleMappingChange(mappingKey, null);
  };

  if (data.length === 0) {
    return (
      <PanelContainer theme={theme}>
        <NoFieldsMessage theme={theme}>
          No data available. Please upload a dataset first.
        </NoFieldsMessage>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer theme={theme}>
      {/* X-Axis Mapping */}
      {metadata.requiresX && (
        <MappingRow theme={theme}>
          <MappingLabel theme={theme} required>
            X-Axis
          </MappingLabel>
          <MappingContent>
            <FieldSelect
              theme={theme}
              value={config.dataMapping.x || ''}
              onChange={(e) => handleMappingChange('x', e.target.value)}
            >
              <option value="">-- Select field --</option>
              {allFields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </FieldSelect>
            {config.dataMapping.x && (
              <FieldInfo>
                <InfoBadge type={getFieldType(config.dataMapping.x)}>
                  {getFieldType(config.dataMapping.x)}
                </InfoBadge>
                {getFieldStats(config.dataMapping.x) && (
                  <>
                    <span>Range: {getFieldStats(config.dataMapping.x).min} - {getFieldStats(config.dataMapping.x).max}</span>
                  </>
                )}
              </FieldInfo>
            )}
          </MappingContent>
        </MappingRow>
      )}

      {/* Y-Axis Mapping */}
      {metadata.requiresY && (
        <MappingRow theme={theme}>
          <MappingLabel theme={theme} required>
            Y-Axis
          </MappingLabel>
          <MappingContent>
            <FieldSelect
              theme={theme}
              value={config.dataMapping.y || ''}
              onChange={(e) => handleMappingChange('y', e.target.value)}
              disabled={metadata.requiresNumericY && numericFields.length === 0}
            >
              <option value="">-- Select field --</option>
              {(metadata.requiresNumericY ? numericFields : allFields).map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </FieldSelect>
            {config.dataMapping.y && (
              <FieldInfo>
                <InfoBadge type={getFieldType(config.dataMapping.y)}>
                  {getFieldType(config.dataMapping.y)}
                </InfoBadge>
                {getFieldStats(config.dataMapping.y) && (
                  <>
                    <span>Avg: {getFieldStats(config.dataMapping.y).avg}</span>
                    <span>Range: {getFieldStats(config.dataMapping.y).min} - {getFieldStats(config.dataMapping.y).max}</span>
                  </>
                )}
              </FieldInfo>
            )}
          </MappingContent>
        </MappingRow>
      )}

      {/* Series Mapping */}
      {metadata.supportsSeries && (
        <MappingRow theme={theme}>
          <MappingLabel theme={theme}>
            Series
          </MappingLabel>
          <MappingContent>
            <FieldSelect
              theme={theme}
              value={config.dataMapping.series || ''}
              onChange={(e) => handleMappingChange('series', e.target.value)}
            >
              <option value="">-- Select field (optional) --</option>
              {categoricalFields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </FieldSelect>
            {config.dataMapping.series && (
              <FieldInfo>
                <InfoBadge type="categorical">categorical</InfoBadge>
              </FieldInfo>
            )}
          </MappingContent>
        </MappingRow>
      )}

      {/* Size/Bubble Mapping */}
      {metadata.supportsBubbleSize && (
        <MappingRow theme={theme}>
          <MappingLabel theme={theme}>
            Size
          </MappingLabel>
          <MappingContent>
            <FieldSelect
              theme={theme}
              value={config.dataMapping.size || ''}
              onChange={(e) => handleMappingChange('size', e.target.value)}
            >
              <option value="">-- Select field (optional) --</option>
              {numericFields.map(field => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </FieldSelect>
            {config.dataMapping.size && (
              <FieldInfo>
                <InfoBadge type="numeric">numeric</InfoBadge>
              </FieldInfo>
            )}
          </MappingContent>
        </MappingRow>
      )}

      {/* Color Mapping */}
      {metadata.supportsColorScale && (
        <MappingRow theme={theme}>
          <MappingLabel theme={theme}>
            Color
          </MappingLabel>
          <MappingContent>
            <FieldSelect
              theme={theme}
              value={config.dataMapping.color || ''}
              onChange={(e) => handleMappingChange('color', e.target.value)}
            >
              <option value="">-- Select field (optional) --</option>
              {numericFields.map(field => (
                <option key={field} value={field}>
                  {field} (numeric)
                </option>
              ))}
            </FieldSelect>
            {config.dataMapping.color && (
              <FieldInfo>
                <InfoBadge type="numeric">numeric</InfoBadge>
              </FieldInfo>
            )}
          </MappingContent>
        </MappingRow>
      )}

      {/* Requirements Note */}
      {(metadata.requiresX || metadata.requiresY) && (
        <RequirementNote>
          ℹ️ {metadata.name} requires mapping:
          {metadata.requiresX && ' X-Axis,'}
          {metadata.requiresY && ' Y-Axis'}
        </RequirementNote>
      )}
    </PanelContainer>
  );
};

export default DataMappingPanel;
