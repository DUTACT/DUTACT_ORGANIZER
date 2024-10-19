import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { mutationFetch, mutationFormData, queryFetch } from 'src/config/queryClient'
import { BASE_EVENT_URL } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ChangeStatusData, EventBody, EventOfOrganizer, EventStatus } from 'src/types/event.type'

export const createEvent = (options?: UseMutationOptions<EventOfOrganizer, ApiError, EventBody>) => {
  return useMutation<EventOfOrganizer, ApiError, EventBody>({
    mutationFn: async (body) => {
      const response = await mutationFormData<EventOfOrganizer>({
        url: BASE_EVENT_URL,
        method: 'POST',
        body
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
        url: BASE_EVENT_URL
      })
      return response
    },
    ...options
  })
}

export const deleteEvent = (options?: UseMutationOptions<any, ApiError, number>) => {
  return useMutation<any, ApiError, number>({
    mutationFn: async (eventId: number) => {
      await mutationFetch<any>({
        url: `${BASE_EVENT_URL}/${eventId}`,
        method: 'DELETE',
        body: undefined
      })
      return eventId
    },
    ...options
  })
}

export const changeStatusOfEvent = (options?: UseMutationOptions<any, ApiError, ChangeStatusData>) => {
  return useMutation<any, ApiError, ChangeStatusData>({
    mutationFn: async (data: ChangeStatusData) => {
      await mutationFetch<any>({
        url: `${BASE_EVENT_URL}/${data.eventId}/status`,
        method: 'PUT',
        body: { type: data.type }
      })
      return data
    },
    ...options
  })
}
