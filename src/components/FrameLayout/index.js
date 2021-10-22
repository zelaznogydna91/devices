/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types' // ES6

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { ThemeProvider } from '@mui/material/styles'

import Styled from './styled'

const drawerWidth = 240
const drawerHeight = 64

const ComponentName = 'FrameLayout'

const Component = (props) => {
  const {
    children,
    section, sideOptions, onSectionSelection,
    theme,
  } = props

  return (
    <Styled.Layout>
      <ThemeProvider theme={theme}>
        <AppBar
          position="fixed"
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >

          <Toolbar>
            <Typography color="info" variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {section.title}
            </Typography>
            {section.controls}
          </Toolbar>
        </AppBar>
      </ThemeProvider>

      <Drawer
        sx={{
          width:                drawerWidth,
          flexShrink:           0,
          '& .MuiDrawer-paper': {
            width:     drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <img style={{ maxHeight: 54 }} src="https://www.ninjarmm.com/wp-content/uploads/2018/09/Logo_header.svg" height="100" width="300" alt="NinjaRMM" title="Logo_header" />
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: 'scroll' }}>
          {sideOptions.map((group, index, arr) => (
            <Fragment key={index}>
              <List>
                {group.map((option) => (
                  <ListItem key={option.id} button onClick={() => onSectionSelection(option.id)}>
                    <ListItemIcon>
                      <option.IconComponent />
                    </ListItemIcon>
                    <ListItemText primary={option.label} />
                  </ListItem>
                ))}
              </List>
              {index < arr.length - 1 && <Divider /> }
            </Fragment>
          ))}
        </Box>
      </Drawer>
      <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, mt: `${drawerHeight}px` }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          {children}
        </Box>
      </Box>
    </Styled.Layout>
  )
}

Component.propTypes = {
  children:           PropTypes.node.isRequired,
  section:            PropTypes.object.isRequired,
  onSectionSelection: PropTypes.func.isRequired,
  sideOptions:        PropTypes.array.isRequired,
  theme:              PropTypes.any.isRequired,
}
Component.displayName = ComponentName

export default Component
