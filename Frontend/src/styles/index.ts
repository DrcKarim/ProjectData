/**
 * DESIGN SYSTEM - MAIN EXPORT
 * 
 * Usage:
 * import { theme, useTheme, THEME } from '@/styles'
 */

// Re-export all tokens
export * from './tokens/colors';
export * from './tokens/typography';
export * from './tokens/spacing';
export * from './tokens/shadows';
export * from './tokens/borderRadius';
export * from './tokens/animations';

// Re-export theme & utilities
export {
  THEME,
  LightTheme,
  DarkTheme,
  useTheme,
  ThemeProvider,
  ThemeContext,
  generateCSSVariables,
  media,
} from './theme';

export type { Theme, ThemeMode } from './theme';
