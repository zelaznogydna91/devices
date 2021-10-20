/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux'
import { listDevices, deleteDevice, updateDevice } from 'reduxSetup/devicesSlice'
import { useEffect, useMemo } from 'react'

const useAppDevices = () => {
  const dispatch = useDispatch()
  const list = useSelector((s) => s.devices.outputList)

  const actions = useMemo(() => ({
    getList:      () => { dispatch(listDevices()) },
    deleteDevice: (id) => { dispatch(deleteDevice({ id })) },
    updateDevice: (id, data) => {
      debugger
      dispatch(updateDevice({ id, data }))
        .then(() => {
          debugger
          dispatch(listDevices())
        })
    },
  }), [])

  useEffect(() => {
    actions.getList()
  }, [])

  return { actions, list }
}

export default useAppDevices
