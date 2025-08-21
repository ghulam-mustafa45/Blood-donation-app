import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { DonationRequest, RequestStatus } from '../../types'

export const requestsApi = createApi({
  reducerPath: 'requestsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Requests', 'Request'],
  endpoints: (builder) => ({
    listRequests: builder.query<DonationRequest[], { status?: string; city?: string; bloodType?: string } | void>({
      query: (params) => ({ url: '/requests', params }),
      providesTags: ['Requests'],
    }),
    getRequest: builder.query<DonationRequest, string>({
      query: (id) => `/requests/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Request', id }],
    }),
    createRequest: builder.mutation<DonationRequest, Partial<DonationRequest>>({
      query: (body) => ({ url: '/requests', method: 'POST', body }),
      invalidatesTags: ['Requests'],
    }),
    updateRequest: builder.mutation<DonationRequest, { id: string; data: Partial<DonationRequest> }>({
      query: ({ id, data }) => ({ url: `/requests/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Request', id }, 'Requests'],
    }),
    deleteRequest: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/requests/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Requests'],
    }),
    setStatus: builder.mutation<DonationRequest, { id: string; status: RequestStatus }>({
      query: ({ id, status }) => ({ url: `/requests/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Request', id }, 'Requests'],
    }),
    assignDonor: builder.mutation<DonationRequest, { id: string; donorId: string }>({
      query: ({ id, donorId }) => ({ url: `/requests/${id}/assign`, method: 'PATCH', body: { donorId } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Request', id }],
    }),
    setEta: builder.mutation<DonationRequest, { id: string; etaAt: string }>({
      query: ({ id, etaAt }) => ({ url: `/requests/${id}/eta`, method: 'PATCH', body: { etaAt } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Request', id }],
    }),
    addNote: builder.mutation<DonationRequest, { id: string; message: string }>({
      query: ({ id, message }) => ({ url: `/requests/${id}/notes`, method: 'POST', body: { message } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Request', id }],
    }),
    closeRequest: builder.mutation<DonationRequest, { id: string }>({
      query: ({ id }) => ({ url: `/requests/${id}/close`, method: 'POST' }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Request', id }, 'Requests'],
    }),
  }),
})

export const {
  useListRequestsQuery,
  useGetRequestQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useSetStatusMutation,
  useAssignDonorMutation,
  useSetEtaMutation,
  useAddNoteMutation,
  useCloseRequestMutation,
} = requestsApi


