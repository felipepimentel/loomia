// src/core/pluginLoaderUtils.ts

// Função para carregar configuração de plugins da comunidade
// Aqui você pode adaptar para carregar de um arquivo JSON local, de uma API, ou de um diretório específico

export function loadCommunityPluginsConfig(): Array<{ name: string, path: string }> {
    // Exemplo simples: carregando de um arquivo JSON ou configurado localmente
    // No caso real, pode ser uma leitura de arquivo, chamada a API, etc.
    return [
      { name: 'communityPlugin1', path: '/community-plugins/plugin1' },
      { name: 'communityPlugin2', path: '/community-plugins/plugin2' },
    ];
  }
  