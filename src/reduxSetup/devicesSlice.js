/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as ninjaAPI from 'api/ninjaAPI'
// import {listDevices, deletDevice,editDevice,addDevice} from 'api/ninjaAPI'
import isEmpty from 'lodash/isEmpty'
import { DeviceTypes } from 'common/catalogs'
import { isEqual, orderBy } from 'lodash'

const initialState = {
  fetchedList:  [],
  outputList:   [],
  filters:      Object.keys(DeviceTypes),
  sortCriteria: [],
  justAdded:    0,
}
const getCuratedList = (list, filters, sortCriteria) => {
  if (isEmpty(filters) && isEmpty(sortCriteria)) {
    return list
  }
  const filtersSet = new Set(filters)
  const filtered = list.filter((device) => filtersSet.has(device.deviceType))

  return orderBy(
    filtered,
    sortCriteria
      .map((criterion) => (o) => o[criterion.key]),
    sortCriteria
      .map((criterion) => (criterion.ascendingOrder ? 'asc' : 'desc')),
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
  async ({ id }) => ninjaAPI.deleteDevice(id),
)

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  ({ id, data }) => ninjaAPI.editDevice(id, data),

)
export const addDevice = createAsyncThunk(
  'devices/addDevice',
  async ({ data }) => ninjaAPI.addDevice(data),
)

const reducers = {
  setFilters: (state, action) => {
    const newSelection = action.payload.selection
    const sameFilters = isEmpty(newSelection) || isEqual(state.filters, newSelection)
    if (sameFilters) return state

    state.filters = newSelection
    state.outputList = getCuratedList(state.fetchedList, state.filters, state.sortCriteria)
    return state
  },
  setSortCriteria: (state, action) => {
    const newCriteria = action.payload.criteria
    const sameSorting = isEqual(state.sortCriteria, newCriteria)
    if (sameSorting) return state

    state.sortCriteria = newCriteria
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
    [addDevice.fulfilled]: (state) => {
      state.justAdded += 1
    },
  },
  initialState,
})

export const {
  setActiveSection,
  setFilters,
  setSortCriteria,
} = devicesSlice.actions

export default devicesSlice
