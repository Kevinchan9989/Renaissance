import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Global error handlers for debugging
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[GLOBAL ERROR]', {
    message,
    source,
    lineno,
    colno,
    stack: error?.stack
  });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('[UNHANDLED PROMISE]', {
    reason: event.reason?.message || event.reason,
    stack: event.reason?.stack
  });
};

// Log app startup
console.log('[APP] React app starting...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('[APP] React app mounted');
