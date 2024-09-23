import { PluginMetadata } from './plugin-interface';
import { logger } from './logger';

export class PluginDependencyManager {
  private dependencies: Map<string, string[]> = new Map();

  addDependencies(pluginId: string, dependencies: string[]) {
    this.dependencies.set(pluginId, dependencies);
  }

  getDependencies(pluginId: string): string[] {
    return this.dependencies.get(pluginId) || [];
  }

  checkDependencies(plugins: PluginMetadata[]): boolean {
    const pluginIds = new Set(plugins.map(p => p.id));

    for (const [pluginId, deps] of this.dependencies) {
      for (const dep of deps) {
        if (!pluginIds.has(dep)) {
          logger.error(`Plugin ${pluginId} depends on ${dep}, which is not available`);
          return false;
        }
      }
    }

    return true;
  }

  getSortedPlugins(plugins: PluginMetadata[]): PluginMetadata[] {
    const visited = new Set<string>();
    const sorted: PluginMetadata[] = [];

    function dfs(plugin: PluginMetadata) {
      if (visited.has(plugin.id)) return;
      visited.add(plugin.id);

      const deps = this.getDependencies(plugin.id);
      for (const depId of deps) {
        const depPlugin = plugins.find(p => p.id === depId);
        if (depPlugin) {
          dfs(depPlugin);
        }
      }

      sorted.push(plugin);
    }

    for (const plugin of plugins) {
      dfs(plugin);
    }

    return sorted;
  }
}

export const pluginDependencyManager = new PluginDependencyManager();