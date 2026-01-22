/**
 * IMPLEMENTATION EXAMPLE: Dashboard Integration into App.tsx
 * 
 * This file demonstrates how to integrate the enterprise dashboard
 * into your main application. Copy and adapt this example to your needs.
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ThemeProvider, useTheme } from '../../styles';
import { Dashboard } from '@/components/Dashboard';

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const AppRoot = styled.div`
  width: 100%;
  height: 100vh;
  background: ${p => p.theme.colors.background.primary};
  color: ${p => p.theme.colors.text.primary};
  font-family: ${p => p.theme.fontFamily.sans};
  font-size: ${p => p.theme.typographyScale.body1.fontSize}px;
  line-height: ${p => p.theme.typographyScale.body1.lineHeight}px;
`;

const Toast = styled.div`
  position: fixed;
  bottom: ${p => p.theme.spacing.lg};
  right: ${p => p.theme.spacing.lg};
  background: ${p => p.theme.colors.semantic.success};
  color: white;
  padding: ${p => p.theme.spacing.md} ${p => p.theme.spacing.lg};
  border-radius: ${p => p.theme.componentBorderRadius.button.default};
  box-shadow: ${p => p.theme.shadows.lg};
  animation: slideIn 0.3s ease-out;
  z-index: 2000;

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP CONTENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DashboardAppContent
 * The actual app content, separated so it can use useTheme hook
 */
const DashboardAppContent: React.FC = () => {
  const { theme, mode } = useTheme();

  // Mock datasets
  const [datasets] = useState([
    {
      id: 'sales-2024',
      name: 'Sales 2024 Q1',
      rowCount: 15000,
    },
    {
      id: 'customers-2024',
      name: 'Customers 2024',
      rowCount: 8500,
    },
    {
      id: 'inventory',
      name: 'Inventory Status',
      rowCount: 3200,
    },
  ]);

  const [activeDataset, setActiveDataset] = useState('sales-2024');
  const [toast, setToast] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────

  const handleDatasetChange = useCallback((datasetId: string) => {
    setActiveDataset(datasetId);
    const dataset = datasets.find(d => d.id === datasetId);
    showToast(`Loaded dataset: ${dataset?.name}`);

    // Here you would:
    // 1. Fetch data from backend API
    // 2. Update visualization store (Zustand)
    // 3. Refresh charts with new data
    console.log(`Dataset changed to: ${datasetId}`);
  }, [datasets]);

  const handleExport = useCallback((format: 'csv' | 'png' | 'pdf') => {
    showToast(`Exporting data as ${format.toUpperCase()}...`);

    // Simulate export
    setTimeout(() => {
      showToast(`Export complete! File saved as data.${format}`);
    }, 2000);

    // Here you would:
    // 1. Call backend API to generate export
    // 2. Handle file download
    console.log(`Export requested: ${format}`);
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AppRoot>
      <Dashboard
        projectName="📊 Enterprise Data Dashboard"
        datasets={datasets}
        activeDatasetId={activeDataset}
        onDatasetChange={handleDatasetChange}
        onExport={handleExport}
      >
        {/* 
          Custom visualization cards go here.
          This is where you'd place your ECharts, Recharts, D3.js, etc.
          
          Example:
          <VisualizationCard>
            <ECharts option={chartOption} />
          </VisualizationCard>
        */}
      </Dashboard>

      {/* Toast Notification */}
      {toast && <Toast>{toast}</Toast>}
    </AppRoot>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * App
 * Root component with ThemeProvider wrapping
 */
export default function App() {
  return (
    <ThemeProvider initialMode="light">
      <DashboardAppContent />
    </ThemeProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ALTERNATIVE: WITH STATE MANAGEMENT (Zustand example)
// ═══════════════════════════════════════════════════════════════════════════

/*

// If using Zustand for state management:

import { useAppStore } from '@/store/appStore';

const DashboardAppContentWithStore: React.FC = () => {
  const { theme } = useTheme();
  const datasets = useAppStore(s => s.datasets);
  const activeDataset = useAppStore(s => s.activeDataset);
  const setActiveDataset = useAppStore(s => s.setActiveDataset);
  const exportData = useAppStore(s => s.exportData);

  const handleDatasetChange = useCallback((datasetId: string) => {
    setActiveDataset(datasetId);
  }, [setActiveDataset]);

  const handleExport = useCallback((format: 'csv' | 'png' | 'pdf') => {
    exportData(activeDataset, format);
  }, [activeDataset, exportData]);

  return (
    <AppRoot>
      <Dashboard
        projectName="Enterprise Dashboard"
        datasets={datasets}
        activeDatasetId={activeDataset}
        onDatasetChange={handleDatasetChange}
        onExport={handleExport}
      />
    </AppRoot>
  );
};

export default function App() {
  return (
    <ThemeProvider initialMode="light">
      <DashboardAppContentWithStore />
    </ThemeProvider>
  );
}

*/

// ═══════════════════════════════════════════════════════════════════════════
// ALTERNATIVE: WITH CUSTOM VISUALIZATIONS
// ═══════════════════════════════════════════════════════════════════════════

/*

import styled from 'styled-components';
import { useTheme } from '@/styles';
import { Dashboard } from '@/components/Dashboard';
import SalesChart from '@/components/Charts/SalesChart';
import RegionalMap from '@/components/Charts/RegionalMap';
import MetricsGrid from '@/components/Charts/MetricsGrid';

const VisualizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${p => p.theme.spacing.lg};
  padding: ${p => p.theme.spacing.xl};

  @media (max-width: ${p => p.theme.breakpoints.lg}px) {
    grid-template-columns: 1fr;
    gap: ${p => p.theme.spacing.md};
  }
`;

const DashboardAppContentWithCharts: React.FC = () => {
  return (
    <AppRoot>
      <Dashboard projectName="Sales Dashboard">
        <VisualizationGrid>
          <SalesChart />
          <RegionalMap />
          <MetricsGrid />
        </VisualizationGrid>
      </Dashboard>
    </AppRoot>
  );
};

export default function App() {
  return (
    <ThemeProvider initialMode="light">
      <DashboardAppContentWithCharts />
    </ThemeProvider>
  );
}

*/

// ═══════════════════════════════════════════════════════════════════════════
// IMPLEMENTATION NOTES
// ═══════════════════════════════════════════════════════════════════════════

/*

KEY POINTS FOR INTEGRATION:

1. THEME PROVIDER HIERARCHY
   ├─ ThemeProvider (at root)
   │  └─ App Component
   │     └─ Dashboard
   │        └─ All child components have theme access

2. USING THEME IN COMPONENTS
   import { useTheme } from '@/styles';
   
   function MyComponent() {
     const { theme, mode, toggleTheme } = useTheme();
     return <div style={{ color: theme.colors.text.primary }} />;
   }

3. STYLING WITH DESIGN SYSTEM
   - Always use theme tokens instead of hardcoded colors
   - Use design system spacing: theme.spacing.xs, sm, md, lg, xl...
   - Use component presets: theme.componentBorderRadius.card, button, input...
   - Use animations: theme.transition.default, duration.fast, easing.material...

4. RESPONSIVE DESIGN
   - Use theme.breakpoints for media queries
   - Mobile-first approach recommended
   - Test on all 6 breakpoints: xs, sm, md, lg, xl, 2xl

5. STATE MANAGEMENT
   - Use callbacks to handle dataset changes
   - Implement proper error handling
   - Show loading states during data fetches
   - Use toast notifications for user feedback

6. ACCESSIBILITY
   - Use semantic HTML
   - Add ARIA labels to interactive elements
   - Ensure keyboard navigation works
   - Test with screen readers
   - Maintain WCAG AA contrast ratios

7. PERFORMANCE
   - Memoize expensive components with React.memo()
   - Use useCallback for event handlers
   - Lazy load heavy visualization libraries
   - Consider virtualization for large datasets

8. DATA INTEGRATION
   // Example: Fetch dataset and update visualizations
   async function loadDataset(datasetId: string) {
     try {
       const response = await fetch(`/api/datasets/${datasetId}`);
       const data = await response.json();
       
       // Update visualization store/state
       updateVisualizationData(data);
       
     } catch (error) {
       console.error('Failed to load dataset:', error);
       showErrorNotification('Failed to load dataset');
     }
   }

*/
