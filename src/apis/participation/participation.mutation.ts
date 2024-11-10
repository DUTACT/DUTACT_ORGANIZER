import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { mutationFetch } from 'src/config/queryClient'
import { getConfirmEventParticipationUrl, getRejectEventParticipationUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ConfirmParticipationCriterion, RejectParticipationCriterion } from 'src/types/participation.type'

export const confirmParticipation = async (
  eventId: number,
  options?: UseMutationOptions<void, ApiError, ConfirmParticipationCriterion>
) => {
  return useMutation<void, ApiError, ConfirmParticipationCriterion>({
    mutationFn: async (criteria) => {
      const response = await mutationFetch<void>({
        url: getConfirmEventParticipationUrl(eventId),
        method: 'POST',
        body: criteria
      })

      return response
    },
    ...options
  })
}

export const rejectParticipation = async (
  eventId: number,
  options?: UseMutationOptions<void, ApiError, RejectParticipationCriterion>
) => {
  return useMutation<void, ApiError, RejectParticipationCriterion>({
    mutationFn: async (criteria) => {
      const response = await mutationFetch<void>({
        url: getRejectEventParticipationUrl(eventId),
        method: 'POST',
        body: criteria
      })

      return response
    },
    ...options
  })
}
