import React, { useMemo, useEffect } from 'react'

import SdStorageIcon from '@mui/icons-material/SdStorage'
import SpaceBarIcon from '@mui/icons-material/SpaceBar'
import StorageIcon from '@mui/icons-material/Storage'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import WindowIcon from '@mui/icons-material/Window'
import AppleIcon from '@mui/icons-material/Apple'
import {
  InputLabel, MenuItem,
  Select, TextField, Typography,
  Box,
  Button,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'

import { DeviceFriendlyTypes, DeviceTypes } from 'common/catalogs'
import useAppGeneral from 'reduxSetup/generalHook'
import useAppDevices from 'reduxSetup/devicesHook'
import DiscardDialog from 'components/DiscardDialog'

import { StaticDatePicker } from '@mui/lab'
import useDeviceSetup, { SetupFields, CancelOperations } from './hook'

import Styled from './styled'

const cancelCaptions = {
  [CancelOperations.cancel]:  'Cancel',
  [CancelOperations.discard]: 'Discard',
}

const deviceTypesToSelect = ['none', ...Object.keys(DeviceTypes)]
const deviceTypeIcons = {
  [DeviceTypes.MAC]:                 AppleIcon,
  [DeviceTypes.WINDOWS_SERVER]:      StorageIcon,
  [DeviceTypes.WINDOWS_WORKSTATION]: WindowIcon,
  none:                              SpaceBarIcon,

}

const ComponentName = 'DeviceSetup'

const Component = () => {
  const {
    sectionParams,
    actions: { openDevices },
    onSectionChange,
  } = useAppGeneral()
  const {
    list,
    actions: { updateDevice },
  } = useAppDevices()

  const editingDevice = useMemo(() => {
    if (!sectionParams.editingDeviceId || !list.length) return null
    return list.find((x) => x.id === sectionParams.editingDeviceId)
  }, [sectionParams, list])

  const [state, actions] = useDeviceSetup({
    editingDevice,
    updateDevice,
    closeDeviceSetup: openDevices,
  })

  const {
    operationTitle, editedFields, isDirty, cancelOperation,
    discardAlertVisible,
  } = state

  useEffect(() => {
    const shouldTransition = (toSectionId, continueTransition) => {
      console.log('%conSectionChange - ', 'color: blue;', toSectionId)
      if (!isDirty) {
        return true // the transition can go on
      }
      // check cancel logic !
      actions.cancel(continueTransition)
      return false
    }

    onSectionChange(shouldTransition)

    return () => onSectionChange(null)
  }, [])

  const handleFieldChange = (fieldName) => (ev) => {
    actions.setField(fieldName, ev.target.value)
  }

  return (
    <Styled.DeviceSetup>
      <DiscardDialog
        open={discardAlertVisible}
        confirmDiscard={actions.confirmDiscard}
      />
      <Typography gutterBottom variant="h5" noWrap component="div" sx={{ flexGrow: 1 }}>
        {operationTitle}
      </Typography>
      <Stack sx={{ mt: 3 }} spacing={2}>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <InputLabel sx={{ flexShrink: 0, minWidth: 150, textAlign: 'right' }} id="system-name-input-label">System Name *</InputLabel>
          <TextField
            fullWidth
            id="system-name-input"
            labelId="system-name-input-label"
            placeholder="Enter system name"
            variant="outlined"
            value={editedFields[SetupFields.systemName]}
            onChange={handleFieldChange(SetupFields.systemName)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SupervisedUserCircleIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <InputLabel sx={{ flexShrink: 0, minWidth: 150, textAlign: 'right' }} id="device-type-select-label">Type *</InputLabel>
          <Select
            fullWidth
            id="device-type-select"
            labelId="device-type-select-label"
            value={editedFields[SetupFields.deviceType]}
            onChange={handleFieldChange(SetupFields.deviceType)}
            renderValue={(selectedType) => {
              const TypeIcon = deviceTypeIcons[selectedType]
              return (
                <Box sx={{ display: 'flex', gap: 1.6 }}>
                  <TypeIcon fontSize="small" sx={{ color: '#727272' }} />
                  {DeviceFriendlyTypes[selectedType]}
                </Box>
              )
            }}
          >
            {
              deviceTypesToSelect
                .map((type) => {
                  const TypeIcon = deviceTypeIcons[type]
                  return (
                    <MenuItem key={type} value={type}>
                      <ListItemIcon>
                        <TypeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>{DeviceFriendlyTypes[type]}</ListItemText>
                    </MenuItem>
                  )
                })
            }
          </Select>
        </Stack>
        <Stack
          sx={{ mt: 3 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <InputLabel sx={{ flexShrink: 0, minWidth: 150, textAlign: 'right' }} id="hdd-capacity-input-label">HDD Capacity (GB) *</InputLabel>
          <TextField
            fullWidth
            id="hdd-capacity-input"
            labelId="hdd-capacity-input-label"
            placeholder="Enter hard disk capacity"
            InputProps={{
              inputMode:      'numeric',
              pattern:        '[0-9]*',
              startAdornment: (
                <InputAdornment position="start">
                  <SdStorageIcon />
                </InputAdornment>
              ),
              endAdornment: (<InputAdornment position="end">GB</InputAdornment>),
            }}
            variant="outlined"
            value={editedFields[SetupFields.hddCapacity]}
            onChange={handleFieldChange(SetupFields.hddCapacity)}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{ mt: 3 }}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <Button
          onClick={actions.cancel}
          variant={cancelOperation === CancelOperations.discard ? 'contained' : 'outlined'}
          color={cancelOperation === CancelOperations.discard ? 'secondary' : 'primary'}
        >
          {cancelCaptions[cancelOperation]}
        </Button>
        <Button
          disabled={!isDirty}
          onClick={actions.save}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </Stack>
    </Styled.DeviceSetup>
  )
}

Component.displayName = ComponentName

export default Component