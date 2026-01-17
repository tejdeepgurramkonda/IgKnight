import React from 'react';
import './PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Determine strength level
    if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score <= 5) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const strength = calculateStrength();
  
  if (!password) return null;

  return (
    <div className="password-strength-indicator">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`strength-bar ${level <= strength.score ? 'active' : ''}`}
            style={{
              backgroundColor: level <= strength.score ? strength.color : 'rgba(255, 255, 255, 0.1)'
            }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
};

export default PasswordStrengthIndicator;
