import React from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';
import Notification from '../../components/Notification';
import useContactForm from '../../hooks/useContactForm';
import { supabaseConfigured } from '../../lib/supabase';

const Contact = () => {
    const { t } = useTranslation();
    const { 
        formData, 
        notification, 
        isSubmitting, 
        handleChange, 
        submitForm, 
        closeNotification 
    } = useContactForm();

    return (
        <section className="contact-page">
            <Notification 
                message={notification?.message} 
                type={notification?.type} 
                onClose={closeNotification} 
            />
            <div className="contact-container">
                
                {/* Intro / Info */}
                <div className="contact-info">
                    <h1>{t('contact.title')}</h1>
                    <p>{t('contact.subtitle')}</p>
                    
                    <div className="contact-details">
                        <div className="contact-item">
                            <span className="icon">📧</span>
                            <a href="mailto:luisfigueira@outloo.com">@LuisFigueira</a>
                        </div>
                        <div className="contact-item">
                            <span className="icon">📍</span>
                            <span>Madrid, España (Remote friendly)</span>
                        </div>
                        <div className="contact-item">
                            <span className="icon">💼</span>
                            <div className="social-links">
                                <a href="https://www.linkedin.com/in/lfigueira/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <a href="https://github.com/Loomart" target="_blank" rel="noopener noreferrer">GitHub</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario */}
                <div className="contact-form-wrapper">
                    {!supabaseConfigured && (
                        <div className="contact-maintenance">El formulario está en mantenimiento temporalmente. Por favor usa los enlaces de contacto.</div>
                    )}
                    <form className="contact-form" onSubmit={submitForm}>
                        <div className="form-group">
                            <label htmlFor="name">{t('contact.name')}</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                placeholder={t('contact.namePlaceholder')}
                                disabled={!supabaseConfigured}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">{t('contact.email')}</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder={t('contact.emailPlaceholder')}
                                disabled={!supabaseConfigured}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">{t('contact.message')}</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                value={formData.message} 
                                onChange={handleChange} 
                                required 
                                rows="5"
                                placeholder={t('contact.messagePlaceholder')}
                                disabled={!supabaseConfigured}
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isSubmitting || !supabaseConfigured}>
                            {isSubmitting ? '...' : t('contact.send')}
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
};

export default Contact;
