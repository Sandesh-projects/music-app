// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { MusicProvider } from './context/MusicContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);