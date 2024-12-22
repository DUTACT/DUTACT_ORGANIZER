import { createPortal } from 'react-dom'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import { EventOfOrganizer } from 'src/types/event.type'
import PostTime from '../PostTime'
import { Feedback } from 'src/types/feedback.type'
import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'

interface FeedbackDetailPopupProps {
  onClose: () => void
  event: EventOfOrganizer
  feedback: Feedback
}

export default function FeedbackDetailsPopup({ event, feedback, onClose }: FeedbackDetailPopupProps) {
  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={onClose}
    >
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          <div className='flex w-full flex-1 items-start gap-2'>
            <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
              <img
                className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
                src={feedback.studentAvatarUrl ?? DUTLogo}
                alt='dut-logo'
              />
            </div>
            <div className='block flex-1'>
              <div className='line-clamp-1 text-sm font-semibold text-neutral-7'>{feedback.studentName}</div>
              <PostTime postedAt={moment(feedback.postedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)} />
              <div className='mt-3 whitespace-pre-wrap text-sm font-normal text-neutral-7'>{feedback.content}</div>
              {feedback.coverPhotoUrl && (
                <div className='relative mt-3'>
                  <img
                    src={feedback.coverPhotoUrl}
                    alt='cover-photo'
                    className='h-full max-h-96 w-auto max-w-full rounded-md border border-neutral-300 object-cover'
                  />
                </div>
              )}
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
        </div>
      </div>
    </div>,
    document.body
  )
}
