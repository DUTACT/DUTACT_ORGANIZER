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

// Confirm participation criteria
export type ConfirmParticipationCriteria =
  | ConfirmAllParticipation
  | ConfirmParticipationWithStudentsIds
  | ConfirmPaticipationWithCheckedInAtLeast

export type ConfirmParticipationCriteriaType = ConfirmParticipationCriteria['type']

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

// Reject participation criteria
export type RejectParticipationCriterion = RejectAllParticipation | RejectParticipationWithStudentsIds

export type RejectParticipationCriteriaType = RejectParticipationCriterion['type']

export interface RejectAllParticipation {
  type: 'all'
}

export interface RejectParticipationWithStudentsIds {
  type: 'withStudentsIds'
  studentIds: number[]
}
