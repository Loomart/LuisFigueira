import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ProjectCard.css';

/**
 * ProjectCard Component
 * Displays a single project in the portfolio grid.
 * Supports expanding to show more details (description, tech stack, links).
 * 
 * @param {Object} props
 * @param {string} props.title - Project title
 * @param {string} props.image - Path to project thumbnail image
 * @param {string} props.descriptionKey - i18n key for the project description
 * @param {string} [props.link] - Optional URL to the live project
 * @param {string[]} [props.tech] - Array of technology names used
 * @param {boolean} props.isOpen - Whether the card is currently expanded
 * @param {Function} props.onToggle - Handler to toggle expanded state
 */
const ProjectCard = ({ title, image, descriptionKey, link, tech, isOpen, onToggle }) => {
  const { t } = useTranslation();

  return (
    <div className={`project-card ${isOpen ? 'open' : ''}`} onClick={onToggle}>
      {/* Fixed height image container */}
      <div className="project-image-container">
        <img src={image} alt={title} className="project-image" />
      </div>
      
      <div className="project-content">
        <h3 className="project-title">{title}</h3>

        {/* Expandable Content */}
        {isOpen && (
          <div className="project-details">
            <p className="project-description">{t(descriptionKey)}</p>
            
            {/* Tech Stack Badges */}
            <div className="project-tech">
              {tech?.map((item, idx) => (
                <span key={idx} className="tech-badge">{item}</span>
              ))}
            </div>

            {/* Action Button */}
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="project-button" onClick={(e) => e.stopPropagation()}>
                {t('certifications.view') || 'Ver proyecto'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
