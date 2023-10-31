import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { JsonProvider } from '@providers/JsonProvider';
import { ThemeProvider } from '@providers/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <JsonProvider>
        <App />
      </JsonProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
