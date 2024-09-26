// stores/shapeStore.ts
import create from 'zustand'
import { Shape, IShape, Point } from '../types'

interface ShapeState {
  shapes: Shape[]
  addShape: (shape: IShape) => void
  updateShape: (id: string, changes: Partial<IShape>) => void
  deleteShape: (id: string) => void
  moveShape: (id: string, delta: Point) => void
  resizeShape: (id: string, newSize: Point) => void
  rotateShape: (id: string, angle: number) => void
}

export const useShapeStore = create<ShapeState>((set) => ({
  shapes: [],
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, Shape.fromObject(shape)] })),
  updateShape: (id, changes) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? { ...shape, ...changes } : shape)
  })),
  deleteShape: (id) => set((state) => ({ shapes: state.shapes.filter(shape => shape.id !== id) })),
  moveShape: (id, delta) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? shape.move(delta) : shape)
  })),
  resizeShape: (id, newSize) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? shape.resize(newSize) : shape)
  })),
  rotateShape: (id, angle) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? shape.rotate(angle) : shape)
  })),
}))

// stores/connectionStore.ts
import create from 'zustand'
import { Connection, IConnection, Point } from '../types'

interface ConnectionState {
  connections: Connection[]
  addConnection: (connection: IConnection) => void
  updateConnection: (id: string, changes: Partial<IConnection>) => void
  deleteConnection: (id: string) => void
  updateConnectionEndpoints: (id: string, startPoint: Point, endPoint: Point) => void
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  connections: [],
  addConnection: (connection) => set((state) => ({ connections: [...state.connections, Connection.fromObject(connection)] })),
  updateConnection: (id, changes) => set((state) => ({
    connections: state.connections.map(conn => conn.id === id ? { ...conn, ...changes } : conn)
  })),
  deleteConnection: (id) => set((state) => ({ connections: state.connections.filter(conn => conn.id !== id) })),
  updateConnectionEndpoints: (id, startPoint, endPoint) => set((state) => ({
    connections: state.connections.map(conn => conn.id === id ? conn.updateEndpoints(startPoint, endPoint) : conn)
  })),
}))

// stores/toolStore.ts
import create from 'zustand'
import { IShapeStyle } from '../types'

interface ToolState {
  currentTool: string
  currentStyle: IShapeStyle
  setCurrentTool: (tool: string) => void
  updateCurrentStyle: (changes: Partial<IShapeStyle>) => void
}

export const useToolStore = create<ToolState>((set) => ({
  currentTool: 'select',
  currentStyle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left'
  },
  setCurrentTool: (tool) => set({ currentTool: tool }),
  updateCurrentStyle: (changes) => set((state) => ({ currentStyle: { ...state.currentStyle, ...changes } })),
}))

// stores/layerStore.ts
import create from 'zustand'

interface LayerState {
  layers: string[]
  activeLayer: number
  addLayer: (name: string) => void
  removeLayer: (index: number) => void
  setActiveLayer: (index: number) => void
}

export const useLayerStore = create<LayerState>((set) => ({
  layers: ['Layer 1'],
  activeLayer: 0,
  addLayer: (name) => set((state) => ({ layers: [...state.layers, name] })),
  removeLayer: (index) => set((state) => ({
    layers: state.layers.filter((_, i) => i !== index),
    activeLayer: state.activeLayer >= index ? Math.max(0, state.activeLayer - 1) : state.activeLayer
  })),
  setActiveLayer: (index) => set({ activeLayer: index }),
}))

// stores/selectionStore.ts
import create from 'zustand'

interface SelectionState {
  selectedIds: string[]
  setSelection: (ids: string[]) => void
  clearSelection: () => void
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: [],
  setSelection: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}))

// stores/canvasSettingsStore.ts
import create from 'zustand'

interface CanvasSettingsState {
  zoom: number
  gridEnabled: boolean
  snapToGrid: boolean
  setZoom: (zoom: number) => void
  setGridEnabled: (enabled: boolean) => void
  setSnapToGrid: (enabled: boolean) => void
}

export const useCanvasSettingsStore = create<CanvasSettingsState>((set) => ({
  zoom: 100,
  gridEnabled: true,
  snapToGrid: false,
  setZoom: (zoom) => set({ zoom }),
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  setSnapToGrid: (enabled) => set({ snapToGrid: enabled }),
}))

// components/Header.tsx
import React from 'react'
import { useToolStore, useShapeStore, useConnectionStore, useSelectionStore } from '../stores'
import { IconButton, DropdownMenu } from './ui'

export const Header: React.FC = () => {
  const { setCurrentTool } = useToolStore()
  const { shapes } = useShapeStore()
  const { connections } = useConnectionStore()
  const { clearSelection } = useSelectionStore()

  const handleSave = () => {
    const projectData = JSON.stringify({ shapes, connections })
    localStorage.setItem('whiteboardProject', projectData)
  }

  const handleUndo = () => {
    // Implement undo logic
  }

  const handleRedo = () => {
    // Implement redo logic
  }

  return (
    <header className="flex items-center justify-between p-2 border-b bg-background">
      <div className="flex items-center space-x-2">
        {/* Add logo and title here */}
      </div>
      <div className="flex items-center space-x-2">
        <IconButton icon="Undo2" onClick={handleUndo} tooltip="Undo (Ctrl+Z)" />
        <IconButton icon="Redo2" onClick={handleRedo} tooltip="Redo (Ctrl+Y)" />
        <DropdownMenu
          items={[
            { icon: 'Save', label: 'Save', onClick: handleSave },
            { icon: 'Download', label: 'Export', onClick: () => {} },
            { icon: 'Upload', label: 'Import', onClick: () => {} },
            { icon: 'Users', label: 'Collaborate', onClick: () => {} },
            { icon: 'History', label: 'History', onClick: () => {} },
            { icon: 'Share2', label: 'Share', onClick: () => {} },
            { icon: 'Presentation', label: 'Start Presentation', onClick: () => {} },
          ]}
        />
      </div>
    </header>
  )
}

// components/Toolbar.tsx
import React from 'react'
import { useToolStore } from '../stores'
import { IconButton } from './ui'

export const Toolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useToolStore()

  const tools = [
    { icon: 'MousePointer2', name: 'select', tooltip: "Select tool (V)" },
    { icon: 'Square', name: 'rectangle', tooltip: "Rectangle tool (R)" },
    { icon: 'Circle', name: 'ellipse', tooltip: "Ellipse tool (E)" },
    { icon: 'Triangle', name: 'triangle', tooltip: "Triangle tool (T)" },
    { icon: 'Type', name: 'text', tooltip: "Text tool (X)" },
    { icon: 'Pen', name: 'freehand', tooltip: "Freehand tool (F)" },
    { icon: 'ArrowUpRight', name: 'connection', tooltip: "Connection tool (C)" },
  ]

  return (
    <div className="flex flex-col items-center p-2 space-y-2 border-r bg-background">
      {tools.map((tool) => (
        <IconButton
          key={tool.name}
          icon={tool.icon}
          onClick={() => setCurrentTool(tool.name)}
          tooltip={tool.tooltip}
          variant={currentTool === tool.name ? 'secondary' : 'ghost'}
        />
      ))}
    </div>
  )
}

// components/Canvas.tsx
import React, { useRef, useCallback } from 'react'
import { useShapeStore, useConnectionStore, useToolStore, useLayerStore, useSelectionStore, useCanvasSettingsStore } from '../stores'
import { Point } from '../types'

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { shapes, addShape, updateShape, moveShape } = useShapeStore()
  const { connections, addConnection, updateConnectionEndpoints } = useConnectionStore()
  const { currentTool, currentStyle } = useToolStore()
  const { activeLayer } = useLayerStore()
  const { selectedIds, setSelection, clearSelection } = useSelectionStore()
  const { zoom, gridEnabled, snapToGrid } = useCanvasSettingsStore()

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100)
    const y = (e.clientY - rect.top) / (zoom / 100)
    const point = new Point(x, y)

    if (currentTool === 'select') {
      const clickedShape = shapes.find(shape => shape.isPointInside(point) && shape.layer === activeLayer)
      if (clickedShape) {
        setSelection([clickedShape.id])
      } else {
        clearSelection()
      }
    } else if (currentTool !== 'select' && currentTool !== 'connection') {
      addShape({
        type: currentTool,
        position: point,
        size: new Point(0, 0),
        rotation: 0,
        style: currentStyle,
        layer: activeLayer,
      })
    }
  }, [currentTool, shapes, zoom, activeLayer, addShape, setSelection, clearSelection, currentStyle])

  // Implement handleMouseMove and handleMouseUp...

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden"
      style={{
        backgroundImage: gridEnabled ? 'radial-gradient(circle, #d7d7d7 1px, transparent 1px)' : 'none',
        backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
        backgroundColor: 'var(--background)',
      }}
      onMouseDown={handleMouseDown}
      // Add onMouseMove and onMouseUp handlers
    >
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: '0 0' }}>
        {/* Render shapes and connections here */}
      </div>
    </div>
  )
}

// components/BottomToolbar.tsx
import React from 'react'
import { useToolStore } from '../stores'
import { ColorPicker, FontSizeInput, TextFormatButton } from './ui'

export const BottomToolbar: React.FC = () => {
  const { currentStyle, updateCurrentStyle } = useToolStore()

  return (
    <div className="flex items-center justify-between p-2 border-t bg-background">
      <div className="flex items-center space-x-2">
        <ColorPicker
          color={currentStyle.color}
          onChange={(color) => updateCurrentStyle({ color })}
        />
        <FontSizeInput
          fontSize={currentStyle.fontSize || 16}
          onChange={(fontSize) => updateCurrentStyle({ fontSize })}
        />
        <TextFormatButton
          icon="Bold"
          isActive={currentStyle.fontWeight === 'bold'}
          onClick={() => updateCurrentStyle({ fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold' })}
          tooltip="Bold (Ctrl+B)"
        />
        {/* Add more text formatting buttons */}
      </div>
    </div>
  )
}

// components/Whiteboard.tsx
import React from 'react'
import { Header } from './Header'
import { Toolbar } from './Toolbar'
import { Canvas } from './Canvas'
import { BottomToolbar } from './BottomToolbar'

export const Whiteboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <Canvas />
        {/* Add RightSidebar component here if needed */}
      </div>
      <BottomToolbar />
    </div>
  )
}

// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react'
import { useToolStore, useShapeStore, useSelectionStore } from '../stores'

export const useKeyboardShortcuts = () => {
  const { setCurrentTool } = useToolStore()
  const { deleteShape } = useShapeStore()
  const { selectedIds, clearSelection } = useSelectionStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault()
            // Implement undo
            break
          case 'y':
            e.preventDefault()
            // Implement redo
            break
          case 's':
            e.preventDefault()
            // Implement save
            break
        }
      } else {
        switch (e.key) {
          case 'v':
            setCurrentTool('select')
            break
          case 'r':
            setCurrentTool('rectangle')
            break
          case 'e':
            setCurrentTool('ellipse')
            break
          case 't':
            setCurrentTool('text')
            break
          case 'Delete':
          case 'Backspace':
            selectedIds.forEach(deleteShape)
            clearSelection()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setCurrentTool, deleteShape, selectedIds, clearSelection])
}

// components/RightSidebar.tsx
import React from 'react'
import { useLayerStore, useCanvasSettingsStore } from '../stores'
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, Slider, Switch } from './ui'

export const RightSidebar: React.FC = () => {
  const { layers, activeLayer, addLayer, removeLayer, setActiveLayer } = useLayerStore()
  const { zoom, gridEnabled, snapToGrid, setZoom, setGridEnabled, setSnapToGrid } = useCanvasSettingsStore()

  return (
    <div className="w-64 border-l bg-background">
      <Tabs defaultValue="layers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="layers">
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
                  removeLayer(index)
                }}
              >
                <Icon icon="Trash2" />
              </Button>
            </div>
          ))}
          <Button className="w-full mt-2" onClick={() => addLayer(`Layer ${layers.length + 1}`)}>
            Add Layer
          </Button>
        </TabsContent>
        <TabsContent value="settings">
          <div className="p-4 space-y-4">
            <div>
              <label>Zoom: {zoom}%</label>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={10}
                max={200}
                step={10}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Grid</span>
              <Switch checked={gridEnabled} onCheckedChange={setGridEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <span>Snap to Grid</span>
              <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// hooks/useShapeOperations.ts
import { useCallback } from 'react'
import { useShapeStore, useSelectionStore } from '../stores'
import { Point } from '../types'

export const useShapeOperations = () => {
  const { shapes, updateShape } = useShapeStore()
  const { selectedIds } = useSelectionStore()

  const moveSelectedShapes = useCallback((delta: Point) => {
    selectedIds.forEach(id => {
      const shape = shapes.find(s => s.id === id)
      if (shape) {
        updateShape(id, { position: shape.position.add(delta) })
      }
    })
  }, [shapes, selectedIds, updateShape])

  const resizeSelectedShape = useCallback((newSize: Point) => {
    if (selectedIds.length === 1) {
      updateShape(selectedIds[0], { size: newSize })
    }
  }, [selectedIds, updateShape])

  const rotateSelectedShape = useCallback((angle: number) => {
    if (selectedIds.length === 1) {
      const shape = shapes.find(s => s.id === selectedIds[0])
      if (shape) {
        updateShape(selectedIds[0], { rotation: (shape.rotation + angle) % 360 })
      }
    }
  }, [shapes, selectedIds, updateShape])

  return { moveSelectedShapes, resizeSelectedShape, rotateSelectedShape }
}

// hooks/useConnectionOperations.ts
import { useCallback } from 'react'
import { useConnectionStore, useShapeStore } from '../stores'
import { Point } from '../types'

export const useConnectionOperations = () => {
  const { connections, addConnection, updateConnectionEndpoints } = useConnectionStore()
  const { shapes } = useShapeStore()

  const startConnection = useCallback((startShapeId: string, startPoint: Point) => {
    const newConnection = {
      id: `connection-${Date.now()}`,
      startShapeId,
      endShapeId: '',
      startPoint,
      endPoint: startPoint,
      color: 'black',
      zIndex: connections.length,
      layer: shapes.find(s => s.id === startShapeId)?.layer || 0,
    }
    addConnection(newConnection)
    return newConnection.id
  }, [connections, shapes, addConnection])

  const updateConnection = useCallback((connectionId: string, endPoint: Point) => {
    updateConnectionEndpoints(connectionId, null, endPoint)
  }, [updateConnectionEndpoints])

  const finishConnection = useCallback((connectionId: string, endShapeId: string, endPoint: Point) => {
    updateConnectionEndpoints(connectionId, null, endPoint)
    // Update the endShapeId
    // This would require adding a new method to the connectionStore
  }, [updateConnectionEndpoints])

  return { startConnection, updateConnection, finishConnection }
}

// components/Shape.tsx
import React from 'react'
import { Shape as ShapeType } from '../types'

interface ShapeProps {
  shape: ShapeType
  isSelected: boolean
  onSelect: () => void
}

export const Shape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect }) => {
  const renderShape = () => {
    switch (shape.type) {
      case 'rectangle':
        return <rect width={shape.size.x} height={shape.size.y} fill={shape.style.color} />
      case 'ellipse':
        return <ellipse cx={shape.size.x / 2} cy={shape.size.y / 2} rx={shape.size.x / 2} ry={shape.size.y / 2} fill={shape.style.color} />
      case 'text':
        return (
          <text
            x={0}
            y={shape.style.fontSize}
            fontSize={shape.style.fontSize}
            fontWeight={shape.style.fontWeight}
            fontStyle={shape.style.fontStyle}
            textDecoration={shape.style.textDecoration}
            fill={shape.style.color}
          >
            {shape.content}
          </text>
        )
      // Add cases for other shape types
      default:
        return null
    }
  }

  return (
    <g
      transform={`translate(${shape.position.x},${shape.position.y}) rotate(${shape.rotation})`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      {renderShape()}
      {isSelected && (
        <rect
          x={-2}
          y={-2}
          width={shape.size.x + 4}
          height={shape.size.y + 4}
          fill="none"
          stroke="blue"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}
    </g>
  )
}

// components/Connection.tsx
import React from 'react'
import { Connection as ConnectionType } from '../types'

interface ConnectionProps {
  connection: ConnectionType
  isSelected: boolean
  onSelect: () => void
}

export const Connection: React.FC<ConnectionProps> = ({ connection, isSelected, onSelect }) => {
  return (
    <line
      x1={connection.startPoint.x}
      y1={connection.startPoint.y}
      x2={connection.endPoint.x}
      y2={connection.endPoint.y}
      stroke={connection.color}
      strokeWidth={isSelected ? 3 : 2}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    />
  )
}

// Updating Canvas.tsx to use Shape and Connection components
import React, { useRef, useCallback } from 'react'
import { useShapeStore, useConnectionStore, useToolStore, useLayerStore, useSelectionStore, useCanvasSettingsStore } from '../stores'
import { useShapeOperations, useConnectionOperations } from '../hooks'
import { Shape } from './Shape'
import { Connection } from './Connection'
import { Point } from '../types'

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { shapes, addShape } = useShapeStore()
  const { connections } = useConnectionStore()
  const { currentTool, currentStyle } = useToolStore()
  const { activeLayer } = useLayerStore()
  const { selectedIds, setSelection, clearSelection } = useSelectionStore()
  const { zoom, gridEnabled, snapToGrid } = useCanvasSettingsStore()
  const { moveSelectedShapes, resizeSelectedShape, rotateSelectedShape } = useShapeOperations()
  const { startConnection, updateConnection, finishConnection } = useConnectionOperations()

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100)
    const y = (e.clientY - rect.top) / (zoom / 100)
    const point = new Point(x, y)

    if (currentTool === 'select') {
      const clickedShape = shapes.find(shape => shape.isPointInside(point) && shape.layer === activeLayer)
      if (clickedShape) {
        setSelection([clickedShape.id])
      } else {
        clearSelection()
      }
    } else if (currentTool === 'connection') {
      const startShape = shapes.find(shape => shape.isPointInside(point) && shape.layer === activeLayer)
      if (startShape) {
        const connectionId = startConnection(startShape.id, point)
        // Set up mouse move and mouse up handlers for dragging the connection
      }
    } else {
      const newShape = {
        id: `shape-${Date.now()}`,
        type: currentTool,
        position: point,
        size: new Point(0, 0),
        rotation: 0,
        style: currentStyle,
        layer: activeLayer,
      }
      addShape(newShape)
      // Set up mouse move and mouse up handlers for drawing the shape
    }
  }, [currentTool, shapes, zoom, activeLayer, addShape, setSelection, clearSelection, currentStyle, startConnection])

  // Implement handleMouseMove and handleMouseUp...

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden"
      style={{
        backgroundImage: gridEnabled ? 'radial-gradient(circle, #d7d7d7 1px, transparent 1px)' : 'none',
        backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
        backgroundColor: 'var(--background)',
      }}
      onMouseDown={handleMouseDown}
      // Add onMouseMove and onMouseUp handlers
    >
      <svg width="100%" height="100%" style={{ transform: `scale(${zoom / 100})`, transformOrigin: '0 0' }}>
        {connections.map(connection => (
          <Connection
            key={connection.id}
            connection={connection}
            isSelected={selectedIds.includes(connection.id)}
            onSelect={() => setSelection([connection.id])}
          />
        ))}
        {shapes.map(shape => (
          <Shape
            key={shape.id}
            shape={shape}
            isSelected={selectedIds.includes(shape.id)}
            onSelect={() => setSelection([shape.id])}
          />
        ))}
      </svg>
    </div>
  )
}

// Updating Whiteboard.tsx to include RightSidebar and use hooks
import React from 'react'
import { Header } from './Header'
import { Toolbar } from './Toolbar'
import { Canvas } from './Canvas'
import { BottomToolbar } from './BottomToolbar'
import { RightSidebar } from './RightSidebar'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

export const Whiteboard: React.FC = () => {
  useKeyboardShortcuts()

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <Canvas />
        <RightSidebar />
      </div>
      <BottomToolbar />
    </div>
  )
}

export default Whiteboard

// stores/historyStore.ts
import create from 'zustand'
import { WhiteboardState } from '../types'

interface HistoryState {
  past: WhiteboardState[]
  future: WhiteboardState[]
  pushState: (state: WhiteboardState) => void
  undo: () => WhiteboardState | null
  redo: () => WhiteboardState | null
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  pushState: (state) => set((prevState) => ({
    past: [...prevState.past, state],
    future: [],
  })),
  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return null
    const newPresent = past[past.length - 1]
    set({
      past: past.slice(0, past.length - 1),
      future: [newPresent, ...future],
    })
    return newPresent
  },
  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return null
    const newPresent = future[0]
    set({
      past: [...past, newPresent],
      future: future.slice(1),
    })
    return newPresent
  },
}))

// hooks/useHistory.ts
import { useCallback } from 'react'
import { useHistoryStore } from '../stores/historyStore'
import { useShapeStore, useConnectionStore, useLayerStore, useSelectionStore } from '../stores'
import { WhiteboardState } from '../types'

export const useHistory = () => {
  const { pushState, undo: historyUndo, redo: historyRedo } = useHistoryStore()
  const { shapes, setShapes } = useShapeStore()
  const { connections, setConnections } = useConnectionStore()
  const { layers, activeLayer, setLayers, setActiveLayer } = useLayerStore()
  const { selectedIds, setSelection } = useSelectionStore()

  const saveState = useCallback(() => {
    const currentState: WhiteboardState = {
      shapes,
      connections,
      layers,
      activeLayer,
      selectedIds,
    }
    pushState(currentState)
  }, [shapes, connections, layers, activeLayer, selectedIds, pushState])

  const undo = useCallback(() => {
    const previousState = historyUndo()
    if (previousState) {
      setShapes(previousState.shapes)
      setConnections(previousState.connections)
      setLayers(previousState.layers)
      setActiveLayer(previousState.activeLayer)
      setSelection(previousState.selectedIds)
    }
  }, [historyUndo, setShapes, setConnections, setLayers, setActiveLayer, setSelection])

  const redo = useCallback(() => {
    const nextState = historyRedo()
    if (nextState) {
      setShapes(nextState.shapes)
      setConnections(nextState.connections)
      setLayers(nextState.layers)
      setActiveLayer(nextState.activeLayer)
      setSelection(nextState.selectedIds)
    }
  }, [historyRedo, setShapes, setConnections, setLayers, setActiveLayer, setSelection])

  return { saveState, undo, redo }
}

// components/ShapeResizeHandles.tsx
import React from 'react'
import { Point } from '../types'

interface ShapeResizeHandlesProps {
  position: Point
  size: Point
  onResize: (newSize: Point, anchor: Point) => void
}

export const ShapeResizeHandles: React.FC<ShapeResizeHandlesProps> = ({ position, size, onResize }) => {
  const handleResize = (dx: number, dy: number, anchor: Point) => {
    const newSize = new Point(size.x + dx, size.y + dy)
    onResize(newSize, anchor)
  }

  return (
    <>
      <circle
        cx={position.x}
        cy={position.y}
        r={5}
        fill="blue"
        onMouseDown={(e) => {
          // Set up mouse move handler for top-left resize
        }}
      />
      <circle
        cx={position.x + size.x}
        cy={position.y}
        r={5}
        fill="blue"
        onMouseDown={(e) => {
          // Set up mouse move handler for top-right resize
        }}
      />
      <circle
        cx={position.x}
        cy={position.y + size.y}
        r={5}
        fill="blue"
        onMouseDown={(e) => {
          // Set up mouse move handler for bottom-left resize
        }}
      />
      <circle
        cx={position.x + size.x}
        cy={position.y + size.y}
        r={5}
        fill="blue"
        onMouseDown={(e) => {
          // Set up mouse move handler for bottom-right resize
        }}
      />
    </>
  )
}

// Updating Shape.tsx to include resize handles
import React from 'react'
import { Shape as ShapeType } from '../types'
import { ShapeResizeHandles } from './ShapeResizeHandles'

interface ShapeProps {
  shape: ShapeType
  isSelected: boolean
  onSelect: () => void
  onResize: (newSize: Point, anchor: Point) => void
}

export const Shape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect, onResize }) => {
  // ... previous renderShape logic

  return (
    <g
      transform={`translate(${shape.position.x},${shape.position.y}) rotate(${shape.rotation})`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      {renderShape()}
      {isSelected && (
        <>
          <rect
            x={-2}
            y={-2}
            width={shape.size.x + 4}
            height={shape.size.y + 4}
            fill="none"
            stroke="blue"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
          <ShapeResizeHandles
            position={new Point(0, 0)}
            size={shape.size}
            onResize={onResize}
          />
        </>
      )}
    </g>
  )
}

// hooks/useDrag.ts
import { useState, useCallback } from 'react'
import { Point } from '../types'

export const useDrag = (
  onDragStart: (point: Point) => void,
  onDrag: (delta: Point) => void,
  onDragEnd: () => void
) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    const point = new Point(e.clientX, e.clientY)
    setStartPoint(point)
    onDragStart(point)
  }, [onDragStart])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !startPoint) return
    const currentPoint = new Point(e.clientX, e.clientY)
    const delta = currentPoint.subtract(startPoint)
    onDrag(delta)
  }, [isDragging, startPoint, onDrag])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setStartPoint(null)
    onDragEnd()
  }, [onDragEnd])

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}

// Updating Canvas.tsx to use useDrag hook
import React, { useRef, useCallback } from 'react'
import { useShapeStore, useConnectionStore, useToolStore, useLayerStore, useSelectionStore, useCanvasSettingsStore } from '../stores'
import { useShapeOperations, useConnectionOperations, useHistory, useDrag } from '../hooks'
import { Shape } from './Shape'
import { Connection } from './Connection'
import { Point } from '../types'

export const Canvas: React.FC = () => {
  // ... previous imports and hooks

  const { saveState } = useHistory()

  const handleDragStart = useCallback((point: Point) => {
    // Logic for starting a drag operation
  }, [/* dependencies */])

  const handleDrag = useCallback((delta: Point) => {
    if (currentTool === 'select' && selectedIds.length > 0) {
      moveSelectedShapes(delta)
    } else if (currentTool === 'connection') {
      // Update the current connection being drawn
    }
  }, [currentTool, selectedIds, moveSelectedShapes])

  const handleDragEnd = useCallback(() => {
    saveState()
  }, [saveState])

  const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp } = useDrag(
    handleDragStart,
    handleDrag,
    handleDragEnd
  )

  // ... rest of the component logic

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 overflow-hidden"
      style={{
        backgroundImage: gridEnabled ? 'radial-gradient(circle, #d7d7d7 1px, transparent 1px)' : 'none',
        backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
        backgroundColor: 'var(--background)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ... rest of the component JSX */}
    </div>
  )
}

// tests/Shape.test.tsx
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Shape } from '../components/Shape'
import { Point } from '../types'

describe('Shape component', () => {
  const mockShape = {
    id: '1',
    type: 'rectangle' as const,
    position: new Point(10, 10),
    size: new Point(100, 50),
    rotation: 0,
    style: { color: 'red' },
    layer: 0,
  }

  it('renders correctly', () => {
    const { container } = render(
      <svg>
        <Shape shape={mockShape} isSelected={false} onSelect={() => {}} onResize={() => {}} />
      </svg>
    )
    expect(container.querySelector('rect')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn()
    const { container } = render(
      <svg>
        <Shape shape={mockShape} isSelected={false} onSelect={onSelect} onResize={() => {}} />
      </svg>
    )
    fireEvent.click(container.firstChild!)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('shows resize handles when selected', () => {
    const { container } = render(
      <svg>
        <Shape shape={mockShape} isSelected={true} onSelect={() => {}} onResize={() => {}} />
      </svg>
    )
    expect(container.querySelectorAll('circle').length).toBe(4) // Four resize handles
  })
})

// tests/useHistory.test.ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useHistory } from '../hooks/useHistory'
import { useShapeStore, useConnectionStore, useLayerStore, useSelectionStore } from '../stores'

jest.mock('../stores/shapeStore')
jest.mock('../stores/connectionStore')
jest.mock('../stores/layerStore')
jest.mock('../stores/selectionStore')

describe('useHistory hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saves state correctly', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.saveState()
    })
    expect(useHistoryStore.getState().past.length).toBe(1)
  })

  it('undoes correctly', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.saveState()
      result.current.undo()
    })
    expect(useHistoryStore.getState().past.length).toBe(0)
    expect(useHistoryStore.getState().future.length).toBe(1)
  })

  it('redoes correctly', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.saveState()
      result.current.undo()
      result.current.redo()
    })
    expect(useHistoryStore.getState().past.length).toBe(1)
    expect(useHistoryStore.getState().future.length).toBe(0)
  })
})

// utils/projectSerializer.ts
import { WhiteboardState } from '../types'

export const serializeProject = (state: WhiteboardState): string => {
  return JSON.stringify(state)
}

export const deserializeProject = (serializedState: string): WhiteboardState => {
  const parsed = JSON.parse(serializedState)
  // Add validation and transformation logic here
  return parsed as WhiteboardState
}

// hooks/useProjectExportImport.ts
import { useCallback } from 'react'
import { useShapeStore, useConnectionStore, useLayerStore, useSelectionStore } from '../stores'
import { serializeProject, deserializeProject } from '../utils/projectSerializer'

export const useProjectExportImport = () => {
  const { shapes, setShapes } = useShapeStore()
  const { connections, setConnections } = useConnectionStore()
  const { layers, activeLayer, setLayers, setActiveLayer } = useLayerStore()
  const { selectedIds, setSelection } = useSelectionStore()

  const exportProject = useCallback(() => {
    const state = {
      shapes,
      connections,
      layers,
      activeLayer,
      selectedIds,
    }
    const serialized = serializeProject(state)
    const blob = new Blob([serialized], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'whiteboard_project.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [shapes, connections, layers, activeLayer, selectedIds])

  const importProject = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        const serialized = e.target.result as string
        const state = deserializeProject(serialized)
        setShapes(state.shapes)
        setConnections(state.connections)
        setLayers(state.layers)
        setActiveLayer(state.activeLayer)
        setSelection(state.selectedIds)
      }
    }
    reader.readAsText(file)
  }, [setShapes, setConnections, setLayers, setActiveLayer, setSelection])

  return { exportProject, importProject }
}

// services/realtimeCollaboration.ts
import io from 'socket.io-client'
import { WhiteboardState, Shape, Connection } from '../types'

class RealtimeCollaborationService {
  private socket: SocketIOClient.Socket

  constructor(url: string) {
    this.socket = io(url)
  }

  connect(roomId: string) {
    this.socket.emit('join-room', roomId)
  }

  disconnect() {
    this.socket.disconnect()
  }

  onStateUpdate(callback: (state: WhiteboardState) => void) {
    this.socket.on('state-update', callback)
  }

  onShapeUpdate(callback: (shape: Shape) => void) {
    this.socket.on('shape-update', callback)
  }

  onConnectionUpdate(callback: (connection: Connection) => void) {
    this.socket.on('connection-update', callback)
  }

  emitStateUpdate(state: WhiteboardState) {
    this.socket.emit('state-update', state)
  }

  emitShapeUpdate(shape: Shape) {
    this.socket.emit('shape-update', shape)
  }

  emitConnectionUpdate(connection: Connection) {
    this.socket.emit('connection-update', connection)
  }
}

export const collaborationService = new RealtimeCollaborationService('wss://your-collaboration-server.com')

// hooks/useCollaboration.ts
import { useEffect } from 'react'
import { useShapeStore, useConnectionStore } from '../stores'
import { collaborationService } from '../services/realtimeCollaboration'

export const useCollaboration = (roomId: string) => {
  const { shapes, setShapes, updateShape } = useShapeStore()
  const { connections, setConnections, updateConnection } = useConnectionStore()

  useEffect(() => {
    collaborationService.connect(roomId)

    collaborationService.onStateUpdate((state) => {
      setShapes(state.shapes)
      setConnections(state.connections)
    })

    collaborationService.onShapeUpdate((shape) => {
      updateShape(shape.id, shape)
    })

    collaborationService.onConnectionUpdate((connection) => {
      updateConnection(connection.id, connection)
    })

    return () => {
      collaborationService.disconnect()
    }
  }, [roomId, setShapes, setConnections, updateShape, updateConnection])

  const syncState = () => {
    collaborationService.emitStateUpdate({ shapes, connections })
  }

  const syncShape = (shape: Shape) => {
    collaborationService.emitShapeUpdate(shape)
  }

  const syncConnection = (connection: Connection) => {
    collaborationService.emitConnectionUpdate(connection)
  }

  return { syncState, syncShape, syncConnection }
}

// components/VirtualizedCanvas.tsx
import React, { useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useShapeStore, useConnectionStore, useCanvasSettingsStore } from '../stores'
import { Shape } from './Shape'
import { Connection } from './Connection'

const CELL_SIZE = 100 // Size of each cell in the grid

const VirtualizedCanvas: React.FC = () => {
  const { shapes } = useShapeStore()
  const { connections } = useConnectionStore()
  const { zoom } = useCanvasSettingsStore()

  const Cell = useCallback(({ columnIndex, rowIndex, style }) => {
    const left = columnIndex * CELL_SIZE
    const top = rowIndex * CELL_SIZE
    const visibleShapes = shapes.filter(shape =>
      shape.position.x < left + CELL_SIZE &&
      shape.position.x + shape.size.x > left &&
      shape.position.y < top + CELL_SIZE &&
      shape.position.y + shape.size.y > top
    )
    const visibleConnections = connections.filter(conn =>
      (conn.startPoint.x >= left && conn.startPoint.x < left + CELL_SIZE &&
       conn.startPoint.y >= top && conn.startPoint.y < top + CELL_SIZE) ||
      (conn.endPoint.x >= left && conn.endPoint.x < left + CELL_SIZE &&
       conn.endPoint.y >= top && conn.endPoint.y < top + CELL_SIZE)
    )

    return (
      <div style={style}>
        {visibleShapes.map(shape => (
          <Shape key={shape.id} shape={shape} /* other props */ />
        ))}
        {visibleConnections.map(connection => (
          <Connection key={connection.id} connection={connection} /* other props */ />
        ))}
      </div>
    )
  }, [shapes, connections])

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          width={width}
          itemSize={CELL_SIZE}
          itemCount={Math.ceil(height / CELL_SIZE)}
          overscanCount={2}
        >
          {Cell}
        </List>
      )}
    </AutoSizer>
  )
}

// hooks/useTheme.ts
import { useState, useCallback } from 'react'

interface Theme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  // Add more theme properties as needed
}

const defaultTheme: Theme = {
  primaryColor: '#007bff',
  backgroundColor: '#ffffff',
  textColor: '#000000',
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  const updateTheme = useCallback((newTheme: Partial<Theme>) => {
    setTheme(prevTheme => ({ ...prevTheme, ...newTheme }))
  }, [])

  return { theme, updateTheme }
}

// components/ThemeProvider.tsx
import React, { createContext, useContext } from 'react'
import { useTheme } from '../hooks/useTheme'

const ThemeContext = createContext<ReturnType<typeof useTheme> | null>(null)

export const ThemeProvider: React.FC = ({ children }) => {
  const themeValue = useTheme()

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}

// utils/pluginAPI.ts
import { useShapeStore, useConnectionStore, useToolStore } from '../stores'

export interface Plugin {
  name: string
  version: string
  init: () => void
  cleanup: () => void
}

class PluginAPI {
  private plugins: Plugin[] = []

  registerPlugin(plugin: Plugin) {
    this.plugins.push(plugin)
    plugin.init()
  }

  unregisterPlugin(pluginName: string) {
    const index = this.plugins.findIndex(p => p.name === pluginName)
    if (index !== -1) {
      this.plugins[index].cleanup()
      this.plugins.splice(index, 1)
    }
  }

  getShapes() {
    return useShapeStore.getState().shapes
  }

  getConnections() {
    return useConnectionStore.getState().connections
  }

  getCurrentTool() {
    return useToolStore.getState().currentTool
  }

  // Add more API methods as needed
}

export const pluginAPI = new PluginAPI()

// Example usage of the plugin API
const examplePlugin: Plugin = {
  name: 'ExamplePlugin',
  version: '1.0.0',
  init: () => {
    console.log('Example plugin initialized')
    // Access whiteboard state and add custom functionality
    const shapes = pluginAPI.getShapes()
    console.log('Current number of shapes:', shapes.length)
  },
  cleanup: () => {
    console.log('Example plugin cleaned up')
  },
}

pluginAPI.registerPlugin(examplePlugin)

// Updating Whiteboard.tsx to use new components and hooks
import React from 'react'
import { Header } from './Header'
import { Toolbar } from './Toolbar'
import { VirtualizedCanvas } from './VirtualizedCanvas'
import { BottomToolbar } from './BottomToolbar'
import { RightSidebar } from './RightSidebar'
import { ThemeProvider } from './ThemeProvider'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useProjectExportImport } from '../hooks/useProjectExportImport'
import { useCollaboration } from '../hooks/useCollaboration'

export const Whiteboard: React.FC = () => {
  useKeyboardShortcuts()
  const { exportProject, importProject } = useProjectExportImport()
  const { syncState, syncShape, syncConnection } = useCollaboration('room-id')

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <Header onExport={exportProject} onImport={importProject} />
        <div className="flex flex-1 overflow-hidden">
          <Toolbar />
          <VirtualizedCanvas />
          <RightSidebar />
        </div>
        <BottomToolbar />
      </div>
    </ThemeProvider>
  )
}

export default Whiteboard
