import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Trash2, MessageSquare, Minus, ZoomIn, HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

interface BottomToolbarProps {
  undo: () => void;
  redo: () => void;
  deleteSelectedShapes: () => void;
  toggleGrid: () => void;
  toggleSmartAlignment: () => void;
  isGridEnabled: boolean;
  isSmartAlignmentEnabled: boolean;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({
  undo,
  redo,
  deleteSelectedShapes,
  toggleGrid,
  toggleSmartAlignment,
  isGridEnabled,
  isSmartAlignmentEnabled,
}) => {
  return (
    <footer className="flex justify-between items-center px-4 py-2 bg-white border-t shadow-sm">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo}>
          <Redo2 className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-8 h-8 p-0">
              <div className="w-4 h-4 rounded-full bg-yellow-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            {/* Color picker or other content */}
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" onClick={deleteSelectedShapes}>
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Smart Alignment</span>
          <Switch checked={isSmartAlignmentEnabled} onCheckedChange={toggleSmartAlignment} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Grid</span>
          <Switch checked={isGridEnabled} onCheckedChange={toggleGrid} />
        </div>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
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
