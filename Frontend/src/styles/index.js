/**
 * DESIGN SYSTEM - JavaScript Export
 * Theme definitions for JavaScript components
 */

// Light Theme
export const LightTheme = {
  name: 'light',
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f5f5f5',
      overlay: 'rgba(0, 0, 0, 0.5)',
      hover: '#f5f5f5',
    },
    text: {
      primary: '#171717',
      secondary: '#525252',
      tertiary: '#737373',
      disabled: '#a3a3a3',
      inverse: '#ffffff',
    },
    border: {
      default: '#e5e5e5',
      subtle: '#f5f5f5',
      strong: '#a3a3a3',
    },
    primary: {
      main: '#667eea',
      light: '#8b9ef5',
      dark: '#4c5fd8',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9370c7',
      dark: '#5a3780',
      contrast: '#ffffff',
    },
    accent: {
      main: '#ff7a4a',
      light: '#ff9770',
      dark: '#e65c30',
      contrast: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
      contrast: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrast: '#ffffff',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  breakpoints: {
    xs: 320,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  transition: {
    fast: '150ms ease',
    default: '250ms ease',
    slow: '350ms ease',
  },
  duration: {
    fast: '150ms',
    default: '250ms',
    slow: '350ms',
  },
  easing: {
    default: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    material: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Dark Theme
export const DarkTheme = {
  name: 'dark',
  colors: {
    background: {
      primary: '#171717',
      secondary: '#262626',
      tertiary: '#404040',
      overlay: 'rgba(0, 0, 0, 0.8)',
      hover: '#262626',
    },
    text: {
      primary: '#fafafa',
      secondary: '#d4d4d4',
      tertiary: '#a3a3a3',
      disabled: '#737373',
      inverse: '#171717',
    },
    border: {
      default: '#404040',
      subtle: '#262626',
      strong: '#737373',
    },
    primary: {
      main: '#8b9ef5',
      light: '#a8b7f8',
      dark: '#667eea',
      contrast: '#ffffff',
    },
    secondary: {
      main: '#9370c7',
      light: '#b08ee0',
      dark: '#764ba2',
      contrast: '#ffffff',
    },
    accent: {
      main: '#ff9770',
      light: '#ffb196',
      dark: '#ff7a4a',
      contrast: '#ffffff',
    },
    success: {
      main: '#4ade80',
      light: '#86efac',
      dark: '#22c55e',
      contrast: '#ffffff',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#ef4444',
      contrast: '#ffffff',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  breakpoints: {
    xs: 320,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  transition: {
    fast: '150ms ease',
    default: '250ms ease',
    slow: '350ms ease',
  },
  duration: {
    fast: '150ms',
    default: '250ms',
    slow: '350ms',
  },
  easing: {
    default: 'ease',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    material: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Default theme (light)
export const defaultTheme = LightTheme;
