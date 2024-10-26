import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { mutationFetch, mutationFormData, queryFetch } from 'src/config/queryClient'
import { BASE_API_URL_ADMIN_EVENT, getEventModerationUrl, getEventUrlOfOrganizer } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ChangeStatusData, EventBody, EventOfOrganizer } from 'src/types/event.type'

export const createEvent = (options?: UseMutationOptions<EventOfOrganizer, ApiError, EventBody>) => {
  return useMutation<EventOfOrganizer, ApiError, EventBody>({
    mutationFn: async ({ organizerId, ...body }) => {
      const response = await mutationFormData<EventOfOrganizer>({
        url: getEventUrlOfOrganizer(organizerId),
        method: 'POST',
        body
      })
      return response
    },
    ...options
  })
}

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

export const getAllEvents = (options?: UseQueryOptions<EventOfOrganizer[], ApiError>) => {
  return useQuery<EventOfOrganizer[], ApiError>({
    queryKey: ['getAllEvents'],
    queryFn: async () => {
      const response = await queryFetch<EventOfOrganizer[]>({
        url: BASE_API_URL_ADMIN_EVENT
      })
      return response
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

export const deleteEvent = (organizerId: number, options?: UseMutationOptions<any, ApiError, number>) => {
  return useMutation<any, ApiError, number>({
    mutationFn: async (eventId: number) => {
      await mutationFetch<any>({
        url: getEventUrlOfOrganizer(organizerId, eventId),
        method: 'DELETE',
        body: undefined
      })
      return eventId
    },
    ...options
  })
}

export const approveEvent = (options?: UseMutationOptions<ChangeStatusData, ApiError, number>) => {
  return useMutation<ChangeStatusData, ApiError, number>({
    mutationFn: async (eventId: number) => {
      const response = await mutationFetch<ChangeStatusData>({
        url: `${BASE_API_URL_ADMIN_EVENT}/${eventId}/approve`,
        method: 'POST'
      })
      return { ...response, eventId }
    },
    ...options
  })
}

export const rejectEvent = (
  options?: UseMutationOptions<ChangeStatusData, ApiError, { eventId: number; reason: string }>
) => {
  return useMutation<ChangeStatusData, ApiError, { eventId: number; reason: string }>({
    mutationFn: async ({ eventId, reason }) => {
      const response = await mutationFetch<ChangeStatusData>({
        url: `${BASE_API_URL_ADMIN_EVENT}/${eventId}/reject`,
        method: 'POST',
        body: {
          reason
        }
      })
      return { ...response, eventId }
    },
    ...options
  })
}
