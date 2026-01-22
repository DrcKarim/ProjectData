"""
Interactive Data Visualization System - Backend API
FastAPI application for multi-format file processing and analysis
Supports: CSV, JSON, TXT, TSV, XLSX
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
import numpy as np
import io
import json
import re
from collections import Counter
from pathlib import Path

app = FastAPI(title="Interactive Data Visualization API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React and Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store the current dataset
current_dataset = None
current_filename = None
file_metadata = None


class FilterRequest(BaseModel):
    """Model for filter requests"""
    column: str
    filter_type: str  # 'range' for numeric, 'category' for categorical, 'search' for text
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    categories: Optional[List[str]] = None
    search_query: Optional[str] = None


class DataTypeResponse(BaseModel):
    """Response model for data type information"""
    file_type: str
    total_rows: int
    total_columns: int
    columns: List[str]
    column_types: Dict[str, str]


# ============= FILE DETECTION AND PARSING =============

def detect_file_type(filename: str) -> str:
    """Detect file type from filename"""
    ext = Path(filename).suffix.lower()
    if ext == '.csv':
        return 'csv'
    elif ext == '.tsv':
        return 'tsv'
    elif ext == '.json':
        return 'json'
    elif ext in ['.txt', '.text']:
        return 'txt'
    elif ext in ['.xlsx', '.xls']:
        return 'xlsx'
    else:
        raise ValueError(f"Unsupported file format: {ext}")


def parse_csv_file(contents: bytes) -> pd.DataFrame:
    """Parse CSV file"""
    return pd.read_csv(io.StringIO(contents.decode('utf-8')))


def parse_tsv_file(contents: bytes) -> pd.DataFrame:
    """Parse TSV file"""
    return pd.read_csv(io.StringIO(contents.decode('utf-8')), sep='\t')


def parse_json_file(contents: bytes) -> pd.DataFrame:
    """Parse JSON file"""
    data = json.loads(contents.decode('utf-8'))
    if isinstance(data, list):
        return pd.DataFrame(data)
    elif isinstance(data, dict):
        return pd.DataFrame([data])
    else:
        raise ValueError("JSON must be an array of objects or a single object")


def parse_txt_file(contents: bytes) -> pd.DataFrame:
    """Parse plain text file for text analysis"""
    text = contents.decode('utf-8', errors='ignore')
    # Split by paragraphs or lines
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return pd.DataFrame({'text': lines})


def parse_xlsx_file(contents: bytes) -> pd.DataFrame:
    """Parse XLSX file"""
    return pd.read_excel(io.BytesIO(contents))


# ============= DATA TYPE DETECTION =============

def detect_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """
    Detect whether columns are numeric, categorical, temporal, or text
    Returns: dict mapping column names to type strings
    """
    column_types = {}
    for col in df.columns:
        # Try numeric
        if pd.api.types.is_numeric_dtype(df[col]):
            column_types[col] = 'numeric'
        # Try datetime
        elif pd.api.types.is_datetime64_any_dtype(df[col]):
            column_types[col] = 'temporal'
        # Check if might be temporal (string that looks like date)
        elif df[col].dtype == 'object':
            sample = df[col].dropna().iloc[0] if len(df[col].dropna()) > 0 else None
            if sample:
                try:
                    pd.to_datetime(df[col], errors='coerce')
                    if df[col].notna().sum() > len(df[col]) * 0.8:  # >80% valid dates
                        column_types[col] = 'temporal'
                    else:
                        column_types[col] = 'categorical'
                except:
                    column_types[col] = 'categorical'
            else:
                column_types[col] = 'categorical'
        else:
            column_types[col] = 'categorical'
    return column_types


# ============= STATISTICS COMPUTATION =============

def calculate_statistics(df: pd.DataFrame, column_types: Dict[str, str]) -> Dict[str, Any]:
    """
    Calculate comprehensive statistics for all column types
    """
    stats = {}
    
    for col, col_type in column_types.items():
        if col_type == 'numeric':
            col_data = df[col].dropna()
            if len(col_data) > 0:
                stats[col] = {
                    'type': 'numeric',
                    'mean': float(col_data.mean()),
                    'median': float(col_data.median()),
                    'std': float(col_data.std()),
                    'min': float(col_data.min()),
                    'max': float(col_data.max()),
                    'q25': float(col_data.quantile(0.25)),
                    'q75': float(col_data.quantile(0.75)),
                    'count': int(col_data.count()),
                    'missing': int(df[col].isna().sum())
                }
            else:
                stats[col] = {
                    'type': 'numeric',
                    'mean': 0, 'median': 0, 'std': 0,
                    'min': 0, 'max': 0, 'q25': 0, 'q75': 0,
                    'count': 0, 'missing': len(df)
                }
        elif col_type == 'temporal':
            col_data = pd.to_datetime(df[col], errors='coerce').dropna()
            if len(col_data) > 0:
                stats[col] = {
                    'type': 'temporal',
                    'min_date': str(col_data.min()),
                    'max_date': str(col_data.max()),
                    'count': int(col_data.count()),
                    'missing': int(df[col].isna().sum())
                }
            else:
                stats[col] = {
                    'type': 'temporal',
                    'count': 0, 'missing': len(df)
                }
        else:  # categorical
            value_counts = df[col].value_counts().head(20)
            stats[col] = {
                'type': 'categorical',
                'unique_values': int(df[col].nunique()),
                'top_values': {str(k): int(v) for k, v in value_counts.items()},
                'count': int(df[col].notna().sum()),
                'missing': int(df[col].isna().sum())
            }
    
    return stats


# ============= TEXT PROCESSING =============

# Common English stop words
STOP_WORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
    'the', 'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have',
    'i', 'you', 'we', 'me', 'him', 'her', 'them', 'what', 'which',
    'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every'
}


def clean_text(text: str) -> str:
    """Clean and normalize text"""
    # Convert to lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-z0-9\s]', '', text)
    # Remove extra spaces
    text = ' '.join(text.split())
    return text


def tokenize_and_clean(text: str) -> List[str]:
    """Tokenize text and remove stop words"""
    cleaned = clean_text(text)
    tokens = cleaned.split()
    return [token for token in tokens if token not in STOP_WORDS and len(token) > 2]


def compute_word_frequencies(df: pd.DataFrame, text_column: str = 'text', top_n: int = 50) -> Dict[str, int]:
    """Compute word frequencies from text data"""
    all_tokens = []
    for text in df[text_column].dropna():
        tokens = tokenize_and_clean(str(text))
        all_tokens.extend(tokens)
    
    word_counts = Counter(all_tokens)
    return dict(word_counts.most_common(top_n))


# ============= CHART DATA PREPARATION =============

def get_chart_data(df: pd.DataFrame, column_types: Dict[str, str]) -> Dict[str, Any]:
    """
    Prepare data for charts
    Returns: dict with chart data for each column
    """
    chart_data = {}
    """
    Prepare data for different chart types based on column types
    """
    chart_data = {}
    
    for col, col_type in column_types.items():
        if col_type == 'numeric':
            values = df[col].dropna().values
            if len(values) > 0:
                # Create histogram data
                hist, bins = np.histogram(values, bins=min(20, len(np.unique(values))))
                chart_data[col] = {
                    'type': 'histogram',
                    'data': {
                        'labels': [f"{bins[i]:.2f}-{bins[i+1]:.2f}" for i in range(len(bins)-1)],
                        'values': [int(v) for v in hist.tolist()],
                        'raw_values': values.tolist()
                    }
                }
            else:
                chart_data[col] = {'type': 'histogram', 'data': {'labels': [], 'values': [], 'raw_values': []}}
                
        elif col_type == 'temporal':
            df_sorted = df.sort_values(col)
            date_counts = df_sorted[col].value_counts().sort_index()
            chart_data[col] = {
                'type': 'line',
                'data': {
                    'labels': [str(d) for d in date_counts.index],
                    'values': date_counts.values.tolist()
                }
            }
            
        else:  # categorical
            value_counts = df[col].value_counts().head(15)
            chart_data[col] = {
                'type': 'bar',
                'data': {
                    'labels': [str(label) for label in value_counts.index.tolist()],
                    'values': [int(v) for v in value_counts.values.tolist()]
                }
            }
    
    return chart_data


# ============= API ENDPOINTS =============

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Interactive Data Visualization API is running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process a file (CSV, JSON, TXT, XLSX, TSV)
    Returns file information, statistics, and chart data
    """
    global current_dataset, current_filename, file_metadata
    
    try:
        # Detect file type
        file_type = detect_file_type(file.filename)
        
        # Read and parse file
        contents = await file.read()
        
        if file_type == 'csv':
            df = parse_csv_file(contents)
        elif file_type == 'tsv':
            df = parse_tsv_file(contents)
        elif file_type == 'json':
            df = parse_json_file(contents)
        elif file_type == 'txt':
            df = parse_txt_file(contents)
        elif file_type == 'xlsx':
            df = parse_xlsx_file(contents)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        # Validate data
        if df.empty:
            raise ValueError("Uploaded file is empty")
        
        # Store dataset globally
        current_dataset = df
        current_filename = file.filename
        file_metadata = {'type': file_type, 'rows': len(df), 'columns': len(df.columns)}
        
        # Get basic information
        num_rows, num_columns = df.shape
        column_names = df.columns.tolist()
        
        # Detect column types
        column_types = detect_column_types(df)
        
        # Calculate statistics
        statistics = calculate_statistics(df, column_types)
        
        # Get chart data
        chart_data = get_chart_data(df, column_types)
        
        # Get word frequencies if text data
        word_frequencies = None
        if file_type == 'txt' and 'text' in df.columns:
            word_frequencies = compute_word_frequencies(df, 'text')
        
        # Get sample data
        sample_data = df.head(10).to_dict(orient='records')
        
        # Prepare response
        response = {
            'filename': file.filename,
            'file_type': file_type,
            'num_rows': num_rows,
            'num_columns': num_columns,
            'column_names': column_names,
            'column_types': column_types,
            'statistics': statistics,
            'chart_data': chart_data,
            'word_frequencies': word_frequencies,
            'sample_data': sample_data
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")


@app.post("/filter")
async def filter_data(filter_request: FilterRequest):
    """
    Filter the current dataset based on specified criteria
    Returns updated statistics and chart data
    """
    global current_dataset
    
    if current_dataset is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded. Please upload a file first.")
    
    try:
        df = current_dataset.copy()
        
        # Apply filter based on type
        if filter_request.filter_type == 'range':
            if filter_request.min_value is not None:
                df = df[df[filter_request.column] >= filter_request.min_value]
            if filter_request.max_value is not None:
                df = df[df[filter_request.column] <= filter_request.max_value]
                
        elif filter_request.filter_type == 'category':
            if filter_request.categories:
                df = df[df[filter_request.column].isin(filter_request.categories)]
        
        elif filter_request.filter_type == 'search':
            if filter_request.search_query:
                mask = df[filter_request.column].astype(str).str.contains(
                    filter_request.search_query, case=False, na=False
                )
                df = df[mask]
        
        if df.empty:
            return {
                'num_rows': 0,
                'statistics': {},
                'chart_data': {},
                'sample_data': []
            }
        
        # Get column types
        column_types = detect_column_types(df)
        
        # Calculate updated statistics
        statistics = calculate_statistics(df, column_types)
        
        # Get updated chart data
        chart_data = get_chart_data(df, column_types)
        
        # Get sample data
        sample_data = df.head(10).to_dict(orient='records')
        
        response = {
            'num_rows': len(df),
            'statistics': statistics,
            'chart_data': chart_data,
            'sample_data': sample_data
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error filtering data: {str(e)}")


@app.delete("/reset")
async def reset_data():
    """
    Reset to original uploaded dataset
    """
    global current_dataset, current_filename
    
    if current_dataset is None:
        raise HTTPException(status_code=400, detail="No dataset to reset")
    
    try:
        # Get column types
        column_types = detect_column_types(current_dataset)
        
        # Calculate statistics
        statistics = calculate_statistics(current_dataset, column_types)
        
        # Get chart data
        chart_data = get_chart_data(current_dataset, column_types)
        
        # Get word frequencies if text data
        word_frequencies = None
        if file_metadata and file_metadata['type'] == 'txt' and 'text' in current_dataset.columns:
            word_frequencies = compute_word_frequencies(current_dataset, 'text')
        
        # Get sample data
        sample_data = current_dataset.head(10).to_dict(orient='records')
        
        response = {
            'filename': current_filename,
            'file_type': file_metadata['type'] if file_metadata else 'unknown',
            'num_rows': len(current_dataset),
            'num_columns': len(current_dataset.columns),
            'column_names': current_dataset.columns.tolist(),
            'column_types': column_types,
            'statistics': statistics,
            'chart_data': chart_data,
            'word_frequencies': word_frequencies,
            'sample_data': sample_data
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting data: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
