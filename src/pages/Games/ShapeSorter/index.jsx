import { useState, useRef } from 'react';
import './index.css';

const ShapeSorter = ({ onBack }) => {
  const [shapes, setShapes] = useState([
    { id: 1, type: 'circle', color: 'red' },
    { id: 2, type: 'square', color: 'blue' },
    { id: 3, type: 'triangle', color: 'green' },
  ]);

  const [holes, setHoles] = useState([
    { id: 1, type: null, color: null },
    { id: 2, type: null, color: null },
    { id: 3, type: null, color: null },
  ]);

  const dragItemRef = useRef(null);

  // Handle drag start with vanilla HTML5 Drag and Drop API
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    dragItemRef.current = item;
  };

  // Handle drag over holes
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop on a hole
  const handleDrop = (e, holeId) => {
    e.preventDefault();
    
    const itemData = e.dataTransfer.getData('application/json');
    if (!itemData) return;

    const item = JSON.parse(itemData);
    
    // Check if shape type matches hole type
    if (item.type === holes[holeId - 1]?.type) {
      setHoles(prevHoles => prevHoles.map((h, index) => 
        index === holeId - 1 ? { ...h, type: item.type, color: item.color } : h
      ));
      
      // Remove from shapes
      setShapes(prevShapes => prevShapes.filter(s => s.id !== item.id));
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    dragItemRef.current = null;
  };

  const resetGame = () => {
    setShapes([
      { id: 1, type: 'circle', color: 'red' },
      { id: 2, type: 'square', color: 'blue' },
      { id: 3, type: 'triangle', color: 'green' },
    ]);
    setHoles([
      { id: 1, type: null, color: null },
      { id: 2, type: null, color: null },
      { id: 3, type: null, color: null },
    ]);
  };

  const checkWin = () => {
    return holes.every(hole => hole.type !== null);
  };

  return (
    <div className="shape-sorter">
      <header className="shape-sorter-header">
        <h2>Shape Sorter</h2>
        <button 
          className="back-button" 
          onClick={onBack}
          aria-label="Back to games menu"
        >
          ← Back
        </button>
      </header>

      <div className="game-instructions">
        <p>Drag shapes into matching holes!</p>
        {checkWin() && (
          <div className="win-message">
            🎉 You won! Resetting game...
            {setTimeout(resetGame, 1500)}
          </div>
        )}
      </div>

      <div className="game-container">
        <div className="shapes-area">
          {shapes.map(shape => (
            <div
              key={shape.id}
              draggable
              onDragStart={(e) => handleDragStart(e, shape)}
              onDragEnd={handleDragEnd}
              className={`shape ${shape.type}`}
              style={{ backgroundColor: shape.color }}
              role="button"
              tabIndex={0}
            >
              {shape.type === 'circle' && '○'}
              {shape.type === 'square' && '□'}
              {shape.type === 'triangle' && '△'}
            </div>
          ))}
        </div>

        <div className="holes-area">
          {holes.map(hole => (
            <div
              key={hole.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hole.id)}
              className={`hole ${hole.type || 'empty'}`}
              style={{ 
                backgroundColor: hole.color ? hole.color : 'transparent',
                border: hole.type ? `2px solid ${hole.color}` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default ShapeSorter;
