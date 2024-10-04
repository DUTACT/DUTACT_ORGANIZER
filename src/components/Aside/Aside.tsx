import NotificationIcon from 'src/assets/icons/i-notification.svg?react'
import ExpandIcon from 'src/assets/icons/i-chevron-down.svg?react'
import DUTLogo from 'src/assets/img/dut-logo.jpg'

export default function Aside() {
  return (
    <div className='w-aside fixed top-0 bottom-0 right-0 h-[100vh] border-l-[1px] border-l-neutral-3 flex flex-col'>
      <div className='w-full flex justify-between h-header items-center px-4'>
        {/* Notification */}
        <div>
          <NotificationIcon className='w-[20px] h-[20px]' />
        </div>
        {/* Personal information */}
        <div className='flex gap-0 items-center hover:cursor-pointer hover:bg-neutral-2 rounded-full'>
          <div className='relative min-h-logo-sm min-w-logo-sm h-logo-sm w-logo-sm'>
            <img
              className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
              src={DUTLogo}
              alt='dut-logo'
            />
          </div>
          <ExpandIcon className='w-[20px] h-[20px]' />
        </div>
      </div>
    </div>
  )
}
