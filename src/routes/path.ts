export const path = {
  home: '/',
  login: '/login',
  event: '/event',
  updateEvent: {
    pattern: '/update-event/:id',
    link: (id: number) => `/update-event/${id}`
  },
  createEvent: '/event/create',
  user: '/user',
  eventMod: '/event-mod',
  eventModDetails: {
    pattern: '/event-mod/:id',
    link: (id: number) => `/event-mod/${id}`
  }
}
