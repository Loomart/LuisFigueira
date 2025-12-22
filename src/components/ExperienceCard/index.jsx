import React, { useState } from 'react';
import './ExperienceCard.css';


const ExperienceCard = ({ role, company, period, description, technologies }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`experience-card ${open ? 'open' : ''}`}>
            <div className="card-toggle" onClick={() => setOpen(!open)}>
                <div>
                    <strong>{role}</strong> – {company}
                    <div className="experience-dates">{period}</div>
                </div>
                <span className={`toggle-icon ${open ? 'rotated' : ''}`}>▼</span>
            </div>

            <div className={`card-details ${open ? 'open' : ''}`}>
                <p>{description}</p>
                {technologies && (
                    <div className="experience-tech">
                        {technologies.map((tech, idx) => (
                            <span key={idx} className="tech-badge">{tech}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceCard;