export const path = {
  home: '/',
  login: '/login',
  event: '/event',
  eventDetails: {
    pattern: '/event/:id',
    link: (id: number) => `/event/${id}`
  },
  updateEvent: {
    pattern: '/update-event/:id',
    link: (id: number) => `/update-event/${id}`
  },
  createEvent: '/event/create',
  account: '/account',
  studentAccount: '/account/student',
  organizerAccount: '/account/organizer',
  createOrganizerAccount: '/account/organizer/create',
  eventMod: '/event-mod',
  eventModDetails: {
    pattern: '/event-mod/:id',
    link: (id: number) => `/event-mod/${id}`
  }
}
