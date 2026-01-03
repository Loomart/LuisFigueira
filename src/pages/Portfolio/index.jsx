import React, { useState } from 'react';
import ProjectCard from '../../components/ProjectCard';
import { projects } from '../../data/projects';
import './Portfolio.css';

/**
 * Portfolio Page
 * Displays a grid of project cards.
 * Manages the state of which card is currently expanded (only one at a time).
 */
const Portfolio = () => {
  
  // State to track which project card is expanded.
  // Stores the index of the open card, or null if none are open.
  const [openIndex, setOpenIndex] = useState(null);

  /**
   * Toggles the expansion state of a specific project card.
   * If clicking the already open card, it closes it.
   * If clicking a different card, it opens that one and closes others.
   * @param {number} index - Index of the project in the list
   */
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="portfolio page">
      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            {...project}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Portfolio;
