import React,  { useState } from 'react';
import ShapeSorter from './ShapeSorter';  // Assuming ShapeSorter is a new component for the game

const Games = () => {
  const  [games, setGames] = useState([
      { name: 'Shape Sorter', component: ShapeSorter },
      // ... other games
    ]);

  return (
    ...
  );
};

export default Games;
