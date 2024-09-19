import axios from 'axios';

export class PluginMarketplace {
  private installedPlugins: { [name: string]: any } = {};
  private backendUrl = 'https://plugin-marketplace-server.com';

  constructor(private pluginManager: any) {}

  async fetchAvailablePlugins() {
    const response = await axios.get(`${this.backendUrl}/plugins`);
    return response.data;  // Retorna lista de plugins disponíveis
  }

  async installPlugin(name: string) {
    const response = await axios.get(`${this.backendUrl}/plugins/${name}`);
    const pluginCode = response.data;

    // Registra o plugin no plugin manager
    const plugin = new Function('return ' + pluginCode)();
    this.pluginManager.registerPlugin(name, plugin);

    // Armazena localmente o plugin
    this.installedPlugins[name] = plugin;
    localStorage.setItem('installedPlugins', JSON.stringify(this.installedPlugins));
  }

  removePlugin(name: string) {
    this.pluginManager.disablePlugin(name);
    delete this.installedPlugins[name];
    localStorage.setItem('installedPlugins', JSON.stringify(this.installedPlugins));
  }

  loadInstalledPlugins() {
    const savedPlugins = localStorage.getItem('installedPlugins');
    if (savedPlugins) {
      this.installedPlugins = JSON.parse(savedPlugins);
      Object.keys(this.installedPlugins).forEach(name => {
        this.pluginManager.registerPlugin(name, this.installedPlugins[name]);
      });
    }
  }

  async checkForUpdates() {
    const response = await axios.get(`${this.backendUrl}/plugins/updates`);
    return response.data;  // Lista de plugins com atualizações disponíveis
  }
}
