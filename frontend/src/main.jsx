import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App_simple.jsx'; // Using simple version for testing
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);