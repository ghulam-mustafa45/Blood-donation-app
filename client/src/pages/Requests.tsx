import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { DonationRequest, BloodType } from '../types'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export default function Requests() {
  const [requests, setRequests] = useState<DonationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [patientName, setPatientName] = useState('')
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [city, setCity] = useState('')
  const [hospital, setHospital] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const authUser = useSelector((s: RootState) => s.auth.user)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const params: any = {}
      if (patientName) params.patientName = patientName
      if (bloodType) params.bloodType = bloodType
      if (city) params.city = city
      if (hospital) params.hospital = hospital
      if (phone) params.phone = phone
      if (gender) params.gender = gender
      const { data } = await api.get('/allPatients', { params })
      setRequests(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Blood Requests</h2>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <Input label="Patient" placeholder="Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          <Select label="Blood Type" value={bloodType} onChange={(e) => setBloodType(e.target.value as any)}>
            <option value="">All Blood Types</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </Select>
          <Input label="City" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Hospital" placeholder="Hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
          <Input label="Phone" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <div className="flex items-end">
            <Button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Search'}</Button>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((r) => (
          <Card key={r._id}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold pb-2 text-lg ">{r.patientName}</h4>
                <p className="text-sm text-gray-600"><b>City :</b> {r.city} <br /> <b>Hospital : </b>{r.hospital ? ` ${r.hospital}` : ''}</p>
                {(r.gender || r.phone) && (
                  <p className="mt-1 text-sm text-gray-700">
                   <b>Gender : </b> {r.gender ? ` ${r.gender}` : ''}
                    {r.gender && r.phone ? '  ' : ''}
                   <br /><b>Phone : </b> {r.phone ? `Phone: ${r.phone}` : ''}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"><b>Blood : </b> {r.bloodType}</span>
            </div>
            {r.details && <p className="mt-2 text-sm text-gray-700">{r.details}</p>}
            <p className="mt-3 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</p>
            {r.requestedBy && authUser && (
              <div className="mt-3">
                <Link to={`/chat?room=${encodeURIComponent(`dm:${[authUser._id, r.requestedBy].sort().join(':')}`)}&label=${encodeURIComponent(`Direct • ${r.patientName}`)}`}>
                  <Button variant="secondary">Chat</Button>
                </Link>
              </div>
            )}
          </Card>
        ))}
        {requests.length === 0 && !loading && (
          <div className="text-gray-600">No requests found.</div>
        )}
      </div>
    </div>
  )
}


