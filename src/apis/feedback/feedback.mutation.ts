import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { mutationFetch } from 'src/config/queryClient'
import { getFeedbackUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'

export const deleteFeedback = (options?: UseMutationOptions<number, ApiError, number>) => {
  return useMutation<number, ApiError, number>({
    mutationFn: async (id: number) => {
      await mutationFetch<number>({
        url: getFeedbackUrl(id),
        method: 'DELETE'
      })
      return id
    },
    ...options
  })
}
