import React from 'react'
import PropTypes from 'prop-types' // ES6

import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'

import Paper from '@mui/material/Paper'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Icons } from 'common/theme'

import { ReactComponent as MacSVG } from 'assets/mac.svg'
import { ReactComponent as WindowsSVG } from 'assets/windows.svg'
import { ReactComponent as ServerSVG } from 'assets/winserv.svg'
import Styled from './styled'

const ComponentName = 'DeviceCard'

const DeviceTypeImages = {
  WINDOWS_WORKSTATION: WindowsSVG,
  WINDOWS_SERVER:      ServerSVG,
  MAC:                 MacSVG,
}

const Component = (props) => {
  const {
    device: {
      id: deviceId,
      systemName,
      hddCapacity,
      typeLabel,
      deviceType,
    },
    menuOptions,
    onOptionSelection,
  } = props

  const [menuAnchorElement, setMenuAnchorElement] = React.useState(null)

  const onMenuOpen = (e) => { setMenuAnchorElement(e.currentTarget) }
  const handleClose = () => {
    setMenuAnchorElement(null)
  }

  return (
    <Styled.DeviceCard>
      <Card sx={{ display: 'flex', mb: 2 }}>
        <CardMedia
          component={DeviceTypeImages[deviceType]}
          sx={{
            width: 150, height: 150, p: 1, pl: 2,
          }}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">{systemName}</Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {typeLabel}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {`${hddCapacity} GB`}
          </Typography>
        </CardContent>
        <Box>
          <IconButton onClick={onMenuOpen} aria-label="previous">
            <Icons.MoreVert />
          </IconButton>
          <Popover
            id={menuAnchorElement ? 'device-card-menu-popover' : undefined}
            anchorEl={menuAnchorElement}
            onClose={handleClose}
            open={!!menuAnchorElement}
            anchorOrigin={{
              vertical:   'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical:   'top',
              horizontal: 'right',
            }}
          >
            <Paper sx={{ width: 200, maxWidth: '100%' }}>
              <MenuList>
                {menuOptions.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => onOptionSelection(option.id, deviceId)}
                  >
                    <ListItemIcon>
                      <option.IconComponent fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{option.label}</ListItemText>
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Popover>
        </Box>
      </Card>
    </Styled.DeviceCard>
  )
}

Component.propTypes = {
  device: PropTypes.shape({
    id:          PropTypes.string.isRequired,
    systemName:  PropTypes.string.isRequired,
    hddCapacity: PropTypes.number.isRequired,
    deviceType:  PropTypes.string.isRequired,
    typeLabel:   PropTypes.string.isRequired,
  }).isRequired,
  menuOptions:       PropTypes.array.isRequired,
  onOptionSelection: PropTypes.func.isRequired,
}

Component.displayName = ComponentName

export default Component
