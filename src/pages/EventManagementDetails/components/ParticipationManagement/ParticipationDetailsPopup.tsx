import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import { clearEventPostDetailState } from 'src/redux/slices/eventPostDetail'
import { EventOfOrganizer } from 'src/types/event.type'
import { Post } from 'src/types/post.type'
import PostTime from '../PostTime'
import { useOrganizerEvent } from '../../hooks/useOrganizerEvent'
import { useEventId } from 'src/hooks/useEventId'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { getParticipationOfEvent } from 'src/apis/participation'
import Divider from 'src/components/Divider'

interface ParticipationDetailsPopupProps {
  onClose: () => void
  studentId: number
}

export default function ParticipationDetailsPopup({ onClose, studentId }: ParticipationDetailsPopupProps) {
  const eventId = useEventId()
  const organizerId = useOrganizerId()
  const { event } = useOrganizerEvent(organizerId, eventId)
  const { data: participation, error } = getParticipationOfEvent({ eventId, studentId })

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Chi tiết tham gia</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClose}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          {error && <div>Đã có lỗi xảy ra</div>}
          {!participation && !error && <div>Đang tải dữ liệu</div>}
          {participation && (
            <div className='flex w-full flex-1 items-start gap-2'>
              <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
                <img
                  className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
                  src={participation.studentAvatarUrl}
                  alt='Avatar sinh viên'
                />
              </div>
              <div className='block flex-1'>
                <div className='line-clamp-1 text-sm font-semibold text-neutral-7'>{participation.studentName}</div>
                {/* <PostTime postedAt={participation */}
              </div>
            </div>
          )}
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
