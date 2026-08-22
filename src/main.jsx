import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { pruneOldVersions } from './lib/storage';
import './index.css';

// Clear out keys written by earlier storage schemas before anything reads.
pruneOldVersions();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
