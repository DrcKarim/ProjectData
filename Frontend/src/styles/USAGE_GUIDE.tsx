/**
 * DESIGN SYSTEM USAGE GUIDE
 * Complete examples for implementing the enterprise design system
 * 
 * Quick Reference for Common Tasks
 */

// ============================================================================
// 1. REACT APP SETUP
// ============================================================================

// App.tsx
import React from 'react';
import { ThemeProvider, useTheme } from './theme';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <div style={{ color: theme.colors.text.primary }}>
      {/* App content */}
      <button onClick={toggleTheme}>Toggle Theme ({mode})</button>
    </div>
  );
}

// ============================================================================
// 2. USING COLORS IN COMPONENTS
// ============================================================================

import { useTheme } from './theme';

// React Component Example
function Button() {
  const { theme } = useTheme();

  return (
    <button
      style={{
        backgroundColor: theme.colors.interactive.primary,
        color: theme.colors.text.inverse,
        padding: theme.spacing.md,
        borderRadius: theme.componentBorderRadius.button.default,
        border: 'none',
        cursor: 'pointer',
        transition: theme.transition.default,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor =
          theme.colors.interactive.primaryHover;
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }}
    >
      Click Me
    </button>
  );
}

// ============================================================================
// 3. TYPOGRAPHY USAGE
// ============================================================================

import styled from 'styled-components';
import { useTheme } from './theme';

const Title = styled.h1`
  font-size: ${(props) => props.theme.typography.h1.fontSize};
  font-weight: ${(props) => props.theme.typography.h1.fontWeight};
  line-height: ${(props) => props.theme.typography.h1.lineHeight};
  letter-spacing: ${(props) => props.theme.typography.h1.letterSpacing};
  color: ${(props) => props.theme.colors.text.primary};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const Body = styled.p`
  font-size: ${(props) => props.theme.typography.body1.fontSize};
  line-height: ${(props) => props.theme.typography.body1.lineHeight};
  color: ${(props) => props.theme.colors.text.secondary};
`;

// ============================================================================
// 4. SPACING & LAYOUT
// ============================================================================

import styled from 'styled-components';

const Card = styled.div`
  padding: ${(props) => props.theme.componentSpacing.padding.card};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.colors.background.secondary};
  border-radius: ${(props) => props.theme.componentBorderRadius.card.default};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.theme.grid.layouts.cols12}, 1fr);
  gap: ${(props) => props.theme.grid.gutter.normal};

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(${(props) => props.theme.grid.layouts.cols8}, 1fr);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${(props) => props.theme.grid.layouts.cols4}, 1fr);
  }
`;

// ============================================================================
// 5. SHADOWS & ELEVATION
// ============================================================================

const ElevatedCard = styled.div`
  background: ${(props) => props.theme.colors.background.primary};
  border-radius: ${(props) => props.theme.componentBorderRadius.card.default};
  box-shadow: ${(props) => props.theme.componentShadows.card.rest};
  padding: ${(props) => props.theme.spacing.lg};
  transition: ${(props) => props.theme.transition.default};

  &:hover {
    box-shadow: ${(props) => props.theme.componentShadows.card.hover};
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: ${(props) => props.theme.componentShadows.card.active};
  }
`;

// ============================================================================
// 6. ANIMATIONS & TRANSITIONS
// ============================================================================

const AnimatedButton = styled.button`
  background: ${(props) => props.theme.colors.interactive.primary};
  color: ${(props) => props.theme.colors.text.inverse};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.componentBorderRadius.button.default};
  border: none;
  cursor: pointer;

  /* Smooth transitions on all properties */
  transition: ${(props) => props.theme.transition.allFast};

  &:hover {
    background: ${(props) => props.theme.colors.interactive.primaryHover};
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  &:active {
    background: ${(props) => props.theme.colors.interactive.primaryActive};
    transform: scale(0.98);
  }

  &:disabled {
    background: ${(props) => props.theme.colors.interactive.primaryDisabled};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// ============================================================================
// 7. CSS VARIABLES APPROACH (No styled-components)
// ============================================================================

// styles/global.css
:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #ff7a4a;
  --color-success: #22c55e;
  --color-error: #ef4444;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;

  --easing: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme='dark'] {
  --color-primary: #7c95ff;
  --color-secondary: #d9c7ff;
  --color-accent: #ff9a6c;
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
}

/* Component Usage */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--easing);
  box-shadow: var(--shadow-sm);
}

.button:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

// ============================================================================
// 8. RESPONSIVE STYLING
// ============================================================================

const ResponsiveContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.responsive.mobile.containerPadding};

  /* Tablet */
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    padding: ${(props) => props.theme.responsive.tablet.containerPadding};
    gap: ${(props) => props.theme.spacing.lg};
  }

  /* Desktop */
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    padding: ${(props) => props.theme.responsive.desktop.containerPadding};
    gap: ${(props) => props.theme.spacing.xl};
  }
`;

// ============================================================================
// 9. FORM COMPONENTS
// ============================================================================

const Input = styled.input`
  padding: ${(props) => props.theme.componentSpacing.padding.input};
  font-size: ${(props) => props.theme.typography.body2.fontSize};
  border: 1px solid ${(props) => props.theme.colors.border.default};
  border-radius: ${(props) => props.theme.componentBorderRadius.input.default};
  background: ${(props) => props.theme.colors.background.primary};
  color: ${(props) => props.theme.colors.text.primary};
  transition: ${(props) => props.theme.transition.color};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.interactive.primary};
    box-shadow: ${(props) => props.theme.shadows.focus};
    background: ${(props) => props.theme.colors.background.secondary};
  }

  &:disabled {
    background: ${(props) => props.theme.colors.background.tertiary};
    color: ${(props) => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.text.tertiary};
  }
`;

// ============================================================================
// 10. CHART THEMING
// ============================================================================

import { LightTheme, DarkTheme } from './theme';

function ChartComponent({ isDark }) {
  const theme = isDark ? DarkTheme : LightTheme;

  const echartsOption = {
    color: theme.colors.chart,
    backgroundColor: theme.colors.background.primary,
    textStyle: {
      color: theme.colors.text.primary,
      fontFamily: theme.fontFamily.sans,
    },
    title: {
      textStyle: {
        color: theme.colors.text.primary,
      },
    },
    legend: {
      textStyle: {
        color: theme.colors.text.secondary,
      },
    },
    tooltip: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.border.default,
      textStyle: {
        color: theme.colors.text.primary,
      },
    },
    grid: {
      borderColor: theme.colors.border.light,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: theme.colors.border.default,
        },
      },
      axisLabel: {
        color: theme.colors.text.secondary,
      },
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: theme.colors.border.default,
        },
      },
      axisLabel: {
        color: theme.colors.text.secondary,
      },
      splitLine: {
        lineStyle: {
          color: theme.colors.border.light,
        },
      },
    },
  };

  return <EChart option={echartsOption} />;
}

// ============================================================================
// 11. ACCESSIBILITY CONSIDERATIONS
// ============================================================================

const AccessibleButton = styled.button`
  /* Sufficient color contrast */
  color: ${(props) => props.theme.colors.text.inverse};
  background: ${(props) => props.theme.colors.interactive.primary};

  /* Focus visible for keyboard users */
  &:focus-visible {
    outline: 3px solid ${(props) => props.theme.colors.interactive.primary};
    outline-offset: 2px;
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* Large enough touch target (minimum 44x44px) */
  min-height: 44px;
  min-width: 44px;
  padding: ${(props) => props.theme.spacing.md};
`;

// ============================================================================
// 12. DARK MODE DETECTION
// ============================================================================

import { useEffect, useState } from 'react';

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';

    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDark;
}

// ============================================================================
// 13. DESIGN TOKENS IN TAILWIND (tailwind.config.ts)
// ============================================================================

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          500: '#667eea',
          900: '#283593',
        },
        secondary: {
          50: '#f8f5ff',
          500: '#764ba2',
          900: '#463371',
        },
        accent: {
          50: '#fff5f0',
          500: '#ff7a4a',
          900: '#c83a16',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        material: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
};
