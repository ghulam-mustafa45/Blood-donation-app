import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { DonationRequest, BloodType } from '../types'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'

export default function Requests() {
  const [requests, setRequests] = useState<DonationRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [patientName, setPatientName] = useState('')
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [city, setCity] = useState('')
  const [hospital, setHospital] = useState('')

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Input label="Patient" placeholder="Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          <Select label="Blood Type" value={bloodType} onChange={(e) => setBloodType(e.target.value as any)}>
            <option value="">All Blood Types</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </Select>
          <Input label="City" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="Hospital" placeholder="Hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
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
                <h4 className="font-semibold">{r.patientName}</h4>
                <p className="text-sm text-gray-600">{r.city}{r.hospital ? ` • ${r.hospital}` : ''}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{r.bloodType}</span>
            </div>
            {r.details && <p className="mt-2 text-sm text-gray-700">{r.details}</p>}
            <p className="mt-3 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</p>
          </Card>
        ))}
        {requests.length === 0 && !loading && (
          <div className="text-gray-600">No requests found.</div>
        )}
      </div>
    </div>
  )
}


