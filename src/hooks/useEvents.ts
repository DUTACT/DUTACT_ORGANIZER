import { ApiError } from 'src/types/client.type'
import { getAllEventsOfOrganizer } from 'src/apis/event'
import { EventInformationForCalendar, EventOfOrganizer } from 'src/types/event.type'
import { useMemo } from 'react'
import { useOrganizerId } from './useOrganizerId'

interface EventResult {
  events: EventOfOrganizer[]
  isLoading: boolean
  error: ApiError | null
  agendaOfEvents: EventInformationForCalendar[]
}

export function useEvents(): EventResult {
  const organizerId = useOrganizerId()

  const { data: events = [], isLoading, error } = getAllEventsOfOrganizer(organizerId)

  const agendaOfEvents: EventInformationForCalendar[] = useMemo(
    () =>
      events.map(({ id, name: title, startAt: start, endAt: end }) => ({
        id: id.toString(),
        title,
        start: new Date(start),
        end: new Date(end)
      })),
    [events]
  )

  return {
    events,
    agendaOfEvents,
    isLoading,
    error
  }
}
