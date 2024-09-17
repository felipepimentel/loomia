export type ShapeType = 'rectangle' | 'ellipse' | 'sticky' | 'text';

export type Shape = {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  content?: string;
  fontSize?: number;
};

export type Connection = {
  id: string;
  from: string; // ID of the starting shape
  to: string;   // ID of the ending shape
  color?: string;
};


export type Comment = {
  id: string;
  content: string;
  position: { x: number; y: number };
};
