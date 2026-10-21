// src/pages/Games/ShapeSorter/index.jsx

import React, { useState, useEffect } from 'react';
import './ShapeSorter.css';

// Import shape images
import circleImg from '../../../assets/shapes/circle.png';
import squareImg from '../../../assets/shapes/square.png';
import triangleImg from '../../../assets/shapes/triangle.png';
import pentagonImg from '../../../assets/shapes/pentagon.png';
import hexagonImg from '../../../assets/shapes/hexagon.png';
import octagonImg from '../../../assets/shapes/octagon.png';
import starImg from '../../../assets/shapes/star.png';
import ovalImg from '../../../assets/shapes/oval.png';

const ShapeSorter = ({ onBack }) => {
  const [shapes, setShapes] = useState([]);
  const [holes, setHoles] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [draggingShape, setDraggingShape] = useState(null);

  const shapeTypes = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'octagon', 'star', 'oval'];
  const shapeImages = {
    circle: circleImg,
    square: squareImg,
    triangle: triangleImg,
    pentagon: pentagonImg,
    hexagon: hexagonImg,
    octagon: octagonImg,
    star: starImg,
    oval: ovalImg
  };

  // Randomize array order
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Generate holes in random order with 2 columns and unique patterns
  const generateHoles = () => {
    // Create hole pairs with different shapes
    const holePairs = [
      { id: 'hole-1', type: 'circle', pairType: 'square' },
      { id: 'hole-2', type: 'triangle', pairType: 'pentagon' },
      { id: 'hole-3', type: 'hexagon', pairType: 'octagon' },
      { id: 'hole-4', type: 'star', pairType: 'oval' }
    ];
    
    // Shuffle pairs to randomize order
    const shuffledPairs = shuffleArray(holePairs);
    
    // Create holes arranged in 2 columns (2 holes each column)
    const holesArray = [];
    
    // Positioning for two columns
    const positions = [
      { x: 650, y: 50 },   // Column 1 - Top
      { x: 650, y: 150 },  // Column 1 - Bottom
      { x: 720, y: 50 },   // Column 2 - Top
      { x: 720, y: 150 }   // Column 2 - Bottom
    ];
    
    shuffledPairs.forEach((pair, index) => {
      holesArray.push({
        id: pair.id,
        type: pair.type,
        pairType: pair.pairType,
        x: positions[index].x,
        y: positions[index].y,
        filled: false
      });
    });
    
    return holesArray;
  };

  // Generate shapes for player to drag with matching pairs
  const generateShapes = () => {
    // Create shape pairs (not repeating)
    const shapePairs = [
      { type: 'circle', pairType: 'square' },
      { type: 'triangle', pairType: 'pentagon' },
      { type: 'hexagon', pairType: 'octagon' },
      { type: 'star', pairType: 'oval' }
    ];
    
    const shapesArray = [];
    
    // Positioning for two columns
    const positions = [
      { x: 50, y: 50 },
      { x: 120, y: 50 },
      { x: 50, y: 150 },
      { x: 120, y: 150 },
      { x: 50, y: 250 },
      { x: 120, y: 250 },
      { x: 50, y: 350 },
      { x: 120, y: 350 }
    ];
    
    // Add all shapes in two columns with pairs
    shapePairs.forEach((pair, index) => {
      shapesArray.push({
        id: `shape-${pair.type}`,
        type: pair.type,
        x: positions[index * 2].x,
        y: positions[index * 2].y
      });
      
      shapesArray.push({
        id: `shape-${pair.pairType}`,
        type: pair.pairType,
        x: positions[index * 2 + 1].x,
        y: positions[index * 2 + 1].y
      });
    });
    
    return shapesArray;
  };

  useEffect(() => {
    setShapes(generateShapes());
    setHoles(generateHoles());
  }, []);

  const handleDragStart = (e, shape) => {
    e.dataTransfer.setData('text/plain', shape.id);
    setDraggingShape(shape.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingShape(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, hole) => {
    e.preventDefault();
    
    const shapeId = e.dataTransfer.getData('text/plain');
    const shape = shapes.find(s => s.id === shapeId);
    
    if (shape && (shape.type === hole.type || shape.type === hole.pairType)) {
      // Remove the matched shape from available shapes
      setShapes(prev => prev.filter(s => s.id !== shapeId));
      
      // Update the hole to be filled
      setHoles(prev => prev.map(h => 
        h.id === hole.id ? { ...h, filled: true } : h
      ));
      
      // Check if all holes are filled
      const allFilled = holes.every(hole => hole.filled);
      if (allFilled) {
        setGameCompleted(true);
      }
    }
  };

  return (
    <div className="shape-game-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      
      <h1>Shape Matching Game</h1>
      
      <div className="game-area">
        {holes.map(hole => (
          <div 
            key={hole.id} 
            className={`hole ${hole.filled ? 'filled' : ''}`}
            style={{ left: `${hole.x}px`, top: `${hole.y}px` }}
          >
            {!hole.filled && (
              <div className="hole-pattern">
                <img 
                  src={shapeImages[hole.type]} 
                  alt={`${hole.type} shape`} 
                  className="hole-shape"
                />
              </div>
            )}
            {hole.filled && (
              <div className="filled-hole">
                <span className="checkmark">✓</span>
              </div>
            )}
          </div>
        ))}
        
        {shapes.map(shape => (
          <div 
            key={shape.id}
            className="shape"
            style={{ left: `${shape.x}px`, top: `${shape.y}px` }}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
          >
            <img src={shapeImages[shape.type]} alt={`${shape.type} shape`} />
          </div>
        ))}
      </div>
      
      {gameCompleted && (
        <div className="win-message">
          <h2>Congratulations! 🎉</h2>
          <p>You matched all the shapes!</p>
        </div>
      )}
    </div>
  );
};

export default ShapeSorter;