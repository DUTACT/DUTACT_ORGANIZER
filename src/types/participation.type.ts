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

// Confirm participation criterion
export type ConfirmParticipationCriterion =
  | ConfirmAllParticipation
  | ConfirmParticipationWithStudentsIds
  | ConfirmPaticipationWithCheckedInAtLeast

export type ConfirmParticipationCriterionType = ConfirmParticipationCriterion['type']

export interface ConfirmAllParticipation {
  type: 'all'
}

export interface ConfirmParticipationWithStudentsIds {
  type: 'withStudentsIds'
  studentsIds: number[]
}

export interface ConfirmPaticipationWithCheckedInAtLeast {
  type: 'checkedInAtLeast'
  count: number
}

// Reject participation criterion
export type RejectParticipationCriterion = RejectAllParticipation | RejectParticipationWithStudentsIds

export type RejectParticipationCriterionType = RejectParticipationCriterion['type']

export interface RejectAllParticipation {
  type: 'all'
  reason?: string
}

export interface RejectParticipationWithStudentsIds {
  type: 'withStudentsIds'
  studentsIds: number[]
  reason?: string
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
