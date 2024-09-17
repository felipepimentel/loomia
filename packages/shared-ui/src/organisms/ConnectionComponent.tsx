import React from 'react';
import { Connection, useCanvasContext } from '@loomia/shared-utils';

type ConnectionComponentProps = {
  connection: Connection;
};

export const ConnectionComponent: React.FC<ConnectionComponentProps> = ({ connection }) => {
  const { shapes } = useCanvasContext();

  // Find the shapes connected by this connection
  const fromShape = shapes.find((shape) => shape.id === connection.from);
  const toShape = shapes.find((shape) => shape.id === connection.to);

  if (!fromShape || !toShape) {
    return null; // If shapes are not found, do not render the connection
  }

  // Calculate the center positions of the shapes
  const x1 = fromShape.x + fromShape.width / 2;
  const y1 = fromShape.y + fromShape.height / 2;
  const x2 = toShape.x + toShape.width / 2;
  const y2 = toShape.y + toShape.height / 2;

  return (
    <svg
      style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
      width="100%"
      height="100%"
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={connection.color || '#000'}
        strokeWidth={2}
      />
    </svg>
  );
};
