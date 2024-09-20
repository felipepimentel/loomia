import { AbstractPlugin } from '@/core/base-plugin';
import { PluginMetadata } from '@/core/plugin-metadata';
import RightSidebar from './RightSidebar';

export default class RightSidebarPlugin extends AbstractPlugin {
  component: typeof RightSidebar | null = null;

  constructor(metadata: PluginMetadata) {
    super(metadata);
  }

  async initialize(settings: Record<string, any>): Promise<void> {
    console.log(`Initializing RightSidebarPlugin with settings:`, settings);
    this.component = RightSidebar;
  }

  async destroy(): Promise<void> {
    console.log(`Destroying RightSidebarPlugin`);
    this.component = null;
  }
}