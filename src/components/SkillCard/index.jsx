import React, { useState } from 'react';
import './SkillCard.css';

const SkillCard = ({ category, items }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`skill-card ${open ? 'open' : ''}`}>
            <div className="card-toggle" onClick={() => setOpen(!open)}>
                <strong>{category}</strong>
                <span className={`toggle-icon ${open ? 'rotated' : ''}`}>▼</span>
            </div>

            <div className={`card-details ${open ? 'open' : ''}`}>
                <ul>
                    {items.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SkillCard;
