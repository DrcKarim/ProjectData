/**
 * BORDER RADIUS SYSTEM
 * Balanced curve hierarchy for professional appearance
 * 
 * Different radii for different contexts:
 * - Components (buttons, inputs, cards)
 * - Containers (modals, panels)
 * - Special (avatars, badges)
 */

// ============================================================================
// BORDER RADIUS SCALE
// ============================================================================

export const BorderRadius = {
  // Minimal - Subtle rounding (almost square)
  none: '0px',
  xs: '2px',

  // Small - Slightly rounded
  sm: '4px',

  // Standard - Default component rounding
  md: '6px',

  // Medium - Noticeable rounding
  lg: '8px',

  // Large - Prominent rounding (cards, containers)
  xl: '12px',

  // Extra large - Gentle rounding (large panels, modals)
  '2xl': '16px',

  // Full circle (pills, avatars)
  full: '9999px',
} as const;

// ============================================================================
// COMPONENT SPECIFIC BORDER RADIUS
// ============================================================================

export const ComponentBorderRadius = {
  // Buttons
  button: {
    default: BorderRadius.md,      // 6px - Standard button
    small: BorderRadius.sm,        // 4px - Compact button
    large: BorderRadius.lg,        // 8px - Large button
    pill: BorderRadius.full,       // Full - Pill-shaped (full width)
  },

  // Inputs & Forms
  input: {
    default: BorderRadius.md,      // 6px - Text input
    small: BorderRadius.sm,        // 4px - Small input
    large: BorderRadius.lg,        // 8px - Large input
  },

  // Cards
  card: {
    default: BorderRadius.lg,      // 8px - Standard card
    compact: BorderRadius.md,      // 6px - Compact card
    prominent: BorderRadius.xl,    // 12px - Hero card
  },

  // Containers & Panels
  container: {
    default: BorderRadius.lg,      // 8px - Standard container
    panel: BorderRadius.xl,        // 12px - Side panel
    modal: BorderRadius['2xl'],    // 16px - Modal dialog
    drawer: BorderRadius.lg,       // 8px - Side drawer
  },

  // Badges & Tags
  badge: {
    default: BorderRadius.sm,      // 4px - Rectangular badge
    rounded: BorderRadius.md,      // 6px - Slightly rounded
    pill: BorderRadius.full,       // Full - Pill-shaped badge
  },

  // Avatars
  avatar: {
    circle: BorderRadius.full,     // Full - Perfect circle
    square: BorderRadius.none,     // 0px - Square (no rounding)
    rounded: BorderRadius.md,      // 6px - Slightly rounded square
  },

  // Images
  image: {
    default: BorderRadius.md,      // 6px - Standard image
    thumbnail: BorderRadius.sm,    // 4px - Small thumbnail
    hero: BorderRadius.xl,         // 12px - Large image
  },

  // Dropdowns & Menus
  dropdown: {
    default: BorderRadius.lg,      // 8px - Dropdown menu
  },

  // Tooltips & Popovers
  tooltip: {
    default: BorderRadius.md,      // 6px - Standard tooltip
    compact: BorderRadius.sm,      // 4px - Compact tooltip
  },

  // Progress & Status Indicators
  progress: {
    bar: BorderRadius.full,        // Full - Rounded progress bar
    track: BorderRadius.full,      // Full - Rounded track
    circle: BorderRadius.full,     // Full - Circular progress
  },

  // Notifications & Alerts
  alert: {
    default: BorderRadius.lg,      // 8px - Alert box
    compact: BorderRadius.md,      // 6px - Compact alert
  },

  // Dividers & Separators
  divider: {
    default: BorderRadius.none,    // 0px - Straight line
    rounded: BorderRadius.full,    // Full - Rounded ends
  },

  // Sliders & Range Inputs
  slider: {
    thumb: BorderRadius.full,      // Full - Circular thumb
    track: BorderRadius.full,      // Full - Rounded track
  },

  // Checkboxes & Radio Buttons
  checkbox: {
    default: BorderRadius.sm,      // 4px - Slightly rounded square
    radio: BorderRadius.full,      // Full - Perfect circle
  },

  // Charts & Visualizations
  chart: {
    bar: BorderRadius.xs,          // 2px - Bar chart
    corner: BorderRadius.sm,       // 4px - Corner rounding
    legend: BorderRadius.md,       // 6px - Legend items
  },

  // Data Table
  table: {
    cell: BorderRadius.none,       // 0px - Cells (no rounding)
    header: BorderRadius.none,     // 0px - Header cells
    firstCell: BorderRadius.lg,    // 8px - First cell in row
    lastCell: BorderRadius.lg,     // 8px - Last cell in row
  },

  // Search Bar
  searchBar: {
    default: BorderRadius.lg,      // 8px - Search input
    expanded: BorderRadius.lg,     // 8px - Expanded state
  },

  // Switch & Toggle
  switch: {
    default: BorderRadius.full,    // Full - Pill-shaped
    track: BorderRadius.full,      // Full - Track
  },

  // Skeleton Loader
  skeleton: {
    default: BorderRadius.md,      // 6px - Standard skeleton
    circle: BorderRadius.full,     // Full - Circular skeleton
    text: BorderRadius.xs,         // 2px - Text skeleton
  },
} as const;

// ============================================================================
// RESPONSIVE BORDER RADIUS (for different screen sizes)
// ============================================================================

export const ResponsiveBorderRadius = {
  mobile: {
    button: BorderRadius.md,
    card: BorderRadius.lg,
    input: BorderRadius.md,
  },

  tablet: {
    button: BorderRadius.md,
    card: BorderRadius.lg,
    input: BorderRadius.md,
  },

  desktop: {
    button: BorderRadius.md,
    card: BorderRadius.lg,
    input: BorderRadius.md,
  },
} as const;

// ============================================================================
// BORDER RADIUS COMBINATIONS (for complex shapes)
// ============================================================================

export const BorderRadiusVariations = {
  // Different corners
  topLeft: (radius: string) => `${radius} 0 0 0`,
  topRight: (radius: string) => `0 ${radius} 0 0`,
  bottomLeft: (radius: string) => `0 0 0 ${radius}`,
  bottomRight: (radius: string) => `0 0 ${radius} 0`,

  // Sides
  top: (radius: string) => `${radius} ${radius} 0 0`,
  bottom: (radius: string) => `0 0 ${radius} ${radius}`,
  left: (radius: string) => `${radius} 0 0 ${radius}`,
  right: (radius: string) => `0 ${radius} ${radius} 0`,
} as const;
