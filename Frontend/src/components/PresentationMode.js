/**
 * Presentation Mode Component
 * Fullscreen presentation mode for executive storytelling
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import EChartsRenderer from './EChartsRenderer';
import InteractiveChartsContainer from './InteractiveChartsContainer';
import {
  usePresentationStore,
  fullscreenUtils,
  PresentationKeyboardHandler,
  PresentationTimer,
  SlideTypes,
  getTheme,
} from '../utils/presentationUtils';
import { downloadBlob, sanitizeFilename, getTimestamp, exportPresentationAsPDF } from '../utils/exportUtils';
import './PresentationMode.css';

function PresentationMode({ data, onExit }) {
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const keyboardHandlerRef = useRef(null);

  const {
    isPresenting,
    currentSlide,
    slides,
    presentationConfig,
    annotations,
    showAnnotations,
    isFullscreen,
    nextSlide,
    previousSlide,
    goToSlide,
    endPresentation,
    setFullscreen,
    toggleAnnotations,
  } = usePresentationStore();

  const [showControls, setShowControls] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [controlsHidden, setControlsHidden] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const currentSlideData = slides[currentSlide];
  const theme = getTheme(presentationConfig.theme);
  const slideAnnotations = annotations[currentSlide] || [];

  // Export presentation as PDF
  const handleExportPresentation = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      setExportProgress(25);

      const filename = sanitizeFilename(`presentation_${getTimestamp()}`);
      const pdf = await exportPresentationAsPDF(slides, {
        filename: `${filename}.pdf`,
        title: presentationConfig.title || 'Presentation',
        includeNotes: true,
      });

      setExportProgress(75);

      downloadBlob(pdf, `${filename}.pdf`);

      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 500);
    } catch (error) {
      console.error('Presentation export failed:', error);
      setIsExporting(false);
      setExportProgress(0);
      alert('Export failed. Check console for details.');
    }
  }, [slides, presentationConfig]);

  // Initialize timer
  useEffect(() => {
    if (isPresenting && !timerRef.current) {
      timerRef.current = new PresentationTimer((elapsed) => {
        setElapsedTime(elapsed);
      });
      timerRef.current.start();
    }

    return () => {
      if (timerRef.current) {
        timerRef.current.stop();
        timerRef.current = null;
      }
    };
  }, [isPresenting]);

  // Keyboard navigation
  useEffect(() => {
    if (isPresenting) {
      keyboardHandlerRef.current = new PresentationKeyboardHandler({
        nextSlide,
        previousSlide,
        exitPresentation: handleExit,
        toggleFullscreen: handleToggleFullscreen,
        toggleAnnotations,
        goToFirstSlide: () => goToSlide(0),
        goToLastSlide: () => goToSlide(slides.length - 1),
        goToSlide,
      });

      keyboardHandlerRef.current.attach();

      return () => {
        if (keyboardHandlerRef.current) {
          keyboardHandlerRef.current.detach();
        }
      };
    }
  }, [isPresenting, nextSlide, previousSlide, goToSlide, toggleAnnotations, slides.length]);

  // Fullscreen change handler
  useEffect(() => {
    const cleanup = fullscreenUtils.onChange(() => {
      setFullscreen(fullscreenUtils.isActive());
    });

    return cleanup;
  }, [setFullscreen]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;

    let timeout;
    let moveTimeout;

    const handleMouseMove = () => {
      setControlsHidden(false);
      clearTimeout(moveTimeout);

      moveTimeout = setTimeout(() => {
        setControlsHidden(true);
      }, 3000);
    };

    handleMouseMove(); // Initialize

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(moveTimeout);
      clearTimeout(timeout);
    };
  }, [showControls]);

  // Handle exit
  const handleExit = useCallback(() => {
    if (fullscreenUtils.isActive()) {
      fullscreenUtils.exit();
    }
    endPresentation();
    if (onExit) {
      onExit();
    }
  }, [endPresentation, onExit]);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(async () => {
    if (containerRef.current) {
      await fullscreenUtils.toggle(containerRef.current);
    }
  }, []);

  // Format timer
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const sec = seconds % 60;
    const min = minutes % 60;

    if (hours > 0) {
      return `${hours}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  if (!isPresenting || !currentSlideData) {
    return (
      <div className="presentation-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`presentation-container ${presentationConfig.theme}-theme`}
      style={{ background: theme.background, color: theme.text }}
    >
      {/* Slide Content */}
      <div className="slide-container">
        <div className="slide-content">
          {/* Slide Header */}
          {currentSlideData.title && (
            <div className="slide-header">
              <h1 className="slide-title">{currentSlideData.title}</h1>
              {currentSlideData.subtitle && (
                <p className="slide-subtitle">{currentSlideData.subtitle}</p>
              )}
            </div>
          )}

          {/* Slide Body */}
          <div className="slide-body">
            {renderSlideContent(currentSlideData, data, theme)}
          </div>

          {/* Annotations */}
          {showAnnotations &&
            slideAnnotations
              .filter((ann) => ann.visible)
              .map((annotation) => (
                <div
                  key={annotation.id}
                  className={`annotation annotation-${annotation.type}`}
                  style={{
                    left: annotation.position.x,
                    top: annotation.position.y,
                    width: annotation.position.width,
                    height: annotation.position.height,
                    color: annotation.style.color,
                    fontSize: annotation.style.fontSize,
                    opacity: annotation.style.opacity,
                  }}
                >
                  {annotation.content}
                </div>
              ))}
        </div>
      </div>

      {/* Slide Navigator */}
      {slides.length > 1 && (
        <div className="slide-navigator">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Thumbnails */}
      {showThumbnails && (
        <div className="slide-thumbnails">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              <div className="thumbnail-number">{index + 1}</div>
            </div>
          ))}
        </div>
      )}

      {/* Notes Panel */}
      {showNotes && currentSlideData.notes && (
        <div className="notes-panel">
          <div className="notes-title">Speaker Notes</div>
          <div className="notes-content">{currentSlideData.notes}</div>
        </div>
      )}

      {/* Controls Bar */}
      <div className={`presentation-controls ${controlsHidden ? 'hidden' : ''}`}>
        <div className="controls-left">
          <button
            className="control-button"
            onClick={handleExit}
            title="Exit Presentation (Esc)"
          >
            ✕ Exit
          </button>
          <button
            className="control-button"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? '⊡' : '⊠'} Fullscreen
          </button>
          <button
            className={`control-button ${showAnnotations ? 'active' : ''}`}
            onClick={toggleAnnotations}
            title="Toggle Annotations (A)"
          >
            📝 Annotations
          </button>
        </div>

        <div className="controls-center">
          <button
            className="control-button"
            onClick={previousSlide}
            disabled={currentSlide === 0}
            title="Previous Slide (← or PageUp)"
          >
            ←
          </button>

          <div className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>

          <button
            className="control-button"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            title="Next Slide (→, Space, or PageDown)"
          >
            →
          </button>
        </div>

        <div className="controls-right">
          <button
            className={`control-button ${showThumbnails ? 'active' : ''}`}
            onClick={() => setShowThumbnails(!showThumbnails)}
            title="Show Thumbnails"
          >
            ⊞ Slides
          </button>
          <button
            className={`control-button ${showNotes ? 'active' : ''}`}
            onClick={() => setShowNotes(!showNotes)}
            title="Show Speaker Notes"
          >
            📄 Notes
          </button>
          <button
            className="control-button"
            onClick={() => setShowShortcuts(!showShortcuts)}
            title="Keyboard Shortcuts (?)"
          >
            ⌨ Shortcuts
          </button>
          <button
            className={`control-button ${isExporting ? 'loading' : ''}`}
            onClick={handleExportPresentation}
            disabled={isExporting}
            title="Export presentation as PDF"
          >
            {isExporting ? `📥 ${exportProgress}%` : '📥 Export'}
          </button>
          <div className="presentation-timer">{formatTime(elapsedTime)}</div>
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      {showShortcuts && (
        <div className="keyboard-shortcuts" onClick={() => setShowShortcuts(false)}>
          <h3 className="shortcuts-title">Keyboard Shortcuts</h3>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">→</span>
                <span className="shortcut-key">Space</span>
                <span className="shortcut-key">PgDn</span>
              </div>
              <span className="shortcut-description">Next slide</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">←</span>
                <span className="shortcut-key">PgUp</span>
              </div>
              <span className="shortcut-description">Previous slide</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">Home</span>
              </div>
              <span className="shortcut-description">First slide</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">End</span>
              </div>
              <span className="shortcut-description">Last slide</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">F</span>
              </div>
              <span className="shortcut-description">Toggle fullscreen</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">A</span>
              </div>
              <span className="shortcut-description">Toggle annotations</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">Esc</span>
              </div>
              <span className="shortcut-description">Exit presentation</span>
            </div>
            <div className="shortcut-item">
              <div className="shortcut-keys">
                <span className="shortcut-key">1-9</span>
              </div>
              <span className="shortcut-description">Jump to slide</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Render slide content based on type
 */
function renderSlideContent(slide, data, theme) {
  switch (slide.type) {
    case SlideTypes.TITLE:
      return (
        <div className="text-slide-content" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>{slide.title}</h1>
          {slide.subtitle && (
            <p style={{ fontSize: '2rem', color: theme.secondary }}>{slide.subtitle}</p>
          )}
        </div>
      );

    case SlideTypes.CHART:
      return (
        <div className="chart-slide-content">
          <div className="chart-wrapper">
            {slide.content.chartConfig && data && (
              <EChartsRenderer
                config={slide.content.chartConfig}
                data={data}
                theme={{
                  background: theme.background,
                  textColor: theme.text,
                  primaryColor: theme.accent,
                }}
              />
            )}
          </div>
        </div>
      );

    case SlideTypes.MULTI_CHART:
      return (
        <div className="chart-slide-content">
          {slide.content.charts && data && (
            <InteractiveChartsContainer
              data={data}
              initialCharts={slide.content.charts}
              defaultLayout={slide.content.layout || '2x1'}
              theme={{
                background: theme.background,
                textColor: theme.text,
                primaryColor: theme.accent,
              }}
            />
          )}
        </div>
      );

    case SlideTypes.TEXT:
      return (
        <div className="text-slide-content">
          {slide.content.body && (
            <div className="text-slide-body">{slide.content.body}</div>
          )}
          {slide.content.bullets && slide.content.bullets.length > 0 && (
            <ul className="text-slide-bullets">
              {slide.content.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case SlideTypes.KEY_INSIGHT:
      return (
        <div className="key-insight-content">
          {slide.content.metric && (
            <div className="insight-metric">
              <div className="metric-value">{slide.content.metric.value}</div>
              <div className="metric-label">{slide.content.metric.label}</div>
              {slide.content.metric.trend && (
                <div
                  className={`metric-trend ${
                    slide.content.metric.trend.startsWith('+') ? 'positive' : 'negative'
                  }`}
                >
                  {slide.content.metric.trend}
                </div>
              )}
            </div>
          )}
          {slide.content.insight && (
            <div className="insight-text">{slide.content.insight}</div>
          )}
          {slide.content.supporting && slide.content.supporting.length > 0 && (
            <ul className="text-slide-bullets">
              {slide.content.supporting.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case SlideTypes.COMPARISON:
      return (
        <div className="comparison-content">
          <div className="comparison-side">
            <div className="comparison-title">{slide.content.left.title}</div>
            <div className="comparison-chart">
              {slide.content.left.chart && data && (
                <EChartsRenderer
                  config={slide.content.left.chart}
                  data={data}
                  theme={{
                    background: theme.background,
                    textColor: theme.text,
                    primaryColor: theme.accent,
                  }}
                />
              )}
            </div>
          </div>
          <div className="comparison-side">
            <div className="comparison-title">{slide.content.right.title}</div>
            <div className="comparison-chart">
              {slide.content.right.chart && data && (
                <EChartsRenderer
                  config={slide.content.right.chart}
                  data={data}
                  theme={{
                    background: theme.background,
                    textColor: theme.text,
                    primaryColor: theme.accent,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      );

    case SlideTypes.CONCLUSION:
      return (
        <div className="text-slide-content">
          {slide.content.summary && (
            <div className="text-slide-body" style={{ marginBottom: '2rem' }}>
              {slide.content.summary}
            </div>
          )}
          {slide.content.recommendations && slide.content.recommendations.length > 0 && (
            <>
              <h3 style={{ color: theme.accent, marginBottom: '1rem' }}>
                Recommendations
              </h3>
              <ul className="text-slide-bullets">
                {slide.content.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </>
          )}
          {slide.content.nextSteps && slide.content.nextSteps.length > 0 && (
            <>
              <h3
                style={{
                  color: theme.accent,
                  marginTop: '2rem',
                  marginBottom: '1rem',
                }}
              >
                Next Steps
              </h3>
              <ul className="text-slide-bullets">
                {slide.content.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      );

    default:
      return <div>Unsupported slide type</div>;
  }
}

export default PresentationMode;
