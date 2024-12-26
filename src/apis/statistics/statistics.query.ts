import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { BASE_API_URL_ANALYTICS } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { OverallStatistics, StudentParticipationStat } from 'src/types/statistics.type'

export const getOverallStatistics = (options?: UseQueryOptions<OverallStatistics, ApiError>) => {
  return useQuery<OverallStatistics, ApiError>({
    queryKey: ['getOverallStatistics'],
    queryFn: async () => {
      const response = await queryFetch<OverallStatistics>({
        url: `${BASE_API_URL_ANALYTICS}/organizer/overall-stats`
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}

export const getRegistrationAndParticipationStat = (
  params: {
    startDate: string
    endDate: string
  },
  options?: UseQueryOptions<StudentParticipationStat, ApiError>
) => {
  return useQuery<StudentParticipationStat, ApiError>({
    queryKey: ['getRegistrationAndParticipationStat', params.startDate, params.endDate],
    queryFn: async () => {
      const response = await queryFetch<StudentParticipationStat>({
        url: `${BASE_API_URL_ANALYTICS}/organizer/registrations-and-participations`,
        inputParams: {
          startDate: params.startDate,
          endDate: params.endDate
        }
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}
