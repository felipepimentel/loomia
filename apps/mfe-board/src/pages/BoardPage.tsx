import React from 'react';
import { BoardTemplate } from '@loomia/shared-ui';
import { CanvasProvider } from '@loomia/shared-utils';

const BoardPage: React.FC = () => {
  return (
    <CanvasProvider>
      <BoardTemplate />
    </CanvasProvider>
  );
};

export default BoardPage;
