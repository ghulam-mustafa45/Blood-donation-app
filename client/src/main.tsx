import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { Provider } from 'react-redux'
import { store } from './store'
import { hydrateFromTokenThunk } from './store/slices/authSlice'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <App />
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)

// Hydrate auth from token on startup
store.dispatch<any>(hydrateFromTokenThunk())
