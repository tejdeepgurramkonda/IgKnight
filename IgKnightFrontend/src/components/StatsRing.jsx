import React from 'react';
import './StatsRing.css';

const StatsRing = ({ value, max, label, color = 'var(--accent-blue)' }) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="stats-ring">
      <svg className="ring-svg" viewBox="0 0 100 100">
        <circle
          className="ring-background"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          className="ring-progress"
          cx="50"
          cy="50"
          r="45"
          style={{
            stroke: color,
            strokeDasharray: circumference,
            strokeDashoffset: offset
          }}
        />
      </svg>
      <div className="ring-content">
        <div className="ring-value">{value}</div>
        <div className="ring-label">{label}</div>
      </div>
    </div>
  );
};

export default StatsRing;
