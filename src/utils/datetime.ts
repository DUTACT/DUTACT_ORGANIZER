import moment from 'moment'

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
