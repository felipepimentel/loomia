"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Share2, MoreHorizontal, MousePointer2, Square, Circle, Type, StickyNote, ArrowUpRight, Undo2, Redo2, Minus, Plus, Trash2, Lock, Unlock, Eye, EyeOff, Settings, Layers, Grid, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, ZoomIn, ZoomOut, Download, Upload, Users, Triangle, Hexagon, Star, Pen, Eraser, Pipette, History, RotateCcw, Menu, Moon, Sun, Presentation, Library
} from "lucide-react";

// ========================== //
//         INTERFACES         //
// ========================== //

type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'hexagon' | 'star' | 'sticky' | 'text' | 'freehand' | 'library';

interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  color: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  points?: { x: number; y: number }[];
  layer: number;
  libraryItem?: string;
}

interface Connection {
  id: string;
  startShapeId: string;
  endShapeId: string;
  startPoint: { x: number, y: number };
  endPoint: { x: number, y: number };
  color: string;
  zIndex: number;
  layer: number;
}

interface HistoryEntry {
  shapes: Shape[];
  connections: Connection[];
  action: string;
}

interface KeyboardShortcut {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  action: string;
}

// ========================== //
//       UTILITY FUNCTIONS    //
// ========================== //

const generateId = () => Math.random().toString(36).substr(2, 9);

const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return function(this: any, ...args: any[]) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// ========================== //
//          HOOKS             //
// ========================== //

const useShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  return { shapes, setShapes };
};

const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  return { connections, setConnections };
};

const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  return { history, setHistory, historyIndex, setHistoryIndex };
};

// ========================== //
//      COMPONENTS MICRO      //
// ========================== //

const ToolButton = ({ selectedTool, tool, icon: Icon, onClick }: { selectedTool: string; tool: string; icon: any; onClick: () => void }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={selectedTool === tool ? 'secondary' : 'ghost'} size="icon" onClick={onClick}>
          <Icon className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{tool.charAt(0).toUpperCase() + tool.slice(1)} tool</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const UndoButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="ghost" size="icon" onClick={onClick}>
    <Undo2 className="w-4 h-4" />
  </Button>
);

const RedoButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="ghost" size="icon" onClick={onClick}>
    <Redo2 className="w-4 h-4" />
  </Button>
);

const ZoomInButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="ghost" size="icon" onClick={onClick}>
    <ZoomIn className="w-4 h-4" />
  </Button>
);

const ZoomOutButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="ghost" size="icon" onClick={onClick}>
    <ZoomOut className="w-4 h-4" />
  </Button>
);

const ShapeButton = ({ shapeManager, shapeType }: { shapeManager: any; shapeType: ShapeType }) => {
  const handleClick = () => {
    const newShape = {
      id: generateId(),
      type: shapeType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
      color: 'blue',
      zIndex: 1,
      locked: false,
      visible: true,
      layer: 0,
    };
    shapeManager.addShape(newShape);
  };

  return <Button onClick={handleClick}>Add {shapeType}</Button>;
};

// ========================== //
//      COMPONENTS LAYOUT     //
// ========================== //

const Toolbar = ({ tool, setTool, onUndo, onRedo }: { tool: string; setTool: (tool: string) => void; onUndo: () => void; onRedo: () => void }) => (
  <div className="flex flex-col items-center p-2 space-y-2 border-r toolbar bg-background">
    <ToolButton selectedTool={tool} tool="select" icon={MousePointer2} onClick={() => setTool('select')} />
    <ToolButton selectedTool={tool} tool="rectangle" icon={Square} onClick={() => setTool('rectangle')} />
    <ToolButton selectedTool={tool} tool="ellipse" icon={Circle} onClick={() => setTool('ellipse')} />
    <ToolButton selectedTool={tool} tool="triangle" icon={Triangle} onClick={() => setTool('triangle')} />
    <ToolButton selectedTool={tool} tool="hexagon" icon={Hexagon} onClick={() => setTool('hexagon')} />
    <ToolButton selectedTool={tool} tool="star" icon={Star} onClick={() => setTool('star')} />
    <ToolButton selectedTool={tool} tool="text" icon={Type} onClick={() => setTool('text')} />
    <ToolButton selectedTool={tool} tool="sticky" icon={StickyNote} onClick={() => setTool('sticky')} />
    <ToolButton selectedTool={tool} tool="connection" icon={ArrowUpRight} onClick={() => setTool('connection')} />
    <UndoButton onClick={onUndo} />
    <RedoButton onClick={onRedo} />
    <ZoomInButton onClick={() => console.log('Zoom In')} />
    <ZoomOutButton onClick={() => console.log('Zoom Out')} />
  </div>
);

const Canvas = ({ shapes, setShapes, connections, tool }: any) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);

    if (tool === 'rectangle') {
      setShapes((prevShapes: Shape[]) => [
        ...prevShapes,
        {
          id: generateId(),
          type: 'rectangle',
          x,
          y,
          width: 100,
          height: 100,
          rotation: 0,
          color: 'blue',
          zIndex: prevShapes.length,
          locked: false,
          visible: true,
          layer: 0,
        },
      ]);
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden"
      style={{ backgroundColor: 'white' }}
      onMouseDown={handleMouseDown}
    >
      {shapes.map((shape: Shape) => (
        <div
          key={shape.id}
          style={{
            position: 'absolute',
            left: `${shape.x}px`,
            top: `${shape.y}px`,
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            backgroundColor: shape.color,
            transform: `rotate(${shape.rotation}deg)`,
            zIndex: shape.zIndex,
          }}
        >
          {shape.type}
        </div>
      ))}
    </div>
  );
};

// ========================== //
//      COMPONENT PRINCIPAL   //
// ========================== //

const Whiteboard = () => {
  const { shapes, setShapes } = useShapes();
  const { connections, setConnections } = useConnections();
  const { history, setHistory, historyIndex, setHistoryIndex } = useHistory();
  const [tool, setTool] = useState('select');

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { shapes: prevShapes, connections: prevConnections } = history[newIndex];
      setShapes(prevShapes);
      setConnections(prevConnections);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex, setShapes, setConnections, setHistoryIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { shapes: nextShapes, connections: nextConnections } = history[newIndex];
      setShapes(nextShapes);
      setConnections(nextConnections);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex, setShapes, setConnections, setHistoryIndex]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Toolbar tool={tool} setTool={setTool} onUndo={handleUndo} onRedo={handleRedo} />
        <Canvas shapes={shapes} setShapes={setShapes} connections={connections} tool={tool} />
      </div>
    </div>
  );
};

export default Whiteboard;
