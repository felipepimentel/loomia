import { usePluginStore } from '../../stores/pluginStore';

// Hook para registrar um novo plugin
export const useRegisterPlugin = () => usePluginStore((state) => state.registerPlugin);
