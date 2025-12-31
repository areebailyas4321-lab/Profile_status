import React, { useState, useEffect } from 'react';
import ProfileStatus from './ProfileStatus';
import { useStatus } from '../context/StatusContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { status, statusHistory, toggleStatus, resetStatus } = useStatus();

  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);
  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="profile-container">
      <motion.div
        className="profile-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div className="profile-header" variants={itemVariants}>
    
          <motion.img
            src="/profile.jpg"
            alt="User Avatar"
            className="profile-avatar"
            whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
          />
          <h2>{greeting}, User!</h2>
        </motion.div>

        <div className="profile-body">
          <motion.div className="status-section" variants={itemVariants}>
            <h3>Current Status</h3>
            <ProfileStatus status={status} />
          </motion.div>

          <motion.div className="controls-section" variants={itemVariants}>
            <motion.button
              onClick={toggleStatus}
              className={`btn btn-status ${status === 'Online' ? 'btn-offline' : 'btn-online'}`}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'Online' ? 'Set Offline' : 'Set Online'}
            </motion.button>

            <motion.button
              onClick={resetStatus}
              className="btn btn-reset"
              whileTap={{ scale: 0.95 }}
            >
              Reset Status
            </motion.button>
          </motion.div>

          <motion.div className="history-section" variants={itemVariants}>
            <h3>Recent Status Changes</h3>
            {statusHistory.length === 0 ? (
              <p>No changes yet.</p>
            ) : (
              <ul className="history-list">
                {statusHistory.map((entry, index) => (
                  <motion.li
                    key={index}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className={entry.status === 'Online' ? 'text-online' : 'text-offline'}>
                      {entry.status}
                    </span>
                    <span className="timestamp">{entry.timestamp}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
