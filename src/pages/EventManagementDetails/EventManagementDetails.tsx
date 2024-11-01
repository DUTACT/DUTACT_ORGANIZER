import PostTableList from './components/PostTableList'
import EventInformation from './components/EventInformation'
import CreateOrUpdatePostPopup from './components/CreateOrUpdatePostPopup'
import { useState } from 'react'
import { Tab, Tabs } from 'src/components/Tab'
import EventRegistrations from './components/EventRegistrations'
import { matchPath, useLocation } from 'react-router-dom'
import { path } from 'src/routes/path'
import EventModerationDetails from 'src/pages/EventModerationDetails'

export default function EventManagementDetails() {
  const location = useLocation()
  const isEventModDetails = matchPath({ path: path.eventModDetails.pattern, end: true }, location.pathname)

  const [isShowCreateOrUpdatePostPopup, setIsShowCreateOrUpdatePostPopup] = useState<boolean>(false)
  const [updatedPostId, setUpdatedPostId] = useState<number | undefined>()
  return (
    <>
      <div className='relative flex h-full flex-col overflow-y-auto px-6 py-3'>
        <Tabs>
          <Tab label='Tổng quan'>
            {isEventModDetails && <EventModerationDetails />}
            {!isEventModDetails && <EventInformation />}
          </Tab>
          <Tab label='Bài đăng'>
            <PostTableList
              setIsShowCreateOrUpdatePostPopup={setIsShowCreateOrUpdatePostPopup}
              setUpdatedPostId={setUpdatedPostId}
            />
          </Tab>
          <Tab label='Đơn đăng ký'>
            <EventRegistrations />
          </Tab>
        </Tabs>
      </div>
      {isShowCreateOrUpdatePostPopup && (
        <CreateOrUpdatePostPopup
          setIsShowCreateOrUpdatePostPopup={setIsShowCreateOrUpdatePostPopup}
          updatedPostId={updatedPostId}
        />
      )}
    </>
  )
}
