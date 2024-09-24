import React from 'react';
import { GlobalStoreProvider } from '@state/global-store';

export const StoreProvider: React.FC = ({ children }) => (
  <GlobalStoreProvider>{children}</GlobalStoreProvider>
);
