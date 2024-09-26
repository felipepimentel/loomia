import React from 'react';

// Plugin related types
export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  type?: 'utility' | 'shape';
  defaultSettings?: Record<string, any>;
}

export interface PluginConfig {
  active: boolean;
  source: string;
  pluginSettings?: Record<string, any>;
}

export interface PluginProps extends CommonProps {
  metadata: PluginMetadata;
  settings: Record<string, any>;
}

export abstract class AbstractPlugin {
  metadata: PluginMetadata;
  settings: Record<string, any>;

  constructor(metadata: PluginMetadata) {
    this.metadata = metadata;
    this.settings = {};
  }

  abstract Component: React.ComponentType<PluginProps>;

  async initialize(settings: Record<string, any>): Promise<void> {
    this.settings = settings;
  }

  async destroy(): Promise<void> {}
}

export interface PluginInstance extends AbstractPlugin {
  name: string;
}

// Shape related types
export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'hexagon' | 'star' | 'sticky' | 'text' | 'freehand';

export interface Shape {
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
  zIndex: number;
  locked: boolean;
  visible: boolean;
  points?: Point[];
}

// Connection related types
export interface Connection {
  id: string;
  startShapeId: string;
  endShapeId: string;
  startPoint: Point;
  endPoint: Point;
  color: string;
  zIndex: number;
}

// History related types
export interface HistoryEntry {
  shapes: Shape[];
  connections: Connection[];
}

// Common props interface for components
export interface CommonProps {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  selectedShapes: string[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedConnections: string[];
  setSelectedConnections: React.Dispatch<React.SetStateAction<string[]>>;
  tool: string;
  setTool: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  gridEnabled: boolean;
  setGridEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  snapToGrid: boolean;
  setSnapToGrid: React.Dispatch<React.SetStateAction<boolean>>;
}

// User config type
export interface UserConfig {
  plugins: Record<string, PluginConfig>;
}

// Plugin Manager types
export interface PluginManager {
  loadPlugins(): Promise<void>;
  loadPlugin(pluginName: string, settings?: Record<string, any>): Promise<void>;
  getPlugin(pluginName: string): PluginInstance | undefined;
  getAllPlugins(): PluginInstance[];
}

// Utility types
export type Point = { x: number; y: number };

export interface Dimension {
  width: number;
  height: number;
}

export interface Rect extends Point, Dimension {}

// Event types
export interface CanvasMouseEvent extends React.MouseEvent<HTMLDivElement> {
  canvasX: number;
  canvasY: number;
}

// Tool types
export type ToolType = 'select' | 'rectangle' | 'ellipse' | 'triangle' | 'hexagon' | 'star' | 'text' | 'sticky' | 'connection' | 'freehand';

// Theme types
export type ThemeType = 'light' | 'dark';

// Language types
export type LanguageType = 'en' | 'es' | 'fr' | 'de' | 'pt'; // Add more languages as needed


// Defines the type of plugin, based on its general functionality
// Generic type for plugin classification
export enum PluginType {
  Context = 'context',   // Plugins that define containers or layouts, such as interface areas
  Action = 'action',     // Plugins that perform specific actions, like buttons
  Shape = 'shape',       // Plugins that manipulate shapes or objects in the interface
  Tool = 'tool',         // Interactive tool plugins
  Utility = 'utility',   // Utility plugins, such as themes or global settings
  Custom = 'custom'      // Plugins that define custom behaviors
}
