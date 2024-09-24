import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type User = {
  name: string;
  email: string;
};

type Settings = {
  theme: 'light' | 'dark';
  language: string;
};

type GlobalState = {
  user: User | null;
  settings: Settings;
  setUser: (user: User) => void;
  setSettings: (settings: Partial<Settings>) => void;
};

// Cria o store global usando o middleware immer para facilitar a manipulação do estado
export const useGlobalStore = create<GlobalState>()(
  immer((set) => ({
    user: null,
    settings: {
      theme: 'light',
      language: 'en',
    },
    setUser: (user) => set((state) => {
      state.user = user;
    }),
    setSettings: (settings) => set((state) => {
      state.settings = { ...state.settings, ...settings };
    }),
  }))
);
