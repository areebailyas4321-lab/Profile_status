import React, { createContext, useState, useEffect, useContext } from 'react';

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {

    const USER_ID = 'user123';
    const API_URL = 'http://localhost:5000/api/user-settings';

    const [status, setStatus] = useState('Offline');

    const [statusHistory, setStatusHistory] = useState(() => {
        const saved = localStorage.getItem('statusHistory');
        return saved ? JSON.parse(saved) : [];
    });

    // Fetch initial status from DB
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/${USER_ID}`);
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data.status);
                    console.log('Fetched status:', data.status);
                } else if (res.status === 404) {
                    // Create if not exists
                    console.log('User not found, creating...');
                    const createRes = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: USER_ID, status: 'Online' })
                    });
                    if (createRes.ok) {
                        const newData = await createRes.json();
                        setStatus(newData.status);
                    }
                }
            } catch (err) {
                console.error('Error fetching status:', err);
            }
        };

        fetchStatus();
    }, []);

    const updateStatus = async (newStatus) => {
        // Optimistic update
        setStatus(newStatus);

        // Update DB
        try {
            await fetch(`${API_URL}/${USER_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (err) {
            console.error('Error updating status:', err);
        }

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
        updateStatus('Online');
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
