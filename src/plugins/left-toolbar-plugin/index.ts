import { AbstractPlugin } from '@/core/base-plugin';
import { PluginMetadata } from '@/core/plugin-metadata';
import LeftToolbar from './LeftToolbar';

export default class LeftToolbarPlugin extends AbstractPlugin {
  component: typeof LeftToolbar | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing LeftToolbarPlugin with settings:`, settings);
    this.component = LeftToolbar;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying LeftToolbarPlugin`);
    this.component = null;
  }
}