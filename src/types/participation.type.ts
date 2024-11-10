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
