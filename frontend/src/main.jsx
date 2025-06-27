import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
 <GoogleOAuthProvider clientId="483587451822-fjrc9gpgaegbbh1pvlbq8qpbc9sauve1.apps.googleusercontent.com">
 <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </GoogleOAuthProvider>
);
