import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../services/api'
import type { BloodType } from '../types'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { useCreateRequestMutation } from '../store/api/requestsApi'
import { useAuth } from '../store/auth'

const schema = z.object({
  patientName: z.string().min(3),
  bloodType: z.string().min(1),
  city: z.string().min(2),
  hospital: z.string().optional(),
  details: z.string().optional(),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
    gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
})

type FormData = z.infer<typeof schema>

export default function NewRequest() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const user = useAuth((s) => s.user)
  const [createRequest] = useCreateRequestMutation()

  const onSubmit = async (data: FormData) => {
    // Backend will set requestedBy from the JWT
    await createRequest(data as any).unwrap()
    reset()
    alert('Request created')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">New Blood Request</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Patient Name" {...register('patientName')} error={errors.patientName?.message} />
          <Select label="Blood Type" {...register('bloodType')} error={errors.bloodType?.message}>
            {(['A+','A-','B+','B-','AB+','AB-','O+','O-'] as BloodType[]).map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </Select>
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="Hospital" {...register('hospital')} />
          <Input label="Phone Number" {...register('phone')} error={errors.phone?.message} />
          <Select label="Gender" {...register('gender')} error={errors.gender?.message}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-700">Details</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" rows={4} {...register('details')} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Request'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}


