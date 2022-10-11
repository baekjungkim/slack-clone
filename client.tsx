import App from '@layouts/App';
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the app element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
