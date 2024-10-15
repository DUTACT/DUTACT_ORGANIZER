import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { mutationFormData, queryFetch } from 'src/config/queryClient'
import { EVENT_URL } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { EventBody, EventOfOrganizer } from 'src/types/event.type'

export const createEvent = (options?: UseMutationOptions<EventOfOrganizer, ApiError, EventBody>) => {
  return useMutation<EventOfOrganizer, ApiError, EventBody>({
    mutationFn: async (body) => {
      const response = await mutationFormData<EventOfOrganizer>({
        url: EVENT_URL.CREATE_EVENT,
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
        url: EVENT_URL.CREATE_EVENT
      })
      return response
    },
    ...options
  })
}
