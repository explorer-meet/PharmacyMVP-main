import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
import ChatBot from './components/ChatBot.jsx'

export const baseURL = 'https://pharmacymvp-main.onrender.com/api';

//export const baseURL = 'http://localhost:5001/api';

//
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <LanguageProvider>
          <OfflineBanner />
          <App />
          <ChatBot />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)

