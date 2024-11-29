import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { approveEvent, getEventForModeration, rejectEvent } from 'src/apis/event'
import { getStatusMessage } from 'src/utils/common'
import { ChangeEventStatusData, EventOfOrganizer } from 'src/types/event.type'
import Divider from 'src/components/Divider'
import Tag from 'src/components/Tag'
import moment from 'moment'
import { DATE_TIME_FORMATS, EVENT_STATUS_COLOR_CLASSES, EVENT_STATUS_MESSAGES } from 'src/constants/common'
import Button from 'src/components/Button'
import { toast } from 'react-toastify'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { clearModal, setModalProperties } from 'src/redux/slices/modalConfirm'
import Input from 'src/components/Input'
import { ERROR_REQUIRED_FIELD } from 'src/constants/validate'
import DeleteEventIcon from 'src/assets/icons/i-delete-event.svg?react'

export default function EventModerationDetails() {
  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const eventId = parseInt(id ?? '0', 10)

  const { control, reset, handleSubmit } = useForm<{
    reason: string
  }>()

  const { data: fetchedEvent, error: eventError } = getEventForModeration(eventId)
  const [event, setEvent] = useState<EventOfOrganizer | null>(fetchedEvent ?? null)

  useEffect(() => {
    if (fetchedEvent) {
      setEvent({
        ...fetchedEvent,
        status: {
          ...fetchedEvent.status,
          label: getStatusMessage(EVENT_STATUS_MESSAGES, fetchedEvent.status.type)
        }
      })
    }
  }, [fetchedEvent])

  const { mutate: mutateApproveEvent } = approveEvent({
    onSuccess: (data: ChangeEventStatusData) => {
      toast.success(SUCCESS_MESSAGE.APPROVE_EVENT)
      setEvent(
        event
          ? ({
              ...event,
              status: { type: data.type, label: getStatusMessage(EVENT_STATUS_MESSAGES, data.type) }
            } as EventOfOrganizer)
          : null
      )
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const { mutate: mutateRejectEvent } = rejectEvent({
    onSuccess: (data: ChangeEventStatusData) => {
      toast.success(SUCCESS_MESSAGE.REJECT_EVENT)
      setEvent(
        event
          ? ({
              ...event,
              status: { type: data.type, label: getStatusMessage(EVENT_STATUS_MESSAGES, data.type) }
            } as EventOfOrganizer)
          : null
      )
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const openPopupRejectEvent = (event: EventOfOrganizer) => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Từ chối sự kiện',
        question: `Bạn có chắc chắn muốn từ chối sự kiện ${event.name} diễn ra?`,
        moreInfoComponent: (
          <Input
            name='reason'
            control={control}
            type='text'
            labelName='Lý do từ chối'
            placeholder='Nhập lý do tại đây...'
            showIsRequired
            classNameWrapper='w-full flex-1 mt-4'
            rules={{
              validate: {
                notEmpty: (value = '') => {
                  return value.trim().length > 0 || ERROR_REQUIRED_FIELD
                }
              }
            }}
          />
        ),
        actionConfirm: handleSubmit((data) => handleRejectEvent({ ...data, eventId: event.id })),
        actionCancel: () => {
          reset()
          dispatch(clearModal())
        },
        titleConfirm: 'Từ chối sự kiện',
        titleCancel: 'Quay lại',
        isWarning: true,
        iconComponent: <DeleteEventIcon className='h-[20px] w-[20px]' />
      })
    )
  }

  const handleApproveEvent = (eventId: number) => {
    mutateApproveEvent(eventId)
  }

  const handleRejectEvent = ({ eventId, reason }: { eventId: number; reason: string }) => {
    if (reason) {
      mutateRejectEvent({ eventId, reason })
      dispatch(clearModal())
    }
  }

  if (eventError) {
    return <div>Error: {eventError.message}</div>
  }

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex w-full flex-col p-4'>
      <div className='mb-4 mt-2 flex items-start justify-between'>
        <div className='flex flex-col gap-1'>
          <div className='mb-2 flex items-center justify-start align-middle'>
            <div className='mr-3 text-3xl font-semibold text-neutral-8'>
              {event.name}
              <span className='ml-2 inline-block align-middle'>
                <Tag status={event.status} statusClasses={EVENT_STATUS_COLOR_CLASSES} />
              </span>
            </div>
          </div>
          {event.status.type === 'rejected' && (
            <div className='mb-4 text-semantic-cancelled'>Lý do từ chối: {event.status.reason}</div>
          )}
          <div>
            <div className='flex items-center'>
              <img src={event.organizer.avatarUrl} alt='avatar' className='h-6 w-6 rounded-full' />
              <div className='ml-3'>{event.organizer.name}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-start gap-2'>
          {event.status.type === 'pending' && (
            <Fragment>
              <Button
                className='min-w-[100px] gap-1 text-nowrap rounded-md border-none bg-semantic-secondary/90 py-2 text-neutral-0 outline-none hover:bg-semantic-secondary focus:border-none focus:outline-none'
                title='Duyệt'
                onClick={() => handleApproveEvent(event.id)}
              ></Button>
              <Button
                className='hover:bg-semantic-danger min-w-[100px] gap-1 text-nowrap rounded-md border-none bg-semantic-cancelled/90 py-2 text-neutral-0 outline-none focus:border-none focus:outline-none'
                title='Từ chối'
                onClick={() => openPopupRejectEvent(event)}
              ></Button>
            </Fragment>
          )}
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
          <div className='whitespace-pre-wrap'>{event.content}</div>
        </div>
      </div>
    </div>
  )
}
