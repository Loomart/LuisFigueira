import { useState, useRef, useEffect } from 'react';

const ShapeSorter = ({ onBack }) => {
  const [shapes, setShapes] = useState([
    { id: 1, type: 'circle', color: 'red' },
    { id: 2, type: 'square', color: 'blue' },
    { id: 3, type: 'triangle', color: 'green' },
  ]);

  const [holes, setHoles] = useState([
    { id: 1, type: 'circle', color: 'red' },
    { id: 2, type: 'square', color: 'blue' },
    { id: 3, type: 'triangle', color: 'green' },
  ]);

  const [draggedShape, setDraggedShape] = useState(null);
  const dragElementRef = useRef(null);

  // Track pointer position for touch/mouse dragging
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!draggedShape) return;
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPointerPos({ x: clientX, y: clientY });
    };

    const handlePointerUp = (e) => {
      if (!draggedShape) return;
      
      // Check what element is under the pointer
      const target = document.elementFromPoint(
        e.touches ? e.touches[0].clientX : e.clientX,
        e.touches ? e.touches[0].clientY : e.clientY
      );
      
      const holeElement = target?.closest('.hole');
      
      if (holeElement) {
        const holeId = parseInt(holeElement.dataset.id);
        const hole = holes[holeId - 1];
        
        // Validate shape type matches hole type
        if (draggedShape.type === hole.type) {
          setShapes(prev => prev.filter(s => s.id !== draggedShape.id));
          setHoles(prev => prev.map(h => 
            h.id === holeId ? { ...h, type: draggedShape.type, color: draggedShape.color } : h
          ));
        }
      }
      
      // Reset drag state
      setDraggedShape(null);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedShape, holes]);

  const handleDragStart = (e, shape) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDraggedShape(shape);
    
    // Get initial position
    const rect = e.target.getBoundingClientRect();
    const containerRect = document.querySelector('.game-container').getBoundingClientRect();
    
    // Calculate offset from element center
    const offsetX = (rect.width / 2) - (rect.left - containerRect.left);
    const offsetY = (rect.height / 2) - (rect.top - containerRect.top);
    
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedShape && e.target.classList.contains('hole')) {
      e.dataTransfer.dropEffect = 'move';
      
      // Add hover visual feedback
      const holeId = parseInt(e.target.dataset.id);
      const hole = holes[holeId - 1];
      
      if (draggedShape.type === hole.type) {
        e.target.classList.add('hover');
      } else {
        e.target.classList.remove('hover');
      }
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedShape && e.target.classList.contains('hole')) {
      e.target.classList.remove('hover');
    }
  };

  const handleDrop = (e, holeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const hole = holes[holeId - 1];
    
    if (draggedShape && draggedShape.type === hole.type) {
      setShapes(prev => prev.filter(s => s.id !== draggedShape.id));
      setHoles(prev => prev.map(h => 
        h.id === holeId ? { ...h, type: draggedShape.type, color: draggedShape.color } : h
      ));
    }
    
    e.target.classList.remove('hover');
  };

  const handlePointerDown = (e, shape) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDraggedShape(shape);
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  const resetGame = () => {
    setShapes([
      { id: 1, type: 'circle', color: 'red' },
      { id: 2, type: 'square', color: 'blue' },
      { id: 3, type: 'triangle', color: 'green' },
    ]);
    setHoles([
      { id: 1, type: 'circle', color: 'red' },
      { id: 2, type: 'square', color: 'blue' },
      { id: 3, type: 'triangle', color: 'green' },
    ]);
  };

  const checkWin = () => {
    return holes.every(hole => hole.type !== null);
  };

  return (
    <div className="games-page">
      <button onClick={onBack} className="back-button">← Back to Games</button>
      
      <div 
        className="game-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, 0)}
      >
        {/* Shapes */}
        {shapes.map(shape => (
          <div
            key={shape.id}
            className={`shape ${shape.type}`}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            onPointerDown={(e) => handlePointerDown(e, shape)}
            style={{
              position: 'absolute',
              left: pointerPos.x - 30,
              top: pointerPos.y - 30,
              zIndex: draggedShape ? 100 : 1,
              cursor: draggedShape ? 'grabbing' : 'grab',
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
            className={`hole ${hole.type || 'empty'} ${draggedShape && draggedShape.type === hole.type ? 'hover' : ''}`}
            data-id={hole.id}
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={handleDragLeave}
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
