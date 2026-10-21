import { useEffect, useRef } from 'react';

const ShapeSorter = () => {
  const canvasRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = imageRef.current;

    // Load the image
    image.src = '/path/to/your/image.png';

    canvas.addEventListener('mousedown', (event) => {
      const x = event.clientX - canvas.offsetLeft;
      const y = event.clientY - canvas.offsetTop;

      // Draw the image at the mouse position
      context.drawImage(image, x, y);
    });
  }, []);

  return (
    <>
    <div>
      <canvas  ref={canvasRef} id="gameCanvas" width="800" height="600"></canvas><canvas  ref={canvasRef} id="gameCanvas" width="800" height="600"></canvas>
      <img  ref={imageRef} style={{ display: 'none' }}  />
    </div><div>
      
      <img  ref={imageRef} style={{ display: 'none' }}  />
    </div>
    </>
  );
};

export default ShapeSorter;