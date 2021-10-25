/* eslint-disable no-param-reassign */
import {
  useReducer, useMemo, useEffect, useRef,
} from 'react'
import { DeviceTypes, DeviceFields, DeviceFriendlyFields } from 'common/catalogs'
import * as yup from 'yup'
import { setupPageBlock } from '@zelaznogydna/utils'

export const CancelOperations = {
  cancel:  'cancel',
  discard: 'discard',
}

const initialState = {
  operationTitle: 'Device Edition',
  initialFields:  {
    [DeviceFields.systemName]:  '',
    [DeviceFields.deviceType]:  '',
    [DeviceFields.hddCapacity]: '',
  },
  editedFields: {
    [DeviceFields.systemName]:  '',
    [DeviceFields.deviceType]:  '',
    [DeviceFields.hddCapacity]: '',
  },
  validationErrors:    false,
  isDirty:             false,
  isSaving:            false,
  cancelOperation:     CancelOperations.cancel,
  discardAlertVisible: false,
}

const ActionTypes = {
  setOperationTitle: 'setOperationTitle',
  setInitialFields:  'setInitialFields',
  setField:          'setField',
  invalidData:       'invalidData',
  setSaving:         'setSaving',
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

      const nextValidationErrors = state.validationErrors && { ...state.validationErrors }
      if (nextValidationErrors && nextValidationErrors[action.fieldName]) {
        delete nextValidationErrors[action.fieldName] // cleared by edition
      }
      return {
        ...state,
        editedFields: {
          ...state.editedFields,
          [action.fieldName]: action.value,
        },
        isDirty,
        cancelOperation,
        validationErrors: nextValidationErrors,
      }
    }

    case ActionTypes.invalidData:
      return {
        ...state,
        validationErrors: action.validationErrors,
      }

    case ActionTypes.setSaving:
      return {
        ...state,
        isSaving: true,
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

    default:
      throw new Error(`Undefined reaction type: [${action.type}]`)
  }
}

const fieldRequiredMsg = (fieldName) => `${DeviceFriendlyFields[fieldName]} is required.`
const fieldMinMsg = (fieldName, minMsg) => `${DeviceFriendlyFields[fieldName]} ${minMsg}.`

const dataSchema = yup.object().shape({
  [DeviceFields.systemName]: yup.string()
    .required(fieldRequiredMsg(DeviceFields.systemName)),

  [DeviceFields.deviceType]: yup.string()
    // .required(fieldRequiredMsg(DeviceFields.deviceType))
    .matches(/^(?!.*none).*/, {
      message:            fieldRequiredMsg(DeviceFields.deviceType),
      excludeEmptyString: true,
    }),

  [DeviceFields.hddCapacity]: yup.string()
    .required(fieldRequiredMsg(DeviceFields.hddCapacity))
    .matches(/^\d+$/, {
      message:            fieldMinMsg(DeviceFields.hddCapacity, 'minimum valid is 1 GB'),
      excludeEmptyString: true,
    }),
  // .integer(fieldMinMsg(DeviceFields.hddCapacity, 'minimun valid is 1 GB.')).min(1),
})

const dataValidation = (data) => dataSchema
  .validate(data, { abortEarly: false })
  .then(() => ({ ok: true }))
  .catch((error) => {
    const errorsMap = {}
    error.inner.forEach((e, i) => {
      errorsMap[e.path] = error.errors[i]
    })
    return { ok: false, errors: errorsMap }
  })

const UserActions = (dispatch, stateRef, actionsMemRef, handlers) => ({
  setOperationTitle: (title) => dispatch({ type: ActionTypes.setOperationTitle, title }),
  setInitialFields:  (initial) => dispatch({ type: ActionTypes.setInitialFields, initial }),
  setField:          (fieldName, value) => dispatch({
    type: ActionTypes.setField,
    fieldName,
    value,
  }),
  save: async () => {
    const { updateDevice, addDevice, closeDeviceSetup } = handlers
    const { deviceId } = actionsMemRef.current
    const data = { ...stateRef.current.editedFields }
    const editingDeviceId = actionsMemRef.current.deviceId

    const result = await dataValidation(data)

    if (result.ok === false) {
      dispatch({ type: ActionTypes.invalidData, validationErrors: result.errors })
      return
    }

    if (editingDeviceId) updateDevice(deviceId, data)
    else {
      dispatch({ type: ActionTypes.setSaving })
      addDevice(data)
      setTimeout(closeDeviceSetup, 10)
    }
  },
  cancel: (continuation = null) => {
    const { closeDeviceSetup } = handlers

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

const useDeviceSetup = ({
  editingDevice,
  handlers,
}) => {
  const stateRef = useRef()
  const [state, dispatch] = useReducer(reducer, initialState)
  stateRef.current = state

  const actionsMemRef = useRef({})
  if (editingDevice) actionsMemRef.current.deviceId = editingDevice.id

  const actions = useMemo(
    () => UserActions(dispatch, stateRef, actionsMemRef, handlers),
    [],
  )

  useEffect(() => {
    if (editingDevice) {
      actions.setOperationTitle('Edit device')

      const initial = Object.keys(DeviceFields)
        .reduce(
          (o, fieldName) => Object.assign(o, { [fieldName]: editingDevice[fieldName] }),
          {},
        )

      actions.setInitialFields(initial)
    } else actions.setOperationTitle('New device')
  }, [editingDevice])

  useEffect(() => {
    setupPageBlock(state.isDirty)
  }, [state.isDirty])

  useEffect(() => {
    const handleDirtyNavigation = () => {
      actions.cancel()
    }
    window.addEventListener('popstate', handleDirtyNavigation)
    return () => {
      window.removeEventListener('popstate', handleDirtyNavigation)
    }
  }, [])
  return [state, actions]
}

export default useDeviceSetup
