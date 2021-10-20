/* eslint-disable import/prefer-default-export */

/**
 * App Sections catalog
 */
export const Sections = {
  Devices:     'Devices',
  DeviceSetup: 'DeviceSetup',
  MyProfile:   'MyProfile',
  LogOut:      'LogOut',
}
export const SectionsTitles = {
  [Sections.Devices]:     'Devices',
  [Sections.DeviceSetup]: 'Device Setup',
  [Sections.MyProfile]:   'My Profile',
  [Sections.LogOut]:      'Log Out',
}

/**
 * Device Types catalog
 */
export const DeviceTypes = {
  MAC:                 'MAC',
  WINDOWS_SERVER:      'WINDOWS_SERVER',
  WINDOWS_WORKSTATION: 'WINDOWS_WORKSTATION',
}

export const DeviceFriendlyTypes = {
  [DeviceTypes.MAC]:                 'Mac',
  [DeviceTypes.WINDOWS_SERVER]:      'Windows Server',
  [DeviceTypes.WINDOWS_WORKSTATION]: 'Windows Workstation',
}

/**
 * Device List Sorting Options catalog
 */
export const SortByOptions = [
  {
    label:     'System Name',
    criterion: 'systemName',
  }, {
    label:     'HDD Capacity',
    criterion: 'hddCapacity',
  },
]
