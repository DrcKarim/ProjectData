# Performance Optimization Guide
## Interactive Multi-Chart Dashboards

Achieve smooth 60fps performance with multiple interactive charts and large datasets.

## Performance Overview

### Target Metrics

| Scenario | Data Points | Charts | Target FPS | Status |
|----------|-------------|--------|------------|--------|
| Small | <1,000 | 2-4 | 60 fps | ✅ Perfect |
| Medium | 1,000-5,000 | 2-4 | 60 fps | ✅ Great |
| Large | 5,000-10,000 | 2-3 | 45-60 fps | ⚠️ Good |
| Very Large | >10,000 | 2-3 | 30-45 fps | ⚠️ Needs optimization |

### Key Principles

1. **Minimize Re-renders**: Only update charts that need updates
2. **Throttle Events**: Limit frequency of expensive operations
3. **Sample Data**: Reduce dataset size for large datasets
4. **Optimize Animations**: Balance smoothness with performance
5. **Monitor Continuously**: Track actual performance metrics

## Optimization Techniques

### 1. Data Sampling

#### When to Sample

- Dataset >5,000 rows
- Multiple charts (>3)
- Performance issues detected

#### Sampling Methods

**Random Sampling** (Best for uniform data):
```javascript
import { sampleData } from './utils/chartInteractions';

const sampled = sampleData(largeDataset, 5000, 'random');
// Randomly selects 5,000 rows
```

**Systematic Sampling** (Best for ordered data):
```javascript
const sampled = sampleData(largeDataset, 5000, 'systematic');
// Selects every nth row to reach 5,000 total
```

**Stratified Sampling** (Best for categorical data):
```javascript
const sampled = sampleData(largeDataset, 5000, 'stratified', 'category');
// Maintains category proportions in sample
```

#### Implementation Example

```javascript
function ChartContainer({ data }) {
  const processedData = useMemo(() => {
    if (data.length > 5000) {
      // Auto-sample large datasets
      return sampleData(data, 5000, 'systematic');
    }
    return data;
  }, [data]);

  return <InteractiveChartsContainer data={processedData} />;
}
```

### 2. Event Throttling & Debouncing

#### Throttle (For Continuous Events)

Use for: hover events, scroll events, resize events

```javascript
import { throttle } from './utils/chartInteractions';

// Throttle hover to 10 updates/second
const handleHover = throttle((params) => {
  setActiveHover({
    chartId: params.chartId,
    dataIndex: params.dataIndex,
    field: params.field,
    value: params.value,
  });
}, 100); // 100ms = max 10 updates/second
```

**Configuration:**
```javascript
const THROTTLE_DELAYS = {
  hover: 100,     // Hover events
  scroll: 150,    // Scroll events
  resize: 200,    // Window resize
};
```

#### Debounce (For Discrete Actions)

Use for: filter application, search, user input

```javascript
import { debounce } from './utils/chartInteractions';

// Debounce filter application
const applyFilters = debounce((filters) => {
  const filtered = applyCrossFilters(data, filters);
  setFilteredData(filtered);
}, 300); // Wait 300ms after last change
```

**Configuration:**
```javascript
const DEBOUNCE_DELAYS = {
  filterApplication: 300,  // Filter changes
  brushSelection: 250,     // Brush complete
  search: 400,             // Search input
};
```

### 3. Memoization

#### Expensive Calculations

```javascript
import { memoize } from './utils/chartInteractions';

// Memoize aggregation calculations
const calculateAggregation = memoize((data, field, aggFunc) => {
  // Expensive aggregation logic
  return aggregatedData;
});

// First call: computes
const result1 = calculateAggregation(data, 'sales', 'sum');

// Second call with same inputs: returns cached result
const result2 = calculateAggregation(data, 'sales', 'sum');
```

#### React Memoization

```javascript
import { useMemo, useCallback } from 'react';

function ChartRenderer({ data, filters, config }) {
  // Memoize filtered data
  const filteredData = useMemo(() => {
    return applyCrossFilters(data, filters, config.chartId);
  }, [data, filters, config.chartId]);

  // Memoize chart options
  const chartOptions = useMemo(() => {
    return generateChartOptions(filteredData, config);
  }, [filteredData, config]);

  // Memoize event handlers
  const handleClick = useCallback((params) => {
    const filter = createClickFilter(config.chartId, params.data, config.field);
    addFilter(config.chartId, filter);
  }, [config.chartId, config.field, addFilter]);

  return (
    <EChartsRenderer
      options={chartOptions}
      onClick={handleClick}
    />
  );
}
```

### 4. Animation Optimization

#### Animation Presets

```javascript
import { AnimationPresets, getAnimationConfig } from './utils/chartInteractions';

// Fast animations (200ms)
const fastConfig = getAnimationConfig('FAST');

// Smooth animations (300ms)
const smoothConfig = getAnimationConfig('SMOOTH');

// Disable for large datasets
const chartOptions = {
  ...baseOptions,
  animation: data.length < 2000, // Disable if >2000 points
  ...getAnimationConfig('FAST'),
};
```

#### Custom Animation Thresholds

```javascript
function getOptimalAnimationConfig(dataSize) {
  if (dataSize < 1000) {
    return { ...AnimationPresets.SMOOTH, animationDuration: 400 };
  } else if (dataSize < 5000) {
    return { ...AnimationPresets.FAST, animationDuration: 200 };
  } else {
    return { animation: false }; // Disable for large datasets
  }
}
```

#### RAF-Based Updates

```javascript
let rafId = null;

function updateChartWithRAF(chart, newOptions) {
  if (rafId) cancelAnimationFrame(rafId);
  
  rafId = requestAnimationFrame(() => {
    chart.setOption(newOptions, true); // notMerge=true for better performance
    rafId = null;
  });
}
```

### 5. ECharts Optimization

#### Renderer Selection

```javascript
// Canvas (Better for many data points)
const canvasChart = echarts.init(dom, null, { renderer: 'canvas' });

// SVG (Better for few data points, better quality)
const svgChart = echarts.init(dom, null, { renderer: 'svg' });

// Auto-select based on data size
const renderer = data.length > 1000 ? 'canvas' : 'svg';
```

#### Progressive Rendering

```javascript
const chartOptions = {
  progressive: 1000,           // Render 1000 items per frame
  progressiveThreshold: 5000,   // Enable progressive above 5000 points
  // ... other options
};
```

#### Dirty Rectangle Rendering

```javascript
const chartOptions = {
  useDirtyRect: true,  // Only redraw changed regions
  // ... other options
};
```

#### Axis Optimization

```javascript
const chartOptions = {
  xAxis: {
    axisLabel: {
      interval: 'auto',  // Auto-skip labels
      rotate: 45,         // Rotate if needed
    },
  },
  yAxis: {
    splitNumber: 5,  // Limit grid lines
  },
};
```

### 6. State Management Optimization

#### Selective Subscriptions

```javascript
import { useInteractionStore } from './utils/chartInteractions';

// Subscribe only to needed state
function ChartComponent({ chartId }) {
  // Only re-render when this chart's filters change
  const chartFilters = useInteractionStore(
    state => state.activeFilters[chartId]
  );

  // More efficient than subscribing to all filters
  // const allFilters = useInteractionStore(state => state.activeFilters);
}
```

#### Batch Updates

```javascript
// Bad: Multiple state updates
activeFilters.forEach(filter => {
  addFilter(chartId, filter);
});

// Good: Batch update
useInteractionStore.setState(state => ({
  activeFilters: {
    ...state.activeFilters,
    [chartId]: [...state.activeFilters[chartId], ...newFilters],
  },
}));
```

### 7. Data Structure Optimization

#### Use Maps for Fast Lookups

```javascript
// Slow: Array.find() for each lookup
function findDataPoint(data, id) {
  return data.find(item => item.id === id); // O(n)
}

// Fast: Use Map
const dataMap = useMemo(() => {
  return new Map(data.map(item => [item.id, item]));
}, [data]);

function findDataPoint(id) {
  return dataMap.get(id); // O(1)
}
```

#### Index Common Queries

```javascript
// Pre-compute category index
const categoryIndex = useMemo(() => {
  const index = {};
  data.forEach(item => {
    if (!index[item.category]) {
      index[item.category] = [];
    }
    index[item.category].push(item);
  });
  return index;
}, [data]);

// Fast category filtering
const filtered = categoryIndex[selectedCategory];
```

### 8. Chart Count Optimization

#### Recommended Limits

| Data Size | Max Charts | Reasoning |
|-----------|-----------|-----------|
| <1,000 | 6 | No restrictions |
| 1,000-5,000 | 4 | Maintain 60fps |
| 5,000-10,000 | 3 | Reduce overhead |
| >10,000 | 2 | Sample data or aggregate |

#### Dynamic Chart Loading

```javascript
function LazyChartContainer({ charts, data }) {
  const [visibleCharts, setVisibleCharts] = useState(charts.slice(0, 2));

  // Load more charts when user scrolls
  const loadMoreCharts = useCallback(() => {
    if (visibleCharts.length < charts.length) {
      setVisibleCharts(prev => [
        ...prev,
        charts[prev.length],
      ]);
    }
  }, [charts, visibleCharts]);

  return (
    <>
      {visibleCharts.map(chart => (
        <InteractiveEChartsRenderer key={chart.id} config={chart} data={data} />
      ))}
      {visibleCharts.length < charts.length && (
        <button onClick={loadMoreCharts}>Load More Charts</button>
      )}
    </>
  );
}
```

## Performance Monitoring

### Built-in Performance Monitor

```javascript
import { PerformanceMonitor } from './utils/chartInteractions';

const monitor = new PerformanceMonitor();

// Measure render time
const startTime = monitor.startMeasure('renderTime');
// ... rendering operation ...
monitor.endMeasure('renderTime', startTime);

// Measure interaction time
const interactionStart = monitor.startMeasure('interactionTime');
// ... interaction handler ...
monitor.endMeasure('interactionTime', interactionStart);

// Get metrics
const metrics = monitor.getMetrics();
console.log('Performance Metrics:', metrics);
/*
{
  renderTime: { avg: 45, min: 30, max: 120, count: 50 },
  interactionTime: { avg: 12, min: 5, max: 35, count: 200 },
  processingTime: { avg: 8, min: 2, max: 25, count: 150 }
}
*/
```

### React DevTools Profiler

```javascript
import { Profiler } from 'react';

function onRenderCallback(
  id, // Component identifier
  phase, // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration, // Estimated time without memoization
  startTime,
  commitTime,
  interactions
) {
  console.log(`${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
}

<Profiler id="InteractiveCharts" onRender={onRenderCallback}>
  <InteractiveChartsContainer data={data} />
</Profiler>
```

### Browser Performance API

```javascript
// Mark start of operation
performance.mark('filter-start');

// ... apply filters ...

// Mark end of operation
performance.mark('filter-end');

// Measure duration
performance.measure('filter-operation', 'filter-start', 'filter-end');

// Get measurement
const measures = performance.getEntriesByName('filter-operation');
console.log('Filter took:', measures[0].duration, 'ms');
```

## Performance Checklist

### Before Launch

- [ ] Test with production dataset size
- [ ] Enable performance monitoring
- [ ] Verify 60fps on target hardware
- [ ] Check memory usage (Chrome DevTools)
- [ ] Test with max number of charts (6)
- [ ] Verify all interactions smooth
- [ ] Test on slower devices
- [ ] Profile with React DevTools

### Data Size Optimization

- [ ] Implement sampling for >5,000 rows
- [ ] Use aggregation where appropriate
- [ ] Index frequently queried fields
- [ ] Cache expensive calculations
- [ ] Minimize data transformations

### Interaction Optimization

- [ ] Throttle hover events (100ms)
- [ ] Debounce filter application (300ms)
- [ ] Batch state updates
- [ ] Use selective subscriptions
- [ ] Minimize re-renders

### Rendering Optimization

- [ ] Choose optimal renderer (Canvas/SVG)
- [ ] Enable dirty rectangle rendering
- [ ] Configure animation thresholds
- [ ] Use progressive rendering
- [ ] Optimize axis labels

### Chart Optimization

- [ ] Limit charts to 4 for large datasets
- [ ] Use appropriate chart types
- [ ] Minimize visual elements
- [ ] Optimize tooltips
- [ ] Reduce legend items

## Troubleshooting Performance Issues

### Issue: Laggy Hover Interactions

**Symptoms:**
- Hover highlights delayed
- Charts freeze when hovering
- FPS drops during hover

**Diagnosis:**
```javascript
// Check hover event frequency
let hoverCount = 0;
setInterval(() => {
  console.log('Hovers/sec:', hoverCount);
  hoverCount = 0;
}, 1000);

const handleHover = (params) => {
  hoverCount++;
  // ... handler logic
};
```

**Solutions:**
1. Increase throttle delay: `throttle(handleHover, 150)`
2. Disable hover sync for large datasets
3. Reduce number of charts
4. Sample data

### Issue: Slow Filter Application

**Symptoms:**
- Delay between click and filter
- Charts freeze when filtering
- UI becomes unresponsive

**Diagnosis:**
```javascript
console.time('filter-application');
const filtered = applyCrossFilters(data, filters, chartId);
console.timeEnd('filter-application');
```

**Solutions:**
1. Increase debounce delay: `debounce(applyFilters, 400)`
2. Use indexed data structures
3. Implement data sampling
4. Batch filter updates

### Issue: High Memory Usage

**Symptoms:**
- Browser tab crashes
- Gradual performance degradation
- Warning: "Page unresponsive"

**Diagnosis:**
```javascript
// Chrome DevTools > Performance > Memory
// Take heap snapshot before and after operations

// Check for memory leaks
if (typeof window.gc === 'function') {
  window.gc(); // Force garbage collection (Chrome with --js-flags=--expose-gc)
}
```

**Solutions:**
1. Clear old data: `useEffect(() => () => clearData(), [])`
2. Unsubscribe from stores: `useEffect(() => unsub, [unsub])`
3. Destroy chart instances: `chart.dispose()`
4. Limit data retention

### Issue: Choppy Animations

**Symptoms:**
- Animations stutter
- FPS drops during transitions
- Visual artifacts

**Diagnosis:**
```javascript
// Monitor frame rate
let frames = 0;
let lastTime = performance.now();

function countFrames() {
  frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log('FPS:', frames);
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(countFrames);
}
requestAnimationFrame(countFrames);
```

**Solutions:**
1. Reduce animation duration: `AnimationPresets.FAST`
2. Disable animations: `animation: false`
3. Use CSS transitions instead
4. Reduce simultaneous animations

## Best Practices

### 1. Lazy Loading

```javascript
import { lazy, Suspense } from 'react';

const InteractiveChartsContainer = lazy(() => 
  import('./components/InteractiveChartsContainer')
);

function App() {
  return (
    <Suspense fallback={<div>Loading charts...</div>}>
      <InteractiveChartsContainer data={data} />
    </Suspense>
  );
}
```

### 2. Virtual Scrolling (For Many Charts)

```javascript
import { FixedSizeList } from 'react-window';

function ChartList({ charts, data }) {
  const renderChart = ({ index, style }) => (
    <div style={style}>
      <InteractiveEChartsRenderer
        config={charts[index]}
        data={data}
      />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={charts.length}
      itemSize={300}
      width="100%"
    >
      {renderChart}
    </FixedSizeList>
  );
}
```

### 3. Web Workers (For Heavy Computation)

```javascript
// worker.js
self.onmessage = function(e) {
  const { data, filters } = e.data;
  const filtered = applyCrossFilters(data, filters);
  self.postMessage(filtered);
};

// main.js
const worker = new Worker('worker.js');

worker.postMessage({ data, filters });

worker.onmessage = function(e) {
  setFilteredData(e.data);
};
```

### 4. Image Caching (For Static Charts)

```javascript
// Cache chart as image for static views
const cacheChartAsImage = async (chart) => {
  const dataURL = chart.getDataURL({
    pixelRatio: 2,
    backgroundColor: '#fff'
  });
  
  // Store in cache
  localStorage.setItem('chart-cache', dataURL);
};

// Load from cache
const cachedImage = localStorage.getItem('chart-cache');
if (cachedImage) {
  // Display cached image while loading
}
```

## Performance Budgets

### Target Metrics

| Metric | Target | Maximum |
|--------|--------|---------|
| Initial Load | <2s | 3s |
| Interaction Response | <100ms | 200ms |
| Filter Application | <300ms | 500ms |
| Chart Render | <50ms | 100ms |
| Hover Update | <16ms | 33ms |
| Frame Rate | 60fps | 30fps |
| Memory Usage | <200MB | 500MB |

### Monitoring

Set up continuous monitoring:

```javascript
// Monitor performance continuously
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.duration > 100) {
      console.warn('Slow operation:', entry.name, entry.duration);
    }
  });
});

performanceObserver.observe({ entryTypes: ['measure'] });
```

## Resources

- [ECharts Performance Guide](https://echarts.apache.org/handbook/en/best-practices/performance)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

---

**Performance is a feature!** Regularly monitor, test, and optimize for the best user experience.
