import React, { useState } from 'react'
import PropTypes from 'prop-types' // ES6

import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'

import { Typography } from '@mui/material'
import Styled from './styled'

const ComponentName = 'FilterSelect'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width:     250,
    },
  },
}

const Component = (props) => {
  const {
    list,
    selectedList,
    onSelect,
    multiple,
    label,
  } = props

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    onSelect(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <Styled.FilterSelect>
      <FormControl sx={{
        display:       'flex',
        flexDirection: 'row',
        alignItems:    'center',
        ml:            3,
      }}
      >
        <Typography sx={{ mx: 2 }} variant="body1">{label}</Typography>
        <Select
          sx={{
            backgroundColor: 'background.default', height: 48, minWidth: 150,
          }}
          id="multiple-chip"
          multiple={multiple}
          value={selectedList}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" />}
          renderValue={(selection) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selection.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {list.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={selectedList.indexOf(option.id) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Styled.FilterSelect>
  )
}

Component.propTypes = {
  list:         PropTypes.array.isRequired,
  selectedList: PropTypes.array,
  onSelect:     PropTypes.func.isRequired,
  multiple:     PropTypes.bool.isRequired,
  label:        PropTypes.string.isRequired,

}
Component.defaultProps = {
  selectedList: [],
}
Component.displayName = ComponentName

export default Component
