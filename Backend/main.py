"""
Interactive CSV Dataset Explorer - Backend API
FastAPI application for CSV file processing and analysis
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import io
import json

app = FastAPI(title="CSV Dataset Explorer API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store the current dataset
current_dataset = None
current_filename = None


class FilterRequest(BaseModel):
    """Model for filter requests"""
    column: str
    filter_type: str  # 'range' for numeric, 'category' for categorical
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    categories: Optional[List[str]] = None


def detect_column_types(df: pd.DataFrame) -> Dict[str, str]:
    """
    Detect whether columns are numeric or categorical
    Returns: dict mapping column names to 'numeric' or 'categorical'
    """
    column_types = {}
    for col in df.columns:
        # Check if column is numeric
        if pd.api.types.is_numeric_dtype(df[col]):
            column_types[col] = 'numeric'
        else:
            column_types[col] = 'categorical'
    return column_types


def calculate_statistics(df: pd.DataFrame, column_types: Dict[str, str]) -> Dict[str, Any]:
    """
    Calculate basic statistics for numeric columns
    Returns: dict with statistics for each numeric column
    """
    stats = {}
    
    for col, col_type in column_types.items():
        if col_type == 'numeric':
            # Calculate statistics for numeric columns, handling NaN values
            col_data = df[col].dropna()  # Remove NaN values before calculating stats
            if len(col_data) > 0:
                stats[col] = {
                    'mean': float(col_data.mean()) if not pd.isna(col_data.mean()) else 0,
                    'min': float(col_data.min()) if not pd.isna(col_data.min()) else 0,
                    'max': float(col_data.max()) if not pd.isna(col_data.max()) else 0,
                    'median': float(col_data.median()) if not pd.isna(col_data.median()) else 0,
                    'std': float(col_data.std()) if not pd.isna(col_data.std()) else 0
                }
            else:
                # If all values are NaN, return zeros
                stats[col] = {
                    'mean': 0,
                    'min': 0,
                    'max': 0,
                    'median': 0,
                    'std': 0
                }
        else:
            # For categorical columns, get value counts
            value_counts = df[col].value_counts().head(10).to_dict()
            stats[col] = {
                'unique_values': int(df[col].nunique()),
                'top_values': {str(k): int(v) for k, v in value_counts.items()}
            }
    
    return stats


def get_chart_data(df: pd.DataFrame, column_types: Dict[str, str]) -> Dict[str, Any]:
    """
    Prepare data for charts
    Returns: dict with chart data for each column
    """
    chart_data = {}
    
    for col, col_type in column_types.items():
        if col_type == 'numeric':
            # For numeric columns, create histogram data
            values = df[col].dropna().values
            
            # Only create histogram if there are valid values
            if len(values) > 0:
                hist, bins = np.histogram(values, bins=20)
                
                chart_data[col] = {
                    'type': 'histogram',
                    'data': {
                        'labels': [f"{bins[i]:.2f}-{bins[i+1]:.2f}" for i in range(len(bins)-1)],
                        'values': [int(v) for v in hist.tolist()]  # Convert to int to avoid numpy types
                    }
                }
            else:
                # No valid data, return empty chart
                chart_data[col] = {
                    'type': 'histogram',
                    'data': {
                        'labels': [],
                        'values': []
                    }
                }
        else:
            # For categorical columns, create bar chart data
            value_counts = df[col].value_counts().head(10)
            
            chart_data[col] = {
                'type': 'bar',
                'data': {
                    'labels': [str(label) for label in value_counts.index.tolist()],
                    'values': [int(v) for v in value_counts.values.tolist()]  # Convert to int
                }
            }
    
    return chart_data


@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"status": "ok", "message": "CSV Dataset Explorer API is running"}


@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload and process a CSV file
    Returns dataset information, statistics, and chart data
    """
    global current_dataset, current_filename
    
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # Store dataset globally for filtering
        current_dataset = df
        current_filename = file.filename
        
        # Get basic information
        num_rows, num_columns = df.shape
        column_names = df.columns.tolist()
        
        # Detect column types
        column_types = detect_column_types(df)
        
        # Calculate statistics
        statistics = calculate_statistics(df, column_types)
        
        # Get chart data
        chart_data = get_chart_data(df, column_types)
        
        # Get sample data (first 10 rows)
        sample_data = df.head(10).to_dict(orient='records')
        
        # Prepare response
        response = {
            'filename': file.filename,
            'num_rows': num_rows,
            'num_columns': num_columns,
            'column_names': column_names,
            'column_types': column_types,
            'statistics': statistics,
            'chart_data': chart_data,
            'sample_data': sample_data
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.post("/filter")
async def filter_data(filter_request: FilterRequest):
    """
    Filter the current dataset and return updated statistics and chart data
    """
    global current_dataset
    
    if current_dataset is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded. Please upload a CSV file first.")
    
    try:
        df = current_dataset.copy()
        
        # Apply filter based on type
        if filter_request.filter_type == 'range':
            # Numeric range filter
            if filter_request.min_value is not None:
                df = df[df[filter_request.column] >= filter_request.min_value]
            if filter_request.max_value is not None:
                df = df[df[filter_request.column] <= filter_request.max_value]
                
        elif filter_request.filter_type == 'category':
            # Categorical filter
            if filter_request.categories:
                df = df[df[filter_request.column].isin(filter_request.categories)]
        
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
    
    # Get column types
    column_types = detect_column_types(current_dataset)
    
    # Calculate statistics
    statistics = calculate_statistics(current_dataset, column_types)
    
    # Get chart data
    chart_data = get_chart_data(current_dataset, column_types)
    
    # Get sample data
    sample_data = current_dataset.head(10).to_dict(orient='records')
    
    response = {
        'filename': current_filename,
        'num_rows': len(current_dataset),
        'num_columns': len(current_dataset.columns),
        'column_names': current_dataset.columns.tolist(),
        'column_types': column_types,
        'statistics': statistics,
        'chart_data': chart_data,
        'sample_data': sample_data
    }
    
    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
