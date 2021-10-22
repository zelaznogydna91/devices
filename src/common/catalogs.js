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

export const FilterWildcardKey = 'FilterWildcardKey'

export const FilterOptions = Object.keys(DeviceTypes)
  .map((type) => ({ id: type, label: DeviceFriendlyTypes[type] }))
  .unshift({ id: FilterWildcardKey, label: 'All' })

/**
 * Device List Sorting Options catalog
 */
export const SortCriteria = {
  systemName:  'systemName',
  hddCapacity: 'hddCapacity',
  none:        'none',
}

export const SortFriendlyCriteria = {
  [SortCriteria.systemName]:  'System Name',
  [SortCriteria.hddCapacity]: 'HDD Capacity',
}

export const SortCriteriaWildcardKey = 'SortCriteriaWildcardKey'

export const SortCriteriaOptions = Object.keys(SortCriteria)
  .map((criterion) => ({ id: criterion, label: SortFriendlyCriteria[criterion] }
  ))
  .unshift({ id: SortCriteriaWildcardKey, label: 'None' })
