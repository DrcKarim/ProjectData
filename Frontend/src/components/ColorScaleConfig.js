import React, { useState } from 'react';
import styled from 'styled-components';
import { ColorScales, ColorScaleMetadata } from '../utils/chartConfig';

/**
 * ColorScaleConfig - Configure color scale for heatmaps and color-coded charts
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
`;

const ScaleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const ScaleCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 2px solid ${props => props.isSelected 
    ? (props.theme?.colors?.primary || '#3b82f6')
    : (props.theme?.colors?.border || '#e0e0e0')};
  background: ${props => props.isSelected
    ? (props.theme?.colors?.primaryLight || '#eff6ff')
    : '#ffffff'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
  }
`;

const ScaleName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
`;

const ColorPreview = styled.div`
  display: flex;
  height: 20px;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ColorStop = styled.div`
  flex: 1;
  background: ${props => props.color};
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

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
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

const NumberInput = styled.input`
  padding: 6px 10px;
  border: 1px solid ${props => props.theme?.colors?.border || '#d1d5db'};
  border-radius: 4px;
  font-size: 12px;
  background: white;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const RangeInput = styled.input`
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const ValueDisplay = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  padding: 6px 10px;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
`;

/**
 * ColorScaleConfig Component
 * 
 * @param {object} config - Current chart configuration
 * @param {function} onChange - Callback when color scale changes
 * @param {object} theme - Theme object
 */
const ColorScaleConfig = ({
  config,
  onChange,
  theme = {},
}) => {
  const colorScaleConfig = config.colorScale || { type: ColorScales.Category };

  const handleScaleChange = (scaleType) => {
    const newConfig = {
      ...config,
      colorScale: {
        ...colorScaleConfig,
        type: scaleType,
      },
    };
    onChange(newConfig);
  };

  const handleReverseToggle = () => {
    const newConfig = {
      ...config,
      colorScale: {
        ...colorScaleConfig,
        reverse: !colorScaleConfig.reverse,
      },
    };
    onChange(newConfig);
  };

  const handleValueChange = (key, value) => {
    const newConfig = {
      ...config,
      colorScale: {
        ...colorScaleConfig,
        [key]: value,
      },
    };
    onChange(newConfig);
  };

  const currentMetadata = ColorScaleMetadata[colorScaleConfig.type];

  return (
    <Container theme={theme}>
      <Section>
        <SectionTitle theme={theme}>Color Scale</SectionTitle>
        <ScaleGrid>
          {Object.values(ColorScales).map(scaleType => {
            const metadata = ColorScaleMetadata[scaleType];
            const colors = metadata.colors || ['#cccccc'];
            const isSelected = colorScaleConfig.type === scaleType;

            return (
              <ScaleCard
                key={scaleType}
                isSelected={isSelected}
                onClick={() => handleScaleChange(scaleType)}
                theme={theme}
                title={metadata.description}
              >
                <ScaleName theme={theme}>{metadata.name}</ScaleName>
                <ColorPreview>
                  {colors.map((color, index) => (
                    <ColorStop key={index} color={color} />
                  ))}
                </ColorPreview>
              </ScaleCard>
            );
          })}
        </ScaleGrid>
      </Section>

      {currentMetadata && (
        <Section>
          <SectionTitle theme={theme}>Scale Options</SectionTitle>

          <ControlRow theme={theme}>
            <Label theme={theme}>
              <Checkbox
                type="checkbox"
                checked={colorScaleConfig.reverse || false}
                onChange={handleReverseToggle}
              />
              Reverse Scale
            </Label>
          </ControlRow>

          {currentMetadata.supportsMinMax && (
            <ControlRow theme={theme}>
              <div>
                <Label theme={theme}>Min Value</Label>
                <NumberInput
                  type="number"
                  value={colorScaleConfig.min ?? ''}
                  onChange={(e) => handleValueChange('min', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Auto"
                  title="Leave blank for automatic"
                />
              </div>
              <div>
                <Label theme={theme}>Max Value</Label>
                <NumberInput
                  type="number"
                  value={colorScaleConfig.max ?? ''}
                  onChange={(e) => handleValueChange('max', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Auto"
                  title="Leave blank for automatic"
                />
              </div>
            </ControlRow>
          )}

          <div style={{
            padding: '12px',
            background: '#f0f9ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#0c4a6e',
          }}>
            📊 {currentMetadata.description}
          </div>
        </Section>
      )}
    </Container>
  );
};

export default ColorScaleConfig;
