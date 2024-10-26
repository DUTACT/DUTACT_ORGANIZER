export const path = {
  home: '/',
  login: '/login',
  event: '/event',
  createEvent: '/event/create',
  user: '/user',
  eventMod: '/event-mod',
  eventModDetails: {
    pattern: '/event-mod/:id',
    link: (id: number) => `/event-mod/${id}`
  }
}
