import { BasePlugin, PluginMetadata } from './plugin-interface';

export class PluginLoader {
  private loadedPlugins: Map<string, BasePlugin> = new Map();

  async loadPlugin(metadata: PluginMetadata): Promise<BasePlugin> {
    if (this.loadedPlugins.has(metadata.id)) {
      return this.loadedPlugins.get(metadata.id)!;
    }

    const { default: PluginClass } = await import(
      /* webpackChunkName: "[request]" */
      `@/plugins/${metadata.id}/index`
    );
    const plugin = new PluginClass(metadata);
    await plugin.initialize();
    this.loadedPlugins.set(metadata.id, plugin);
    return plugin;
  }

  unloadPlugin(pluginId: string) {
    const plugin = this.loadedPlugins.get(pluginId);
    if (plugin) {
      plugin.destroy();
      this.loadedPlugins.delete(pluginId);
    }
  }
}

export const pluginLoader = new PluginLoader();