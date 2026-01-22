import React from 'react';
import styled from 'styled-components';
import { TooltipTrigger } from '../utils/chartConfig';

/**
 * TooltipConfig - Configure tooltip behavior and display
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

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  padding: 8px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  }

  font-size: 13px;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#1f2937'};
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.colors?.backgroundSecondary || '#f9fafb'};
  }
`;

const Input = styled.input`
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

const Select = styled.select`
  padding: 6px 10px;
  border: 1px solid ${props => props.theme?.colors?.border || '#d1d5db'};
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PreviewBox = styled.div`
  padding: 12px;
  background: #f0f9ff;
  border-left: 3px solid #0284c7;
  border-radius: 4px;
  font-size: 12px;
  color: #0c4a6e;
  margin-top: 8px;
`;

const InfoText = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.colors?.textSecondary || '#6b7280'};
  margin-top: 4px;
`;

/**
 * TooltipConfig Component
 * 
 * @param {object} config - Current chart configuration
 * @param {function} onChange - Callback when tooltip config changes
 * @param {object} theme - Theme object
 */
const TooltipConfig = ({
  config,
  onChange,
  theme = {},
}) => {
  const tooltipConfig = config.tooltip || {
    trigger: TooltipTrigger.ITEM,
    showSeriesName: true,
    showValue: true,
    showPercent: false,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    textColor: '#ffffff',
  };

  const handleTriggerChange = (trigger) => {
    const newConfig = {
      ...config,
      tooltip: {
        ...tooltipConfig,
        trigger,
      },
    };
    onChange(newConfig);
  };

  const handleConfigChange = (key, value) => {
    const newConfig = {
      ...config,
      tooltip: {
        ...tooltipConfig,
        [key]: value,
      },
    };
    onChange(newConfig);
  };

  const handleCheckboxChange = (key) => {
    handleConfigChange(key, !tooltipConfig[key]);
  };

  return (
    <Container theme={theme}>
      <Section>
        <SectionTitle theme={theme}>Tooltip Trigger</SectionTitle>
        <RadioGroup>
          <RadioOption theme={theme}>
            <RadioInput
              type="radio"
              name="tooltipTrigger"
              value={TooltipTrigger.ITEM}
              checked={tooltipConfig.trigger === TooltipTrigger.ITEM}
              onChange={(e) => handleTriggerChange(e.target.value)}
            />
            <span>Item - Show on hover over data point</span>
          </RadioOption>
          <RadioOption theme={theme}>
            <RadioInput
              type="radio"
              name="tooltipTrigger"
              value={TooltipTrigger.AXIS}
              checked={tooltipConfig.trigger === TooltipTrigger.AXIS}
              onChange={(e) => handleTriggerChange(e.target.value)}
            />
            <span>Axis - Show on hover over axis area</span>
          </RadioOption>
          <RadioOption theme={theme}>
            <RadioInput
              type="radio"
              name="tooltipTrigger"
              value={TooltipTrigger.NONE}
              checked={tooltipConfig.trigger === TooltipTrigger.NONE}
              onChange={(e) => handleTriggerChange(e.target.value)}
            />
            <span>None - No tooltip</span>
          </RadioOption>
        </RadioGroup>
      </Section>

      {tooltipConfig.trigger !== TooltipTrigger.NONE && (
        <>
          <Section>
            <SectionTitle theme={theme}>Content</SectionTitle>
            <CheckboxGroup>
              <OptionRow theme={theme}>
                <Checkbox
                  type="checkbox"
                  id="showSeriesName"
                  checked={tooltipConfig.showSeriesName || false}
                  onChange={() => handleCheckboxChange('showSeriesName')}
                />
                <Label htmlFor="showSeriesName" theme={theme}>
                  Show Series Name
                </Label>
              </OptionRow>
              <OptionRow theme={theme}>
                <Checkbox
                  type="checkbox"
                  id="showValue"
                  checked={tooltipConfig.showValue !== false}
                  onChange={() => handleCheckboxChange('showValue')}
                />
                <Label htmlFor="showValue" theme={theme}>
                  Show Value
                </Label>
              </OptionRow>
              <OptionRow theme={theme}>
                <Checkbox
                  type="checkbox"
                  id="showPercent"
                  checked={tooltipConfig.showPercent || false}
                  onChange={() => handleCheckboxChange('showPercent')}
                />
                <Label htmlFor="showPercent" theme={theme}>
                  Show Percentage
                </Label>
              </OptionRow>
            </CheckboxGroup>
          </Section>

          <Section>
            <SectionTitle theme={theme}>Appearance</SectionTitle>
            <ControlGrid>
              <div>
                <Label theme={theme}>Background</Label>
                <Input
                  type="text"
                  value={tooltipConfig.backgroundColor || ''}
                  onChange={(e) => handleConfigChange('backgroundColor', e.target.value)}
                  placeholder="e.g. rgba(50,50,50,0.7)"
                  title="CSS color value"
                />
                <InfoText>CSS color (hex, rgb, rgba, etc.)</InfoText>
              </div>
              <div>
                <Label theme={theme}>Text Color</Label>
                <Input
                  type="text"
                  value={tooltipConfig.textColor || ''}
                  onChange={(e) => handleConfigChange('textColor', e.target.value)}
                  placeholder="e.g. #ffffff"
                  title="CSS color value"
                />
                <InfoText>CSS color value</InfoText>
              </div>
            </ControlGrid>

            <PreviewBox>
              <div style={{
                background: tooltipConfig.backgroundColor || 'rgba(50, 50, 50, 0.7)',
                color: tooltipConfig.textColor || '#ffffff',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                Preview: Series Name • 1,234 (45.2%)
              </div>
            </PreviewBox>
          </Section>
        </>
      )}

      {tooltipConfig.trigger === TooltipTrigger.NONE && (
        <div style={{
          padding: '12px',
          background: '#f3f4f6',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center',
        }}>
          Tooltip is disabled. Data will not show on hover.
        </div>
      )}
    </Container>
  );
};

export default TooltipConfig;
