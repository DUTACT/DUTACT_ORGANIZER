import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { getEventOfOrganizerById } from 'src/apis/event'
import { EVENT_STATUS_MESSAGES } from 'src/constants/common'
import { ApiError } from 'src/types/client.type'
import { EventOfOrganizer } from 'src/types/event.type'
import { getStatusMessage } from 'src/utils/common'

interface UseOrganizerEventResult {
  event: EventOfOrganizer | undefined
  error: ApiError | null
  updateEvent: (event: EventOfOrganizer) => void
}

export function useOrganizerEvent(organizerId: number, eventId: number): UseOrganizerEventResult {
  // const [event, setEvent] = useState<EventOfOrganizer | undefined>(undefined)
  const queryClient = useQueryClient()
  const { data: fetchedEvent, error: eventError } = getEventOfOrganizerById(organizerId, eventId)

  const event: EventOfOrganizer | undefined = useMemo(
    () =>
      fetchedEvent
        ? {
            ...fetchedEvent,
            status: {
              ...fetchedEvent.status,
              label: getStatusMessage(EVENT_STATUS_MESSAGES, fetchedEvent.status.type)
            }
          }
        : undefined,
    [fetchedEvent]
  )

  const updateEvent = (updatedEvent: EventOfOrganizer) => {
    queryClient.setQueryData<EventOfOrganizer>(['getEventOfOrganizerById', organizerId, eventId], () => updatedEvent)
  }

  // useEffect(() => {
  //   if (fetchedEvent) {
  //     setEvent({
  //       ...fetchedEvent,
  //       status: {
  //         ...fetchedEvent.status,
  //         label: getStatusMessage(EVENT_STATUS_MESSAGES, fetchedEvent.status.type)
  //       }
  //     })
  //   }
  // }, [fetchedEvent])

  return { event, updateEvent, error: eventError }
}
