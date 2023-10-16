import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { JsonProvider } from './providers/JsonProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JsonProvider>
      <App />
    </JsonProvider>
  </React.StrictMode>,
);
