# Frontend - Data Visualization Explorer

Modern React-based frontend for interactive data visualization and analysis.

## Features

- **Multi-format Support**: Upload CSV, JSON, TXT, XLSX, TSV files
- **Interactive Visualizations**: Histograms, bar charts, line charts, word clouds
- **Advanced Filtering**: Numeric ranges, categorical selection, text search
- **Real-time Statistics**: Comprehensive data analysis
- **Dark Mode**: Toggle between light/dark themes
- **Responsive Design**: Mobile-friendly interface
- **State Management**: Zustand for scalable state handling
- **Production Ready**: Optimized for deployment

## Requirements

- Node.js 14.x or higher
- npm or yarn package manager

## Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Ensure backend is running on `http://localhost:8000`:
```bash
# In Backend directory
python main.py
```

2. Start React development server:
```bash
npm start
```

The application opens at `http://localhost:3000`

## Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Charts.js          # Advanced visualizations
│   │   ├── Charts.css
│   │   ├── DatasetInfo.js     # Dataset overview & stats
│   │   ├── DatasetInfo.css
│   │   ├── Filters.js         # Interactive filtering
│   │   ├── Filters.css
│   │   ├── Header.js          # Header with dark mode
│   │   ├── Header.css
│   │   ├── MessageBanner.js   # Notifications
│   │   ├── MessageBanner.css
│   │   ├── UploadCSV.js       # File upload with drag-drop
│   │   └── UploadCSV.css
│   ├── App.js                 # Main app component
│   ├── App.css                # Global styles
│   ├── index.js               # Entry point
│   ├── index.css              # Global CSS
│   ├── api.js                 # API client
│   ├── store.js               # Zustand state management
│   └── package.json
└── README.md
```

## Components

### UploadCSV
File upload with drag-and-drop support, format validation, and file size display.

### Charts
Multi-type visualizations including:
- Histograms for numeric data
- Bar charts for categorical data
- Line charts for temporal data
- Word clouds for text analysis
- Interactive hover tooltips
- Expandable chart view

### DatasetInfo
Dataset overview displaying:
- File metadata (name, type, dimensions)
- Column information with type badges
- Detailed statistics per column
- Filtered data indicators

### Filters
Interactive filtering with:
- Numeric range sliders
- Categorical multi-select
- Text search
- Active filter display
- Reset functionality

### Header
Navigation bar with:
- App branding and description
- Dark mode toggle
- Responsive menu

### MessageBanner
Toast-style notifications for:
- Success messages (✅)
- Error messages (❌)
- Info messages (ℹ️)

## State Management (Zustand)

Global state includes:
- datasetInfo, chartData, sampleData
- activeFilters, filteredRows
- UI state (loading, messages, dark mode)
- selectedColumn, selectedVisualization

Actions for updating state:
- setDatasetInfo, setChartData, etc.
- setMessage, setLoading
- toggleDarkMode, resetAll

## API Integration

API client (`api.js`) provides:
- uploadFile(file)
- filterData(filterRequest)
- resetData()

All requests handled with error handling and automatic retry.

## Visualization Libraries

- **Recharts**: Bar, line, area charts
- **React-Tooltip**: Hover tooltips
- **React-Icons**: Icon library
- **React-Wordcloud**: Word cloud visualization

## Styling

- **CSS Variables** for theming
- **Gradient backgrounds** for modern look
- **Smooth transitions** for interactions
- **Dark mode support** throughout

## Building for Production

```bash
npm run build
```

Creates optimized build in `build/` directory.

## Deployment

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
npm run build
# Push build folder to gh-pages branch
```

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
```

For production:
```
REACT_APP_API_URL=https://api.example.com
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 12+, Android 9+)

## Performance Optimizations

- Code splitting with React.lazy
- Memoization of heavy components
- Virtualized lists for large datasets
- CSS-in-JS for optimized styling

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Code Quality
```bash
npm run format
```

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## Dependencies

Key libraries:
- react, react-dom
- recharts (charting)
- axios (HTTP client)
- zustand (state management)
- react-icons (icons)
- styled-components (styling)

See package.json for full list and versions.
│   │   ├── DatasetInfo.js # Dataset information display
│   │   ├── DatasetInfo.css
│   │   ├── Charts.js      # Data visualization component
│   │   ├── Charts.css
│   │   ├── Filters.js     # Filter controls component
│   │   └── Filters.css
│   ├── App.js             # Main application component
│   ├── App.css
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles
├── package.json
└── README.md
```

## How to Use

1. **Upload a CSV File**
   - Click "Choose CSV file" to select a file
   - Click "Upload & Analyze" to process it
   - The backend will analyze the dataset and return results

2. **View Dataset Information**
   - See the number of rows and columns
   - View column names and their types (numeric/categorical)
   - Check basic statistics for each column

3. **Explore Visualizations**
   - Histograms for numeric columns
   - Bar charts for categorical columns
   - All charts update automatically when filters are applied

4. **Apply Filters**
   - Select a column to filter
   - For numeric columns: set min/max range
   - For categorical columns: select specific categories
   - Click "Apply Filter" to update the view
   - Click "Reset All" to remove filters

## Components Overview

### UploadCSV
Handles CSV file selection and upload to the backend API.

### DatasetInfo
Displays dataset metadata, including:
- Filename, row count, column count
- Column names and types
- Statistical summaries

### Charts
Renders interactive visualizations using Recharts:
- Bar charts for categorical data
- Histograms for numeric data

### Filters
Provides filtering controls:
- Numeric range filters
- Categorical value selection
- Apply/Reset functionality

### App
Main component that:
- Manages application state
- Coordinates component interactions
- Handles API communication

## Available Scripts

### `npm start`
Runs the app in development mode.
Open http://localhost:3000 to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Dependencies

- **react** & **react-dom**: Core React libraries
- **recharts**: Charting library for data visualization
- **axios**: HTTP client (optional, using fetch API)
- **react-scripts**: Create React App build tools

## API Integration

The frontend communicates with the backend at `http://localhost:8000`:

- `POST /upload`: Upload CSV file
- `POST /filter`: Apply filters to dataset
- `DELETE /reset`: Reset to original dataset

## Troubleshooting

**Issue: Cannot connect to backend**
- Ensure the backend server is running on port 8000
- Check for CORS errors in browser console
- Verify backend CORS settings allow `http://localhost:3000`

**Issue: Charts not displaying**
- Ensure the CSV has numeric or categorical columns
- Check browser console for JavaScript errors
- Verify chart data format from backend

**Issue: File upload fails**
- Ensure file is a valid CSV
- Check file size (large files may take time)
- Verify backend is processing requests

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- The application uses the fetch API for HTTP requests
- All styling is done with vanilla CSS (no external CSS frameworks)
- Charts are rendered using Recharts library
- The app is designed to work with the FastAPI backend
