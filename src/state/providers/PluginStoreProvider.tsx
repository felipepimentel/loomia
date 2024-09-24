import React from 'react';
import { usePluginStore } from '../stores/pluginStore';

export const PluginStoreContext = React.createContext(null);

export const PluginStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = usePluginStore();

  return (
    <PluginStoreContext.Provider value={store}>
      {children}
    </PluginStoreContext.Provider>
  );
};
