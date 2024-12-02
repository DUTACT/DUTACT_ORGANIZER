// account-controller

export const ACCOUNT_URL = {
  LOGIN: '/api/login'
}

// organizer-event-controller

const BASE_API_URL_ORGANIZER_EVENT = '/api/admin/organizers'

export const getEventUrlOfOrganizer = (organizerId: number, eventId?: number) => {
  return eventId
    ? `${BASE_API_URL_ORGANIZER_EVENT}/${organizerId}/events/${eventId}`
    : `${BASE_API_URL_ORGANIZER_EVENT}/${organizerId}/events`
}

export const getCloseEventUrlOfOrganizer = (organizerId: number, eventId: number) => {
  return `${BASE_API_URL_ORGANIZER_EVENT}/${organizerId}/events/${eventId}/close`
}

// admin-event-controller

export const BASE_API_URL_ADMIN_EVENT = '/api/admin/events'

export const getEventModerationUrl = (eventId?: number) => {
  return eventId ? `${BASE_API_URL_ADMIN_EVENT}/${eventId}` : BASE_API_URL_ADMIN_EVENT
}

// admin-post-controller

export const BASE_API_URL_POST = '/api/admin/posts'

export const getPostUrl = (postId?: number) => {
  return postId ? `${BASE_API_URL_POST}/${postId}` : BASE_API_URL_POST
}

// admin-analytics-event
export const BASE_API_URL_ANALYTICS_EVENT_REGISTRATION = '/api/admin/analytics/events'

export const getEventRegistrationCountByDateUrl = (eventId: number) => {
  return `${BASE_API_URL_ANALYTICS_EVENT_REGISTRATION}/${eventId}/registrations`
}

// admin check-in code controller
export const BASE_API_URL_CHECK_IN_CODE = '/api/admin/events/checkin-codes'

export const getCheckInCodeUrl = (id?: string) => {
  return id ? `${BASE_API_URL_CHECK_IN_CODE}/${id}` : BASE_API_URL_CHECK_IN_CODE
}

export const getParticipationsUrl = (eventId: number) => {
  return `/api/admin/events/${eventId}/check-in`
}

export const getParticipationUrl = (eventId: number, studentId: number) => {
  return `/api/admin/events/${eventId}/check-in/${studentId}`
}

// organizer-profile-controller
export const getOrganizerProfileUrl = (organizerId: number) => {
  return `/api/admin/organizer/${organizerId}/profile`
}

export const getChangePasswordUrl = (organizerId: number) => {
  return `/api/admin/organizer/${organizerId}/profile/change-password`
}

// admin-event-participation-controller
export const getConfirmEventParticipationUrl = (eventId: number) => {
  return `/api/admin/events/${eventId}/participation/confirm`
}

export const getRejectEventParticipationUrl = (eventId: number) => {
  return `/api/admin/events/${eventId}/participation/reject`
}

// manage-account-controller
export const getManageAccountsUrl = () => {
  return '/api/admin/manage-accounts'
}

export const getManageAccountUrl = (accountId: number) => {
  return `/api/admin/manage-accounts/${accountId}`
}

export const getManageStudentAccountsUrl = () => {
  return '/api/admin/manage-accounts/students'
}

export const getManageOrganizerAccountsUrl = () => {
  return '/api/admin/manage-accounts/organizers'
}

// HERE map
export const getAutoSuggestUrl = () => {
  return `https://autosuggest.search.hereapi.com/v1/autosuggest`
}
