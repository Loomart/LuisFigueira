import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConsent } from '../../context/ConsentContext.jsx';
import './ConsentBanner.css';

const ConsentBanner = () => {
  const { t } = useTranslation();
  const { consent, acceptNecessary, acceptAll } = useConsent();

  if (consent.decided) return null;

  return (
    <div className="consent-banner" role="dialog" aria-live="polite" aria-label={t('consent.title')}>
      <div className="consent-text">
        {t('consent.message')}
      </div>
      <div className="consent-actions">
        <button className="consent-btn secondary" onClick={acceptNecessary}>
          {t('consent.onlyNecessary')}
        </button>
        <button className="consent-btn primary" onClick={acceptAll}>
          {t('consent.acceptAll')}
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;

