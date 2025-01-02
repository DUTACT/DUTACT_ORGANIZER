import { EventOfOrganizer } from 'src/types/event.type'
import Tag from 'src/components/Tag'
import { EVENT_STATUS_COLOR_CLASSES } from 'src/constants/common'
import { getDateTimeStatusOfEvent } from 'src/utils/eventMapping'
import { useNavigate } from 'react-router-dom'
import { path } from 'src/routes/path'

interface EventCardProps {
  event: EventOfOrganizer
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate()
  return (
    <div
      className='flex h-28 w-full gap-0 overflow-hidden rounded-lg border border-neutral-4 shadow-custom hover:scale-[1.01] hover:cursor-pointer'
      onClick={() => navigate(path.eventDetails.link(event.id))}
    >
      <div className='h-28 w-36 min-w-36'>
        <img className='h-full w-full object-cover' src={event.coverPhotoUrl} alt='cover photo' />
      </div>
      <div className='flex flex-col gap-1 p-2'>
        <Tag status={event.status} statusClasses={EVENT_STATUS_COLOR_CLASSES} className='w-fit px-2 py-0 text-xs' />

        <div className='line-clamp-2 text-sm font-medium'>{event.name}</div>
        <div className='text-xs font-light'>{getDateTimeStatusOfEvent(event)}</div>
      </div>
    </div>
  )
}
