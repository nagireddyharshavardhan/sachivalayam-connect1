import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, User, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import './ComplaintDetails.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints/${id}`);
      setComplaint(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(`${API_URL}/complaints/${id}/status`, { status: newStatus });
      fetchComplaint(); // refresh
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!complaint) return <div className="p-4 text-center">Complaint not found</div>;

  return (
    <div className="flex flex-col h-full bg-bg">
      <Header title="Complaint Details" />
      
      <div className="content-area pt-4">
        <div className="detail-card mb-4">
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <div>
              <p className="text-muted text-sm">ID: {complaint._id}</p>
              <h2 className="mt-1">{complaint.complaintCategory}</h2>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <div className="info-row">
            <User size={18} className="text-muted" />
            <div>
              <p className="font-semibold">{complaint.residentName}</p>
              <p className="text-sm text-muted">Resident</p>
            </div>
          </div>

          <div className="info-row">
            <MapPin size={18} className="text-muted" />
            <div>
              <p className="font-semibold">{complaint.villageArea}</p>
              {complaint.location && complaint.location.latitude && (
                <p className="text-sm text-primary">GPS Location Attached</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="mb-2">Description</h4>
            <p className="text-body">{complaint.complaintDescriptionText}</p>
          </div>

          {complaint.photoUrl && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="mb-2 flex items-center gap-2"><ImageIcon size={18} /> Photo Evidence</h4>
              <img src={complaint.photoUrl} alt="Complaint" className="evidence-img" />
            </div>
          )}
        </div>

        <div className="actions-card">
          <h4 className="mb-3">Update Status</h4>
          <div className="flex flex-col gap-3">
            {complaint.status === 'Submitted' && (
              <Button fullWidth onClick={() => updateStatus('Assigned')}>
                Mark as Assigned
              </Button>
            )}
            {(complaint.status === 'Submitted' || complaint.status === 'Assigned') && (
              <Button fullWidth onClick={() => updateStatus('In Progress')}>
                Mark as In Progress
              </Button>
            )}
            {complaint.status !== 'Resolved' && (
              <Button fullWidth variant="success" onClick={() => updateStatus('Resolved')}>
                <CheckCircle size={18} /> Resolve Complaint
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
