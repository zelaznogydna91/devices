import React, { useMemo, useEffect, useRef } from 'react'
import { Icons } from 'common/theme'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'

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

import { DeviceFriendlyTypes, DeviceTypes, DeviceFields } from 'common/catalogs'
import useAppGeneral from 'reduxSetup/generalHook'
import useAppDevices from 'reduxSetup/devicesHook'
import DiscardDialog from 'components/DiscardDialog'

import useDeviceSetup, { CancelOperations } from './hook'

import Styled from './styled'

const cancelCaptions = {
  [CancelOperations.cancel]:  'Cancel',
  [CancelOperations.discard]: 'Discard',
}

const deviceTypesToSelect = ['none', ...Object.keys(DeviceTypes)]
const deviceTypeIcons = {
  [DeviceTypes.MAC]:                 Icons.DeviceTypeMac,
  [DeviceTypes.WINDOWS_SERVER]:      Icons.DeviceTypeWindowsServer,
  [DeviceTypes.WINDOWS_WORKSTATION]: Icons.DeviceTypeWindow,
  none:                              Icons.NoSelection,
}

const ComponentName = 'DeviceSetup'

const Component = () => {
  const {
    sectionParams,
    onSectionChange,
    actions: { openDevices },
  } = useAppGeneral()
  const {
    list,
    actions: { updateDevice, addDevice },
  } = useAppDevices()

  const editingDevice = useMemo(() => {
    if (!sectionParams.editingDeviceId || !list.length) return null
    return list.find((x) => x.id === sectionParams.editingDeviceId)
  }, [sectionParams, list])

  const handlers = {
    updateDevice,
    addDevice,
    closeDeviceSetup: openDevices,
  }
  const [state, actions] = useDeviceSetup({ editingDevice, handlers })

  const {
    operationTitle, editedFields,
    isDirty, cancelOperation,
    discardAlertVisible,
    validationErrors,
  } = state

  const stateRef = useRef()
  stateRef.current = state

  useEffect(() => {
    const shouldTransition = (toSectionId, continueTransition) => {
      // console.log('%conSectionChange - ', 'color: blue;', toSectionId)

      if (!stateRef.current.isDirty || stateRef.current.isSaving) {
        return true // the transition can go on
      }

      // check cancel logic !
      actions.cancel(continueTransition)

      return false
    }

    onSectionChange(shouldTransition)

    return () => {
      onSectionChange(null)
    }
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
            error={!!validationErrors[DeviceFields.systemName]}
            helperText={validationErrors[DeviceFields.systemName]}
            fullWidth
            id="system-name-input"
            labelId="system-name-input-label"
            placeholder="Enter system name"
            variant="outlined"
            value={editedFields[DeviceFields.systemName]}
            onChange={handleFieldChange(DeviceFields.systemName)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icons.SystemName />
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
          <FormControl
            fullWidth
            error={!!validationErrors[DeviceFields.deviceType]}
            sx={{ m: 1, minWidth: 120 }}
          >
            <Select
              fullWidth
              id="device-type-select"
              labelId="device-type-select-label"
              value={editedFields[DeviceFields.deviceType]}
              onChange={handleFieldChange(DeviceFields.deviceType)}
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
            {!!validationErrors[DeviceFields.deviceType] && (
              <FormHelperText>{validationErrors[DeviceFields.deviceType]}</FormHelperText>
            )}
          </FormControl>
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
            error={!!validationErrors[DeviceFields.hddCapacity]}
            helperText={validationErrors[DeviceFields.hddCapacity]}
            fullWidth
            id="hdd-capacity-input"
            labelId="hdd-capacity-input-label"
            placeholder="Enter hard disk capacity"
            InputProps={{
              inputMode:      'numeric',
              pattern:        '[0-9]*',
              startAdornment: (
                <InputAdornment position="start">
                  <Icons.HddCapacity />
                </InputAdornment>
              ),
              endAdornment: (<InputAdornment position="end">GB</InputAdornment>),
            }}
            variant="outlined"
            value={editedFields[DeviceFields.hddCapacity]}
            onChange={handleFieldChange(DeviceFields.hddCapacity)}
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
