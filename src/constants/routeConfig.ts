import { path } from 'src/routes/path'
import HomeIcon from 'src/assets/icons/i-home.svg?react'
import EventIcon from 'src/assets/icons/i-event.svg?react'
import EventPendingIcon from 'src/assets/icons/i-event-pending.svg?react'
import EventModeratedIcon from 'src/assets/icons/i-event-moderated.svg?react'
import UserIcon from 'src/assets/icons/i-user.svg?react'
import StudentIcon from 'src/assets/icons/i-student.svg?react'
import OrganizerIcon from 'src/assets/icons/i-organizer.svg?react'

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
    icon: StudentIcon
  },
  {
    path: path.organizerAccount,
    title: 'Quản lý tài khoản tổ chức',
    icon: OrganizerIcon
  },
  {
    path: path.createOrganizerAccount,
    title: 'Tạo tài khoản tổ chức',
    icon: OrganizerIcon
  },
  {
    path: path.eventPending,
    title: 'Sự kiện đang chờ duyệt',
    icon: EventPendingIcon
  },
  {
    path: path.eventModerated,
    title: 'Sự kiện đã duyệt',
    icon: EventModeratedIcon
  }
]
