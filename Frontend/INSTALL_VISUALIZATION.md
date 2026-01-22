# Installation & Setup Guide - Visualization Builder

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Navigate to Frontend Directory

```bash
cd "c:\Mes Documents\paris 8\THYP\Vsualisation, Interface et Interactivité\ProjectData\Frontend"
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React 18.2.0
- Apache ECharts 5.4.0
- styled-components 6.1.0
- Zustand 4.4.7
- All other required dependencies

### 3. Verify Installation

Check that ECharts was installed:

```bash
npm list echarts
```

Expected output:
```
data-visualization-explorer@2.0.0
└── echarts@5.4.0
```

### 4. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## File Structure

After installation, your project structure should include:

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ChartTypeSelector.js       ✅ NEW
│   │   ├── DataMappingPanel.js        ✅ NEW
│   │   ├── AggregationControls.js     ✅ NEW
│   │   ├── ColorScaleConfig.js        ✅ NEW
│   │   ├── TooltipConfig.js           ✅ NEW
│   │   ├── EChartsRenderer.js         ✅ NEW
│   │   ├── VisualizationBuilder.js    ✅ NEW
│   │   └── [existing components...]
│   ├── utils/
│   │   ├── chartConfig.js             ✅ NEW
│   │   ├── chartAggregation.js        ✅ NEW
│   │   └── [existing utilities...]
│   └── App.js                         ✅ UPDATED
├── package.json                       ✅ UPDATED
├── VISUALIZATION_BUILDER_DOCS.md      ✅ NEW
├── VISUALIZATION_BUILDER_QUICKSTART.md ✅ NEW
├── README_VISUALIZATION.md            ✅ NEW
└── INSTALL_VISUALIZATION.md           ✅ THIS FILE
```

## Verification Checklist

After installation, verify:

- [ ] `npm start` runs without errors
- [ ] Application opens at http://localhost:3000
- [ ] Can see "📤 Upload & Explore" tab
- [ ] Can see "📊 Visualization Builder" tab (disabled until data uploaded)
- [ ] No console errors in browser (press F12 to check)

## Testing the Visualization Builder

### Step 1: Upload Sample Data

Create a file `test-data.csv`:

```csv
category,value,region
A,100,North
B,150,North
C,200,South
A,120,South
B,180,South
C,220,North
```

### Step 2: Upload in App

1. Click "📤 Upload & Explore" tab
2. Click "Choose File"
3. Select `test-data.csv`
4. Click "Upload & Analyze"
5. View data profile

### Step 3: Open Visualization Builder

1. Click "📊 Visualization Builder" tab
2. Verify builder interface appears
3. See chart type selector on left
4. See chart preview area on right

### Step 4: Create Test Chart

1. **Chart Type**: Select "Bar"
2. **Data Mapping**:
   - X-Axis: category
   - Y-Axis: value
   - Series: region
3. **Aggregation**: Enable, Y-Axis = Sum
4. **Result**: Bar chart appears on right

## Troubleshooting

### Issue: "Cannot find module 'echarts'"

**Solution**: Install ECharts manually:
```bash
npm install echarts@5.4.0 --save
```

### Issue: Styling looks broken

**Solution**: Verify styled-components is installed:
```bash
npm list styled-components
```

If not found:
```bash
npm install styled-components@^6.1.0 --save
```

### Issue: Chart not displaying

**Checks**:
1. Open browser console (F12)
2. Look for error messages
3. Verify data is uploaded
4. Check X and Y axes are mapped

### Issue: "Builder tab is disabled"

**Solution**: Upload data first using the "Upload & Explore" tab. The builder requires data to be loaded.

### Issue: Build errors on npm start

**Solution**: Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Port 3000 already in use

**Solution**: Use a different port:
```bash
PORT=3001 npm start
```

Or kill process on port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## Browser Console Verification

Open browser console (F12) and check for:

✅ **Good Signs**:
```
React App running...
Data loaded successfully
Chart rendered
```

❌ **Error Signs**:
```
Cannot find module 'echarts'
styled-components not found
Chart configuration invalid
```

## Dependencies Version Check

Verify all key dependencies are installed correctly:

```bash
npm list react react-dom echarts styled-components zustand
```

Expected output:
```
data-visualization-explorer@2.0.0
├── react@18.2.0
├── react-dom@18.2.0
├── echarts@5.4.0
├── styled-components@6.1.0
└── zustand@4.4.7
```

## Performance Optimization

For production builds:

```bash
npm run build
```

This creates an optimized production build in `build/` directory.

Serve the production build:

```bash
npx serve -s build
```

## Environment Variables

Create `.env` file if needed:

```env
REACT_APP_API_URL=http://localhost:8000
PORT=3000
BROWSER=none
```

## Next Steps

1. ✅ Installation complete
2. 📖 Read Quick Start: `VISUALIZATION_BUILDER_QUICKSTART.md`
3. 📚 Read Full Docs: `VISUALIZATION_BUILDER_DOCS.md`
4. 🎨 Create your first visualization
5. 🚀 Build amazing charts!

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify all dependencies are installed
3. Try clearing cache and reinstalling
4. Check documentation files
5. Review component code for hints

---

**Installation completed! 🎉**

Next: Open `VISUALIZATION_BUILDER_QUICKSTART.md` for a 5-minute tutorial.
