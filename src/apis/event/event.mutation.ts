import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { mutationFetch, mutationFormData, queryFetch } from 'src/config/queryClient'
import { getEventUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ChangeStatusData, EventBody, EventOfOrganizer } from 'src/types/event.type'

export const createEvent = (options?: UseMutationOptions<EventOfOrganizer, ApiError, EventBody>) => {
  return useMutation<EventOfOrganizer, ApiError, EventBody>({
    mutationFn: async ({ organizerId, ...body }) => {
      const response = await mutationFormData<EventOfOrganizer>({
        url: getEventUrl(organizerId),
        method: 'POST',
        body
      })
      return response
    },
    ...options
  })
}

export const getAllEvents = (organizerId: number, options?: UseQueryOptions<EventOfOrganizer[], ApiError>) => {
  return useQuery<EventOfOrganizer[], ApiError>({
    queryKey: ['getAllEvents'],
    queryFn: async () => {
      const response = await queryFetch<EventOfOrganizer[]>({
        url: getEventUrl(organizerId)
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
        url: getEventUrl(organizerId, eventId),
        method: 'DELETE',
        body: undefined
      })
      return eventId
    },
    ...options
  })
}

export const changeStatusOfEvent = (
  organizerId: number,
  options?: UseMutationOptions<any, ApiError, ChangeStatusData>
) => {
  return useMutation<any, ApiError, ChangeStatusData>({
    mutationFn: async (data: ChangeStatusData) => {
      await mutationFetch<any>({
        url: getEventUrl(organizerId, data.eventId),
        method: 'PUT',
        body: { type: data.type }
      })
      return data
    },
    ...options
  })
}
