/**
 * Global application constants
 * Centralizes configuration to avoid hardcoded values across the codebase.
 */

export const API_ENDPOINTS = {
};

export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'i18nextLng',
  CONSENT: 'consent.preferences',
  CONTACT_RATE: 'contact.rate',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const COOKIE_KEYS = {
  THEME: 'theme',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const RATE_LIMITS = {
  CONTACT_MIN_INTERVAL_MS: 60000,
  CONTACT_MAX_PER_DAY: 5,
};
