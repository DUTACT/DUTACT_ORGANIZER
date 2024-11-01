import PostTableList from './components/PostTableList'
import EventInformation from './components/EventInformation'
import CreatePostPopup from './components/CreatePostPopup/CreatePostPopup'
import { useState } from 'react'
import { Tab, Tabs } from 'src/components/Tab'
import EventRegistrations from './components/EventRegistrations'

export default function EventManagementDetails() {
  const [isShowCreatePostPopup, setIsShowCreatePostPopup] = useState<boolean>(false)
  const [updatedPostId, setUpdatedPostId] = useState<number | undefined>()
  return (
    <>
      <div className='relative flex h-full flex-col overflow-y-auto px-6 py-3'>
        <Tabs>
          <Tab label='Tổng quan'>
            <EventInformation />
          </Tab>
          <Tab label='Bài đăng'>
            <PostTableList setIsShowCreatePostPopup={setIsShowCreatePostPopup} setUpdatedPostId={setUpdatedPostId} />
          </Tab>
          <Tab label='Đơn đăng ký'>
            <EventRegistrations />
          </Tab>
        </Tabs>
        {/* <div>
          <header className='mb-4 text-2xl font-semibold'>Bài đăng về sự kiện</header>
          <main>
          </main>
        </div> */}
      </div>
      {isShowCreatePostPopup && (
        <CreatePostPopup
          setIsShowCreatePostPopup={setIsShowCreatePostPopup}
          updatedPostId={updatedPostId}
          setUpdatedPostId={setUpdatedPostId}
        />
      )}
    </>
  )
}
