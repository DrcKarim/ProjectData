/**
 * SHADOWS & ELEVATION SYSTEM
 * Material Design-inspired elevation model
 * 
 * Creates depth hierarchy through strategic shadow layering
 * Used to communicate component state and spatial relationships
 */

// ============================================================================
// SHADOW DEFINITIONS
// ============================================================================

export type ElevationLevel = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const Shadows = {
  // No shadow
  none: 'none',

  // Extra small - Subtle depth (hover states, slight elevation)
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Small - Subtle elevation (cards, dropdowns at rest)
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',

  // Medium - Standard elevation (raised cards, inputs on focus)
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

  // Large - Prominent elevation (modals, floating menus)
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // Extra large - High elevation (stacked modals, notifications)
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // 2XL - Maximum elevation (popovers on top of modals)
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Special - Inner shadow (for insets)
  inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Focus ring (for keyboard navigation)
  focus: '0 0 0 3px rgba(102, 126, 234, 0.1), 0 0 0 1px rgba(102, 126, 234, 1)',

  // Focus ring (dark mode)
  focusDark: '0 0 0 3px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(102, 126, 234, 1)',

  // Glow effects (for data visualization)
  glow: '0 0 20px rgba(102, 126, 234, 0.3)',
  glowWarm: '0 0 20px rgba(255, 122, 74, 0.3)',
  glowCool: '0 0 20px rgba(34, 197, 94, 0.3)',
} as const;

// ============================================================================
// COMPONENT ELEVATION LEVELS
// ============================================================================

export const Elevation = {
  // Level 0: Flat (no elevation)
  flat: {
    shadow: Shadows.none,
    zIndex: 0,
  },

  // Level 1: Subtle (raised button on hover)
  xs: {
    shadow: Shadows.xs,
    zIndex: 1,
  },

  // Level 2: Small cards, inactive states
  sm: {
    shadow: Shadows.sm,
    zIndex: 2,
  },

  // Level 3: Standard cards, raised inputs
  md: {
    shadow: Shadows.md,
    zIndex: 3,
  },

  // Level 4: Floating UI, menus, popovers
  lg: {
    shadow: Shadows.lg,
    zIndex: 10,
  },

  // Level 5: Modal dialogs
  xl: {
    shadow: Shadows.xl,
    zIndex: 40,
  },

  // Level 6: Stacked modals, top-level notifications
  '2xl': {
    shadow: Shadows['2xl'],
    zIndex: 50,
  },
} as const;

// ============================================================================
// COMPONENT SHADOW PRESETS
// ============================================================================

export const ComponentShadows = {
  // Cards
  card: {
    rest: Shadows.sm,          // Default card shadow
    hover: Shadows.md,         // On interaction
    active: Shadows.lg,        // When selected/focused
  },

  // Buttons
  button: {
    default: Shadows.none,     // Flat primary
    hover: Shadows.xs,         // Subtle lift
    active: Shadows.sm,        // Pressed state
    disabled: Shadows.none,    // No elevation
  },

  // Inputs & Forms
  input: {
    default: Shadows.none,
    focus: Shadows.sm,
    error: Shadows.none,       // Error state uses color, not shadow
  },

  // Dropdowns & Menus
  dropdown: {
    default: Shadows.lg,       // Prominent elevation
    hover: Shadows.lg,         // Consistent
  },

  // Modals & Dialogs
  modal: {
    overlay: Shadows.none,
    content: Shadows.xl,
  },

  // Popovers & Tooltips
  popover: {
    default: Shadows.lg,
    arrow: Shadows.md,         // Arrow element
  },

  // Notifications
  notification: {
    default: Shadows.lg,
    stacked: Shadows.xl,       // Multiple notifications
  },

  // Floating Action Button
  fab: {
    rest: Shadows.md,
    hover: Shadows.lg,
    active: Shadows.xl,
  },

  // Sidebar/Navigation
  sidebar: {
    default: Shadows.sm,
    hover: Shadows.md,
  },

  // Charts & Visualizations
  chart: {
    container: Shadows.sm,
    hover: Shadows.md,
    tooltip: Shadows.lg,
    annotation: Shadows.sm,
  },

  // Data Table
  table: {
    header: Shadows.sm,
    row: Shadows.none,
    rowHover: Shadows.xs,
    sticky: Shadows.sm,
  },

  // Search/Filter Bar
  searchBar: {
    default: Shadows.sm,
    active: Shadows.md,
    expanded: Shadows.lg,
  },
} as const;

// ============================================================================
// ANIMATION SHADOWS (for transition states)
// ============================================================================

export const ShadowTransitions = {
  // Smooth shadow transitions
  property: 'box-shadow',
  duration: '150ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Longer transitions for dramatic effects
  slow: {
    property: 'box-shadow',
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Fast transitions for snappy feedback
  fast: {
    property: 'box-shadow',
    duration: '100ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================================================
// DARK MODE SHADOWS (slightly adjusted for contrast)
// ============================================================================

export const ShadowsDark = {
  // Shadows need to be slightly stronger in dark mode for visibility
  xs: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.15)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',

  inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)',
  focus: '0 0 0 3px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(102, 126, 234, 1)',
  glow: '0 0 20px rgba(102, 126, 234, 0.4)',
} as const;
