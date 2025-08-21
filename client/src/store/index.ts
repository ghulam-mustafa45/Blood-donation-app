import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import { requestsApi } from './api/requestsApi'
import { userDataApi } from './api/userDataApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [requestsApi.reducerPath]: requestsApi.reducer,
    [userDataApi.reducerPath]: userDataApi.reducer,
  },
  middleware: (gDM) => gDM().concat(requestsApi.middleware, userDataApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


