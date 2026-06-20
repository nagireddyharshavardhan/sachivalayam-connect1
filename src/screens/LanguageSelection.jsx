import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './LanguageSelection.css';

const LanguageSelection = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (lang) => {
    localStorage.setItem('language', lang);
    navigate('/login');
  };

  return (
    <div className="language-screen">
      <div className="lang-content animate-fade-in">
        <h2 className="mb-2 text-center">Choose Language</h2>
        <p className="text-muted mb-4 text-center">భాషను ఎంచుకోండి</p>

        <div className="flex flex-col gap-3 w-full">
          <Button variant="primary" fullWidth onClick={() => handleLanguageSelect('Telugu')} className="lang-btn">
            <span className="lang-text">తెలుగు</span>
            <span className="lang-subtext">Telugu</span>
          </Button>
          
          <Button variant="outline" fullWidth onClick={() => handleLanguageSelect('English')} className="lang-btn">
            <span className="lang-text">English</span>
            <span className="lang-subtext">English</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
