import { ApiError } from 'src/types/client.type'
import { getOverallStatistics } from 'src/apis/statistics'
import { OverallStatistics } from 'src/types/statistics.type'

interface OverallStatResult {
  overallStat: OverallStatistics | undefined
  isLoading: boolean
  error: ApiError | null
}

export function useOverallStat(): OverallStatResult {
  const { data: overallStat, isLoading, error } = getOverallStatistics()

  return {
    overallStat,
    isLoading,
    error
  }
}
