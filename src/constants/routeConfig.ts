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
    title: 'Quản lý sự kiện nội bộ',
    icon: EventIcon
  },
  {
    path: path.account,
    title: 'Quản lý người dùng',
    icon: UserIcon
  },
  {
    path: path.studentAccount,
    title: 'Quản lý tài khoản sinh viên',
    icon: UserIcon
  }
]
