import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, setAuthToken } from '../../services/api'
import type { User } from '../../types'

type AuthState = {
  user: User | null
  isLoading: boolean
  error?: string
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', params)
      return data as { user: User; token: string }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Login failed')
    }
  }
)

export const hydrateFromTokenThunk = createAsyncThunk(
  'auth/hydrate',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me')
      return data as { user: User }
    } catch (err: any) {
      return rejectWithValue('')
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (params: { name: string; email: string; password: string; bloodType?: string; city: string; contactInfo?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', params)
      return data as { user: User; token: string }
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      setAuthToken(undefined)
      state.user = null
    },
    setUser(state, action) {
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.isLoading = true; state.error = undefined })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false
        setAuthToken(payload.token)
        state.user = payload.user
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = String(payload)
      })

      .addCase(registerThunk.pending, (state) => { state.isLoading = true; state.error = undefined })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false
        setAuthToken(payload.token)
        state.user = payload.user
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = String(payload)
      })

      .addCase(hydrateFromTokenThunk.fulfilled, (state, { payload }) => {
        state.user = payload.user
      })
  }
})

export const { logout, setUser } = authSlice.actions
export default authSlice.reducer


