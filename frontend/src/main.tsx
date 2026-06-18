import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Production fetch interceptor routing /api traffic to Render backend
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    const apiBase = import.meta.env.PROD ? 'https://ai-bill-guardian-1.onrender.com' : '';
    input = `${apiBase}${input}`;
  }
  return originalFetch(input, init);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
