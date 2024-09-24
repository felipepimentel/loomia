import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
  const colors = [
    '#ff0000', '#ff4500', '#ffa500', '#ffff00', '#9acd32', '#32cd32',
    '#00fa9a', '#00ffff', '#1e90ff', '#0000ff', '#8a2be2', '#ff00ff',
    '#ff69b4', '#dda0dd', '#d3d3d3', '#a9a9a9', '#808080', '#000000',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[80px] h-[30px] p-0"
          style={{ backgroundColor: color }}
        >
          <span className="sr-only">Escolha uma cor</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <div className="grid grid-cols-6 gap-2">
          {colors.map((c) => (
            <Button
              key={c}
              className="w-10 h-10 rounded-md p-0"
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            >
              <span className="sr-only">{c}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <div className="flex-grow mr-2">
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full"
            />
          </div>
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-0 border-none"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
