import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';
import avatar from '../../assets/images/avatar.png';

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="about">
      <div className="about-container">
        <div className="about-text">
          <h1>Luis Figueira</h1>
          <p>{t('about_text')}</p>
        </div>
        <div className="about-image">
          <img src={avatar} alt="Luis Figueira" />
        </div>
      </div>
    </section>
  );
};

export default About;
