import axios from 'axios'
import { DeviceFriendlyTypes } from 'common/catalogs'

const baseURL = process.env.REACT_APP_NINJA_BASE_URL

const snakify = (key) => key.replace(/([A-Z])/g, '_$1').toLowerCase()
const serverify = (data) => {
  const { deviceType, ...serverifiedData } = data
  serverifiedData.type = deviceType
  return Object.keys(serverifiedData)
    .reduce((payload, key) => Object.assign(payload, {
      [snakify(key)]: serverifiedData[key],
    }), {})
}

const clientify = (device) => ({
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
    const list = response.data.map(clientify)
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
export const addDevice = (data) => {
  const dataToServer = serverify(data)
  return axios.post(`${baseURL}/devices`, dataToServer, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// GET device
export const getDevice = async (deviceId) => {
  try {
    const deviceData = axios.get(`${baseURL}/devices/${deviceId}`)
    return clientify(deviceData)
  } catch (error) {
    console.log('Error - getDevice()', error)
    return null
  }
}

// PUT device
export const editDevice = (deviceId, data) => {
  const dataToServer = serverify(data)

  return axios.put(`${baseURL}/devices/${deviceId}`, dataToServer, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deleteDevice = async (deviceId) => {
  await axios.delete(`${baseURL}/devices/${deviceId}`)
}
