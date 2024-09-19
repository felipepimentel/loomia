import { loadUserSettings } from '@/core/userConfig';
import { Plugin } from '@/types';
import { logError } from '@/lib/utils';

interface PluginInterface {
  name: string;
  active: boolean;
  initialize: () => void;
  destroy: () => void;
}

export class PluginManager {
  plugins: { [key: string]: PluginInterface } = {};

  constructor() {
    this.initializePlugins();
  }

  async initializePlugins() {
    try {
      const userSettings = await loadUserSettings();
      const activePlugins = userSettings.plugins || [];

      activePlugins.forEach((pluginConfig: any) => {
        const pluginName = Object.keys(pluginConfig)[0];
        const pluginStatus = pluginConfig[pluginName]?.active === 'true';

        if (pluginStatus) {
          this.loadPlugin(pluginName);
        }
      });
    } catch (error) {
      logError('Failed to initialize plugins:', error);
    }
  }

  async loadPlugin(pluginName: string) {
    if (this.plugins[pluginName]) return;

    try {
      const { default: pluginModule } = await import(`@/plugins/${pluginName}/index.ts`);
      const pluginInstance: PluginInterface = new pluginModule();
      pluginInstance.initialize();
      this.plugins[pluginName] = pluginInstance;
    } catch (error) {
      logError(`Failed to load plugin: ${pluginName}`, error);
    }
  }

  unloadPlugin(pluginName: string) {
    if (!this.plugins[pluginName]) return;

    this.plugins[pluginName].destroy();
    delete this.plugins[pluginName];
  }
}

export const pluginManager = new PluginManager();
