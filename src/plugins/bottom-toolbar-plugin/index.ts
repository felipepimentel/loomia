import { AbstractPlugin } from '@/core/base-plugin';
import { PluginMetadata } from '@/core/plugin-metadata';
import BottomToolbar from './BottomToolbar';

export default class BottomToolbarPlugin extends AbstractPlugin {
  component: typeof BottomToolbar | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing BottomToolbarPlugin with settings:`, settings);
    this.component = BottomToolbar;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying BottomToolbarPlugin`);
    this.component = null;
  }
}