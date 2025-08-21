import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { DonationRequest, BloodType, User } from '../../types'

type DonorProfile = Pick<User, 'name' | 'bloodType' | 'city' | 'contactInfo'>

export const userDataApi = createApi({
  reducerPath: 'userDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['MyRequests', 'MyDonorProfile'],
  endpoints: (builder) => ({
    listMyRequests: builder.query<DonationRequest[], void>({
      query: () => ({ url: '/requests/mine' }),
      providesTags: ['MyRequests'],
    }),
    getMyDonorProfile: builder.query<DonorProfile | null, void>({
      query: () => ({ url: '/donors/me' }),
      providesTags: ['MyDonorProfile'],
    }),
    upsertMyDonorProfile: builder.mutation<DonorProfile, Partial<DonorProfile>>({
      query: (body) => ({ url: '/donors/me', method: 'PUT', body }),
      invalidatesTags: ['MyDonorProfile'],
    }),
  }),
})

export const {
  useListMyRequestsQuery,
  useGetMyDonorProfileQuery,
  useUpsertMyDonorProfileMutation,
} = userDataApi


