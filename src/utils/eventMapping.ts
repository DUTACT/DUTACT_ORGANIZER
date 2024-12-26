import moment from 'moment'
import { DATE_TIME_FORMATS, EVENT_STATUS_MESSAGES } from 'src/constants/common'
import { EventOfOrganizer } from 'src/types/event.type'
import { getStatusMessage } from './common'

export const mapEventOfOrganizer = (event: EventOfOrganizer): EventOfOrganizer => {
  const newStatusType =
    event.status.type === 'approved'
      ? moment().isBefore(moment(event.startAt))
        ? 'commingSoon'
        : moment().isBefore(moment(event.endAt))
          ? 'ongoing'
          : 'ended'
      : event.status.type
  return {
    ...event,
    createdAt: moment(event.createdAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
    startAt: moment(event.startAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
    endAt: moment(event.endAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
    startRegistrationAt: moment(event.startRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
    endRegistrationAt: moment(event.endRegistrationAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON),
    status: {
      ...event.status,
      type: newStatusType,
      label: getStatusMessage(EVENT_STATUS_MESSAGES, newStatusType),
      moderatedAt: moment(event.status.moderatedAt).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)
    }
  }
}

export const getDateTimeStatusOfEvent = (event: EventOfOrganizer): string => {
  if (event.status.type === 'ongoing' || event.status.type === 'ended') {
    const dateEndAt = moment(event.endAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).format(DATE_TIME_FORMATS.DATE_COMMON)
    const timeEndAt = moment(event.endAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).format(
      DATE_TIME_FORMATS.TIME_WITHOUT_SECOND
    )
    return `${event.status.type === 'ongoing' ? 'Sẽ' : 'Đã'} kết thúc vào lúc ${timeEndAt} ngày ${dateEndAt} `
  }
  if (event.status.type === 'commingSoon') {
    const dateStartAt = moment(event.startAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).format(DATE_TIME_FORMATS.DATE_COMMON)
    const timeStartAt = moment(event.startAt, DATE_TIME_FORMATS.DATE_TIME_COMMON).format(
      DATE_TIME_FORMATS.TIME_WITHOUT_SECOND
    )
    return `Sắp diễn ra vào lúc ${timeStartAt} ngày ${dateStartAt} `
  }
  return ''
}
