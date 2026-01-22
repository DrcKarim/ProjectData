/**
 * DashboardTopBar.tsx
 * Top navigation bar with project controls and export options
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles';

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const TopBarContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: ${p => p.theme.colors.background.primary};
  border-bottom: 1px solid ${p => p.theme.colors.border.default};
  padding: 0 ${p => p.theme.spacing.lg};
  box-shadow: ${p => p.theme.shadows.sm};
  z-index: 100;
  gap: ${p => p.theme.spacing.lg};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.lg};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.md};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  color: ${p => p.theme.colors.text.primary};
  cursor: pointer;
  font-size: 18px;
  transition: ${p => p.theme.transition.default};

  &:hover {
    background: ${p => p.theme.colors.background.secondary};
    border-color: ${p => p.theme.colors.interactive.primary};
    color: ${p => p.theme.colors.interactive.primary};
  }

  &:active {
    background: ${p => p.theme.colors.interactive.primary};
    color: white;
    box-shadow: ${p => p.theme.shadows.sm};
  }

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

const ProjectTitle = styled.h1`
  font-size: ${p => p.theme.typographyScale.h4.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.h4.fontWeight};
  color: ${p => p.theme.colors.text.primary};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    font-size: ${p => p.theme.typographyScale.h5.fontSize}px;
  }
`;

const DividerLine = styled.div`
  width: 1px;
  height: 24px;
  background: ${p => p.theme.colors.border.default};
  margin: 0 ${p => p.theme.spacing.sm};

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    display: none;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.sm};
  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.md};
  background: ${p => p.theme.colors.interactive.primary};
  color: white;
  border: none;
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.label.fontWeight};
  cursor: pointer;
  transition: ${p => p.theme.transition.default};
  box-shadow: ${p => p.theme.shadows.xs};

  &:hover {
    background: ${p => p.theme.colors.interactive.hover};
    box-shadow: ${p => p.theme.shadows.sm};
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: ${p => p.theme.shadows.xs};
    transform: translateY(0);
  }

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.sm};
    font-size: 12px;
  }
`;

const ExportMenu = styled.div`
  position: absolute;
  top: 60px;
  right: ${p => p.theme.spacing.lg};
  background: ${p => p.theme.colors.background.primary};
  border: 1px solid ${p => p.theme.colors.border.default};
  border-radius: ${p => p.theme.componentBorderRadius.card};
  box-shadow: ${p => p.theme.shadows.lg};
  z-index: 1000;
  min-width: 150px;
  overflow: hidden;
  animation: slideDown ${p => p.theme.duration.fast} ${p => p.theme.easing.decelerate};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ExportMenuItem = styled.button`
  width: 100%;
  padding: ${p => p.theme.spacing.md};
  background: transparent;
  border: none;
  text-align: left;
  color: ${p => p.theme.colors.text.primary};
  cursor: pointer;
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  transition: ${p => p.theme.transition.color};
  border-bottom: 1px solid ${p => p.theme.colors.border.default};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${p => p.theme.colors.background.secondary};
    color: ${p => p.theme.colors.interactive.primary};
  }

  &:active {
    background: ${p => p.theme.colors.border.default};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${p => p.theme.spacing.sm};
  padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.md};
  background: ${p => p.theme.colors.background.secondary};
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  font-size: ${p => p.theme.typographyScale.caption.fontSize}px;
  color: ${p => p.theme.colors.text.secondary};

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    display: none;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.theme.colors.semantic.success};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      box-shadow: 0 0 0 0 ${p => p.theme.colors.semantic.success}40;
    }
    50% {
      opacity: 0.7;
      box-shadow: 0 0 0 4px ${p => p.theme.colors.semantic.success}00;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardTopBarProps {
  /**
   * Project name to display
   */
  projectName?: string;

  /**
   * Whether sidebar is open
   */
  sidebarOpen?: boolean;

  /**
   * Callback to toggle sidebar
   */
  onToggleSidebar?: () => void;

  /**
   * Callback when export format is selected
   */
  onExport?: (format: 'csv' | 'png' | 'pdf') => void;
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  projectName = 'Dashboard',
  sidebarOpen = true,
  onToggleSidebar,
  onExport,
}) => {
  const { theme } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'csv' | 'png' | 'pdf') => {
    if (onExport) {
      onExport(format);
    }
    setShowExportMenu(false);
  };

  return (
    <TopBarContainer>
      <LeftSection>
        {/* Menu Toggle Button */}
        <IconButton
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-label="Toggle sidebar"
        >
          ☰
        </IconButton>

        {/* Project Title */}
        <ProjectTitle>{projectName}</ProjectTitle>
      </LeftSection>

      <RightSection>
        {/* Status Indicator */}
        <StatusIndicator>
          <StatusDot />
          <span>Ready</span>
        </StatusIndicator>

        <DividerLine />

        {/* Export Button with Dropdown */}
        <div style={{ position: 'relative' }}>
          <ExportButton
            onClick={() => setShowExportMenu(!showExportMenu)}
            aria-label="Export data"
          >
            ⬇ Export
          </ExportButton>

          {showExportMenu && (
            <ExportMenu>
              <ExportMenuItem onClick={() => handleExport('csv')}>
                📄 Export CSV
              </ExportMenuItem>
              <ExportMenuItem onClick={() => handleExport('png')}>
                🖼️ Export PNG
              </ExportMenuItem>
              <ExportMenuItem onClick={() => handleExport('pdf')}>
                📋 Export PDF
              </ExportMenuItem>
            </ExportMenu>
          )}
        </div>

        {/* Theme Toggle (optional) */}
        <IconButton
          onClick={() => {
            // Theme toggle handled by ThemeProvider
          }}
          title="Toggle theme"
          aria-label="Toggle dark mode"
        >
          🌙
        </IconButton>
      </RightSection>
    </TopBarContainer>
  );
};

export default DashboardTopBar;
