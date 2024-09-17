import React from 'react';
import { Shape } from '@loomia/shared-utils';

type ShapeComponentProps = {
  shape: Shape;
};

export const ShapeComponent: React.FC<ShapeComponentProps> = ({ shape }) => {
  // Define styles common to all shapes
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    transform: `rotate(${shape.rotation}deg)`,
    backgroundColor: shape.color,
    userSelect: 'none',
  };

  // Render shape based on its type
  switch (shape.type) {
    case 'rectangle':
      return <div style={baseStyle} />;
    case 'ellipse':
      return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
    case 'sticky':
      return (
        <div style={{ ...baseStyle, padding: '8px', backgroundColor: '#fffec8' }}>
          <p>{shape.content}</p>
        </div>
      );
    case 'text':
      return (
        <div style={{ ...baseStyle, backgroundColor: 'transparent' }}>
          <p style={{ fontSize: shape.fontSize, color: shape.color }}>
            {shape.content}
          </p>
        </div>
      );
    default:
      return null;
  }
};
