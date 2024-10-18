import Aside from 'src/components/Aside/Aside'
import Header from 'src/components/Header'
import Sidebar from 'src/components/Sidebar'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className='relative h-[100vh] w-[100vw]'>
      <Sidebar />
      {/* Main */}
      <div className='fixed bottom-0 left-sidebar right-aside top-0 h-[100vh] w-main'>
        <Header />
        <div className='mt-header block h-main'>{children}</div>
      </div>
      <Aside />
    </div>
  )
}
