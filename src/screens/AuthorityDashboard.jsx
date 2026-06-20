import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, BarChart2, Search } from 'lucide-react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import './AuthorityDashboard.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AuthorityDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ totalComplaints: 0, submitted: 0, inProgress: 0, resolved: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Authority') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [compRes, statRes] = await Promise.all([
        axios.get(`${API_URL}/complaints?role=Authority`),
        axios.get(`${API_URL}/complaints/analytics`)
      ]);
      setComplaints(compRes.data.data);
      setStats(statRes.data.data.summary);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.complaintCategory.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.villageArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-bg">
      <div className="auth-header">
        <div className="flex justify-between items-center mb-4">
          <h2>Authority Portal</h2>
          <div className="flex gap-2">
            <button className="icon-btn" onClick={() => navigate('/authority/analytics')}>
              <BarChart2 size={20} color="white" />
            </button>
            <button className="icon-btn" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
              <LogOut size={20} color="white" />
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalComplaints}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.submitted}</div>
            <div className="stat-label">New</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
      </div>

      <div className="content-area">
        <div className="search-filter-bar mb-4">
          <div className="search-box">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search category or village..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="complaints-list">
          {filteredComplaints.map(c => (
            <Card key={c._id} className="mb-3 p-3" onClick={() => navigate(`/authority/complaint/${c._id}`)}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{c.complaintCategory}</h4>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-muted mb-2">{c.villageArea} • {c.residentName}</p>
              <p className="text-sm line-clamp-1">{c.complaintDescriptionText}</p>
            </Card>
          ))}
          {filteredComplaints.length === 0 && (
            <p className="text-center text-muted mt-4">No complaints found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
