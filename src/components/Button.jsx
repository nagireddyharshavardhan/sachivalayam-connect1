import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', fullWidth, onClick, className = '', disabled, ...props }) => {
  const baseClass = `btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`;
  return (
    <button className={baseClass} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
