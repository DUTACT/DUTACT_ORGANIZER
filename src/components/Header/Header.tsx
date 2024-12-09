import { useAppContext } from 'src/contexts/app.context'
import Profile from '../Profile'

export default function Header() {
  const { currentPageInfo } = useAppContext()
  const { title: pageTitle, icon: Icon } = currentPageInfo || {
    title: '',
    icon: null
  }
  return (
    <div className='absolute left-0 right-0 top-0 flex h-header w-full border-b-[1px] border-b-neutral-3 px-4 shadow-sm'>
      {currentPageInfo && (
        <div className='flex h-full w-full items-center gap-2 hover:cursor-default'>
          {Icon && <Icon className='h-[20px] w-[20px]' />}
          <div className='text-sm font-medium text-neutral-6'>{pageTitle}</div>
        </div>
      )}
      <div className='flex h-full items-center justify-end'>
        <Profile />
      </div>
    </div>
  )
}
