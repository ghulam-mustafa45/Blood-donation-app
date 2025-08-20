import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../store/slices/authSlice'
import type { RootState } from '../store'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((s: RootState) => s.auth)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    const res = await dispatch<any>(loginThunk(data))
    if (loginThunk.fulfilled.match(res)) navigate('/')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Login'}</Button>
        </form>
        <p className="mt-4 text-sm text-gray-600">Don't have an account? <Link className="text-primary" to="/register">Register</Link></p>
      </Card>
    </div>
  )
}


