import { EventStatus } from 'src/types/event.type'

export interface ModeratedEvent {
  id: number
  name: string
  status: EventStatus
  moderatedAt: string
  organizerName: string
}
