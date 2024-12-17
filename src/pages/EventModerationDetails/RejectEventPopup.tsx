import { ChangeEventStatusData, EventOfOrganizer } from 'src/types/event.type'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import { useForm } from 'react-hook-form'
import { rejectEvent } from 'src/apis/event'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { toast } from 'react-toastify'
import { createPortal } from 'react-dom'
import Divider from 'src/components/Divider'
import Input from 'src/components/Input'
import { ERROR_REQUIRED_FIELD } from 'src/constants/validate'
import Button from 'src/components/Button'

interface RejectEventPopupProps {
  event: EventOfOrganizer
  onRejectEvent: (event: EventOfOrganizer) => void
  onClosed: () => void
}

export default function RejectEventPopup({ event, onRejectEvent, onClosed }: RejectEventPopupProps) {
  const { control, handleSubmit } = useForm<{
    reason: string
  }>()

  const { mutate: mutateRejectEvent } = rejectEvent({
    onSuccess: (data: ChangeEventStatusData) => {
      toast.success(SUCCESS_MESSAGE.REJECT_EVENT)
      onRejectEvent({
        ...event,
        status: {
          ...event.status,
          ...data
        }
      })
    },
    onError: (error) => {
      toast.error(error.message)
      onClosed()
    }
  })

  /*   const openPopupRejectEvent = (event: EventOfOrganizer) => {
    dispatch(
      setModalProperties({
        isShow: true,
        title: 'Từ chối sự kiện',
        question: ``,
        moreInfoComponent: (
         
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
 */
  const handleRejectEvent = handleSubmit((data) => {
    mutateRejectEvent({ eventId: event.id, reason: data.reason })
  })

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Từ chối sự kiện</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClosed}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start gap-2'>
            <div className='block flex-1'>
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
            </div>
          </div>
        </div>
        <div className='flex h-footer-popup items-center justify-between px-6 text-sm'>
          {event && (
            <div className='flex items-center gap-1 text-neutral-5'>
              <span className='min-w-fit'>Sự kiện:</span>
              <span className='line-clamp-1 font-semibold'>{event.name}</span>
            </div>
          )}
          <Button
            title='Từ chối'
            type='submit'
            onClick={handleRejectEvent}
            classButton='w-fit rounded-lg border-none bg-neutral-0 px-4 py-[6px] text-base font-medium text-neutral-7 bg-neutral-2 hover:bg-neutral-1 bg-semantic-cancelled/90 hover:bg-semantic-cancelled text-neutral-0'
            classButtonDisabled='cursor-not-allowed opacity-40'
            classLoadingIndicator='text-neutral-7 fill-neutral-7'
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
