import React from 'react'
import useAppGeneral from 'reduxSetup/generalHook'
import useAppDevices from 'reduxSetup/devicesHook'

import DeviceCard from 'components/DeviceCard'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import Styled from './styled'

const menuOptions = [
  {
    label:         'Edit Device',
    id:            'edit',
    IconComponent: EditIcon,
  },
  {
    label:         'Delete Device',
    id:            'delete',
    IconComponent: DeleteForeverIcon,
  },
]

const ComponentName = 'DevicesPanel'

const Component = () => {
  const general = useAppGeneral()
  const devices = useAppDevices()

  const handleOptionSelection = (optionId, deviceId) => {
    switch (optionId) {
      case 'edit':
        general.actions.openDeviceSetup(deviceId)
        break

      case 'delete':
        devices.actions.deleteDevice(deviceId)
        break

      default:
        break
    }
  }

  return (
    <Styled.DevicesPanel
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
    >
      {devices.list.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          menuOptions={menuOptions}
          onOptionSelection={handleOptionSelection}
        />
      ))}
    </Styled.DevicesPanel>
  )
}

Component.displayName = ComponentName

export default Component
