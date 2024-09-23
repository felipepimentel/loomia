import React from 'react';
import { PluginMetadata } from '@core/types';
import { BasePlugin } from '@core/base-plugin';

const CanvasComponent: React.FC = () => {
  return <div>Canvas Plugin Component</div>;
};

class CanvasPlugin extends BasePlugin {
  component: React.FC;

  constructor(metadata: PluginMetadata) {
    super(metadata);
    this.component = CanvasComponent;
  }

  async initialize(settings?: Record<string, any>): Promise<void> {
    console.log('Canvas plugin initialized with settings:', settings);
    // Implementar a lógica de inicialização do plugin
  }

  // Implementar outros métodos necessários para o plugin
}

export default CanvasPlugin;

export const metadata: PluginMetadata = {
  name: 'canvas-plugin',
  version: '1.0.0',
  description: 'Main canvas plugin for the whiteboard',
};