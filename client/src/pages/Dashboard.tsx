import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useSocket } from '../context/SocketContext'
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useListMyRequestsQuery, useGetMyDonorProfileQuery, useUpsertMyDonorProfileMutation } from '../store/api/userDataApi'
import { useDeleteRequestMutation } from '../store/api/requestsApi'
import type { BloodType } from '../types'

export default function Dashboard() {
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

      {/* My Requests */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">My Requests</h3>
          <Link to="/request/new" className="text-primary text-sm">Create Request</Link>
        </div>
        <MyRequests />
      </Card>

      {/* My Donor Profile */}
      <Card>
        <h3 className="text-lg font-semibold mb-3">My Donor Profile</h3>
        <MyDonorProfile />
      </Card>
    </div>
  )
}

function MyRequests() {
  const { data, isLoading } = useListMyRequestsQuery()
  const [deleteRequest] = useDeleteRequestMutation()
  if (isLoading) return <div className="text-sm text-gray-600">Loading...</div>
  if (!data || data.length === 0) return <div className="text-sm text-gray-600">No requests yet.</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {data.map((r) => (
        <div key={r._id} className="rounded-lg border p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold">{r.patientName}</div>
              <div className="text-xs text-gray-600">{r.city} • {r.hospital}</div>
            </div>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">{r.status ?? 'Open'}</span>
          </div>
          {r.details && <div className="mt-2 text-sm text-gray-800">{r.details}</div>}
          <div className="mt-3 flex gap-2">
            <Link to={`/requests/${r._id}`} className="text-primary text-sm">Manage</Link>
            <button className="text-sm text-red-600" onClick={() => { if (confirm('Delete this request?')) void deleteRequest(r._id) }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function MyDonorProfile() {
  const { data, isLoading } = useGetMyDonorProfileQuery()
  const [upsert, { isLoading: isSaving }] = useUpsertMyDonorProfileMutation()

  const [name, setName] = useState(data?.name || '')
  const [city, setCity] = useState(data?.city || '')
  const [bloodType, setBloodType] = useState<BloodType | ''>((data?.bloodType as BloodType) || '')
  const [contactInfo, setContactInfo] = useState(data?.contactInfo || '')

  if (isLoading && !data) return <div className="text-sm text-gray-600">Loading...</div>

  const onSave = async () => {
    await upsert({ name, city, bloodType: (bloodType || undefined) as BloodType | undefined, contactInfo })
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <Select label="Blood Type" value={bloodType} onChange={(e) => setBloodType(e.target.value as BloodType)}>
        <option value="">Select</option>
        {(['A+','A-','B+','B-','AB+','AB-','O+','O-'] as BloodType[]).map(bt => (
          <option key={bt} value={bt}>{bt}</option>
        ))}
      </Select>
      <Input label="Contact" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
      <div className="md:col-span-2">
        <Button type="button" onClick={onSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</Button>
      </div>
    </form>
  )
}


