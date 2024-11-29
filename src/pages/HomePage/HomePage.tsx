import { useNavigate } from 'react-router-dom'
import { USER_ROLE } from 'src/constants/common'
import { useUserRole } from 'src/hooks/useUserRole'
import { path } from 'src/routes/path'

export default function HomePage() {
  const navigate = useNavigate()
  const userRole = useUserRole()
  const redirectPath =
    userRole === USER_ROLE.ADMIN
      ? path.studentAccount
      : userRole === USER_ROLE.STUDENT_AFFAIRS_OFFICE
        ? path.eventPending
        : path.event

  navigate(redirectPath)
  return <></>
}
