import { useState } from 'react';
import ShapeSorter from './src/ShapeSorter';

const Games = () => {
    const [game, setGame] = useState(1);
  return (
    <>
      <div>
      {game === 1 && <ShapeSorter/>}
    </div>
    </>
  );
};

export default Games;