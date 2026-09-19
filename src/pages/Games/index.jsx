import React, { useState } from 'react';
import ShapeSorter from './ShapeSorter'; // Assuming ShapeSorter is a new component for the game

const Games = () => {
  const [games, setGames] = useState([
    { name: 'Shape Sorter', component: ShapeSorter },
    // ... other games
  ]);

  return (
    <section className="games-page">
      {games.map((game, index) => (
        <div key={index}>
          <h2>{game.name}</h2>
          <game.component />
        </div>
      ))}
    </section>
  );
};

export default Games;
