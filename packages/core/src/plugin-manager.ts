import { PluginDefinition, PluginInstance, PluginMetadata } from './types';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';

class PluginManager {
  private plugins: Map<string, PluginInstance> = new Map();
  private userConfigPath: string;

  constructor() {
    this.userConfigPath = path.join(app.getPath('userData'), 'user-config.json');
  }

  async loadUserConfig(): Promise<PluginDefinition[]> {
    try {
      const configData = await fs.readFile(this.userConfigPath, 'utf-8');
      return JSON.parse(configData).plugins;
    } catch (error) {
      console.warn('Failed to load user configuration. Loading default configuration.');
      const defaultConfigPath = path.resolve(__dirname, '../../config/user-config.default.json');
      const defaultConfigData = await fs.readFile(defaultConfigPath, 'utf-8');
      return JSON.parse(defaultConfigData).plugins;
    }
  }

  async loadPlugins(): Promise<void> {
    const userConfig = await this.loadUserConfig();
    for (const pluginConfig of userConfig) {
      const [pluginName, config] = Object.entries(pluginConfig)[0];
      if (config.active) {
        await this.loadPlugin(pluginName, config.pluginSettings);
      }
    }
  }

  async loadPlugin(pluginName: string, settings?: Record<string, any>): Promise<void> {
    try {
      const pluginPath = path.resolve(__dirname, `../../plugins/${pluginName}`);
      const PluginClass = await import(/* webpackIgnore: true */ pluginPath);
      const metadata: PluginMetadata = await import(/* webpackIgnore: true */ `${pluginPath}/metadata.json`);
      
      const plugin: PluginInstance = new PluginClass.default(metadata.default);
      
      if (plugin.initialize) {
        await plugin.initialize(settings);
      }
      
      this.plugins.set(pluginName, plugin);
      console.log(`Plugin ${pluginName} loaded successfully.`);
    } catch (error) {
      console.error(`Failed to load plugin: ${pluginName}`, error);
    }
  }

  getPlugin(pluginName: string): PluginInstance | undefined {
    return this.plugins.get(pluginName);
  }

  getAllPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }
}

const pluginManager = new PluginManager();

export { PluginManager, pluginManager };
