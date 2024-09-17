import React, { createContext, useContext, useState, useRef } from 'react';
import { Shape, Connection } from '../types';

type CanvasContextType = {
  shapes: Shape[];
  connections: Connection[];
  tool: string;
  setTool: (tool: string) => void;
  selectedShapes: string[];
  setSelectedShapes: (ids: string[]) => void;
  handleCanvasMouseDown: (event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: (event: React.MouseEvent) => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC = ({ children }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [tool, setTool] = useState<string>('select');
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeShapeId = useRef<string | null>(null);

  // Handle mouse down event on the canvas
  const handleCanvasMouseDown = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;

    // Reverse iterate to check topmost shapes first
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (
        clientX >= shape.x &&
        clientX <= shape.x + shape.width &&
        clientY >= shape.y &&
        clientY <= shape.y + shape.height
      ) {
        // Shape is clicked
        setSelectedShapes([shape.id]);
        activeShapeId.current = shape.id;
        dragOffset.current = {
          x: clientX - shape.x,
          y: clientY - shape.y,
        };
        setIsDragging(true);
        return;
      }
    }

    // If no shape is clicked, deselect all
    setSelectedShapes([]);
  };

  // Handle mouse move event on the canvas
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && activeShapeId.current) {
      const { clientX, clientY } = event;

      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          if (shape.id === activeShapeId.current) {
            return {
              ...shape,
              x: clientX - dragOffset.current.x,
              y: clientY - dragOffset.current.y,
            };
          }
          return shape;
        })
      );
    }
  };

  // Handle mouse up event on the canvas
  const handleMouseUp = () => {
    setIsDragging(false);
    activeShapeId.current = null;
  };

  // Example function to add a new shape
  const addShape = (newShape: Shape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  // Example function to remove a shape
  const removeShape = (id: string) => {
    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== id));
  };

  // Example function to add a connection
  const addConnection = (newConnection: Connection) => {
    setConnections((prevConnections) => [...prevConnections, newConnection]);
  };

  return (
    <CanvasContext.Provider
      value={{
        shapes,
        connections,
        tool,
        setTool,
        selectedShapes,
        setSelectedShapes,
        handleCanvasMouseDown,
        handleMouseMove,
        handleMouseUp,
        // Expose addShape, removeShape, addConnection if needed
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};
