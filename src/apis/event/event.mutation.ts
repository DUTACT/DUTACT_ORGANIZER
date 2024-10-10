import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { mutationFormData } from 'src/config/queryClient'
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
