import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { logout } from '../store/slices/authSlice'

export default function AppLayout() {
  const dispatch = useDispatch()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useSelector((s: RootState) => s.auth.user)
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-primary">Blood Donation</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/donors" className="hover:text-primary">Donors</Link>
            <Link to="/request/new" className="hover:text-primary">New Request</Link>
            <Link to="/requests" className="hover:text-primary">All Requests</Link>
            <Link to="/chat" className="hover:text-primary">Chat</Link>
            {user ? (
              <button onClick={() => dispatch(logout())} className="text-gray-600 hover:text-primary">Logout</button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>
            )}
          </nav>
          <button
            type="button"
            aria-label="Toggle menu"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <nav className="flex flex-col gap-3 text-sm">
                <Link to="/donors" className="hover:text-primary" onClick={() => setMobileOpen(false)}>Donors</Link>
                <Link to="/request/new" className="hover:text-primary" onClick={() => setMobileOpen(false)}>New Request</Link>
                <Link to="/requests" className="hover:text-primary" onClick={() => setMobileOpen(false)}>All Requests</Link>
                <Link to="/chat" className="hover:text-primary" onClick={() => setMobileOpen(false)}>Chat</Link>
                {user ? (
                  <button onClick={() => { setMobileOpen(false); dispatch(logout()); }} className="text-left text-gray-600 hover:text-primary">Logout</button>
                ) : (
                  <Link to="/login" className="text-gray-600 hover:text-primary" onClick={() => setMobileOpen(false)}>Login</Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}


