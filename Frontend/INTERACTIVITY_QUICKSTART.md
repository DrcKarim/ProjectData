# Quick Start: Advanced Chart Interactions

Get up and running with interactive multi-chart dashboards in 5 minutes!

## Prerequisites

- Completed basic visualization builder setup
- Data uploaded and parsed
- At least 1 chart configured

## Step 1: Enable Multi-Chart Mode

1. Open the Visualization Builder
2. Look for the view mode selector at the top of the sidebar
3. Click **"📈 Multi-Chart Interactive"** button

```
┌─────────────────────────────────┐
│ 📊 Single Chart                 │
│ 📈 Multi-Chart Interactive [✓]  │
└─────────────────────────────────┘
```

You should now see 2 default charts (Bar and Scatter) in a side-by-side layout.

## Step 2: Understand the Interface

### Control Panel (Top)

```
┌─────────────────────────────────────────────┐
│ ☑ Cross-Filtering  ☑ Brushing  ☑ Hover Sync │
│ Layout: [2x1 ▼]  ☐ Performance Metrics      │
└─────────────────────────────────────────────┘
```

- **Cross-Filtering**: Click data points to filter other charts
- **Brushing**: Select regions on scatter plots
- **Hover Sync**: Hover highlights across charts
- **Layout**: Change grid layout (1x1, 2x1, 3x1, 2x2)
- **Performance**: Show/hide metrics

### Active Filters Display

```
┌─────────────────────────────────────┐
│ Active Filters:                     │
│ [category = A ✕] [value: 10-50 ✕]  │
│ [Clear All Filters]                 │
└─────────────────────────────────────┘
```

- Blue chips show active filters
- Click ✕ to remove individual filters
- "Clear All" removes all filters at once

### Chart Grid

```
┌──────────────────┬──────────────────┐
│  Bar Chart       │  Scatter Plot    │
│  [1 Filter]      │  [Brush]         │
│                  │                  │
│  [Chart Data]    │  [Chart Data]    │
│                  │                  │
└──────────────────┴──────────────────┘
```

Each chart shows:
- Chart type and title
- Active interaction badges
- Filtered data

## Step 3: Try Cross-Filtering

**Scenario**: You have sales data with categories and values.

1. **Click a bar** in the Bar Chart
   - Other charts update to show only that category
   - The bar chart itself stays unchanged
   - A filter chip appears: `[category = Electronics ✕]`

2. **Observe the results**
   - Scatter plot updates with animation
   - Only data for "Electronics" is shown
   - Charts are highlighted with colored borders

3. **Click another data point**
   - Adds another filter
   - Both filters apply simultaneously
   - More filter chips appear

4. **Remove a filter**
   - Click the ✕ on any filter chip
   - Charts update to remove that filter
   - Or click "Clear All Filters" to reset

**Visual Feedback:**
```
Chart with active filter:
┌─────────────────────────┐ ← Blue border (2px)
│ Bar Chart     [2 Filters]│
│                          │
│     █                    │
│   █ █ █                  │
│ ─────────                │
└─────────────────────────┘
```

## Step 4: Try Brushing (Scatter Plots Only)

**Scenario**: Identifying patterns in scatter plot data.

1. **Look for brush tools** on the scatter plot
   ```
   Top-right corner: [▭] [⬡] [✕]
   ```
   - ▭ Rectangle brush
   - ⬡ Polygon brush
   - ✕ Clear selection

2. **Click and drag** to select a region
   - A semi-transparent blue box appears
   - Selected points are highlighted
   - Other charts update to show only selected data

3. **Refine selection**
   - Drag again to select different region
   - Use polygon tool for custom shapes
   - Click clear to remove selection

4. **Convert to filter** (optional)
   - Selected region automatically filters other charts
   - Creates range filters: `[x: 10-50]`, `[y: 20-80]`

**Brush Selection Visual:**
```
┌─────────────────────────┐
│ Scatter Plot      [Brush]│
│                          │
│     • • ┌─────┐          │
│   • • • │█ █ █│ •        │
│     • • └─────┘          │ ← Blue semi-transparent
│                          │   selection box
└─────────────────────────┘
```

## Step 5: Try Hover Synchronization

**Scenario**: Exploring data relationships across views.

1. **Hover over a data point** in any chart
   - Point highlights with a border
   - Related points in other charts highlight
   - Non-related points dim (opacity 0.3)

2. **Move your mouse** across the chart
   - Highlights update smoothly (100ms throttle)
   - Multiple charts respond in real-time
   - Smooth animations (200ms)

3. **Move mouse away**
   - All highlights clear
   - Charts return to normal state

**Hover State Visual:**
```
Chart 1 (Hovered):          Chart 2 (Linked):
┌──────────────────┐        ┌──────────────────┐
│ Bar Chart  [Hover]│        │ Line Chart [Hover]│
│                   │        │                   │
│     █◄──          │        │   •               │
│   █ █ █           │   →    │  • ◄── Highlighted│
│ ─────────         │        │ •     (border)    │
│      ↑ Hovered    │        │   Dimmed (0.3)    │
└──────────────────┘        └──────────────────┘
```

## Step 6: Manage Multiple Charts

### Add a Chart

1. Click **"+ Add Chart"** button (bottom-right)
2. New chart appears with default configuration
3. Automatically linked to existing charts
4. Can add up to 6 charts total

### Remove a Chart

1. Look for **"✕ Remove"** button on chart
2. Click to remove chart
3. Filters from that chart are preserved
4. Other charts remain linked

### Change Layout

1. Click **Layout** dropdown
2. Select from:
   - **1x1**: Single chart (full width)
   - **2x1**: Two charts side-by-side
   - **3x1**: Three charts in a row
   - **2x2**: Four charts in 2×2 grid

3. Charts rearrange automatically

**Layout Examples:**
```
2x1 Layout:
┌────────┬────────┐
│ Chart1 │ Chart2 │
└────────┴────────┘

2x2 Layout:
┌────────┬────────┐
│ Chart1 │ Chart2 │
├────────┼────────┤
│ Chart3 │ Chart4 │
└────────┴────────┘
```

## Step 7: Monitor Performance

1. **Enable Performance Metrics**
   - Check "Performance Metrics" in control panel

2. **View Metrics Display**
   ```
   ┌────────────────────────────────────┐
   │ 📊 4 charts | 1,234 data points    │
   │ 🔗 Cross-Filtering: ON | Hover: ON │
   │ 🎯 2 active filters                │
   └────────────────────────────────────┘
   ```

3. **Interpret Metrics**
   - **Charts**: Total number of linked charts
   - **Data Points**: Total across all charts
   - **Filters**: Number of active filters
   - **Status**: Which features are enabled

4. **Performance Tips**
   - <1,000 points: All features enabled
   - 1,000-5,000: Smooth performance expected
   - 5,000-10,000: Consider aggregation
   - >10,000: Auto-sampling recommended

## Common Use Cases

### Use Case 1: Sales Analysis

**Setup:**
- Chart 1: Bar chart (Sales by Category)
- Chart 2: Line chart (Sales over Time)
- Chart 3: Scatter plot (Price vs. Profit)

**Workflow:**
1. Click high-performing category in bar chart
2. Line chart shows temporal trend for that category
3. Scatter plot reveals price/profit relationship
4. Brush outliers in scatter to investigate further

### Use Case 2: Customer Segmentation

**Setup:**
- Chart 1: Scatter (Age vs. Income)
- Chart 2: Bar (Segment Distribution)
- Chart 3: Pie (Product Preferences)

**Workflow:**
1. Brush age/income cluster in scatter plot
2. Bar chart shows segment composition
3. Pie chart reveals product preferences
4. Click segment to explore sub-groups

### Use Case 3: Quality Control

**Setup:**
- Chart 1: Line (Defect Rate over Time)
- Chart 2: Bar (Defects by Product)
- Chart 3: Scatter (Temperature vs. Defects)

**Workflow:**
1. Hover over spike in line chart
2. Bar chart highlights products affected
3. Scatter shows correlation with temperature
4. Brush problem region to investigate

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Clear All Filters | `Ctrl + Shift + C` |
| Toggle Cross-Filter | `Ctrl + F` |
| Toggle Hover Sync | `Ctrl + H` |
| Add Chart | `Ctrl + +` |
| Remove Last Chart | `Ctrl + -` |
| Reset View | `Ctrl + R` |

*Note: Shortcuts work when focused on chart area*

## Troubleshooting

### Charts not updating together?

**Check:**
1. All interaction toggles are enabled
2. Charts are automatically linked (they should be)
3. Charts share common fields
4. No console errors

**Fix:**
```javascript
// Verify in browser console
useInteractionStore.getState().linkedCharts
// Should show array of chart IDs
```

### Hover not highlighting?

**Check:**
1. Hover sync checkbox is enabled
2. Charts have matching data fields
3. Not too many data points (>10,000)

**Fix:**
- Reduce data size with aggregation
- Check field mappings in console
- Verify hover throttle isn't too aggressive

### Performance issues?

**Check:**
1. Number of data points (<5,000 ideal)
2. Number of charts (<4 recommended)
3. Animation threshold not exceeded

**Fix:**
- Enable data sampling
- Reduce chart count
- Increase throttle/debounce delays
- Enable performance metrics to diagnose

### Filters not working?

**Check:**
1. Cross-filtering checkbox enabled
2. Filter chips visible below controls
3. Source chart not filtering itself (expected)

**Fix:**
- Click "Clear All Filters" and try again
- Check browser console for errors
- Verify data field types match

## Next Steps

### Explore Advanced Features

1. **Custom Animations**
   - Read [Performance Guide](PERFORMANCE_GUIDE.md)
   - Configure animation presets
   - Optimize for your dataset

2. **Programmatic Control**
   - Read [Full Documentation](CHART_INTERACTIONS_DOCS.md)
   - Use interaction store directly
   - Build custom controls

3. **Dashboard Composition**
   - Save multi-chart configurations
   - Export dashboard views
   - Share with team

### Best Practices

1. **Start Simple**
   - Begin with 2-3 charts
   - Add complexity gradually
   - Test with real data

2. **Think Relationships**
   - Link charts with common dimensions
   - Use different chart types for variety
   - Provide clear context

3. **Optimize Performance**
   - Aggregate large datasets
   - Use appropriate chart types
   - Monitor performance metrics

4. **User Experience**
   - Provide clear affordances
   - Show active filters prominently
   - Enable easy filter removal
   - Use smooth transitions

## Tips & Tricks

### Tip 1: Quick Filter Reset
Double-click any chart to clear all filters (when enabled in settings)

### Tip 2: Bulk Selection
Hold Shift while clicking to add multiple filters without clearing previous ones

### Tip 3: Performance Mode
Toggle off hover sync for large datasets (>5,000 points) for better performance

### Tip 4: Layout Shortcuts
Use number keys (1-4) to quickly switch layouts when focused on container

### Tip 5: Export Filtered Data
Filtered data can be exported using the original export button (single-chart mode)

## Resources

- 📚 [Complete Documentation](CHART_INTERACTIONS_DOCS.md)
- ⚡ [Performance Guide](PERFORMANCE_GUIDE.md)
- 🎨 [Chart Configuration Guide](../VISUALIZATION_BUILDER_DOCS.md)
- 📊 [Data Upload Guide](../DATA_UPLOAD_DOCS.md)

## Support

Questions? Issues?
- Check [Full Documentation](CHART_INTERACTIONS_DOCS.md)
- Review [Troubleshooting](#troubleshooting) section above
- Verify browser compatibility
- Check console for errors

---

**Ready to build powerful interactive dashboards!** 🚀

Start with 2 charts, experiment with interactions, and gradually add complexity. The system is designed to be intuitive and performant.
