import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './ImageColorAnalysis.css';

/**
 * Image Color Analysis Component
 * Allows users to upload images and analyze their dominant colors
 */
const ImageColorAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [colorData, setColorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setColorData(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8000/api/analyze-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setColorData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze image. Please try again.');
      console.error('Error analyzing image:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setColorData(null);
    setError(null);
  };

  return (
    <div className="image-color-analysis">
      <div className="analysis-header">
        <h2>🎨 Image Color Analysis</h2>
        <p>Upload an image to extract and analyze its dominant colors</p>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <div className="upload-icon">🖼️</div>
          <h3>Upload Your Image</h3>
          <p className="upload-description">PNG, JPG, or JPEG format</p>
          
          <input
            type="file"
            id="image-upload"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          <label htmlFor="image-upload" className="file-label">
            Choose Image
          </label>

          {selectedFile && (
            <div className="file-info">
              <span className="file-name">📎 {selectedFile.name}</span>
              <button onClick={resetAnalysis} className="reset-btn">✕</button>
            </div>
          )}
        </div>

        {imagePreview && (
          <div className="preview-section">
            <h4>Image Preview</h4>
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button 
              onClick={analyzeImage} 
              disabled={loading}
              className="analyze-btn"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Colors'}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Results Section */}
      {colorData && (
        <div className="results-section">
          <h3>📊 Color Analysis Results</h3>
          
          <div className="results-grid">
            {/* Color Palette */}
            <div className="color-palette-section">
              <h4>Dominant Colors</h4>
              <div className="color-palette">
                {colorData.colors.map((color, index) => (
                  <div key={index} className="color-card">
                    <div 
                      className="color-swatch" 
                      style={{ backgroundColor: color.hex }}
                      title={`${color.hex} - ${color.percentage}%`}
                    />
                    <div className="color-info">
                      <div className="color-hex">{color.hex}</div>
                      <div className="color-rgb">
                        RGB({color.rgb.join(', ')})
                      </div>
                      <div className="color-percentage">
                        {color.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="chart-section">
              <h4>Color Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={colorData.colors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {colorData.colors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color.hex} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}%`,
                      props.payload.hex
                    ]}
                  />
                  <Legend 
                    formatter={(value, entry) => entry.payload.hex}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageColorAnalysis;
