import React from 'react';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  dot = false,
  className = '',
  ...props 
}) => {
  if (dot) {
    return <span className={`badge-dot badge-dot-${variant} ${className}`} {...props} />;
  }

  const badgeClass = `
    badge 
    badge-${variant}
    badge-${size}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};

export default Badge;
