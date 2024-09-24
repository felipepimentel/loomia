import { usePluginStore } from '../../stores/pluginStore';

// Hook para ativar/desativar um plugin
export const useTogglePlugin = () => usePluginStore((state) => state.togglePlugin);
