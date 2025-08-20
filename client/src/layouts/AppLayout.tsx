import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { logout } from '../store/slices/authSlice'

export default function AppLayout() {
  const dispatch = useDispatch()
  const user = useSelector((s: RootState) => s.auth.user)
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-primary">Blood Donation</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/donors" className="hover:text-primary">Donors</Link>
            <Link to="/request/new" className="hover:text-primary">New Request</Link>
            <Link to="/requests" className="hover:text-primary">All Requests</Link>
            <Link to="/chat" className="hover:text-primary">Chat</Link>
            {user ? <button onClick={() => dispatch(logout())} className="text-gray-600 hover:text-primary">Logout</button> : <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}


