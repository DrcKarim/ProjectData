# Visualization Builder - Quick Start Guide

## 5-Minute Setup

### 1. **Start the Application**
```bash
cd ProjectData/Frontend
npm install  # If not already done
npm start
```

Your app opens at `http://localhost:3000`

### 2. **Upload Data**
- Click **📤 Upload & Explore** tab
- Click "Choose File"
- Select a CSV, JSON, or TXT file
- Click "Upload & Analyze"
- View data profile and statistics

### 3. **Switch to Visualization Builder**
- Click **📊 Visualization Builder** tab
- Chart builder interface appears

---

## Creating Your First Chart

### Step 1: Select Chart Type
1. In the sidebar, open **Chart Type** tab
2. Browse 12+ chart types: Bar, Line, Pie, Scatter, etc.
3. Click a chart type to select it
4. Use filters (All Charts, Numeric, Color Scale, Multi-Series) to narrow options

**Recommended Chart Types**:
- **Bar/Column**: Categories with values
- **Line**: Trends over time
- **Scatter**: Correlations between two values
- **Pie**: Composition/percentages
- **Heatmap**: Pattern detection in 2D data

### Step 2: Map Data Fields
1. Open **Data Mapping** tab
2. Select fields from dropdowns:
   - **X-Axis**: Category or independent variable
   - **Y-Axis**: Numeric value (required)
   - **Series**: Optional - splits data into multiple lines/bars
   - **Size**: Optional - bubble size (scatter charts)
   - **Color**: Optional - color intensity (heatmaps)

**Field Type Indicators**:
- 🟦 **Blue badge**: Numeric field
- 🟪 **Purple badge**: Categorical field

### Step 3: Configure Aggregation (Optional)
1. Open **Aggregation** tab
2. Toggle "Enable Aggregation" ON
3. Select aggregation functions:
   - **X-Axis**: Usually "First" (for categories)
   - **Y-Axis**: "Sum", "Avg", "Count", etc.

**When to Use**:
- ✓ Dataset > 1000 rows
- ✓ Need to group by categories
- ✓ Summarize numeric values

### Step 4: Customize Appearance
1. Open **Color & Tooltip** tab
2. **Color Scale**: Choose from 13 predefined palettes
3. **Tooltip**: Configure on-hover information

---

## Common Workflows

### Create a Sales Trend Chart
```
Data: date, sales, region

1. Chart Type → Line
2. Mapping:
   - X-Axis: date
   - Y-Axis: sales
   - Series: region
3. Aggregation:
   - Enable: ON
   - Y-Axis: Sum
4. Result: Multi-line trend chart showing sales by region over time
```

### Analyze Customer Segments
```
Data: age, income, segment, purchases

1. Chart Type → Scatter
2. Mapping:
   - X-Axis: age
   - Y-Axis: income
   - Series: segment
   - Size: purchases
3. Color Scale: Category palette
4. Result: Bubble chart showing customer segments
```

### Compare Performance by Category
```
Data: category, Q1, Q2, Q3, Q4

1. Chart Type → Bar
2. Mapping:
   - X-Axis: category
   - Y-Axis: Q1 (repeat for each quarter with series)
   - Series: quarter_name
3. Aggregation:
   - Enable: OFF (data already aggregated)
4. Result: Grouped bar chart comparing quarters
```

---

## Feature Reference

### Chart Type Selector
- **12 Chart Types**: Bar, Column, Line, Area, Scatter, Pie, Donut, Heatmap, Treemap, Sunburst, Gauge, Funnel, Sankey
- **Smart Filtering**: Filter by capabilities (numeric, color scale, multi-series)
- **Descriptions**: Hover for chart usage tips

### Data Mapping Panel
- **Type Validation**: Only compatible fields shown
- **Statistics**: See min/max/avg for numeric fields
- **Smart Defaults**: Auto-selects appropriate fields

### Aggregation Controls
- **10 Functions**: Sum, Avg, Count, Min, Max, Median, Std Dev, Distinct, First, Last
- **Category Organization**: Grouped by function type
- **Smart Filtering**: Only applicable functions shown

### Color Scales
- **13 Presets**: Sequential (Blues, Greens, etc.), Diverging (Red-Blue), Categorical
- **Reversible**: Toggle direction with one click
- **Min/Max Range**: Customize value mapping

### Tooltip Configuration
- **3 Trigger Modes**: Item, Axis, None
- **Content Control**: Show series name, value, percentage
- **Custom Styling**: Background and text color

### Export
- **Download Config**: Save as JSON file
- **Reloadable**: Import configuration later
- **Share**: Send JSON to teammates

---

## Tips & Tricks

### 🎯 Performance
- For **10,000+ rows**: Enable aggregation
- Group data by category before charting
- Use filters to reduce data size

### 🎨 Best Practices
- **Colors**: Use sequential for continuous data, categorical for groups
- **Labels**: Keep chart title descriptive
- **Fields**: Use meaningful column names
- **Tooltips**: Show all relevant data points

### 🔍 Troubleshooting
| Problem | Solution |
|---------|----------|
| Chart blank | Check X & Y axes are mapped |
| Data looks odd | Enable/disable aggregation |
| Colors confusing | Switch color scale |
| Tooltip missing | Change trigger from "None" |

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Next Tab | `Tab` |
| Select Chart | `Arrow Keys` |
| Toggle Checkbox | `Space` |

---

## Export & Save

### Export Configuration
```json
{
  "type": "bar",
  "title": "Sales by Region",
  "dataMapping": {
    "x": "region",
    "y": "sales",
    "series": "quarter"
  },
  "aggregation": {
    "enabled": true,
    "yAgg": "sum"
  },
  "colorScale": {
    "type": "blues",
    "reverse": false
  },
  "tooltip": {
    "trigger": "item",
    "showValue": true
  }
}
```

Save this JSON to reload the same configuration later.

---

## Sample Datasets to Try

### Retail Sales
```csv
date,product,region,sales,quantity
2024-01-01,Widget A,North,1000,50
2024-01-01,Widget B,South,1500,75
2024-01-02,Widget A,East,1200,60
```

### Student Performance
```csv
student_name,math,science,english,grade_level
Alice,95,92,88,10
Bob,87,90,85,10
Charlie,92,88,90,11
```

### Website Analytics
```csv
date,page,visitors,bounce_rate,avg_time_on_page
2024-01-01,homepage,5000,0.32,120
2024-01-01,about,1200,0.45,60
2024-01-01,products,3500,0.28,180
```

---

## Advanced Features

### Custom Filters (Coming Soon)
- Complex filter conditions
- Multiple criteria
- Date ranges

### Save to Cloud (Coming Soon)
- Store configurations
- Team collaboration
- Version history

### Real-Time Updates (Coming Soon)
- Live data streaming
- Automatic refresh
- Streaming aggregation

---

## Getting Help

### Documentation
- 📖 Full docs: `VISUALIZATION_BUILDER_DOCS.md`
- 📊 Component API: See individual component files
- 🔧 Configuration: Check `chartConfig.js`

### Support
- Check browser console for errors (F12)
- Verify data format is correct
- Ensure column names have no special characters

---

**Happy Visualizing! 📊✨**

For detailed documentation, see `VISUALIZATION_BUILDER_DOCS.md`
