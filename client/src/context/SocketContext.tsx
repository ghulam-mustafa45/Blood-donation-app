import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { getAuthToken } from '../services/api'

type SocketContextValue = {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextValue>({ socket: null })

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const token = getAuthToken()
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      auth: token ? { token } : undefined,
    })
    setSocket(s)
    return () => {
      s.disconnect()
      setSocket(null)
    }
  }, [])

  const value = useMemo(() => ({ socket }), [socket])
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}


