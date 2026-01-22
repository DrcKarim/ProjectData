# 📊 Professional Visualization Builder

> Enterprise-grade interactive chart configuration system with 12+ chart types, advanced aggregation, and color mapping.

## ✨ Features at a Glance

- **12+ Chart Types**: Bar, Line, Scatter, Pie, Heatmap, Treemap, Sunburst, and more
- **Smart Data Mapping**: Drag-and-drop field assignment with type validation
- **10 Aggregation Functions**: Sum, Average, Count, Min, Max, Median, StdDev, and more
- **13 Color Scales**: Sequential, diverging, and categorical palettes
- **Advanced Tooltips**: Configurable triggers and styling
- **Apache ECharts**: Professional rendering engine
- **Export/Import**: Save and reload configurations
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Installation

```bash
cd ProjectData/Frontend
npm install echarts --save
npm start
```

### Basic Usage

```javascript
import VisualizationBuilder from './components/VisualizationBuilder';

const data = [
  { category: 'A', value: 100 },
  { category: 'B', value: 200 },
  { category: 'C', value: 150 },
];

<VisualizationBuilder 
  data={data}
  theme={themeConfig}
/>
```

---

## 📖 Documentation Structure

| File | Description |
|------|-------------|
| `VISUALIZATION_BUILDER_DOCS.md` | Complete technical documentation |
| `VISUALIZATION_BUILDER_QUICKSTART.md` | 5-minute getting started guide |
| `README_VISUALIZATION.md` | This file - overview and introduction |

---

## 🎨 Chart Type Gallery

### 📊 Bar & Column Charts
Best for: Comparing categories
- Horizontal bars
- Vertical columns
- Multi-series support
- Aggregation friendly

### 📈 Line & Area Charts
Best for: Trends over time
- Smooth curves
- Filled areas
- Time series
- Multi-line comparisons

### 🔵 Scatter Charts
Best for: Correlations
- Bubble sizes
- Color mapping
- Pattern detection
- Outlier identification

### 🥧 Pie & Donut Charts
Best for: Composition
- Percentage display
- Category breakdown
- Hierarchical donuts
- Custom labels

### 🔥 Heatmaps
Best for: 2D patterns
- Color intensity mapping
- Matrix visualization
- Correlation matrices
- Activity patterns

### 📦 Treemaps & Sunburst
Best for: Hierarchical data
- Nested structures
- Size-based visualization
- Drill-down capability
- Space-efficient

### 🎯 Gauges & Funnels
Best for: KPIs and conversions
- Target ranges
- Conversion stages
- Progress indicators
- Drop-off analysis

---

## 🔧 Component Architecture

```
VisualizationBuilder (Main)
├── ChartTypeSelector      # Chart type selection
├── DataMappingPanel       # X, Y, series mapping
├── AggregationControls    # Aggregation functions
├── ColorScaleConfig       # Color configuration
├── TooltipConfig          # Tooltip settings
└── EChartsRenderer        # Chart rendering
```

### Utility Modules

```
utils/
├── chartConfig.js         # Types, metadata, validation
└── chartAggregation.js    # Data transformation
```

---

## 💡 Key Concepts

### Chart Types
12+ professional chart types optimized for different data structures and use cases.

### Data Mapping
Connect your data fields to visual dimensions (X-axis, Y-axis, series, size, color).

### Aggregation
Group and summarize data using 10 aggregation functions (Sum, Average, Count, etc.).

### Color Scales
13 predefined color palettes for sequential, diverging, and categorical data.

### Tooltips
Configure on-hover information display with multiple trigger modes and custom styling.

---

## 🎯 Use Cases

### Business Analytics
- Sales performance dashboards
- Revenue trends by region
- Product comparison charts
- Customer segmentation analysis

### Scientific Research
- Experiment result visualization
- Statistical distribution charts
- Correlation matrices
- Time series analysis

### Education
- Student performance tracking
- Grade distribution charts
- Course enrollment trends
- Assessment analytics

### Operations
- Process funnel analysis
- Performance metrics gauges
- Resource utilization heatmaps
- Workflow sankey diagrams

---

## 🔄 Workflow Example

```
1. Upload Data (CSV, JSON, TXT)
   ↓
2. Select "Visualization Builder" tab
   ↓
3. Choose Chart Type (e.g., Bar)
   ↓
4. Map Fields:
   - X-Axis → "category"
   - Y-Axis → "sales"
   - Series → "region"
   ↓
5. Enable Aggregation:
   - Y-Axis → Sum
   ↓
6. Configure Colors & Tooltips
   ↓
7. View Interactive Chart
   ↓
8. Export Configuration (JSON)
```

---

## 🛠️ Configuration Schema

Every chart is defined by a configuration object:

```javascript
{
  type: 'bar',                    // Chart type
  title: 'Sales by Region',       // Display title
  dataMapping: {
    x: 'region',                  // X-axis field
    y: 'sales',                   // Y-axis field
    series: 'quarter',            // Series field
  },
  aggregation: {
    enabled: true,                // Enable aggregation
    yAgg: 'sum',                  // Y-axis aggregation
  },
  colorScale: {
    type: 'blues',                // Color scale type
    reverse: false,               // Reverse direction
  },
  tooltip: {
    trigger: 'item',              // Trigger mode
    showValue: true,              // Show value
  },
  // ... more options
}
```

---

## 📊 Data Requirements

### Format
- **CSV**: Comma-separated values
- **JSON**: Array of objects
- **TXT**: Tab or comma delimited

### Structure
```javascript
[
  { field1: value1, field2: value2, ... },
  { field1: value1, field2: value2, ... },
  // ...
]
```

### Size Limits
- **Recommended**: < 10,000 rows for real-time performance
- **Maximum**: 100,000 rows (with aggregation)
- **Optimized**: Use aggregation for datasets > 1,000 rows

---

## 🎨 Theming

Customize the appearance with theme configuration:

```javascript
const theme = {
  colors: {
    primary: '#3b82f6',
    primaryDark: '#1d4ed8',
    primaryLight: '#eff6ff',
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    border: '#e0e0e0',
    text: '#1f2937',
    textSecondary: '#6b7280',
  }
};

<VisualizationBuilder theme={theme} />
```

---

## 🚀 Performance Tips

1. **Enable Aggregation** for datasets > 1,000 rows
2. **Use Filters** to reduce data size before charting
3. **Select Appropriate Chart Types** - simpler charts = faster rendering
4. **Limit Series Count** - keep to < 10 series for clarity

---

## 🔍 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| IE | Any | ❌ Not supported |

---

## 📦 Dependencies

- **React**: 18.2+
- **Apache ECharts**: 5.4.0
- **styled-components**: 6.1.0
- **Zustand**: 4.4.7 (state management)

---

## 🔧 API Reference

### VisualizationBuilder Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | `[]` | Data rows to visualize |
| `theme` | Object | `{}` | Theme configuration |
| `onConfigChange` | Function | - | Callback on config change |

### ChartTypeSelector Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedType` | String | - | Current chart type |
| `onChange` | Function | - | Selection callback |
| `filterByCapability` | String | `'all'` | Filter types |

### DataMappingPanel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | Object | - | Chart configuration |
| `onChange` | Function | - | Config change callback |
| `data` | Array | `[]` | Data rows |
| `chartType` | String | - | Current chart type |

---

## 🎓 Learning Resources

### Tutorials
1. **5-Minute Quickstart**: See `VISUALIZATION_BUILDER_QUICKSTART.md`
2. **Complete Documentation**: See `VISUALIZATION_BUILDER_DOCS.md`
3. **Component API**: Check individual component files

### Examples
- Sales trend analysis (line chart)
- Customer segmentation (scatter plot)
- Performance comparison (bar chart)
- Composition breakdown (pie chart)

---

## 🤝 Contributing

This is part of a Master-level course project. Enhancements welcome:
- Additional chart types
- Custom aggregation functions
- More color scales
- Real-time data streaming
- Collaborative features

---

## 📜 License

Part of Interactive Data Visualization System - Master-Level Course

---

## 🎉 Getting Started

1. **Read**: Quick Start Guide (`VISUALIZATION_BUILDER_QUICKSTART.md`)
2. **Try**: Upload sample data and create your first chart
3. **Explore**: Switch between chart types and configurations
4. **Learn**: Dive into full documentation (`VISUALIZATION_BUILDER_DOCS.md`)
5. **Create**: Build professional visualizations for your projects

---

**Built with ❤️ using React, Apache ECharts, and modern web technologies**

For detailed documentation, see `VISUALIZATION_BUILDER_DOCS.md`  
For quick start guide, see `VISUALIZATION_BUILDER_QUICKSTART.md`
