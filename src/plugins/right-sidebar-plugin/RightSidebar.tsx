import React from 'react';
import { Shape, Connection } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Lock, Unlock, Trash2, Layers, Settings } from 'lucide-react';

interface RightSidebarProps {
  shapes?: Shape[];
  connections?: Connection[];
  selectedShapes: string[];
  selectedConnections: string[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedConnections: React.Dispatch<React.SetStateAction<string[]>>;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  zoom: number;
  setZoom: (zoom: number) => void;
  gridEnabled: boolean;
  setGridEnabled: (enabled: boolean) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  shapes = [],
  connections = [],
  selectedShapes,
  selectedConnections,
  setSelectedShapes,
  setSelectedConnections,
  setShapes,
  setConnections,
  zoom,
  setZoom,
  gridEnabled,
  setGridEnabled,
}) => {
  const toggleShapeVisibility = (shapeId: string) => {
    setShapes((prevShapes) =>
      prevShapes.map((s) => (s.id === shapeId ? { ...s, visible: !s.visible } : s))
    );
  };

  const toggleShapeLock = (shapeId: string) => {
    setShapes((prevShapes) =>
      prevShapes.map((s) => (s.id === shapeId ? { ...s, locked: !s.locked } : s))
    );
  };

  const removeConnection = (connectionId: string) => {
    setConnections((prevConnections) => prevConnections.filter((c) => c.id !== connectionId));
  };

  const selectShape = (shapeId: string) => {
    setSelectedShapes([shapeId]);
    setSelectedConnections([]);
  };

  const selectConnection = (connectionId: string) => {
    setSelectedConnections([connectionId]);
    setSelectedShapes([]);
  };

  return (
    <div className="w-64 border-l bg-white h-full flex flex-col">
      <Tabs defaultValue="layers" className="flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="layers" className="w-1/2">
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="settings" className="w-1/2">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layers" className="p-4">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {shapes.length > 0 ? (
              shapes.map((shape) => (
                <div
                  key={shape.id}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    selectedShapes.includes(shape.id) ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => selectShape(shape.id)}
                >
                  <span>{shape.type}</span>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShapeVisibility(shape.id);
                      }}
                    >
                      {shape.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShapeLock(shape.id);
                      }}
                    >
                      {shape.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No shapes available</p>
            )}
            {connections.length > 0 ? (
              connections.map((connection) => (
                <div
                  key={connection.id}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    selectedConnections.includes(connection.id) ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => selectConnection(connection.id)}
                >
                  <span>Connection</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeConnection(connection.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No connections available</p>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="settings" className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Zoom</span>
                <span>{zoom}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                min={10}
                max={200}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Grid</span>
              <input
                type="checkbox"
                checked={gridEnabled}
                onChange={(e) => setGridEnabled(e.target.checked)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
