import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { getParticipationsUrl, getParticipationUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { PageInfo } from 'src/types/pagination.type'
import { Participation, ParticipationPreview } from 'src/types/participation.type'

interface GetParticipationsProps {
  eventId: number
  searchQuery?: string
  page?: number
  pageSize?: number
  options?: UseQueryOptions<PageInfo<ParticipationPreview>, ApiError>
}
export const getParticipationsOfEvent = ({ eventId, searchQuery, page, pageSize, options }: GetParticipationsProps) => {
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

export const getParticipationOfEvent = ({
  eventId,
  studentId,
  options
}: {
  eventId: number
  studentId: number
  options?: UseQueryOptions<Participation, ApiError>
}) => {
  return useQuery<Participation, ApiError>({
    queryKey: ['getParticipationOfEvent', eventId, studentId],
    queryFn: async () => {
      const response = await queryFetch<Participation>({
        url: getParticipationUrl(eventId, studentId)
      })
      return response
    },
    ...options
  })
}
