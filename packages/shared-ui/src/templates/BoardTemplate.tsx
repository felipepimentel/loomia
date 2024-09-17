import React from 'react';
import { Toolbar } from '../molecules/Toolbar';
import { Sidebar } from '../molecules/Sidebar';
import { CanvasArea } from '../organisms/CanvasArea';

export const BoardTemplate: React.FC = () => {
  return (
    <div className="board-template" style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, position: 'relative' }}>
        <Toolbar />
        <CanvasArea />
      </div>
    </div>
  );
};
