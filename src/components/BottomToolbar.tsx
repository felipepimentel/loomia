import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Trash2, Minus, ZoomIn, HelpCircle } from 'lucide-react';

const BottomToolbar: React.FC = () => {
  return (
    <footer className="flex justify-between items-center px-4 py-2 bg-white footer">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm">100%</span>
        <Button variant="ghost" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </footer>
  );
};

export default BottomToolbar;
