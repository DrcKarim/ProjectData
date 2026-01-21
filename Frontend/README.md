# CSV Dataset Explorer - Frontend

React-based frontend for the Interactive CSV Dataset Explorer application.

## Features

- CSV file upload interface
- Real-time dataset statistics display
- Interactive data visualizations (bar charts, histograms)
- Dynamic filtering capabilities
- Clean and responsive UI

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

1. Make sure the backend is running at `http://localhost:8000`

2. Start the React development server:
```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

## Project Structure

```
Frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── UploadCSV.js   # File upload component
│   │   ├── UploadCSV.css
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
