import moment from 'moment'
import Divider from 'src/components/Divider'
import Tag from 'src/components/Tag'
import { DATE_TIME_FORMATS, EVENT_STATUS_COLOR_CLASSES } from 'src/constants/common'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import { EventOfOrganizer } from 'src/types/event.type'
import { useOrganizerId } from '../../hooks/useOrganizerId'
import { useEventId } from '../../hooks/useEventId'
import { useDispatch } from 'react-redux'
import { closeEvent } from 'src/apis/event'
import { toast } from 'react-toastify'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { clearModal, setModalProperties } from 'src/redux/slices/modalConfirm'
import Button from 'src/components/Button'

export default function EventInformation() {
  const organizerId = useOrganizerId()
  const eventId = useEventId()
  const dispatch = useDispatch()
  const { event, setEvent, error } = useOrganizerEvent(organizerId, eventId)

  const registrationEnded = (event: EventOfOrganizer): boolean => moment(event.endRegistrationAt).isBefore(moment())

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
        titleCancel: 'Quay lại'
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
    <div className='flex w-full flex-col'>
      <div className='mb-4 mt-2'>
        <div className='mb-2 flex items-center justify-start align-middle'>
          <div className='mr-3 text-3xl font-semibold text-neutral-8'>
            {event.name}
            <div className='ml-2 inline-block align-middle'>
              <Tag status={event.status} className='px-2' statusClasses={EVENT_STATUS_COLOR_CLASSES} />
            </div>
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
          <div className='flex flex-col items-start gap-2'>
            <span>{moment(event.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}</span>
            {!registrationEnded(event) && (
              <Button
                className='min-w-[100px] gap-1 text-nowrap rounded-md bg-semantic-secondary/90 px-3 py-1 text-neutral-0 outline-none hover:bg-semantic-secondary focus:outline-none'
                title='Đóng đơn đăng ký sớm'
                onClick={openPopupCloseRegistration}
              />
            )}
          </div>
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