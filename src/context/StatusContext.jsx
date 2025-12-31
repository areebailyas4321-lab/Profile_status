import React, { createContext, useState, useEffect, useContext } from 'react';

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {

    const [status, setStatus] = useState(() => {
        return localStorage.getItem('userStatus') || 'Online';
    });

    const [statusHistory, setStatusHistory] = useState(() => {
        const saved = localStorage.getItem('statusHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        console.log('Status changed:', status);
        localStorage.setItem('userStatus', status);

       

    }, [status]);

    const updateStatus = (newStatus) => {
        setStatus(newStatus);
        const newEntry = {
            status: newStatus,
            timestamp: new Date().toLocaleString()
        };

        setStatusHistory(prevHistory => {
            const newHistory = [newEntry, ...prevHistory].slice(0, 5);
            localStorage.setItem('statusHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const toggleStatus = () => {
        const newStatus = status === 'Online' ? 'Offline' : 'Online';
        updateStatus(newStatus);
    };

    const resetStatus = () => {
        setStatus('Online');
        setStatusHistory([]);
        localStorage.removeItem('statusHistory');
    };

    // Inactivity Timer
    useEffect(() => {
        let timer;
        const resetTimer = () => {
            if (status === 'Offline') return;
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (status === 'Online') {
                    console.log('Auto-offline due to inactivity');
                    updateStatus('Offline');
                }
            }, 60000); // 1 minute
        };

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
        };
    }, [status]); 

    return (
        <StatusContext.Provider value={{ status, statusHistory, toggleStatus, resetStatus }}>
            {children}
        </StatusContext.Provider>
    );
};
