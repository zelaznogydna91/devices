/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux'
import {
  useMemo,
  useRef,
  useCallback,
} from 'react'
import { Sections } from 'common/catalogs'
import {
  setSectionChangeListener,
  openDevices,
  openDeviceSetup,
} from './generalSlice'

const useAppGeneral = () => {
  const dispatch = useDispatch()

  const sectionChangeListener = useSelector((s) => s.general.sectionChangeListener)
  const activeSectionId = useSelector((s) => s.general.activeSectionId)
  const sectionParams = useSelector((s) => s.general.sectionParams)

  const onSectionChange = useCallback((listener) => {
    dispatch(setSectionChangeListener({ listener }))
  }, [])

  const sectionChangeCbRef = useRef(null)
  sectionChangeCbRef.current = sectionChangeListener

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
        () => {
          dispatch(openDevices())
        },
      )
    }
    const openDeviceSetupAction = (deviceId = false) => {
      confirmTransition(
        Sections.DeviceSetup,
        () => dispatch(openDeviceSetup({ deviceId })),
      )
    }
    const openMyProfileAction = () => {
      confirmTransition(
        Sections.LogOut,
        () => {
          window.location.href = 'https://www.linkedin.com/in/zelaznogydna/'
        },
      )
    }
    const logOutAction = () => {
      confirmTransition(
        Sections.LogOut,
        () => {
          window.location.href = 'https://www.ninjarmm.com/'
        },
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
          case Sections.MyProfile:
            openMyProfileAction()
            break
          case Sections.LogOut:
            logOutAction()
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
