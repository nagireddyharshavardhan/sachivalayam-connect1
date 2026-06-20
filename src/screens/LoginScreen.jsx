import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Phone, Lock } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import './LoginScreen.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // We check if it's an authority login based on a secret code for the demo
  const isAuthority = mobileNumber === '9999999999';

  const handleSendOtp = async () => {
    if (mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/auth/send-otp`, {
        mobileNumber,
        role: isAuthority ? 'Authority' : 'Resident'
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      setError('Please enter a valid OTP (Use 1234)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        mobileNumber,
        otp,
        role: isAuthority ? 'Authority' : 'Resident'
      });
      
      const userData = res.data.user;
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (userData.role === 'Authority') {
        navigate('/authority');
      } else {
        navigate('/resident');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <Header title="Login / లాగిన్" showBack={false} />
      
      <div className="login-content animate-fade-in">
        <h2 className="mb-1 text-center">Welcome Back</h2>
        <p className="text-muted text-center mb-4">
          {step === 1 ? 'Enter your mobile number to continue' : 'Enter the OTP sent to your number'}
        </p>

        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <div className="input-group">
            <div className="input-icon-wrapper">
              <Phone size={20} className="input-icon" />
              <span className="input-prefix">+91</span>
              <input
                type="tel"
                className="custom-input pl-12"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <Button className="mt-4" fullWidth onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Get OTP'}
            </Button>
            <p className="hint-text mt-2 text-center text-muted">Hint: Use 9999999999 for Authority</p>
          </div>
        ) : (
          <div className="input-group">
            <div className="input-icon-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type="text"
                className="custom-input pl-10"
                placeholder="Enter OTP (1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <Button className="mt-4" fullWidth onClick={handleVerifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
