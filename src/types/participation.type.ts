import { CheckInCode } from './checkInCode.type'

export type ParticipationPreview = {
  studentId: number
  studentName: string
  totalCheckIn: number
  certificateStatus: ParticipationCertificateStatus
}

export type ParticipationCertificateStatusType = ParticipationCertificateStatus['type']

export type ParticipationCertificateStatus =
  | ConfirmedParticipationCertificateStatus
  | RejectedParticipationCertificateStatus
  | PendingParticipationCertificateStatus

export interface ConfirmedParticipationCertificateStatus {
  type: 'confirmed'
}

export interface RejectedParticipationCertificateStatus {
  type: 'rejected'
  reason?: string
}

export interface PendingParticipationCertificateStatus {
  type: 'pending'
}

// Student participation details
export type Participation = {
  studentId: number
  studentName: string
  studentAvatarUrl: string
  certificateStatus: ParticipationCertificateStatus
  checkIns: ParticipationCheckIn[]
}

export type ParticipationCheckIn = {
  id: number
  checkInTime: string
  checkInCode: CheckInCode
}
