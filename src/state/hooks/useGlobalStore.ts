import { useGlobalStore } from '../stores/globalStore';

export const useUser = () => useGlobalStore((state) => state.user);
export const useSettings = () => useGlobalStore((state) => state.settings);
export const useSetUser = () => useGlobalStore((state) => state.setUser);
export const useSetSettings = () => useGlobalStore((state) => state.setSettings);
