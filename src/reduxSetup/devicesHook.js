/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux'
import {
  listDevices,
  deleteDevice,
  updateDevice,
  addDevice,
  setFilters,
  setSortCriteria,
} from 'reduxSetup/devicesSlice'
import { useEffect, useMemo } from 'react'

const useAppDevices = () => {
  const dispatch = useDispatch()
  const list = useSelector((s) => s.devices.outputList)
  const filters = useSelector((s) => s.devices.filters)
  const sortCriteria = useSelector((s) => s.devices.sortCriteria)
  const justAdded = useSelector((s) => s.devices.justAdded)

  const actions = useMemo(() => {
    const changeAndRelistDevices = (changer, paramsKeys) => (...params) => {
      const payload = paramsKeys.reduce(
        (p, k, i) => Object.assign(p, { [k]: params[i] }),
        {},
      )
      dispatch(changer(payload))
        .then(() => {
          dispatch(listDevices())
        })
    }
    return {
      getList:      () => { dispatch(listDevices()) },
      updateDevice: changeAndRelistDevices(updateDevice, ['id', 'data']),
      addDevice:    changeAndRelistDevices(addDevice, ['data']),
      deleteDevice: changeAndRelistDevices(deleteDevice, ['id']),
      filter:       (selection) => { dispatch(setFilters({ selection })) },
      sortBy:       (criteria) => {
        debugger
        dispatch(setSortCriteria({ criteria }))
      },
    }
  }, [])

  useEffect(() => {
    actions.getList()
  }, [])

  return {
    actions,
    list,
    filters,
    sortCriteria,
    justAdded,
  }
}

export default useAppDevices
