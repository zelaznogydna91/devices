import React from 'react'
import useAppGeneral from 'reduxSetup/generalHook'
import useAppDevices from 'reduxSetup/devicesHook'

import DeviceCard from 'components/DeviceCard'
import { Icons } from 'common/theme'

import { Typography } from '@mui/material'
import { ReactComponent as EmptySVG } from 'assets/empty.svg'
import Styled from './styled'
import { DeviceFriendlyFields } from '../../common/catalogs'

const menuOptions = [
  {
    label:         'Edit Device',
    id:            'edit',
    IconComponent: Icons.EditDevice,
  },
  {
    label:         'Delete Device',
    id:            'delete',
    IconComponent: Icons.DeleteDevice,
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
  const orderMessage = devices.sortCriteria
    .map((criterion) => `${DeviceFriendlyFields[criterion.key]} (${criterion.ascendingOrder ? 'Ascending' : 'Descending'})`)
    .join(', then ')
  const emptyList = devices.list.length === 0
  const deviceList = devices.list
    .map((device) => (
      <DeviceCard
        key={device.id}
        device={device}
        menuOptions={menuOptions}
        onOptionSelection={handleOptionSelection}
      />
    ))
  return (
    <Styled.DevicesPanel
      component="main"
      sx={{ flexGrow: 1, bgcolor: 'background.default' }}
    >
      {!!orderMessage && <Typography sx={{ pb: 1, pl: 1 }} gutterBottom color="primary" variant="body1">{`Listed by ${orderMessage}`}</Typography>}
      {emptyList ? (
        <Styled.EmptyWrapper>
          <div><EmptySVG width={350} height={158} /></div>
          <Typography variant="h5">It&apos;s looking a little empty here. You should add a new device 🥷🏻</Typography>
        </Styled.EmptyWrapper>
      ) : deviceList}
    </Styled.DevicesPanel>
  )
}

Component.displayName = ComponentName

export default Component
