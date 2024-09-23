import * as chokidar from 'chokidar';
import * as path from 'path';
import { app } from 'electron';
import { pluginManager } from './plugin-manager';
import { logger } from './logger';

export class PluginHotReload {
  private watcher: chokidar.FSWatcher | null = null;

  start() {
    if (process.env.NODE_ENV !== 'development') return;

    const pluginsPath = path.join(app.getAppPath(), 'src', 'plugins');
    this.watcher = chokidar.watch(pluginsPath, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    this.watcher
      .on('change', async (filePath) => {
        const pluginId = path.basename(path.dirname(filePath));
        logger.info(`Plugin file changed: ${filePath}`);
        await this.reloadPlugin(pluginId);
      });

    logger.info('Plugin hot-reload started');
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  private async reloadPlugin(pluginId: string) {
    try {
      await pluginManager.unloadPlugin(pluginId);
      await pluginManager.loadPlugin(pluginId);
      logger.info(`Plugin ${pluginId} reloaded successfully`);
    } catch (error) {
      logger.error(`Failed to reload plugin ${pluginId}:`, error);
    }
  }
}

export const pluginHotReload = new PluginHotReload();