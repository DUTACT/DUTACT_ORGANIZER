import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { mutationFetch } from 'src/config/queryClient'
import { getCheckInCodeUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { CheckInCode, CheckInCodeBody } from 'src/types/checkInCode.type'

export const createCheckInCode = (options?: UseMutationOptions<CheckInCode, ApiError, CheckInCodeBody>) => {
  return useMutation<CheckInCode, ApiError, CheckInCodeBody>({
    mutationFn: async (body) => {
      const response = await mutationFetch<CheckInCode>({
        url: getCheckInCodeUrl(),
        method: 'POST',
        body
      })
      return response
    },
    ...options
  })
}

export const deleteCheckInCode = (options?: UseMutationOptions<string, ApiError, string>) => {
  return useMutation<string, ApiError, string>({
    mutationFn: async (id: string) => {
      await mutationFetch<string>({
        url: getCheckInCodeUrl(id),
        method: 'DELETE'
      })
      return id
    },
    ...options
  })
}
