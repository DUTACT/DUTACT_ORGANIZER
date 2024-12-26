import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'
import { OptionSelect } from 'src/types/common.type'

export const checkTimeOverlap = (
  start: moment.Moment,
  end: moment.Moment,
  filterStart: moment.Moment = moment(0),
  filterEnd: moment.Moment = moment(0)
): boolean => {
  return (
    (!filterStart.isValid() && !filterEnd.isValid()) ||
    (filterStart.isValid() && !filterEnd.isValid() && end.isAfter(filterStart)) ||
    (!filterStart.isValid() && filterEnd.isValid() && start.isBefore(filterEnd)) ||
    (filterStart.isValid() && filterEnd.isValid() && start.isBefore(filterEnd) && end.isAfter(filterStart))
  )
}

export const timeAgo = (dateString: string) => {
  const targetDate = moment(dateString, DATE_TIME_FORMATS.DATE_TIME_COMMON)
  const now = moment()
  const diffInSeconds = now.diff(targetDate, 'seconds')
  console.log('first', diffInSeconds)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`
  } else if (diffInSeconds < 3600) {
    const minutesAgo = now.diff(targetDate, 'minutes')
    return `${minutesAgo} phút trước`
  } else if (diffInSeconds < 86400) {
    const hoursAgo = now.diff(targetDate, 'hours')
    return `${hoursAgo} giờ trước`
  } else if (diffInSeconds < 604800) {
    const daysAgo = now.diff(targetDate, 'days')
    return `${daysAgo} ngày trước`
  } else {
    return moment(targetDate).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)
  }
}

export const getWeeksForYear = (year: number | undefined) => {
  const currentYear = year || new Date().getFullYear()

  const weeks: OptionSelect[] = []

  const startOfYear = moment(`${currentYear}-01-01`)
  const endOfYear = moment(`${currentYear}-12-31`)

  let startDate = startOfYear.clone().startOf('year').day(1)

  let weekIndex = 1

  while (startDate.year() === currentYear || startDate.isBefore(endOfYear)) {
    const endDate = startDate.clone().add(6, 'days')

    weeks.push({
      label: `Tuần ${weekIndex}: ${startDate.format(DATE_TIME_FORMATS.DATE_COMMON)} - ${endDate.format(DATE_TIME_FORMATS.DATE_COMMON)}`,
      value: startDate.format(DATE_TIME_FORMATS.DATE)
    })

    startDate.add(1, 'week')
    weekIndex++
  }

  return weeks
}

export const getWeekDates = (weekType: 'current' | 'previous') => {
  const now = moment()

  let startOfWeek = now.clone().startOf('week')
  let endOfWeek = now.clone().endOf('week')

  if (weekType === 'previous') {
    startOfWeek = startOfWeek.subtract(1, 'week')
    endOfWeek = endOfWeek.subtract(1, 'week')
  }

  const monday = startOfWeek.add(1, 'day').subtract(2, 'weeks')

  return {
    startDate: monday.startOf('day').format(DATE_TIME_FORMATS.DATE),
    endDate: monday.add(6, 'days').endOf('day').format(DATE_TIME_FORMATS.DATE)
  }
}

export const getFirstDayOfMonth = (year: number, month: number): string => {
  return moment({ year, month: month - 1 })
    .startOf('month')
    .format(DATE_TIME_FORMATS.DATE)
}

export const getLastDayOfMonth = (year: number, month: number): string => {
  return moment({ year, month: month - 1 })
    .endOf('month')
    .format(DATE_TIME_FORMATS.DATE)
}