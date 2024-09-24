import { usePluginStore } from '../../stores/pluginStore';

// Hook para atualizar os dados de um plugin
export const useUpdatePluginData = () => usePluginStore((state) => state.updatePluginData);
