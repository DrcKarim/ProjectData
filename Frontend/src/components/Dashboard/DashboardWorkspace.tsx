/**
 * DashboardWorkspace.tsx
 * Main visualization workspace area with responsive grid
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles';

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const WorkspaceContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${p => p.theme.spacing.lg};
  padding: ${p => p.theme.spacing.xl};
  background: ${p => p.theme.colors.background.primary};
  min-height: 100%;

  /* Responsive grid adjustments */
  @media (max-width: ${p => p.theme.breakpoints['2xl']}px) {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: ${p => p.theme.spacing.lg};
  }

  @media (max-width: ${p => p.theme.breakpoints.xl}px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${p => p.theme.spacing.md};
    padding: ${p => p.theme.spacing.lg};
  }

  @media (max-width: ${p => p.theme.breakpoints.lg}px) {
    grid-template-columns: 1fr;
    gap: ${p => p.theme.spacing.md};
    padding: ${p => p.theme.spacing.lg};
  }

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    grid-template-columns: 1fr;
    gap: ${p => p.theme.spacing.md};
    padding: ${p => p.theme.spacing.md};
  }
`;

const Card = styled.div<{ fullWidth?: boolean }>`
  background: ${p => p.theme.colors.background.secondary};
  border: 1px solid ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.card};
  padding: ${p => p.theme.spacing.lg};
  box-shadow: ${p => p.theme.shadows.xs};
  transition: ${p => p.theme.transition.default};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 300px;

  ${p =>
    p.fullWidth &&
    `
    grid-column: 1 / -1;
  `}

  &:hover {
    box-shadow: ${p => p.theme.shadows.md};
    border-color: ${p => p.theme.colors.border.interactive};
  }

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    padding: ${p => p.theme.spacing.md};
    min-height: 250px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${p => p.theme.spacing.md};
  padding-bottom: ${p => p.theme.spacing.md};
  border-bottom: 1px solid ${p => p.theme.colors.border.default};
`;

const CardTitle = styled.h3`
  font-size: ${p => p.theme.typographyScale.h5.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.h5.fontWeight};
  color: ${p => p.theme.colors.text.primary};
  margin: 0;
`;

const CardSubtitle = styled.p`
  font-size: ${p => p.theme.typographyScale.caption.fontSize}px;
  color: ${p => p.theme.colors.text.secondary};
  margin: ${p => p.theme.spacing.xs} 0 0 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: ${p => p.theme.spacing.sm};
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  color: ${p => p.theme.colors.text.secondary};
  cursor: pointer;
  font-size: 14px;
  transition: ${p => p.theme.transition.default};

  &:hover {
    background: ${p => p.theme.colors.background.primary};
    border-color: ${p => p.theme.colors.interactive.primary};
    color: ${p => p.theme.colors.interactive.primary};
  }

  &:active {
    background: ${p => p.theme.colors.interactive.primary};
    color: white;
  }
`;

const CardContent = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${p => p.theme.spacing.md};
  padding-top: ${p => p.theme.spacing.md};
  border-top: 1px solid ${p => p.theme.colors.border.default};
  font-size: ${p => p.theme.typographyScale.caption.fontSize}px;
  color: ${p => p.theme.colors.text.secondary};
`;

const ChartPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: ${p => p.theme.spacing.md};
  color: ${p => p.theme.colors.text.secondary};
  text-align: center;
`;

const PlaceholderIcon = styled.div`
  font-size: 48px;
  opacity: 0.3;
`;

const PlaceholderText = styled.p`
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  margin: 0;
`;

const AddCardButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${p => p.theme.spacing.md};
  background: ${p => p.theme.colors.background.secondary};
  border: 2px dashed ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.card};
  padding: ${p => p.theme.spacing.xl};
  cursor: pointer;
  transition: ${p => p.theme.transition.default};
  min-height: 300px;
  color: ${p => p.theme.colors.text.secondary};

  &:hover {
    border-color: ${p => p.theme.colors.interactive.primary};
    background: ${p => p.theme.colors.interactive.primary}05;
    color: ${p => p.theme.colors.interactive.primary};
  }

  &:active {
    background: ${p => p.theme.colors.interactive.primary}10;
  }

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    min-height: 250px;
    padding: ${p => p.theme.spacing.lg};
  }
`;

const AddCardIcon = styled.div`
  font-size: 40px;
`;

const AddCardText = styled.div`
  font-weight: 500;
  text-align: center;
`;

const Badge = styled.span`
  display: inline-block;
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.sm};
  background: ${p => p.theme.colors.interactive.primary}15;
  color: ${p => p.theme.colors.interactive.primary};
  border-radius: ${p => p.theme.componentBorderRadius.badge};
  font-size: ${p => p.theme.typographyScale.caption.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.label.fontWeight};
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface VisualizationCard {
  id: string;
  title: string;
  type: string;
  data?: any;
}

export interface DashboardWorkspaceProps {
  cards?: VisualizationCard[];
  onAddCard?: () => void;
  onRemoveCard?: (cardId: string) => void;
  onExportCard?: (cardId: string, format: string) => void;
  children?: React.ReactNode;
}

const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({
  cards = [],
  onAddCard,
  onRemoveCard,
  onExportCard,
  children,
}) => {
  const { theme } = useTheme();

  // If children provided, render as is (allows custom layout)
  if (children) {
    return <WorkspaceContainer>{children}</WorkspaceContainer>;
  }

  // Default layout with demo cards
  return (
    <WorkspaceContainer>
      {/* Demo Card 1: Sales Trend */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Sales Trend</CardTitle>
            <CardSubtitle>Last 12 months</CardSubtitle>
          </div>
          <CardActions>
            <IconButton
              onClick={() => onExportCard?.('1', 'png')}
              title="Export chart"
            >
              ⬇
            </IconButton>
            <IconButton
              onClick={() => onRemoveCard?.('1')}
              title="Remove chart"
            >
              ✕
            </IconButton>
          </CardActions>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder>
            <PlaceholderIcon>📈</PlaceholderIcon>
            <PlaceholderText>Line Chart Visualization</PlaceholderText>
            <Badge>Demo</Badge>
          </ChartPlaceholder>
        </CardContent>
        <CardFooter>
          <span>Chart Type: Line</span>
          <span>Data Points: 12</span>
        </CardFooter>
      </Card>

      {/* Demo Card 2: Category Distribution */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Category Distribution</CardTitle>
            <CardSubtitle>By product type</CardSubtitle>
          </div>
          <CardActions>
            <IconButton
              onClick={() => onExportCard?.('2', 'png')}
              title="Export chart"
            >
              ⬇
            </IconButton>
            <IconButton
              onClick={() => onRemoveCard?.('2')}
              title="Remove chart"
            >
              ✕
            </IconButton>
          </CardActions>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder>
            <PlaceholderIcon>🥧</PlaceholderIcon>
            <PlaceholderText>Pie Chart Visualization</PlaceholderText>
            <Badge>Demo</Badge>
          </ChartPlaceholder>
        </CardContent>
        <CardFooter>
          <span>Chart Type: Pie</span>
          <span>Categories: 5</span>
        </CardFooter>
      </Card>

      {/* Demo Card 3: Regional Performance */}
      <Card fullWidth>
        <CardHeader>
          <div>
            <CardTitle>Regional Performance</CardTitle>
            <CardSubtitle>Year-over-year comparison</CardSubtitle>
          </div>
          <CardActions>
            <IconButton
              onClick={() => onExportCard?.('3', 'png')}
              title="Export chart"
            >
              ⬇
            </IconButton>
            <IconButton
              onClick={() => onRemoveCard?.('3')}
              title="Remove chart"
            >
              ✕
            </IconButton>
          </CardActions>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder>
            <PlaceholderIcon>📊</PlaceholderIcon>
            <PlaceholderText>Bar Chart Visualization</PlaceholderText>
            <Badge>Demo</Badge>
          </ChartPlaceholder>
        </CardContent>
        <CardFooter>
          <span>Chart Type: Bar</span>
          <span>Regions: 4</span>
        </CardFooter>
      </Card>

      {/* Add New Card Button */}
      <AddCardButton onClick={onAddCard}>
        <AddCardIcon>+</AddCardIcon>
        <AddCardText>Add New Visualization</AddCardText>
      </AddCardButton>
    </WorkspaceContainer>
  );
};

export default DashboardWorkspace;
