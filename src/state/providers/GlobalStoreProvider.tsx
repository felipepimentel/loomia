import React from 'react';
import { useGlobalStore } from '../stores/globalStore';

export const GlobalStoreContext = React.createContext(null);

export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useGlobalStore();

  return (
    <GlobalStoreContext.Provider value={store}>
      {children}
    </GlobalStoreContext.Provider>
  );
};
