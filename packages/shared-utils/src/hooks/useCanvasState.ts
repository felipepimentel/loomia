import { useState, useCallback } from 'react';
import { Shape, Connection, Comment } from '../types';

export const useCanvasState = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [tool, setTool] = useState<'select' | 'rectangle' | 'ellipse' | 'sticky' | 'text' | 'connection'>('select');
  const [color, setColor] = useState('#ffeb3b');

  // Funções de manipulação do canvas podem ser adicionadas aqui

  return {
    shapes,
    setShapes,
    connections,
    setConnections,
    comments,
    setComments,
    selectedShapes,
    setSelectedShapes,
    tool,
    setTool,
    color,
    setColor,
    // Outros métodos e estados
  };
};
