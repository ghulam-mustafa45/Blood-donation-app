import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function AuthGate() {
  const user = useAuth((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}


