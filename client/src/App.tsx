import { Navigate, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AppLayout from './layouts/AppLayout'

const LoginPage = lazy(() => import('./pages/Login'))
const RegisterPage = lazy(() => import('./pages/Register'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const DonorsPage = lazy(() => import('./pages/Donors'))
const NewRequestPage = lazy(() => import('./pages/NewRequest'))
const ChatPage = lazy(() => import('./pages/Chat'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/donors" element={<DonorsPage />} />
          <Route path="/request/new" element={<NewRequestPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
