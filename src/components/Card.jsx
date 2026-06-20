import React from 'react';
import './Card.css';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div className={`modern-card ${className} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
