import React from 'react'
import PropTypes from 'prop-types' // ES6
import { SortCriteria } from 'common/catalogs'

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Colors, Icons } from 'common/theme'

import {
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material'

import Styled from './styled'
import useSortBySelect from './hook'

const ComponentName = 'SortBySelect'

const Component = (props) => {
  const {
    criteriaData,
    criteriaDescriptors,
    withLabel,
    onApplySorting,
    onClearAll,
  } = props
  const criteriaKeys = Object.keys(criteriaDescriptors)

  const [state, actions] = useSortBySelect(
    criteriaKeys,
    criteriaData,
    {
      onApply: onApplySorting,
      onClear: onClearAll,
    },

  )

  const { clearable, isDirty, newCriteriaOptions } = state

  return (
    <Styled.SortBySelect>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        {withLabel && <Typography color="info" sx={{ ml: 4, mr: 1 }} variant="body1">Sort By</Typography>}
        <ToggleButtonGroup
          // value={activeCriteria}
          // onChange={(e, v) => actions.setNextCriterionStep(v)}
          aria-label="sort-by-selecting"
        >
          {newCriteriaOptions && criteriaKeys.map((criterionKey) => {
            const { tooltip, IconComponent } = criteriaDescriptors[criterionKey]
            const { active, ascendingOrder, order } = newCriteriaOptions[criterionKey]
            return (
              <Styled.ToggleButton
                key={criterionKey}
                selected={active}
                onClick={() => actions.setNextCriterionStep(criterionKey)}
                color="info"
                // value={criterionKey}
                aria-label={tooltip}
              >
                <Tooltip title={tooltip} placement="bottom">
                  <IconComponent /* sx={{ color: Colors.lightText }} */ />
                </Tooltip>
                {active && <div id="sort-direction">{ascendingOrder ? 'ꜛ' : 'ꜜ'}</div>}
                {active && <div id="sort-order">{order}</div>}
              </Styled.ToggleButton>
            )
          })}
        </ToggleButtonGroup>
        <Styled.IconButton color="success" size="small" disabled={!isDirty} onClick={actions.applyNewCriteriaOptions}>
          <Icons.Done />
        </Styled.IconButton>
        <Styled.IconButton color="secondary" size="small" disabled={!clearable} onClick={actions.clear}>
          <Icons.ClearSort />
        </Styled.IconButton>
      </Stack>
    </Styled.SortBySelect>
  )
}

const descriptorPropTypes = PropTypes.shape({
  IconComponent: PropTypes.elementType.isRequired,
  tooltip:       PropTypes.string.isRequired,
})

Component.propTypes = {
  withLabel:           PropTypes.string.isRequired,
  criteriaDescriptors: PropTypes.shape({
    [SortCriteria.hddCapacity]: descriptorPropTypes.isRequired,
    [SortCriteria.systemName]:  descriptorPropTypes.isRequired,
  }).isRequired,
  criteriaData: PropTypes.arrayOf(PropTypes.shape({
    icon:           PropTypes.node.isRequired,
    key:            PropTypes.string.isRequired,
    active:         PropTypes.bool.isRequired,
    ascendingOrder: PropTypes.bool.isRequired,
  })).isRequired,
  onApplySorting: PropTypes.func.isRequired,
  onClearAll:     PropTypes.func.isRequired,

}

Component.displayName = ComponentName

export default Component
