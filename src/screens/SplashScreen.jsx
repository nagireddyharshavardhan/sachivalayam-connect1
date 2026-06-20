import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is already logged in
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.role === 'Authority') {
          navigate('/authority');
        } else {
          navigate('/resident');
        }
      } else {
        navigate('/language');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <div className="logo-container animate-fade-in">
        <div className="logo-circle">
          <ShieldCheck size={64} color="var(--color-primary)" />
        </div>
        <h1 className="brand-title">Sachivalayam Connect</h1>
        <p className="brand-tagline">Speak. Report. Resolve.</p>
      </div>
    </div>
  );
};

export default SplashScreen;
