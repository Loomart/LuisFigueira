import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_TYPES, STORAGE_KEYS, RATE_LIMITS } from '../config/constants';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for managing the contact form logic.
 * Handles form state, validation, API submission, and notifications.
 * 
 * @returns {Object} Form logic and state
 * @returns {Object} .formData - Current values of form fields
 * @returns {Object|null} .notification - Current notification state { message, type }
 * @returns {boolean} .isSubmitting - Loading state during API submission
 * @returns {Function} .handleChange - Event handler for input changes
 * @returns {Function} .submitForm - Event handler for form submission
 * @returns {Function} .closeNotification - Function to clear the current notification
 */
const useContactForm = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        hp: ''
    });
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const closeNotification = () => setNotification(null);

    const submitForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (formData.hp?.trim()) {
                setNotification({ message: t('contact.spamDetected'), type: NOTIFICATION_TYPES.ERROR });
                return;
            }

            const now = Date.now();
            let record = null;
            try {
                record = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_RATE) || 'null');
            } catch (_e) { void _e; }
            const minInterval = RATE_LIMITS.CONTACT_MIN_INTERVAL_MS;
            const maxPerDay = RATE_LIMITS.CONTACT_MAX_PER_DAY;
            const startOfToday = new Date();
            startOfToday.setHours(0,0,0,0);
            const dayStartTs = startOfToday.getTime();
            const sameDay = record?.dayStartTs === dayStartTs;
            const lastTs = record?.lastSubmitTs || 0;
            const dayCount = sameDay ? (record?.dayCount || 0) : 0;
            const sinceLast = now - lastTs;

            if (lastTs && sinceLast < minInterval) {
                const waitSecs = Math.ceil((minInterval - sinceLast) / 1000);
                setNotification({ message: t('contact.rateLimitWait', { seconds: waitSecs }), type: NOTIFICATION_TYPES.WARNING });
                return;
            }

            if (dayCount >= maxPerDay) {
                setNotification({ message: t('contact.rateLimitDailyMax'), type: NOTIFICATION_TYPES.WARNING });
                return;
            }

            const { error } = await supabase
                .from('messages')
                .insert([{ name: formData.name, email: formData.email, message: formData.message, hp: formData.hp || '' }]);

            if (!error) {
                setNotification({ message: t('contact.sentMessage'), type: NOTIFICATION_TYPES.SUCCESS });
                setFormData({ name: '', email: '', message: '', hp: '' });
                const newRecord = {
                    lastSubmitTs: now,
                    dayStartTs,
                    dayCount: dayCount + 1
                };
                try {
                    localStorage.setItem(STORAGE_KEYS.CONTACT_RATE, JSON.stringify(newRecord));
                } catch (_e) { void _e; }
            } else {
                setNotification({ message: error?.message ?? String(error), type: NOTIFICATION_TYPES.ERROR });
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ message: error?.message ?? 'Error de conexión', type: NOTIFICATION_TYPES.ERROR });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        notification,
        isSubmitting,
        handleChange,
        submitForm,
        closeNotification
    };
};

export default useContactForm;
