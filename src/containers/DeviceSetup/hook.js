/* eslint-disable no-param-reassign */
import React, {
  useReducer, useMemo, useEffect, useRef,
} from 'react'

export const SetupFields = {
  systemName:  'systemName',
  deviceType:  'deviceType',
  hddCapacity: 'hddCapacity',
}

export const CancelOperations = {
  cancel:  'cancel',
  discard: 'discard',
}

const initialState = {
  operationTitle: 'Device Edition',
  editedFields:   {
    [SetupFields.systemName]:  '',
    [SetupFields.deviceType]:  '',
    [SetupFields.hddCapacity]: '',
  },
  initialFields: {
    [SetupFields.systemName]:  '',
    [SetupFields.deviceType]:  '',
    [SetupFields.hddCapacity]: '',
  },
  isDirty:             false,
  cancelOperation:     CancelOperations.cancel,
  discardAlertVisible: false,
}

const ActionTypes = {
  setOperationTitle: 'setOperationTitle',
  setInitialFields:  'setInitialFields',
  setField:          'setField',
  save:              'save',
  showDiscardAlert:  'showDiscardAlert',
  confirmDiscard:    'confirmDiscard',
}

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.setOperationTitle:
      return {
        ...state,
        operationTitle: action.title,
      }

    case ActionTypes.showDiscardAlert:
      return {
        ...state,
        discardAlertVisible: true,
      }

    case ActionTypes.confirmDiscard:
      return action.confirmed
        ? {
          ...state,
          discardAlertVisible: false,
          isDirty:             false,
          editedFields:        { ...state.initialFields },
          cancelOperation:     CancelOperations.cancel,
        }
        : {
          ...state,
          discardAlertVisible: false,
        }

    case ActionTypes.setInitialFields:
      return {
        ...state,
        initialFields:   action.initial,
        isDirty:         false,
        editedFields:    { ...action.initial },
        cancelOperation: CancelOperations.cancel,
      }

    case ActionTypes.setField: {
      const isDirty = action.value !== state.initialFields[action.fieldName]
      const cancelOperation = isDirty ? CancelOperations.discard : CancelOperations.cancel
      return {
        ...state,
        editedFields: {
          ...state.editedFields,
          [action.fieldName]: action.value,
        },
        isDirty,
        cancelOperation,
      }
    }

    default:
      throw new Error()
  }
}

const UserActions = (dispatch, stateRef, actionsMemRef, updateDevice, closeDeviceSetup) => ({
  setOperationTitle: (title) => dispatch({ type: ActionTypes.setOperationTitle, title }),
  setInitialFields:  (initial) => dispatch({ type: ActionTypes.setInitialFields, initial }),
  setField:          (fieldName, value) => dispatch({
    type: ActionTypes.setField,
    fieldName,
    value,
  }),
  save: () => {
    debugger
    const { deviceId } = actionsMemRef.current
    const data = { ...stateRef.current.editedFields }
    debugger
    updateDevice(deviceId, data)
    // dispatch({ type: ActionTypes.save })
  },
  cancel: (continuation = null) => {
    if (typeof continuation === 'function') {
      actionsMemRef.current.cancelContinuation = continuation
    }

    if (stateRef.current.isDirty) {
      dispatch({ type: ActionTypes.showDiscardAlert })
    } else {
      closeDeviceSetup()
    }
  },
  confirmDiscard: (confirmed) => {
    dispatch({ type: ActionTypes.confirmDiscard, confirmed })

    if (confirmed) {
      // follow any pending cancel continuation
      const { cancelContinuation } = actionsMemRef.current
      if (cancelContinuation) {
        cancelContinuation()
        actionsMemRef.current.cancelContinuation = null
      }
    }
  },
})

const useDeviceSetup = ({ editingDevice, updateDevice, closeDeviceSetup }) => {
  const stateRef = useRef()
  const [state, dispatch] = useReducer(reducer, initialState)
  stateRef.current = state

  const actionsMemRef = useRef({ deviceId: editingDevice.id })
  const actions = useMemo(
    () => UserActions(dispatch, stateRef, actionsMemRef, updateDevice, closeDeviceSetup),
    [],
  )

  useEffect(() => {
    if (editingDevice) {
      actions.setOperationTitle('Edit device')

      const initial = Object.keys(SetupFields)
        .reduce(
          (o, fieldName) => Object.assign(o, { [fieldName]: editingDevice[fieldName] }),
          {},
        )

      actions.setInitialFields(initial)
    } else actions.setOperationTitle('New device')
  }, [editingDevice])

  return [state, actions]
}

export default useDeviceSetup
