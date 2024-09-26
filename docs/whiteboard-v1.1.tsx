"use client"

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, MoreHorizontal, MousePointer2, Square, Circle, Type, StickyNote, ArrowUpRight, Undo2, Redo2, Minus, Plus, Trash2, Lock, Unlock, Eye, EyeOff, Settings, Layers, Grid, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, ZoomIn, ZoomOut, Download, Upload, Users, Triangle, Hexagon, Star, Pen, Eraser, Pipette, History, RotateCcw, Menu, Moon, Sun, Presentation, Library } from "lucide-react"

// Types
type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'hexagon' | 'star' | 'sticky' | 'text' | 'freehand' | 'library'

interface Shape {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  content?: string
  color: string
  fontSize?: number
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
  zIndex: number
  locked: boolean
  visible: boolean
  points?: { x: number; y: number }[]
  layer: number
  libraryItem?: string
}

interface Connection {
  id: string
  startShapeId: string
  endShapeId: string
  startPoint: { x: number, y: number }
  endPoint: { x: number, y: number }
  color: string
  zIndex: number
  layer: number
}

interface HistoryEntry {
  shapes: Shape[]
  connections: Connection[]
  action: string
}

interface KeyboardShortcut {
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  action: string
}

// Utility functions
const throttle = (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout
  let lastRan: number
  return function(this: any, ...args: any[]) {
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

const generateId = () => Math.random().toString(36).substr(2, 9)

// Memoized Components
const MemoizedHeader = React.memo(({ onSave, onUndo, onRedo, onExport, onImport, onCollaborate, onShowHistory, darkMode, setDarkMode, onStartPresentation }: {
  onSave: () => void,
  onUndo: () => void,
  onRedo: () => void,
  onExport: () => void,
  onImport: () => void,
  onCollaborate: () => void,
  onShowHistory: () => void,
  darkMode: boolean,
  setDarkMode: (darkMode: boolean) => void,
  onStartPresentation: () => void
}) => (
  <header className="flex items-center justify-between p-2 border-b bg-background">
    <div className="flex items-center space-x-2">
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-lg font-semibold">Enhanced Loomia Whiteboard</h1>
        <p className="text-xs text-muted-foreground">Last edited 2 hours ago</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onUndo}>
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onRedo}>
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle {darkMode ? 'Light' : 'Dark'} Mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onImport}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCollaborate}>
            <Users className="w-4 h-4 mr-2" />
            Collaborate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShowHistory}>
            <History className="w-4 h-4 mr-2" />
            History
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onStartPresentation}>
            <Presentation className="w-4 h-4 mr-2" />
            Start Presentation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
))

const MemoizedToolbar = React.memo(({ tool, setTool, onEyeDropper }: {
  tool: string,
  setTool: (tool: string) => void,
  onEyeDropper: () => void
}) => (
  <div className="flex flex-col items-center p-2 border-r bg-background space-y-2">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'select' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('select')}
          >
            <MousePointer2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Select tool (V)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'rectangle' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('rectangle')}
          >
            <Square className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Rectangle tool (R)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'ellipse' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('ellipse')}
          >
            <Circle className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Ellipse tool (E)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'triangle' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('triangle')}
          >
            <Triangle className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Triangle tool (T)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'hexagon' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('hexagon')}
          >
            <Hexagon className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Hexagon tool (H)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'star' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('star')}
          >
            <Star className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Star tool (S)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'text' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('text')}
          >
            <Type className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Text tool (X)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'sticky' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('sticky')}
          >
            <StickyNote className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Sticky note tool (N)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'connection' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('connection')}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Connection tool (C)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'freehand' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('freehand')}
          >
            <Pen className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Freehand tool (F)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'eraser' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('eraser')}
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Eraser tool (D)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEyeDropper}
          >
            <Pipette className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Color picker (I)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={tool === 'library' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTool('library')}
          >
            <Library className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Shape Library (L)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
))

const MemoizedColorPicker = React.memo(({ color, setColor }: { color: string, setColor: (color: string) => void }) => {
  const colors = useMemo(() => [
    '#ff0000', '#ff4500', '#ffa500', '#ffff00', '#9acd32', '#32cd32',
    '#00fa9a', '#00ffff', '#1e90ff', '#0000ff', '#8a2be2', '#ff00ff',
    '#ff69b4', '#dda0dd', '#d3d3d3', '#a9a9a9', '#808080', '#000000'
  ], [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-8 h-8 rounded-full p-0 border-2"
          style={{ backgroundColor: color }}
        >
          <span className="sr-only">Open color picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2">
          {colors.map((c) => (
            <Button
              key={c}
              className="w-8 h-8 rounded-full p-0"
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            >
              <span className="sr-only">{c}</span>
            </Button>
          ))}
        </div>
        <Separator className="my-2" />
        <div className="flex items-center">
          <div className="flex-grow">
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
            className="w-8 h-8 p-0 border-none ml-2"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
})

const MemoizedBottomToolbar = React.memo(({
  color,
  setColor,
  fontSize,
  setFontSize,
  fontWeight,
  setFontWeight,
  fontStyle,
  setFontStyle,
  textDecoration,
  setTextDecoration,
  textAlign,
  setTextAlign
}: {
  color: string
  setColor: (color: string) => void
  fontSize: number
  setFontSize: (size: number) => void
  fontWeight: string
  setFontWeight: (weight: string) => void
  fontStyle: string
  setFontStyle: (style: string) => void
  textDecoration: string
  setTextDecoration: (decoration: string) => void
  textAlign: string
  setTextAlign: (align: string) => void
}) => (
  <div className="flex items-center justify-between p-2 border-t bg-background">
    <div className="flex items-center space-x-2">
      <MemoizedColorPicker color={color} setColor={setColor} />
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center space-x-1">
        <Input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-16 h-8"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={fontWeight === 'bold' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
              >
                <Bold className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold (Ctrl+B)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={fontStyle === 'italic' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
              >
                <Italic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic (Ctrl+I)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={textDecoration === 'underline' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTextDecoration(textDecoration === 'underline' ? 'none' : 'underline')}
              >
                <Underline className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline (Ctrl+U)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={textAlign === 'left' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTextAlign('left')}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align left</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={textAlign === 'center' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTextAlign('center')}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align center</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={textAlign === 'right' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setTextAlign('right')}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Align right</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
))

const MemoizedRightSidebar = React.memo(({
  shapes,
  connections,
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
  snapToGrid,
  setSnapToGrid,
  layers,
  setLayers,
  activeLayer,
  setActiveLayer
}: {
  shapes: Shape[]
  connections: Connection[]
  selectedShapes: string[]
  selectedConnections: string[]
  setSelectedShapes: React.Dispatch<React.SetStateAction<string[]>>
  setSelectedConnections: React.Dispatch<React.SetStateAction<string[]>>
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>
  zoom: number
  setZoom: (zoom: number) => void
  gridEnabled: boolean
  setGridEnabled: (enabled: boolean) => void
  snapToGrid: boolean
  setSnapToGrid: (enabled: boolean) => void
  layers: string[]
  setLayers: React.Dispatch<React.SetStateAction<string[]>>
  activeLayer: number
  setActiveLayer: (layer: number) => void
}) => (
  <div className="w-64 border-l bg-background">
    <Tabs defaultValue="layers" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="layers">
          <Layers className="w-4 h-4 mr-2" />
          Layers
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="layers" className="p-4">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {layers.map((layer, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 cursor-pointer ${
                activeLayer === index ? 'bg-accent' : ''
              }`}
              onClick={() => setActiveLayer(index)}
            >
              <span>{layer}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setLayers(layers.filter((_, i) => i !== index))
                  setShapes(shapes.filter(s => s.layer !== index))
                  setConnections(connections.filter(c => c.layer !== index))
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
        <Button
          className="w-full mt-2"
          onClick={() => setLayers([...layers, `Layer ${layers.length + 1}`])}
        >
          Add Layer
        </Button>
      </TabsContent>
      <TabsContent value="settings" className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Zoom</span>
              <span>{zoom}%</span>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={10}
              max={200}
              step={10}
            />
            <div className="flex justify-between mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(10, zoom - 10))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom in</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Grid</span>
            <Switch
              checked={gridEnabled}
              onCheckedChange={setGridEnabled}
              id="grid-toggle"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Snap to Grid</span>
            <Switch
              checked={snapToGrid}
              onCheckedChange={setSnapToGrid}
              id="snap-to-grid-toggle"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
))

const Canvas = React.memo(({
  gridEnabled,
  snapToGrid,
  zoom,
  shapes,
  setShapes,
  connections,
  setConnections,
  tool,
  setTool,
  color,
  selectedShapes,
  setSelectedShapes,
  selectedConnections,
  setSelectedConnections,
  fontSize,
  fontWeight,
  fontStyle,
  textDecoration,
  textAlign,
  activeLayer
}: {
  gridEnabled: boolean
  snapToGrid: boolean
  zoom: number
  shapes: Shape[]
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
  connections: Connection[]
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>
  tool: string
  setTool: React.Dispatch<React.SetStateAction<string>>
  color: string
  selectedShapes: string[]
  setSelectedShapes: React.Dispatch<React.SetStateAction<string[]>>
  selectedConnections: string[]
  setSelectedConnections: React.Dispatch<React.SetStateAction<string[]>>
  fontSize: number
  fontWeight: string
  fontStyle: string
  textDecoration: string
  textAlign: string
  activeLayer: number
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const [freehandPoints, setFreehandPoints] = useState<{ x: number; y: number }[]>([])
  const [isRotating, setIsRotating] = useState(false)
  const [rotationStart, setRotationStart] = useState(0)
  const [editingText, setEditingText] = useState<string | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100)
    const y = (e.clientY - rect.top) / (zoom / 100)

    if (tool === 'select') {
      const clickedShape = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height &&
        shape.layer === activeLayer
      )
      if (clickedShape) {
        if (e.shiftKey) {
          setSelectedShapes(prev => [...prev, clickedShape.id])
        } else {
          setSelectedShapes([clickedShape.id])
        }
        setIsDragging(true)
        setDragOffset({ x: x - clickedShape.x, y: y - clickedShape.y })
      } else {
        setSelectedShapes([])
      }
    } else if (tool === 'connection') {
      const clickedShape = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height &&
        shape.layer === activeLayer
      )
      if (clickedShape) {
        setConnectionStart(clickedShape.id)
      }
    } else if (tool === 'freehand') {
      setIsDrawing(true)
      setFreehandPoints([{ x, y }])
    } else if (tool === 'eraser') {
      const shapeToErase = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height &&
        shape.layer === activeLayer
      )
      if (shapeToErase) {
        setShapes(shapes.filter(s => s.id !== shapeToErase.id))
      }
    } else if (tool === 'text') {
      setShapes(prevShapes => [
        ...prevShapes,
        {
          id: generateId(),
          type: 'text',
          x,
          y,
          width: 100,
          height: 30,
          rotation: 0,
          content: 'New text',
          color,
          fontSize,
          fontWeight,
          fontStyle,
          textDecoration,
          textAlign,
          zIndex: prevShapes.length,
          locked: false,
          visible: true,
          layer: activeLayer
        }
      ])
      setTool('select')
    } else {
      setIsDrawing(true)
      setStartPoint({ x, y })
    }
  }, [tool, shapes, zoom, setSelectedShapes, activeLayer, setShapes, color, fontSize, fontWeight, fontStyle, textDecoration, textAlign, setTool])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100)
    const y = (e.clientY - rect.top) / (zoom / 100)

    if (isDrawing) {
      if (tool === 'freehand') {
        setFreehandPoints(prev => [...prev, { x, y }])
      } else {
        const width = x - startPoint.x
        const height = y - startPoint.y
        setShapes(prevShapes => {
          const existingShape = prevShapes.find(shape => shape.id === 'temp')
          const newShape: Shape = {
            id: 'temp',
            type: tool as ShapeType,
            x: width >= 0 ? startPoint.x : x,
            y: height >= 0 ? startPoint.y : y,
            width: Math.abs(width),
            height: Math.abs(height),
            rotation: 0,
            color,
            content: tool === 'text' || tool === 'sticky' ? 'New ' + tool : undefined,
            fontSize: tool === 'text' || tool === 'sticky' ? fontSize : undefined,
            fontWeight: tool === 'text' || tool === 'sticky' ? fontWeight : undefined,
            fontStyle: tool === 'text' || tool === 'sticky' ? fontStyle : undefined,
            textDecoration: tool === 'text' || tool === 'sticky' ? textDecoration : undefined,
            textAlign: tool === 'text' || tool === 'sticky' ? textAlign : undefined,
            zIndex: prevShapes.length,
            locked: false,
            visible: true,
            layer: activeLayer
          }
          if (existingShape) {
            return prevShapes.map(shape => shape.id === 'temp' ? newShape : shape)
          } else {
            return [...prevShapes, newShape]
          }
        })
      }
    } else if (isDragging && selectedShapes.length > 0) {
      setShapes(prevShapes => prevShapes.map(shape =>
        selectedShapes.includes(shape.id)
          ? {
              ...shape,
              x: snapToGrid ? Math.round((x - dragOffset.x) / 20) * 20 : x - dragOffset.x,
              y: snapToGrid ? Math.round((y - dragOffset.y) / 20) * 20 : y - dragOffset.y
            }
          : shape
      ))
    } else if (resizeHandle && selectedShapes.length === 1) {
      setShapes(prevShapes => prevShapes.map(shape => {
        if (shape.id === selectedShapes[0]) {
          let newShape = { ...shape }
          switch (resizeHandle) {
            case 'top-left':
              newShape.width += newShape.x - x
              newShape.height += newShape.y - y
              newShape.x = x
              newShape.y = y
              break
            case 'top-right':
              newShape.width = x - newShape.x
              newShape.height += newShape.y - y
              newShape.y = y
              break
            case 'bottom-left':
              newShape.width += newShape.x - x
              newShape.height = y - newShape.y
              newShape.x = x
              break
            case 'bottom-right':
              newShape.width = x - newShape.x
              newShape.height = y - newShape.y
              break
          }
          if (snapToGrid) {
            newShape.x = Math.round(newShape.x / 20) * 20
            newShape.y = Math.round(newShape.y / 20) * 20
            newShape.width = Math.round(newShape.width / 20) * 20
            newShape.height = Math.round(newShape.height / 20) * 20
          }
          return newShape
        }
        return shape
      }))
    } else if (isRotating && selectedShapes.length === 1) {
      const shape = shapes.find(s => s.id === selectedShapes[0])
      if (shape) {
        const centerX = shape.x + shape.width / 2
        const centerY = shape.y + shape.height / 2
        const angle = Math.atan2(y - centerY, x - centerX)
        const rotation = angle * (180 / Math.PI)
        setShapes(prevShapes => prevShapes.map(s =>
          s.id === shape.id ? { ...s, rotation: rotation - rotationStart } : s
        ))
      }
    } else if (tool === 'eraser') {
      const shapeToErase = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height &&
        shape.layer === activeLayer
      )
      if (shapeToErase) {
        setShapes(shapes.filter(s => s.id !== shapeToErase.id))
      }
    }
  }, [isDrawing, isDragging, resizeHandle, isRotating, startPoint, tool, zoom, color, fontSize, fontWeight, fontStyle, textDecoration, textAlign, selectedShapes, dragOffset, setShapes, snapToGrid, activeLayer, rotationStart, shapes])

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawing) {
      if (tool === 'freehand') {
        setShapes(prevShapes => [
          ...prevShapes,
          {
            id: generateId(),
            type: 'freehand',
            x: Math.min(...freehandPoints.map(p => p.x)),
            y: Math.min(...freehandPoints.map(p => p.y)),
            width: Math.max(...freehandPoints.map(p => p.x)) - Math.min(...freehandPoints.map(p => p.x)),
            height: Math.max(...freehandPoints.map(p => p.y)) - Math.min(...freehandPoints.map(p => p.y)),
            rotation: 0,
            color,
            zIndex: prevShapes.length,
            locked: false,
            visible: true,
            points: freehandPoints,
            layer: activeLayer
          }
        ])
        setFreehandPoints([])
      } else {
        setShapes(prevShapes => {
          const tempShape = prevShapes.find(shape => shape.id === 'temp')
          if (tempShape) {
            return [
              ...prevShapes.filter(shape => shape.id !== 'temp'),
              { ...tempShape, id: generateId() }
            ]
          }
          return prevShapes
        })
      }
      setTool('select')
    } else if (tool === 'connection' && connectionStart) {
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / (zoom / 100)
      const y = (e.clientY - rect.top) / (zoom / 100)
      const endShape = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height &&
        shape.layer === activeLayer
      )
      if (endShape && endShape.id !== connectionStart) {
        setConnections(prevConnections => [
          ...prevConnections,
          {
            id: generateId(),
            startShapeId: connectionStart,
            endShapeId: endShape.id,
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            color: color,
            zIndex: prevConnections.length,
            layer: activeLayer
          }
        ])
      }
    }
    setIsDrawing(false)
    setIsDragging(false)
    setResizeHandle(null)
    setConnectionStart(null)
    setIsRotating(false)
  }, [isDrawing, tool, connectionStart, zoom, shapes, color, setShapes, setConnections, setTool, freehandPoints, activeLayer])

  const handleResizeStart = useCallback((handle: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setResizeHandle(handle)
  }, [])

  const handleRotateStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRotating(true)
    const shape = shapes.find(s => s.id === selectedShapes[0])
    if (shape) {
      const centerX = shape.x + shape.width / 2
      const centerY = shape.y + shape.height / 2
      const rect = canvasRef.current!.getBoundingClientRect()
      const x = (e.clientX - rect.left) / (zoom / 100)
      const y = (e.clientY - rect.top) / (zoom / 100)
      const angle = Math.atan2(y - centerY, x - centerX)
      setRotationStart(angle * (180 / Math.PI) - shape.rotation)
    }
  }, [shapes, selectedShapes, zoom])

  const handleTextEdit = useCallback((shapeId: string) => {
    setEditingText(shapeId)
  }, [])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, shapeId: string) => {
    setShapes(prevShapes => prevShapes.map(shape =>
      shape.id === shapeId ? { ...shape, content: e.target.value } : shape
    ))
  }, [])

  const handleTextBlur = useCallback(() => {
    setEditingText(null)
  }, [])

  const throttledMouseMove = useMemo(() => throttle(handleMouseMove, 16), [handleMouseMove])

  const renderShape = useCallback((shape: Shape) => {
    switch (shape.type) {
      case 'rectangle':
        return <rect x="0" y="0" width={shape.width} height={shape.height} fill={shape.color} />
      case 'ellipse':
        return <ellipse cx={shape.width / 2} cy={shape.height / 2} rx={shape.width / 2} ry={shape.height / 2} fill={shape.color} />
      case 'triangle':
        return <polygon points={`0,${shape.height} ${shape.width / 2},0 ${shape.width},${shape.height}`} fill={shape.color} />
      case 'hexagon':
        const a = shape.width / 4
        const b = shape.height / 2
        return <polygon points={`${a},0 ${3*a},0 ${shape.width},${b} ${3*a},${shape.height} ${a},${shape.height} 0,${b}`} fill={shape.color} />
      case 'star':
        const points = []
        for (let i = 0; i < 10; i++) {
          const angle = i * Math.PI / 5
          const r = i % 2 === 0 ? shape.width / 2 : shape.width / 4
          points.push(`${shape.width / 2 + r * Math.sin(angle)},${shape.height / 2 - r * Math.cos(angle)}`)
        }
        return <polygon points={points.join(' ')} fill={shape.color} />
      case 'freehand':
        if (shape.points) {
          const d = shape.points.reduce((acc, point, index) => {
            return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
          }, '')
          return <path d={d} fill="none" stroke={shape.color} strokeWidth="2" />
        }
        return null
      default:
        return null
    }
  }, [])

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative overflow-hidden"
      style={{
        backgroundImage: gridEnabled ? 'radial-gradient(circle, #d7d7d7 1px, transparent 1px)' : 'none',
        backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
        backgroundColor: gridEnabled ? 'var(--background)' : 'var(--background)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={throttledMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: '0 0' }}>
        {connections.map(connection => {
          const startShape = shapes.find(shape => shape.id === connection.startShapeId)
          const endShape = shapes.find(shape => shape.id === connection.endShapeId)
          if (startShape && endShape && startShape.layer === activeLayer && endShape.layer === activeLayer) {
            const startX = startShape.x + startShape.width / 2
            const startY = startShape.y + startShape.height / 2
            const endX = endShape.x + endShape.width / 2
            const endY = endShape.y + endShape.height / 2
            return (
              <svg
                key={connection.id}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={connection.color}
                  strokeWidth={2}
                />
              </svg>
            )
          }
          return null
        })}
        {shapes.map(shape => (
          shape.layer === activeLayer && (
            <div
              key={shape.id}
              style={{
                position: 'absolute',
                left: `${shape.x}px`,
                top: `${shape.y}px`,
                width: `${shape.width}px`,
                height: `${shape.height}px`,
                transform: `rotate(${shape.rotation}deg)`,
                zIndex: shape.zIndex,
                opacity: shape.visible ? 1 : 0.5,
                border: selectedShapes.includes(shape.id) ? '2px solid var(--primary)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${shape.fontSize}px`,
                fontWeight: shape.fontWeight,
                fontStyle: shape.fontStyle,
                textDecoration: shape.textDecoration,
                textAlign: shape.textAlign as any,
                padding: '5px',
                boxSizing: 'border-box',
                cursor: tool === 'select' && !shape.locked ? 'move' : 'default',
                pointerEvents: shape.locked ? 'none' : 'auto',
              }}
            >
              {shape.type === 'text' || shape.type === 'sticky' ? (
                editingText === shape.id ? (
                  <textarea
                    value={shape.content}
                    onChange={(e) => handleTextChange(e, shape.id)}
                    onBlur={handleTextBlur}
                    style={{
                      width: '100%',
                      height: '100%',
                      resize: 'none',
                      border: 'none',
                      background: 'transparent',
                      fontSize: `${shape.fontSize}px`,
                      fontWeight: shape.fontWeight,
                      fontStyle: shape.fontStyle,
                      textDecoration: shape.textDecoration,
                      textAlign: shape.textAlign as any,
                      color: shape.color,
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    onDoubleClick={() => handleTextEdit(shape.id)}
                    style={{ width: '100%', height: '100%', color: shape.color }}
                  >
                    {shape.content}
                  </div>
                )
              ) : (
                <svg width="100%" height="100%">
                  {renderShape(shape)}
                </svg>
              )}
              {selectedShapes.includes(shape.id) && !shape.locked && (
                <>
                  <div
                    className="absolute w-3 h-3 bg-background border border-primary rounded-full cursor-nwse-resize"
                    style={{ top: '-5px', left: '-5px' }}
                    onMouseDown={handleResizeStart('top-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-background border border-primary rounded-full cursor-nesw-resize"
                    style={{ top: '-5px', right: '-5px' }}
                    onMouseDown={handleResizeStart('top-right')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-background border border-primary rounded-full cursor-nesw-resize"
                    style={{ bottom: '-5px', left: '-5px' }}
                    onMouseDown={handleResizeStart('bottom-left')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-background border border-primary rounded-full cursor-nwse-resize"
                    style={{ bottom: '-5px', right: '-5px' }}
                    onMouseDown={handleResizeStart('bottom-right')}
                  />
                  <div
                    className="absolute w-5 h-5 bg-background border border-primary rounded-full cursor-move"
                    style={{ top: '-20px', left: '50%', transform: 'translateX(-50%)' }}
                    onMouseDown={handleRotateStart}
                  >
                    <RotateCcw className="w-3 h-3 m-1" />
                  </div>
                </>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  )
})

const Minimap = React.memo(({ shapes, connections, zoom, activeLayer }: { shapes: Shape[], connections: Connection[], zoom: number, activeLayer: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const scale = 0.1
    ctx.scale(scale, scale)

    shapes.forEach(shape => {
      if (shape.layer === activeLayer) {
        ctx.fillStyle = shape.color
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
      }
    })

    connections.forEach(connection => {
      const startShape = shapes.find(s => s.id === connection.startShapeId)
      const endShape = shapes.find(s => s.id === connection.endShapeId)
      if (startShape && endShape && startShape.layer === activeLayer && endShape.layer === activeLayer) {
        ctx.beginPath()
        ctx.moveTo(startShape.x + startShape.width / 2, startShape.y + startShape.height / 2)
        ctx.lineTo(endShape.x + endShape.width / 2, endShape.y + endShape.height / 2)
        ctx.strokeStyle = connection.color
        ctx.stroke()
      }
    })

    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }, [shapes, connections, activeLayer])

  return (
    <div className="absolute bottom-4 right-4 border border-border bg-background p-2">
      <canvas ref={canvasRef} width={200} height={150} />
    </div>
  )
})

const HistoryPanel = React.memo(({ history, currentIndex, onRestoreHistory }: {
  history: HistoryEntry[]
  currentIndex: number
  onRestoreHistory: (index: number) => void
}) => (
  <div className="absolute top-16 right-4 w-64 bg-background border border-border rounded-lg shadow-lg p-4">
    <h3 className="text-lg font-semibold mb-2">History</h3>
    <ScrollArea className="h-64">
      {history.map((entry, index) => (
        <div
          key={index}
          className={`p-2 cursor-pointer ${index === currentIndex ? 'bg-accent' : 'hover:bg-accent'}`}
          onClick={() => onRestoreHistory(index)}
        >
          {entry.action}
        </div>
      ))}
    </ScrollArea>
  </div>
))

const ShapeLibrary = React.memo(({ onSelectLibraryItem }: { onSelectLibraryItem: (item: string) => void }) => {
  const libraryItems = [
    { name: 'Arrow', icon: ArrowUpRight },
    { name: 'Cloud', icon: Cloud },
    { name: 'Database', icon: Database },
    { name: 'File', icon: File },
    { name: 'Folder', icon: Folder },
    { name: 'Globe', icon: Globe },
    { name: 'Heart', icon: Heart },
    { name: 'Image', icon: Image },
    { name: 'Lock', icon: Lock },
    { name: 'Mail', icon: Mail },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'Phone', icon: Phone },
    { name: 'Settings', icon: Settings },
    { name: 'User', icon: User },
    { name: 'Video', icon: Video },
  ]

  return (
    <div className="absolute top-16 left-16 w-64 bg-background border border-border rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Shape Library</h3>
      <ScrollArea className="h-64">
        <div className="grid grid-cols-3 gap-2">
          {libraryItems.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              className="w-full h-16 flex flex-col items-center justify-center"
              onClick={() => onSelectLibraryItem(item.name)}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})

export default function Component() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedShapes, setSelectedShapes] = useState<string[]>([])
  const [selectedConnections, setSelectedConnections] = useState<string[]>([])
  const [tool, setTool] = useState<string>('select')
  const [color, setColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(16)
  const [fontWeight, setFontWeight] = useState('normal')
  const [fontStyle, setFontStyle] = useState('normal')
  const [textDecoration, setTextDecoration] = useState('none')
  const [textAlign, setTextAlign] = useState('left')
  const [zoom, setZoom] = useState(100)
  const [gridEnabled, setGridEnabled] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [layers, setLayers] = useState<string[]>(['Layer 1'])
  const [activeLayer, setActiveLayer] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([
    { key: 'v', ctrl: false, shift: false, alt: false, action: 'select' },
    { key: 'r', ctrl: false, shift: false, alt: false, action: 'rectangle' },
    { key: 'e', ctrl: false, shift: false, alt: false, action: 'ellipse' },
    { key: 't', ctrl: false, shift: false, alt: false, action: 'triangle' },
    { key: 'h', ctrl: false, shift: false, alt: false, action: 'hexagon' },
    { key: 's', ctrl: false, shift: false, alt: false, action: 'star' },
    { key: 'x', ctrl: false, shift: false, alt: false, action: 'text' },
    { key: 'n', ctrl: false, shift: false, alt: false, action: 'sticky' },
    { key: 'c', ctrl: false, shift: false, alt: false, action: 'connection' },
    { key: 'f', ctrl: false, shift: false, alt: false, action: 'freehand' },
    { key: 'd', ctrl: false, shift: false, alt: false, action: 'eraser' },
    { key: 'i', ctrl: false, shift: false, alt: false, action: 'eyedropper' },
    { key: 'l', ctrl: false, shift: false, alt: false, action: 'library' },
  ])

  const handleToolChange = useCallback((newTool: string) => {
    setTool(newTool)
    addToHistory(`Changed tool to ${newTool}`)
  }, [])

  const handleSave = useCallback(() => {
    const projectData = JSON.stringify({ shapes, connections, layers })
    localStorage.setItem('loomiaProject', projectData)
    console.log('Project saved')
    addToHistory('Saved project')
  }, [shapes, connections, layers])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const { shapes: prevShapes, connections: prevConnections } = history[newIndex]
      setShapes(prevShapes)
      setConnections(prevConnections)
      setHistoryIndex(newIndex)
      addToHistory('Undo')
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const { shapes: nextShapes, connections: nextConnections } = history[newIndex]
      setShapes(nextShapes)
      setConnections(nextConnections)
      setHistoryIndex(newIndex)
      addToHistory('Redo')
    }
  }, [history, historyIndex])

  const handleExport = useCallback(() => {
    const projectData = JSON.stringify({ shapes, connections, layers })
    const blob = new Blob([projectData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'loomia_project.json'
    a.click()
    URL.revokeObjectURL(url)
    addToHistory('Exported project')
  }, [shapes, connections, layers])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          try {
            const { shapes: importedShapes, connections: importedConnections, layers: importedLayers } = JSON.parse(content)
            setShapes(importedShapes)
            setConnections(importedConnections)
            setLayers(importedLayers || ['Layer 1'])
            console.log('Project imported')
            addToHistory('Imported project')
          } catch (error) {
            console.error('Error importing project:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  const handleCollaborate = useCallback(() => {
    console.log('Collaboration feature not implemented')
    // Here you would implement real-time collaboration logic
    addToHistory('Started collaboration')
  }, [])

  const handleEyeDropper = useCallback(() => {
    if ('EyeDropper' in window) {
      const eyeDropper = new (window as any).EyeDropper()
      eyeDropper.open().then((result: { sRGBHex: string }) => {
        setColor(result.sRGBHex)
        addToHistory(`Changed color to ${result.sRGBHex}`)
      }).catch((error: any) => {
        console.log('Eye dropper failed:', error)
      })
    } else {
      console.log('EyeDropper API not supported')
    }
  }, [])

  const addToHistory = useCallback((action: string) => {
    const newEntry: HistoryEntry = { shapes, connections, action }
    setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), newEntry])
    setHistoryIndex(prevIndex => prevIndex + 1)
  }, [shapes, connections, historyIndex])

  const handleRestoreHistory = useCallback((index: number) => {
    const { shapes: restoredShapes, connections: restoredConnections } = history[index]
    setShapes(restoredShapes)
    setConnections(restoredConnections)
    setHistoryIndex(index)
    addToHistory(`Restored to ${history[index].action}`)
  }, [history])

  const handleStartPresentation = useCallback(() => {
    // Implement presentation mode logic here
    console.log('Starting presentation mode')
    addToHistory('Started presentation mode')
  }, [])

  const handleSelectLibraryItem = useCallback((item: string) => {
    setShapes(prevShapes => [
      ...prevShapes,
      {
        id: generateId(),
        type: 'library',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
        color,
        zIndex: prevShapes.length,
        locked: false,
        visible: true,
        layer: activeLayer,
        libraryItem: item
      }
    ])
    setTool('select')
    setShowLibrary(false)
    addToHistory(`Added library item: ${item}`)
  }, [color, activeLayer])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = shortcuts.find(s =>
        s.key === e.key &&
        s.ctrl === e.ctrlKey &&
        s.shift === e.shiftKey &&
        s.alt === e.altKey
      )

      if (shortcut) {
        e.preventDefault()
        switch (shortcut.action) {
          case 'select':
          case 'rectangle':
          case 'ellipse':
          case 'triangle':
          case 'hexagon':
          case 'star':
          case 'text':
          case 'sticky':
          case 'connection':
          case 'freehand':
          case 'eraser':
            setTool(shortcut.action)
            break
          case 'eyedropper':
            handleEyeDropper()
            break
          case 'library':
            setShowLibrary(!showLibrary)
            break
        }
      } else if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault()
            handleUndo()
            break
          case 'y':
            e.preventDefault()
            handleRedo()
            break
          case 's':
            e.preventDefault()
            handleSave()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo, handleSave, handleEyeDropper, shortcuts, showLibrary])

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      <MemoizedHeader
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
        onImport={handleImport}
        onCollaborate={handleCollaborate}
        onShowHistory={() => setShowHistory(!showHistory)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onStartPresentation={handleStartPresentation}
      />
      <div className="flex flex-1 overflow-hidden">
        <MemoizedToolbar tool={tool} setTool={handleToolChange} onEyeDropper={handleEyeDropper} />
        <Canvas
          gridEnabled={gridEnabled}
          snapToGrid={snapToGrid}
          zoom={zoom}
          shapes={shapes}
          setShapes={setShapes}
          connections={connections}
          setConnections={setConnections}
          tool={tool}
          setTool={setTool}
          color={color}
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          selectedConnections={selectedConnections}
          setSelectedConnections={setSelectedConnections}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          textDecoration={textDecoration}
          textAlign={textAlign}
          activeLayer={activeLayer}
        />
        <MemoizedRightSidebar
          shapes={shapes}
          connections={connections}
          selectedShapes={selectedShapes}
          selectedConnections={selectedConnections}
          setSelectedShapes={setSelectedShapes}
          setSelectedConnections={setSelectedConnections}
          setShapes={setShapes}
          setConnections={setConnections}
          zoom={zoom}
          setZoom={setZoom}
          gridEnabled={gridEnabled}
          setGridEnabled={setGridEnabled}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
        />
      </div>
      <MemoizedBottomToolbar
        color={color}
        setColor={setColor}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontWeight={fontWeight}
        setFontWeight={setFontWeight}
        fontStyle={fontStyle}
        setFontStyle={setFontStyle}
        textDecoration={textDecoration}
        setTextDecoration={setTextDecoration}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
      />
      <Minimap shapes={shapes} connections={connections} zoom={zoom} activeLayer={activeLayer} />
      {showHistory && (
        <HistoryPanel
          history={history}
          currentIndex={historyIndex}
          onRestoreHistory={handleRestoreHistory}
        />
      )}
      {showLibrary && (
        <ShapeLibrary onSelectLibraryItem={handleSelectLibraryItem} />
      )}
    </div>
  )
}
