import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation resources
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

/**
 * i18next Configuration
 * Initializes the internationalization framework.
 * 
 * - Resources: Loads JSON files for English, Spanish, and Portuguese.
 * - Lng: Sets default language to Spanish ('es').
 * - Fallback: Defaults to Spanish if a key is missing.
 * - Interpolation: React already handles escaping, so it's disabled here.
 */
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: translationES },
    en: { translation: translationEN },
    pt: { translation: translationPT }
  },
  lng: 'es', // Default language
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false // React safe from XSS
  }
});

export default i18n;
