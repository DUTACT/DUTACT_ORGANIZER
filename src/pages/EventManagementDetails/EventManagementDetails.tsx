import Divider from 'src/components/Divider'
import PostTableList from './components/PostTableList'
import EventInformation from './components/EventInformation'
import { Tab, Tabs } from 'src/components/Tab'
import EventRegistrations from './components/EventRegistrations'

export default function EventManagementDetails() {
  return (
    <div className='relative flex h-full flex-col overflow-y-scroll px-6 py-3'>
      <Tabs>
        <Tab label='Tổng quan'>
          <EventInformation />
        </Tab>
        <Tab label='Đơn đăng ký'>
          <EventRegistrations />
        </Tab>
      </Tabs>
      <Divider className='my-4' />
      <div>
        <header className='mb-4 text-2xl font-semibold'>Bài đăng về sự kiện</header>
        <main>
          <PostTableList />
        </main>
      </div>
    </div>
  )
}
