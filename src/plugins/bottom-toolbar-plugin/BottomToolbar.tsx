// src/plugins/bottom-toolbar-plugin/BottomToolbar.tsx
import React from 'react';
import { PluginProps } from '@/core/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import ColorPicker from '@/components/ColorPicker';

const BottomToolbar: React.FC<PluginProps> = ({
  color,
  setColor,
  fontSize,
  setFontSize,
  settings,
  // ... outros props que você precisa
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-t bg-white">
      <div className="flex items-center space-x-4">
        <ColorPicker color={color} setColor={setColor} />
        <div className="flex items-center space-x-2">
          <label htmlFor="font-size" className="text-sm font-medium">Font Size:</label>
          <Input
            id="font-size"
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-16"
          />
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon">
            <Bold className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Italic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Underline className="w-4 h-4" />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon">
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BottomToolbar;
