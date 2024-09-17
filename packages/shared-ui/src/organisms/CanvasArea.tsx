import React from 'react';
import { useCanvasContext } from '@loomia/shared-utils';
import { ShapeComponent } from './ShapeComponent';
import { ConnectionComponent } from './ConnectionComponent';

export const CanvasArea: React.FC = () => {
  const {
    shapes,
    connections,
    handleCanvasMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasContext();

  return (
    <div
      className="canvas-area"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    >
      {connections.map((connection) => (
        <ConnectionComponent key={connection.id} connection={connection} />
      ))}
      {shapes.map((shape) => (
        <ShapeComponent key={shape.id} shape={shape} />
      ))}
    </div>
  );
};
