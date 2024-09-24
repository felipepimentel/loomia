import { useGlobalStore } from '../../stores/globalStore';

// Hook para acessar as configurações
export const useSettings = () => useGlobalStore((state) => state.settings);
