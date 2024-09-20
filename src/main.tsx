import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { pluginManager } from '@/core/plugin-manager';

async function initializeApp() {
  await pluginManager.initializePlugins();

  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

initializeApp();