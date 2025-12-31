import React from 'react';

const ProfileStatus = ({ status }) => {
  const isOnline = status === 'Online';
  const statusColor = isOnline ? 'green' : 'red';

  return (
    <div className="profile-status">
      <span
        className="status-indicator"
        style={{ backgroundColor: statusColor }}
        aria-label={status}
      ></span>
      <span className={`status-text ${isOnline ? 'text-online' : 'text-offline'}`}>
        {status}
        {isOnline ? ' 🟢' : ' 🔴'} 
      </span>
    </div>
  );
};

export default ProfileStatus;
