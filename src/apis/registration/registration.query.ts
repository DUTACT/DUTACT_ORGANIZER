import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { getEventRegistrationCountByDateUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { EventRegistrationCountByDate } from 'src/types/eventRegistration.type'

export const getRegistrationCountByDate = (
  eventId: number,
  options?: UseQueryOptions<EventRegistrationCountByDate[], ApiError>
) => {
  return useQuery<EventRegistrationCountByDate[], ApiError>({
    queryKey: ['getRegistrationCountByDate', eventId],
    queryFn: async () => {
      const response = await queryFetch<EventRegistrationCountByDate[]>({
        url: getEventRegistrationCountByDateUrl(eventId)
      })
      return response
    },
    ...options
  })
}
