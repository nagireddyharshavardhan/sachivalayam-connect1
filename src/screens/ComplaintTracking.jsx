import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import './ComplaintTracking.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ComplaintTracking = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    axios.get(`${API_URL}/complaints?userId=${user._id}&role=${user.role}`)
      .then(res => {
        setComplaints(res.data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="flex flex-col h-full bg-bg">
      <Header title="My Complaints" />
      
      <div className="content-area pt-4">
        {loading ? (
          <p className="text-center mt-4">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <div className="text-center mt-4 p-4 bg-white rounded-card">
            <p>You haven't reported any issues yet.</p>
          </div>
        ) : (
          complaints.map(complaint => (
            <Card key={complaint._id} className="mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-muted text-sm">ID: {complaint._id.slice(-6).toUpperCase()}</span>
                  <h3 className="mt-1">{complaint.complaintCategory}</h3>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
              
              <p className="text-sm mb-4 line-clamp-2">{complaint.complaintDescriptionText}</p>
              
              <div className="timeline">
                {['Submitted', 'Assigned', 'In Progress', 'Resolved'].map((status, index) => {
                  const statuses = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
                  const currentIndex = statuses.indexOf(complaint.status);
                  const isCompleted = index <= currentIndex;
                  const isActive = index === currentIndex;
                  
                  return (
                    <div key={status} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                      <div className="timeline-dot"></div>
                      <span className="timeline-label">{status}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintTracking;
