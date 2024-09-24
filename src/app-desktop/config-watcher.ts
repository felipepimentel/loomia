import fs from 'fs';
import path from 'path';
import { reloadPlugins } from '@plugin-manager/plugin-manager';

const configPath = path.join(__dirname, 'userConfig.json');

// Watch for changes in the configuration file
fs.watch(configPath, async (eventType, filename) => {
  if (eventType === 'change') {
    console.log(`Configuration file changed: ${filename}`);
    try {
      await reloadPlugins(); // Reload active plugins
    } catch (error) {
      console.error("Error reloading plugins:", error);
    }
  }
});
