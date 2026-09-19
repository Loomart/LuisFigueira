import React, { useState } from 'react';
import { useDraggable } from 'react-dnd';

const ShapeSorter = () => {
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

  const handleDrop = (item, hole) => {
    if (item.type === hole.type) {
      setHoles(prevHoles => prevHoles.map(h => h.id === hole.id ? { ...hole, type: item.type, color: item.color } : h));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div>
        {shapes.map(shape => {
          const [, drag] = useDraggable({
            item: { type: shape.type, color: shape.color },
            collect: monitor => ({
              isDragging: !!monitor.isDragging(),
            }),
          });

          return (
            <div
              ref={drag}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: shape.type === 'circle' ? '50%' : '0%',
                borderWidth: shape.type === 'square' ? '2px' : '0px',
                backgroundColor: shape.color,
              }}
            />
          );
        })}
      </div>
      <div>
        {holes.map(hole => (
          <div
            onDrop={e => handleDrop(JSON.parse(e.dataTransfer.getData('item')), hole)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: hole.type === 'circle' ? '50%' : '0%',
              borderWidth: hole.type === 'square' ? '2px' : '0px',
              backgroundColor: hole.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ShapeSorter;
