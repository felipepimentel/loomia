import { AbstractPlugin } from '@/core/base-plugin';
import { PluginMetadata } from '@/core/plugin-metadata';
import Header from './Header';

export default class HeaderPlugin extends AbstractPlugin {
  component: typeof Header | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing HeaderPlugin with settings:`, settings);
    this.component = Header;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying HeaderPlugin`);
    this.component = null;
  }
}