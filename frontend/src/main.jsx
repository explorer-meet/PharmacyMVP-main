import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
const ChatBot = lazy(() => import('./components/ChatBot.jsx'));

//export const baseURL = 'https://pharmacymvp-main.onrender.com/api';

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

//
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
          <OfflineBanner />
          <App />
          <Suspense fallback={null}>
            <ChatBot />
          </Suspense>
          <Toaster />
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
)

