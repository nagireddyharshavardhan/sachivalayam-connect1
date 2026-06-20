import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, List, Clock, LogOut, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import axios from 'axios';
import './ResidentDashboard.css';
import StatusBadge from '../components/StatusBadge';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Fetch recent complaints
    axios.get(`${API_URL}/complaints?userId=${parsedUser._id}&role=Resident`)
      .then(res => setRecentComplaints(res.data.data.slice(0, 3)))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="dashboard-header">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="greeting">Namaskaram,</p>
            <h2 className="user-name">{user.name || user.mobileNumber}</h2>
          </div>
          <button className="icon-btn" onClick={handleLogout}>
            <LogOut size={20} color="white" />
          </button>
        </div>
        <div className="location-chip mt-2">
          <MapPin size={14} />
          <span>{user.villageArea || 'Select Village'}</span>
        </div>
      </div>

      <div className="content-area">
        <div className="action-grid mb-4">
          <Card className="action-card primary-action" onClick={() => navigate('/voice-complaint')}>
            <div className="action-icon-bg">
              <Mic size={32} color="var(--color-primary)" />
            </div>
            <h3>Report Issue</h3>
            <p>Voice assistant</p>
          </Card>
          
          <div className="flex flex-col gap-3">
            <Card className="action-card secondary-action" onClick={() => navigate('/tracking')}>
              <List size={24} color="var(--color-success)" />
              <h4>Track Status</h4>
            </Card>
            <Card className="action-card secondary-action" onClick={() => navigate('/tracking')}>
              <Clock size={24} color="var(--color-warning)" />
              <h4>History</h4>
            </Card>
          </div>
        </div>

        <div className="recent-section mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="section-title">Recent Complaints</h3>
            <button className="text-link" onClick={() => navigate('/tracking')}>View All</button>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="empty-state">
              <p>No complaints reported yet.</p>
            </div>
          ) : (
            recentComplaints.map(complaint => (
              <Card key={complaint._id} className="complaint-list-item" onClick={() => navigate('/tracking')}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="complaint-cat">{complaint.complaintCategory}</h4>
                    <p className="complaint-date">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
