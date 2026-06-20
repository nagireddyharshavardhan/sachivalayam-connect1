import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Card from '../components/Card';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const AnalyticsScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/complaints/analytics`)
      .then(res => setData(res.data.data))
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-4">Loading analytics...</div>;

  const categories = Object.keys(data.byCategory);
  const maxCount = Math.max(...Object.values(data.byCategory), 1);

  return (
    <div className="flex flex-col h-full bg-bg">
      <Header title="Analytics" />
      
      <div className="content-area pt-4">
        <Card className="mb-4">
          <h3 className="mb-4">Complaints by Category</h3>
          <div className="flex flex-col gap-3">
            {categories.map(cat => {
              const count = data.byCategory[cat];
              const percentage = (count / maxCount) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div style={{ width: '100%', background: '#eee', borderRadius: '4px', height: '8px' }}>
                    <div style={{ width: `${percentage}%`, background: 'var(--color-primary)', height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4">Status Overview</h3>
          <div className="flex justify-between text-center">
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-status-submitted)' }}>{data.summary.submitted}</div>
              <div className="text-xs text-muted">New</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-status-assigned)' }}>{data.summary.inProgress}</div>
              <div className="text-xs text-muted">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--color-status-resolved)' }}>{data.summary.resolved}</div>
              <div className="text-xs text-muted">Resolved</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
