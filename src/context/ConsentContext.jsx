import React, { useEffect, useMemo, useState } from 'react';
import { ConsentContext } from './ConsentContextBase';
import { STORAGE_KEYS } from '../config/constants';

export const ConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState({ decided: false, preferences: false });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONSENT);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsent({ decided: true, preferences: !!parsed.preferences });
      }
    } catch {
      /* no-op */
    }
  }, []);

  const acceptNecessary = () => {
    const value = { preferences: false };
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(value));
    setConsent({ decided: true, preferences: false });
  };

  const acceptAll = () => {
    const value = { preferences: true };
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(value));
    setConsent({ decided: true, preferences: true });
  };

  const value = useMemo(() => ({ consent, acceptNecessary, acceptAll }), [consent]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};


