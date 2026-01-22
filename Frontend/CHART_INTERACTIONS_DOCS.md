# Advanced Chart Interactions - Complete Documentation

## Overview

The Advanced Chart Interactions system provides enterprise-grade interactivity between multiple charts, including cross-filtering, brushing and linking, hover synchronization, and smooth animated transitions. This enables users to explore complex datasets through coordinated views.

## Features

### 1. Cross-Filtering 🔗

Click on data points in one chart to filter data in all other linked charts.

**How it works:**
- Click on a data point → Creates a filter
- Filter applies to all linked charts
- Source chart remains unfiltered
- Multiple filters can be active simultaneously
- Filters are displayed as removable chips

**Use Cases:**
- Drill-down analysis
- Focus on specific categories
- Compare segments across views
- Progressive data exploration

**Performance:**
- Debounced filter application (300ms)
- Efficient data filtering using Set operations
- Minimal re-renders with Zustand state management

### 2. Brushing and Linking 🖌️

Select regions on scatter plots to highlight and filter related data across all charts.

**Brush Types:**
- **Rectangular Brush**: Select 2D regions (x and y ranges)
- **Polygon Brush**: Free-form selection
- **1D Brush**: Single axis selection

**How it works:**
- Enable brushing in scatter plots
- Click and drag to select region
- Selected data highlighted across all charts
- Convert selection to filter with one click

**Use Cases:**
- Pattern detection
- Outlier identification
- Cluster analysis
- Correlation exploration

**Performance:**
- Throttled brush events (100ms)
- Efficient spatial queries
- Hardware-accelerated rendering

### 3. Hover Synchronization 👆

Hover over data in one chart to highlight corresponding data in all linked charts.

**How it works:**
- Hover over data point → Emits hover event
- All charts receive event
- Related data highlighted based on field mappings
- Non-related data dimmed (opacity 0.3)
- Synchronized animations (200ms)

**Field Mapping:**
- Automatic detection of common fields
- Configurable field relationships
- Multi-field matching support

**Use Cases:**
- Multi-view exploration
- Relationship discovery
- Data validation
- Presentation mode

**Performance:**
- Throttled hover events (100ms)
- RAF-optimized highlighting
- CSS transitions for smooth effects

### 4. Smooth Animated Transitions ✨

All data updates feature smooth, professionally choreographed animations.

**Animation Presets:**

| Preset | Duration | Easing | Use Case |
|--------|----------|--------|----------|
| FAST | 200ms | cubicOut | Quick interactions |
| NORMAL | 400ms | cubicInOut | Default transitions |
| SLOW | 600ms | elasticOut | Dramatic effects |
| SMOOTH | 300ms | quadInOut | Hover/filter updates |

**Animated Operations:**
- Data filtering
- Brush selection
- Hover highlighting
- Chart updates
- Layout changes

**Performance:**
- GPU-accelerated transforms
- RequestAnimationFrame timing
- Automatic animation throttling
- Configurable thresholds (2000 points)

## Architecture

### Component Hierarchy

```
InteractiveChartsContainer
├── Control Panel (filters, settings)
├── Performance Monitor
└── Charts Grid
    ├── InteractiveEChartsRenderer (Chart 1)
    ├── InteractiveEChartsRenderer (Chart 2)
    └── InteractiveEChartsRenderer (Chart N)
```

### State Management

**Zustand Store** (`chartInteractions.js`):
```javascript
{
  activeHover: null,           // Current hover state
  activeBrush: null,           // Current brush selection
  activeFilters: {},           // { chartId: [filters] }
  linkedCharts: [],            // Array of linked chart IDs
}
```

**Actions:**
- `setActiveHover(hoverData)` - Set hover state
- `clearActiveHover()` - Clear hover
- `setActiveBrush(brushData)` - Set brush selection
- `addFilter(chartId, filter)` - Add cross-filter
- `removeFilter(chartId, filterId)` - Remove filter
- `clearAllFilters()` - Clear all filters
- `linkCharts(chartIds)` - Link charts together

### Data Flow

```
User Interaction
    ↓
Event Handler (click, hover, brush)
    ↓
State Update (Zustand)
    ↓
State Change Propagation
    ↓
All Linked Charts Re-render
    ↓
Smooth Animated Transition
```

## Component APIs

### InteractiveChartsContainer

Main container managing multiple linked charts.

```javascript
<InteractiveChartsContainer
  data={Array}              // Data to visualize
  initialCharts={Array}     // Initial chart configs
  theme={Object}            // Theme configuration
  defaultLayout={String}    // Grid layout: '1x1', '2x1', '3x1', '2x2'
/>
```

**Features:**
- Add/remove charts dynamically
- Toggle interaction modes
- View active filters
- Performance monitoring
- Layout customization

### InteractiveEChartsRenderer

Enhanced chart component with interaction support.

```javascript
<InteractiveEChartsRenderer
  chartId={String}                  // Unique identifier
  config={Object}                   // Chart configuration
  data={Array}                      // Chart data
  theme={Object}                    // Theme config
  enableCrossFiltering={Boolean}    // Enable cross-filtering
  enableBrushing={Boolean}          // Enable brushing
  enableHoverSync={Boolean}         // Enable hover sync
  linkedChartIds={Array}            // Linked chart IDs
/>
```

**Event Handlers:**
- `onClick` - Handle click events
- `onHover` - Handle hover events
- `onBrushSelected` - Handle brush selection
- `onMouseOut` - Handle mouse leave

## Configuration

### Interaction Settings

```javascript
const settings = {
  enableCrossFiltering: true,    // Click to filter
  enableBrushing: true,          // Brush & select
  enableHoverSync: true,         // Synchronized hover
  animationPreset: 'SMOOTH',     // Animation style
};
```

### Performance Settings

```javascript
const performance = {
  hoverThrottle: 100,           // ms between hover events
  brushDebounce: 300,           // ms to wait before filter
  maxDataPoints: 5000,          // Auto-sampling threshold
  animationThreshold: 2000,     // Disable animations above
};
```

### Filter Configuration

```javascript
const filter = {
  id: 'unique-id',
  chartId: 'source-chart',
  field: 'category',
  type: 'equals',              // 'equals', 'in', 'range', 'contains'
  value: 'A',                  // Filter value
  label: 'category = A',       // Display label
};
```

## Usage Examples

### Basic Multi-Chart Setup

```javascript
import InteractiveChartsContainer from './components/InteractiveChartsContainer';
import { ChartTypes, createDefaultChartConfig } from './utils/chartConfig';

function Dashboard() {
  const data = [...]; // Your data

  const charts = [
    createDefaultChartConfig(ChartTypes.BAR),
    createDefaultChartConfig(ChartTypes.SCATTER),
  ];

  return (
    <InteractiveChartsContainer
      data={data}
      initialCharts={charts}
      defaultLayout="2x1"
    />
  );
}
```

### Programmatic Filter Control

```javascript
import { useInteractionStore } from './utils/chartInteractions';

function FilterControls() {
  const { addFilter, clearAllFilters } = useInteractionStore();

  const handleAddFilter = () => {
    addFilter('chart-1', {
      id: 'custom-filter',
      chartId: 'chart-1',
      field: 'category',
      type: 'equals',
      value: 'A',
      label: 'Category = A',
    });
  };

  return (
    <>
      <button onClick={handleAddFilter}>Add Filter</button>
      <button onClick={clearAllFilters}>Clear All</button>
    </>
  );
}
```

### Custom Animation Configuration

```javascript
import { getAnimationConfig } from './utils/chartInteractions';

const customAnimation = getAnimationConfig('FAST');

const chartOptions = {
  ...customAnimation,
  // ... other options
};
```

### Performance Monitoring

```javascript
import { PerformanceMonitor } from './utils/chartInteractions';

const monitor = new PerformanceMonitor();

// Start measurement
const startTime = monitor.startMeasure('renderTime');

// ... render operation ...

// End measurement
monitor.endMeasure('renderTime', startTime);

// Get metrics
const metrics = monitor.getMetrics();
console.log('Average render time:', metrics.avgRenderTime);
```

## Performance Optimization

### 1. Data Sampling

For large datasets (>5000 rows), automatic sampling is applied:

```javascript
import { sampleData } from './utils/chartInteractions';

// Systematic sampling (every nth item)
const sampled = sampleData(largeDataset, 5000, 'systematic');

// Random sampling
const randomSample = sampleData(largeDataset, 5000, 'random');
```

### 2. Event Throttling

Hover events are throttled to prevent excessive updates:

```javascript
import { throttle } from './utils/chartInteractions';

const handleHover = throttle((params) => {
  // Handle hover
}, 100); // Max 10 updates per second
```

### 3. Debouncing

Filter application is debounced to batch updates:

```javascript
import { debounce } from './utils/chartInteractions';

const applyFilters = debounce((filters) => {
  // Apply filters
}, 300); // Wait 300ms after last change
```

### 4. Memoization

Expensive calculations are memoized:

```javascript
import { memoize } from './utils/chartInteractions';

const calculateStats = memoize((data, field) => {
  // Expensive calculation
  return stats;
});
```

### 5. Virtual Rendering

Charts use ECharts' built-in optimization:
- Dirty rectangle rendering
- Progressive rendering for large datasets
- Hardware acceleration

## Best Practices

### 1. Chart Linking Strategy

**Do:**
- Link charts with common fields
- Use 2-4 charts for optimal UX
- Provide clear visual feedback
- Show active filters prominently

**Don't:**
- Link unrelated charts
- Create too many charts (>6)
- Hide filter state
- Chain filters excessively

### 2. Interaction Design

**Do:**
- Provide hover feedback (<100ms)
- Use smooth transitions (300-400ms)
- Dim non-related data (opacity 0.3)
- Show interaction indicators

**Don't:**
- Block interactions during animations
- Use abrupt transitions
- Hide related data completely
- Overwhelm with effects

### 3. Performance Guidelines

**Do:**
- Sample data above 5000 points
- Throttle hover events (100ms)
- Debounce filters (300ms)
- Monitor performance metrics

**Don't:**
- Update all charts simultaneously
- Trigger excessive re-renders
- Ignore animation thresholds
- Skip performance testing

### 4. User Experience

**Do:**
- Provide clear affordances
- Show filter chips
- Enable undo/clear all
- Display loading states

**Don't:**
- Lock UI during updates
- Hide interaction controls
- Make filters hard to remove
- Skip error messages

## Troubleshooting

### Issue: Hover not synchronizing

**Checks:**
1. ✓ Hover sync enabled in controls
2. ✓ Charts have common fields
3. ✓ Field mappings configured
4. ✓ No console errors

**Solution:**
```javascript
// Verify field mappings
const mappings = calculateFieldMappings(charts);
console.log('Field mappings:', mappings);
```

### Issue: Filters not applying

**Checks:**
1. ✓ Cross-filtering enabled
2. ✓ Charts are linked
3. ✓ Filter format correct
4. ✓ Field exists in data

**Solution:**
```javascript
// Check filter state
const { activeFilters } = useInteractionStore.getState();
console.log('Active filters:', activeFilters);
```

### Issue: Performance degradation

**Checks:**
1. ✓ Data size (<10,000 rows ideal)
2. ✓ Animation threshold not exceeded
3. ✓ Throttling/debouncing active
4. ✓ No memory leaks

**Solution:**
```javascript
// Enable performance monitoring
setShowPerformance(true);

// Check metrics
const metrics = performanceMonitor.getMetrics();
console.log('Performance:', metrics);
```

### Issue: Brushing not working

**Checks:**
1. ✓ Chart type is SCATTER
2. ✓ Brushing enabled
3. ✓ Brush toolbox visible
4. ✓ X and Y axes mapped

**Solution:**
```javascript
// Ensure scatter plot configuration
const config = createDefaultChartConfig(ChartTypes.SCATTER);
config.dataMapping.x = 'field1';
config.dataMapping.y = 'field2';
```

## Advanced Features

### Custom Field Mappings

Define custom relationships between charts:

```javascript
const customMappings = {
  'chart-1': {
    'chart-2': ['commonField1', 'commonField2'],
    'chart-3': ['sharedField'],
  },
};
```

### Conditional Filtering

Apply filters based on conditions:

```javascript
const filter = {
  id: 'conditional',
  chartId: 'chart-1',
  field: 'value',
  type: 'range',
  min: 100,
  max: 500,
  label: 'value: 100-500',
};
```

### Animation Sequences

Create custom animation sequences:

```javascript
const sequence = [
  { duration: 200, easing: 'cubicOut' },
  { duration: 300, easing: 'elasticOut' },
  { duration: 100, easing: 'linear' },
];
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Cross-Filtering | ✅ | ✅ | ✅ | ✅ |
| Brushing | ✅ | ✅ | ✅ | ✅ |
| Hover Sync | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| Performance | ✅ | ✅ | ⚠️ | ✅ |

⚠️ Safari: Slight performance impact with >4 charts

## Future Enhancements

- [ ] Real-time data streaming
- [ ] Collaborative filtering
- [ ] Undo/redo stack
- [ ] Filter history
- [ ] Advanced brush shapes
- [ ] Custom animation curves
- [ ] 3D chart support
- [ ] Touch gesture support
- [ ] Voice control integration
- [ ] AI-powered insights

## License

Part of Interactive Data Visualization System - Master-Level Course

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Status**: Production Ready ✅
