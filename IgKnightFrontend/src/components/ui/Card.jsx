import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  hoverable = false,
  padding = 'medium',
  onClick,
  className = '',
  ...props 
}) => {
  const cardClass = `
    card 
    card-${variant}
    card-padding-${padding}
    ${hoverable ? 'card-hoverable' : ''}
    ${onClick ? 'card-clickable' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
