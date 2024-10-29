import { useEffect, useState } from 'react'
import { getEventOfOrganizerById } from 'src/apis/event'
import { EVENT_STATUS_MESSAGES } from 'src/constants/common'
import { ApiError } from 'src/types/client.type'
import { EventOfOrganizer } from 'src/types/event.type'
import { getStatusMessage } from 'src/utils/common'

interface UseOrganizerEventResult {
  event: EventOfOrganizer | undefined
  error: ApiError | null
  setEvent: (event: EventOfOrganizer) => void
}

export function useOrganizerEvent(organizerId: number, eventId: number): UseOrganizerEventResult {
  const [event, setEvent] = useState<EventOfOrganizer | undefined>(undefined)

  const { data: fetchedEvent, error: eventError } = getEventOfOrganizerById(organizerId, eventId)

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

  return { event, setEvent, error: eventError }
}
