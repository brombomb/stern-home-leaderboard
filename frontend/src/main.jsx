import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadRuntimeConfig } from './config.js';

// Dynamically inject custom CSS if present before rendering the app
function injectCustomCss() {
  return fetch('/app/data/custom.css', { method: 'HEAD' })
    .then(res => {
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('text/css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/app/data/custom.css';
        document.head.appendChild(link);
      }
    })
    .catch(() => {});
}

Promise.all([
  loadRuntimeConfig(),
  injectCustomCss()
]).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
