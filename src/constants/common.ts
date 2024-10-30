import { EventStatus } from 'src/types/event.type'
import { PostStatus } from 'src/types/post.type'

export const USER_ROLE = {
  ADMIN: 'ROLE_ADMIN',
  STUDENT_AFFAIRS_OFFICE: 'ROLE_STUDENT_AFFAIRS_OFFICE',
  EVENT_ORGANIZER: 'ROLE_EVENT_ORGANIZER'
}

export const EVENT_STATUS_MESSAGES: Record<EventStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối'
}

export const EVENT_STATUS_COLOR_CLASSES: Record<EventStatus, { backgroundColor: string; textColor: string }> = {
  pending: {
    backgroundColor: 'bg-semantic-secondary-background',
    textColor: 'text-semantic-secondary'
  },
  approved: {
    backgroundColor: 'bg-semantic-success-background',
    textColor: 'text-semantic-success'
  },
  rejected: {
    backgroundColor: 'bg-semantic-cancelled-background',
    textColor: 'text-semantic-cancelled'
  }
}

export const POST_STATUS_MESSAGES: Record<PostStatus, string> = {
  published: 'Công khai',
  hidden: 'Đã xóa'
}

export const POST_STATUS_COLOR_CLASSES: Record<PostStatus, { backgroundColor: string; textColor: string }> = {
  published: {
    backgroundColor: 'bg-semantic-success-background',
    textColor: 'text-semantic-success'
  },
  hidden: {
    backgroundColor: 'bg-neutral-4',
    textColor: 'text-neutral-7'
  }
}

export const TIMEOUT = {
  TOAST_SHORT: 3000,
  DEBOUNCE: 500,
  NAVIGATE: 1000
}

export const DATE_TIME_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSS',
  DATE: 'YYYY-MM-DD',
  DATE_WITHOUT_YEAR: 'DD/MM',
  TIME: 'HH:mm:ss',
  DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_COMMON: 'DD/MM/YYYY HH:mm'
}

export const INITIAL_ITEMS_PER_PAGE = 10
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, -1]
