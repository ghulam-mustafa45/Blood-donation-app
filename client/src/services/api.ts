import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setAuthToken(token?: string) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function getAuthToken() {
  return localStorage.getItem('token')
}

