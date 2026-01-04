import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Curriculum.css';
import '../../styles/card-theme.css';
import ExperienceCard from '../../components/ExperienceCard';
import EducationCard from '../../components/EducationCard';
import LanguageCard from '../../components/LanguageCard';
import SkillCard from '../../components/SkillCard';

const Curriculum = () => {
    const { t } = useTranslation();
    const [sectionsOpen, setSectionsOpen] = useState({
        profile: false,
        experience: false,
        education: false,
        languages: false,
        skills: false
    });
    const toggle = (key) => setSectionsOpen(prev => ({ ...prev, [key]: !prev[key] }));

    const experience = t('cv.items', { returnObjects: true });
    const education = t('cv.education', { returnObjects: true });
    const languages = t('cv.languages', { returnObjects: true });
    const skills = t('cv.skills', { returnObjects: true });

    return (
        <section className="curriculum">
            {/* Perfil Profesional */}
            <div className="cv-block">
                <div className="cv-section-toggle" onClick={() => toggle('profile')}>
                    <h3>{t('cv.profileTitle')}</h3>
                    <span className={`toggle-icon ${sectionsOpen.profile ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`cv-section-details ${sectionsOpen.profile ? 'open' : ''}`}>
                    <p>{t('cv.profile')}</p>
                </div>
            </div>

            {/* Experiencia */}
            <div className="cv-block">
                <div className="cv-section-toggle" onClick={() => toggle('experience')}>
                    <h3>{t('cv.experienceTitle')}</h3>
                    <span className={`toggle-icon ${sectionsOpen.experience ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`cv-section-details ${sectionsOpen.experience ? 'open' : ''}`}>
                    <div className="cv-card-grid">
                        {experience.map((item, idx) => (
                            <ExperienceCard key={idx} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Educación */}
            <div className="cv-block">
                <div className="cv-section-toggle" onClick={() => toggle('education')}>
                    <h3>{t('cv.educationTitle')}</h3>
                    <span className={`toggle-icon ${sectionsOpen.education ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`cv-section-details ${sectionsOpen.education ? 'open' : ''}`}>
                    <div className="cv-card-grid">
                        {education.map((item, idx) => (
                            <EducationCard key={idx} {...item} />
                        ))}
                    </div>
                </div>
            </div>


            {/* Idiomas */}
            <div className="cv-block">
                <div className="cv-section-toggle" onClick={() => toggle('languages')}>
                    <h3>{t('cv.languagesTitle')}</h3>
                    <span className={`toggle-icon ${sectionsOpen.languages ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`cv-section-details ${sectionsOpen.languages ? 'open' : ''}`}>
                    <div className="cv-card-grid">
                        {languages.map((lang, idx) => (
                            <LanguageCard key={idx} {...lang} />
                        ))}
                    </div>
                </div>
            </div>


            {/* Habilidades Técnicas */}
            <div className="cv-block">
                <div className="cv-section-toggle" onClick={() => toggle('skills')}>
                    <h3>{t('cv.skillsTitle')}</h3>
                    <span className={`toggle-icon ${sectionsOpen.skills ? 'rotated' : ''}`}>▼</span>
                </div>
                <div className={`cv-section-details ${sectionsOpen.skills ? 'open' : ''}`}>
                    <div className="cv-card-grid">
                        {Object.entries(skills).map(([key, items], idx) => (
                            <SkillCard
                                key={idx}
                                category={t(`cv.skillsLabels.${key}`)}
                                items={items}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Curriculum;
