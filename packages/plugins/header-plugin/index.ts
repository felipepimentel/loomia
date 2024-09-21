import { AbstractPlugin } from '../../core/src/base-plugin';
import { PluginMetadata } from '../../core/src/plugin-metadata';
import HeaderComponent from './Header';

export default class HeaderPlugin extends AbstractPlugin {
  component: typeof HeaderComponent | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing HeaderPlugin with settings:`, settings);
    this.component = HeaderComponent;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying HeaderPlugin`);
    this.component = null;
  }
}