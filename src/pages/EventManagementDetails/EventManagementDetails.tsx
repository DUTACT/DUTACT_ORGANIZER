import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getEventOfOrganizerById } from 'src/apis/event'
import { getStatusMessage, parseJwt } from 'src/utils/common'
import { EventOfOrganizer } from 'src/types/event.type'
import Divider from 'src/components/Divider'
import Tag from 'src/components/Tag'
import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { ApiError } from 'src/types/client.type'

export default function EventManagementDetails() {
  const { event, error } = useOrganizerEvent()

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col overflow-scroll px-6 pt-3'>
      <div className='mb-4 mt-2'>
        <div className='mb-2 flex items-center justify-start align-middle'>
          <div className='mr-3 text-3xl font-semibold text-neutral-8'>
            {event.name}
            <span className='ml-2 inline-block align-middle'>
              <Tag status={event.status} />
            </span>
          </div>
        </div>
        <div>
          <div className='flex items-center'>
            <img src={event.organizer.avatarUrl} alt='avatar' className='h-6 w-6 rounded-full' />
            <div className='ml-3'>{event.organizer.name}</div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-y-4'>
        <div>
          <div className='font-medium'>Thời gian bắt đầu</div>
          <div>{moment(event.startAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}</div>
        </div>
        <div>
          <div className='font-medium'>Thời gian kết thúc</div>
          <div>{moment(event.endAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}</div>
        </div>
        <div>
          <div className='font-medium'>Thời gian bắt đầu đăng ký</div>
          <div>{moment(event.startRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}</div>
        </div>
        <div>
          <div className='font-medium'>Thời gian kết thúc đăng ký</div>
          <div>{moment(event.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}</div>
        </div>
      </div>
      <Divider className='my-4' />
      <div className='grid grid-cols-2'>
        <div className='mr-6'>
          <div className='font-medium'>Ảnh bìa</div>
          <div className='aspect-h-9 aspect-w-16 relative w-full max-w-96 overflow-hidden rounded-md border border-neutral-4'>
            <img src={event.coverPhotoUrl} alt='cover' className='max-w-96 object-contain' />
          </div>
        </div>
        <div>
          <div className='font-medium'>Thông tin chi tiết</div>
          <div>{event.content}</div>
        </div>
      </div>
    </div>
  )
}

interface UseOrganizerEventResult {
  event: EventOfOrganizer | undefined
  error: ApiError | null
}

function useOrganizerEvent(): UseOrganizerEventResult {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  const organizerId = parseJwt(accessToken)?.organizerId

  const { id } = useParams<{ id: string }>()
  const eventId = parseInt(id ?? '0', 10)

  const { data: fetchedEvent, error: eventError } = getEventOfOrganizerById(organizerId, eventId)
  const [event, setEvent] = useState<EventOfOrganizer | undefined>(undefined)

  useEffect(() => {
    if (fetchedEvent) {
      setEvent({
        ...fetchedEvent,
        status: {
          ...fetchedEvent.status,
          label: getStatusMessage(fetchedEvent.status.type)
        }
      })
    }
  }, [fetchedEvent])

  return { event: event, error: eventError }
}
