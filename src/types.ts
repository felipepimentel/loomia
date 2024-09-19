// src/types.ts
export type ShapeType = 'rectangle' | 'ellipse' | 'sticky' | 'text';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  color: string;
  fontSize?: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

export interface Connection {
  id: string;
  startShapeId: string;
  endShapeId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  color: string;
  zIndex: number;
  isCurved: boolean;
  controlPoint?: { x: number; y: number };
}
