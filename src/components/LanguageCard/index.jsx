// ✅ LanguageCard.jsx
import React, { useState } from 'react';
import '../../styles/card-theme.css';

const LanguageCard = ({ language, level, certifications }) => {
    const [open, setOpen] = useState(false);
    const hasCertifications = certifications && certifications.length > 0;

    return (
        <div className={`language-card ${open ? 'open' : ''}`}>
            <div className="card-toggle" onClick={hasCertifications ? () => setOpen(!open) : undefined}>
                <span><strong>{language}</strong> – {level}</span>
                {hasCertifications && (
                    <span className={`toggle-icon ${open ? 'rotated' : ''}`}>▼</span>
                )}
            </div>

            {hasCertifications && (
                <div className={`card-details ${open ? 'open' : ''}`}>
                    <ul>
                        {certifications.map((cert, idx) => (
                            <li key={idx}>{cert}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageCard;