import NotificationIcon from 'src/assets/icons/i-notification.svg?react'
import Profile from '../Profile'

export default function Aside() {
  return (
    <div className='fixed bottom-0 right-0 top-0 flex h-[100vh] w-aside flex-col border-l-[1px] border-l-neutral-3'>
      <div className='flex h-header w-full items-center justify-between px-4'>
        {/* Notification */}
        <div>
          <NotificationIcon className='h-[20px] w-[20px]' />
        </div>
        {/* Personal information */}
        <Profile />
      </div>
    </div>
  )
}
