/**
 * ENTERPRISE DESIGN SYSTEM
 * Professional Data Visualization Platform
 * 
 * Color Palette inspired by financial/analytics dashboards
 * Reference: Corporate SaaS platforms (Tableau, Looker, Microsoft Power BI)
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const ColorPalette = {
  // PRIMARY - Blue (Trustworthy, Professional, Tech-focused)
  primary: {
    50: '#f0f5ff',
    100: '#e0ebff',
    200: '#c1d5ff',
    300: '#a2b9ff',
    400: '#7b95ff',
    500: '#667eea',      // PRIMARY
    600: '#5b6fd9',
    700: '#4a5cc8',
    800: '#3949ab',
    900: '#283593',
  },

  // SECONDARY - Purple (Innovation, Creativity)
  secondary: {
    50: '#f8f5ff',
    100: '#f3ebff',
    200: '#e6d9ff',
    300: '#d9c7ff',
    400: '#cc99ff',
    500: '#764ba2',      // SECONDARY
    600: '#6a4596',
    700: '#5e3f8a',
    800: '#52397d',
    900: '#463371',
  },

  // ACCENT - Orange/Coral (Call-to-action, Energy, Highlights)
  accent: {
    50: '#fff5f0',
    100: '#ffe8e0',
    200: '#ffd1c1',
    300: '#ffba9d',
    400: '#ff9a6c',
    500: '#ff7a4a',      // ACCENT
    600: '#f76b3d',
    700: '#ef5c30',
    800: '#e74c23',
    900: '#c83a16',
  },

  // SEMANTIC COLORS
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#b8f3d5',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',      // SUCCESS
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',      // WARNING
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',      // ERROR
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',      // INFO
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // NEUTRAL - Grayscale (Text, Borders, Backgrounds)
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    150: '#f0f0f0',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',       // NEUTRAL
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
} as const;

// ============================================================================
// LIGHT THEME
// ============================================================================

export const LightThemeTokens = {
  colors: {
    // Backgrounds
    background: {
      primary: ColorPalette.neutral[0],      // White
      secondary: ColorPalette.neutral[50],   // Very light gray
      tertiary: ColorPalette.neutral[100],   // Light gray
      overlay: 'rgba(0, 0, 0, 0.5)',
      hover: ColorPalette.neutral[100],
    },

    // Text
    text: {
      primary: ColorPalette.neutral[900],    // Nearly black
      secondary: ColorPalette.neutral[600],  // Medium gray
      tertiary: ColorPalette.neutral[500],   // Gray
      disabled: ColorPalette.neutral[400],   // Light gray
      inverse: ColorPalette.neutral[0],      // White
    },

    // Borders
    border: {
      default: ColorPalette.neutral[200],
      light: ColorPalette.neutral[150],
      strong: ColorPalette.neutral[300],
    },

    // Interactive
    interactive: {
      primary: ColorPalette.primary[500],
      primaryHover: ColorPalette.primary[600],
      primaryActive: ColorPalette.primary[700],
      primaryDisabled: ColorPalette.primary[200],

      secondary: ColorPalette.secondary[500],
      secondaryHover: ColorPalette.secondary[600],
      secondaryActive: ColorPalette.secondary[700],
      secondaryDisabled: ColorPalette.secondary[200],

      accent: ColorPalette.accent[500],
      accentHover: ColorPalette.accent[600],
      accentActive: ColorPalette.accent[700],
      accentDisabled: ColorPalette.accent[200],

      danger: ColorPalette.error[500],
      dangerHover: ColorPalette.error[600],
      dangerActive: ColorPalette.error[700],

      success: ColorPalette.success[500],
      successHover: ColorPalette.success[600],

      warning: ColorPalette.warning[500],
      warningHover: ColorPalette.warning[600],

      info: ColorPalette.info[500],
      infoHover: ColorPalette.info[600],
    },

    // Semantic
    semantic: {
      success: ColorPalette.success[500],
      warning: ColorPalette.warning[500],
      error: ColorPalette.error[500],
      info: ColorPalette.info[500],
    },

    // Chart colors (categorical)
    chart: [
      ColorPalette.primary[500],
      ColorPalette.secondary[500],
      ColorPalette.accent[500],
      ColorPalette.success[500],
      ColorPalette.info[500],
      ColorPalette.warning[500],
      ColorPalette.primary[700],
      ColorPalette.secondary[700],
    ],
  },
} as const;

// ============================================================================
// DARK THEME
// ============================================================================

export const DarkThemeTokens = {
  colors: {
    // Backgrounds
    background: {
      primary: ColorPalette.neutral[900],    // Almost black
      secondary: ColorPalette.neutral[800],  // Dark gray
      tertiary: ColorPalette.neutral[700],   // Medium dark
      overlay: 'rgba(0, 0, 0, 0.8)',
      hover: ColorPalette.neutral[800],
    },

    // Text
    text: {
      primary: ColorPalette.neutral[50],     // Almost white
      secondary: ColorPalette.neutral[300],  // Light gray
      tertiary: ColorPalette.neutral[400],   // Medium gray
      disabled: ColorPalette.neutral[500],   // Gray
      inverse: ColorPalette.neutral[900],    // Nearly black
    },

    // Borders
    border: {
      default: ColorPalette.neutral[700],
      light: ColorPalette.neutral[600],
      strong: ColorPalette.neutral[800],
    },

    // Interactive
    interactive: {
      primary: ColorPalette.primary[400],
      primaryHover: ColorPalette.primary[300],
      primaryActive: ColorPalette.primary[200],
      primaryDisabled: ColorPalette.primary[800],

      secondary: ColorPalette.secondary[400],
      secondaryHover: ColorPalette.secondary[300],
      secondaryActive: ColorPalette.secondary[200],
      secondaryDisabled: ColorPalette.secondary[800],

      accent: ColorPalette.accent[400],
      accentHover: ColorPalette.accent[300],
      accentActive: ColorPalette.accent[200],
      accentDisabled: ColorPalette.accent[800],

      danger: ColorPalette.error[400],
      dangerHover: ColorPalette.error[300],
      dangerActive: ColorPalette.error[200],

      success: ColorPalette.success[400],
      successHover: ColorPalette.success[300],

      warning: ColorPalette.warning[400],
      warningHover: ColorPalette.warning[300],

      info: ColorPalette.info[400],
      infoHover: ColorPalette.info[300],
    },

    // Semantic
    semantic: {
      success: ColorPalette.success[400],
      warning: ColorPalette.warning[400],
      error: ColorPalette.error[400],
      info: ColorPalette.info[400],
    },

    // Chart colors (categorical)
    chart: [
      ColorPalette.primary[400],
      ColorPalette.secondary[400],
      ColorPalette.accent[400],
      ColorPalette.success[400],
      ColorPalette.info[400],
      ColorPalette.warning[400],
      ColorPalette.primary[300],
      ColorPalette.secondary[300],
    ],
  },
} as const;
