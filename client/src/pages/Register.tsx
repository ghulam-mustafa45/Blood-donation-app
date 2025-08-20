import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerThunk } from '../store/slices/authSlice'
import type { RootState } from '../store'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  bloodType: z.string().min(1),
  city: z.string().min(2),
  contactInfo: z.string().min(10).max(12),
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((s: RootState) => s.auth)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const res = await dispatch<any>(registerThunk(data))
    if (registerThunk.fulfilled.match(res)) navigate('/')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Create your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          <Select label="Blood Type" {...register('bloodType')} error={errors.bloodType?.message}>
            <option value="">Select blood type</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bt) => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </Select>
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="Contact (10 digits)" {...register('contactInfo')} error={errors.contactInfo?.message} />
          {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}
          <div className="md:col-span-2">
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Register'}</Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-gray-600">Already have an account? <Link className="text-primary" to="/login">Login</Link></p>
      </Card>
    </div>
  )
}


