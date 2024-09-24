import { loadUserConfig } from '@/config/config-loader';
import { eventBus } from '@/events/event-bus';

interface LoadedPlugin {
  name: string;
  module: any;
}

const loadedPlugins: LoadedPlugin[] = [];

export const loadActivePlugins = async () => {
  const config = loadUserConfig();

  for (const plugin of config.plugins) {
    if (plugin.enabled) {
      try {
        const pluginModule = await import(`@plugins/${plugin.name}/index.ts`);
        loadedPlugins.push({ name: plugin.name, module: pluginModule });
        eventBus.emit('plugin-loaded', { pluginName: plugin.name });
      } catch (error) {
        console.error(`Failed to load plugin ${plugin.name}:`, error);
      }
    }
  }
};

export const unloadPlugin = (pluginName: string) => {
  const index = loadedPlugins.findIndex((plugin) => plugin.name === pluginName);
  if (index > -1) {
    loadedPlugins.splice(index, 1);
    eventBus.emit('plugin-unloaded', { pluginName });
  }
};

export const reloadPlugins = async () => {
  loadedPlugins.forEach((plugin) => unloadPlugin(plugin.name));
  await loadActivePlugins();
};
