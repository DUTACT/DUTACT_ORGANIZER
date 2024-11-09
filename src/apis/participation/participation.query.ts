import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { getParticipationsUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { PageInfo } from 'src/types/pagination.type'
import { ParticipationPreview } from 'src/types/participation.type'

interface GetCheckInProps {
  eventId: number
  searchQuery?: string
  page?: number
  pageSize?: number
  options?: UseQueryOptions<PageInfo<ParticipationPreview>, ApiError>
}
export const getParticipationsOfEvent = ({ eventId, searchQuery, page, pageSize, options }: GetCheckInProps) => {
  return useQuery<PageInfo<ParticipationPreview>, ApiError>({
    queryKey: ['getParticipationsOfEvent', eventId, searchQuery, page, pageSize],
    queryFn: async () => {
      const response = await queryFetch<PageInfo<ParticipationPreview>>({
        url: getParticipationsUrl(eventId),
        inputParams: {
          searchQuery,
          page,
          pageSize
        }
      })
      return response
    },
    ...options
  })
}
