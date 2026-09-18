import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Games.css';

const games = [
  {
    id: 'shape-sorter',
    name: 'Shape Sorter',
    description: 'Drag and drop shapes into their matching holes!',
    emoji: '🔷',
    color: '#FF6B6B',
    gif: '🔷🔶🔵🔴',
    icon: '🔷',
  },
  {
    id: 'color-match',
    name: 'Color Match',
    description: 'Find the matching colors!',
    emoji: '🌈',
    color: '#4ECDC4',
    gif: '🌈🎨🎨🎨',
    icon: '🌈',
  },
  {
    id: 'animal-sounds',
    name: 'Animal Sounds',
    description: 'Tap the animals to hear their sounds!',
    emoji: '🐾',
    color: '#FFE66D',
    gif: '🐱🐶🐰🐼',
    icon: '🐱',
  },
  {
    id: 'counting',
    name: 'Counting Fun',
    description: 'Count the objects and find the right number!',
    emoji: '🔢',
    color: '#FF6B9D',
    gif: '🍎🍎🍎🍎',
    icon: '🔢',
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    description: 'Find matching pairs of animals!',
    emoji: '🧠',
    color: '#C44EFF',
    gif: '🦁🐘🐵🐧',
    icon: '🦁',
  },
  {
    id: 'letter-match',
    name: 'Letter Match',
    description: 'Match letters to their sounds!',
    emoji: '🔤',
    color: '#45B7D1',
    gif: '🔤🔤🔤🔤',
    icon: '🔤',
  },
  {
    id: 'pattern-fun',
    name: 'Pattern Fun',
    description: 'Complete the colorful patterns!',
    emoji: '✨',
    color: '#FF9F43',
    gif: '⭐⭐⭐⭐',
    icon: '⭐',
  },
  {
    id: 'number-sequence',
    name: 'Number Sequence',
    description: 'Help the numbers in order!',
    emoji: '🔢',
    color: '#54A0FF',
    gif: '1️⃣2️⃣3️⃣',
    icon: '1️⃣',
  },
];

const Games = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="games-page">
      <div className="games-header">
        <h1>🎮 Educational Games</h1>
        <p>Fun games for little learners!</p>
      </div>

      <div className="games-grid">
        {games.map((game, index) => (
          <div
            key={game.id}
            className={`game-card ${openIndex === index ? 'open' : ''}`}
            style={{ borderLeft: `4px solid ${game.color}` }}
          >
            <div className="game-card-header" onClick={() => handleToggle(index)}>
              <div className="game-icon" style={{ background: game.color }}>
                {game.icon}
              </div>
              <div className="game-info">
                <h3>{game.name}</h3>
                <p>{game.description}</p>
              </div>
              <span className="toggle-arrow">▼</span>
            </div>

            {openIndex === index && (
              <div className="game-card-details">
                <div className="game-visual">
                  <div className="game-emoji-display">
                    {game.gif.split('').map((char, i) => (
                      <span key={i} className="floating-emoji" style={{ animationDelay: `${i * 0.1}s` }}>
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="game-actions">
                  <button className="play-btn" style={{ background: game.color }}>
                    🎮 Play Game
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Games;
