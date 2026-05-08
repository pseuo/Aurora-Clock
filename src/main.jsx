import React from 'react';
import { createRoot } from 'react-dom/client';
import { Clock } from './Clock.jsx';
import './styles.css';
import './styles-polish.css';
import './styles-control-center.css';
import './styles-atmosphere.css';
import './styles-feedback.css';
import './styles-responsive-extra.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Clock />
  </React.StrictMode>
);

window.setTimeout(() => {
  document.documentElement.classList.add('app-ready');
}, 650);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('app-update-ready'));
          }
        });
      });
    }).catch(() => {
      // PWA support is progressive; the app remains fully usable without a service worker.
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'APP_UPDATE_READY') {
        window.dispatchEvent(new CustomEvent('app-update-ready'));
      }
    });
  });
}
