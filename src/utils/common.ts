import { EVENT_STATUS } from 'src/constants/common'
import { EventStatus } from 'src/types/event.type'

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export const getStatusMessage = (status: EventStatus): string => {
  return EVENT_STATUS[status]
}
