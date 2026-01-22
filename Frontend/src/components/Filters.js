import React, { useState, useEffect } from 'react';
import useStore from '../store';
import { api } from '../api';
import { FaFilter } from 'react-icons/fa';
import './Filters.css';

/**
 * Interactive Filters Component
 * Supports numeric range, categorical, and text search filters
 * Updates visualizations in real-time
 */
function Filters({ datasetInfo }) {
  const [selectedColumn, setSelectedColumn] = useState('');
  const [filterType, setFilterType] = useState('');
  const [applying, setApplying] = useState(false);

  // Numeric filter states
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [minBound, setMinBound] = useState(0);
  const [maxBound, setMaxBound] = useState(100);

  // Categorical filter states
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  const { setChartData, setFilteredRows, setMessage, activeFilters, setActiveFilters } = useStore();

  // Update filter options when column changes
  useEffect(() => {
    if (!selectedColumn || !datasetInfo) return;

    const colType = datasetInfo.column_types[selectedColumn];
    setFilterType(colType);
    setSelectedCategories([]);
    setSearchQuery('');

    if (colType === 'numeric') {
      const stats = datasetInfo.statistics[selectedColumn];
      if (stats) {
        setMinBound(stats.min);
        setMaxBound(stats.max);
        setMinValue(stats.min);
        setMaxValue(stats.max);
      }
    } else if (colType === 'categorical') {
      const stats = datasetInfo.statistics[selectedColumn];
      if (stats && stats.top_values) {
        setAvailableCategories(Object.keys(stats.top_values));
      }
    }
  }, [selectedColumn, datasetInfo]);

  // Handle category toggle
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Apply filter
  const handleApplyFilter = async () => {
    if (!selectedColumn) return;

    setApplying(true);

    try {
      const filterRequest = {
        column: selectedColumn,
        filter_type: filterType === 'numeric' ? 'range' : filterType === 'categorical' ? 'category' : 'search',
      };

      if (filterType === 'numeric') {
        filterRequest.min_value = parseFloat(minValue);
        filterRequest.max_value = parseFloat(maxValue);
      } else if (filterType === 'categorical') {
        if (selectedCategories.length === 0) {
          setMessage('Select at least one category', 'error');
          setApplying(false);
          return;
        }
        filterRequest.categories = selectedCategories;
      } else {
        if (!searchQuery.trim()) {
          setMessage('Enter a search term', 'error');
          setApplying(false);
          return;
        }
        filterRequest.search_query = searchQuery;
      }

      const response = await api.filterData(filterRequest);
      const data = response.data;

      // Update store
      setChartData(data.chart_data);
      setFilteredRows(data.num_rows);
      setActiveFilters({
        column: selectedColumn,
        type: filterType,
        ...filterRequest
      });

      setMessage(
        `✅ Filter applied: ${data.num_rows} rows matched`,
        'success'
      );
    } catch (error) {
      console.error('Filter error:', error);
      setMessage(error.response?.data?.detail || 'Failed to apply filter', 'error');
    } finally {
      setApplying(false);
    }
  };

  // Reset filters
  const handleReset = async () => {
    try {
      const response = await api.resetData();
      const data = response.data;

      setChartData(data.chart_data);
      setFilteredRows(null);
      setActiveFilters({});
      setSelectedColumn('');
      setSelectedCategories([]);
      setSearchQuery('');

      setMessage('✅ Filters reset - viewing full dataset', 'success');
    } catch (error) {
      console.error('Reset error:', error);
      setMessage('Failed to reset filters', 'error');
    }
  };

  if (!datasetInfo) return null;

  const allColumns = Object.keys(datasetInfo.column_types || {});

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2><FaFilter /> Advanced Filters & Drill-Down</h2>
        <p>Apply dynamic filters to explore specific data subsets</p>
      </div>

      <div className="filters-panel">
        <div className="filter-controls">
          {/* Column Selection */}
          <div className="control-group">
            <label>Select Column to Filter</label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="filter-select"
            >
              <option value="">-- Choose a column --</option>
              {allColumns.map(col => (
                <option key={col} value={col}>
                  {col} ({datasetInfo.column_types[col]})
                </option>
              ))}
            </select>
          </div>

          {/* Numeric Range Filter */}
          {selectedColumn && filterType === 'numeric' && (
            <div className="filter-options">
              <div className="range-slider-container">
                <label>Range: {minValue} to {maxValue}</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    min={minBound}
                    max={maxBound}
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    placeholder="Min"
                    className="range-input"
                  />
                  <span className="dash">—</span>
                  <input
                    type="number"
                    min={minBound}
                    max={maxBound}
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    placeholder="Max"
                    className="range-input"
                  />
                </div>
                <div className="range-sliders">
                  <input
                    type="range"
                    min={minBound}
                    max={maxBound}
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                    className="slider"
                  />
                  <input
                    type="range"
                    min={minBound}
                    max={maxBound}
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                    className="slider"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Categorical Filter */}
          {selectedColumn && filterType === 'categorical' && (
            <div className="filter-options">
              <label>Select Categories ({selectedCategories.length} selected)</label>
              <div className="categories-grid">
                {availableCategories.map(category => (
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

          {/* Text Search Filter */}
          {selectedColumn && filterType !== 'numeric' && filterType !== 'categorical' && (
            <div className="filter-options">
              <label>Search Term</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search term..."
                className="search-input"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button
            onClick={handleApplyFilter}
            disabled={!selectedColumn || applying}
            className="apply-btn"
          >
            {applying ? '⏳ Filtering...' : '🔍 Apply Filter'}
          </button>
          <button
            onClick={handleReset}
            disabled={applying}
            className="reset-btn"
          >
            ↺ Reset All
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="active-filters">
            <span className="label">Active Filter:</span>
            <span className="filter-badge">
              {activeFilters.column} - {activeFilters.type}
              <button onClick={handleReset} className="clear-badge">
                ✕
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filters;