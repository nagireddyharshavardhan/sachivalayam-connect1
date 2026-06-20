import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = 'white';

  switch (status) {
    case 'Submitted':
      bgColor = 'var(--color-status-submitted)';
      break;
    case 'Assigned':
      bgColor = 'var(--color-status-assigned)';
      textColor = 'var(--color-text-main)';
      break;
    case 'In Progress':
      bgColor = 'var(--color-status-in-progress)';
      break;
    case 'Resolved':
      bgColor = 'var(--color-status-resolved)';
      break;
    default:
      bgColor = 'var(--color-text-muted)';
  }

  const badgeStyle = {
    backgroundColor: bgColor,
    color: textColor,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  };

  return <span style={badgeStyle}>{status}</span>;
};

export default StatusBadge;
