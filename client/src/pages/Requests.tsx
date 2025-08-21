import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { DonationRequest, BloodType, RequestStatus } from '../types'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useListRequestsQuery, useDeleteRequestMutation } from '../store/api/requestsApi'

export default function Requests() {
  const [patientName, setPatientName] = useState('')
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [city, setCity] = useState('')
  const [hospital, setHospital] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [status, setStatus] = useState<RequestStatus | ''>('')
  const authUser = useSelector((s: RootState) => s.auth.user)
  const [appliedFilters, setAppliedFilters] = useState<any | void>(undefined)
  const [includeLegacy, setIncludeLegacy] = useState(true)
  const [legacyRequests, setLegacyRequests] = useState<DonationRequest[]>([])
  const { data, isFetching } = useListRequestsQuery(appliedFilters)
  const [deleteRequest] = useDeleteRequestMutation()
  const requests: DonationRequest[] = data || []

  useEffect(() => {
    // initial load
    void fetchLegacy()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchLegacy() {
    if (!includeLegacy) { setLegacyRequests([]); return }
    const params: any = {}
    if (patientName) params.patientName = patientName
    if (bloodType) params.bloodType = bloodType
    if (city) params.city = city
    if (hospital) params.hospital = hospital
    if (phone) params.phone = phone
    if (gender) params.gender = gender
    const { data } = await api.get('/allPatients', { params })
    const mapped = (data || []).map((p: any) => Object.assign(p, { isLegacy: true }))
    setLegacyRequests(mapped)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Blood Requests</h2>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
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
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="">All Statuses</option>
            {(['Open','In Progress','Fulfilled','Cancelled','Expired'] as RequestStatus[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setAppliedFilters({
                  patientName: patientName || undefined,
                  bloodType: bloodType || undefined,
                  city: city || undefined,
                  hospital: hospital || undefined,
                  phone: phone || undefined,
                  gender: gender || undefined,
                  status: status || undefined,
                })
                void fetchLegacy()
              }}
              disabled={isFetching}
            >
              {isFetching ? 'Loading...' : 'Search'}
            </Button>
          </div>
        </div>
      </Card>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <input id="incl-legacy" type="checkbox" className="h-4 w-4" checked={includeLegacy} onChange={(e) => { setIncludeLegacy(e.target.checked); if (e.target.checked) void fetchLegacy(); else setLegacyRequests([]) }} />
        <label htmlFor="incl-legacy">Include legacy patient entries</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...requests, ...legacyRequests].map((r) => (
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
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"><b>Blood : </b> {r.bloodType}</span>
                {('status' in r) && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{(r as any).status}</span>
                )}
              </div>
            </div>
            {r.details && <p className="mt-2 text-sm text-gray-700">{r.details}</p>}
            <p className="mt-3 text-xs text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</p>
            <div className="mt-3">
              {r.requestedBy && authUser ? (
                <Link to={`/chat?room=${encodeURIComponent(`dm:${[authUser._id, r.requestedBy].sort().join(':')}`)}&label=${encodeURIComponent(`Direct • ${r.patientName}`)}`}>
                  <Button variant="secondary">Chat</Button>
                </Link>
              ) : (
                <Link to={`/chat?room=${encodeURIComponent(`city:${r.city}`)}&label=${encodeURIComponent(`City • ${r.city}`)}`}>
                  <Button variant="secondary">Chat</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
        {requests.length === 0 && !isFetching && (
          <div className="text-gray-600">No requests found.</div>
        )}
      </div>
    </div>
  )
}


