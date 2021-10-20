import { configureStore, combineReducers } from '@reduxjs/toolkit'
import devicesSlice from 'reduxSetup/devicesSlice'
import generalSlice from 'reduxSetup/generalSlice'

const store = configureStore({
  reducer: combineReducers({
    [devicesSlice.name]: devicesSlice.reducer,
    [generalSlice.name]: generalSlice.reducer,
  }),
})

export default store
