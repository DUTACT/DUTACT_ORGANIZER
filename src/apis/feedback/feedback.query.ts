import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { getFeedbackUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { Feedback } from 'src/types/feedback.type'

export const getFeedbacksOfEvent = (eventId: number, options?: UseQueryOptions<Feedback[], ApiError>) => {
  return useQuery<Feedback[], ApiError>({
    queryKey: ['getFeedbacks', eventId],
    queryFn: async () => {
      const response = await queryFetch<Feedback[]>({
        url: getFeedbackUrl(),
        inputParams: {
          eventId
        }
      })
      return response.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}
