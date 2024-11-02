import moment from 'moment'
import { DATE_TIME_FORMATS } from 'src/constants/common'

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
