import { useGlobalStore } from '../../stores/globalStore';

// Hook para acessar o usuário atual
export const useUser = () => useGlobalStore((state) => state.user);
