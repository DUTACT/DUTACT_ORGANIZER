import { createPortal } from 'react-dom'
import CloseIcon from 'src/assets/icons/i-close.svg?react'
import { useEventId } from 'src/hooks/useEventId'
import { getParticipationOfEvent } from 'src/apis/participation'
import Divider from 'src/components/Divider'
import { getParticipationStatusDisplayText, PARTICIPATION_CONFIRM_ACTIONS_TEXT } from 'src/constants/participation'
import moment from 'moment'
import { CERTIFICATE_STATUS_COLOR_CLASSES, DATE_TIME_FORMATS } from 'src/constants/common'
import { cn } from 'src/lib/tailwind/utils'
import Button from 'src/components/Button'
import { confirmParticipation, rejectParticipation } from 'src/apis/participation/participation.mutation'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Input from 'src/components/Input'
import { useEventCheckInCodes } from '../../hooks/useCheckInCode'
import { rejectParticipationSchema, RejectParticipationSchemaType } from 'src/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface ParticipationDetailsPopupProps {
  onClose: () => void
  onSubmit: () => void
  studentId: number
}

export default function ParticipationDetailsPopup({ onClose, onSubmit, studentId }: ParticipationDetailsPopupProps) {
  const eventId = useEventId()
  const { data: participation, error } = getParticipationOfEvent({ eventId, studentId })
  const { checkInCodes } = useEventCheckInCodes()

  const [actionConfirmation, setActionConfirmation] = useState<ActionConfirmation | null>(null)

  return createPortal(
    <div className='fixed left-0 right-0 top-0 z-10 flex h-[100vh] w-[100vw] items-center justify-center bg-overlay'>
      <div
        className='h-fit max-h-popup w-[600px] max-w-popup overflow-hidden rounded-lg bg-neutral-0 shadow-custom'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex h-header-popup items-center justify-between px-6'>
          <div className='text-base font-medium text-neutral-7'>Chi tiết tham gia</div>
          <div className='-mr-1 cursor-pointer p-1 opacity-70 hover:opacity-100' onClick={onClose}>
            <CloseIcon className='h-[20px] w-[20px]' />
          </div>
        </div>
        <Divider />
        <div className='block max-h-main-popup overflow-auto px-6 py-4'>
          {error && <div>Đã có lỗi xảy ra</div>}
          {!participation && !error && <div>Đang tải dữ liệu</div>}
          {participation && (
            <>
              <div className='flex w-full flex-1 items-start gap-2'>
                <div className='relative h-logo-md min-h-logo-md w-logo-md min-w-logo-md'>
                  <img
                    className='absolute left-0 top-0 mx-auto h-full w-full rounded-full border-[1px] border-gray-200 object-cover'
                    src={participation.studentAvatarUrl}
                    alt='Avatar sinh viên'
                  />
                </div>
                <div className='block flex-1'>
                  <div className='line-clamp-1 text-sm font-semibold text-neutral-7'>{participation.studentName}</div>
                  <div
                    className={cn(
                      'text-sm',
                      'text-neutral-5',
                      CERTIFICATE_STATUS_COLOR_CLASSES[participation.certificateStatus.type].textColor
                    )}
                  >
                    {getParticipationStatusDisplayText(participation.certificateStatus.type)}
                  </div>
                </div>
              </div>
              <div>
                {participation.certificateStatus.type === 'rejected' && (
                  <div className='mt-4 font-semibold'>
                    Lý do từ chối:
                    <span className='font-normal'> {participation.certificateStatus.reason}</span>
                  </div>
                )}
                <div className='mt-4 font-semibold'>
                  Đã check-in: {participation.checkIns.length}/{checkInCodes.length}
                </div>
                {participation.checkIns.length === 0 && (
                  <div className='text-sm text-neutral-5'>Sinh viên này chưa check-in</div>
                )}
                {participation.checkIns.length > 0 && (
                  <table className='mt-2 w-full'>
                    <thead>
                      <tr>
                        <th className='text-left text-sm'>Mã check-in</th>
                        <th className='text-left text-sm'>Thời gian check-in</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participation.checkIns
                        .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
                        .map((checkIn) => (
                          <tr key={checkIn.id}>
                            <td className='text-sm'>{checkIn.checkInCode.title}</td>
                            <td className='text-sm'>
                              {moment(checkIn.checkInTime).format(DATE_TIME_FORMATS.DATE_TIME_COMMON)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
              {participation.certificateStatus.type === 'pending' && !actionConfirmation && (
                <div className='mt-4 flex justify-center gap-2'>
                  <Button
                    title={PARTICIPATION_CONFIRM_ACTIONS_TEXT.REJECT}
                    className='bg-semantic-cancelled/90 text-neutral-0 hover:bg-semantic-cancelled'
                    onClick={() => setActionConfirmation('rejectParticipation')}
                  ></Button>
                  <Button
                    className='bg-semantic-secondary/90 text-neutral-0 hover:bg-semantic-secondary'
                    title={PARTICIPATION_CONFIRM_ACTIONS_TEXT.CONFIRM}
                    onClick={() => setActionConfirmation('confirmParticipation')}
                  ></Button>
                </div>
              )}
              {actionConfirmation === 'confirmParticipation' && (
                <ConfirmConfirmation
                  eventId={eventId}
                  studentId={studentId}
                  onSubmit={() => {
                    setActionConfirmation(null)
                    onSubmit()
                  }}
                  onCancel={() => setActionConfirmation(null)}
                />
              )}
              {actionConfirmation === 'rejectParticipation' && (
                <RejectConfirmation
                  eventId={eventId}
                  studentId={studentId}
                  onSubmit={() => {
                    setActionConfirmation(null)
                    onSubmit()
                  }}
                  onCancel={() => setActionConfirmation(null)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

interface ConfirmConfirmationProps {
  eventId: number
  studentId: number
  onSubmit: () => void
  onCancel: () => void
}

function ConfirmConfirmation({ eventId, studentId, onSubmit, onCancel }: ConfirmConfirmationProps) {
  const { mutate: confirmMutate, isPending: confirmPending } = confirmParticipation(eventId)

  const handleConfirmParticipation = () => {
    confirmMutate(
      {
        type: 'withStudentsIds',
        studentsIds: [studentId]
      },
      {
        onSuccess: () => {
          onSubmit()
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  }

  return (
    <div className='mt-4'>
      <div className='font-semibold'>{PARTICIPATION_CONFIRM_ACTIONS_TEXT.CONFIRM}</div>
      <div className='text-sm text-neutral-5'>Bạn có chắc chắn muốn xác nhận tham gia cho sinh viên này không?</div>
      <div className='mt-4 flex justify-center gap-2'>
        <Button
          className='bg-neutral-2 text-neutral-0 text-neutral-7 hover:bg-neutral-3'
          title='Hủy'
          onClick={onCancel}
        ></Button>
        <Button
          className='bg-semantic-secondary/90 text-neutral-0 hover:bg-semantic-secondary'
          title={confirmPending ? 'Đang xử lý...' : 'Xác nhận'}
          onClick={handleConfirmParticipation}
          disabled={confirmPending}
        ></Button>
      </div>
    </div>
  )
}

interface RejectConfirmationProps {
  eventId: number
  studentId: number
  onSubmit: () => void
  onCancel: () => void
}

function RejectConfirmation({ eventId, studentId, onSubmit, onCancel }: RejectConfirmationProps) {
  const { mutate: rejectMutate, isPending: rejectPending } = rejectParticipation(eventId)

  const { control, handleSubmit } = useForm<RejectParticipationSchemaType>({
    resolver: yupResolver(rejectParticipationSchema)
  })

  const handleRejectParticipation = handleSubmit((data) => {
    rejectMutate(
      {
        type: 'withStudentsIds',
        studentsIds: [studentId],
        reason: data.reason
      },
      {
        onSuccess: () => {
          onSubmit()
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  })

  return (
    <div className='mt-4'>
      <div className='font-semibold'>{PARTICIPATION_CONFIRM_ACTIONS_TEXT.REJECT}</div>
      <div className='text-sm text-neutral-5'>
        Bạn có chắc chắn muốn xác nhận sinh viên này không tham gia sự kiện không?
      </div>
      <Input
        variant='textarea'
        labelName='Lý do'
        type='text'
        placeholder='Nhập lý do'
        control={control}
        name='reason'
      />
      <div className='mt-4 flex justify-center gap-2'>
        <Button
          className='bg-neutral-2 text-neutral-0 text-neutral-7 hover:bg-neutral-3'
          title='Hủy'
          onClick={onCancel}
        ></Button>
        <Button
          className='bg-semantic-cancelled/90 text-neutral-0 hover:bg-semantic-cancelled'
          title={rejectPending ? 'Đang xử lý...' : 'Xác nhận'}
          onClick={handleRejectParticipation}
          disabled={rejectPending}
        ></Button>
      </div>
    </div>
  )
}

type ActionConfirmation = 'confirmParticipation' | 'rejectParticipation'
