/**
 * Dashboard.tsx
 * Main dashboard layout component with responsive grid
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────┐
 * │         Top Bar (Controls)          │
 * ├────────────────┬─────────────────────┤
 * │                │                     │
 * │    Sidebar     │  Visualization      │
 * │  (Config)      │  Workspace          │
 * │                │                     │
 * └────────────────┴─────────────────────┘
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styles';
import DashboardTopBar from './DashboardTopBar';
import DashboardSidebar from './DashboardSidebar';
import DashboardWorkspace from './DashboardWorkspace';

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${p => p.theme.colors.background.primary};
  overflow: hidden;
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  flex: 1;
  overflow: hidden;
  gap: 0;

  /* Responsive: Stack on smaller screens */
  @media (max-width: ${p => p.theme.breakpoints.lg}px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  @media (max-width: ${p => p.theme.breakpoints.md}px) {
    grid-template-columns: 1fr;
  }
`;

const SidebarColumn = styled.aside`
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.colors.background.secondary};
  border-right: 1px solid ${p => p.theme.colors.border.default};
  overflow-y: auto;
  box-shadow: ${p => p.theme.shadows.sm};
  transition: ${p => p.theme.transition.default};
  z-index: 10;

  /* Hide sidebar on mobile, show via toggle */
  @media (max-width: ${p => p.theme.breakpoints.lg}px) {
    position: absolute;
    top: 60px;
    left: 0;
    width: 280px;
    height: calc(100vh - 60px);
    border-right: none;
    border-bottom: 1px solid ${p => p.theme.colors.border.default};
    background: ${p => p.theme.colors.background.primary};
    transform: translateX(-100%);
    box-shadow: ${p => p.theme.shadows.lg};
    transition: transform ${p => p.theme.duration.fast} ${p => p.theme.easing.material};

    ${p => p.isOpen && `
      transform: translateX(0);
    `}
  }
`;

const WorkspaceColumn = styled.main`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${p => p.theme.colors.background.primary};
`;

const ContentScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* Smooth scrolling */
  scroll-behavior: smooth;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${p => p.theme.colors.background.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${p => p.theme.colors.border.default};
    border-radius: ${p => p.theme.componentBorderRadius.scrollbar?.thumb};

    &:hover {
      background: ${p => p.theme.colors.text.secondary};
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardProps {
  /**
   * Project name displayed in top bar
   */
  projectName?: string;

  /**
   * List of available datasets
   */
  datasets?: Array<{
    id: string;
    name: string;
    rowCount: number;
  }>;

  /**
   * Current active dataset ID
   */
  activeDatasetId?: string;

  /**
   * Callback when dataset changes
   */
  onDatasetChange?: (datasetId: string) => void;

  /**
   * Callback when export is triggered
   */
  onExport?: (format: 'csv' | 'png' | 'pdf') => void;

  /**
   * Children to render in workspace (visualization components)
   */
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({
  projectName = 'Data Visualization Dashboard',
  datasets = [],
  activeDatasetId = '',
  onDatasetChange,
  onExport,
  children,
}) => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'data' | 'config'>('data');

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleExport = (format: 'csv' | 'png' | 'pdf') => {
    if (onExport) {
      onExport(format);
    }
  };

  const handleDatasetChange = (datasetId: string) => {
    if (onDatasetChange) {
      onDatasetChange(datasetId);
    }
  };

  return (
    <DashboardContainer>
      {/* Top Bar with Project Controls */}
      <DashboardTopBar
        projectName={projectName}
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
        onExport={handleExport}
      />

      {/* Main Content Grid */}
      <DashboardContent>
        {/* Left Sidebar: Data & Configuration */}
        <SidebarColumn isOpen={sidebarOpen} as={styled.aside}`
          display: flex;
          flex-direction: column;
          background: ${p => p.theme.colors.background.secondary};
          border-right: 1px solid ${p => p.theme.colors.border.default};
          overflow-y: auto;
          box-shadow: ${p => p.theme.shadows.sm};
          z-index: 10;

          @media (max-width: ${p => p.theme.breakpoints.lg}px) {
            position: absolute;
            top: 60px;
            left: 0;
            width: 280px;
            height: calc(100vh - 60px);
            background: ${p => p.theme.colors.background.primary};
            transform: ${p => p.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
            box-shadow: ${p => p.theme.shadows.lg};
            transition: transform ${p => p.theme.duration.fast} ${p => p.theme.easing.material};
          }
        `}
        >
          <DashboardSidebar
            datasets={datasets}
            activeDatasetId={activeDatasetId}
            onDatasetChange={handleDatasetChange}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />
        </SidebarColumn>

        {/* Main Workspace Area */}
        <WorkspaceColumn>
          <ContentScrollArea>
            <DashboardWorkspace>
              {children || (
                <EmptyState>
                  <EmptyStateIcon>📊</EmptyStateIcon>
                  <EmptyStateTitle>Welcome to Data Visualization</EmptyStateTitle>
                  <EmptyStateDescription>
                    Upload a dataset or select one from the sidebar to begin exploring your data.
                  </EmptyStateDescription>
                </EmptyState>
              )}
            </DashboardWorkspace>
          </ContentScrollArea>
        </WorkspaceColumn>
      </DashboardContent>
    </DashboardContainer>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${p => p.theme.spacing['3xl']};
  gap: ${p => p.theme.spacing.lg};
  color: ${p => p.theme.colors.text.secondary};
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  opacity: 0.4;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const EmptyStateTitle = styled.h2`
  font-size: ${p => p.theme.typographyScale.h3.fontSize}px;
  font-weight: ${p => p.theme.typographyScale.h3.fontWeight};
  color: ${p => p.theme.colors.text.primary};
  margin: 0;
`;

const EmptyStateDescription = styled.p`
  font-size: ${p => p.theme.typographyScale.body2.fontSize}px;
  color: ${p => p.theme.colors.text.secondary};
  text-align: center;
  max-width: 400px;
  margin: 0;
`;

export default Dashboard;
