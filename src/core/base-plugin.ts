import { PluginMetadata } from './plugin-metadata';

export interface BasePlugin {
  metadata: PluginMetadata;
  initialize(settings: Record<string, any>): Promise<void>;
  destroy(): Promise<void>;
  updateSettings?(newSettings: Record<string, any>): Promise<void>;
}

export abstract class AbstractPlugin implements BasePlugin {
  constructor(public metadata: PluginMetadata) {}
  
  abstract initialize(settings: Record<string, any>): Promise<void>;
  abstract destroy(): Promise<void>;
  
  async updateSettings?(newSettings: Record<string, any>): Promise<void> {
    // Implementação padrão que pode ser sobrescrita
    Object.assign(this.metadata.defaultSettings, newSettings);
  }
}