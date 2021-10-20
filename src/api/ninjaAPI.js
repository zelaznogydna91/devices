import axios from 'axios'
import { DeviceFriendlyTypes } from 'common/catalogs'

const baseURL = process.env.REACT_APP_NINJA_BASE_URL

const deviceMapper = (device) => ({
  id:          device.id,
  systemName:  device.system_name,
  deviceType:  device.type,
  hddCapacity: Number(device.hdd_capacity),
  typeLabel:   DeviceFriendlyTypes[device.type],
})
// GET devices and meta
const getDevicesMeta = (devices) => ({
  count:         devices.length,
  hddCapacities: new Set(devices.map((device) => device.hddCapacity)),
  deviceTypes:   new Set(devices.map((device) => device.deviceType)),
  typesLabels:   new Set(devices.map((device) => device.typeLabel)),
})

export const listDevices = async () => {
  try {
    const response = await axios.get(`${baseURL}/devices`)

    const list = response.data.map(deviceMapper)
    // const meta = getDevicesMeta(list)

    return {
      list,
      // meta,
    }
  } catch (error) {
    console.log('Error - listDevices()', error)
    throw error
  }
}

// POST device
export const addDevice = (data) => axios.post(`${baseURL}/devices`, data, {
  headers: {
    'Content-Type': 'application/json',
  },
})

// GET device
export const getDevice = async (deviceId) => {
  try {
    const deviceData = axios.get(`${baseURL}/devices/${deviceId}`)
    return deviceMapper(deviceData)
  } catch (error) {
    console.log('Error - getDevice()', error)
    return null
  }
}

// PUT device
export const editDevice = (deviceId, data) => axios.put(`${baseURL}/devices/${deviceId}`, data, {
  headers: {
    'Content-Type': 'application/json',
  },
})

export const deleteDevice = (deviceId) => axios.delete(`${baseURL}/devices/${deviceId}`)
