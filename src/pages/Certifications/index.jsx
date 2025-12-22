import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Certifications.css';
import { certifications } from '../../data/certifications';

const CertificationsGallery = () => {
  const { t } = useTranslation();
  const [modalImg, setModalImg] = useState(null);
  const [modalAlt, setModalAlt] = useState('');

  const openModal = (img, name) => {
    setModalImg(img);
    setModalAlt(name);
  };

  const closeModal = () => {
    setModalImg(null);
    setModalAlt('');
  };

  return (
    <section className="certifications-section">
      <h3 className="cert-title">{t('certifications.title')}</h3>

      <div className="certifications-grid">
        {certifications.map((cert, idx) => (
          <div className="cert-card" key={idx}>
            <img
              src={cert.img}
              alt={t(`certifications.gallery.${cert.key}`)}
              className="cert-image"
              onClick={() => openModal(cert.img, cert.key)}
            />
            <div className="cert-name">
              {t(`certifications.gallery.${cert.key}`)}
            </div>
            <button
              className="cert-button"
              onClick={() => openModal(cert.img, cert.key)}
            >
              {t('certifications.view', { defaultValue: 'Ver' })}
            </button>
          </div>
        ))}
      </div>

      {modalImg && (
        <div className="cert-modal" onClick={closeModal}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={closeModal}>
              ✕
            </button>
            <img src={modalImg} alt={modalAlt || 'Certificación ampliada'} />
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificationsGallery;
