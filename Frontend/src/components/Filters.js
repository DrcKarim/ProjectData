import React, { useState, useEffect } from 'react';
import './Filters.css';

/**
 * Component for filtering dataset
 * Supports numeric range filters and categorical value filters
 */
function Filters({ datasetInfo, onFilterApply, onReset }) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Numeric filter states
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  
  // Categorical filter states
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [applying, setApplying] = useState(false);

  // Reset filter states when column changes
  useEffect(() => {
    if (selectedColumn && datasetInfo) {
      const colType = datasetInfo.column_types[selectedColumn];
      setFilterType(colType);
      
      if (colType === 'numeric') {
        // Set default min/max from statistics
        const stats = datasetInfo.statistics[selectedColumn];
        if (stats) {
          setMinValue(stats.min);
          setMaxValue(stats.max);
        }
      } else if (colType === 'categorical') {
        // Get available categories
        const stats = datasetInfo.statistics[selectedColumn];
        if (stats && stats.top_values) {
          setAvailableCategories(Object.keys(stats.top_values));
          setSelectedCategories([]);
        }
      }
    }
  }, [selectedColumn, datasetInfo]);

  // Handle category selection
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Apply filter
  const handleApplyFilter = async () => {
    if (!selectedColumn) {
      return;
    }

    setApplying(true);

    try {
      const filterRequest = {
        column: selectedColumn,
        filter_type: filterType === 'numeric' ? 'range' : 'category',
      };

      if (filterType === 'numeric') {
        filterRequest.min_value = parseFloat(minValue);
        filterRequest.max_value = parseFloat(maxValue);
      } else {
        filterRequest.categories = selectedCategories;
      }

      const response = await fetch('http://localhost:8000/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterRequest),
      });

      if (!response.ok) {
        throw new Error('Filter failed');
      }

      const data = await response.json();
      onFilterApply(data);
      
    } catch (error) {
      console.error('Filter error:', error);
      alert('Failed to apply filter');
    } finally {
      setApplying(false);
    }
  };

  // Reset filters
  const handleReset = async () => {
    setSelectedColumn('');
    setFilterType('');
    setMinValue('');
    setMaxValue('');
    setSelectedCategories([]);
    onReset();
  };

  if (!datasetInfo) {
    return null;
  }

  return (
    <div className="filters-container">
      <h2>🔍 Filter Data</h2>

      <div className="filter-controls">
        {/* Column Selection */}
        <div className="filter-group">
          <label>Select Column</label>
          <select 
            value={selectedColumn} 
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="filter-select"
          >
            <option value="">-- Choose a column --</option>
            {datasetInfo.column_names.map((col) => (
              <option key={col} value={col}>
                {col} ({datasetInfo.column_types[col]})
              </option>
            ))}
          </select>
        </div>

        {/* Numeric Filter */}
        {filterType === 'numeric' && (
          <div className="filter-group">
            <label>Numeric Range</label>
            <div className="range-inputs">
              <div className="input-wrapper">
                <label>Min</label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="Min value"
                  className="filter-input"
                />
              </div>
              <div className="input-wrapper">
                <label>Max</label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="Max value"
                  className="filter-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Categorical Filter */}
        {filterType === 'categorical' && (
          <div className="filter-group">
            <label>Select Categories</label>
            <div className="categories-list">
              {availableCategories.map((category) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="filter-actions">
          <button
            onClick={handleApplyFilter}
            disabled={!selectedColumn || applying || 
              (filterType === 'categorical' && selectedCategories.length === 0)}
            className="apply-button"
          >
            {applying ? 'Applying...' : 'Apply Filter'}
          </button>
          
          <button
            onClick={handleReset}
            className="reset-button"
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
