import React from 'react';
import './WinRateChart.css';

const WinRateChart = ({ wins = 0, losses = 0, draws = 0 }) => {
  const total = wins + losses + draws;
  
  if (total === 0) {
    return (
      <div className="win-rate-chart">
        <div className="chart-empty">No games played yet</div>
      </div>
    );
  }

  const winPercentage = (wins / total) * 100;
  const lossPercentage = (losses / total) * 100;
  const drawPercentage = (draws / total) * 100;

  return (
    <div className="win-rate-chart">
      <div className="chart-bars">
        <div className="chart-bar-wrapper">
          <div 
            className="chart-bar win-bar" 
            style={{ height: `${winPercentage}%` }}
          >
            {wins > 0 && <span className="bar-label">{wins}</span>}
          </div>
          <span className="bar-title">Wins</span>
        </div>
        <div className="chart-bar-wrapper">
          <div 
            className="chart-bar draw-bar" 
            style={{ height: `${drawPercentage}%` }}
          >
            {draws > 0 && <span className="bar-label">{draws}</span>}
          </div>
          <span className="bar-title">Draws</span>
        </div>
        <div className="chart-bar-wrapper">
          <div 
            className="chart-bar loss-bar" 
            style={{ height: `${lossPercentage}%` }}
          >
            {losses > 0 && <span className="bar-label">{losses}</span>}
          </div>
          <span className="bar-title">Losses</span>
        </div>
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot win-dot"></span>
          <span className="legend-text">{winPercentage.toFixed(0)}% Wins</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot draw-dot"></span>
          <span className="legend-text">{drawPercentage.toFixed(0)}% Draws</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot loss-dot"></span>
          <span className="legend-text">{lossPercentage.toFixed(0)}% Losses</span>
        </div>
      </div>
    </div>
  );
};

export default WinRateChart;
