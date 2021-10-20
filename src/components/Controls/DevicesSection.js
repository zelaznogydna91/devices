import React from 'react'
import PropTypes from 'prop-types' // ES6
import FilterSelect from 'components/FilterSelect'

import Styled from './styled'

const DevicesSectionControlsName = 'DevicesSectionControls'
const DevicesSectionControls = (props) => {
  const { deviceTypes } = props
  return (
    <Styled.DevicesSectionControls>
      <>
        <FilterSelect
          label="Device Type"
          list={deviceTypes}
          multiple
          onSelect={() => {}}
          selectedList={[]}
        />
        <FilterSelect
          label="Sort by"
          list={['hello']}
          onSelect={() => {}}
          selectedList={['hello']}
        />
      </>
    </Styled.DevicesSectionControls>
  )
}

DevicesSectionControls.propTypes = {
  deviceTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
}
DevicesSectionControls.displayName = DevicesSectionControlsName

export default DevicesSectionControls
