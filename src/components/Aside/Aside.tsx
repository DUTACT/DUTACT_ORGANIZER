import NotificationIcon from 'src/assets/icons/i-notification.svg?react'
import ExpandIcon from 'src/assets/icons/i-chevron-down.svg?react'
import DUTLogo from 'src/assets/img/dut-logo.jpg'

export default function Aside() {
  return (
    <div className='fixed bottom-0 right-0 top-0 flex h-[100vh] w-aside flex-col border-l-[1px] border-l-neutral-3'>
      <div className='flex h-header w-full items-center justify-between px-4'>
        {/* Notification */}
        <div>
          <NotificationIcon className='h-[20px] w-[20px]' />
        </div>
        {/* Personal information */}
        <div className='flex items-center gap-0 rounded-full hover:cursor-pointer hover:bg-neutral-2'>
          <div className='relative h-logo-sm min-h-logo-sm w-logo-sm min-w-logo-sm'>
            <img
              className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
              src={DUTLogo}
              alt='dut-logo'
            />
          </div>
          <ExpandIcon className='h-[20px] w-[20px]' />
        </div>
      </div>
    </div>
  )
}
