import { AbstractPlugin } from '@/core/base-plugin';
import { PluginMetadata } from '@/core/plugin-metadata';
import Canvas from './Canvas';

export default class CanvasPlugin extends AbstractPlugin {
  component: typeof Canvas | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing CanvasPlugin with settings:`, settings);
    this.component = Canvas;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying CanvasPlugin`);
    this.component = null;
  }
}