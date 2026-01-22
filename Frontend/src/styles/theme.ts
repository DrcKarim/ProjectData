/**
 * UNIFIED DESIGN SYSTEM EXPORT
 * Complete theme with light & dark modes
 * 
 * Usage:
 * - React: import { theme } from '@/styles/theme'
 * - CSS: :root { --theme: light | dark; }
 */

import { ColorPalette, LightThemeTokens, DarkThemeTokens } from './tokens/colors';
import { TypographyScale, FontFamily, FontWeights } from './tokens/typography';
import { Spacing, ComponentSpacing, Grid, Breakpoints, ZIndex, ResponsiveSpacing } from './tokens/spacing';
import { Shadows, ShadowsDark, ComponentShadows, Elevation } from './tokens/shadows';
import { BorderRadius, ComponentBorderRadius } from './tokens/borderRadius';
import { Duration, Easing, Transition, ComponentAnimations, Keyframes } from './tokens/animations';

// ============================================================================
// LIGHT THEME COMPLETE
// ============================================================================

export const LightTheme = {
  name: 'light' as const,
  colors: LightThemeTokens.colors,
  typography: TypographyScale,
  fontFamily: FontFamily,
  fontWeights: FontWeights,
  spacing: Spacing,
  componentSpacing: ComponentSpacing,
  grid: Grid,
  breakpoints: Breakpoints,
  zIndex: ZIndex,
  shadows: Shadows,
  elevation: Elevation,
  componentShadows: ComponentShadows,
  borderRadius: BorderRadius,
  componentBorderRadius: ComponentBorderRadius,
  duration: Duration,
  easing: Easing,
  transition: Transition,
  componentAnimations: ComponentAnimations,
} as const;

// ============================================================================
// DARK THEME COMPLETE
// ============================================================================

export const DarkTheme = {
  name: 'dark' as const,
  colors: DarkThemeTokens.colors,
  typography: TypographyScale,
  fontFamily: FontFamily,
  fontWeights: FontWeights,
  spacing: Spacing,
  componentSpacing: ComponentSpacing,
  grid: Grid,
  breakpoints: Breakpoints,
  zIndex: ZIndex,
  shadows: ShadowsDark,
  elevation: Elevation,
  componentShadows: ComponentShadows,
  borderRadius: BorderRadius,
  componentBorderRadius: ComponentBorderRadius,
  duration: Duration,
  easing: Easing,
  transition: Transition,
  componentAnimations: ComponentAnimations,
} as const;

// ============================================================================
// UNIFIED THEME OBJECT (for context/provider)
// ============================================================================

export const THEME = {
  light: LightTheme,
  dark: DarkTheme,
} as const;

export type Theme = typeof LightTheme;
export type ThemeMode = keyof typeof THEME;

// ============================================================================
// THEME PROVIDER SETUP (for React Context)
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  mode: ThemeMode;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  // Load saved theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.setAttribute('class', `theme-${mode}`);
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const value: ThemeContextType = {
    mode,
    theme: THEME[mode],
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ============================================================================
// CSS VARIABLES GENERATOR (for use in CSS/SCSS)
// ============================================================================

export const generateCSSVariables = (themeMode: ThemeMode): string => {
  const theme = THEME[themeMode];
  const colors = theme.colors;

  return `
    :root[data-theme="${themeMode}"] {
      /* Primary Colors */
      --color-primary: ${colors.interactive.primary};
      --color-primary-hover: ${colors.interactive.primaryHover};
      --color-primary-active: ${colors.interactive.primaryActive};
      --color-primary-disabled: ${colors.interactive.primaryDisabled};

      /* Secondary Colors */
      --color-secondary: ${colors.interactive.secondary};
      --color-secondary-hover: ${colors.interactive.secondaryHover};
      --color-secondary-active: ${colors.interactive.secondaryActive};
      --color-secondary-disabled: ${colors.interactive.secondaryDisabled};

      /* Accent Colors */
      --color-accent: ${colors.interactive.accent};
      --color-accent-hover: ${colors.interactive.accentHover};
      --color-accent-active: ${colors.interactive.accentActive};
      --color-accent-disabled: ${colors.interactive.accentDisabled};

      /* Semantic Colors */
      --color-success: ${colors.semantic.success};
      --color-warning: ${colors.semantic.warning};
      --color-error: ${colors.semantic.error};
      --color-info: ${colors.semantic.info};

      /* Text Colors */
      --color-text-primary: ${colors.text.primary};
      --color-text-secondary: ${colors.text.secondary};
      --color-text-tertiary: ${colors.text.tertiary};
      --color-text-disabled: ${colors.text.disabled};

      /* Background Colors */
      --color-bg-primary: ${colors.background.primary};
      --color-bg-secondary: ${colors.background.secondary};
      --color-bg-tertiary: ${colors.background.tertiary};

      /* Border Colors */
      --color-border-default: ${colors.border.default};
      --color-border-light: ${colors.border.light};
      --color-border-strong: ${colors.border.strong};

      /* Spacing */
      --spacing-xs: ${Spacing.xs};
      --spacing-sm: ${Spacing.sm};
      --spacing-md: ${Spacing.md};
      --spacing-lg: ${Spacing.lg};
      --spacing-xl: ${Spacing.xl};
      --spacing-2xl: ${Spacing['2xl']};
      --spacing-3xl: ${Spacing['3xl']};

      /* Border Radius */
      --radius-xs: ${BorderRadius.xs};
      --radius-sm: ${BorderRadius.sm};
      --radius-md: ${BorderRadius.md};
      --radius-lg: ${BorderRadius.lg};
      --radius-xl: ${BorderRadius.xl};
      --radius-2xl: ${BorderRadius['2xl']};
      --radius-full: ${BorderRadius.full};

      /* Shadows */
      --shadow-xs: ${themeMode === 'light' ? Shadows.xs : ShadowsDark.xs};
      --shadow-sm: ${themeMode === 'light' ? Shadows.sm : ShadowsDark.sm};
      --shadow-md: ${themeMode === 'light' ? Shadows.md : ShadowsDark.md};
      --shadow-lg: ${themeMode === 'light' ? Shadows.lg : ShadowsDark.lg};
      --shadow-xl: ${themeMode === 'light' ? Shadows.xl : ShadowsDark.xl};

      /* Duration */
      --duration-fast: ${Duration.fast};
      --duration-base: ${Duration.base};
      --duration-slow: ${Duration.slow};

      /* Easing */
      --easing-material: ${Easing.material};
    }
  `;
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

export const media = {
  xs: `@media (min-width: ${Breakpoints.xs})`,
  sm: `@media (min-width: ${Breakpoints.sm})`,
  md: `@media (min-width: ${Breakpoints.md})`,
  lg: `@media (min-width: ${Breakpoints.lg})`,
  xl: `@media (min-width: ${Breakpoints.xl})`,
  '2xl': `@media (min-width: ${Breakpoints['2xl']})`,

  // Mobile-first up to (max-width)
  maxXs: `@media (max-width: ${Breakpoints.xs})`,
  maxSm: `@media (max-width: ${Breakpoints.sm})`,
  maxMd: `@media (max-width: ${Breakpoints.md})`,
  maxLg: `@media (max-width: ${Breakpoints.lg})`,
  maxXl: `@media (max-width: ${Breakpoints.xl})`,

  // Ranges
  between: (min: string, max: string) =>
    `@media (min-width: ${min}) and (max-width: ${max})`,
} as const;

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/shadows';
export * from './tokens/borderRadius';
export * from './tokens/animations';
