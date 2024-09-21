import { PluginHooks } from './plugin-hooks';

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  permissions: string[];
  settings: Record<string, any>;
}

export interface BasePlugin {
  metadata: PluginMetadata;
  hooks: PluginHooks;

  initialize(): Promise<void>;
  destroy(): Promise<void>;
  onConfigChange?(newConfig: Record<string, any>): Promise<void>;
  onAppReady?(): Promise<void>;
  onBeforeQuit?(): Promise<void>;
}