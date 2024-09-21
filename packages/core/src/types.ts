import React from 'react';

export interface Shape {
  id: string;
  type:
    | 'rectangle'
    | 'ellipse'
    | 'triangle'
    | 'hexagon'
    | 'star'
    | 'sticky'
    | 'text'
    | 'freehand';
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
  points?: { x: number; y: number }[];
}

export interface Connection {
  id: string;
  startShapeId: string;
  endShapeId: string;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  color: string;
  zIndex: number;
}

export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
}

export interface PluginDefinition {
  name: string;
  Component: React.ComponentType<any>;
}

export interface PluginInstance extends PluginDefinition {
  metadata: PluginMetadata;
  initialize?: (settings?: Record<string, any>) => Promise<void>;
  destroy?: () => Promise<void>;
}

export interface IpcMainHandler {
  'plugin-action': (event: Electron.IpcMainEvent, pluginId: string, action: string) => void;
}

export interface IpcRendererHandler {
  sendPluginAction: (pluginId: string, action: string) => void;
}