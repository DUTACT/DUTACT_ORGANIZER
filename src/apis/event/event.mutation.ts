import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { mutationFetch, mutationFormData } from 'src/config/queryClient'
import {
  BASE_API_URL_ADMIN_EVENT,
  getCloseEventUrlOfOrganizer,
  getEventModerationUrl,
  getEventUrlOfOrganizer
} from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ChangeEventStatusData, EventBody, EventOfOrganizer } from 'src/types/event.type'

export const createEvent = (
  organizerId: number,
  options?: UseMutationOptions<EventOfOrganizer, ApiError, EventBody>
) => {
  return useMutation<EventOfOrganizer, ApiError, EventBody>({
    mutationFn: async (body) => {
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

export const deleteEvent = (organizerId: number, options?: UseMutationOptions<any, ApiError, number>) => {
  return useMutation<number, ApiError, number>({
    mutationFn: async (eventId: number) => {
      await mutationFetch<number>({
        url: getEventUrlOfOrganizer(organizerId, eventId),
        method: 'DELETE'
      })
      return eventId
    },
    ...options
  })
}

export const approveEvent = (options?: UseMutationOptions<ChangeEventStatusData, ApiError, number>) => {
  return useMutation<ChangeEventStatusData, ApiError, number>({
    mutationFn: async (eventId: number) => {
      const response = await mutationFetch<ChangeEventStatusData>({
        baseURL: getEventModerationUrl(eventId),
        url: 'approve',
        method: 'POST'
      })
      return { ...response, eventId }
    },
    ...options
  })
}

export const rejectEvent = (
  options?: UseMutationOptions<ChangeEventStatusData, ApiError, { eventId: number; reason: string }>
) => {
  return useMutation<ChangeEventStatusData, ApiError, { eventId: number; reason: string }>({
    mutationFn: async ({ eventId, reason }) => {
      const response = await mutationFetch<ChangeEventStatusData>({
        baseURL: getEventModerationUrl(eventId),
        url: 'reject',
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

export const updateEvent = (
  organizerId: number,
  eventId: number,
  options?: UseMutationOptions<EventOfOrganizer, ApiError, Partial<EventBody>>
) => {
  return useMutation<EventOfOrganizer, ApiError, Partial<EventBody>>({
    mutationFn: async (body) => {
      const response = await mutationFormData<EventOfOrganizer>({
        url: getEventUrlOfOrganizer(organizerId, eventId),
        method: 'PATCH',
        body
      })
      return response
    },
    ...options
  })
}

export const closeEvent = (
  organizerId: number,
  eventId: number,
  options?: UseMutationOptions<EventOfOrganizer, ApiError, Partial<EventBody>>
) => {
  return useMutation<EventOfOrganizer, ApiError, Partial<EventBody>>({
    mutationFn: async () => {
      try {
        const response = await mutationFetch<EventOfOrganizer>({
          url: getCloseEventUrlOfOrganizer(organizerId, eventId),
          method: 'POST'
        })
        return response
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    ...options
  })
}
