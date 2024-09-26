import { PluginType } from "./types";

export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  type: PluginType;
  defaultSettings?: Record<string, any>;
  dependencies?: string[];
}

export function definePluginMetadata(metadata: PluginMetadata): PluginMetadata {
  return metadata;
}
