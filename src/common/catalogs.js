/* eslint-disable import/prefer-default-export */

/**
 * App Sections catalog
 */
export const Sections = {
  Devices:     'Devices',
  DeviceSetup: 'DeviceSetup',
  NewDevice:   'NewDevice',
  MyProfile:   'MyProfile',
  LogOut:      'LogOut',
}
export const SectionsTitles = {
  [Sections.Devices]:     'Devices',
  [Sections.DeviceSetup]: 'Device Setup',
  [Sections.NewDevice]:   'New Device',
  [Sections.MyProfile]:   'My Profile',
  [Sections.LogOut]:      'Log Out',
}

/**
 * Device fields catalog
 */
export const DeviceFields = {
  systemName:  'systemName',
  deviceType:  'deviceType',
  hddCapacity: 'hddCapacity',
}

export const DeviceFriendlyFields = {
  [DeviceFields.systemName]:  'System Name',
  [DeviceFields.deviceType]:  'Device Type',
  [DeviceFields.hddCapacity]: 'HDD Capacity',
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
