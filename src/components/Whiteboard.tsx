import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Transformer } from 'react-konva';

interface WhiteboardProps {
  activeTool: string;
  zoom: number;
  shapes: any[];
  updateHistory: (newShapes: any[]) => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ activeTool, zoom, shapes, updateHistory }) => {
  const [selectedId, selectShape] = useState<string | null>(null);
  const [color, setColor] = useState('#000000');
  const isDrawing = useRef(false);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = 'https://konvajs.org/assets/yoda.jpg';
    img.onload = () => setImageElement(img);
  }, []);

  const handleMouseDown = (e: any) => {
    if (activeTool === 'cursor') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        selectShape(null);
      }
      return;
    }

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newShape = { 
      id: `shape_${shapes.length + 1}`,
      tool: activeTool, 
      points: [pos.x, pos.y],
      color: color,
      ...(activeTool === 'text' && { text: 'Double click to edit' }),
    };
    updateHistory([...shapes, newShape]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastShape = shapes[shapes.length - 1];

    if (activeTool === 'pen') {
      lastShape.points = lastShape.points.concat([point.x, point.y]);
    } else {
      lastShape.width = point.x - lastShape.points[0];
      lastShape.height = point.y - lastShape.points[1];
    }

    updateHistory([...shapes.slice(0, -1), lastShape]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleDblClick = (e: any) => {
    const shape = e.target;
    if (shape.getType() === 'Text') {
      const textPosition = shape.absolutePosition();
      const stageBox = shape.getStage().container().getBoundingClientRect();
      const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
      };

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      textarea.value = shape.text();
      textarea.style.position = 'absolute';
      textarea.style.top = `${areaPosition.y}px`;
      textarea.style.left = `${areaPosition.x}px`;
      textarea.style.width = `${shape.width()}px`;

      textarea.focus();

      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          const updatedShapes = shapes.map(s => 
            s.id === shape.id() ? { ...s, text: textarea.value } : s
          );
          updateHistory(updatedShapes);
          document.body.removeChild(textarea);
        }
      });
    }
  };

  const gridSize = 20;
  const stageWidth = window.innerWidth - 60;
  const stageHeight = window.innerHeight - 60;

  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i < stageWidth / gridSize; i++) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[Math.round(i * gridSize) + 0.5, 0, Math.round(i * gridSize) + 0.5, stageHeight]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    for (let j = 0; j < stageHeight / gridSize; j++) {
      lines.push(
        <Line
          key={`h${j}`}
          points={[0, Math.round(j * gridSize), stageWidth, Math.round(j * gridSize)]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }
    return lines;
  };

  return (
    <div className="whiteboard">
      <div className="color-picker">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
        />
      </div>
      <Stage
        width={stageWidth}
        height={stageHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onDblClick={handleDblClick}
        scaleX={zoom}
        scaleY={zoom}
      >
        <Layer>
          {renderGrid()}
          {shapes.map((shape) => {
            const shapeProps = {
              key: shape.id,
              id: shape.id,
              draggable: true,
              onClick: () => selectShape(shape.id),
              stroke: shape.color,
              fill: shape.color,
            };

            switch (shape.tool) {
              case 'pen':
                return <Line {...shapeProps} points={shape.points} strokeWidth={5} tension={0.5} lineCap="round" />;
              case 'rectangle':
                return <Rect {...shapeProps} x={shape.points[0]} y={shape.points[1]} width={shape.width} height={shape.height} />;
              case 'circle':
                return <Circle {...shapeProps} x={shape.points[0]} y={shape.points[1]} radius={Math.abs(shape.width / 2)} />;
              case 'text':
                return <Text {...shapeProps} x={shape.points[0]} y={shape.points[1]} text={shape.text} fontSize={20} />;
              case 'image':
                return imageElement ? (
                  <KonvaImage {...shapeProps} x={shape.points[0]} y={shape.points[1]} image={imageElement} />
                ) : null;
              default:
                return null;
            }
          })}
          {selectedId && (
            <Transformer
              nodes={[document.getElementById(selectedId) as any]}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Whiteboard;