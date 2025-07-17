import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  console.warn(
    'VITE_GOOGLE_CLIENT_ID is not set. Google login will be disabled.'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(

 <GoogleOAuthProvider clientId="483587451822-fjrc9gpgaegbbh1pvlbq8qpbc9sauve1.apps.googleusercontent.com">
 <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>

  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ''}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>

  </React.StrictMode>
  </GoogleOAuthProvider>
);
