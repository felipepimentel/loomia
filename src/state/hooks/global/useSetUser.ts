import { useGlobalStore } from '../../stores/globalStore';

// Hook para atualizar o usuário
export const useSetUser = () => useGlobalStore((state) => state.setUser);
