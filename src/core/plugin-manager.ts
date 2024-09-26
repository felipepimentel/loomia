// src/core/plugin-manager.ts
import path from 'path';
import fs from 'fs';
import { loadUserConfig } from './config';
import { PluginMetadata } from './types';

interface LoadedPlugin {
  metadata: PluginMetadata;
  module: any;
}

// Function to load a specific plugin
async function loadPlugin(pluginPath: string): Promise<LoadedPlugin | null> {
  try {
    const pluginModule = await import(pluginPath);
    const metadataPath = path.join(pluginPath, 'metadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8')) as PluginMetadata;

    return { metadata, module: pluginModule.default };
  } catch (error) {
    console.error(`Failed to load plugin from ${pluginPath}:`, error);
    return null;
  }
}

// Main function to load all active plugins
export async function loadPlugins(): Promise<LoadedPlugin[]> {
  const config = loadUserConfig();
  const pluginsDir = path.resolve(__dirname, '../plugins');
  const loadedPlugins: LoadedPlugin[] = [];

  // Scan all directories inside the plugins folder
  const pluginTypes = fs.readdirSync(pluginsDir);

  for (const pluginType of pluginTypes) {
    const pluginTypePath = path.join(pluginsDir, pluginType);
    if (fs.statSync(pluginTypePath).isDirectory()) {
      const plugins = fs.readdirSync(pluginTypePath);
      for (const pluginName of plugins) {
        const pluginConfig = config.plugins[pluginName];
        if (pluginConfig && pluginConfig.active) {
          const pluginPath = path.join(pluginTypePath, pluginName, 'index.js');
          const loadedPlugin = await loadPlugin(pluginPath);
          if (loadedPlugin) {
            loadedPlugins.push(loadedPlugin);
          }
        }
      }
    }
  }

  return loadedPlugins;
}
