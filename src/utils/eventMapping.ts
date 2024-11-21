import moment from 'moment'
import { DATE_TIME_FORMATS, EVENT_STATUS_MESSAGES } from 'src/constants/common'
import { EventOfOrganizer } from 'src/types/event.type'
import { getStatusMessage } from './common'

export function mapEventOfOrganizer(event: EventOfOrganizer): EventOfOrganizer {
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
