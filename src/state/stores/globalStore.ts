import { create } from 'zustand';

type GlobalState = {
  user: { name: string; email: string } | null;
  settings: Record<string, any>;
  setUser: (user: { name: string; email: string }) => void;
  setSettings: (settings: Record<string, any>) => void;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  settings: {},
  setUser: (user) => set({ user }),
  setSettings: (settings) => set({ settings }),
}));
