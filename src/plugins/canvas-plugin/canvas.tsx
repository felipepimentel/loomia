// plugins/canvas/canvas.tsx
import React, { useState, useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<any[]>([]); // Lista de formas desenhadas

  useEffect(() => {
    // Lógica de inicialização do canvas (por exemplo, carregar formas existentes)
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Lógica para lidar com cliques no canvas
    console.log("Canvas clicked");
  };

  return (
    <div 
      ref={canvasRef}
      className="canvas-container" 
      onClick={handleCanvasClick}
      style={{ width: '100%', height: '100%', border: '1px solid #ddd' }}
    >
      {/* Renderizar formas desenhadas aqui */}
      {shapes.map(shape => (
        <div 
          key={shape.id} 
          style={{ position: 'absolute', left: shape.x, top: shape.y }}
        >
          {shape.type}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
