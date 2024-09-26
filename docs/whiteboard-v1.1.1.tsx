"use client"

import React, { useState, useCallback, useRef, useEffect, useMemo, createContext, useContext } from 'react'
import create from 'zustand'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import io from 'socket.io-client'
import * as Icons from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'

// Types
type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'hexagon' | 'star' | 'sticky' | 'text' | 'freehand' | 'library'

interface IPoint {
  x: number
  y: number
}

interface IShapeStyle {
  color: string
  fontSize?: number
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  textAlign?: string
}

interface IShape {
  id: string
  type: ShapeType
  position: IPoint
  size: IPoint
  rotation: number
  content?: string
  style: IShapeStyle
  zIndex: number
  locked: boolean
  visible: boolean
  points?: IPoint[]
  layer: number
  libraryItem?: string
}

interface IConnection {
  id: string
  startShapeId: string
  endShapeId: string
  startPoint: IPoint
  endPoint: IPoint
  color: string
  zIndex: number
  layer: number
}

interface ILayer {
  id: string
  name: string
  visible: boolean
  locked: boolean
}

// Zustand Stores
interface ShapeStore {
  shapes: IShape[]
  addShape: (shape: IShape) => void
  updateShape: (id: string, changes: Partial<IShape>) => void
  deleteShape: (id: string) => void
  moveShape: (id: string, delta: IPoint) => void
  resizeShape: (id: string, newSize: IPoint) => void
  rotateShape: (id: string, angle: number) => void
}

const useShapeStore = create<ShapeStore>((set) => ({
  shapes: [],
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, changes) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? { ...shape, ...changes } : shape)
  })),
  deleteShape: (id) => set((state) => ({ shapes: state.shapes.filter(shape => shape.id !== id) })),
  moveShape: (id, delta) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? { ...shape, position: { x: shape.position.x + delta.x, y: shape.position.y + delta.y } } : shape)
  })),
  resizeShape: (id, newSize) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? { ...shape, size: newSize } : shape)
  })),
  rotateShape: (id, angle) => set((state) => ({
    shapes: state.shapes.map(shape => shape.id === id ? { ...shape, rotation: (shape.rotation + angle) % 360 } : shape)
  })),
}))

interface ConnectionStore {
  connections: IConnection[]
  addConnection: (connection: IConnection) => void
  updateConnection: (id: string, changes: Partial<IConnection>) => void
  deleteConnection: (id: string) => void
}

const useConnectionStore = create<ConnectionStore>((set) => ({
  connections: [],
  addConnection: (connection) => set((state) => ({ connections: [...state.connections, connection] })),
  updateConnection: (id, changes) => set((state) => ({
    connections: state.connections.map(conn => conn.id === id ? { ...conn, ...changes } : conn)
  })),
  deleteConnection: (id) => set((state) => ({ connections: state.connections.filter(conn => conn.id !== id) })),
}))

interface LayerStore {
  layers: ILayer[]
  activeLayerId: string
  addLayer: (layer: ILayer) => void
  updateLayer: (id: string, changes: Partial<ILayer>) => void
  deleteLayer: (id: string) => void
  setActiveLayer: (id: string) => void
}

const useLayerStore = create<LayerStore>((set) => ({
  layers: [{ id: 'default', name: 'Layer 1', visible: true, locked: false }],
  activeLayerId: 'default',
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
  updateLayer: (id, changes) => set((state) => ({
    layers: state.layers.map(layer => layer.id === id ? { ...layer, ...changes } : layer)
  })),
  deleteLayer: (id) => set((state) => ({ layers: state.layers.filter(layer => layer.id !== id) })),
  setActiveLayer: (id) => set({ activeLayerId: id }),
}))

interface ToolStore {
  currentTool: string
  currentStyle: IShapeStyle
  setCurrentTool: (tool: string) => void
  updateCurrentStyle: (changes: Partial<IShapeStyle>) => void
}

const useToolStore = create<ToolStore>((set) => ({
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

interface SelectionStore {
  selectedIds: string[]
  setSelection: (ids: string[]) => void
  clearSelection: () => void
}

const useSelectionStore = create<SelectionStore>((set) => ({
  selectedIds: [],
  setSelection: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}))

interface CanvasSettingsStore {
  zoom: number
  gridEnabled: boolean
  snapToGrid: boolean
  setZoom: (zoom: number) => void
  setGridEnabled: (enabled: boolean) => void
  setSnapToGrid: (enabled: boolean) => void
}

const useCanvasSettingsStore = create<CanvasSettingsStore>((set) => ({
  zoom: 100,
  gridEnabled: true,
  snapToGrid: false,
  setZoom: (zoom) => set({ zoom }),
  setGridEnabled: (enabled) => set({ gridEnabled: enabled }),
  setSnapToGrid: (enabled) => set({ snapToGrid: enabled }),
}))

// Utility functions
const generateId = () => nanoid()

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Micro-components
const Icon: React.FC<{ icon: keyof typeof Icons, className?: string }> = React.memo(({ icon, className = "w-4 h-4" }) => {
  const IconComponent = Icons[icon]
  return <IconComponent className={className} />
})

const TooltipWrapper: React.FC<{ children: React.ReactNode, tooltip: string }> = React.memo(({ children, tooltip }) => (
  <div className="group relative">
    {children}
    <div className="absolute z-10 px-2 py-1 text-sm bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
      {tooltip}
    </div>
  </div>
))

const IconButton: React.FC<{ icon: keyof typeof Icons, onClick: () => void, tooltip: string, isActive?: boolean }> = React.memo(
  ({ icon, onClick, tooltip, isActive = false }) => (
    <TooltipWrapper tooltip={tooltip}>
      <button
        className={`p-2 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={onClick}
      >
        <Icon icon={icon} />
      </button>
    </TooltipWrapper>
  )
)

// Plugin Components
interface ToolPluginProps {
  isActive: boolean
  onSelect: () => void
}

const SelectToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="MousePointer2" onClick={onSelect} tooltip="Select tool (V)" isActive={isActive} />
)

const RectangleToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="Square" onClick={onSelect} tooltip="Rectangle tool (R)" isActive={isActive} />
)

const EllipseToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="Circle" onClick={onSelect} tooltip="Ellipse tool (E)" isActive={isActive} />
)

const TriangleToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="Triangle" onClick={onSelect} tooltip="Triangle tool (T)" isActive={isActive} />
)

const TextToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="Type" onClick={onSelect} tooltip="Text tool (X)" isActive={isActive} />
)

const FreehandToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="Pen" onClick={onSelect} tooltip="Freehand tool (F)" isActive={isActive} />
)

const ConnectionToolPlugin: React.FC<ToolPluginProps> = ({ isActive, onSelect }) => (
  <IconButton icon="ArrowUpRight" onClick={onSelect} tooltip="Connection tool (C)" isActive={isActive} />
)

// Toolbar Component
const Toolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useToolStore()

  const tools = [
    { name: 'select', Component: SelectToolPlugin },
    { name: 'rectangle', Component: RectangleToolPlugin },
    { name: 'ellipse', Component: EllipseToolPlugin },
    { name: 'triangle', Component: TriangleToolPlugin },
    { name: 'text', Component: TextToolPlugin },
    { name: 'freehand', Component: FreehandToolPlugin },
    { name: 'connection', Component: ConnectionToolPlugin },
  ]

  return (
    <div className="flex flex-col items-center p-2 bg-white border-r space-y-2">
      {tools.map(({ name, Component }) => (
        <Component
          key={name}
          isActive={currentTool === name}
          onSelect={() => setCurrentTool(name)}
        />
      ))}
    </div>
  )
}

// Shape Components
interface ShapeProps {
  shape: IShape
  isSelected: boolean
  onSelect: () => void
}

const RectangleShape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect }) => (
  <rect
    x={shape.position.x}
    y={shape.position.y}
    width={shape.size.x}
    height={shape.size.y}
    fill={shape.style.color}
    stroke={isSelected ? "blue" : "none"}
    strokeWidth={isSelected ? 2 : 0}
    onClick={onSelect}
  />
)

const EllipseShape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect }) => (
  <ellipse
    cx={shape.position.x + shape.size.x / 2}
    cy={shape.position.y + shape.size.y / 2}
    rx={shape.size.x / 2}
    ry={shape.size.y / 2}
    fill={shape.style.color}
    stroke={isSelected ? "blue" : "none"}
    strokeWidth={isSelected ? 2 : 0}
    onClick={onSelect}
  />
)

const TriangleShape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect }) => {
  const points = `${shape.position.x},${shape.position.y + shape.size.y} ${shape.position.x + shape.size.x / 2},${shape.position.y} ${shape.position.x + shape.size.x},${shape.position.y + shape.size.y}`
  return (
    <polygon
      points={points}
      fill={shape.style.color}
      stroke={isSelected ? "blue" : "none"}
      strokeWidth={isSelected ? 2 : 0}
      onClick={onSelect}
    />
  )
}

const TextShape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect }) => (
  <text
    x={shape.position.x}
    y={shape.position.y}
    fill={shape.style.color}
    fontSize={shape.style.fontSize}
    fontWeight={shape.style.fontWeight}
    fontStyle={shape.style.fontStyle}
    textDecoration={shape.style.textDecoration}
    onClick={onSelect}
  >
    {shape.content}
  </text>
)

const FreehandShape: React.FC<ShapeProps> = ({ shape, isSelected, onSelect }) => {
  const pathData = shape.points?.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, '')
  return (
    <path
      d={pathData}
      fill="none"
      stroke={shape.style.color}
      strokeWidth={2}
      onClick={onSelect}
    />
  )
}

// Connection Component
interface ConnectionProps {
  connection: IConnection
  isSelected: boolean
  onSelect: () => void
}

const Connection: React.FC<ConnectionProps> = ({ connection, isSelected, onSelect }) => (
  <line
    x1={connection.startPoint.x}
    y1={connection.startPoint.y}
    x2={connection.endPoint.x}
    y2={connection.endPoint.y}
    stroke={connection.color}
    strokeWidth={isSelected ? 3 : 2}
    onClick={onSelect}
  />
)

// Canvas Component
const Canvas: React.FC = () => {
  const { shapes } = useShapeStore()
  const { connections } = useConnectionStore()
  const { selectedIds, setSelection } = useSelectionStore()
  const { zoom, gridEnabled } = useCanvasSettingsStore()
  const { currentTool } = useToolStore()

  constconst handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const point = { x: e.clientX, y: e.clientY }

    if (currentTool === 'select') {
      const clickedShape = shapes.find(shape => isPointInShape(point, shape))
      if (clickedShape) {
        setSelection([clickedShape.id])
      } else {
        setSelection([])
      }
    } else {
      const newShape: IShape = {
        id: generateId(),
        type: currentTool as ShapeType,
        position: point,
        size: { x: 100, y: 100 },
        rotation: 0,
        style: useToolStore.getState().currentStyle,
        zIndex: shapes.length,
        locked: false,
        visible: true,
        layer: useLayerStore.getState().activeLayerId,
      }
      useShapeStore.getState().addShape(newShape)
    }
  }, [currentTool, shapes, setSelection])

  const renderShape = useCallback((shape: IShape) => {
    const isSelected = selectedIds.includes(shape.id)
    const props = {
      key: shape.id,
      shape,
      isSelected,
      onSelect: () => setSelection([shape.id])
    }

    switch (shape.type) {
      case 'rectangle':
        return <RectangleShape {...props} />
      case 'ellipse':
        return <EllipseShape {...props} />
      case 'triangle':
        return <TriangleShape {...props} />
      case 'text':
        return <TextShape {...props} />
      case 'freehand':
        return <FreehandShape {...props} />
      default:
        return null
    }
  }, [selectedIds, setSelection])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: gridEnabled ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M20 0v20H0V0h20zM9 1H1v8h8V1zm10 0h-8v8h8V1zM9 11H1v8h8v-8zm10 0h-8v8h8v-8z\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E")' : 'none',
          backgroundSize: `${20 * zoom / 100}px ${20 * zoom / 100}px`,
        }}
        onClick={handleCanvasClick}
      >
        <g transform={`scale(${zoom / 100})`}>
          {connections.map(connection => (
            <Connection
              key={connection.id}
              connection={connection}
              isSelected={selectedIds.includes(connection.id)}
              onSelect={() => setSelection([connection.id])}
            />
          ))}
          {shapes.map(renderShape)}
        </g>
      </svg>
    </div>
  )
}

// Color Picker Component
const ColorPicker: React.FC<{ color: string, onChange: (color: string) => void }> = React.memo(({ color, onChange }) => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff']

  return (
    <div className="flex space-x-1">
      {colors.map(c => (
        <button
          key={c}
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: c }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
})

// Bottom Toolbar Component
const BottomToolbar: React.FC = () => {
  const { currentStyle, updateCurrentStyle } = useToolStore()

  return (
    <div className="flex items-center justify-between p-2 bg-white border-t">
      <ColorPicker color={currentStyle.color} onChange={(color) => updateCurrentStyle({ color })} />
      <input
        type="number"
        value={currentStyle.fontSize}
        onChange={(e) => updateCurrentStyle({ fontSize: Number(e.target.value) })}
        className="w-16 px-2 py-1 border rounded"
      />
      <IconButton
        icon="Bold"
        onClick={() => updateCurrentStyle({ fontWeight: currentStyle.fontWeight === 'bold' ? 'normal' : 'bold' })}
        tooltip="Bold"
        isActive={currentStyle.fontWeight === 'bold'}
      />
      <IconButton
        icon="Italic"
        onClick={() => updateCurrentStyle({ fontStyle: currentStyle.fontStyle === 'italic' ? 'normal' : 'italic' })}
        tooltip="Italic"
        isActive={currentStyle.fontStyle === 'italic'}
      />
    </div>
  )
}

// Layer Panel Component
const LayerPanel: React.FC = () => {
  const { layers, activeLayerId, addLayer, updateLayer, deleteLayer, setActiveLayer } = useLayerStore()

  return (
    <div className="p-2 bg-white border-l">
      <h2 className="text-lg font-bold mb-2">Layers</h2>
      {layers.map(layer => (
        <div key={layer.id} className={`flex items-center justify-between p-2 ${layer.id === activeLayerId ? 'bg-blue-100' : ''}`}>
          <span>{layer.name}</span>
          <div>
            <IconButton icon="Eye" onClick={() => updateLayer(layer.id, { visible: !layer.visible })} tooltip={layer.visible ? "Hide Layer" : "Show Layer"} />
            <IconButton icon="Lock" onClick={() => updateLayer(layer.id, { locked: !layer.locked })} tooltip={layer.locked ? "Unlock Layer" : "Lock Layer"} />
            <IconButton icon="Trash2" onClick={() => deleteLayer(layer.id)} tooltip="Delete Layer" />
          </div>
        </div>
      ))}
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => addLayer({ id: generateId(), name: `Layer ${layers.length + 1}`, visible: true, locked: false })}>
        Add Layer
      </button>
    </div>
  )
}

// Main Whiteboard Component
const Whiteboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-white border-b">
        <h1 className="text-2xl font-bold">Whiteboard</h1>
      </header>
      <div className="flex flex-1">
        <Toolbar />
        <div className="flex-1 relative">
          <Canvas />
        </div>
        <LayerPanel />
      </div>
      <BottomToolbar />
    </div>
  )
}

// Utility function to check if a point is inside a shape
const isPointInShape = (point: IPoint, shape: IShape): boolean => {
  const { x, y } = point
  const { position, size } = shape
  return x >= position.x && x <= position.x + size.x && y >= position.y && y <= position.y + size.y
}

// Hook for handling keyboard shortcuts
const useKeyboardShortcuts = () => {
  const { setCurrentTool } = useToolStore()
  const { undo, redo } = useHistoryStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            undo()
            break
          case 'y':
            redo()
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
            setCurrentTool('triangle')
            break
          case 'x':
            setCurrentTool('text')
            break
          case 'f':
            setCurrentTool('freehand')
            break
          case 'c':
            setCurrentTool('connection')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setCurrentTool, undo, redo])
}

// History Store
interface HistoryStore {
  past: WhiteboardState[]
  future: WhiteboardState[]
  undo: () => void
  redo: () => void
  pushState: (state: WhiteboardState) => void
}

const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  future: [],
  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return
    const newPresent = past[past.length - 1]
    set(state => ({
      past: state.past.slice(0, -1),
      future: [state.present, ...state.future],
    }))
    applyState(newPresent)
  },
  redo: () => {
    const { future } = get()
    if (future.length === 0) return
    const newPresent = future[0]
    set(state => ({
      past: [...state.past, state.present],
      future: state.future.slice(1),
    }))
    applyState(newPresent)
  },
  pushState: (state: WhiteboardState) => set(prevState => ({
    past: [...prevState.past, prevState.present],
    future: [],
    present: state,
  })),
}))

// Function to apply a state to all stores
const applyState = (state: WhiteboardState) => {
  useShapeStore.setState({ shapes: state.shapes })
  useConnectionStore.setState({ connections: state.connections })
  useLayerStore.setState({ layers: state.layers, activeLayerId: state.activeLayerId })
  useSelectionStore.setState({ selectedIds: state.selectedIds })
  useToolStore.setState({ currentTool: state.currentTool, currentStyle: state.currentStyle })
  useCanvasSettingsStore.setState({ zoom: state.zoom, gridEnabled: state.gridEnabled, snapToGrid: state.snapToGrid })
}

// Main App Component
const App: React.FC = () => {
  useKeyboardShortcuts()

  return (
    <div className="h-screen">
      <Whiteboard />
    </div>
  )
}

export default App


// Função de exportação do projeto
const exportProject = () => {
  const shapes = useShapeStore.getState().shapes
  const connections = useConnectionStore.getState().connections
  const layers = useLayerStore.getState().layers
  const canvasSettings = useCanvasSettingsStore.getState()

  const projectData = {
    shapes,
    connections,
    layers,
    canvasSettings
  }

  const blob = new Blob([JSON.stringify(projectData)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'whiteboard_project.json'
  link.click()
  URL.revokeObjectURL(url)
}

// Função de importação do projeto
const importProject = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const projectData = JSON.parse(e.target?.result as string)
      useShapeStore.setState({ shapes: projectData.shapes })
      useConnectionStore.setState({ connections: projectData.connections })
      useLayerStore.setState({ layers: projectData.layers, activeLayerId: projectData.layers[0].id })
      useCanvasSettingsStore.setState(projectData.canvasSettings)
    } catch (error) {
      console.error('Error importing project:', error)
    }
  }
  reader.readAsText(file)
}

// Componente de manipulação de formas
const ShapeManipulator: React.FC<{ shape: IShape }> = ({ shape }) => {
  const { updateShape } = useShapeStore()
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

  const handleMouseDown = (e: React.MouseEvent, action: 'resize' | 'rotate') => {
    e.stopPropagation()
    if (action === 'resize') {
      setIsResizing(true)
    } else {
      setIsRotating(true)
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newSize = {
        x: e.clientX - shape.position.x,
        y: e.clientY - shape.position.y
      }
      updateShape(shape.id, { size: newSize })
    } else if (isRotating) {
      const center = {
        x: shape.position.x + shape.size.x / 2,
        y: shape.position.y + shape.size.y / 2
      }
      const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x)
      updateShape(shape.id, { rotation: angle * (180 / Math.PI) })
    }
  }, [isResizing, isRotating, shape, updateShape])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    setIsRotating(false)
  }, [])

  useEffect(() => {
    if (isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, isRotating, handleMouseMove, handleMouseUp])

  return (
    <g>
      {renderShape(shape)}
      <rect
        x={shape.position.x - 5}
        y={shape.position.y - 5}
        width={shape.size.x + 10}
        height={shape.size.y + 10}
        fill="none"
        stroke="blue"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <circle
        cx={shape.position.x + shape.size.x}
        cy={shape.position.y + shape.size.y}
        r={5}
        fill="blue"
        cursor="se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      />
      <circle
        cx={shape.position.x + shape.size.x / 2}
        cy={shape.position.y - 20}
        r={5}
        fill="green"
        cursor="grab"
        onMouseDown={(e) => handleMouseDown(e, 'rotate')}
      />
    </g>
  )
}

// Sistema de plugins
interface Plugin {
  id: string
  name: string
  toolbarComponent: React.FC<ToolPluginProps>
  canvasComponent: React.FC<{ shape: IShape }>
}

const plugins: Plugin[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    toolbarComponent: RectangleToolPlugin,
    canvasComponent: RectangleShape
  },
  {
    id: 'ellipse',
    name: 'Ellipse',
    toolbarComponent: EllipseToolPlugin,
    canvasComponent: EllipseShape
  },
  // Adicione mais plugins aqui
]

const PluginContext = createContext<Plugin[]>(plugins)

const PluginProvider: React.FC = ({ children }) => {
  return (
    <PluginContext.Provider value={plugins}>
      {children}
    </PluginContext.Provider>
  )
}

const usePlugins = () => {
  return useContext(PluginContext)
}

// Componente Toolbar atualizado para usar plugins
const Toolbar: React.FC = () => {
  const { currentTool, setCurrentTool } = useToolStore()
  const plugins = usePlugins()

  return (
    <div className="flex flex-col items-center p-2 bg-white border-r space-y-2">
      <SelectToolPlugin
        isActive={currentTool === 'select'}
        onSelect={() => setCurrentTool('select')}
      />
      {plugins.map(plugin => (
        <plugin.toolbarComponent
          key={plugin.id}
          isActive={currentTool === plugin.id}
          onSelect={() => setCurrentTool(plugin.id)}
        />
      ))}
    </div>
  )
}

// Componente Canvas atualizado para usar plugins
const Canvas: React.FC = () => {
  const { shapes } = useShapeStore()
  const { connections } = useConnectionStore()
  const { selectedIds, setSelection } = useSelectionStore()
  const { zoom, gridEnabled } = useCanvasSettingsStore()
  const { currentTool } = useToolStore()
  const plugins = usePlugins()

  const handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const point = { x: e.clientX, y: e.clientY }

    if (currentTool === 'select') {
      const clickedShape = shapes.find(shape => isPointInShape(point, shape))
      if (clickedShape) {
        setSelection([clickedShape.id])
      } else {
        setSelection([])
      }
    } else {
      const plugin = plugins.find(p => p.id === currentTool)
      if (plugin) {
        const newShape: IShape = {
          id: generateId(),
          type: currentTool as ShapeType,
          position: point,
          size: { x: 100, y: 100 },
          rotation: 0,
          style: useToolStore.getState().currentStyle,
          zIndex: shapes.length,
          locked: false,
          visible: true,
          layer: useLayerStore.getState().activeLayerId,
        }
        useShapeStore.getState().addShape(newShape)
      }
    }
  }, [currentTool, shapes, setSelection, plugins])

  const renderShape = useCallback((shape: IShape) => {
    const plugin = plugins.find(p => p.id === shape.type)
    if (plugin) {
      return (
        <plugin.canvasComponent
          key={shape.id}
          shape={shape}
        />
      )
    }
    return null
  }, [plugins])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: gridEnabled ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M20 0v20H0V0h20zM9 1H1v8h8V1zm10 0h-8v8h8V1zM9 11H1v8h8v-8zm10 0h-8v8h8v-8z\' fill=\'%23f0f0f0\'/%3E%3C/svg%3E")' : 'none',
          backgroundSize: `${20 * zoom / 100}px ${20 * zoom / 100}px`,
        }}
        onClick={handleCanvasClick}
      >
        <g transform={`scale(${zoom / 100})`}>
          {connections.map(connection => (
            <Connection
              key={connection.id}
              connection={connection}
              isSelected={selectedIds.includes(connection.id)}
              onSelect={() => setSelection([connection.id])}
            />
          ))}
          {shapes.map(shape =>
            selectedIds.includes(shape.id) ? (
              <ShapeManipulator key={shape.id} shape={shape} />
            ) : (
              renderShape(shape)
            )
          )}
        </g>
      </svg>
    </div>
  )
}

// Componente principal atualizado
const Whiteboard: React.FC = () => {
  return (
    <PluginProvider>
      <div className="flex flex-col h-screen">
        <header className="p-4 bg-white border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">Whiteboard</h1>
          <div>
            <button onClick={exportProject} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Export</button>
            <label className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={(e) => e.target.files && importProject(e.target.files[0])} className="hidden" />
            </label>
          </div>
        </header>
        <div className="flex flex-1">
          <Toolbar />
          <div className="flex-1 relative">
            <Canvas />
          </div>
          <LayerPanel />
        </div>
        <BottomToolbar />
      </div>
    </PluginProvider>
  )
}

export default Whiteboard


// Colaboração em tempo real usando Socket.IO
import io from 'socket.io-client'

const socket = io('http://localhost:3001') // Substitua pela URL do seu servidor Socket.IO

const useRealtimeCollaboration = () => {
  const { addShape, updateShape, deleteShape } = useShapeStore()
  const { addConnection, updateConnection, deleteConnection } = useConnectionStore()

  useEffect(() => {
    socket.on('shape:add', (shape: IShape) => addShape(shape))
    socket.on('shape:update', ({ id, changes }: { id: string, changes: Partial<IShape> }) => updateShape(id, changes))
    socket.on('shape:delete', (id: string) => deleteShape(id))

    socket.on('connection:add', (connection: IConnection) => addConnection(connection))
    socket.on('connection:update', ({ id, changes }: { id: string, changes: Partial<IConnection> }) => updateConnection(id, changes))
    socket.on('connection:delete', (id: string) => deleteConnection(id))

    return () => {
      socket.off('shape:add')
      socket.off('shape:update')
      socket.off('shape:delete')
      socket.off('connection:add')
      socket.off('connection:update')
      socket.off('connection:delete')
    }
  }, [addShape, updateShape, deleteShape, addConnection, updateConnection, deleteConnection])

  const emitShapeChange = (type: 'add' | 'update' | 'delete', data: any) => {
    socket.emit(`shape:${type}`, data)
  }

  const emitConnectionChange = (type: 'add' | 'update' | 'delete', data: any) => {
    socket.emit(`connection:${type}`, data)
  }

  return { emitShapeChange, emitConnectionChange }
}

// Sistema de camadas aprimorado
interface LayerStore {
  layers: ILayer[]
  activeLayerId: string
  addLayer: (layer: ILayer) => void
  updateLayer: (id: string, changes: Partial<ILayer>) => void
  deleteLayer: (id: string) => void
  setActiveLayer: (id: string) => void
  moveLayer: (id: string, newIndex: number) => void
}

const useLayerStore = create<LayerStore>((set) => ({
  layers: [{ id: 'default', name: 'Layer 1', visible: true, locked: false }],
  activeLayerId: 'default',
  addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
  updateLayer: (id, changes) => set((state) => ({
    layers: state.layers.map(layer => layer.id === id ? { ...layer, ...changes } : layer)
  })),
  deleteLayer: (id) => set((state) => ({
    layers: state.layers.filter(layer => layer.id !== id),
    activeLayerId: state.activeLayerId === id ? state.layers[0].id : state.activeLayerId
  })),
  setActiveLayer: (id) => set({ activeLayerId: id }),
  moveLayer: (id, newIndex) => set((state) => {
    const layers = [...state.layers]
    const oldIndex = layers.findIndex(layer => layer.id === id)
    const [removed] = layers.splice(oldIndex, 1)
    layers.splice(newIndex, 0, removed)
    return { layers }
  }),
}))

// Componente de Layer com suporte para arrastar e soltar
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const LayerPanel: React.FC = () => {
  const { layers, activeLayerId, updateLayer, deleteLayer, setActiveLayer, moveLayer } = useLayerStore()

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    moveLayer(result.draggableId, result.destination.index)
  }

  return (
    <div className="p-2 bg-white border-l">
      <h2 className="text-lg font-bold mb-2">Layers</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {layers.map((layer, index) => (
                <Draggable key={layer.id} draggableId={layer.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center justify-between p-2 ${layer.id === activeLayerId ? 'bg-blue-100' : ''}`}
                    >
                      <span>{layer.name}</span>
                      <div>
                        <IconButton icon="Eye" onClick={() => updateLayer(layer.id, { visible: !layer.visible })} tooltip={layer.visible ? "Hide Layer" : "Show Layer"} />
                        <IconButton icon="Lock" onClick={() => updateLayer(layer.id, { locked: !layer.locked })} tooltip={layer.locked ? "Unlock Layer" : "Lock Layer"} />
                        <IconButton icon="Trash2" onClick={() => deleteLayer(layer.id)} tooltip="Delete Layer" />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => addLayer({ id: generateId(), name: `Layer ${layers.length + 1}`, visible: true, locked: false })}>
        Add Layer
      </button>
    </div>
  )
}

// Animações suaves usando Framer Motion
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedShape: React.FC<{ shape: IShape }> = ({ shape }) => {
  const MotionComponent = motion[shape.type === 'ellipse' ? 'ellipse' : 'rect']

  return (
    <AnimatePresence>
      <MotionComponent
        key={shape.id}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
        {...shapeProps(shape)}
      />
    </AnimatePresence>
  )
}

// Suporte para gestos multitoque em dispositivos móveis
import { useGesture } from 'react-use-gesture'

const TouchEnabledCanvas: React.FC = () => {
  const { shapes, updateShape } = useShapeStore()
  const { zoom, setZoom } = useCanvasSettingsStore()

  const bind = useGesture({
    onDrag: ({ movement: [mx, my], args: [shapeId] }) => {
      updateShape(shapeId, {
        position: {
          x: shapes.find(s => s.id === shapeId)!.position.x + mx / zoom,
          y: shapes.find(s => s.id === shapeId)!.position.y + my / zoom
        }
      })
    },
    onPinch: ({ offset: [d] }) => {
      setZoom(d)
    },
  })

  return (
    <svg className="w-full h-full touch-none" {...bind()}>
      {shapes.map(shape => (
        <AnimatedShape key={shape.id} shape={shape} {...bind(shape.id)} />
      ))}
    </svg>
  )
}

// Sistema de atalhos de teclado aprimorado
const useKeyboardShortcuts = () => {
  const { setCurrentTool } = useToolStore()
  const { undo, redo } = useHistoryStore()

  useEffect(() => {
    const shortcuts: Record<string, () => void> = {
      'v': () => setCurrentTool('select'),
      'r': () => setCurrentTool('rectangle'),
      'e': () => setCurrentTool('ellipse'),
      't': () => setCurrentTool('triangle'),
      'x': () => setCurrentTool('text'),
      'f': () => setCurrentTool('freehand'),
      'c': () => setCurrentTool('connection'),
      'z': (e: KeyboardEvent) => e.ctrlKey && undo(),
      'y': (e: KeyboardEvent) => e.ctrlKey && redo(),
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = shortcuts[e.key.toLowerCase()]
      if (shortcut) {
        e.preventDefault()
        shortcut(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setCurrentTool, undo, redo])
}

// Componente principal atualizado
const Whiteboard: React.FC = () => {
  const { emitShapeChange, emitConnectionChange } = useRealtimeCollaboration()
  useKeyboardShortcuts()

  return (
    <PluginProvider>
      <div className="flex flex-col h-screen">
        <header className="p-4 bg-white border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">Collaborative Whiteboard</h1>
          <div>
            <button onClick={exportProject} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Export</button>
            <label className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={(e) => e.target.files && importProject(e.target.files[0])} className="hidden" />
            </label>
          </div>
        </header>
        <div className="flex flex-1">
          <Toolbar />
          <div className="flex-1 relative">
            <TouchEnabledCanvas />
          </div>
          <LayerPanel />
        </div>
        <BottomToolbar />
      </div>
    </PluginProvider>
  )
}

export default Whiteboard
