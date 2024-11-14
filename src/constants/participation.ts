import { ParticipationCertificateStatusType } from 'src/types/participation.type'

export function getParticipationStatusDisplayText(type: ParticipationCertificateStatusType) {
  return type === 'confirmed' ? 'Đã tham gia' : type === 'rejected' ? 'Không tham gia' : 'Chờ xác nhận'
}

export const PARTICIPATION_CONFIRM_ACTIONS_TEXT = {
  CONFIRM: 'Xác nhận tham gia',
  REJECT: 'Xác nhận không tham gia'
}
