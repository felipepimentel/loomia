import { PluginMetadata } from './plugin-interface';
import { configManager } from './config-manager';
import { logger } from './logger';

export class PluginMigrator {
  async migratePlugin(oldMetadata: PluginMetadata, newMetadata: PluginMetadata) {
    const currentVersion = oldMetadata.version;
    const newVersion = newMetadata.version;

    if (currentVersion === newVersion) {
      return;
    }

    logger.info(`Migrating plugin ${oldMetadata.id} from ${currentVersion} to ${newVersion}`);

    // Exemplo de migração de configurações
    const oldSettings = configManager.get(`plugins.${oldMetadata.id}.settings`, {});
    const newSettings = { ...oldSettings, ...newMetadata.settings };
    configManager.set(`plugins.${newMetadata.id}.settings`, newSettings);

    // Aqui você pode adicionar lógica adicional de migração, como atualização de dados
    
    logger.info(`Migration of plugin ${oldMetadata.id} completed`);
  }
}

export const pluginMigrator = new PluginMigrator();