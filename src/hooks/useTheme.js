import { useState, useEffect } from 'react';
import { STORAGE_KEYS, COOKIE_KEYS, THEMES } from '../config/constants';
import { useConsent } from '../context/useConsent';

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
  const { consent } = useConsent() || { consent: { preferences: false } };

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    let initialTheme = savedTheme || THEMES.LIGHT;
    if (consent?.preferences) {
      const cookieMatch = document.cookie.match(new RegExp('(^| )' + COOKIE_KEYS.THEME + '=([^;]+)'));
      const cookieTheme = cookieMatch ? cookieMatch[2] : null;
      initialTheme = cookieTheme || initialTheme;
    }
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, [consent]);

  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (consent?.preferences) {
      document.cookie = `${COOKIE_KEYS.THEME}=${newTheme}; path=/; max-age=31536000`;
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;
