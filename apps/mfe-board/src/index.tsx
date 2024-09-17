import React from 'react';
import ReactDOM from 'react-dom/client';
import BoardPage from './pages/BoardPage';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BoardPage />
  </React.StrictMode>
);
