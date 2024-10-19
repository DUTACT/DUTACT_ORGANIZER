import { EventStatus } from 'src/types/event.type'

export const USER_ROLE = {
  ADMIN: 'ROLE_ADMIN',
  STUDENT_AFFAIRS_OFFICE: 'ROLE_STUDENT_AFFAIRS_OFFICE',
  EVENT_ORGANIZER: 'ROLE_EVENT_ORGANIZER'
}

export const EVENT_STATUS: Record<EventStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối'
}

export const TIMEOUT = {
  TOAST_SHORT: 3000,
  DEBOUNCE: 500,
  NAVIGATE: 1000
}

export const DATE_TIME_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSS',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_COMMON: 'DD/MM/YYYY HH:mm'
}

export const INITIAL_ITEMS_PER_PAGE = 10
