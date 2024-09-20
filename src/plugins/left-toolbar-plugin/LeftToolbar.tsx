import { Button } from '@/components/ui/button';
import { MousePointer2, Square, Shapes, StickyNote, Type, ArrowUpRight } from 'lucide-react';

interface LeftToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
}

const LeftToolbar: React.FC<LeftToolbarProps> = ({ tool, setTool }) => (
  <aside className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-4 shadow-md">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTool('select')}
      className={tool === 'select' ? 'bg-primary text-primary-foreground' : ''}
    >
      <MousePointer2 className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTool('rectangle')}
      className={tool === 'rectangle' ? 'bg-primary text-primary-foreground' : ''}
    >
      <Square className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTool('ellipse')}
      className={tool === 'ellipse' ? 'bg-primary text-primary-foreground' : ''}
    >
      <Shapes className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTool('sticky')}
      className={tool === 'sticky' ? 'bg-primary text-primary-foreground' : ''}
    >
      <StickyNote className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTool('text')}
      className={tool === 'text' ? 'bg-primary text-primary-foreground' : ''}
    >
      <Type className="h-5 w-5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTool('connection')}
      className={tool === 'connection' ? 'bg-primary text-primary-foreground' : ''}
    >
      <ArrowUpRight className="h-5 w-5" />
    </Button>
  </aside>
);

export default LeftToolbar;