import React, { useState } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import DevicesOtherIcon from '@mui/icons-material/DevicesOther'
import AddIcon from '@mui/icons-material/Add'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from '@mui/material/Link'

import useAppGeneral from 'reduxSetup/generalHook'
import FrameLayout from 'containers/FrameLayout'
import DeviceSetup from 'containers/DeviceSetup'
import DevicesPanel from 'containers/DevicesPanel'

import { Sections, SectionsTitles } from 'common/catalogs'

import Controls from './components/Controls'

const theme = createTheme({
  palette: {
    primary: {
      light:        '#576d86',
      main:         '#2b4259',
      dark:         '#001c30',
      contrastText: '#F9F9F9',
    },
    secondary: {
      light:        '#ff5c6e',
      main:         '#ce2043',
      dark:         '#96001d',
      contrastText: '#F9F9F9',
    },
    background: {
      paper:   '#fff',
      default: '#F9F9F9',
      dark:    '#2b4259',
    },
  },
})

const SideMenuOptions = [
  [
    {
      id:            Sections.Devices,
      label:         SectionsTitles.Devices,
      IconComponent: DevicesOtherIcon,
    },
    {
      id:            Sections.DeviceSetup,
      label:         SectionsTitles.DeviceSetup,
      IconComponent: AddIcon,
    },
  ], [
    {
      id:            Sections.MyProfile,
      label:         SectionsTitles.MyProfile,
      IconComponent: PersonOutlineIcon,
    },
    {
      id:            Sections.LogOut,
      label:         SectionsTitles.LogOut,
      IconComponent: LogoutIcon,
    },
  ],
]

const getActiveSectionHeaderControls = (sectionId) => {
  switch (sectionId) {
    case Sections.Devices:
      return Controls.DevicesSection

    case Sections.DeviceSetup:
      return Controls.DeviceSetupSection

    default:
      return null
  }
}

const getActiveSectionDetails = (sectionKey) => {
  switch (sectionKey) {
    case Sections.Devices:
      return DevicesPanel

    case Sections.DeviceSetup:
      return DeviceSetup

    default:
      return null
  }
}

export default function App() {
  const { actions, activeSectionId } = useAppGeneral()

  const SectionDetails = getActiveSectionDetails(activeSectionId)

  return (
    <ThemeProvider theme={theme}>
      <FrameLayout
        sideOptions={SideMenuOptions}
        section={{
          title:    SectionsTitles[activeSectionId],
          controls: getActiveSectionHeaderControls(activeSectionId),
        }}
        onSectionSelection={actions.goToSection}
      >
        <SectionDetails />
      </FrameLayout>
      <Copyright />
    </ThemeProvider>
  )
}

function Copyright() {
  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState(new Date().getFullYear())
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.linkedin.com/in/zelaznogydna/">
        Andy Gonzalez
      </Link>
      {' '}
      {time}
      .
    </Typography>
  )
}
