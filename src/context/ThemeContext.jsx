import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Load theme from localStorage on initial render
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
        
        // Let's also check if the user is loaded and has a preference in user state (this might be handled better in App Component or after login, but localStorage is the initial source of truth for the UI flash).
    }, []);

    const toggleTheme = useCallback((saveToBackend = null) => {
        setIsDarkMode((prevDarkMode) => {
            const nextVal = !prevDarkMode;
            
            if (nextVal) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            
            if (saveToBackend && typeof saveToBackend === 'function') {
                saveToBackend(nextVal ? 'dark' : 'light');
            }
            
            return nextVal;
        });
    }, []);
    
    const setDarkMode = useCallback((isDark) => {
        setIsDarkMode(isDark);
        if (isDark) {
             document.documentElement.classList.add('dark');
             localStorage.setItem('theme', 'dark');
        } else {
             document.documentElement.classList.remove('dark');
             localStorage.setItem('theme', 'light');
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};
