import { PluginMetadata } from './types';

export abstract class BasePlugin {
  constructor(protected metadata: PluginMetadata) {}

  abstract initialize(settings?: Record<string, any>): Promise<void>;
}