import { usePluginStore } from '../stores/pluginStore';

export const usePlugins = () => usePluginStore((state) => state.plugins);
export const useRegisterPlugin = () => usePluginStore((state) => state.registerPlugin);
export const useUpdatePluginData = () => usePluginStore((state) => state.updatePluginData);
