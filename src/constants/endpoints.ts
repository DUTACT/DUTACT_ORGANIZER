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