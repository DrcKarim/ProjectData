# CSV Dataset Explorer - Backend

FastAPI backend for the Interactive CSV Dataset Explorer application.

## Features

- CSV file upload and processing
- Automatic data type detection (numeric/categorical)
- Statistical analysis for numeric columns
- Data filtering capabilities
- CORS enabled for frontend communication

## Requirements

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
- On macOS/Linux:
```bash
source venv/bin/activate
```
- On Windows:
```bash
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the FastAPI server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`

## API Endpoints

### GET /
Health check endpoint
- Returns: `{"status": "ok", "message": "CSV Dataset Explorer API is running"}`

### POST /upload
Upload and analyze a CSV file
- Content-Type: multipart/form-data
- Parameter: `file` (CSV file)
- Returns: Dataset information, statistics, and chart data

### POST /filter
Filter the uploaded dataset
- Content-Type: application/json
- Body:
  ```json
  {
    "column": "column_name",
    "filter_type": "range" or "category",
    "min_value": 0,  // for numeric filters
    "max_value": 100,  // for numeric filters
    "categories": ["value1", "value2"]  // for categorical filters
  }
  ```
- Returns: Filtered dataset statistics and chart data

### DELETE /reset
Reset to original uploaded dataset
- Returns: Original dataset information and statistics

## Testing with cURL

Upload a CSV file:
```bash
curl -X POST "http://localhost:8000/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_file.csv"
```

## Notes

- The server stores the uploaded dataset in memory
- Only one dataset can be active at a time
- CORS is configured to allow requests from `http://localhost:3000`
- Maximum file size is limited by FastAPI defaults
