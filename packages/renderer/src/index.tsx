import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreProvider } from '@state/store-provider';
import { BrowserRouter } from 'react-router-dom';

// Create root using ReactDOM.createRoot for React 18+
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StoreProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreProvider>
);
