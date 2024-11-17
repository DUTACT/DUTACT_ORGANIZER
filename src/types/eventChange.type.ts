export type EventChange = {
  id: number
  details: EventChangeDetails
  changedAt: string
}

export type EventChangeDetails = RegistrationRenewed | RegistrationClosed | EventTimeChanged

export interface BaseEventChangeDetails {
  type: string
}

export interface RegistrationRenewed extends BaseEventChangeDetails {
  type: 'registrationRenewed'
  newEndRegistration: string
  oldEndRegistration: string
}

export interface RegistrationClosed extends BaseEventChangeDetails {
  type: 'registrationClosed'
  newEndRegistration: string
  oldEndRegistration: string
}

export interface EventTimeChanged extends BaseEventChangeDetails {
  type: 'eventTimeChanged'
  startTimeChange?: StartTimeChange
  endTimeChange?: EndTimeChange
  registrationStartChange?: RegistrationStartTimeChange
  registrationEndChange?: RegistrationEndTimeChange
}

export interface StartTimeChange {
  oldStart: string
  newStart: string
}

export interface EndTimeChange {
  oldEnd: string
  newEnd: string
}

export interface RegistrationStartTimeChange {
  oldStartRegistration: string
  newStartRegistration: string
}

export interface RegistrationEndTimeChange {
  oldEndRegistration: string
  newEndRegistration: string
}
