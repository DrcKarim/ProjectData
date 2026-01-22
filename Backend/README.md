# Backend API - Interactive Data Visualization System

High-performance FastAPI backend for multi-format data processing and analysis.

## Features

- **Multi-format Support**: CSV, JSON, TXT, XLSX, TSV
- **Auto Type Detection**: Numeric, categorical, temporal, and text types
- **Advanced Statistics**: Descriptive stats, distributions, quartiles, missing data tracking
- **Text Processing**: Word frequency analysis, stop word removal, tokenization
- **Interactive Filtering**: Range, categorical, and text-based filters
- **REST API**: Clean, well-documented endpoints with CORS support

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
   - **macOS/Linux**:
   ```bash
   source venv/bin/activate
   ```
   - **Windows**:
   ```bash
   venv\Scripts\activate
   ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Backend

Start the development server:
```bash
python main.py
```

The backend will start on `http://localhost:8000`

For production:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### POST `/upload`
Upload and process a data file (CSV, JSON, TXT, XLSX, TSV)

**Request**:
```bash
curl -X POST -F "file=@data.csv" http://localhost:8000/upload
```

**Response**:
```json
{
  "filename": "data.csv",
  "file_type": "csv",
  "num_rows": 1000,
  "num_columns": 5,
  "column_names": ["id", "name", "age", "salary", "date"],
  "column_types": {
    "id": "numeric",
    "name": "categorical",
    "age": "numeric",
    "salary": "numeric",
    "date": "temporal"
  },
  "statistics": { ... },
  "chart_data": { ... },
  "word_frequencies": null,
  "sample_data": [ ... ]
}
```

### POST `/filter`
Apply filters to current dataset

**Numeric Range Filter**:
```json
{
  "column": "age",
  "filter_type": "range",
  "min_value": 18,
  "max_value": 65
}
```

**Categorical Filter**:
```json
{
  "column": "status",
  "filter_type": "category",
  "categories": ["active", "pending"]
}
```

**Text Search**:
```json
{
  "column": "description",
  "filter_type": "search",
  "search_query": "keyword"
}
```

### DELETE `/reset`
Reset to original uploaded dataset

## Data Type Detection

- **numeric**: Integer or float values
- **categorical**: String values with limited unique values
- **temporal**: Dates/datetimes (ISO 8601 format)
- **text**: Long-form text data (TXT files)

## Statistics

### Numeric Columns
- count, mean, median, standard deviation
- min, max, Q1 (25th percentile), Q3 (75th percentile)
- missing value count

### Categorical Columns
- unique_values count
- top_values distribution (top 20)
- missing value count

### Temporal Columns
- date range (min_date, max_date)
- count, missing

## CORS Configuration

Allowed origins:
- http://localhost:3000 (React dev)
- http://localhost:5173 (Vite dev)

Edit `main.py` to update for production.

## Deployment

### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY main.py .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Heroku
```bash
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### AWS Lambda / Google Cloud Run
Package as container for serverless deployment.

## Dependencies

See `requirements.txt` for all dependencies including:
- fastapi, uvicorn
- pandas, numpy
- openpyxl (XLSX support)

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
