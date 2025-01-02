import { getAllEventsOfOrganizer } from 'src/apis/event'
import EventCard from 'src/components/EventCard'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { mapEventOfOrganizer } from 'src/utils/eventMapping'

export default function OutstandingEvent() {
  const organizerId = useOrganizerId()
  const { data: eventList } = getAllEventsOfOrganizer(organizerId)

  return (
    <div className='col-span-4'>
      <div className='mb-2 text-lg font-semibold'>Sự kiện gần đây</div>
      <div className='flex flex-col gap-2'>
        {eventList &&
          eventList
            .slice(0, Math.min(4, eventList.length))
            .map(mapEventOfOrganizer)
            .map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  )
}
