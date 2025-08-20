import { create } from 'zustand'
import { api, setAuthToken } from '../services/api'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  error?: string
  login: (params: { email: string; password: string }) => Promise<void>
  register: (params: {
    name: string
    email: string
    password: string
    bloodType?: string
    city: string
    contactInfo?: string
  }) => Promise<void>
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  async login(params) {
    set({ isLoading: true, error: undefined })
    try {
      const { data } = await api.post('/auth/login', params)
      const { token, user } = data
      setAuthToken(token)
      set({ user })
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed'
      set({ error: message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  async register(params) {
    set({ isLoading: true, error: undefined })
    try {
      const { data } = await api.post('/auth/register', params)
      const { token, user } = data
      setAuthToken(token)
      set({ user })
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed'
      set({ error: message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  logout() {
    setAuthToken(undefined)
    set({ user: null })
  },
}))


