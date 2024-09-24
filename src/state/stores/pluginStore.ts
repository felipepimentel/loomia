import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Plugin = {
  name: string;
  version: string;
  isEnabled: boolean;
  data: Record<string, any>;
};

type PluginState = {
  plugins: Record<string, Plugin>;
  registerPlugin: (name: string, plugin: Omit<Plugin, 'name'>) => void;
  updatePluginData: (name: string, data: Partial<Plugin['data']>) => void;
  togglePlugin: (name: string) => void;
};

// Cria o store de plugins usando o middleware immer para facilitar a manipulação do estado
export const usePluginStore = create<PluginState>()(
  immer((set) => ({
    plugins: {},
    registerPlugin: (name, plugin) => set((state) => {
      state.plugins[name] = { ...plugin, name };
    }),
    updatePluginData: (name, data) => set((state) => {
      const plugin = state.plugins[name];
      if (plugin) {
        plugin.data = { ...plugin.data, ...data };
      }
    }),
    togglePlugin: (name) => set((state) => {
      const plugin = state.plugins[name];
      if (plugin) {
        plugin.isEnabled = !plugin.isEnabled;
      }
    }),
  }))
);
