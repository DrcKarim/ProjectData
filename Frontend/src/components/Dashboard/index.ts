/**
 * Dashboard/index.ts
 * Barrel export for dashboard components
 */

export { default as Dashboard } from './Dashboard';
export { default as DashboardTopBar } from './DashboardTopBar';
export { default as DashboardSidebar } from './DashboardSidebar';
export { default as DashboardWorkspace } from './DashboardWorkspace';

export type { DashboardProps } from './Dashboard';
export type { DashboardTopBarProps } from './DashboardTopBar';
export type { DashboardSidebarProps, Dataset } from './DashboardSidebar';
export type { DashboardWorkspaceProps, VisualizationCard } from './DashboardWorkspace';
