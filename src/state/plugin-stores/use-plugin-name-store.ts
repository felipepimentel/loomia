import create from 'zustand';

type PluginState = {
  data: any;
  setData: (data: any) => void;
};

export const usePluginNameStore = create<PluginState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
