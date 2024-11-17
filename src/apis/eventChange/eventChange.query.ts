import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { getEventChangeHistoryUrlOfOrganizer } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { EventChange } from 'src/types/eventChange.type'

export const getEventChangeHistory = (
  organizerId: number,
  eventId: number,
  options?: UseQueryOptions<EventChange[], ApiError>
) => {
  return useQuery<EventChange[], ApiError>({
    queryKey: ['getEventChangeHistory', organizerId, eventId],
    queryFn: async () => {
      const response = await queryFetch<EventChange[]>({
        url: getEventChangeHistoryUrlOfOrganizer(organizerId, eventId)
      })
      return response
    },
    ...options
  })
}
