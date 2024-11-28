import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { BASE_API_URL_ADMIN_EVENT, getEventModerationUrl, getEventUrlOfOrganizer } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { EventOfOrganizer, EventStatus } from 'src/types/event.type'

export const getAllEventsOfOrganizer = (
  organizerId: number,
  options?: UseQueryOptions<EventOfOrganizer[], ApiError>
) => {
  return useQuery<EventOfOrganizer[], ApiError>({
    queryKey: ['getAllEventsOfOrganizer'],
    queryFn: async () => {
      const response = await queryFetch<EventOfOrganizer[]>({
        url: getEventUrlOfOrganizer(organizerId)
      })
      return response
    },
    ...options
  })
}

export const getEventOfOrganizerById = (
  organizerId: number,
  eventId: number,
  options?: UseQueryOptions<EventOfOrganizer, ApiError>
) => {
  return useQuery<EventOfOrganizer, ApiError>({
    queryKey: ['getEventOfOrganizerById', organizerId, eventId],
    queryFn: async () => {
      const response = await queryFetch<EventOfOrganizer>({
        url: getEventUrlOfOrganizer(organizerId, eventId)
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    refetchOnWindowFocus: true,
    ...options
  })
}

export const getAllEvents = (eventStatuses?: EventStatus[],
  options?: UseQueryOptions<EventOfOrganizer[], ApiError>) => {
  return useQuery<EventOfOrganizer[], ApiError>({
    queryKey: ['getAllEvents', eventStatuses],
    queryFn: async () => {
      const response = await queryFetch<EventOfOrganizer[]>({
        url: BASE_API_URL_ADMIN_EVENT
      })
      return response.filter((event) => eventStatuses && eventStatuses.includes(event.status.type))
    },
    ...options
  })
}

export const getEventForModeration = (eventId: number, options?: UseQueryOptions<EventOfOrganizer, ApiError>) => {
  return useQuery<EventOfOrganizer, ApiError>({
    queryKey: ['getEvent', eventId],
    queryFn: async () => {
      const response = await queryFetch<EventOfOrganizer>({
        url: getEventModerationUrl(eventId)
      })
      return response
    },
    ...options
  })
}
