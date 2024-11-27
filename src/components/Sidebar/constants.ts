import { path } from 'src/routes/path'
import HomeIcon from 'src/assets/icons/i-home.svg?react'
import HomeActiveIcon from 'src/assets/icons/i-home-active.svg?react'
import UserIcon from 'src/assets/icons/i-user.svg?react'
import UserActiveIcon from 'src/assets/icons/i-user-active.svg?react'
import OrganizerIcon from 'src/assets/icons/i-organizer.svg?react'
import OrganizerActiveIcon from 'src/assets/icons/i-organizer-active.svg?react'
import StudentIcon from 'src/assets/icons/i-student.svg?react'
import StudentActiveIcon from 'src/assets/icons/i-student-active.svg?react'
import EventIcon from 'src/assets/icons/i-event.svg?react'
import EventActiveIcon from 'src/assets/icons/i-event-active.svg?react'
import EventModIcon from 'src/assets/icons/i-event-mod.svg?react'
import EventModActiveIcon from 'src/assets/icons/i-event-mod-active.svg?react'
import { USER_ROLE } from 'src/constants/common'

export const SIDEBAR_ROUTES = [
  {
    path: path.home,
    name: 'Dashboard',
    icon: HomeIcon,
    iconActive: HomeActiveIcon,
    userRoles: [USER_ROLE.ADMIN, USER_ROLE.STUDENT_AFFAIRS_OFFICE, USER_ROLE.EVENT_ORGANIZER]
  },
  {
    path: path.account,
    name: 'Quản lý tài khoản',
    icon: UserIcon,
    iconActive: UserActiveIcon,
    userRoles: [USER_ROLE.ADMIN],
    subRoutes: [
      {
        path: path.studentAccount,
        name: 'Quản lý tài khoản sinh viên',
        icon: StudentIcon,
        iconActive: StudentActiveIcon,
        userRoles: [USER_ROLE.ADMIN]
      },
      {
        path: path.organizerAccount,
        name: 'Quản lý tài khoản tổ chức',
        icon: OrganizerIcon,
        iconActive: OrganizerActiveIcon,
        userRoles: [USER_ROLE.ADMIN]
      }
    ]
  },
  {
    path: path.event,
    name: 'Quản lý sự kiện nội bộ',
    icon: EventIcon,
    iconActive: EventActiveIcon,
    userRoles: [USER_ROLE.STUDENT_AFFAIRS_OFFICE, USER_ROLE.EVENT_ORGANIZER]
  },
  {
    path: path.eventMod,
    name: 'Kiểm duyệt sự kiện',
    icon: EventModIcon,
    iconActive: EventModActiveIcon,
    userRoles: [USER_ROLE.STUDENT_AFFAIRS_OFFICE]
  }
]
