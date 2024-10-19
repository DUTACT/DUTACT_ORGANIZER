export interface EventOfOrganizer {
  id: number
  name: string
  content: string
  startAt: string
  endAt: string
  startRegistrationAt: string
  endRegistrationAt: string
  coverPhotoUrl: string
  status: {
    type: string
  }
  organizer: {
    id: number
    name: string
    avatarUrl: string
  }
}

export type EventBody = Omit<EventOfOrganizer, 'id' | 'status' | 'organizer'> & {
  organizerId: number
  coverPhoto: File
}
