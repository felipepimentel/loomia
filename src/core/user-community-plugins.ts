// src/core/userCommunityPlugins.ts

// Aqui você pode configurar um caminho ou API para buscar plugins externos
// Exemplo: Carregar plugins a partir de um arquivo JSON ou uma URL externa

import { loadCommunityPluginsConfig } from './plugin-loader-utils';

// Carrega a configuração dos plugins da comunidade de uma fonte externa (pode ser um arquivo, API, etc.)
const communityPluginConfig = loadCommunityPluginsConfig();

export const userCommunityPlugins: { [key: string]: () => Promise<any> } = {};

// Itera sobre a configuração e adiciona os plugins ao mapa
communityPluginConfig.forEach((plugin: { name: string, path: string }) => {
  userCommunityPlugins[plugin.name] = () => import(/* @vite-ignore */ `${plugin.path}`);
});
