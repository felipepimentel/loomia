import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Switch } from '../atoms/Switch';
import { useCanvasContext } from '@loomia/shared-utils';

export const Footer: React.FC = () => {
  const { zoom, setZoom, smartAlignmentEnabled, setSmartAlignmentEnabled } =
    useCanvasContext();

  return (
    <footer className="footer">
      <div className="footer-left">
        <Button variant="ghost" size="icon">
          <Icon name="Undo2" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon name="Redo2" />
        </Button>
        <div className="footer-item">
          <span>Smart Alignment</span>
          <Switch
            checked={smartAlignmentEnabled}
            onChange={setSmartAlignmentEnabled}
          />
        </div>
      </div>
      <div className="footer-right">
        <Button variant="ghost" size="icon" onClick={() => setZoom(zoom - 10)}>
          <Icon name="Minus" />
        </Button>
        <span>{zoom}%</span>
        <Button variant="ghost" size="icon" onClick={() => setZoom(zoom + 10)}>
          <Icon name="Plus" />
        </Button>
        <Button variant="ghost" size="icon">
          <Icon name="HelpCircle" />
        </Button>
      </div>
    </footer>
  );
};
