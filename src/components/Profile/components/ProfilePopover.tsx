import UserIcon from 'src/assets/icons/i-user.svg?react'
import LogOutIcon from 'src/assets/icons/i-logout.svg?react'
import PasswordIcon from 'src/assets/icons/i-password.svg?react'
import { useAppContext } from 'src/contexts/app.context'
import { setupToken } from 'src/config/queryClient'

interface ProfilePopover {
  onClosePopover: () => void
  setIsShowProfilePopup: React.Dispatch<React.SetStateAction<boolean>>
  setIsShowChangePasswordPopup: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProfilePopover({
  onClosePopover,
  setIsShowProfilePopup,
  setIsShowChangePasswordPopup
}: ProfilePopover) {
  const { setIsAuthenticated } = useAppContext()

  const handleLogOut = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setupToken('')
  }

  return (
    <div className='overflow-hidden rounded-md border border-neutral-3 shadow-custom'>
      <div
        className='flex cursor-pointer items-center gap-3 py-2 pl-2 pr-6 hover:bg-neutral-2'
        onClick={() => {
          setIsShowProfilePopup(true)
          onClosePopover()
        }}
      >
        <UserIcon className='h-[20px] w-[20px]' />
        <span className='text-base text-neutral-6'>Thông tin cá nhân</span>
      </div>
      <div
        className='flex cursor-pointer items-center gap-3 py-2 pl-2 pr-6 hover:bg-neutral-2'
        onClick={() => {
          setIsShowChangePasswordPopup(true)
          onClosePopover()
        }}
      >
        <PasswordIcon className='h-[20px] w-[20px]' />
        <span className='text-base text-neutral-6'>Đổi mật khẩu</span>
      </div>
      <div className='flex cursor-pointer items-center gap-3 py-2 pl-2 pr-6 hover:bg-neutral-2' onClick={handleLogOut}>
        <LogOutIcon className='h-[20px] w-[20px]' />
        <span className='text-base text-neutral-6'>Đăng xuất</span>
      </div>
    </div>
  )
}
