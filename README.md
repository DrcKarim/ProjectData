# 📊 Interactive Data Visualization System

## Authors
Karim BOUCHAANE

Amine Boussaid

## Demo Video

https://github.com/user-attachments/assets/aa40bcd6-0798-4710-a1b0-35a0ff73162b

Sur Youtube: https://youtu.be/LFyDm4NDbQQ

A complete, production-ready full-stack application for interactive data visualization and analysis. Transform multiple data formats into powerful, interactive insights with macro and micro-level exploration.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-darkblue.svg)

## 🎯 Project Overview

This system enables **master-level academic data exploration** with:

- **Multiple Data Format Support**: CSV, JSON, TXT, XLSX, TSV
- **Intelligent Data Processing**: Automatic type detection, missing value handling
- **Advanced Analytics**: Descriptive statistics, distributions, temporal analysis
- **Interactive Visualizations**: Histograms, bar charts, line charts, word clouds
- **Dynamic Filtering**: Range filters, categorical selection, text search
- **Micro-level Drill-down**: Click, hover, brush, and link interactions
- **Professional UI**: Dark mode, responsive design, accessibility

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (Visualizations, Filtering, State Management)          │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend                         │
│  (File Processing, Statistics, Data Analysis)           │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
ProjectData/
├── Backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── README.md            # Backend documentation
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js           # Main app
│   │   ├── store.js         # State management
│   │   ├── api.js           # API client
│   │   └── index.css        # Global styles
│   ├── package.json         # Node dependencies
│   └── README.md            # Frontend documentation
├── QUICKSTART.md            # Quick start guide
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### 1️⃣ Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate
# OR Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
# Runs on http://localhost:8000
```

### 2️⃣ Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm start
# Opens http://localhost:3000
```

### 3️⃣ Use the Application

1. Navigate to http://localhost:3000
2. Click "Choose File" and select a data file
3. Click "Upload & Analyze"
4. Explore the data with interactive visualizations
5. Apply filters to drill down into subsets

## 📊 Supported Data Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| CSV | `.csv` | Tabular data, spreadsheets |
| JSON | `.json` | Structured/nested data |
| XLSX | `.xlsx` | Excel spreadsheets |
| TSV | `.tsv` | Tab-separated values |
| TXT | `.txt` | Text documents, word analysis |

## 🎨 Features

### Macro-Level Exploration
- **Distribution Histograms** for numeric data
- **Bar Charts** for categorical distributions
- **Line Charts** for temporal trends
- **Word Clouds** for text analysis
- **Summary Statistics** panel

### Micro-Level Drill-Down
- **Range Sliders** for numeric filtering
- **Multi-Select** for categories
- **Text Search** for content
- **Hover Tooltips** with details
- **Interactive Data Tables**
- **Click-to-Filter** interactions

### Interactive Features
- **Hover Detection** with contextual info
- **Brush & Link** selections
- **Dynamic Updates** across views
- **Smooth Animations** and transitions
- **Dark Mode** toggle
- **Responsive Design** (desktop/mobile)

### Professional Presentations (Phase 4)
- **Fullscreen Presentations** with keyboard navigation
- **7 Slide Types**: Title, Chart, Multi-Chart, Text, Key Insight, Comparison, Conclusion
- **6 Annotation Types**: Arrow, Circle, Rectangle, Text, Highlight, Callout
- **Speaker Notes** and slide navigator
- **Automatic Timers** with speaker control
- **Professional Themes** (Dark, Light, Executive, Corporate)
- **Print Support** and PDF export

### Export & Reporting (Phase 5) ✨ NEW
- **Multi-Format Export**: PNG, SVG, PDF
- **Configurable Resolution**: 72, 150, 300, 600 DPI
- **Single Chart Export** with multiple format options
- **Dashboard Reporting** with multi-chart PDF exports
- **Custom Report Layouts**: 1-2 charts per page
- **Report Metadata**: Title, subtitle, author, timestamp
- **Professional Quality** suitable for executive reports
- **Responsive Export Dialogs** with progress tracking

## 🔧 API Endpoints

### POST /upload
Upload and process a file

**Supports**: CSV, JSON, TXT, XLSX, TSV

**Returns**: Dataset metadata, statistics, and chart data

### POST /filter
Apply filters to current dataset

**Parameters**: column, filter_type (range/category/search), values

**Returns**: Filtered data and updated statistics

### DELETE /reset
Reset to original dataset

## 📈 Data Type Detection

The system automatically detects and handles:

- **Numeric**: Integer/float values → Histograms, statistics
- **Categorical**: String values → Bar charts, distributions
- **Temporal**: Dates/datetimes → Line charts, trends
- **Text**: Long-form text → Word clouds, frequency analysis

## 📊 Statistics Computed

### Numeric Columns
- Mean, median, standard deviation
- Min, max, quartiles (Q1, Q3)
- Missing value count

### Categorical Columns
- Unique value count
- Value distributions (top 20)
- Missing value count

### Temporal Columns
- Date range (min/max)
- Trend visualization
- Period analysis

## 🎯 Use Cases

### Academic Research
- Explore survey data
- Analyze experimental results
- Compare data subsets

### Business Intelligence
- KPI analysis
- Sales data exploration
- Customer segmentation

### Data Science
- EDA (Exploratory Data Analysis)
- Feature engineering discovery
- Pattern identification

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern async web framework
- **Pandas**: Data manipulation & analysis
- **NumPy**: Numerical computing
- **Python 3.8+**: Programming language

### Frontend
- **React 18**: UI library
- **Recharts**: Charting library
- **Zustand**: State management
- **CSS3**: Styling with dark mode

### Deployment
- **Docker**: Containerization
- **Vercel/Netlify**: Frontend hosting
- **Heroku/Railway**: Backend hosting

## 📦 Deployment

### Docker Compose (Local)
```bash
docker-compose up
```

### Cloud Deployment

**Frontend** (Vercel/Netlify):
```bash
npm run build
# Deploy build folder
```

**Backend** (Heroku/Railway):
```bash
git push heroku main
```

See individual README files for detailed deployment instructions.

## 🔐 Production Checklist

- [ ] Update CORS origins in Backend
- [ ] Set API URL in Frontend environment
- [ ] Enable HTTPS for API
- [ ] Add authentication if needed
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Test with large datasets
- [ ] Optimize performance
- [ ] Document API changes
- [ ] Prepare backup strategy

## 🐛 Troubleshooting

**Backend won't start**: Ensure Python 3.8+, all dependencies installed
**Frontend can't connect**: Check backend running on localhost:8000
**File upload fails**: Verify file format, check size limits
**Charts not showing**: Ensure column types detected correctly

See individual README files for more troubleshooting.

## 📚 Documentation

### Core Documentation
- [Backend Documentation](Backend/README.md)
- [Frontend Documentation](Frontend/README.md)
- [API Reference](QUICKSTART.md)

### Feature Guides
- [Data Upload & Processing](DATA_UPLOAD_DOCS.md) - Phase 1
- [Visualization Builder](VISUALIZATION_BUILDER_DOCS.md) - Phase 2
- [Interactive Charts](INTERACTIVE_CHARTS_DOCS.md) - Phase 3
- [Presentation Mode](PRESENTATION_MODE_DOCS.md) - Phase 4
  - [Presentation Quick Start](PRESENTATION_QUICKSTART.md)
- **[Export Features](EXPORT_FEATURES_DOCS.md) - Phase 5** ✨ NEW
  - [Export Quick Start](EXPORT_QUICKSTART.md)
  - [Implementation Details](EXPORT_IMPLEMENTATION.md)

### Quick Reference
- [Complete Feature Overview](PROJECT_SUMMARY.md)
- [Implementation Checklist](CHECKLIST.md)
- [Quick Start Guide](QUICKSTART.md)

## 🎓 For Academic Use

This system is designed for:
- **Master-level courses** on data visualization
- **Research projects** requiring interactive analysis
- **Capstone projects** with data exploration focus
- **Academic papers** on visualization design

**Features suitable for education**:
- Intuitive interface for learning
- Multiple visualization types
- Clear statistical explanations
- Real-time feedback
- No authentication required

## 📝 License

MIT License - Feel free to use and modify for academic/commercial purposes.

## 👨‍💻 Development

### Adding New Features

1. **New visualization type**: Add to Charts component
2. **New file format**: Extend backend parsing
3. **New statistic**: Update statistics computation
4. **New filter**: Add to Filters component

### Code Style

- Python: PEP 8
- JavaScript: ESLint config
- Git: Conventional commits

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Add tests/documentation
4. Submit pull request

## 📞 Support

For issues or questions:
- Check README files
- Review code comments
- Check troubleshooting section
- Open GitHub issue

## 🎉 Features Showcase

### Data Exploration
- Automatic outlier detection
- Distribution analysis
- Correlation visualization
- Missing data handling

### User Experience
- Drag-and-drop upload
- Real-time updates
- Keyboard shortcuts
- Accessibility features

### Performance
- Large file support (100MB+)
- Optimized rendering
- Efficient filtering
- Caching strategies

---

**Built for**: Master-level academic courses  
**Ready for**: Production deployment  
**Designed for**: Interactive data exploration

Happy exploring! 📊✨
- npm or yarn

### Step 1: Start the Backend

```bash
# Navigate to Backend directory
cd Backend

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

Backend will run at: `http://localhost:8000`

### Step 2: Start the Frontend

Open a new terminal window:

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will open automatically at: `http://localhost:3000`

## 📊 How to Use

1. **Upload CSV File**
   - Click "Choose CSV file" button
   - Select a CSV file from your computer
   - Click "Upload & Analyze"

2. **View Dataset Information**
   - See row/column counts
   - View column names and types
   - Check statistics for each column

3. **Explore Visualizations**
   - Histograms for numeric columns
   - Bar charts for categorical columns

4. **Apply Filters**
   - Select a column to filter
   - Set range for numeric columns
   - Select categories for categorical columns
   - Click "Apply Filter" to update
   - Click "Reset All" to clear filters

## 🔧 Features

### Backend Features
- ✅ CSV file upload and processing
- ✅ Automatic data type detection (numeric/categorical)
- ✅ Statistical analysis (mean, min, max, median, std)
- ✅ Dynamic filtering (range and category filters)
- ✅ CORS enabled for frontend communication
- ✅ RESTful API design

### Frontend Features
- ✅ Clean, intuitive UI
- ✅ File upload with validation
- ✅ Real-time data visualization
- ✅ Interactive filtering
- ✅ Responsive design
- ✅ Error handling and user feedback

## 🔌 API Endpoints

### GET /
Health check endpoint

### POST /upload
Upload and analyze CSV file
- **Input**: CSV file (multipart/form-data)
- **Output**: Dataset info, statistics, chart data

### POST /filter
Filter dataset
- **Input**: JSON with filter parameters
- **Output**: Filtered statistics and chart data

### DELETE /reset
Reset to original dataset
- **Output**: Original dataset info

## 📦 Dependencies

### Backend
- fastapi==0.109.0
- uvicorn==0.27.0
- pandas==2.1.4
- python-multipart==0.0.6
- numpy==1.26.3

### Frontend
- react@^18.2.0
- react-dom@^18.2.0
- recharts@^2.10.3
- react-scripts@5.0.1

## 🧪 Testing with Sample Data

Create a sample CSV file (sample.csv):
```csv
name,age,city,salary
John,25,New York,50000
Jane,30,Los Angeles,60000
Bob,35,Chicago,55000
Alice,28,Houston,52000
Charlie,32,Phoenix,58000
```

Upload this file to test all features!

## 🛠️ Development Notes

### Backend
- Uses in-memory storage (dataset is stored in global variable)
- Only one dataset active at a time
- CORS configured for `http://localhost:3000`

### Frontend
- Built with Create React App
- Uses functional components with hooks
- Fetch API for HTTP requests
- Recharts for data visualization

## 📝 Code Comments

Both backend and frontend code include detailed comments explaining:
- Function purposes
- Component responsibilities
- API interactions
- Data transformations

## 🔍 Troubleshooting

**Backend not starting?**
- Check Python version: `python --version`
- Ensure all dependencies are installed
- Check if port 8000 is available

**Frontend not starting?**
- Check Node.js version: `node --version`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is available

**Cannot upload file?**
- Ensure backend is running
- Check browser console for CORS errors
- Verify file is valid CSV format

**Charts not displaying?**
- Ensure dataset has numeric or categorical columns
- Check browser console for errors
- Verify backend is returning chart data

## 📚 Learning Resources

This project demonstrates:
- REST API development with FastAPI
- React component architecture
- State management in React
- Data visualization with Recharts
- File upload handling
- CORS configuration
- Error handling and user feedback

## 🎓 Teacher Notes

This project is designed to be:
- **Simple**: Clean code with extensive comments
- **Educational**: Demonstrates full-stack development
- **Practical**: Real-world data exploration use case
- **Self-contained**: No external services or authentication
- **Well-documented**: Comprehensive README files

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Support

For issues or questions:
1. Check the README files in Backend/ and Frontend/ directories
2. Review code comments
3. Check browser and terminal console for error messages

---

**Built with ❤️ for data exploration and learning**
