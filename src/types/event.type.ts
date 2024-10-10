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
  organizerId: number
}

export type EventBody = Omit<EventOfOrganizer, 'id' | 'status'> & {
  coverPhoto: File
}
