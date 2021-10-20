import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import PropTypes from 'prop-types' // ES6

import Styled from './styled'

const ComponentName = 'DiscardDialog'

const Component = (props) => {
  // eslint-disable-next-line no-unused-vars
  const {
    open,
    confirmDiscard,
  } = props

  return (
    <Styled.DiscardDialog>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Discard Changes?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will lose all your unsaved changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => confirmDiscard(false)} autoFocus>Do not discard</Button>
          <Button color="secondary" onClick={() => confirmDiscard(true)}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Styled.DiscardDialog>
  )
}

Component.propTypes = {
  open:           PropTypes.bool.isRequired,
  confirmDiscard: PropTypes.func.isRequired,

}
Component.displayName = ComponentName

export default Component
