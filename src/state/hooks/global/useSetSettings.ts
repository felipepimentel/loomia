import { useGlobalStore } from '../../stores/globalStore';

// Hook para atualizar as configurações
export const useSetSettings = () => useGlobalStore((state) => state.setSettings);
