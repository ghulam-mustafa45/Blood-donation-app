import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { User, BloodType } from '../types'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function Donors() {
  const [donors, setDonors] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [city, setCity] = useState('')
  const authUser = useSelector((s: RootState) => s.auth.user)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const params: any = {}
      if (bloodType) params.bloodType = bloodType
      if (city) params.city = city
      const { data } = await api.get('/donors', { params })
      setDonors(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Find Donors</h2>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select label="Blood Type" value={bloodType} onChange={(e) => setBloodType(e.target.value as any)}>
            <option value="">All Blood Types</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </Select>
          <Input label="City" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <div className="flex items-end">
            <Button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Search'}</Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donors.map((d) => (
          <Card key={d._id}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{d.name}</h4>
                <p className="text-sm text-gray-600">{d.city}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{d.bloodType}</span>
            </div>
            {d.contactInfo && <p className="mt-2 text-sm text-gray-700">Contact: {d.contactInfo}</p>}
            <div className="mt-3">
              {authUser ? (
                <Link to={`/chat?room=${encodeURIComponent(`dm:${[authUser._id, d._id].sort().join(':')}`)}&label=${encodeURIComponent(`Direct • ${d.name}`)}`}>
                  <Button variant="secondary">Chat</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="secondary">Login to Chat</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


