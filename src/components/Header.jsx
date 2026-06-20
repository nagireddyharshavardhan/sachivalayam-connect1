import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title, showBack = true, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className="app-header">
      {showBack && (
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={24} color="white" />
        </button>
      )}
      <h2 className="header-title">{title}</h2>
      {showBack && <div style={{ width: 24 }}></div> /* spacer for center alignment */}
    </header>
  );
};

export default Header;
