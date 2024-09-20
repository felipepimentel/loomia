// src/core/userConfig.ts
import fs from 'fs';
import path from 'path';

const configFilePath = path.resolve(__dirname, '../../config/user_settings.json');

type PluginSettings = {
  active: boolean;
  settings?: { [key: string]: any }; // Configurações específicas de cada plugin
};

type UserSettings = {
  plugins: Array<{ [pluginName: string]: PluginSettings }>;
  theme: 'light' | 'dark';
  language: string;
  showGrid: boolean;
};

let userSettings: UserSettings = {
  plugins: [],
  theme: 'light',
  language: 'en',
  showGrid: true,
};

// Carrega a configuração do arquivo JSON
const loadConfig = () => {
  if (fs.existsSync(configFilePath)) {
    const configData = fs.readFileSync(configFilePath, 'utf-8');
    userSettings = JSON.parse(configData);
  } else {
    saveConfig(); // Cria o arquivo de configuração com valores padrão
  }
};

// Salva a configuração atual no arquivo JSON
const saveConfig = () => {
  fs.writeFileSync(configFilePath, JSON.stringify(userSettings, null, 2));
};

// Obtém as configurações de um plugin específico
export const getPluginConfig = (pluginName: string): PluginSettings | undefined => {
  return userSettings.plugins.find((plugin) => plugin.hasOwnProperty(pluginName))?.[pluginName];
};

// Define as configurações de um plugin específico
export const setPluginConfig = (pluginName: string, config: PluginSettings) => {
  const pluginIndex = userSettings.plugins.findIndex((plugin) => plugin.hasOwnProperty(pluginName));
  if (pluginIndex !== -1) {
    userSettings.plugins[pluginIndex][pluginName] = config;
  } else {
    userSettings.plugins.push({ [pluginName]: config });
  }
  saveConfig();
};

// Adiciona um plugin à lista de plugins
export const addPlugin = (pluginName: string, config: PluginSettings) => {
  if (!userSettings.plugins.find((plugin) => plugin.hasOwnProperty(pluginName))) {
    userSettings.plugins.push({ [pluginName]: config });
    saveConfig();
  }
};

// Remove um plugin da lista de plugins
export const removePlugin = (pluginName: string) => {
  userSettings.plugins = userSettings.plugins.filter((plugin) => !plugin.hasOwnProperty(pluginName));
  saveConfig();
};

// Retorna a lista de plugins
export const getPlugins = (): Array<{ [pluginName: string]: PluginSettings }> => {
  return userSettings.plugins;
};

// Define o tema do usuário
export const setTheme = (theme: 'light' | 'dark') => {
  userSettings.theme = theme;
  saveConfig();
};

// Retorna o tema do usuário
export const getTheme = (): 'light' | 'dark' => {
  return userSettings.theme;
};

// Define o idioma do usuário
export const setLanguage = (language: string) => {
  userSettings.language = language;
  saveConfig();
};

// Retorna o idioma do usuário
export const getLanguage = (): string => {
  return userSettings.language;
};

// Define a exibição de grid
export const setShowGrid = (show: boolean) => {
  userSettings.showGrid = show;
  saveConfig();
};

// Retorna a configuração de exibição de grid
export const getShowGrid = (): boolean => {
  return userSettings.showGrid;
};

// Inicializa a configuração ao carregar o módulo
loadConfig();
