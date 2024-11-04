import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { getCheckInCodeUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { CheckInCode } from 'src/types/checkInCode.type'

export const getCheckInCodesOfEvent = (eventId: number, options?: UseQueryOptions<CheckInCode[], ApiError>) => {
  return useQuery<CheckInCode[], ApiError>({
    queryKey: ['getCheckInCodes', eventId],
    queryFn: async () => {
      const response = await queryFetch<CheckInCode[]>({
        url: getCheckInCodeUrl(),
        inputParams: {
          eventId
        }
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}
