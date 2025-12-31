import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStatus } from '../context/StatusContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { status } = useStatus();

  return (
    <motion.nav
      className={`navbar ${theme}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 80 }}
    >
      <div className="navbar-brand">
        <h1>
          Profile Status App
          <motion.span
            className={`nav-status-dot ${status === 'Online' ? 'online' : 'offline'}`}
            title={`Current Status: ${status}`}
            animate={{ scale: status === 'Online' ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
          ></motion.span>
        </h1>
      </div>
      <div className="navbar-controls">
        <motion.button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle Theme"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
