import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WeatherCharts = ({ hours, unit }) => {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' or 'rain'

  if (!hours || hours.length === 0) return null;

  // Filter 8 points throughout the day for clear readability: 12 AM, 3 AM, 6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 9 PM
  const indices = [0, 3, 6, 9, 12, 15, 18, 21];
  const chartData = indices.map((idx) => {
    const hr = hours[idx] || hours[hours.length - 1];
    const hourNum = parseInt(hr.datetime.split(':')[0], 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return {
      time: `${displayHour} ${ampm}`,
      temp: hr.temp,
      rain: hr.precipprob || 0,
    };
  });

  const width = 600;
  const height = 150;
  const paddingX = 40;
  const paddingY = 25;

  let values = [];
  if (activeTab === 'temp') {
    values = chartData.map((d) => {
      return unit === 'metric' ? d.temp : (d.temp * 9) / 5 + 32;
    });
  } else {
    values = chartData.map((d) => d.rain);
  }

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valRange = maxValue - minValue || 1;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index * (width - 2 * paddingX)) / (chartData.length - 1);
    const val = values[index];
    const y = height - paddingY - ((val - minValue) * (height - 2 * paddingY)) / valRange;
    return { x, y, label: d.time, val };
  });

  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  }

  return (
    <motion.div 
      className="weather-charts-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="chart-header">
        <h3 className="chart-title">Forecast Trends</h3>
        <div className="chart-tabs">
          <motion.button
            className={`chart-tab-btn ${activeTab === 'temp' ? 'active' : ''}`}
            onClick={() => setActiveTab('temp')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Temperature
          </motion.button>
          <motion.button
            className={`chart-tab-btn ${activeTab === 'rain' ? 'active' : ''}`}
            onClick={() => setActiveTab('rain')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Rain Probability
          </motion.button>
        </div>
      </div>

      <div className="chart-canvas-container">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="weather-svg-chart">
          <defs>
            <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines using glass variables */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="var(--glass-border)"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="var(--glass-border)"
            strokeWidth="1"
          />

          {/* Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#chartAreaGradient)" />}

          {/* Smooth Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--primary-color)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="chart-stroke-line"
            />
          )}

          {/* Points, values, and horizontal label lines */}
          {points.map((pt, index) => (
            <g key={index} className="chart-data-node">
              <line
                x1={pt.x}
                y1={pt.y}
                x2={pt.x}
                y2={height - paddingY}
                stroke="var(--glass-border)"
                strokeDasharray="4,4"
              />

              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="var(--primary-color)"
                stroke="var(--glass-bg)"
                strokeWidth="2.5"
                className="chart-circle"
              />

              {/* Temperature / Rain value label (using primary text variables) */}
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="11"
                fontWeight="700"
                className="chart-value-text"
              >
                {activeTab === 'temp' ? `${Math.round(pt.val)}°` : `${Math.round(pt.val)}%`}
              </text>

              {/* Time axis label */}
              <text
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="10.5"
                fontWeight="500"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

export default WeatherCharts;
