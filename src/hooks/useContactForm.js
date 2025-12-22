import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS, NOTIFICATION_TYPES } from '../config/constants';

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
        message: ''
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
            const response = await fetch(API_ENDPOINTS.CONTACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setNotification({ message: t('contact.sentMessage'), type: NOTIFICATION_TYPES.SUCCESS });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setNotification({ message: 'Error al enviar el mensaje', type: NOTIFICATION_TYPES.ERROR });
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({ message: 'Error de conexión', type: NOTIFICATION_TYPES.ERROR });
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
