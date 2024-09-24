import { usePluginStore } from '../../stores/pluginStore';

// Hook para acessar a lista de plugins
export const usePlugins = () => usePluginStore((state) => state.plugins);
