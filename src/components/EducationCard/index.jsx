import React, { useState } from 'react';
import './EducationCard.css';



const EducationCard = ({ title, school, period, description }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`education-card ${open ? 'open' : ''}`}>
            <div className="card-toggle" onClick={() => setOpen(!open)}>
                <div>
                    <strong>{title}</strong> – {school}
                    <div className="education-dates">{period}</div>
                </div>
                <span className={`toggle-icon ${open ? 'rotated' : ''}`}>▼</span>
            </div>

            {description && (
                <div className={`card-details ${open ? 'open' : ''}`}>
                    <p>{description}</p>
                </div>
            )}
        </div>
    );
};

export default EducationCard;