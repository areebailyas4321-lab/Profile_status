import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Theme Context
const ThemeContext = createContext();

// Custom hook for easier consumption
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const USER_ID = 'user123';
    const API_URL = 'http://localhost:5000/api/user-settings';

    // Initialize theme from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'light';
    });

    // Fetch initial theme from DB
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const res = await fetch(`${API_URL}/${USER_ID}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.theme) {
                        // DB has 'Light'/'Dark', app uses 'light'/'dark'
                        setTheme(data.theme.toLowerCase());
                        console.log('Fetched theme:', data.theme);
                    }
                }
            } catch (err) {
                console.error('Error fetching theme:', err);
            }
        };

        fetchTheme();
    }, []);

    // Toggle between light and dark
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme); // Optimistic update

        // Update DB
        try {
            // DB expects 'Light'/'Dark'
            const dbTheme = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);

            await fetch(`${API_URL}/${USER_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: dbTheme })
            });
            console.log('Theme updated in DB to:', dbTheme);
        } catch (err) {
            console.error('Error updating theme:', err);
        }
    };

    // Update localStorage and document body class when theme changes
    useEffect(() => {
        localStorage.setItem('appTheme', theme);
        document.body.className = theme;
    }, [theme]);

    // Provide theme and toggle function to children
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
