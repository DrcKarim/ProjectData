/**
 * TYPOGRAPHY SYSTEM
 * Enterprise-grade typographic scale
 * 
 * Based on:
 * - 16px base font size
 * - 1.125 modular scale (minor third)
 * - Careful font weight hierarchy
 */

export type FontWeight =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | 'display';

export type LineHeight = 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

export type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';

// ============================================================================
// FONT FAMILY
// ============================================================================

export const FontFamily = {
  // Primary: Clean, modern, professional
  sans: `
    -apple-system, 
    BlinkMacSystemFont, 
    'Segoe UI', 
    'Roboto', 
    'Oxygen', 
    'Ubuntu', 
    'Cantarell', 
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif
  `,

  // For code and data display
  mono: `
    'Monaco',
    'Menlo',
    'Ubuntu Mono',
    'Consolas',
    'source-code-pro',
    monospace
  `,

  // Display: Headlines, branding (optional premium font)
  display: `
    'Inter',
    -apple-system, 
    BlinkMacSystemFont, 
    'Segoe UI',
    sans-serif
  `,
} as const;

// ============================================================================
// FONT WEIGHTS
// ============================================================================

export const FontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

// ============================================================================
// FONT SIZES & LINE HEIGHTS
// ============================================================================

export const TypographyScale = {
  // Display - Largest headlines
  display: {
    fontSize: '48px',
    lineHeight: '60px',
    letterSpacing: '-1px',
    fontWeight: FontWeights.bold,
    fontFamily: FontFamily.display,
  },

  // Heading 1 - Page titles
  h1: {
    fontSize: '42px',
    lineHeight: '52px',
    letterSpacing: '-0.8px',
    fontWeight: FontWeights.bold,
    fontFamily: FontFamily.display,
  },

  // Heading 2 - Section titles
  h2: {
    fontSize: '32px',
    lineHeight: '40px',
    letterSpacing: '-0.5px',
    fontWeight: FontWeights.bold,
    fontFamily: FontFamily.display,
  },

  // Heading 3 - Subsection titles
  h3: {
    fontSize: '28px',
    lineHeight: '36px',
    letterSpacing: '-0.3px',
    fontWeight: FontWeights.semibold,
    fontFamily: FontFamily.display,
  },

  // Heading 4 - Component titles
  h4: {
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '-0.2px',
    fontWeight: FontWeights.semibold,
    fontFamily: FontFamily.sans,
  },

  // Heading 5 - Card titles
  h5: {
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '-0.1px',
    fontWeight: FontWeights.semibold,
    fontFamily: FontFamily.sans,
  },

  // Heading 6 - Small titles
  h6: {
    fontSize: '18px',
    lineHeight: '26px',
    letterSpacing: '0px',
    fontWeight: FontWeights.semibold,
    fontFamily: FontFamily.sans,
  },

  // Body - Large body text
  body1: {
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0px',
    fontWeight: FontWeights.normal,
    fontFamily: FontFamily.sans,
  },

  // Body - Regular body text
  body2: {
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0px',
    fontWeight: FontWeights.normal,
    fontFamily: FontFamily.sans,
  },

  // Body - Small body text
  body3: {
    fontSize: '13px',
    lineHeight: '20px',
    letterSpacing: '0px',
    fontWeight: FontWeights.normal,
    fontFamily: FontFamily.sans,
  },

  // Label - Button text, form labels
  label: {
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.3px',
    fontWeight: FontWeights.medium,
    fontFamily: FontFamily.sans,
  },

  // Label Small - Badges, tags
  labelSmall: {
    fontSize: '12px',
    lineHeight: '18px',
    letterSpacing: '0.5px',
    fontWeight: FontWeights.medium,
    fontFamily: FontFamily.sans,
  },

  // Caption - Metadata, help text
  caption: {
    fontSize: '12px',
    lineHeight: '18px',
    letterSpacing: '0px',
    fontWeight: FontWeights.normal,
    fontFamily: FontFamily.sans,
  },

  // Overline - Small caps, metadata
  overline: {
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '1.5px',
    fontWeight: FontWeights.semibold,
    fontFamily: FontFamily.sans,
    textTransform: 'uppercase' as const,
  },

  // Code - Monospace
  code: {
    fontSize: '13px',
    lineHeight: '20px',
    letterSpacing: '0px',
    fontWeight: FontWeights.normal,
    fontFamily: FontFamily.mono,
  },

  // Code Small
  codeSmall: {
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0px',
    fontWeight: FontWeights.normal,
    fontFamily: FontFamily.mono,
  },
} as const;

// ============================================================================
// LINE HEIGHT SCALE
// ============================================================================

export const LineHeights = {
  tight: 1.0,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2.0,
} as const;

// ============================================================================
// LETTER SPACING SCALE
// ============================================================================

export const LetterSpacings = {
  tighter: '-0.8px',
  tight: '-0.3px',
  normal: '0px',
  wide: '0.3px',
  wider: '1.5px',
} as const;

// ============================================================================
// CSS CLASSES FOR TYPOGRAPHY (Optional utility export)
// ============================================================================

export const typographyClasses = {
  display:
    'text-display font-display text-4xl font-bold leading-[60px] tracking-tight',
  h1: 'text-h1 font-display text-5xl font-bold leading-tight tracking-tight',
  h2: 'text-h2 font-display text-4xl font-bold leading-tight tracking-tight',
  h3: 'text-h3 font-display text-3xl font-semibold leading-9 tracking-tight',
  h4: 'text-h4 font-sans text-2xl font-semibold leading-8',
  h5: 'text-h5 font-sans text-xl font-semibold leading-7',
  h6: 'text-h6 font-sans text-lg font-semibold leading-6',
  body1: 'text-body1 font-sans text-base font-normal leading-6',
  body2: 'text-body2 font-sans text-sm font-normal leading-5',
  body3: 'text-body3 font-sans text-xs font-normal leading-5',
  label: 'text-label font-sans text-sm font-medium leading-5 tracking-wider',
  labelSmall:
    'text-labelSmall font-sans text-xs font-medium leading-4 tracking-wider',
  caption: 'text-caption font-sans text-xs font-normal leading-4',
  overline:
    'text-overline font-sans text-xs font-semibold leading-4 uppercase tracking-widest',
  code: 'text-code font-mono text-sm font-normal leading-5',
  codeSmall: 'text-codeSmall font-mono text-xs font-normal leading-4',
} as const;
