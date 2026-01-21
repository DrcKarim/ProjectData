import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Charts.css';

/**
 * Component to display charts for dataset visualization
 * Shows bar charts for categorical data and histograms for numeric data
 */
function Charts({ chartData, columnTypes }) {
  if (!chartData || !columnTypes) {
    return null;
  }

  // Transform chart data for Recharts format
  const transformChartData = (col, data) => {
    return data.labels.map((label, index) => ({
      name: label,
      value: data.values[index],
    }));
  };

  // Get numeric and categorical columns
  const numericColumns = Object.keys(columnTypes).filter(col => columnTypes[col] === 'numeric');
  const categoricalColumns = Object.keys(columnTypes).filter(col => columnTypes[col] === 'categorical');

  return (
    <div className="charts-container">
      <h2>📈 Data Visualization</h2>

      {/* Numeric Columns - Histograms */}
      {numericColumns.length > 0 && (
        <div className="chart-section">
          <h3>Numeric Columns (Histograms)</h3>
          <div className="charts-grid">
            {numericColumns.map((col) => {
              const data = transformChartData(col, chartData[col].data);
              return (
                <div key={col} className="chart-card">
                  <h4>{col}</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorical Columns - Bar Charts */}
      {categoricalColumns.length > 0 && (
        <div className="chart-section">
          <h3>Categorical Columns (Top 10 Values)</h3>
          <div className="charts-grid">
            {categoricalColumns.map((col) => {
              const data = transformChartData(col, chartData[col].data);
              return (
                <div key={col} className="chart-card">
                  <h4>{col}</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7b1fa2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {numericColumns.length === 0 && categoricalColumns.length === 0 && (
        <div className="no-charts">
          <p>No charts available. Upload a dataset to see visualizations.</p>
        </div>
      )}
    </div>
  );
}

export default Charts;
