import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';
import LanguageSelector from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';

/**
 * Header Component
 * The main navigation bar for the application.
 * Contains:
 * - Navigation links (About, Portfolio, CV, etc.)
 * - Mobile burger menu toggle
 * - Theme toggle (Dark/Light)
 * - Language selector
 */
const Header = () => {
  const { t } = useTranslation();
  
  // State for mobile menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Toggles the mobile menu open/closed state.
   */
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  /**
   * Closes the mobile menu.
   * Used when a navigation link is clicked to improve UX.
   */
  const handleClose = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* Navigation Wrapper (Burger Menu + Links) */}
        <div className="nav-wrapper">
          <button className="burger" onClick={toggleMenu} aria-label="Menu">
            ☰
          </button>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/" onClick={handleClose}>{t('about')}</Link></li>
              <li><Link to="/portfolio" onClick={handleClose}>{t('portfolio')}</Link></li>
              <li><Link to="/cv" onClick={handleClose}>{t('cv.title')}</Link></li>
              <li><Link to="/certificaciones" onClick={handleClose}>{t('certifications.title')}</Link></li>
              <li><Link to="/contacto" onClick={handleClose}>{t('contact.title')}</Link></li>
            </ul>
          </nav>
        </div>

        {/* Right Side Actions: Theme & Language */}
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ThemeToggle />
          <LanguageSelector />
        </div>

      </div>
    </header>

  );
};

export default Header;
