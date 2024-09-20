import { BasePlugin } from './base-plugin';
import { PluginMetadata } from './plugin-metadata';
import { loadUserSettings } from '@/lib/user-config';
import { logError, logInfo } from '@/lib/utils';

export class PluginManager {
  private plugins: Map<string, BasePlugin> = new Map();

  async initializePlugins() {
    try {
      const userSettings = await loadUserSettings();
      const pluginConfigs = userSettings.plugins || [];

      for (const pluginConfig of pluginConfigs) {
        const [pluginName, config] = Object.entries(pluginConfig)[0];
        if (config.active) {
          await this.loadPlugin(pluginName, config.source, config.pluginSettings);
        }
      }
    } catch (error) {
      logError('Failed to initialize plugins:', error);
    }
  }

  async loadPlugin(name: string, source: string, userSettings: Record<string, any> = {}) {
    if (this.plugins.has(name)) {
      logInfo(`Plugin ${name} is already loaded.`);
      return;
    }

    try {
      const pluginPath = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      // @ts-ignore
      const { default: PluginClass } = await import(/* @vite-ignore */ `@/plugins/${pluginPath}/index.js`);
      // @ts-ignore
      const { default: metadata } = await import(/* @vite-ignore */ `@/plugins/${pluginPath}/metadata.js`);
      
      const plugin: BasePlugin = new PluginClass(metadata);
      const mergedSettings = { ...metadata.defaultSettings, ...userSettings };

      await plugin.initialize(mergedSettings);
      this.plugins.set(name, plugin);

      logInfo(`Plugin ${name} loaded and initialized successfully.`);
    } catch (error) {
      logError(`Failed to load plugin: ${name}`, error);
    }
  }

  async unloadPlugin(name: string) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      logInfo(`Plugin ${name} is not loaded.`);
      return;
    }

    try {
      await plugin.destroy();
      this.plugins.delete(name);
      logInfo(`Plugin ${name} unloaded successfully.`);
    } catch (error) {
      logError(`Failed to unload plugin: ${name}`, error);
    }
  }

  getPlugin(name: string): BasePlugin | undefined {
    return this.plugins.get(name);
  }

  getPluginMetadata(name: string): PluginMetadata | undefined {
    return this.plugins.get(name)?.metadata;
  }

  getAllPlugins(): BasePlugin[] {
    return Array.from(this.plugins.values());
  }

  async updatePluginSettings(name: string, newSettings: Record<string, any>) {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      logError(`Plugin ${name} not found.`);
      return;
    }

    if (plugin.updateSettings) {
      try {
        await plugin.updateSettings(newSettings);
        logInfo(`Settings updated for plugin ${name}`);
      } catch (error) {
        logError(`Failed to update settings for plugin ${name}`, error);
      }
    } else {
      logInfo(`Plugin ${name} does not support settings updates.`);
    }
  }
}

export const pluginManager = new PluginManager();