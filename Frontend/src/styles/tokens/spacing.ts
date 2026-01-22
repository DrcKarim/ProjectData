/**
 * SPACING SYSTEM
 * 8px base unit (established standard for enterprise UI)
 * 
 * Provides:
 * - Consistent vertical/horizontal rhythm
 * - Predictable layout grid
 * - Easy mobile responsiveness scaling
 */

// ============================================================================
// SPACING SCALE (8px base)
// ============================================================================

export const Spacing = {
  // Micro
  xs: '4px',      // 0.5 unit - minimal spacing
  sm: '8px',      // 1 unit - base unit
  md: '16px',     // 2 units
  lg: '24px',     // 3 units
  xl: '32px',     // 4 units
  '2xl': '40px',  // 5 units
  '3xl': '48px',  // 6 units
  '4xl': '56px',  // 7 units
  '5xl': '64px',  // 8 units
  '6xl': '80px',  // 10 units
  '7xl': '96px',  // 12 units

  // Aliases for clarity
  none: '0px',
  auto: 'auto',

  // Negative values (for margin collapsing)
  'neg-xs': '-4px',
  'neg-sm': '-8px',
  'neg-md': '-16px',
  'neg-lg': '-24px',
  'neg-xl': '-32px',
} as const;

// ============================================================================
// COMPONENT SPECIFIC SPACING
// ============================================================================

export const ComponentSpacing = {
  // Padding
  padding: {
    button: Spacing.sm,          // 8px
    input: Spacing.md,           // 16px
    card: Spacing.lg,            // 24px
    panel: Spacing.xl,           // 32px
    section: Spacing['2xl'],     // 40px
    page: Spacing['3xl'],        // 48px
  },

  // Margin
  margin: {
    buttonGroup: Spacing.sm,     // 8px between buttons
    fieldGroup: Spacing.md,      // 16px between form fields
    sectionGroup: Spacing.lg,    // 24px between sections
    pageSection: Spacing.xl,     // 32px between major sections
  },

  // Gap (for flexbox/grid)
  gap: {
    xs: Spacing.xs,              // 4px
    compact: Spacing.sm,         // 8px
    normal: Spacing.md,          // 16px
    spacious: Spacing.lg,        // 24px
    relaxed: Spacing.xl,         // 32px
    loose: Spacing['2xl'],       // 40px
  },

  // Icon spacing
  icon: {
    standalone: Spacing.md,      // 16px
    withText: Spacing.sm,        // 8px
    group: Spacing.xs,           // 4px
  },

  // Avatar spacing
  avatar: {
    standalone: Spacing.lg,      // 24px
    group: Spacing.md,           // 16px (overlapping)
  },

  // Modal/Drawer spacing
  modal: {
    padding: Spacing['2xl'],     // 40px
    paddingSmall: Spacing.xl,    // 32px
    gap: Spacing.lg,             // 24px
  },

  // Sidebar/Navigation spacing
  sidebar: {
    itemPadding: Spacing.md,     // 16px
    itemMargin: Spacing.xs,      // 4px
    sectionGap: Spacing.lg,      // 24px
  },

  // Chart spacing
  chart: {
    titleMargin: Spacing.lg,     // 24px
    legendMargin: Spacing.md,    // 16px
    annotationMargin: Spacing.sm, // 8px
  },
} as const;

// ============================================================================
// RESPONSIVE SPACING (Scaling multipliers)
// ============================================================================

export const ResponsiveSpacing = {
  // Mobile-first approach
  mobile: {
    containerPadding: Spacing.md,       // 16px
    sectionGap: Spacing.lg,             // 24px
    cardPadding: Spacing.md,            // 16px
  },

  // Tablet
  tablet: {
    containerPadding: Spacing.lg,       // 24px
    sectionGap: Spacing.xl,             // 32px
    cardPadding: Spacing.lg,            // 24px
  },

  // Desktop
  desktop: {
    containerPadding: Spacing.xl,       // 32px
    sectionGap: Spacing['2xl'],         // 40px
    cardPadding: Spacing.xl,            // 32px
  },

  // Large screens (e.g., 1440px+)
  xl: {
    containerPadding: Spacing['2xl'],   // 40px
    sectionGap: Spacing['3xl'],         // 48px
    cardPadding: Spacing['2xl'],        // 40px
  },
} as const;

// ============================================================================
// LAYOUT GRID
// ============================================================================

export const Grid = {
  // Standard column widths for dashboard/content layout
  columns: {
    full: '100%',
    half: '50%',
    third: '33.333%',
    twoThirds: '66.666%',
    quarter: '25%',
    threeQuarters: '75%',
  },

  // Predefined grid configurations
  layouts: {
    // 12-column grid (most flexible)
    cols12: 12,

    // 8-column grid (standard dashboard)
    cols8: 8,

    // 6-column grid (mobile-friendly)
    cols6: 6,

    // 4-column grid (simplest)
    cols4: 4,
  },

  // Gutters (space between grid items)
  gutter: {
    compact: Spacing.sm,       // 8px
    normal: Spacing.md,        // 16px
    spacious: Spacing.lg,      // 24px
    relaxed: Spacing.xl,       // 32px
  },

  // Container max-widths
  container: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Content max-widths
  contentWidth: {
    narrow: '600px',
    normal: '800px',
    wide: '1000px',
  },
} as const;

// ============================================================================
// BREAKPOINTS (for responsive design)
// ============================================================================

export const Breakpoints = {
  // Mobile-first breakpoints
  xs: '320px',    // Extra small devices
  sm: '640px',    // Small devices (landscape phones)
  md: '768px',    // Medium devices (tablets)
  lg: '1024px',   // Large devices (small laptops)
  xl: '1280px',   // Extra large (standard desktop)
  '2xl': '1536px', // Ultra large (4K displays)

  // Named breakpoints for readability
  mobile: '320px',
  mobileLandscape: '640px',
  tablet: '768px',
  desktop: '1024px',
  widescreen: '1280px',
  ultrawide: '1536px',
} as const;

// ============================================================================
// Z-INDEX SCALE (Stacking layers)
// ============================================================================

export const ZIndex = {
  // Foundation
  hide: -1,
  base: 0,

  // Component layers
  default: 1,
  overlay: 10,
  modal: 40,
  popover: 30,
  tooltip: 50,
  dropdown: 20,

  // Fixed/sticky elements
  sticky: 100,
  fixed: 110,
  stickyHeader: 120,

  // Notifications & alerts
  notification: 140,
  toast: 150,

  // Debug/dev tools
  debug: 9999,
} as const;
