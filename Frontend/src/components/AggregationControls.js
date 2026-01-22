import React from 'react';
import styled from 'styled-components';
import { AggregationFunctions, AggregationMetadata, ChartTypeMetadata, ChartTypes } from '../utils/chartConfig';

/**
 * AggregationControls - Configure aggregation functions for chart axes
 */

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const AggregationRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  padding: 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  border-radius: 6px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
`;

const AggregationSelect = styled.select`
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

const ControlRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  margin-bottom: 4px;
`;

const FieldValue = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  padding: 4px 0;
`;

const InfoBox = styled.div`
  padding: 12px;
  background: #e0f2fe;
  border-left: 3px solid #0284c7;
  border-radius: 4px;
  font-size: 12px;
  color: #0c4a6e;
  margin-bottom: 12px;
`;

const DisabledMessage = styled.div`
  padding: 12px;
  background: #f3f4f6;
  border-radius: 4px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  font-size: 12px;
  text-align: center;
`;

const AggregationSymbol = styled.span`
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 11px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f0f0f0'};
  padding: 2px 6px;
  border-radius: 3px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  font-weight: 500;
`;

/**
 * AggregationControls Component
 * 
 * @param {object} config - Current chart configuration
 * @param {function} onChange - Callback when aggregation changes (receives updated config)
 * @param {object} dataMapping - Data mapping configuration {x, y, series}
 * @param {string} chartType - Selected chart type
 * @param {object} theme - Theme object for styling
 */
const AggregationControls = ({
  config,
  onChange,
  dataMapping = {},
  chartType = ChartTypes.BAR,
  theme = {},
}) => {
  const metadata = ChartTypeMetadata[chartType];
  const aggregationConfig = config.aggregation || {};

  // Determine if aggregation should be available
  const supportsAggregation = metadata.supportsAggregation;
  const hasRequiredFields = dataMapping.x || dataMapping.y;

  const handleAggregationToggle = (enabled) => {
    const newConfig = {
      ...config,
      aggregation: {
        ...aggregationConfig,
        enabled,
      },
    };
    onChange(newConfig);
  };

  const handleAggregationChange = (axis, value) => {
    const newConfig = {
      ...config,
      aggregation: {
        ...aggregationConfig,
        [axis]: value,
      },
    };
    onChange(newConfig);
  };

  if (!supportsAggregation) {
    return (
      <ControlsContainer theme={theme}>
        <DisabledMessage theme={theme}>
          ℹ️ {metadata.name} does not support aggregation
        </DisabledMessage>
      </ControlsContainer>
    );
  }

  return (
    <ControlsContainer theme={theme}>
      <InfoBox theme={theme}>
        Aggregation combines multiple data values into single summary values.
        Useful when data has many rows and you want to group by categories.
      </InfoBox>

      <AggregationRow theme={theme}>
        <Label theme={theme}>
          <Checkbox
            type="checkbox"
            checked={aggregationConfig.enabled || false}
            onChange={(e) => handleAggregationToggle(e.target.checked)}
            disabled={!hasRequiredFields}
            title={!hasRequiredFields ? 'Map X or Y axis first' : 'Enable data aggregation'}
          />
          Enable Aggregation
        </Label>
      </AggregationRow>

      {aggregationConfig.enabled && (
        <>
          {/* X-Axis Aggregation */}
          {dataMapping.x && (
            <ControlRow theme={theme}>
              <div>
                <FieldLabel theme={theme}>
                  {dataMapping.x} (X-Axis)
                </FieldLabel>
                <FieldValue theme={theme}>
                  Aggregation: <AggregationSymbol theme={theme}>
                    {AggregationMetadata[aggregationConfig.xAgg || AggregationFunctions.FIRST]?.symbol}
                  </AggregationSymbol>
                </FieldValue>
              </div>
              <AggregationSelect
                theme={theme}
                value={aggregationConfig.xAgg || AggregationFunctions.FIRST}
                onChange={(e) => handleAggregationChange('xAgg', e.target.value)}
              >
                {Object.values(AggregationFunctions).map(func => (
                  <option key={func} value={func}>
                    {AggregationMetadata[func]?.name || func}
                  </option>
                ))}
              </AggregationSelect>
            </ControlRow>
          )}

          {/* Y-Axis Aggregation */}
          {dataMapping.y && (
            <ControlRow theme={theme}>
              <div>
                <FieldLabel theme={theme}>
                  {dataMapping.y} (Y-Axis)
                </FieldLabel>
                <FieldValue theme={theme}>
                  Aggregation: <AggregationSymbol theme={theme}>
                    {AggregationMetadata[aggregationConfig.yAgg || AggregationFunctions.SUM]?.symbol}
                  </AggregationSymbol>
                </FieldValue>
              </div>
              <AggregationSelect
                theme={theme}
                value={aggregationConfig.yAgg || AggregationFunctions.SUM}
                onChange={(e) => handleAggregationChange('yAgg', e.target.value)}
              >
                <optgroup label="Numeric Functions">
                  <option value={AggregationFunctions.SUM}>
                    {AggregationMetadata[AggregationFunctions.SUM]?.name}
                  </option>
                  <option value={AggregationFunctions.AVG}>
                    {AggregationMetadata[AggregationFunctions.AVG]?.name}
                  </option>
                  <option value={AggregationFunctions.MIN}>
                    {AggregationMetadata[AggregationFunctions.MIN]?.name}
                  </option>
                  <option value={AggregationFunctions.MAX}>
                    {AggregationMetadata[AggregationFunctions.MAX]?.name}
                  </option>
                  <option value={AggregationFunctions.MEDIAN}>
                    {AggregationMetadata[AggregationFunctions.MEDIAN]?.name}
                  </option>
                  <option value={AggregationFunctions.STDDEV}>
                    {AggregationMetadata[AggregationFunctions.STDDEV]?.name}
                  </option>
                </optgroup>
                <optgroup label="Count Functions">
                  <option value={AggregationFunctions.COUNT}>
                    {AggregationMetadata[AggregationFunctions.COUNT]?.name}
                  </option>
                  <option value={AggregationFunctions.DISTINCT}>
                    {AggregationMetadata[AggregationFunctions.DISTINCT]?.name}
                  </option>
                </optgroup>
                <optgroup label="First/Last">
                  <option value={AggregationFunctions.FIRST}>
                    {AggregationMetadata[AggregationFunctions.FIRST]?.name}
                  </option>
                  <option value={AggregationFunctions.LAST}>
                    {AggregationMetadata[AggregationFunctions.LAST]?.name}
                  </option>
                </optgroup>
              </AggregationSelect>
            </ControlRow>
          )}

          {!hasRequiredFields && (
            <div style={{
              padding: '12px',
              background: '#fef3c7',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#92400e',
            }}>
              ⚠️ Map X-Axis or Y-Axis fields to enable aggregation
            </div>
          )}
        </>
      )}

      {!aggregationConfig.enabled && hasRequiredFields && (
        <div style={{
          padding: '12px',
          background: '#f0fdf4',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#166534',
        }}>
          Data will be displayed as-is without aggregation. Enable above to group and summarize data.
        </div>
      )}
    </ControlsContainer>
  );
};

export default AggregationControls;
