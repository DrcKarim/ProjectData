import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import useStore from '../store';
import './Charts.css';

/**
 * Advanced Charts Component
 * Displays macro-level visualizations: histograms, bar charts, line charts, word clouds
 * Supports interactive hover tooltips and drill-down
 */
function Charts({ chartData, columnTypes, wordFrequencies }) {
  const { setSelectedColumn } = useStore();
  const [expandedChart, setExpandedChart] = useState(null);

  // Color palettes
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

  // Transform chart data for Recharts
  const transformChartData = (col, data) => {
    return data.labels.map((label, index) => ({
      name: label,
      value: data.values[index],
      fill: COLORS[index % COLORS.length]
    }));
  };

  // Get columns by type
  const numericColumns = useMemo(() => 
    Object.keys(columnTypes || {}).filter(col => columnTypes[col] === 'numeric'),
    [columnTypes]
  );

  const categoricalColumns = useMemo(() => 
    Object.keys(columnTypes || {}).filter(col => columnTypes[col] === 'categorical'),
    [columnTypes]
  );

  const temporalColumns = useMemo(() => 
    Object.keys(columnTypes || {}).filter(col => columnTypes[col] === 'temporal'),
    [columnTypes]
  );

  if (!chartData || !columnTypes) {
    return null;
  }

  // Custom tooltip with statistics
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.name}</p>
          <p className="value">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const ChartCard = ({ col, data, type, title }) => {
    const isExpanded = expandedChart === col;
    const height = isExpanded ? 500 : 300;

    return (
      <div 
        key={col}
        className={`chart-card ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setSelectedColumn(col)}
      >
        <div className="chart-header">
          <h4>{title}</h4>
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedChart(isExpanded ? null : col);
            }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        <ResponsiveContainer width="100%" height={height}>
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#667eea" strokeWidth={2} dot={{ fill: '#667eea' }} />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" fill="#667eea" stroke="#667eea" fillOpacity={0.3} />
            </AreaChart>
          )}
        </ResponsiveContainer>

        <p className="chart-hint">Click to select • Drag to expand</p>
      </div>
    );
  };

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h2>📈 Data Visualizations</h2>
        <p>Interactive macro-level exploration • Click to select, drag to expand</p>
      </div>

      {/* Numeric Columns - Histograms */}
      {numericColumns.length > 0 && (
        <section className="chart-section">
          <h3>Numeric Distributions</h3>
          <div className={`charts-grid grid-${Math.min(numericColumns.length, 3)}`}>
            {numericColumns.map((col) => {
              const data = transformChartData(col, chartData[col].data);
              return (
                <ChartCard
                  key={col}
                  col={col}
                  data={data}
                  type="bar"
                  title={col}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Temporal Columns - Line Charts */}
      {temporalColumns.length > 0 && (
        <section className="chart-section">
          <h3>Temporal Trends</h3>
          <div className={`charts-grid grid-${Math.min(temporalColumns.length, 3)}`}>
            {temporalColumns.map((col) => {
              const data = transformChartData(col, chartData[col].data);
              return (
                <ChartCard
                  key={col}
                  col={col}
                  data={data}
                  type="line"
                  title={col}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Categorical Columns - Bar Charts */}
      {categoricalColumns.length > 0 && (
        <section className="chart-section">
          <h3>Categorical Distributions</h3>
          <div className={`charts-grid grid-${Math.min(categoricalColumns.length, 3)}`}>
            {categoricalColumns.map((col) => {
              const data = transformChartData(col, chartData[col].data);
              return (
                <ChartCard
                  key={col}
                  col={col}
                  data={data}
                  type="bar"
                  title={col}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Word Cloud for Text Data */}
      {wordFrequencies && Object.keys(wordFrequencies).length > 0 && (
        <section className="chart-section">
          <h3>Word Frequency Analysis</h3>
          <div className="word-cloud-container">
            <div className="word-cloud">
              {Object.entries(wordFrequencies)
                .sort((a, b) => b[1] - a[1])
                .map(([word, freq], index) => {
                  const maxFreq = Math.max(...Object.values(wordFrequencies));
                  const size = 0.8 + (freq / maxFreq) * 1.2;
                  return (
                    <span
                      key={word}
                      className="word"
                      style={{ fontSize: `${size}rem` }}
                      data-tooltip-id="word-tooltip"
                      data-tooltip-content={`${word}: ${freq} occurrences`}
                    >
                      {word}
                    </span>
                  );
                })}
            </div>
            <ReactTooltip id="word-tooltip" />
          </div>
        </section>
      )}
    </div>
  );
}

export default Charts;
