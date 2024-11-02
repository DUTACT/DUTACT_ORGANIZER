import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import DUTLogo from 'src/assets/img/dut-logo.jpg'
import { clearEventPostDetailState } from 'src/redux/slices/eventPostDetail'
import { EventOfOrganizer } from 'src/types/event.type'
import { Post } from 'src/types/post.type'
import PostTime from '../PostTime'

interface EventPostDetailPopupProps {
  event: EventOfOrganizer
  post: Post
}

export default function EventPostDetailPopup({ event, post }: EventPostDetailPopupProps) {
  const dispatch = useDispatch()
  return createPortal(
    <div
      className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'
      onClick={() => dispatch(clearEventPostDetailState())}
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
                src={event.organizer.avatarUrl ?? DUTLogo}
                alt='dut-logo'
              />
            </div>
            <div className='block flex-1'>
              <div className='line-clamp-1 text-sm font-semibold text-neutral-7'>{event?.organizer.name}</div>
              <PostTime postedAt={post.postedAt} />
              <div className='mt-3 whitespace-pre-wrap text-sm font-normal text-neutral-7'>{post.content}</div>
              <div className='relative mt-3'>
                <img
                  src={post.coverPhotoUrl}
                  alt='cover-photo'
                  className='h-full max-h-96 w-auto max-w-full rounded-md border border-neutral-300 object-cover'
                />
              </div>
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
