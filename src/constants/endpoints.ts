// account-controller

export const ACCOUNT_URL = {
  LOGIN: '/api/login'
}

// organizer-event-controller

const BASE_API_URL_ORGANIZERS = '/api/admin/organizers'

export const getEventUrl = (organizerId: number, eventId?: number) => {
  return eventId
    ? `${BASE_API_URL_ORGANIZERS}/${organizerId}/events/${eventId}`
    : `${BASE_API_URL_ORGANIZERS}/${organizerId}/events`
}
