import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SocketProvider>
     <App />
  </SocketProvider>
    <Toaster /> 
  </React.StrictMode>
);
