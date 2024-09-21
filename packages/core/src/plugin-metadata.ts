export interface PluginMetadata {
    name: string;
    type: 'canvas' | 'tool' | 'utility';
    description: string;
    version: string;
    author: string;
    defaultSettings: Record<string, any>;
    settingsSchema?: {
      [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'array' | 'object';
        default?: any;
        description?: string;
      }
    };
  }
  
  export function definePluginMetadata(metadata: PluginMetadata): PluginMetadata {
    return metadata;
  }