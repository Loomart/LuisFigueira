import React from 'react';
import { useTranslation } from 'react-i18next';
import './Curriculum.css';
import '../../styles/card-theme.css';
import ExperienceCard from '../../components/ExperienceCard';
import EducationCard from '../../components/EducationCard';
import LanguageCard from '../../components/LanguageCard';
import SkillCard from '../../components/SkillCard';

const Curriculum = () => {
    const { t } = useTranslation();

    const experience = t('cv.items', { returnObjects: true });
    const education = t('cv.education', { returnObjects: true });
    const languages = t('cv.languages', { returnObjects: true });
    const skills = t('cv.skills', { returnObjects: true });

    return (
        <section className="curriculum">
            {/* Perfil Profesional */}
            <div className="cv-block">
                <h3>{t('cv.profileTitle')}</h3>
                <p>{t('cv.profile')}</p>
            </div>

            {/* Experiencia */}
            <div className="cv-block">
                <h3>{t('cv.experienceTitle')}</h3>
                <div className="cv-card-grid">
                    {experience.map((item, idx) => (
                        <ExperienceCard key={idx} {...item} />
                    ))}
                </div>
            </div>

            {/* Educación */}
            <div className="cv-block">
                <h3>{t('cv.educationTitle')}</h3>
                <div className="cv-card-grid">
                    {education.map((item, idx) => (
                        <EducationCard key={idx} {...item} />
                    ))}
                </div>
            </div>


            {/* Idiomas */}
            <div className="cv-block">
                <h3>{t('cv.languagesTitle')}</h3>
                <div className="cv-card-grid">
                    {languages.map((lang, idx) => (
                        <LanguageCard key={idx} {...lang} />
                    ))}
                </div>
            </div>


            {/* Habilidades Técnicas */}
            <div className="cv-block">
                <h3>{t('cv.skillsTitle')}</h3>
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

        </section>
    );
};

export default Curriculum;
