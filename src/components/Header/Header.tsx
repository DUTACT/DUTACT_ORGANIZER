import { useAppContext } from 'src/contexts/app.context'

export default function Header() {
  const { currentPageInfo } = useAppContext()
  const { title: pageTitle, icon: Icon } = currentPageInfo || {
    title: '',
    icon: null
  }
  return (
    <div className='absolute top-0 left-0 right-0 w-full h-header border-b-[1px] border-b-neutral-3 shadow-sm '>
      {currentPageInfo && (
        <div className='flex items-center px-4 w-full h-full gap-2 hover:cursor-default'>
          {Icon && <Icon className='h-[20px] w-[20px]' />}
          <div className='text-neutral-6 text-sm font-medium'>{pageTitle}</div>
        </div>
      )}
    </div>
  )
}
