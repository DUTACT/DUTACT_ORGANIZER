export type ParticipationPreview = {
  studentId: number
  studentName: string
  totalCheckIn: number
  certificateStatus?: ParticipationCertificateStatus
}

export type ParticipationCertificateStatusType = 'pending' | 'confirmed' | 'rejected'

export type ParticipationCertificateStatus =
  | ConfirmedParticipationCertificateStatus
  | RejectedParticipationCertificateStatus

export interface ConfirmedParticipationCertificateStatus {
  type: 'confirmed'
}

export interface RejectedParticipationCertificateStatus {
  type: 'rejected'
  reason?: string
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
  studentIds: number[]
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
  studentIds: number[]
  reason?: string
}
