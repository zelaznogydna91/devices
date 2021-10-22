/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { Sections } from 'common/catalogs'

const initialState = {
  sectionChangeListener: null,
  activeSectionId:       Sections.Devices,
  sectionParams:         {},
}

const reducers = {
  setSectionChangeListener: (state, action) => {
    state.sectionChangeListener = action.payload.listener
  },
  openDevices: (state) => {
    state.activeSectionId = Sections.Devices
  },
  openDeviceSetup: (state, action) => {
    state.activeSectionId = Sections.DeviceSetup
    state.sectionParams = { editingDeviceId: action.payload.deviceId }
  },
}

const generalSlice = createSlice({
  name: 'general',
  reducers,
  initialState,
})

export const {
  setSectionChangeListener,
  openDeviceSetup,
  openDevices,
} = generalSlice.actions

export default generalSlice
