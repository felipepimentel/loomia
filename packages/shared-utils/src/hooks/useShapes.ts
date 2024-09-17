import { useState, useCallback } from 'react';
import { Shape } from '../types';

export const useShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  const addShape = useCallback((shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
  }, []);

  const updateShape = useCallback((id: string, updates: Partial<Shape>) => {
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
    );
  }, []);

  const removeShape = useCallback((id: string) => {
    setShapes((prev) => prev.filter((shape) => shape.id !== id));
  }, []);

  return { shapes, addShape, updateShape, removeShape };
};
