import React from 'react';
import { useCanvasContext } from '@loomia/shared-utils';
import { Icon } from '../atoms/Icon';

export const Toolbar: React.FC = () => {
  const { tool, setTool } = useCanvasContext();

  const tools = [
    { name: 'select', icon: 'MousePointerClick' },
    { name: 'rectangle', icon: 'Square' },
    { name: 'ellipse', icon: 'Circle' },
    { name: 'sticky', icon: 'StickyNote' },
    { name: 'text', icon: 'Type' },
  ];

  return (
    <div className="toolbar" style={{ display: 'flex', padding: '8px', backgroundColor: '#f0f0f0' }}>
      {tools.map((toolItem) => (
        <button
          key={toolItem.name}
          onClick={() => setTool(toolItem.name)}
          style={{
            backgroundColor: tool === toolItem.name ? '#ddd' : 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
          }}
        >
          <Icon name={toolItem.icon as any} size={24} />
        </button>
      ))}
    </div>
  );
};
