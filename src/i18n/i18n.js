import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

const detectInitialLang = () => {
  try {
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(new RegExp('(^| )i18nextLng=([^;]+)'));
      if (m && m[2]) return m[2];
    }
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('i18nextLng');
      if (saved) return saved;
    }
  } catch {
    return 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: translationES },
    en: { translation: translationEN },
    pt: { translation: translationPT }
  },
  lng: detectInitialLang(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
