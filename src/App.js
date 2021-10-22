/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useRef, useEffect } from 'react'
import Link from '@mui/material/Link'
import scrollRefIntoView from '@zelaznogydna/utils/dist/scrollRefIntoView'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {
  Sections, SectionsTitles, DeviceFields, DeviceFriendlyFields,
} from 'common/catalogs'
import FrameLayout from 'components/FrameLayout'
import DeviceSetup from 'containers/DeviceSetup'
import DevicesPanel from 'containers/DevicesPanel'
import useAppGeneral from 'reduxSetup/generalHook'
import { Icons } from 'common/theme'
import Controls from './components/Controls'
import useAppDevices from './reduxSetup/devicesHook'

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
      paper:   '#F9F9F9',
      default: '#fff',
      dark:    '#2b4259',
    },
  },
})

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode:    'dark',
    primary: {
      light:        '#2b4259',
      main:         '#576d86',
      dark:         '#001c30',
      contrastText: '#00000087',
    },
    secondary: {
      light:        '#96001d',
      main:         '#ce2043',
      dark:         '#ff7043',
      contrastText: '#F9F9F9',
    },
    background: {
      paper:   '#001c30',
      default: '#000',
      dark:    '#001c30',
    },
    info: {
      light:        '#fff',
      main:         '#F9F9F9',
      dark:         '#576d86',
      contrastText: '#2b4259',
    },
  },
})

const SideMenuOptions = [
  [
    {
      id:            Sections.Devices,
      label:         SectionsTitles.Devices,
      IconComponent: Icons.Devices,
    },
    {
      id:            Sections.DeviceSetup,
      label:         SectionsTitles.NewDevice,
      IconComponent: Icons.AddDevice,
    },
  ], [
    {
      id:            Sections.MyProfile,
      label:         SectionsTitles.MyProfile,
      IconComponent: Icons.Profile,
    },
    {
      id:            Sections.LogOut,
      label:         SectionsTitles.LogOut,
      IconComponent: Icons.Logout,
    },
  ],
]

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

const sortCriteriaDescriptors = {
  [DeviceFields.systemName]: {
    IconComponent: Icons.SystemName,
    tooltip:       DeviceFriendlyFields[DeviceFields.systemName],
  },
  [DeviceFields.hddCapacity]: {
    IconComponent: Icons.HddCapacity,
    tooltip:       DeviceFriendlyFields[DeviceFields.hddCapacity],
  },
}

export default function App() {
  const copyrightRef = useRef()
  const { actions, activeSectionId } = useAppGeneral()
  const {
    filters,
    sortCriteria,
    justAdded,
    actions: devicesActions,
  } = useAppDevices()

  useEffect(() => {
    if (!justAdded) return
    setTimeout(() => {
      scrollRefIntoView(copyrightRef)
    }, 500)
  }, [justAdded])

  const SectionDetails = getActiveSectionDetails(activeSectionId)

  let SectionControls = null
  switch (activeSectionId) {
    case Sections.Devices: {
      SectionControls = (
        <Controls.DevicesSection
          activeFilters={filters}
          activeSortCriteria={sortCriteria}
          sortCriteriaDescriptors={sortCriteriaDescriptors}
          onFilter={devicesActions.filter}
          onSortBy={devicesActions.sortBy}
        />
      )
      break
    }

    case Sections.DeviceSetup:
      break

    default:
      break
  }

  return (
    <ThemeProvider theme={theme}>
      <FrameLayout
        theme={darkTheme}
        sideOptions={SideMenuOptions}
        section={{
          id:       activeSectionId,
          title:    SectionsTitles[activeSectionId],
          controls: SectionControls,

        }}
        onSectionSelection={actions.goToSection}
      >
        <SectionDetails />
      </FrameLayout>
      <Copyright ref={copyrightRef} />
    </ThemeProvider>
  )
}

const Copyright = React.forwardRef((props, ref) => {
  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState(new Date().getFullYear())
  const drawerWidth = 240
  return (
    <Box sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} ref={ref}>
      <Typography sx={{ pb: 4 }} variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://www.linkedin.com/in/zelaznogydna/" target="_blank">
          Andy Gonzalez
        </Link>
        {' '}
        {time}
        .
      </Typography>
    </Box>
  )
})
