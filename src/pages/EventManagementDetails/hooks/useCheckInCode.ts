import { ApiError } from 'src/types/client.type'
import { useEventId } from '../../../hooks/useEventId'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { getCheckInCodesOfEvent } from 'src/apis/checkInCode'
import { createCheckInCode, deleteCheckInCode } from 'src/apis/checkInCode'
import { CheckInCode, CheckInCodeBody } from 'src/types/checkInCode.type'

interface CheckInCodesResult {
  checkInCodes: CheckInCode[]
  isLoading: boolean
  error: ApiError | null
  createCode: UseMutationResult<CheckInCode, ApiError, CheckInCodeBody>
  deleteCode: UseMutationResult<string, ApiError, string>
}

export function useEventCheckInCodes(): CheckInCodesResult {
  const eventId = useEventId()
  const queryClient = useQueryClient()

  const { data: checkInCodes = [], isLoading, error } = getCheckInCodesOfEvent(eventId)

  const createCode = createCheckInCode({
    onSuccess: (data) => {
      queryClient.setQueryData<CheckInCode[]>(['getCheckInCodes', eventId], (oldCodes) => {
        return oldCodes ? [...oldCodes, data] : [data]
      })
    }
  })

  const deleteCode = deleteCheckInCode({
    onSuccess: (data) => {
      queryClient.setQueryData<CheckInCode[]>(['getCheckInCodes', eventId], (oldCodes) => {
        return oldCodes?.filter((code) => code.id !== data)
      })
    }
  })

  return {
    checkInCodes,
    isLoading,
    error,
    createCode,
    deleteCode
  }
}
