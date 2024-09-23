// core/plugin-registry.ts
import { Plugin } from "./plugin-interface";

const pluginRegistry: { [type: string]: { [name: string]: Plugin } } = {
  canvas: {},
  tool: {},
  utility: {},
};

export function registerPlugin(plugin: Plugin) {
  if (!pluginRegistry[plugin.type]) {
    throw new Error(`Plugin type ${plugin.type} is not supported`);
  }
  pluginRegistry[plugin.type][plugin.name] = plugin;
}

export function getPlugin(type: string, name: string): Plugin | undefined {
  return pluginRegistry[type]?.[name];
}

export function getPluginsByType(type: string): Plugin[] {
  return Object.values(pluginRegistry[type] || {});
}
