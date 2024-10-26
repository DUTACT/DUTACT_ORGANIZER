export type EventStatus = 'pending' | 'approved' | 'rejected'
export interface EventOfOrganizer {
  id: number
  name: string
  content: string
  createdAt: string
  startAt: string
  endAt: string
  startRegistrationAt: string
  endRegistrationAt: string
  coverPhotoUrl: string
  status: {
    type: EventStatus
    label?: string
    moderatedAt?: string
  }
  organizer: {
    id: number
    name: string
    avatarUrl: string
  }
}

export type EventBody = Omit<EventOfOrganizer, 'id' | 'status' | 'organizer' | 'createdAt'> & {
  coverPhoto: File
}

export interface ChangeStatusData {
  eventId: number
  type: EventStatus
  moderatedAt: string
}

export interface EventFilter {
  organizerIds: number[]
  timeStartFrom: string
  timeStartTo: string
  registrationDeadlineFrom: string
  registrationDeadlineTo: string
  types: EventStatus[]
}
