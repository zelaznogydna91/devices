import React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Styled from './styled'

const DeviceSetupSectionControlsName = 'DeviceSetupSectionControls'
const DeviceSetupSectionControls = () => (
  <Styled.DeviceSetupSectionControls>
    <Stack spacing={2} direction="row">
      <Button variant="contained" color="primary">Save</Button>
      <Button variant="contained" color="primary">Cancel</Button>
    </Stack>

  </Styled.DeviceSetupSectionControls>
)

DeviceSetupSectionControls.propTypes = {

}
DeviceSetupSectionControls.displayName = DeviceSetupSectionControlsName

export default DeviceSetupSectionControls
