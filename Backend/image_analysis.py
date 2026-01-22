"""
Image Color Analysis Module
Analyzes images to extract dominant colors using K-Means clustering
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import io
from typing import List, Dict

router = APIRouter()


def rgb_to_hex(rgb: tuple) -> str:
    """Convert RGB tuple to HEX color string"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))


def analyze_image_colors(image_bytes: bytes, num_colors: int = 5) -> List[Dict]:
    """
    Extract dominant colors from an image using K-Means clustering
    
    Args:
        image_bytes: Image file bytes
        num_colors: Number of dominant colors to extract
        
    Returns:
        List of color dictionaries with rgb, hex, and percentage
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image for performance (max dimension 300px)
        max_size = 300
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = tuple(int(dim * ratio) for dim in image.size)
            image = image.resize(new_size, Image.Resampling.LANCZOS)
        
        # Convert image to numpy array
        img_array = np.array(image)
        
        # Reshape to 2D array of pixels (rows x 3 RGB channels)
        pixels = img_array.reshape(-1, 3)
        
        # Remove any pixels with alpha channel issues
        pixels = pixels[~np.isnan(pixels).any(axis=1)]
        
        # Apply K-Means clustering
        kmeans = KMeans(n_clusters=num_colors, random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        # Get cluster centers (dominant colors)
        colors = kmeans.cluster_centers_
        
        # Get labels for each pixel
        labels = kmeans.labels_
        
        # Count occurrences of each label
        label_counts = np.bincount(labels)
        
        # Calculate percentages
        total_pixels = len(labels)
        
        # Create result list
        color_analysis = []
        for i, color in enumerate(colors):
            rgb = [int(c) for c in color]
            hex_color = rgb_to_hex(rgb)
            percentage = (label_counts[i] / total_pixels) * 100
            
            color_analysis.append({
                "rgb": rgb,
                "hex": hex_color,
                "percentage": round(percentage, 2)
            })
        
        # Sort by percentage (descending)
        color_analysis.sort(key=lambda x: x['percentage'], reverse=True)
        
        return color_analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze an image to extract dominant colors
    
    Accepts: PNG, JPG, JPEG images
    Returns: JSON with dominant colors, their RGB/HEX values, and percentages
    """
    # Validate file type
    allowed_types = ['image/png', 'image/jpeg', 'image/jpg']
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: PNG, JPG, JPEG. Got: {file.content_type}"
        )
    
    # Read file bytes
    try:
        contents = await file.read()
        
        # Analyze colors
        colors = analyze_image_colors(contents)
        
        return {
            "filename": file.filename,
            "colors": colors,
            "total_colors": len(colors)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")
