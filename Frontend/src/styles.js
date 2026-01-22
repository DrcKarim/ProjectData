/**
 * Theme Configuration for Styled Components
 */

const baseTheme = {
  typography: {
    sizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  animations: {
    durations: {
      fast: 150,
      normal: 300,
      standard: 300,
      slow: 500,
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export const LightTheme = {
  ...baseTheme,
  mode: 'light',
  colors: {
    primary: '#1976d2',
    primaryDark: '#1565c0',
    primaryLight: '#42a5f5',
    secondary: '#dc004e',
    secondaryDark: '#c51162',
    secondaryLight: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    background: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    backgroundTertiary: '#fafafa',
    surface: '#ffffff',
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9e9e9e',
    border: {
      default: '#e0e0e0',
      light: '#f0f0f0',
      dark: '#bdbdbd',
    },
    hover: '#f5f5f5',
    active: '#e0e0e0',
    disabled: '#e0e0e0',
    divider: '#e0e0e0',
    semantic: {
      success: {
        main: '#4caf50',
        light: '#e8f5e9',
        dark: '#2e7d32',
      },
      warning: {
        main: '#ff9800',
        light: '#fff3e0',
        dark: '#e65100',
      },
      error: {
        main: '#f44336',
        light: '#ffebee',
        dark: '#c62828',
      },
      info: {
        main: '#2196f3',
        light: '#e3f2fd',
        dark: '#1565c0',
      },
    },
  },
};

export const DarkTheme = {
  ...baseTheme,
  mode: 'dark',
  colors: {
    primary: '#90caf9',
    primaryDark: '#42a5f5',
    primaryLight: '#e3f2fd',
    secondary: '#f48fb1',
    secondaryDark: '#f06292',
    secondaryLight: '#fce4ec',
    success: '#81c784',
    warning: '#ffb74d',
    error: '#e57373',
    info: '#64b5f6',
    background: '#121212',
    backgroundSecondary: '#1e1e1e',
    backgroundTertiary: '#2c2c2c',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#808080',
    border: {
      default: '#424242',
      light: '#616161',
      dark: '#212121',
    },
    hover: '#2c2c2c',
    active: '#424242',
    disabled: '#424242',
    divider: '#424242',
    semantic: {
      success: {
        main: '#81c784',
        light: '#1b5e20',
        dark: '#2e7d32',
      },
      warning: {
        main: '#ffb74d',
        light: '#e65100',
        dark: '#ff6f00',
      },
      error: {
        main: '#e57373',
        light: '#b71c1c',
        dark: '#c62828',
      },
      info: {
        main: '#64b5f6',
        light: '#0d47a1',
        dark: '#1565c0',
      },
    },
  },
};

export default LightTheme;
