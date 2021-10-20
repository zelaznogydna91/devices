/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux'
import {
  useMemo,
  useRef,
  useCallback,
} from 'react'
import { Sections } from 'common/catalogs'
import {
  openDevices,
  openDeviceSetup,
} from './generalSlice'

const useAppGeneral = () => {
  const dispatch = useDispatch()

  const activeSectionId = useSelector((s) => s.general.activeSectionId)
  const sectionParams = useSelector((s) => s.general.sectionParams)

  const sectionChangeCbRef = useRef(null)
  const onSectionChange = useCallback((cb) => {
    sectionChangeCbRef.current = cb
  }, [])

  const actions = useMemo(() => {
    const confirmTransition = (toSectionId, doTransition) => {
      if (!sectionChangeCbRef.current) {
        doTransition()
        return
      }

      if (sectionChangeCbRef.current(toSectionId, doTransition)) {
        doTransition()
      }
    }

    const openDevicesAction = () => {
      confirmTransition(
        Sections.Devices,
        () => dispatch(openDevices()),
      )
    }
    const openDeviceSetupAction = (deviceId = false) => {
      confirmTransition(
        Sections.DeviceSetup,
        () => dispatch(openDeviceSetup({ deviceId })),
      )
    }

    return {
      openDevices:     openDevicesAction,
      openDeviceSetup: openDeviceSetupAction,

      goToSection: (sectionId, params = {}) => {
        switch (sectionId) {
          case Sections.Devices:
            openDevicesAction()
            break
          case Sections.DeviceSetup:
            openDeviceSetupAction(params.deviceId)
            break
          default:
            break
        }
      },
    }
  }, [])

  return {
    actions, activeSectionId, sectionParams, onSectionChange,
  }
}

export default useAppGeneral
