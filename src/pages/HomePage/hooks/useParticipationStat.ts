import { ApiError } from 'src/types/client.type'
import { getRegistrationAndParticipationStat } from 'src/apis/statistics'
import {
  QuantityStatByDate,
  RegistrationAndParticipationQuantityByDate,
  RegistrationAndParticipationQuantityByMonth,
  RegistrationAndParticipationQuantityByWeek
} from 'src/types/statistics.type'
import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'

interface ParticipationResult {
  registrationAndParticipationQuantityByDate: RegistrationAndParticipationQuantityByDate[] | undefined
  registrationAndParticipationQuantityByWeek: RegistrationAndParticipationQuantityByWeek[] | undefined
  registrationAndParticipationQuantityByMonth: RegistrationAndParticipationQuantityByMonth[] | undefined
  isLoading: boolean
  error: ApiError | null
}

interface Props {
  startDate: string
  endDate: string
}

const convertToDateRange = (
  startDate: string,
  endDate: string,
  registrations: QuantityStatByDate[],
  participations: QuantityStatByDate[]
) => {
  const start = moment(startDate)
  const end = moment(endDate)
  const dateRange = []

  for (let current = start.clone(); current.isBefore(end) || current.isSame(end, 'day'); current.add(1, 'day')) {
    const currentDate = current.format(DATE_TIME_FORMATS.DATE)

    const registrationCount = registrations.find((item) => item.date === currentDate)?.count || 0
    const participationCount = participations.find((item) => item.date === currentDate)?.count || 0

    dateRange.push({
      date: currentDate,
      registrations: registrationCount,
      participations: participationCount
    } as RegistrationAndParticipationQuantityByDate)
  }

  return dateRange
}

const convertToWeekRange = (
  startDate: string,
  endDate: string,
  registrations: QuantityStatByDate[],
  participations: QuantityStatByDate[]
) => {
  const start = moment(startDate).startOf('week')
  const end = moment(endDate).endOf('week')
  const weekRange: Record<string, { week: string; registrations: number; participations: number }> = {}

  for (let current = start.clone(); current.isBefore(end) || current.isSame(end, 'day'); current.add(1, 'day')) {
    const weekKey = `${current.startOf('week').format('YYYY-MM-DD')} - ${current.endOf('week').format('YYYY-MM-DD')}`

    const registrationCount =
      registrations.find((item) => item.date === current.format(DATE_TIME_FORMATS.DATE))?.count || 0
    const participationCount =
      participations.find((item) => item.date === current.format(DATE_TIME_FORMATS.DATE))?.count || 0

    if (!weekRange[weekKey]) {
      weekRange[weekKey] = {
        week: weekKey,
        registrations: 0,
        participations: 0
      } as RegistrationAndParticipationQuantityByWeek
    }

    weekRange[weekKey].registrations += registrationCount
    weekRange[weekKey].participations += participationCount
  }

  return Object.values(weekRange)
}

const convertToMonthRange = (
  startDate: string,
  endDate: string,
  registrations: QuantityStatByDate[],
  participations: QuantityStatByDate[]
) => {
  const start = moment(startDate)
  const end = moment(endDate)
  const monthRange: Record<string, { month: string; registrations: number; participations: number }> = {}

  for (let current = start.clone(); current.isBefore(end) || current.isSame(end, 'day'); current.add(1, 'day')) {
    const currentMonth = current.format('YYYY-MM')

    const registrationCount =
      registrations.find((item) => item.date === current.format(DATE_TIME_FORMATS.DATE))?.count || 0
    const participationCount =
      participations.find((item) => item.date === current.format(DATE_TIME_FORMATS.DATE))?.count || 0

    if (!monthRange[currentMonth]) {
      monthRange[currentMonth] = {
        month: currentMonth,
        registrations: 0,
        participations: 0
      } as RegistrationAndParticipationQuantityByMonth
    }

    monthRange[currentMonth].registrations += registrationCount
    monthRange[currentMonth].participations += participationCount
  }

  return Object.values(monthRange)
}

export function useParticipationStat({ startDate, endDate }: Props): ParticipationResult {
  const { data: participationStat, isLoading, error } = getRegistrationAndParticipationStat({ startDate, endDate })

  const registrationAndParticipationQuantityByDate = convertToDateRange(
    startDate,
    endDate,
    participationStat?.registrations || [],
    participationStat?.participations || []
  )

  const registrationAndParticipationQuantityByWeek = convertToWeekRange(
    startDate,
    endDate,
    participationStat?.registrations || [],
    participationStat?.participations || []
  )

  const registrationAndParticipationQuantityByMonth = convertToMonthRange(
    startDate,
    endDate,
    participationStat?.registrations || [],
    participationStat?.participations || []
  )

  return {
    registrationAndParticipationQuantityByDate,
    registrationAndParticipationQuantityByWeek,
    registrationAndParticipationQuantityByMonth,
    isLoading,
    error
  }
}
