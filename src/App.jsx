import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import LanguageSelection from './screens/LanguageSelection';
import LoginScreen from './screens/LoginScreen';
import ResidentDashboard from './screens/ResidentDashboard';
import VoiceComplaintScreen from './screens/VoiceComplaintScreen';
import ComplaintTracking from './screens/ComplaintTracking';
import AuthorityDashboard from './screens/AuthorityDashboard';
import ComplaintDetails from './screens/ComplaintDetails';
import AnalyticsScreen from './screens/AnalyticsScreen';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/language" element={<LanguageSelection />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/resident" element={<ResidentDashboard />} />
          <Route path="/voice-complaint" element={<VoiceComplaintScreen />} />
          <Route path="/tracking" element={<ComplaintTracking />} />
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/complaint/:id" element={<ComplaintDetails />} />
          <Route path="/authority/analytics" element={<AnalyticsScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
