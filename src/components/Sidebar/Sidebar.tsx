import DutactLogo from 'src/assets/img/dutact-logo.png'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import Divider from '../Divider'
import { SIDEBAR_ROUTES } from './constants'
import { NavLink } from 'react-router-dom'
import { cn } from 'src/lib/tailwind/utils'
import LogOutIcon from 'src/assets/icons/i-logout.svg?react'
import { useAppContext } from 'src/contexts/app.context'
import { setupToken } from 'src/config/queryClient'
import { useUserRole } from 'src/hooks/useUserRole'
import { useProfile } from 'src/hooks/useProfile'
import { USER_ROLE_LABEL } from 'src/constants/common'

export default function Sidebar() {
  const { setIsAuthenticated } = useAppContext()
  const userRole = useUserRole()
  const { profile } = useProfile()

  const handleLogOut = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setupToken('')
  }

  return (
    <div className='fixed bottom-0 left-0 top-0 flex h-[100vh] w-sidebar flex-col border-r-[1px] border-r-neutral-3 px-6 py-4'>
      {/* Logo */}
      <div className='ml-[-10px] flex items-center gap-1'>
        <img src={DutactLogo} alt='dutact-logo' className='h-logo-lg w-logo-lg' />
        <div className='text-xl font-semibold tracking-wide'>Dutact.</div>
      </div>
      {/* User info */}
      <div className='mt-4 flex gap-2'>
        <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
          <img
            className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
            src={profile?.avatarUrl || DUTLogo}
            alt='dut-logo'
          />
        </div>
        <div className='flex flex-col'>
          <div className='line-clamp-2 overflow-ellipsis text-sm font-semibold text-neutral-8'>{profile?.name}</div>
          <div className='mt-1 line-clamp-1 overflow-ellipsis text-xs font-medium text-neutral-5'>
            #{USER_ROLE_LABEL[userRole]}
          </div>
        </div>
      </div>
      <Divider className='mt-4' />
      <div className='mt-4 flex flex-1 flex-col items-start justify-start gap-2'>
        {SIDEBAR_ROUTES.filter((route) => route.userRoles.includes(userRole)).map(
          ({ path, name, icon: Icon, iconActive: IconActive, subRoutes }) => (
            <>
              <NavLink
                key={path}
                to={path}
                onClick={(e) => {
                  if (subRoutes) {
                    e.preventDefault()
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-4 py-2 text-neutral-5',
                  subRoutes ? 'cursor-auto hover:text-neutral-5' : 'hover:bg-neutral-3 hover:text-neutral-6'
                )}
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    {isActive ? <IconActive className='h-[24px] w-[24px]' /> : <Icon className='h-[24px] w-[24px]' />}
                    <div
                      className={cn('test-base', {
                        'font-medium text-semantic-secondary': isActive,
                        'font-normal': !isActive
                      })}
                    >
                      {name}
                    </div>
                  </>
                )}
              </NavLink>
              {subRoutes && (
                <div className='ml-4'>
                  {subRoutes.map(({ path, name, icon: Icon, iconActive: IconActive }) => (
                    <NavLink
                      key={path}
                      to={path}
                      className='flex w-full items-center gap-2 rounded-lg px-4 py-2 text-neutral-5 hover:bg-neutral-3 hover:text-neutral-6'
                    >
                      {({ isActive }: { isActive: boolean }) => (
                        <>
                          {isActive ? (
                            <IconActive className='h-[24px] w-[24px]' />
                          ) : (
                            <Icon className='h-[24px] w-[24px]' />
                          )}
                          <div
                            className={cn('test-base', {
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
              )}
            </>
          )
        )}
      </div>
      <div
        className='flex w-full items-center gap-2 rounded-lg px-4 py-2 text-neutral-5 hover:cursor-pointer hover:bg-neutral-3 hover:text-neutral-6'
        onClick={handleLogOut}
      >
        <LogOutIcon className='h-[24px] w-[24px]' />
        <div className='test-base font-normal'>Đăng xuất</div>
      </div>
      <Divider className='mt-4' />
      <div className='mt-2 flex gap-2'>
        <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
          <img
            className='absolute left-0 top-0 mx-auto h-full w-full border-[1px] border-gray-200 object-cover'
            src={DUTLogo}
            alt='dut-logo'
          />
        </div>
        <div className='flex max-w-[150px] flex-col'>
          <div className='text-xs font-medium text-neutral-5'>Bản quyền thuộc về</div>
          <div className='text-xs font-medium text-neutral-7'>Trường Đại học Bách khoa Đà Nẵng</div>
        </div>
      </div>
    </div>
  )
}
