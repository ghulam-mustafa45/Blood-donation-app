import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../store/auth'

type ChatMessage = {
  id?: string
  userName: string
  text: string
  createdAt: string
}

export default function Chat() {
  const { socket } = useSocket()
  const user = useAuth((s) => s.user)
  const [room, setRoom] = useState<string>('global')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  const availableRooms = useMemo(() => {
    const rooms = [{ key: 'global', label: 'Global' }]
    if (user?.city) rooms.push({ key: `city:${user.city}`, label: `City • ${user.city}` })
    if (user?.bloodType) rooms.push({ key: `blood:${user.bloodType}`, label: `Blood • ${user.bloodType}` })
    return rooms
  }, [user?.city, user?.bloodType])

  useEffect(() => {
    if (!socket) return
    const onIncoming = (msg: ChatMessage) => setMessages((prev) => [...prev, msg])
    const onHistory = (history: ChatMessage[]) => setMessages(history)
    socket.on('chat:message', onIncoming)
    socket.on('chat:history', onHistory)
    return () => {
      socket.off('chat:message', onIncoming)
      socket.off('chat:history', onHistory)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return
    setMessages([])
    socket.emit('chat:join', { room })
  }, [socket, room])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const onSend = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || !socket) return
    socket.emit('chat:message', { room, text: trimmed })
    setText('')
  }

  return (
    <div className="grid grid-rows-[auto,1fr,auto] h-[70vh] max-w-3xl mx-auto gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chat</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Room</label>
          <select className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" value={room} onChange={(e) => setRoom(e.target.value)}>
            {availableRooms.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Card className="overflow-hidden">
        <div ref={listRef} className="h-[48vh] overflow-y-auto space-y-2">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">No messages yet. Say hello! 👋</div>
          )}
          {messages.map((m, idx) => (
            <div key={m.id ?? idx} className="px-2">
              <div className="inline-flex max-w-[85%] flex-col rounded-2xl bg-gray-100 px-3 py-2">
                <span className="text-xs font-semibold text-gray-700">{m.userName}</span>
                <span className="text-sm text-gray-800 whitespace-pre-wrap break-words">{m.text}</span>
                <span className="self-end text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <form onSubmit={onSend} className="flex items-center gap-2">
        <Input placeholder="Type your message..." value={text} onChange={(e) => setText(e.target.value)} className="flex-1" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}


