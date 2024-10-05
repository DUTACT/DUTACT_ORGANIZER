import DutactLogo from 'src/assets/img/dutact-logo.png'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import Divider from '../Divider'
import { SIDEBAR_ROUTES } from './constants'
import { NavLink } from 'react-router-dom'
import { cn } from 'src/lib/tailwind/utils'
import LogOutIcon from 'src/assets/icons/i-logout.svg?react'
import { useAppContext } from 'src/contexts/app.context'

export default function Sidebar() {
  const { setIsAuthenticated } = useAppContext()

  const handleLogOut = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
  }

  return (
    <div className='fixed h-[100vh] w-sidebar top-0 bottom-0 left-0 px-6 py-4 flex flex-col border-r-[1px] border-r-neutral-3'>
      {/* Logo */}
      <div className='flex gap-1 items-center ml-[-10px]'>
        <img src={DutactLogo} alt='dutact-logo' className='h-logo-lg w-logo-lg' />
        <div className='text-xl font-semibold tracking-wide'>Dutact.</div>
      </div>
      {/* User info */}
      <div className='mt-4 flex gap-2'>
        <div className='relative min-h-logo-md min-w-logo-md h-logo-md w-logo-md'>
          <img
            className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
            src={DUTLogo}
            alt='dut-logo'
          />
        </div>
        <div className='flex flex-col'>
          <div className='text-neutral-8 font-semibold text-sm overflow-ellipsis line-clamp-2'>
            Phòng Công tác sinh viên
          </div>
          <div className='text-neutral-5 font-medium text-xs overflow-ellipsis line-clamp-1 mt-1'>@Tổ chức</div>
        </div>
      </div>
      <Divider className='mt-4' />
      <div className='flex flex-1 flex-col items-start justify-start gap-2 mt-4'>
        {SIDEBAR_ROUTES.map(({ path, name, icon: Icon, iconActive: IconActive }) => (
          <NavLink
            key={path}
            to={path}
            className='flex gap-2 w-full px-4 py-2 hover:bg-neutral-3 rounded-lg text-neutral-5 hover:text-neutral-6 items-center'
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                {isActive ? <IconActive className='h-[24px] w-[24px]' /> : <Icon className='h-[24px] w-[24px]' />}
                <div
                  className={cn('text-md', {
                    'font-medium text-semantic-secondary': isActive,
                    'font-normal': !isActive
                  })}
                >
                  {name}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div
        className='flex gap-2 w-full px-4 py-2 hover:bg-neutral-3 rounded-lg items-center hover:cursor-pointer hover:text-neutral-6 text-neutral-5'
        onClick={handleLogOut}
      >
        <LogOutIcon className='h-[24px] w-[24px]' />
        <div className='text-md font-normal'>Đăng xuất</div>
      </div>
      <Divider className='mt-4' />
      <div className='flex gap-2 mt-2'>
        <div className='relative min-h-logo-md min-w-logo-md h-logo-md w-logo-md'>
          <img
            className='absolute left-0 top-0 mx-auto h-full w-full border-[1px] border-gray-200 object-cover'
            src={DUTLogo}
            alt='dut-logo'
          />
        </div>
        <div className='flex flex-col max-w-[150px]'>
          <div className='text-xs font-medium text-neutral-5'>Bản quyền thuộc về</div>
          <div className='text-xs font-medium text-neutral-7'>Trường Đại học Bách khoa Đà Nẵng</div>
        </div>
      </div>
    </div>
  )
}
