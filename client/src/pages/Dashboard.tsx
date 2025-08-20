import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { logout } from '../store/slices/authSlice'
import { useSocket } from '../context/SocketContext'
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((s: RootState) => s.auth.user)
  const { socket } = useSocket()
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    if (!socket) return
    const onNotify = (msg: string) => setNotifications((prev) => [msg, ...prev].slice(0, 5))
    socket.on('donation:request:new', onNotify)
    return () => {
      socket.off('donation:request:new', onNotify)
    }
  }, [socket])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-pink-500 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold">Welcome {user?.name ?? 'Guest'}</h2>
        <p className="mt-2 opacity-90">Get notified in real-time when a new request matches your location or blood type.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/donors" className="inline-flex items-center rounded-lg bg-white/90 px-4 py-2 text-primary font-semibold hover:bg-white">Find Donors</Link>
          <Link to="/request/new" className="inline-flex items-center rounded-lg bg-white/20 px-4 py-2 text-white font-semibold hover:bg-white/30">Create Request</Link>
        </div>
      </div>
      <Card>
        <h3 className="text-lg font-semibold mb-3">Latest notifications</h3>
        <ul className="space-y-2">
          {notifications.length === 0 && <li className="text-gray-500">No notifications yet.</li>}
          {notifications.map((n, i) => (
            <li key={i} className="text-sm text-gray-700">• {n}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}


