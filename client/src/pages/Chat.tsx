import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useSocket } from '../context/SocketContext'

type ChatMessage = {
  id?: string
  userName: string
  text: string
  createdAt: string
}

export default function Chat() {
  const { socket } = useSocket()
  const user = useSelector((s: RootState) => s.auth.user)
  const [room, setRoom] = useState<string>('global')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const [searchParams] = useSearchParams()
  const [customRoom, setCustomRoom] = useState<{ key: string; label: string } | null>(null)
  const [recentRooms, setRecentRooms] = useState<{ key: string; label: string }[]>([])

  const availableRooms = useMemo(() => {
    const rooms = [{ key: 'global', label: 'Global' }]
    if (user?.city) rooms.push({ key: `city:${user.city}`, label: `City • ${user.city}` })
    if (user?.bloodType) rooms.push({ key: `blood:${user.bloodType}`, label: `Blood • ${user.bloodType}` })
    if (customRoom && !rooms.find(r => r.key === customRoom.key)) rooms.push(customRoom)
    return rooms
  }, [user?.city, user?.bloodType, customRoom])

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
    const draft = localStorage.getItem(`chat:draft:${room}`) || ''
    setText(draft)
    const label = availableRooms.find(r => r.key === room)?.label || customRoom?.label || room
    const next = [{ key: room, label }, ...recentRooms.filter(r => r.key !== room)].slice(0, 6)
    setRecentRooms(next)
    localStorage.setItem('chat:recentRooms', JSON.stringify(next))
  }, [socket, room])

  // Read deep-link ?room=...&label=...
  useEffect(() => {
    const qRoom = searchParams.get('room')
    const label = searchParams.get('label') || 'Custom Room'
    if (qRoom) {
      setCustomRoom({ key: qRoom, label })
      setRoom(qRoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('chat:recentRooms')
      if (raw) setRecentRooms(JSON.parse(raw))
    } catch {}
  }, [])

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
    localStorage.setItem(`chat:draft:${room}`, '')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const fakeEvent = { preventDefault: () => {} } as unknown as FormEvent
      onSend(fakeEvent)
    }
  }

  const onChangeText = (val: string) => {
    setText(val)
    localStorage.setItem(`chat:draft:${room}`, val)
  }

  return (
    <div className="mx-auto max-w-6xl grid md:grid-cols-[260px,1fr] gap-4 h-[75vh]">
      <div className="hidden md:block">
        <Card className="h-full p-3 space-y-3">
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Quick Rooms</div>
            <div className="flex flex-wrap gap-2">
              {availableRooms.map((r) => (
                <button key={r.key} className={`text-xs rounded-full px-3 py-1 border ${room===r.key? 'bg-primary text-white border-primary':'bg-white text-gray-700 border-gray-200 hover:border-primary'}`} onClick={() => setRoom(r.key)}>{r.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Recent</div>
            <div className="flex flex-col gap-1">
              {recentRooms.length === 0 && <div className="text-xs text-gray-500">No recent rooms</div>}
              {recentRooms.map((r) => (
                <button key={r.key} className={`text-left text-sm rounded-lg px-2 py-1 ${room===r.key? 'bg-gray-100 text-gray-900':'hover:bg-gray-50 text-gray-700'}`} onClick={() => setRoom(r.key)}>{r.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Join custom</div>
            <div className="flex gap-2">
              <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="room key (e.g. dm:u1:u2)" value={customRoom?.key || ''} onChange={(e) => setCustomRoom({ key: e.target.value, label: e.target.value })} />
              <Button type="button" onClick={() => customRoom?.key && setRoom(customRoom.key)}>Join</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-rows-[auto,1fr,auto] gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold">Chat</h2>
            <p className="text-sm text-gray-600">Room: <span className="font-medium">{availableRooms.find(r=>r.key===room)?.label || room}</span></p>
          </div>
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
          <div ref={listRef} className="h-[52vh] overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-white to-gray-50">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">No messages yet. Say hello! 👋</div>
            )}
            {messages.map((m, idx) => {
              const isMine = user && m.userName === user.name
              return (
                <div key={m.id ?? idx} className={`px-2 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`inline-flex max-w-[85%] flex-col rounded-2xl px-4 py-2 shadow-sm ${isMine ? 'bg-primary text-white' : 'bg-white text-gray-900'}`}>
                    <span className={`text-[11px] font-semibold ${isMine ? 'text-white/80' : 'text-gray-700'}`}>{m.userName}</span>
                    <span className={`text-sm whitespace-pre-wrap break-words leading-6 ${isMine ? 'text-white' : 'text-gray-800'}`}>{m.text}</span>
                    <span className={`self-end text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-gray-500'}`}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <form onSubmit={onSend} className="flex items-end gap-2">
          <textarea
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-40"
            placeholder={socket ? 'Type your message… (Enter to send, Shift+Enter for new line)' : 'Connecting…'}
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            disabled={!socket}
          />
          <Button type="submit" disabled={!socket || !text.trim()}>Send</Button>
        </form>
      </div>
    </div>
  )
}


