import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { getOrganizerProfileUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { Profile } from 'src/types/account.type'

export const getOrganizerProfile = (organizerId: number, options?: UseQueryOptions<Profile, ApiError>) => {
  return useQuery<Profile, ApiError>({
    queryKey: ['getOrganizerProfile', organizerId],
    queryFn: async () => {
      const response = await queryFetch<Profile>({
        url: getOrganizerProfileUrl(organizerId)
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}
