import React from 'react';
import './Timer.css';

const Timer = ({ timeInSeconds, isActive, isLowTime }) => {
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getTimeClass = () => {
    if (timeInSeconds === null) return '';
    if (timeInSeconds <= 10) return 'critical';
    if (timeInSeconds <= 30) return 'warning';
    if (timeInSeconds <= 60) return 'low';
    return 'normal';
  };

  const getProgressPercentage = (initialTime = 600) => {
    if (timeInSeconds === null) return 100;
    return Math.max(0, Math.min(100, (timeInSeconds / initialTime) * 100));
  };

  return (
    <div className={`timer-component ${getTimeClass()} ${isActive ? 'active' : ''}`}>
      <div className="timer-display">
        <svg className="clock-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
        <span className="time-text">{formatTime(timeInSeconds)}</span>
      </div>
      <div className="timer-progress-bar">
        <div 
          className="timer-progress-fill" 
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
