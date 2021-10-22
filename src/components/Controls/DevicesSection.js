import React from 'react'
import PropTypes from 'prop-types' // ES6

import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'

import {
  DeviceFriendlyTypes, DeviceTypes,
} from 'common/catalogs'
import { Icons } from 'common/theme'
import SortBySelect from 'components/SortBySelect'
import Styled from './styled'

const deviceTypesToSelect = Object.keys(DeviceTypes)
const deviceTypeIcons = {
  [DeviceTypes.MAC]:                 Icons.DeviceTypeMac,
  [DeviceTypes.WINDOWS_SERVER]:      Icons.DeviceTypeWindowsServer,
  [DeviceTypes.WINDOWS_WORKSTATION]: Icons.DeviceTypeWindow,
}

const DevicesSectionControlsName = 'DevicesSectionControls'

const DevicesSectionControls = (props) => {
  const {
    onFilter,
    onSortBy,
    activeFilters,
    activeSortCriteria,
    sortCriteriaDescriptors,
  } = props

  return (
    <Styled.DevicesSectionControls>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <ToggleButtonGroup
            value={activeFilters}
            onChange={(e, v) => onFilter(v)}
            aria-label="device"
          >
            {deviceTypesToSelect.map((type) => {
              const Icon = deviceTypeIcons[type]
              return (
                <ToggleButton color="info" key={type} value={type} aria-label={DeviceFriendlyTypes[type]}>
                  <Tooltip key={type} title={DeviceFriendlyTypes[type]} placement="bottom">
                    <Icon />
                  </Tooltip>
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Stack>

        <SortBySelect
          withLabel
          criteriaData={activeSortCriteria}
          criteriaDescriptors={sortCriteriaDescriptors}
          onApplySorting={onSortBy}
          onClearAll={() => onSortBy([])}
        />
      </Stack>
    </Styled.DevicesSectionControls>
  )
}

DevicesSectionControls.propTypes = {
  onFilter:                PropTypes.func.isRequired,
  onSortBy:                PropTypes.func.isRequired,
  activeFilters:           PropTypes.array.isRequired,
  activeSortCriteria:      PropTypes.array.isRequired,
  sortCriteriaDescriptors: PropTypes.object.isRequired,
}

DevicesSectionControls.displayName = DevicesSectionControlsName

export default DevicesSectionControls
