/* eslint-disable import/prefer-default-export */
import AddIcon from '@mui/icons-material/Add'
import AppleIcon from '@mui/icons-material/Apple'
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DevicesOtherIcon from '@mui/icons-material/DevicesOther'
import DoneIcon from '@mui/icons-material/Done'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SdStorageIcon from '@mui/icons-material/SdStorage'
import SpaceBarIcon from '@mui/icons-material/SpaceBar'
import StorageIcon from '@mui/icons-material/Storage'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import WindowIcon from '@mui/icons-material/Window'

export const Icons = {
  AddDevice:               AddIcon,
  ClearSort:               CleaningServicesOutlinedIcon,
  Devices:                 DevicesOtherIcon,
  DeviceTypeMac:           AppleIcon,
  DeviceTypeWindow:        WindowIcon,
  DeviceTypeWindowsServer: StorageIcon,
  Done:                    DoneIcon,
  HddCapacity:             SdStorageIcon,
  Logout:                  LogoutIcon,
  MoreVert:                MoreVertIcon,
  NoSelection:             SpaceBarIcon,
  Profile:                 PersonOutlineIcon,
  SystemName:              SupervisedUserCircleIcon,
  EditDevice:              EditIcon,
  DeleteDevice:            DeleteForeverIcon,
}

export const Colors = {
  // By role
  primary:             '#2b4259', // NinjaRMM's
  secondary:           '#ce2043',
  tertiary:            '#0257ac',
  success:             '#4BB543',
  error:               '#ff0033',
  warning:             '#FDC410',
  lightText:           '#F9F9F9',
  clear:               'rgba(0,0,0,0)',
  overlay:             'rgba(51,51,51,0.7)',
  fadedPrime:          'rgba(35,87,137,0.7)',
  fadedBlack:          'rgba(0,0,0,0.7)',
  hover:               'rgba(0,0,0,0.05)',
  hashtagBack:         '#E4F3FB',
  linkText:            '#4784BB',
  // NinjaRMM's
  blue:                '#1DA1F2',
  black:               '#14171A',
  darkGray:            '#657786',
  lightGray:           '#AAB8C2',
  extraLightGray:      '#E1E8ED',
  extraextraLightGray: '#F5F8FA',
  backdrop:            '#F9F9F9',
}
