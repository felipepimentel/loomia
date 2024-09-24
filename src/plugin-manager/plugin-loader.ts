import { loadUserConfig } from '@/config/config-loader'; // Verifique se o caminho está correto
import { eventBus } from '@/events/event-bus'; // Verifique se o caminho está correto

interface Plugin {
  name: string;
  enabled: boolean;
}

interface LoadedPlugin {
  name: string;
  module: any;
}

const loadedPlugins: LoadedPlugin[] = [];

export const loadPlugins = async () => {
  const config = loadUserConfig();
  const corePlugins = config.plugins.filter((plugin: Plugin) => plugin.enabled && plugin.name.startsWith('core'));
  const communityPlugins = config.plugins.filter((plugin: Plugin) => plugin.enabled && plugin.name.startsWith('community'));

  await loadAndRegisterPlugins(corePlugins, '@core-plugins');
  await loadAndRegisterPlugins(communityPlugins, '@community-plugins');
};

const loadAndRegisterPlugins = async (plugins: Plugin[], basePath: string) => {
  for (const plugin of plugins) {
    try {
      const pluginModule = await import(`${basePath}/${plugin.name}/index.ts`);
      loadedPlugins.push({ name: plugin.name, module: pluginModule });
      eventBus.emit('plugin-loaded', { pluginName: plugin.name });
    } catch (error) {
      console.error(`Failed to load plugin ${plugin.name}:`, error);
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
  await loadPlugins();
};
