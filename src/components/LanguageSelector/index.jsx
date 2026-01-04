import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';
import { STORAGE_KEYS } from '../../config/constants';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
    }
    if (typeof document !== 'undefined') {
      document.cookie = `i18nextLng=${lng}; path=/; max-age=31536000`;
    }
  };

  return (
    <div className="language-selector">
      <button onClick={() => changeLanguage('en')} title="English">EN</button>
      <button onClick={() => changeLanguage('es')} title="Español">ES</button>
      <button onClick={() => changeLanguage('pt')} title="Português">PT</button>
    </div>
  );
};

export default LanguageSelector;
