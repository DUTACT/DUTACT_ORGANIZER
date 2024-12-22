import PostTableList from './components/PostTableList'
import EventInformation from './components/EventInformation'
import CreateOrUpdatePostPopup from './components/CreateOrUpdatePostPopup'
import { useState } from 'react'
import { Tab, Tabs } from 'src/components/Tab'
import EventRegistrations from './components/EventRegistrations'
import { matchPath, useLocation } from 'react-router-dom'
import { path } from 'src/routes/path'
import EventModerationDetails from 'src/pages/EventModerationDetails'
import { useSelector } from 'react-redux'
import { eventPostDetailState } from 'src/redux/store'
import EventPostDetailPopup from './components/EventPostDetailPopup'
import { EventOfOrganizer } from 'src/types/event.type'
import { Post } from 'src/types/post.type'
import CheckInCodeManagement from './components/CheckInCodesManagement'
import ParticipationManagement from './components/ParticipationManagement'
import { useOrganizerEvent } from './hooks/useOrganizerEvent'
import { useEventId } from 'src/hooks/useEventId'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import FeedbackManagement from './components/FeedbackManagement'

export default function EventManagementDetails() {
  const location = useLocation()
  const eventId = useEventId()
  const organizerId = useOrganizerId()
  const { event: orgEvent } = useOrganizerEvent(organizerId, eventId)
  const isEventModDetails = matchPath({ path: path.eventModDetails.pattern, end: true }, location.pathname)

  const { isShowEventPostDetailPopup, event, post } = useSelector(eventPostDetailState)
  const [isShowCreateOrUpdatePostPopup, setIsShowCreateOrUpdatePostPopup] = useState<boolean>(false)
  const [updatedPostId, setUpdatedPostId] = useState<number | undefined>()

  if (!orgEvent) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='relative flex h-full flex-col overflow-y-auto px-6 py-3'>
        {orgEvent?.status.type == 'approved' && (
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
            <Tab label='Phản hồi'>
              <FeedbackManagement />
            </Tab>
            <Tab label='Đơn đăng ký'>
              <EventRegistrations />
            </Tab>
            <Tab label='Thông tin tham gia'>
              <ParticipationManagement />
            </Tab>
            <Tab label='Mã check-in'>
              <CheckInCodeManagement />
            </Tab>
          </Tabs>
        )}
        {orgEvent?.status.type !== 'approved' &&
          (isEventModDetails ? <EventModerationDetails /> : <EventInformation />)}
      </div>
      {isShowCreateOrUpdatePostPopup && (
        <CreateOrUpdatePostPopup
          setIsShowCreateOrUpdatePostPopup={setIsShowCreateOrUpdatePostPopup}
          updatedPostId={updatedPostId}
        />
      )}
      {isShowEventPostDetailPopup && <EventPostDetailPopup event={event as EventOfOrganizer} post={post as Post} />}
    </>
  )
}
