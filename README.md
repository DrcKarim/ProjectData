# Interactive CSV Dataset Explorer

A full-stack web application for exploring and analyzing CSV datasets with interactive visualizations and filtering capabilities.

## 🎯 Project Overview

This application allows users to:
- Upload CSV files
- Automatically analyze data types and statistics
- Visualize data with interactive charts
- Filter and explore data dynamically
- No authentication required - simple and teacher-friendly

## 🏗️ Architecture

- **Frontend**: React (JavaScript) with Recharts for visualizations
- **Backend**: FastAPI (Python) with Pandas for data processing
- **Communication**: REST API with JSON responses

## 📁 Project Structure

```
DataProjet/
├── Backend/                 # FastAPI backend
│   ├── main.py             # API endpoints and logic
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
│
├── Frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── UploadCSV.js
│   │   │   ├── DatasetInfo.js
│   │   │   ├── Charts.js
│   │   │   └── Filters.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json       # Node dependencies
│   └── README.md          # Frontend documentation
│
└── README.md              # This file
```

## 🚀 Quick Start Guide

### Prerequisites

- Python 3.8 or higher
- Node.js 14.x or higher
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
