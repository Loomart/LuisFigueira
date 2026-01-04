import { useState, useEffect } from 'react';
import { STORAGE_KEYS, COOKIE_KEYS, THEMES } from '../config/constants';

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
    const cookieMatch = document.cookie.match(new RegExp('(^| )' + COOKIE_KEYS.THEME + '=([^;]+)'));
    const cookieTheme = cookieMatch ? cookieMatch[2] : null;
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const initialTheme = cookieTheme || savedTheme || THEMES.LIGHT;
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.cookie = `${COOKIE_KEYS.THEME}=${newTheme}; path=/; max-age=31536000`;
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
