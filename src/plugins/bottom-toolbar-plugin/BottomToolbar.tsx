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
}) => (
  <footer className="flex justify-between items-center px-4 py-2 bg-white border-t shadow-sm">
    {/* ... (rest of the component code, same as before) */}
  </footer>
);

export default BottomToolbar;