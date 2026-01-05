import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './i18n/i18n';
import './styles/global.css';
import { AuthProvider } from './context/AuthContext';
import { ConsentProvider } from './context/ConsentContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConsentProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConsentProvider>
  </React.StrictMode>
);
