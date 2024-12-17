// Only pending, rejected, approved are returned from the server, the rest are calculated in the frontend
export type EventStatus = 'pending' | 'rejected' | 'approved' | 'commingSoon' | 'ongoing' | 'ended'
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
    reason?: string
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

export interface ChangeEventStatusData {
  eventId: number
  type: EventStatus
  moderatedAt: string
  reason?: string
}

export interface EventFilter {
  organizerIds: number[]
  timeStartFrom: string
  timeStartTo: string
  registrationDeadlineFrom: string
  registrationDeadlineTo: string
  types: EventStatus[]
}
