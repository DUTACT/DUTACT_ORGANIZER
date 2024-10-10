import Aside from 'src/components/Aside/Aside'
import Header from 'src/components/Header'
import Sidebar from 'src/components/Sidebar'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className='w-[100vw] h-[100vh] relative'>
      <Sidebar />
      {/* Main */}
      <div className='fixed h-[100vh] top-0 bottom-0 left-sidebar right-aside w-main'>
        <Header />
        <div className='mt-header h-main block'>{children}</div>
      </div>
      <Aside />
    </div>
  )
}
