import { path } from 'src/routes/path'
import HomeIcon from 'src/assets/icons/i-home.svg?react'
import EventIcon from 'src/assets/icons/i-event.svg?react'
import UserIcon from 'src/assets/icons/i-user.svg?react'

export const ROUTE_CONFIG = [
  {
    path: path.home,
    title: 'Dashboard',
    icon: HomeIcon
  },
  {
    path: path.event,
    title: 'Quản lý sự kiện',
    icon: EventIcon
  },
  {
    path: path.user,
    title: 'Quản lý người dùng',
    icon: UserIcon
  }
]