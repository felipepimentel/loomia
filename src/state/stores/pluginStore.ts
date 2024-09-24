import { create } from 'zustand';

type PluginState = {
  plugins: Record<string, any>;
  registerPlugin: (name: string, data: any) => void;
  updatePluginData: (name: string, data: any) => void;
};

export const usePluginStore = create<PluginState>((set) => ({
  plugins: {},
  registerPlugin: (name, data) => set((state) => ({
    plugins: { ...state.plugins, [name]: data },
  })),
  updatePluginData: (name, data) => set((state) => ({
    plugins: { ...state.plugins, [name]: { ...state.plugins[name], ...data } },
  })),
}));
