import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { closeEvent, getEventOfOrganizerById } from 'src/apis/event'
import { getStatusMessage, parseJwt } from 'src/utils/common'
import { EventOfOrganizer } from 'src/types/event.type'
import Divider from 'src/components/Divider'
import Tag from 'src/components/Tag'
import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { ApiError } from 'src/types/client.type'
import Button from 'src/components/Button'
import { useDispatch } from 'react-redux'
import { clearModal, setModalProperties } from 'src/redux/slices/modalConfirm'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { toast } from 'react-toastify'

export default function EventManagementDetails() {
  const organizerId = useOrganizerId()
  const eventId = useEventId()
  const dispatch = useDispatch()
  const { event, setEvent, error } = useOrganizerEvent(organizerId, eventId)

  const { mutate: mutateCloseEvent } = closeEvent(organizerId, eventId, {
    onSuccess: (data) => {
      toast.success(SUCCESS_MESSAGE.CLOSE_EVENT_REGISTRATION)
      setEvent(data)
      dispatch(clearModal())
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleCloseRegistration = () => {
    if (!event) {
      return
    }

    if (registrationEnded(event)) {
      toast.error('Sự kiên đã hết hạn đăng ký, không thể đóng đơn đăng ký sự kiện này')
      return
    }

    mutateCloseEvent({})
  }

  const openPopupCloseRegistration = () => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Đóng đơn đăng ký',
        question: 'Bạn có chắc chắn muốn đóng đơn đăng ký sự kiện này?',
        actionConfirm: handleCloseRegistration,
        actionCancel: () => {
          dispatch(clearModal())
        },
        titleConfirm: 'Đóng đơn đăng ký',
        titleCancel: 'Quay lại',
        isWarning: true
      })
    )
  }

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
          <div className='font-medium'>
            Thời gian kết thúc đăng ký
            {registrationEnded(event) && <span className='text-semantic-danger'> (Đã hết hạn đăng ký)</span>}
          </div>
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
      <div className='mt-4'>
        <Button
          className='hover:bg-semantic-danger min-w-[100px] gap-1 text-nowrap rounded-md bg-semantic-cancelled/90 text-neutral-0'
          title='Đóng đơn đăng ký'
          onClick={openPopupCloseRegistration}
        ></Button>
      </div>
    </div>
  )
}

interface UseOrganizerEventResult {
  event: EventOfOrganizer | undefined
  error: ApiError | null
  setEvent: (event: EventOfOrganizer) => void
}

function useOrganizerEvent(organizerId: number, eventId: number): UseOrganizerEventResult {
  const { data: fetchedEvent, error: eventError } = getEventOfOrganizerById(organizerId, eventId)
  const [event, setEvent] = useState<EventOfOrganizer | undefined>(undefined)
  const setEventWrapper = (event: EventOfOrganizer) => {
    setEvent({
      ...event,
      status: {
        ...event.status,
        label: getStatusMessage(event.status.type)
      }
    })
  }

  useEffect(() => {
    if (fetchedEvent) {
      setEventWrapper(fetchedEvent)
    }
  }, [fetchedEvent])

  return { event: event, setEvent: setEventWrapper, error: eventError }
}

function useEventId(): number {
  const { id } = useParams<{ id: string }>()
  return Number(id) ?? 0
}

function useOrganizerId(): number {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  return parseJwt(accessToken)?.organizerId
}

function registrationEnded(event: EventOfOrganizer): boolean {
  return moment(event.endRegistrationAt).isBefore(moment())
}
