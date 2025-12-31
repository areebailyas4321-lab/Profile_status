import React, { useContext } from 'react';
import './styles.css';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StatusProvider } from './context/StatusContext';

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <div className={`app-container ${theme}`}>
      <Navbar />
      <main className="main-content">
        <Profile />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <StatusProvider>
        <AppContent />
      </StatusProvider>
    </ThemeProvider>
  );
};

export default App;
