/**
 * ANIMATION & TRANSITION SYSTEM
 * Smooth, professional motion for enterprise UI
 * 
 * Principles:
 * - Purposeful motion (not gratuitous)
 * - Consistent timing across app
 * - Accessible (respects prefers-reduced-motion)
 */

// ============================================================================
// DURATION SCALE (milliseconds)
// ============================================================================

export const Duration = {
  // Instant (perceived as immediate)
  instant: '0ms',

  // Ultra fast (imperceptible delays)
  ultrafast: '50ms',

  // Very fast (snappy feedback)
  veryfast: '100ms',

  // Fast (quick interactions)
  fast: '150ms',

  // Base (standard duration)
  base: '200ms',

  // Slow (deliberate, noticeable)
  slow: '300ms',

  // Slower (emphasized animation)
  slower: '400ms',

  // Very slow (extended sequences)
  veryslow: '500ms',

  // Extended (long animations)
  extended: '750ms',

  // Long (page transitions, complex animations)
  long: '1000ms',
} as const;

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const Easing = {
  // Linear (no acceleration)
  linear: 'cubic-bezier(0, 0, 1, 1)',

  // Ease in (slow start, fast end)
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  inQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
  inCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
  inQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
  inQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',
  inExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  inCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',

  // Ease out (fast start, slow end)
  out: 'cubic-bezier(0, 0, 0.6, 1)',
  outQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
  outCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',

  // Ease in-out (slow start, fast middle, slow end)
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  inOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  inOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)',
  inOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
  inOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  // Material Design (Google's standard)
  material: 'cubic-bezier(0.4, 0, 0.2, 1)',
  materialDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  materialAccelerate: 'cubic-bezier(0.4, 0, 1, 1)',

  // Spring-like (playful, organic)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// ============================================================================
// TRANSITIONS (Property, Duration, Easing)
// ============================================================================

export const Transition = {
  // General purpose
  default: `all ${Duration.base} ${Easing.material}`,

  // Color transitions
  color: `color ${Duration.fast} ${Easing.material}`,
  backgroundColor: `background-color ${Duration.fast} ${Easing.material}`,
  borderColor: `border-color ${Duration.fast} ${Easing.material}`,

  // Position & Size
  transform: `transform ${Duration.base} ${Easing.material}`,
  width: `width ${Duration.base} ${Easing.material}`,
  height: `height ${Duration.base} ${Easing.material}`,

  // Opacity
  opacity: `opacity ${Duration.fast} ${Easing.material}`,
  fade: `opacity ${Duration.base} ${Easing.materialDecelerate}`,
  fadeIn: `opacity ${Duration.slow} ${Easing.materialDecelerate}`,
  fadeOut: `opacity ${Duration.fast} ${Easing.materialAccelerate}`,

  // Shadow
  shadow: `box-shadow ${Duration.fast} ${Easing.material}`,

  // Combined
  all: `all ${Duration.base} ${Easing.material}`,
  allSlow: `all ${Duration.slow} ${Easing.material}`,
  allFast: `all ${Duration.fast} ${Easing.material}`,

  // Spring animations
  smooth: `all ${Duration.base} ${Easing.spring}`,
  bouncy: `all ${Duration.base} ${Easing.bouncy}`,
} as const;

// ============================================================================
// COMPONENT ANIMATION PRESETS
// ============================================================================

export const ComponentAnimations = {
  // Button interactions
  button: {
    hover: `${Easing.material} ${Duration.fast}`,
    active: `${Easing.material} ${Duration.instant}`,
    disabled: `${Easing.material} ${Duration.fast}`,
  },

  // Input focus
  input: {
    focus: `${Easing.material} ${Duration.fast}`,
    error: `${Easing.material} ${Duration.fast}`,
    success: `${Easing.material} ${Duration.fast}`,
  },

  // Card interactions
  card: {
    hover: `${Easing.material} ${Duration.base}`,
    active: `${Easing.material} ${Duration.fast}`,
  },

  // Menu/Dropdown appear/disappear
  menu: {
    enter: `${Easing.materialDecelerate} ${Duration.fast}`,
    exit: `${Easing.materialAccelerate} ${Duration.fast}`,
  },

  // Modal appear/disappear
  modal: {
    enter: `${Easing.materialDecelerate} ${Duration.slow}`,
    exit: `${Easing.materialAccelerate} ${Duration.fast}`,
  },

  // Tooltip appear/disappear
  tooltip: {
    enter: `${Easing.materialDecelerate} ${Duration.fast}`,
    exit: `${Easing.materialAccelerate} ${Duration.veryfast}`,
  },

  // Page transitions
  page: {
    enter: `${Easing.materialDecelerate} ${Duration.slow}`,
    exit: `${Easing.materialAccelerate} ${Duration.fast}`,
  },

  // Skeleton loading pulse
  skeleton: {
    pulse: `${Easing.linear} ${Duration.extended}`,
  },

  // Notification slide-in
  notification: {
    enter: `${Easing.materialDecelerate} ${Duration.base}`,
    exit: `${Easing.materialAccelerate} ${Duration.fast}`,
  },

  // Chart animation
  chart: {
    data: `${Easing.material} ${Duration.slow}`,
    hover: `${Easing.material} ${Duration.veryfast}`,
    transition: `${Easing.material} ${Duration.base}`,
  },

  // Data table row
  tableRow: {
    hover: `${Easing.material} ${Duration.fast}`,
    expand: `${Easing.material} ${Duration.base}`,
  },

  // Collapse/Expand
  collapse: {
    enter: `${Easing.materialDecelerate} ${Duration.base}`,
    exit: `${Easing.materialAccelerate} ${Duration.fast}`,
  },

  // Spinner/Loader
  spinner: {
    rotate: `linear ${Duration.long}`,
  },

  // Progress bar
  progress: {
    update: `${Easing.material} ${Duration.base}`,
  },
} as const;

// ============================================================================
// ANIMATION KEYFRAMES (CSS animations)
// ============================================================================

export const Keyframes = {
  // Fade in
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,

  // Fade out
  fadeOut: `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,

  // Slide in from top
  slideInTop: `
    @keyframes slideInTop {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  // Slide in from bottom
  slideInBottom: `
    @keyframes slideInBottom {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  // Slide in from left
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  // Slide in from right
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  // Scale in
  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  // Rotate
  rotate: `
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  // Pulse (for loading states)
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,

  // Shake (for error feedback)
  shake: `
    @keyframes shake {
      0%, 100% {
        transform: translateX(0);
      }
      25% {
        transform: translateX(-5px);
      }
      75% {
        transform: translateX(5px);
      }
    }
  `,

  // Bounce
  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `,

  // Ping (expanding glow)
  ping: `
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `,
} as const;

// ============================================================================
// ACCESSIBILITY - RESPECTS USER PREFERENCE
// ============================================================================

export const MotionPreference = {
  // Reduced motion (for users who prefer minimal animation)
  reduce: `
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `,

  // Detect reduced motion in JavaScript
  prefersReducedMotion: '(prefers-reduced-motion: reduce)',
} as const;
