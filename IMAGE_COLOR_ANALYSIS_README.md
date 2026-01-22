# Image Color Analysis Feature

## Overview
The Image Color Analysis feature allows users to upload images and automatically extract and analyze their dominant colors using K-Means clustering.

## Features
- 🖼️ Upload images (PNG, JPG, JPEG)
- 🎨 Extract 5 dominant colors
- 📊 View color distribution with an interactive pie chart
- 🎯 Display HEX and RGB values for each color
- 📈 Show percentage composition of each color

## Backend Implementation

### Endpoint
```
POST /api/analyze-image
```

### Request
- **Content-Type**: `multipart/form-data`
- **File Parameter**: `file` (image file)
- **Accepted Formats**: PNG, JPG, JPEG

### Response
```json
{
  "filename": "example.jpg",
  "colors": [
    {
      "rgb": [123, 45, 67],
      "hex": "#7B2D43",
      "percentage": 34.5
    },
    ...
  ],
  "total_colors": 5
}
```

### Technologies Used
- **Pillow**: Image processing
- **NumPy**: Array operations
- **scikit-learn**: K-Means clustering for color extraction

### Algorithm
1. Load and validate image
2. Resize to max 300x300 for performance
3. Convert to RGB color space
4. Extract pixel data as numpy array
5. Apply K-Means clustering (k=5)
6. Calculate color percentages
7. Sort by percentage (descending)
8. Return colors with HEX and RGB values

## Frontend Implementation

### Component
`ImageColorAnalysis.js` - Located in `Frontend/src/components/`

### Features
- Drag & drop or click to upload
- Real-time image preview
- Loading states during analysis
- Error handling with user-friendly messages
- Responsive design
- Dark mode support

### Display
1. **Color Palette**: Shows color swatches with HEX/RGB values
2. **Pie Chart**: Visual representation of color distribution
3. **Percentages**: Exact percentage for each dominant color

### Technologies Used
- **React**: Component framework
- **Axios**: HTTP client for API calls
- **Recharts**: Chart visualization library
- **CSS**: Custom styling with dark mode support

## Usage

### 1. Navigate to Image Color Analysis
- Go to the main application
- Click on "Upload & Explore" tab
- Select "🎨 Image Color Analysis" sub-tab

### 2. Upload an Image
- Click "Choose Image" or drag & drop
- Select a PNG, JPG, or JPEG file
- Preview appears automatically

### 3. Analyze Colors
- Click "🔍 Analyze Colors" button
- Wait for analysis (usually 1-2 seconds)
- View results

### 4. Review Results
- **Color Palette**: See dominant colors with their codes
- **Pie Chart**: Visualize color distribution
- **Percentages**: Understand color composition

## Testing

### Backend Test (using cURL)
```bash
curl -X POST "http://localhost:8000/api/analyze-image" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/image.jpg"
```

### Frontend Test
1. Start both servers
2. Navigate to http://localhost:3000
3. Go to Image Color Analysis tab
4. Upload a test image
5. Verify results display correctly

## Files Modified/Created

### Backend
- ✅ `Backend/requirements.txt` - Added pillow, scikit-learn
- ✅ `Backend/image_analysis.py` - New module for image analysis
- ✅ `Backend/main.py` - Added image analysis router

### Frontend
- ✅ `Frontend/src/components/ImageColorAnalysis.js` - New component
- ✅ `Frontend/src/components/ImageColorAnalysis.css` - Styling
- ✅ `Frontend/src/App.js` - Added new tab and routing

## Performance Considerations

### Image Resizing
Images are automatically resized to a maximum dimension of 300px to:
- Reduce processing time
- Minimize memory usage
- Speed up K-Means clustering

### Color Extraction
- Uses K-Means with k=5 clusters (configurable)
- Random state set for reproducible results
- Optimized for typical use cases

## Error Handling

### Backend
- File type validation
- Image loading errors
- Processing exceptions
- Clear error messages

### Frontend
- File type validation before upload
- Network error handling
- User-friendly error messages
- Loading states

## Future Enhancements

Possible improvements:
1. Allow users to select number of colors (k value)
2. Export color palette as CSS/JSON
3. Compare multiple images
4. Generate complementary color schemes
5. Color blindness simulation
6. Save favorite palettes

## Troubleshooting

### Backend not starting
```bash
# Check logs
tail -f /tmp/backend.log

# Verify dependencies
pip3 list | grep -E "pillow|scikit-learn"
```

### Frontend not displaying results
- Check browser console for errors
- Verify backend is running on port 8000
- Check CORS configuration
- Verify Recharts is installed: `npm list recharts`

## Dependencies

### Backend
```
pillow==10.2.0
scikit-learn==1.4.0
numpy==1.26.4 (already installed)
```

### Frontend
```
recharts (for charts)
axios (for API calls)
```

## License
Same as the main project.
