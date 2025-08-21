import { useParams } from 'react-router-dom'
import { useGetRequestQuery, useSetStatusMutation, useAssignDonorMutation, useSetEtaMutation, useAddNoteMutation, useCloseRequestMutation } from '../store/api/requestsApi'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useState } from 'react'
import type { RequestStatus } from '../types'

export default function RequestDetail() {
  const { id } = useParams()
  const { data: req, isLoading } = useGetRequestQuery(id!)
  const [setStatus] = useSetStatusMutation()
  const [assignDonor] = useAssignDonorMutation()
  const [setEta] = useSetEtaMutation()
  const [addNote] = useAddNoteMutation()
  const [closeRequest] = useCloseRequestMutation()

  const [newStatus, setNewStatus] = useState<RequestStatus>('In Progress')
  const [donorId, setDonorId] = useState('')
  const [etaAt, setEtaAt] = useState('')
  const [noteText, setNoteText] = useState('')

  if (isLoading || !req) return <div>Loading...</div>

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{req.patientName}</h2>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">{req.status}</span>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">Change Status</label>
            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as RequestStatus)}>
              {(['Open','In Progress','Fulfilled','Cancelled','Expired'] as RequestStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Button className="mt-2" onClick={() => setStatus({ id: req._id, status: newStatus })}>Update</Button>
          </div>
          <div>
            <label className="text-sm text-gray-600">Assign Donor (ID)</label>
            <Input placeholder="donorId" value={donorId} onChange={(e) => setDonorId(e.target.value)} />
            <Button className="mt-2" onClick={() => donorId && assignDonor({ id: req._id, donorId })}>Assign</Button>
          </div>
          <div>
            <label className="text-sm text-gray-600">ETA</label>
            <Input type="datetime-local" value={etaAt} onChange={(e) => setEtaAt(e.target.value)} />
            <Button className="mt-2" onClick={() => etaAt && setEta({ id: req._id, etaAt: new Date(etaAt).toISOString() })}>Set ETA</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div>
          <label className="text-sm text-gray-600">Add Note</label>
          <div className="flex gap-2 mt-1">
            <Input className="flex-1" placeholder="Write a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            <Button onClick={() => noteText && addNote({ id: req._id, message: noteText }).then(() => setNoteText(''))}>Add</Button>
          </div>
          <div className="mt-3 space-y-2">
            {(req.notes || []).map((n, idx) => (
              <div key={idx} className="rounded-lg bg-gray-50 p-2">
                <div className="text-xs text-gray-600">{n.authorName} • {new Date(n.createdAt).toLocaleString()}</div>
                <div className="text-sm text-gray-800">{n.message}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => closeRequest({ id: req._id })}>Close Request</Button>
      </div>
    </div>
  )
}


