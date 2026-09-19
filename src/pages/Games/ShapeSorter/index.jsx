import { useState, useRef, useEffect } from 'react';

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

  const [dragItem, setDragItem] = useState(null);
  const dragItemRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Initialize holes with proper types
  useEffect(() => {
    setHoles([
      { id: 1, type: 'circle', color: 'red' },
      { id: 2, type: 'square', color: 'blue' },
      { id: 3, type: 'triangle', color: 'green' },
    ]);
  }, []);

  const handleDragStart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Support both mouse and touch events
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    dragItemRef.current = item;
    setDragItem(item);
    
    // Calculate offset from the element's top-left corner
    const rect = e.target.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Allow drop on any hole element
    if (e.target.classList.contains('hole')) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e, holeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const itemData = e.dataTransfer.getData('application/json');
    if (!itemData) return;

    const item = JSON.parse(itemData);
    
    // Check if shape type matches hole type
    if (item.type === holes[holeId - 1]?.type) {
      setShapes(prev => prev.filter(s => s.id !== item.id));
      setHoles(prev => prev.map(hole => 
        hole.id === holeId ? { ...hole, type: item.type, color: item.color } : hole
      ));
    } else {
      // Visual feedback for wrong shape
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragEnd = () => {
    setDragItem(null);
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

  const handleTouchStart = (e, item) => {
    e.preventDefault();
    const touch = e.touches[0];
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    
    dragItemRef.current = item;
    setDragItem(item);
    
    const rect = e.target.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleTouchMove = (e) => {
    if (!dragItemRef.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const containerRect = document.querySelector('.game-container').getBoundingClientRect();
    
    const x = touch.clientX - containerRect.left - dragOffset.current.x;
    const y = touch.clientY - containerRect.top - dragOffset.current.y;
    
    if (dragItemRef.current) {
      dragItemRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (!dragItemRef.current) return;
    
    const touch = e.changedTouches[0];
    const containerRect = document.querySelector('.game-container').getBoundingClientRect();
    const x = touch.clientX - containerRect.left;
    const y = touch.clientY - containerRect.top;
    
    // Check if dropped on a hole
    const elementBelow = document.elementFromPoint(x, y);
    const holeElement = elementBelow?.closest('.hole');
    
    if (holeElement) {
      const holeId = parseInt(holeElement.dataset.id);
      handleDrop({ preventDefault: () => {}, stopPropagation: () => {} }, holeId);
    }
    
    handleDragEnd();
  };

  return (
    <div className="games-page">
      <button onClick={onBack} className="back-button">← Back to Games</button>
      
      <div className="game-container" 
           onDragOver={handleDragOver}
           onDrop={(e) => handleDrop(e, 0)} // Fallback drop handler
           onTouchMove={handleTouchMove}
           onTouchEnd={handleTouchEnd}>
        
        {/* Shapes */}
        {shapes.map(shape => (
          <div
            key={shape.id}
            className={`shape ${shape.type}`}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            ref={dragItemRef}
            style={{
              transform: dragItem ? `translate(${dragItem.style.transform.split(',')[0]}px, ${dragItem.style.transform.split(',')[1]}px)` : 'none',
            }}
          >
            {shape.type === 'circle' && (
              <svg viewBox="0 0 100 100" width="60" height="60">
                <circle cx="50" cy="50" r="40" fill={shape.color} />
              </svg>
            )}
            {shape.type === 'square' && (
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: shape.color,
                borderRadius: '4px'
              }} />
            )}
            {shape.type === 'triangle' && (
              <svg viewBox="0 0 100 100" width="60" height="60">
                <polygon points="50,10 90,90 10,90" fill={shape.color} />
              </svg>
            )}
          </div>
        ))}
        
        {/* Holes */}
        {holes.map(hole => (
          <div
            key={hole.id}
            className={`hole ${hole.type || 'empty'} ${dragItem && dragItem.type === hole.type ? 'hover' : ''}`}
            data-id={hole.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, hole.id)}
          >
            {hole.type && (
              <svg viewBox="0 0 100 100" width="60" height="60">
                <circle cx="50" cy="50" r="40" fill={hole.color} opacity="0.3" />
              </svg>
            )}
          </div>
        ))}
        
        {/* Win Message */}
        {checkWin() && (
          <div className="win-message">🎉 All shapes sorted! 🎉</div>
        )}
      </div>
      
      <button onClick={resetGame} className="reset-button">Reset Game</button>
    </div>
  );
};

export default ShapeSorter;
