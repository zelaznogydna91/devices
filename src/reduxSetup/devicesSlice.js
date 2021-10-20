/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as ninjaAPI from 'api/ninjaAPI'
import sortBy from 'lodash/sortBy'
import isEmpty from 'lodash/isEmpty'
import difference from 'lodash/difference'
import { SortByOptions } from 'common/catalogs'
import { DataSaverOn } from '@mui/icons-material'

const devices = ninjaAPI.listDevices()

const initialState = {
  fetchedList:  [],
  outputList:   [],
  filters:      [],
  sortCriteria: [],
}
const getCuratedList = (list, filters, sortCriteria) => {
  if (isEmpty(filters) && isEmpty(sortCriteria)) {
    return list
  }
  const filtersSet = new Set(filters)
  const filtered = list.filter((device) => filtersSet.has(device.deviceType))

  return sortBy(
    filtered,
    sortCriteria
      .map((criterion) => (o) => o[SortByOptions[criterion]]),
  )
}

export const listDevices = createAsyncThunk(
  'devices/listDevices',
  async () => {
    const result = await ninjaAPI.listDevices()

    return result.list
  },
)

export const deleteDevice = createAsyncThunk(
  'devices/deleteDevice',
  (id) => ninjaAPI.deleteDevice(id),
)

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, data }) => {
    debugger
    const r = await ninjaAPI.editDevice(id, data)
    debugger
    return r
  },
)

const reducers = {
  setFilters: (state, action) => {
    const sameFilters = isEmpty(difference(state.filters, action.selection))
    if (sameFilters) return state

    state.filters = action.selection
    state.outputList = getCuratedList(state.fetchedList, state.filters, state.sortCriteria)
    return state
  },
  sortBy: (state, action) => {
    const sameSorting = isEmpty(difference(state.sortCriteria, action.selection))
    if (sameSorting) return state

    state.sortCriteria = action.selection
    state.outputList = getCuratedList(state.fetchedList, state.filters, state.sortCriteria)
    return state
  },
}

const devicesSlice = createSlice({
  name:          'devices',
  reducers,
  extraReducers: {
    [listDevices.fulfilled]: (state, action) => {
      state.fetchedList = action.payload
      state.outputList = getCuratedList(state.fetchedList, state.filters, state.sortCriteria)
    },
    // [updateDevice.pending]: (state, action) => {
    //   state.outputList = getCuratedList(state.fetchedList, state.filters, state.sortCriteria)
    // },
  },
  initialState,
})

export const {
  setActiveSection,
  setFilters,
} = devicesSlice.actions

export default devicesSlice
