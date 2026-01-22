/**
 * Presentation Mode Utilities
 * State management and utilities for executive presentation mode
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Presentation Store
 * Manages presentation state, slides, and navigation
 */
export const usePresentationStore = create(
  persist(
    (set, get) => ({
      // Presentation state
      isPresenting: false,
      currentSlide: 0,
      slides: [],
      presentationConfig: {
        title: 'Data Presentation',
        author: '',
        date: new Date().toISOString(),
        theme: 'dark',
        transitionSpeed: 400,
        autoProgress: false,
        autoProgressDelay: 5000,
      },

      // Fullscreen state
      isFullscreen: false,

      // Annotation state
      annotations: {}, // { slideIndex: [annotations] }
      showAnnotations: true,

      // Actions
      startPresentation: () => {
        set({ isPresenting: true, currentSlide: 0 });
      },

      endPresentation: () => {
        set({ isPresenting: false });
      },

      nextSlide: () => {
        const { currentSlide, slides } = get();
        if (currentSlide < slides.length - 1) {
          set({ currentSlide: currentSlide + 1 });
        }
      },

      previousSlide: () => {
        const { currentSlide } = get();
        if (currentSlide > 0) {
          set({ currentSlide: currentSlide - 1 });
        }
      },

      goToSlide: (index) => {
        const { slides } = get();
        if (index >= 0 && index < slides.length) {
          set({ currentSlide: index });
        }
      },

      setSlides: (slides) => {
        set({ slides });
      },

      addSlide: (slide) => {
        const { slides } = get();
        set({ slides: [...slides, slide] });
      },

      updateSlide: (index, slide) => {
        const { slides } = get();
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], ...slide };
        set({ slides: newSlides });
      },

      removeSlide: (index) => {
        const { slides } = get();
        set({ slides: slides.filter((_, i) => i !== index) });
      },

      reorderSlides: (fromIndex, toIndex) => {
        const { slides } = get();
        const newSlides = [...slides];
        const [removed] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, removed);
        set({ slides: newSlides });
      },

      setPresentationConfig: (config) => {
        set({ presentationConfig: { ...get().presentationConfig, ...config } });
      },

      setFullscreen: (isFullscreen) => {
        set({ isFullscreen });
      },

      addAnnotation: (slideIndex, annotation) => {
        const { annotations } = get();
        const slideAnnotations = annotations[slideIndex] || [];
        set({
          annotations: {
            ...annotations,
            [slideIndex]: [...slideAnnotations, annotation],
          },
        });
      },

      updateAnnotation: (slideIndex, annotationId, updates) => {
        const { annotations } = get();
        const slideAnnotations = annotations[slideIndex] || [];
        set({
          annotations: {
            ...annotations,
            [slideIndex]: slideAnnotations.map((ann) =>
              ann.id === annotationId ? { ...ann, ...updates } : ann
            ),
          },
        });
      },

      removeAnnotation: (slideIndex, annotationId) => {
        const { annotations } = get();
        const slideAnnotations = annotations[slideIndex] || [];
        set({
          annotations: {
            ...annotations,
            [slideIndex]: slideAnnotations.filter((ann) => ann.id !== annotationId),
          },
        });
      },

      toggleAnnotations: () => {
        set({ showAnnotations: !get().showAnnotations });
      },

      resetPresentation: () => {
        set({
          isPresenting: false,
          currentSlide: 0,
          isFullscreen: false,
        });
      },
    }),
    {
      name: 'presentation-storage',
      partialize: (state) => ({
        slides: state.slides,
        presentationConfig: state.presentationConfig,
        annotations: state.annotations,
      }),
    }
  )
);

/**
 * Slide Types
 */
export const SlideTypes = {
  TITLE: 'title',
  CHART: 'chart',
  MULTI_CHART: 'multi-chart',
  TEXT: 'text',
  IMAGE: 'image',
  KEY_INSIGHT: 'key-insight',
  COMPARISON: 'comparison',
  CONCLUSION: 'conclusion',
};

/**
 * Create a default slide
 */
export function createDefaultSlide(type = SlideTypes.CHART) {
  const baseSlide = {
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: '',
    subtitle: '',
    notes: '',
    transition: 'fade',
    duration: null,
  };

  switch (type) {
    case SlideTypes.TITLE:
      return {
        ...baseSlide,
        title: 'Presentation Title',
        subtitle: 'Subtitle or date',
        content: {
          logo: null,
          backgroundImage: null,
        },
      };

    case SlideTypes.CHART:
      return {
        ...baseSlide,
        title: 'Chart Title',
        content: {
          chartConfig: null,
          data: null,
          highlights: [], // Data points to highlight
          focusArea: null, // { x, y, width, height }
        },
      };

    case SlideTypes.MULTI_CHART:
      return {
        ...baseSlide,
        title: 'Multi-Chart Analysis',
        content: {
          charts: [], // Array of chart configs
          layout: '2x1',
          highlights: {},
        },
      };

    case SlideTypes.TEXT:
      return {
        ...baseSlide,
        title: 'Key Points',
        content: {
          body: '',
          bullets: [],
          alignment: 'left',
        },
      };

    case SlideTypes.KEY_INSIGHT:
      return {
        ...baseSlide,
        title: 'Key Insight',
        content: {
          insight: '',
          metric: null, // { value, label, trend }
          supporting: [],
        },
      };

    case SlideTypes.COMPARISON:
      return {
        ...baseSlide,
        title: 'Comparison',
        content: {
          left: { title: '', chart: null },
          right: { title: '', chart: null },
        },
      };

    case SlideTypes.CONCLUSION:
      return {
        ...baseSlide,
        title: 'Conclusion',
        content: {
          summary: '',
          recommendations: [],
          nextSteps: [],
        },
      };

    default:
      return baseSlide;
  }
}

/**
 * Annotation Types
 */
export const AnnotationTypes = {
  ARROW: 'arrow',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TEXT: 'text',
  HIGHLIGHT: 'highlight',
  CALLOUT: 'callout',
};

/**
 * Create annotation
 */
export function createAnnotation(type, position, content = '') {
  return {
    id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    position, // { x, y, width?, height? }
    content,
    style: {
      color: '#3b82f6',
      fontSize: 16,
      fontWeight: 'bold',
      opacity: 1,
      animation: 'fade-in',
    },
    visible: true,
  };
}

/**
 * Fullscreen API utilities
 */
export const fullscreenUtils = {
  /**
   * Check if fullscreen is supported
   */
  isSupported: () => {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  },

  /**
   * Check if currently in fullscreen
   */
  isActive: () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  },

  /**
   * Request fullscreen
   */
  enter: async (element) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  },

  /**
   * Exit fullscreen
   */
  exit: async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return true;
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      return false;
    }
  },

  /**
   * Toggle fullscreen
   */
  toggle: async (element) => {
    if (fullscreenUtils.isActive()) {
      return await fullscreenUtils.exit();
    } else {
      return await fullscreenUtils.enter(element);
    }
  },

  /**
   * Add fullscreen change listener
   */
  onChange: (callback) => {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    events.forEach((event) => {
      document.addEventListener(event, callback);
    });

    // Return cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, callback);
      });
    };
  },
};

/**
 * Keyboard navigation handler
 */
export class PresentationKeyboardHandler {
  constructor(callbacks = {}) {
    this.callbacks = {
      nextSlide: callbacks.nextSlide || (() => {}),
      previousSlide: callbacks.previousSlide || (() => {}),
      exitPresentation: callbacks.exitPresentation || (() => {}),
      toggleFullscreen: callbacks.toggleFullscreen || (() => {}),
      toggleAnnotations: callbacks.toggleAnnotations || (() => {}),
      goToFirstSlide: callbacks.goToFirstSlide || (() => {}),
      goToLastSlide: callbacks.goToLastSlide || (() => {}),
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    // Ignore if typing in input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Space
        event.preventDefault();
        this.callbacks.nextSlide();
        break;

      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        this.callbacks.previousSlide();
        break;

      case 'Escape':
        event.preventDefault();
        this.callbacks.exitPresentation();
        break;

      case 'f':
      case 'F':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          this.callbacks.toggleFullscreen();
        }
        break;

      case 'a':
      case 'A':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          this.callbacks.toggleAnnotations();
        }
        break;

      case 'Home':
        event.preventDefault();
        this.callbacks.goToFirstSlide();
        break;

      case 'End':
        event.preventDefault();
        this.callbacks.goToLastSlide();
        break;

      default:
        // Number keys for direct slide navigation
        if (event.key >= '0' && event.key <= '9') {
          const slideNumber = parseInt(event.key, 10);
          if (slideNumber > 0) {
            event.preventDefault();
            this.callbacks.goToSlide?.(slideNumber - 1);
          }
        }
        break;
    }
  }

  attach() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  detach() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
}

/**
 * Presentation timer
 */
export class PresentationTimer {
  constructor(onTick = () => {}) {
    this.startTime = null;
    this.elapsed = 0;
    this.intervalId = null;
    this.onTick = onTick;
  }

  start() {
    if (!this.startTime) {
      this.startTime = Date.now();
      this.intervalId = setInterval(() => {
        this.elapsed = Date.now() - this.startTime;
        this.onTick(this.elapsed);
      }, 1000);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.startTime = null;
    this.elapsed = 0;
    this.onTick(0);
  }

  getElapsed() {
    return this.elapsed;
  }

  getFormattedTime() {
    const seconds = Math.floor(this.elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const sec = seconds % 60;
    const min = minutes % 60;

    if (hours > 0) {
      return `${hours}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
    return `${min}:${String(sec).padStart(2, '0')}`;
  }
}

/**
 * Export presentation to JSON
 */
export function exportPresentation(slides, config, annotations) {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    config,
    slides,
    annotations,
  };
}

/**
 * Import presentation from JSON
 */
export function importPresentation(json) {
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return {
      slides: data.slides || [],
      config: data.config || {},
      annotations: data.annotations || {},
    };
  } catch (error) {
    console.error('Failed to import presentation:', error);
    return null;
  }
}

/**
 * Generate presentation summary
 */
export function generatePresentationSummary(slides) {
  const slideTypes = slides.reduce((acc, slide) => {
    acc[slide.type] = (acc[slide.type] || 0) + 1;
    return acc;
  }, {});

  return {
    totalSlides: slides.length,
    slideTypes,
    hasAnnotations: Object.keys(usePresentationStore.getState().annotations).length > 0,
    estimatedDuration: slides.length * 60, // 1 minute per slide
  };
}

/**
 * Slide transition animations
 */
export const SlideTransitions = {
  FADE: 'fade',
  SLIDE_LEFT: 'slide-left',
  SLIDE_RIGHT: 'slide-right',
  SLIDE_UP: 'slide-up',
  SLIDE_DOWN: 'slide-down',
  ZOOM: 'zoom',
  NONE: 'none',
};

/**
 * Presentation themes
 */
export const PresentationThemes = {
  DARK: {
    name: 'dark',
    background: '#0f172a',
    text: '#f1f5f9',
    accent: '#3b82f6',
    secondary: '#64748b',
  },
  LIGHT: {
    name: 'light',
    background: '#ffffff',
    text: '#0f172a',
    accent: '#2563eb',
    secondary: '#94a3b8',
  },
  EXECUTIVE: {
    name: 'executive',
    background: '#1e293b',
    text: '#e2e8f0',
    accent: '#10b981',
    secondary: '#475569',
  },
  CORPORATE: {
    name: 'corporate',
    background: '#1a1a2e',
    text: '#eee',
    accent: '#0f3460',
    secondary: '#16213e',
  },
};

/**
 * Get theme configuration
 */
export function getTheme(themeName) {
  return PresentationThemes[themeName.toUpperCase()] || PresentationThemes.DARK;
}
