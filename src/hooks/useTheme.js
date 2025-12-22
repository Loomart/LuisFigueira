import { useState, useEffect } from 'react';
import { STORAGE_KEYS, THEMES } from '../config/constants';

/**
 * Custom hook for theme management.
 * Handles theme persistence in localStorage and system preference detection.
 * 
 * @returns {Object} Theme object
 * @returns {string} .theme - Current theme ('light' or 'dark')
 * @returns {Function} .toggleTheme - Function to toggle between themes
 */
const useTheme = () => {
  const [theme, setTheme] = useState(THEMES.LIGHT);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
    const initialTheme = savedTheme || systemPreference;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
