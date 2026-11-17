import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import 'bootstrap'; // Einbindung von Bootstrap JS mit allen Modulen { Alert, Modal, Collapse}

import './styles/main.scss'; // Einbindung von SCSS

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
